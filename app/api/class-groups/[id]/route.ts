import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import { ClassGroup, TeacherAssignment, Syllabus } from "@/lib/models/index";
import { requireAuth } from "@/lib/utils/auth";
import mongoose from "mongoose";

// DELETE — remove a class group (and cascade delete teacher assignments using it)
export async function DELETE(req: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const { schoolId, error } = requireAuth(req, ["school_admin", "super_admin"]);
  if (error) return error;

  try {
    await connectToDatabase();
    const groupId = params.id;

    if (!mongoose.Types.ObjectId.isValid(groupId)) {
      return NextResponse.json({ success: false, message: "Invalid Class Group ID" }, { status: 400 });
    }

    // Find and delete the ClassGroup
    const deletedGroup = await ClassGroup.findOneAndDelete({ _id: groupId, school_id: schoolId });
    if (!deletedGroup) {
      return NextResponse.json({ success: false, message: "Class Group not found" }, { status: 404 });
    }

    // Cascade delete: find teacher assignments for this group
    const assignments = await TeacherAssignment.find({ class_group_id: groupId, school_id: schoolId }).lean();
    const assignmentIds = assignments.map(a => a._id);

    if (assignmentIds.length > 0) {
      // Delete Syllabuses for these assignments
      await Syllabus.deleteMany({ teacher_assignment_id: { $in: assignmentIds }, school_id: schoolId });
      // Delete the assignments
      await TeacherAssignment.deleteMany({ _id: { $in: assignmentIds }, school_id: schoolId });
    }

    return NextResponse.json({
      success: true,
      message: "Class Group and all associated teacher assignments removed successfully",
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message || "Server error" }, { status: 500 });
  }
}
