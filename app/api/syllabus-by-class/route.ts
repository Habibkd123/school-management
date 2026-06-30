import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import { TeacherAssignment, Syllabus, SubjectMaster, ClassGroup } from "@/lib/models/index";
import { requireAuth } from "@/lib/utils/auth";
import mongoose from "mongoose";

/**
 * GET /api/syllabus-by-class?class_id=...&subject_name=...
 * Finds the TeacherAssignment for a given class+subject, then returns its syllabus chapters.
 * Used by the homework form to cascade: Class → Subject → Syllabus → Chapter.
 */
export async function GET(req: NextRequest) {
  const { schoolId, error } = requireAuth(req, ["school_admin", "teacher", "super_admin", "student", "parent"]);
  if (error) return error;

  try {
    await connectToDatabase();
    const url = new URL(req.url);
    const class_id = url.searchParams.get("class_id");
    const subject_name = url.searchParams.get("subject_name");

    if (!class_id || !mongoose.Types.ObjectId.isValid(class_id)) {
      return NextResponse.json({ success: false, message: "Valid class_id is required" }, { status: 400 });
    }

    if (!subject_name?.trim()) {
      return NextResponse.json({ success: false, message: "subject_name is required" }, { status: 400 });
    }

    // Find the SubjectMaster whose name matches (case-insensitive)
    const subjectMaster = await SubjectMaster.findOne({
      school_id: schoolId,
      name: { $regex: new RegExp(`^${subject_name.trim()}$`, "i") },
    }).lean();

    if (!subjectMaster) {
      return NextResponse.json({ success: true, data: { chapters: [] } });
    }

    // Find any Class Groups that contain this class
    const matchingGroups = await ClassGroup.find({
      school_id: schoolId,
      "classes.class_id": class_id,
    }).select("_id").lean();
    const groupIds = matchingGroups.map(g => g._id);

    // Find a TeacherAssignment for this class + subject master (either directly or via a class group)
    const assignment = await TeacherAssignment.findOne({
      school_id: schoolId,
      subject_master_id: subjectMaster._id,
      $or: [
        { class_id },
        { class_group_id: { $in: groupIds } }
      ]
    }).lean();

    if (!assignment) {
      return NextResponse.json({ success: true, data: { chapters: [] } });
    }

    // Fetch the syllabus for this assignment
    const syllabus = await Syllabus.findOne({
      school_id: schoolId,
      teacher_assignment_id: assignment._id,
    }).lean();

    return NextResponse.json({
      success: true,
      data: syllabus || { chapters: [] },
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message || "Server error" }, { status: 500 });
  }
}
