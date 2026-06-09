import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Class from "@/lib/models/Class";
import { requireAuth } from "@/lib/utils/auth";
import { validate, validationErrorResponse } from "@/lib/utils/validate";

type Params = { params: Promise<{ id: string }> };

// ─── GET /api/classes/[id] ────────────────────────────────────────
export async function GET(request: NextRequest, { params }: Params) {
  try {
    const { schoolId, error } = requireAuth(request, ["school_admin", "teacher"]);
    if (error) return error;
    if (!schoolId) {
      return NextResponse.json({ success: false, message: "Missing school context" }, { status: 400 });
    }

    await connectDB();
    const { id } = await params;

    const classDoc = await Class.findOne({ _id: id, school_id: schoolId })
      .populate("class_teacher_id", "name email")
      .lean();

    if (!classDoc) {
      return NextResponse.json({ success: false, message: "Class not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: { class: classDoc } });
  } catch (err) {
    console.error("[CLASS GET ERROR]", err);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}

// ─── PATCH /api/classes/[id] ──────────────────────────────────────
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

    if (body.name !== undefined) {
      const errors = validate(body, { name: { required: true, minLength: 1, maxLength: 50 } });
      if (errors.length > 0) return validationErrorResponse(errors);
    }

    const allowedFields = ["name", "section", "academic_year", "capacity", "class_teacher_id"];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updateData: any = {};
    for (const field of allowedFields) {
      if (body[field] !== undefined) updateData[field] = body[field];
    }

    const updated = await Class.findOneAndUpdate(
      { _id: id, school_id: schoolId },
      { $set: updateData },
      { new: true, runValidators: true }
    ).populate("class_teacher_id", "name email");

    if (!updated) {
      return NextResponse.json({ success: false, message: "Class not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: "Class updated successfully",
      data: { class: updated },
    });
  } catch (err) {
    console.error("[CLASS PATCH ERROR]", err);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}

// ─── DELETE /api/classes/[id] ─────────────────────────────────────
export async function DELETE(request: NextRequest, { params }: Params) {
  try {
    const { schoolId, error } = requireAuth(request, ["school_admin"]);
    if (error) return error;
    if (!schoolId) {
      return NextResponse.json({ success: false, message: "Missing school context" }, { status: 400 });
    }

    await connectDB();
    const { id } = await params;

    const deleted = await Class.findOneAndDelete({ _id: id, school_id: schoolId });

    if (!deleted) {
      return NextResponse.json({ success: false, message: "Class not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Class deleted successfully" });
  } catch (err) {
    console.error("[CLASS DELETE ERROR]", err);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}
