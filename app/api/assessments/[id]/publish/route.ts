import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { ClassTest } from "@/lib/models/index";
import Teacher from "@/lib/models/Teacher";
import { requireAuth } from "@/lib/utils/auth";
import mongoose from "mongoose";

// POST — Publish results for a test
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { schoolId, role, userId, error } = requireAuth(req, ["school_admin", "teacher"]);
  if (error) return error;
  if (!schoolId) return NextResponse.json({ success: false, message: "No school context" }, { status: 400 });

  try {
    await connectDB();

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ success: false, message: "Invalid test ID" }, { status: 400 });
    }

    const test = await ClassTest.findOne({ _id: id, school_id: schoolId });
    if (!test) return NextResponse.json({ success: false, message: "Test not found" }, { status: 404 });

    // Teachers can only publish their own tests
    if (role === "teacher") {
      const teacherDoc = await Teacher.findOne({ user_id: userId, school_id: schoolId }).select("_id").lean();
      if (!teacherDoc || String(test.teacher_id) !== String(teacherDoc._id)) {
        return NextResponse.json({ success: false, message: "You can only publish your own tests" }, { status: 403 });
      }
    }

    test.is_published = true;
    test.status = "published";
    await test.save();

    // TODO: Phase 2 — notify all students of the class that results are published

    return NextResponse.json({
      success: true,
      message: "Results published successfully",
      data: { is_published: true, status: "published" },
    });
  } catch (err: any) {
    console.error("[POST /api/assessments/[id]/publish]", err);
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
