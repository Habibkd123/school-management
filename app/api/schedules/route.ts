import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Schedule from "@/lib/models/Schedule";
import { requireAuth } from "@/lib/utils/auth";
import { validate, validationErrorResponse } from "@/lib/utils/validate";

// ─── GET /api/schedules ───────────────────────────────────────────
export async function GET(request: NextRequest) {
  try {
    const { schoolId, error } = requireAuth(request, ["school_admin", "teacher"]);
    if (error) return error;
    if (!schoolId) {
      return NextResponse.json({ success: false, message: "Missing school context" }, { status: 400 });
    }

    await connectDB();

    const { searchParams } = new URL(request.url);
    const page       = parseInt(searchParams.get("page")   || "1");
    const limit      = parseInt(searchParams.get("limit")  || "50");
    const search     = searchParams.get("search") || "";
    const is_active  = searchParams.get("is_active");

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const query: any = { school_id: schoolId };

    if (search) {
      query.$or = [
        { type:        { $regex: search, $options: "i" } },
        { title:       { $regex: search, $options: "i" } },
        { start_time:  { $regex: search, $options: "i" } },
        { day_of_week: { $regex: search, $options: "i" } },
      ];
    }

    if (is_active !== null && is_active !== undefined && is_active !== "") {
      query.is_active = is_active === "true";
    }

    const skip  = (page - 1) * limit;
    const total = await Schedule.countDocuments(query);

    const schedules = await Schedule.find(query)
      .populate("class_id", "name section")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    return NextResponse.json({
      success: true,
      data: {
        schedules,
        pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
      },
    });
  } catch (err) {
    console.error("[SCHEDULES GET ERROR]", err);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}

// ─── POST /api/schedules ──────────────────────────────────────────
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
      start_time: { required: true, minLength: 1 },
      end_time:   { required: true, minLength: 1 },
    });
    if (errors.length > 0) return validationErrorResponse(errors);

    const schedule = await Schedule.create({
      school_id:   schoolId,
      class_id:    body.class_id    || null,
      type:        body.type        || "Class",
      title:       body.title?.trim() || "",
      start_time:  body.start_time.trim(),
      end_time:    body.end_time.trim(),
      day_of_week: body.day_of_week || "",
      is_active:   body.is_active !== undefined ? body.is_active : true,
    });

    const populated = await Schedule.findById(schedule._id)
      .populate("class_id", "name section")
      .lean();

    return NextResponse.json(
      { success: true, message: "Schedule created successfully", data: { schedule: populated } },
      { status: 201 }
    );
  } catch (err) {
    console.error("[SCHEDULES POST ERROR]", err);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}
