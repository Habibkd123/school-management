import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import { Result } from "@/lib/models/index";
import { requireAuth } from "@/lib/utils/auth";

export async function GET(req: NextRequest) {
  const { schoolId, error } = requireAuth(req, ["school_admin", "teacher", "student", "parent", "super_admin"]);
  if (error) return error;

  try {
    await connectToDatabase();
    const url = new URL(req.url);
    const examId = url.searchParams.get("exam_id");
    const studentId = url.searchParams.get("student_id");

    const query: any = { school_id: schoolId };
    if (examId) query.exam_id = examId;
    if (studentId) query.student_id = studentId;

    const results = await Result.find(query)
      .populate("student_id", "name roll_no")
      .populate("subject_id", "name code")
      .populate("exam_id", "name type");

    return NextResponse.json({ success: true, data: { results } });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const { schoolId, error } = requireAuth(req, ["school_admin", "teacher", "super_admin"]);
  if (error) return error;

  try {
    await connectToDatabase();
    const body = await req.json();

    // Support bulk entry: array or single object
    const entries = Array.isArray(body) ? body : [body];

    const results = await Promise.all(entries.map(async (entry) => {
      const { exam_id, student_id, subject_id, marks_obtained, total_marks, passing_marks, grade, remarks } = entry;
      const is_pass = passing_marks ? Number(marks_obtained) >= Number(passing_marks) : undefined;

      return Result.findOneAndUpdate(
        { school_id: schoolId, exam_id, student_id, subject_id },
        {
          $set: {
            school_id: schoolId,
            exam_id, student_id, subject_id,
            marks_obtained: Number(marks_obtained),
            total_marks: Number(total_marks),
            passing_marks: passing_marks ? Number(passing_marks) : undefined,
            grade: grade?.trim(),
            is_pass,
            remarks: remarks?.trim(),
          }
        },
        { upsert: true, new: true }
      );
    }));

    return NextResponse.json({ success: true, data: { results } }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
