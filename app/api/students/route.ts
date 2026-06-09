import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Student from "@/lib/models/Student";
import Class from "@/lib/models/Class";
import { requireAuth } from "@/lib/utils/auth";
import { validate, validationErrorResponse } from "@/lib/utils/validate";

// ─── GET /api/students ────────────────────────────────────────────
// Admin: apne school ke saare students fetch karo
// Query params: page, limit, search, class_id, is_active
export async function GET(request: NextRequest) {
  try {
    const { user, schoolId, error } = requireAuth(request, ["school_admin", "teacher"]);
    if (error) return error;
    if (!schoolId) {
      return NextResponse.json({ success: false, message: "Missing school context" }, { status: 400 });
    }

    await connectDB();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const search = searchParams.get("search") || "";
    const class_id = searchParams.get("class_id") || "";
    const is_active = searchParams.get("is_active");

    // ─── Build query ──────────────────────────────────────────────
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const query: any = { school_id: schoolId };

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { admission_no: { $regex: search, $options: "i" } },
        { roll_no: { $regex: search, $options: "i" } },
      ];
    }

    if (class_id) query.class_id = class_id;
    if (is_active !== null && is_active !== undefined && is_active !== "") {
      query.is_active = is_active === "true";
    }

    const skip = (page - 1) * limit;
    const total = await Student.countDocuments(query);

    const students = await Student.find(query)
      .populate("class_id", "name section")
      .sort({ name: 1 })
      .skip(skip)
      .limit(limit)
      .lean();

    return NextResponse.json({
      success: true,
      data: {
        students,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    console.error("[STUDENTS GET ERROR]", error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}

// ─── POST /api/students ───────────────────────────────────────────
// Admin: naya student add karo
export async function POST(request: NextRequest) {
  try {
    const { schoolId, error } = requireAuth(request, ["school_admin"]);
    if (error) return error;
    if (!schoolId) {
      return NextResponse.json({ success: false, message: "Missing school context" }, { status: 400 });
    }

    await connectDB();

    const body = await request.json();

    // ─── Validate ─────────────────────────────────────────────────
    const errors = validate(body, {
      name: { required: true, minLength: 2, maxLength: 100 },
      class_id: { required: true, isMongoId: true },
    });
    if (errors.length > 0) return validationErrorResponse(errors);

    // ─── Check class belongs to this school ───────────────────────
    const classDoc = await Class.findOne({ _id: body.class_id, school_id: schoolId });
    if (!classDoc) {
      return NextResponse.json(
        { success: false, message: "Class not found in this school" },
        { status: 404 }
      );
    }

    // ─── Auto-generate admission number ───────────────────────────
    const count = await Student.countDocuments({ school_id: schoolId });
    const admissionNo = `AD${new Date().getFullYear()}${String(count + 1).padStart(4, "0")}`;

    const student = await Student.create({
      school_id: schoolId,
      class_id: body.class_id,
      name: body.name.trim(),
      roll_no: body.roll_no || null,
      gender: body.gender || null,
      dob: body.dob ? new Date(body.dob) : null,
      blood_group: body.blood_group || null,
      address: body.address || null,
      phone: body.phone || null,
      guardian_name: body.guardian_name || null,
      guardian_phone: body.guardian_phone || null,
      guardian_relation: body.guardian_relation || null,
      guardian_email: body.guardian_email || null,
      admission_date: body.admission_date ? new Date(body.admission_date) : new Date(),
      admission_no: admissionNo,
      academic_year: body.academic_year || `${new Date().getFullYear()}-${new Date().getFullYear() + 1}`,
      is_active: true,
    } as any);

    const populated = await Student.findById(student._id)
      .populate("class_id", "name section")
      .lean();

    return NextResponse.json(
      { success: true, message: "Student added successfully", data: { student: populated } },
      { status: 201 }
    );
  } catch (error) {
    console.error("[STUDENTS POST ERROR]", error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}
