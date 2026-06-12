import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import { Subject } from "@/lib/models/index";
import { requireAuth } from "@/lib/utils/auth";
import mongoose from "mongoose";

// GET: Fetch all subjects for the school
export async function GET(req: NextRequest) {
  const { schoolId, error } = requireAuth(req, ["school_admin", "teacher", "super_admin"]);
  if (error) return error;

  try {
    await connectToDatabase();
    const url = new URL(req.url);
    const classId = url.searchParams.get("class_id");
    const search = url.searchParams.get("search");

    const query: any = { school_id: schoolId };
    if (classId && mongoose.Types.ObjectId.isValid(classId)) {
      query.class_id = classId;
    }
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { code: { $regex: search, $options: "i" } },
      ];
    }

    const subjects = await Subject.find(query).sort({ name: 1 });
    return NextResponse.json({ success: true, data: { subjects } });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message || "Server error" }, { status: 500 });
  }
}

// POST: Create a new subject
export async function POST(req: NextRequest) {
  const { schoolId, error } = requireAuth(req, ["school_admin", "super_admin"]);
  if (error) return error;

  try {
    await connectToDatabase();
    const body = await req.json();
    const { name, code, type, class_id, full_marks, pass_marks } = body;

    if (!name) {
      return NextResponse.json({ success: false, message: "Subject name is required" }, { status: 400 });
    }

    // class_id is required by model — if not provided use a placeholder
    const effectiveClassId = class_id && mongoose.Types.ObjectId.isValid(class_id)
      ? class_id
      : new mongoose.Types.ObjectId();

    const subject = await Subject.create({
      school_id: schoolId as string,
      class_id: effectiveClassId,
      name: name.trim(),
      code: code?.trim().toUpperCase(),
      type: type === "Practical" ? "practical" : "theory",
      full_marks: full_marks ? Number(full_marks) : 100,
      pass_marks: pass_marks ? Number(pass_marks) : 33,
    });

    return NextResponse.json({ success: true, data: subject }, { status: 201 });
  } catch (err: any) {
    if (err.code === 11000) {
      return NextResponse.json({ success: false, message: "A subject with this name already exists for this class" }, { status: 409 });
    }
    return NextResponse.json({ success: false, message: err.message || "Server error" }, { status: 500 });
  }
}
