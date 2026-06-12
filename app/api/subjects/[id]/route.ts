import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import { Subject } from "@/lib/models/index";
import { requireAuth } from "@/lib/utils/auth";
import mongoose from "mongoose";

type RouteParams = { params: Promise<{ id: string }> };

export async function GET(req: NextRequest, { params }: RouteParams) {
  const { schoolId, error } = requireAuth(req, ["school_admin", "teacher", "super_admin"]);
  if (error) return error;
  const { id } = await params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({ success: false, message: "Invalid subject ID" }, { status: 400 });
  }

  try {
    await connectToDatabase();
    const subject = await Subject.findOne({ _id: id, school_id: schoolId });
    if (!subject) return NextResponse.json({ success: false, message: "Subject not found" }, { status: 404 });
    return NextResponse.json({ success: true, data: subject });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: RouteParams) {
  const { schoolId, error } = requireAuth(req, ["school_admin", "super_admin"]);
  if (error) return error;
  const { id } = await params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({ success: false, message: "Invalid subject ID" }, { status: 400 });
  }

  try {
    await connectToDatabase();
    const body = await req.json();

    // Normalize type field
    if (body.type) {
      body.type = body.type === "Practical" ? "practical" : body.type === "Theory" ? "theory" : body.type;
    }

    const subject = await Subject.findOneAndUpdate(
      { _id: id, school_id: schoolId },
      { $set: body },
      { new: true, runValidators: true }
    );
    if (!subject) return NextResponse.json({ success: false, message: "Subject not found" }, { status: 404 });
    return NextResponse.json({ success: true, data: subject });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: RouteParams) {
  const { schoolId, error } = requireAuth(req, ["school_admin", "super_admin"]);
  if (error) return error;
  const { id } = await params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({ success: false, message: "Invalid subject ID" }, { status: 400 });
  }

  try {
    await connectToDatabase();
    const subject = await Subject.findOneAndDelete({ _id: id, school_id: schoolId });
    if (!subject) return NextResponse.json({ success: false, message: "Subject not found" }, { status: 404 });
    return NextResponse.json({ success: true, message: "Subject deleted" });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
