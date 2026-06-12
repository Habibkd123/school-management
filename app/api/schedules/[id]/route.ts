import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import { Timetable, Subject } from "@/lib/models/index";
import { requireAuth } from "@/lib/utils/auth";
import mongoose from "mongoose";

type RouteParams = { params: Promise<{ id: string }> };

// PUT: Update schedule/timetable item
export async function PUT(
  req: NextRequest,
  { params }: RouteParams
) {
  const { schoolId, error } = requireAuth(req, ["school_admin", "teacher", "super_admin"]);
  if (error) return error;

  const { id } = await params;

  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ success: false, message: "Invalid schedule ID" }, { status: 400 });
    }

    await connectToDatabase();

    const timetable = await Timetable.findOne({ _id: id, school_id: schoolId as string });
    if (!timetable) {
      return NextResponse.json({ success: false, message: "Schedule not found" }, { status: 404 });
    }

    const body = await req.json();
    const { classId, subject, teacherId, day, startTime, endTime, room, academicYear } = body;

    if (classId) timetable.class_id = new mongoose.Types.ObjectId(classId);
    if (day) timetable.day = day.toLowerCase();
    if (startTime) timetable.start_time = startTime;
    if (endTime) timetable.end_time = endTime;
    if (room !== undefined) timetable.room = room;
    if (academicYear) timetable.academic_year = academicYear;
    if (teacherId) timetable.teacher_id = new mongoose.Types.ObjectId(teacherId);

    if (subject) {
      let subjectDoc = await Subject.findOne({
        school_id: new mongoose.Types.ObjectId(schoolId as string),
        name: new RegExp(`^${subject.trim()}$`, "i"),
      });

      if (!subjectDoc) {
        subjectDoc = await Subject.create({
          school_id: new mongoose.Types.ObjectId(schoolId as string),
          class_id: timetable.class_id,
          name: subject.trim(),
          type: "both",
          full_marks: 100,
          pass_marks: 33,
        });
      }
      timetable.subject_id = subjectDoc._id;
    }

    await timetable.save();

    const populated = await Timetable.findById(timetable._id)
      .populate("class_id", "name section")
      .populate("subject_id", "name")
      .populate("teacher_id", "name photo_url");

    return NextResponse.json({
      success: true,
      message: "Schedule updated successfully",
      data: populated,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message || "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE: Delete a schedule/timetable item
export async function DELETE(
  req: NextRequest,
  { params }: RouteParams
) {
  const { schoolId, error } = requireAuth(req, ["school_admin", "teacher", "super_admin"]);
  if (error) return error;

  const { id } = await params;

  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ success: false, message: "Invalid schedule ID" }, { status: 400 });
    }

    await connectToDatabase();

    const timetable = await Timetable.findOneAndDelete({
      _id: id,
      school_id: schoolId as string,
    });

    if (!timetable) {
      return NextResponse.json({ success: false, message: "Schedule not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: "Schedule deleted successfully",
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message || "Internal server error" },
      { status: 500 }
    );
  }
}
