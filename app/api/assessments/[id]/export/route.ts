import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { ClassTest, ClassTestMark } from "@/lib/models/index";
import Student from "@/lib/models/Student";
import { requireAuth } from "@/lib/utils/auth";
import * as XLSX from "xlsx";
import mongoose from "mongoose";

// GET — Export test results as Excel
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { schoolId, error } = requireAuth(req, ["school_admin", "teacher"]);
  if (error) return error;
  if (!schoolId) return NextResponse.json({ success: false, message: "No school context" }, { status: 400 });

  try {
    await connectDB();

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ success: false, message: "Invalid test ID" }, { status: 400 });
    }

    const test = await ClassTest.findOne({ _id: id, school_id: schoolId })
      .populate("class_id", "name section")
      .populate("subject_id", "name")
      .lean();
    if (!test) return NextResponse.json({ success: false, message: "Test not found" }, { status: 404 });

    const marks = await ClassTestMark.find({ test_id: id })
      .populate("student_id", "name roll_no admission_no")
      .sort({ rank: 1, marks_obtained: -1 })
      .lean();

    const classInfo = test.class_id as any;
    const subjectInfo = test.subject_id as any;

    const headers = [
      "Rank", "Roll No", "Student Name", "Admission No",
      "Marks Obtained", "Total Marks", "Percentage", "Result", "Remarks",
    ];

    const rows = marks.map((m) => {
      const student = m.student_id as any;
      const pct = test.total_marks > 0
        ? parseFloat(((m.marks_obtained / test.total_marks) * 100).toFixed(1))
        : 0;
      return [
        m.rank ?? "-",
        student?.roll_no || "-",
        student?.name || "-",
        student?.admission_no || "-",
        m.marks_obtained,
        test.total_marks,
        `${pct}%`,
        m.is_pass ? "Pass" : "Fail",
        m.remarks || "",
      ];
    });

    const ws = XLSX.utils.aoa_to_sheet([headers, ...rows]);
    ws["!cols"] = headers.map(() => ({ wch: 18 }));

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Results");

    // Summary sheet
    const passCount = marks.filter((m) => m.is_pass).length;
    const failCount = marks.length - passCount;
    const marksArr = marks.map((m) => m.marks_obtained);
    const avg = marksArr.length ? (marksArr.reduce((a, b) => a + b, 0) / marksArr.length).toFixed(2) : "N/A";

    const summaryData = [
      ["Test", test.title],
      ["Class", `${classInfo?.name || ""} ${classInfo?.section || ""}`.trim()],
      ["Subject", subjectInfo?.name || ""],
      ["Date", new Date(test.test_date).toLocaleDateString()],
      ["Total Marks", test.total_marks],
      ["Passing Marks", test.passing_marks],
      [],
      ["Total Students Appeared", marks.length],
      ["Passed", passCount],
      ["Failed", failCount],
      ["Average Marks", avg],
      ["Highest", marksArr.length ? Math.max(...marksArr) : "N/A"],
      ["Lowest", marksArr.length ? Math.min(...marksArr) : "N/A"],
    ];
    const ws2 = XLSX.utils.aoa_to_sheet(summaryData);
    ws2["!cols"] = [{ wch: 25 }, { wch: 20 }];
    XLSX.utils.book_append_sheet(wb, ws2, "Summary");

    const buffer = XLSX.write(wb, { type: "buffer", bookType: "xlsx" });
    const safeTitle = test.title.replace(/[^a-z0-9]/gi, "_").toLowerCase();

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename="${safeTitle}_results.xlsx"`,
      },
    });
  } catch (err: any) {
    console.error("[GET /api/assessments/[id]/export]", err);
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
