import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import Teacher from "@/lib/models/Teacher";
import User from "@/lib/models/User";
import { requireAuth } from "@/lib/utils/auth";
import mongoose from "mongoose";

type RouteParams = { params: Promise<{ id: string }> };

// GET: Fetch a single teacher by ID
export async function GET(
  req: NextRequest,
  { params }: RouteParams
) {
  const { schoolId, error } = requireAuth(req, ["school_admin", "teacher", "super_admin"]);
  if (error) return error;

  const { id } = await params;

  try {

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ success: false, message: "Invalid teacher ID" }, { status: 400 });
    }

    await connectToDatabase();
    
    const teacher = await Teacher.findOne({
      _id: id,
      school_id: schoolId as string,
    })
      .populate("user_id", "name email role is_active")
      .populate("class_id", "name section");

    if (!teacher) {
      return NextResponse.json({ success: false, message: "Teacher not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: teacher });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

// PUT: Update a teacher
export async function PUT(
  req: NextRequest,
  { params }: RouteParams
) {
  const { schoolId, error } = requireAuth(req, ["school_admin", "super_admin"]);
  if (error) return error;

  const { id } = await params;

  try {

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ success: false, message: "Invalid teacher ID" }, { status: 400 });
    }

    await connectToDatabase();

    const body = await req.json();

    // Check if updating password
    if (body.password) {
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/;
      if (body.password.length < 8 || !passwordRegex.test(body.password)) {
        return NextResponse.json({
          success: false,
          message: "Validation failed",
          errors: [
            {
              field: "new_password",
              message: "new_password must contain uppercase, lowercase, and a number"
            }
          ]
        }, { status: 400 });
      }

      const teacher = await Teacher.findOne({ _id: id, school_id: schoolId as string });
      if (!teacher) {
        return NextResponse.json({ success: false, message: "Teacher not found" }, { status: 404 });
      }

      if (teacher.user_id) {
        const user = await User.findById(teacher.user_id);
        if (user) {
          user.password_hash = body.password;
          await user.save();
        }
      }
    }

    const teacher = await Teacher.findOneAndUpdate(
      { _id: id, school_id: schoolId as string },
      { $set: body },
      { new: true, runValidators: true }
    ).populate("class_id", "name section");

    if (!teacher) {
      return NextResponse.json({ success: false, message: "Teacher not found" }, { status: 404 });
    }

    // If class_id is updated, optionally set this teacher as the class teacher of that class
    if (body.class_id) {
      await mongoose.model("Class").findOneAndUpdate(
        { _id: body.class_id, school_id: schoolId },
        { class_teacher_id: teacher._id }
      );
    }

    return NextResponse.json({ success: true, data: teacher });
  } catch (error: any) {
    if (error.code === 11000) {
      return NextResponse.json(
        { success: false, message: "Employee ID already in use" },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { success: false, message: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE: Delete a teacher (or soft delete)
export async function DELETE(
  req: NextRequest,
  { params }: RouteParams
) {
  const { schoolId, error } = requireAuth(req, ["school_admin", "super_admin"]);
  if (error) return error;

  const { id } = await params;

  try {

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ success: false, message: "Invalid teacher ID" }, { status: 400 });
    }

    await connectToDatabase();

    const teacher = await Teacher.findOneAndDelete({
      _id: id,
      school_id: schoolId as string,
    });

    if (!teacher) {
      return NextResponse.json({ success: false, message: "Teacher not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Teacher deleted successfully" });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
