import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Student from "@/lib/models/Student";
import Class from "@/lib/models/Class";
import { requireAuth } from "@/lib/utils/auth";
import { validate, validationErrorResponse } from "@/lib/utils/validate";

type Params = { params: Promise<{ id: string }> };

// ─── GET /api/students/[id] ───────────────────────────────────────
export async function GET(request: NextRequest, { params }: Params) {
  try {
    const { schoolId, error } = requireAuth(request, ["school_admin", "teacher"]);
    if (error) return error;
    if (!schoolId) {
      return NextResponse.json({ success: false, message: "Missing school context" }, { status: 400 });
    }

    await connectDB();
    const { id } = await params;

    const student = await Student.findOne({ _id: id, school_id: schoolId })
      .populate("class_id", "name section")
      .lean();

    if (!student) {
      return NextResponse.json({ success: false, message: "Student not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: { student } });
  } catch (error) {
    console.error("[STUDENT GET ERROR]", error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}

// ─── PATCH /api/students/[id] ─────────────────────────────────────
export async function PATCH(request: NextRequest, { params }: Params) {
  try {
    const { schoolId, error } = requireAuth(request, ["school_admin"]);
    if (error) return error;
    if (!schoolId) {
      return NextResponse.json({ success: false, message: "Missing school context" }, { status: 400 });
    }

    await connectDB();
    const { id } = await params;
    const body = await request.json();

    // ─── Validate name if provided ────────────────────────────────
    if (body.name !== undefined) {
      const errors = validate(body, { name: { required: true, minLength: 2, maxLength: 100 } });
      if (errors.length > 0) return validationErrorResponse(errors);
    }

    // ─── If class_id changed, verify it belongs to this school ────
    if (body.class_id) {
      const classDoc = await Class.findOne({ _id: body.class_id, school_id: schoolId });
      if (!classDoc) {
        return NextResponse.json(
          { success: false, message: "Class not found in this school" },
          { status: 404 }
        );
      }
    }

    // ─── Only update allowed fields ───────────────────────────────
    const allowedFields = [
      "name", "roll_no", "gender", "dob", "blood_group", "address",
      "phone", "guardian_name", "guardian_phone", "guardian_relation",
      "guardian_email", "class_id", "academic_year", "is_active",
    ];

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updateData: any = {};
    for (const field of allowedFields) {
      if (body[field] !== undefined) updateData[field] = body[field];
    }

    const student = await Student.findOneAndUpdate(
      { _id: id, school_id: schoolId },
      { $set: updateData },
      { new: true, runValidators: true }
    ).populate("class_id", "name section");

    if (!student) {
      return NextResponse.json({ success: false, message: "Student not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: "Student updated successfully",
      data: { student },
    });
  } catch (error) {
    console.error("[STUDENT PATCH ERROR]", error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}

// ─── DELETE /api/students/[id] ────────────────────────────────────
export async function DELETE(request: NextRequest, { params }: Params) {
  try {
    const { schoolId, error } = requireAuth(request, ["school_admin"]);
    if (error) return error;
    if (!schoolId) {
      return NextResponse.json({ success: false, message: "Missing school context" }, { status: 400 });
    }

    await connectDB();
    const { id } = await params;

    // Soft delete (is_active = false) — data preserve karo
    const student = await Student.findOneAndUpdate(
      { _id: id, school_id: schoolId },
      { $set: { is_active: false } },
      { new: true }
    );

    if (!student) {
      return NextResponse.json({ success: false, message: "Student not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: "Student deactivated successfully",
    });
  } catch (error) {
    console.error("[STUDENT DELETE ERROR]", error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}
