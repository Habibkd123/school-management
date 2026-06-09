import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Class from "@/lib/models/Class";
import { requireAuth } from "@/lib/utils/auth";
import { validate, validationErrorResponse } from "@/lib/utils/validate";

// ─── GET /api/classes ─────────────────────────────────────────────
// Admin: apne school ki saari classes fetch karo
export async function GET(request: NextRequest) {
  try {
    const { schoolId, error } = requireAuth(request, ["school_admin", "teacher"]);
    if (error) return error;
    if (!schoolId) {
      return NextResponse.json({ success: false, message: "Missing school context" }, { status: 400 });
    }

    await connectDB();

    const { searchParams } = new URL(request.url);
    const page    = parseInt(searchParams.get("page")  || "1");
    const limit   = parseInt(searchParams.get("limit") || "50");
    const search  = searchParams.get("search") || "";

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const query: any = { school_id: schoolId };

    if (search) {
      query.$or = [
        { name:    { $regex: search, $options: "i" } },
        { section: { $regex: search, $options: "i" } },
      ];
    }

    const skip  = (page - 1) * limit;
    const total = await Class.countDocuments(query);

    const classes = await Class.find(query)
      .populate("class_teacher_id", "name email")
      .sort({ name: 1, section: 1 })
      .skip(skip)
      .limit(limit)
      .lean();

    return NextResponse.json({
      success: true,
      data: {
        classes,
        pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
      },
    });
  } catch (err) {
    console.error("[CLASSES GET ERROR]", err);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}

// ─── POST /api/classes ────────────────────────────────────────────
// Admin: nayi class create karo
export async function POST(request: NextRequest) {
  try {
    const { schoolId, error } = requireAuth(request, ["school_admin"]);
    if (error) return error;
    if (!schoolId) {
      return NextResponse.json({ success: false, message: "Missing school context" }, { status: 400 });
    }

    await connectDB();

    const body = await request.json();

    const errors = validate(body, {
      name:          { required: true, minLength: 1, maxLength: 50 },
      academic_year: { required: true, minLength: 4, maxLength: 20 },
    });
    if (errors.length > 0) return validationErrorResponse(errors);

    // Duplicate check: same school + name + section + academic_year
    const existing = await Class.findOne({
      school_id:     schoolId,
      name:          body.name.trim(),
      section:       body.section?.trim() || "A",
      academic_year: body.academic_year.trim(),
    });
    if (existing) {
      return NextResponse.json(
        { success: false, message: "Class with this name, section & year already exists" },
        { status: 409 }
      );
    }

    const newClass = await Class.create({
      school_id:        schoolId,
      name:             body.name.trim(),
      section:          body.section?.trim() || "A",
      academic_year:    body.academic_year.trim(),
      capacity:         body.capacity ? Number(body.capacity) : 40,
      class_teacher_id: body.class_teacher_id || null,
    });

    const populated = await Class.findById(newClass._id)
      .populate("class_teacher_id", "name email")
      .lean();

    return NextResponse.json(
      { success: true, message: "Class created successfully", data: { class: populated } },
      { status: 201 }
    );
  } catch (err) {
    console.error("[CLASSES POST ERROR]", err);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}
