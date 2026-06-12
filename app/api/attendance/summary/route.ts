import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import { Attendance, Timetable } from "@/lib/models/index";
import Class from "@/lib/models/Class";
import Teacher from "@/lib/models/Teacher";
import { requireAuth } from "@/lib/utils/auth";
import mongoose from "mongoose";

export async function GET(req: NextRequest) {
  const { schoolId, role, userId, error } = requireAuth(req, ["school_admin", "teacher", "super_admin"]);
  if (error) return error;

  try {
    await connectToDatabase();

    const url = new URL(req.url);
    const startDateParam = url.searchParams.get("startDate"); // YYYY-MM-DD
    const endDateParam = url.searchParams.get("endDate"); // YYYY-MM-DD
    const type = url.searchParams.get("type") || "student";
    const classId = url.searchParams.get("classId");

    if (!startDateParam || !endDateParam) {
      return NextResponse.json(
        { success: false, message: "startDate and endDate are required" },
        { status: 400 }
      );
    }

    if (type === "student" && !classId) {
      return NextResponse.json(
        { success: false, message: "classId is required for student summary" },
        { status: 400 }
      );
    }

    // Verify teacher assignment for student attendance summary
    if (type === "student" && role === "teacher") {
      const teacher = await Teacher.findOne({ user_id: userId, school_id: schoolId });
      if (!teacher) {
        return NextResponse.json({ success: false, message: "Teacher record not found" }, { status: 403 });
      }
      const classIdsFromTimetable = await Timetable.find({ teacher_id: teacher._id, school_id: schoolId }).distinct("class_id");
      const teacherClassIds = await Class.find({
        school_id: schoolId,
        $or: [
          { class_teacher_id: teacher._id },
          { _id: { $in: classIdsFromTimetable } }
        ]
      }).distinct("_id");

      const hasAccess = teacherClassIds.map(id => id.toString()).includes(classId!);
      if (!hasAccess) {
        return NextResponse.json({ success: false, message: "You are not assigned to this class" }, { status: 403 });
      }
    }

    const startDate = new Date(startDateParam);
    startDate.setUTCHours(0, 0, 0, 0);

    const endDate = new Date(endDateParam);
    endDate.setUTCHours(23, 59, 59, 999);

    const query: any = {
      school_id: schoolId as string,
      date: { $gte: startDate, $lte: endDate },
      type,
    };
    if (type === "student") {
      query.class_id = classId;
    }

    const detail = url.searchParams.get("detail") === "true";
    const recordId = url.searchParams.get("recordId");

    const attendances = await Attendance.find(query).lean();

    if (detail && recordId) {
      const dailyRecords = attendances.map((att: any) => {
        const record = att.records.find((r: any) => r.student_id.toString() === recordId);
        return {
          date: att.date,
          status: record ? record.status : null,
          note: record ? record.note : null,
        };
      }).filter((r: any) => r.status !== null);

      return NextResponse.json({
        success: true,
        data: dailyRecords,
      });
    }

    // Aggregate results by student_id or teacherId
    const summary: Record<string, { present: number; absent: number; late: number; holiday: number; half_day: number }> = {};

    attendances.forEach((att: any) => {
      att.records.forEach((record: any) => {
        const id = record.student_id.toString();
        if (!summary[id]) {
          summary[id] = { present: 0, absent: 0, late: 0, holiday: 0, half_day: 0 };
        }
        
        const status = record.status as keyof typeof summary[string];
        if (summary[id][status] !== undefined) {
          summary[id][status] += 1;
        }
      });
    });

    return NextResponse.json({
      success: true,
      data: summary,
    });
  } catch (err: any) {
    console.error("Attendance Summary Error:", err);
    return NextResponse.json(
      { success: false, message: err.message || "Failed to fetch attendance summary" },
      { status: 500 }
    );
  }
}
