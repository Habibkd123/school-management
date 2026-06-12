import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import { Homework } from "@/lib/models/index";
import { requireAuth } from "@/lib/utils/auth";
import mongoose from "mongoose";

type RouteParams = { params: Promise<{ id: string }> };

// GET: Fetch a single homework by ID
export async function GET(
  req: NextRequest,
  { params }: RouteParams
) {
  const { schoolId, error } = requireAuth(req, ["school_admin", "teacher", "student", "parent", "super_admin"]);
  if (error) return error;

  const { id } = await params;

  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ success: false, message: "Invalid homework ID" }, { status: 400 });
    }

    await connectToDatabase();

    const homework = await Homework.findOne({ _id: id, school_id: schoolId as string })
      .populate("class_id", "name section")
      .populate("subject_id", "name")
      .populate("teacher_id", "name")
      .lean();

    if (!homework) {
      return NextResponse.json({ success: false, message: "Homework not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: homework });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message || "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: RouteParams
) {
  const { schoolId, role, error } = requireAuth(req, ["school_admin", "teacher", "student", "parent", "super_admin"]);
  if (error) return error;

  const { id } = await params;

  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ success: false, message: "Invalid homework ID" }, { status: 400 });
    }

    await connectToDatabase();

    const homework = await Homework.findOne({ _id: id, school_id: schoolId as string });
    if (!homework) {
      return NextResponse.json({ success: false, message: "Homework not found" }, { status: 404 });
    }

    const body = await req.json();
    const { action, title, description, dueDate, studentId, content, grade, feedback } = body;

    if (action === "submit") {
      // Student submission
      if (!studentId || !content) {
        return NextResponse.json({ success: false, message: "studentId and content are required" }, { status: 400 });
      }

      const existingIndex = homework.submissions.findIndex(
        (s) => s.student_id.toString() === studentId
      );

      if (existingIndex > -1) {
        homework.submissions[existingIndex].content = content;
        homework.submissions[existingIndex].submitted_at = new Date();
      } else {
        homework.submissions.push({
          student_id: new mongoose.Types.ObjectId(studentId),
          content,
          submitted_at: new Date(),
        });
      }
    } else if (action === "grade") {
      // Teacher grading
      if (role === "student") {
        return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 403 });
      }
      if (!studentId || !grade) {
        return NextResponse.json({ success: false, message: "studentId and grade are required" }, { status: 400 });
      }

      const existingIndex = homework.submissions.findIndex(
        (s) => s.student_id.toString() === studentId
      );

      if (existingIndex > -1) {
        homework.submissions[existingIndex].grade = grade;
        homework.submissions[existingIndex].feedback = feedback || null;
      } else {
        return NextResponse.json({ success: false, message: "Submission not found" }, { status: 404 });
      }
    } else {
      // General update (Admin/Teacher only)
      if (role === "student") {
        return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 403 });
      }
      if (title) homework.title = title;
      if (description !== undefined) homework.description = description;
      if (dueDate) homework.due_date = new Date(dueDate);
    }

    await homework.save();

    return NextResponse.json({
      success: true,
      message: "Homework updated successfully",
      data: homework,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message || "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE: Delete a homework assignment
export async function DELETE(
  req: NextRequest,
  { params }: RouteParams
) {
  const { schoolId, error } = requireAuth(req, ["school_admin", "teacher", "super_admin"]);
  if (error) return error;

  const { id } = await params;

  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ success: false, message: "Invalid homework ID" }, { status: 400 });
    }

    await connectToDatabase();

    const homework = await Homework.findOneAndDelete({
      _id: id,
      school_id: schoolId as string,
    });

    if (!homework) {
      return NextResponse.json({ success: false, message: "Homework not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: "Homework deleted successfully",
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message || "Internal server error" },
      { status: 500 }
    );
  }
}
