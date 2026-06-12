import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import { Timetable, Subject } from "@/lib/models/index";
import Teacher from "@/lib/models/Teacher";
import { requireAuth } from "@/lib/utils/auth";
import mongoose from "mongoose";

// GET: Fetch all routine/timetable entries for the school, optionally filtered by class
export async function GET(req: NextRequest) {
  const { schoolId, error } = requireAuth(req, ["school_admin", "teacher", "student", "super_admin"]);
  if (error) return error;

  try {
    await connectToDatabase();

    const url = new URL(req.url);
    const classId = url.searchParams.get("classId");
    const teacherId = url.searchParams.get("teacherId");

    const query: any = { school_id: schoolId };
    if (classId) {
      query.class_id = classId;
    }
    if (teacherId) {
      query.teacher_id = teacherId;
    }

    const schedules = await Timetable.find(query)
      .populate("class_id", "name section")
      .populate("subject_id", "name")
      .populate("teacher_id", "name photo_url")
      .sort({ day: 1, start_time: 1 });

    return NextResponse.json({
      success: true,
      data: schedules,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message || "Internal server error" },
      { status: 500 }
    );
  }
}

// POST: Add a new timetable/routine record
export async function POST(req: NextRequest) {
  const { schoolId, error } = requireAuth(req, ["school_admin", "teacher", "super_admin"]);
  if (error) return error;

  try {
    await connectToDatabase();

    const body = await req.json();
    const { classId, subject, teacherId, day, startTime, endTime, room, academicYear = "2026-2027" } = body;

    if (!classId || !subject || !day || !startTime || !endTime) {
      return NextResponse.json(
        { success: false, message: "classId, subject, day, startTime, and endTime are required" },
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
        type: "both",
        full_marks: 100,
        pass_marks: 33,
      });
    }

    // Resolve teacher (find first if teacherId not provided)
    let selectedTeacherId = teacherId;
    if (!selectedTeacherId) {
      const fallbackTeacher = await Teacher.findOne({ school_id: schoolId });
      selectedTeacherId = fallbackTeacher?._id.toString() || new mongoose.Types.ObjectId().toString();
    }

    const timetable = await Timetable.create({
      school_id: new mongoose.Types.ObjectId(schoolId as string),
      class_id: new mongoose.Types.ObjectId(classId),
      subject_id: subjectDoc._id,
      teacher_id: new mongoose.Types.ObjectId(selectedTeacherId),
      day: day.toLowerCase(),
      start_time: startTime,
      end_time: endTime,
      room: room || undefined,
      academic_year: academicYear,
    });

    // Populate ref fields to return to frontend
    const populated = await Timetable.findById(timetable._id)
      .populate("class_id", "name section")
      .populate("subject_id", "name")
      .populate("teacher_id", "name photo_url");

    return NextResponse.json({
      success: true,
      data: populated,
    }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message || "Internal server error" },
      { status: 500 }
    );
  }
}
