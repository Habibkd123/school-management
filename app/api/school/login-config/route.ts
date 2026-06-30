import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import School from "@/lib/models/School";
import { requireAuth } from "@/lib/utils/auth";

// GET — fetch login config for the school
export async function GET(req: NextRequest) {
  const { schoolId, error } = requireAuth(req, ["school_admin", "super_admin"]);
  if (error) return error;

  try {
    await connectToDatabase();
    const school = await School.findById(schoolId).select("login_config").lean();
    if (!school) {
      return NextResponse.json({ success: false, message: "School not found" }, { status: 404 });
    }

    const config = (school as any).login_config ?? { disable_student_login: false, disable_teacher_login: false };
    return NextResponse.json({ success: true, data: config });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message || "Server error" }, { status: 500 });
  }
}

// PUT — update login config (admin only)
export async function PUT(req: NextRequest) {
  const { schoolId, error } = requireAuth(req, ["school_admin", "super_admin"]);
  if (error) return error;

  try {
    await connectToDatabase();
    const body = await req.json();
    const { disable_student_login, disable_teacher_login } = body;

    const update: Record<string, boolean> = {};
    if (typeof disable_student_login === "boolean") update["login_config.disable_student_login"] = disable_student_login;
    if (typeof disable_teacher_login === "boolean") update["login_config.disable_teacher_login"] = disable_teacher_login;

    if (Object.keys(update).length === 0) {
      return NextResponse.json({ success: false, message: "No valid fields to update" }, { status: 400 });
    }

    const school = await School.findByIdAndUpdate(
      schoolId,
      { $set: update },
      { new: true, runValidators: true }
    ).select("login_config").lean();

    if (!school) {
      return NextResponse.json({ success: false, message: "School not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: (school as any).login_config });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message || "Server error" }, { status: 500 });
  }
}
