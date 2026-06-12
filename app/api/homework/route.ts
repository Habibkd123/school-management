import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import { Homework, Subject } from "@/lib/models/index";
import Teacher from "@/lib/models/Teacher";
import { requireAuth } from "@/lib/utils/auth";
import mongoose from "mongoose";

// GET: Fetch homeworks for the logged-in user's school
export async function GET(req: NextRequest) {
  const { schoolId, error } = requireAuth(req, ["school_admin", "teacher", "student", "parent", "super_admin"]);
  if (error) return error;

  try {
    await connectToDatabase();

    const url = new URL(req.url);
    const classId = url.searchParams.get("classId");

    const query: any = { school_id: schoolId };
    if (classId) {
      query.class_id = classId;
    }

    const homeworks = await Homework.find(query)
      .sort({ createdAt: -1 })
      .populate("class_id", "name section")
      .populate("subject_id", "name")
      .populate("teacher_id", "name");

    return NextResponse.json({
      success: true,
      data: homeworks,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message || "Internal server error" },
      { status: 500 }
    );
  }
}

// POST: Create a new homework assignment
export async function POST(req: NextRequest) {
  const { schoolId, userId, role, error } = requireAuth(req, ["school_admin", "teacher", "super_admin"]);
  if (error) return error;

  try {
    await connectToDatabase();

    const body = await req.json();
    const { title, description, classId, subject, dueDate, attachmentUrl } = body;

    if (!title || !classId || !subject || !dueDate) {
      return NextResponse.json(
        { success: false, message: "Title, classId, subject, and dueDate are required" },
        { status: 400 }
      );
    }

    // Resolve or create subject
    let subjectDoc = await Subject.findOne({
      school_id: new mongoose.Types.ObjectId(schoolId as string),
      name: new RegExp(`^${subject.trim()}$`, "i"),
    });

    if (!subjectDoc) {
      subjectDoc = await Subject.create({
        school_id: new mongoose.Types.ObjectId(schoolId as string),
        class_id: new mongoose.Types.ObjectId(classId),
        name: subject.trim(),
        type: "theory",
        full_marks: 100,
        pass_marks: 33,
      });
    }

    // Resolve teacher
    let teacherId = null;
    if (role === "teacher") {
      const teacher = await Teacher.findOne({ user_id: userId, school_id: schoolId });
      if (teacher) teacherId = teacher._id;
    }

    if (!teacherId) {
      const fallbackTeacher = await Teacher.findOne({ school_id: schoolId });
      teacherId = fallbackTeacher?._id || new mongoose.Types.ObjectId();
    }

    const homework = await Homework.create({
      school_id: new mongoose.Types.ObjectId(schoolId as string),
      class_id: new mongoose.Types.ObjectId(classId),
      subject_id: subjectDoc._id,
      teacher_id: teacherId,
      title: title.trim(),
      description: description?.trim(),
      due_date: new Date(dueDate),
      attachment_url: attachmentUrl?.trim() || null,
      submissions: [],
    });

    return NextResponse.json({
      success: true,
      data: homework,
    }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message || "Internal server error" },
      { status: 500 }
    );
  }
}
