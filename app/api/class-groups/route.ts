import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import { ClassGroup, Class } from "@/lib/models/index";
import Stream from "@/lib/models/Stream";
import Section from "@/lib/models/Section";
import { requireAuth } from "@/lib/utils/auth";
import mongoose from "mongoose";

// Ensure models are registered for populate
const registerModels = () => {
  return [Class.modelName, Stream.modelName, Section.modelName];
};

// GET — list class groups
export async function GET(req: NextRequest) {
  const { schoolId, error } = requireAuth(req, ["school_admin", "teacher", "super_admin", "student", "parent"]);
  if (error) return error;

  try {
    await connectToDatabase();
    registerModels();
    const url = new URL(req.url);
    const academic_year = url.searchParams.get("academic_year");

    const query: any = { school_id: schoolId };
    if (academic_year) query.academic_year = academic_year;

    const groups = await ClassGroup.find(query)
      .populate("classes.class_id", "name class_code")
      .populate("classes.stream_id", "name")
      .populate("classes.section_id", "name")
      .populate({
        path: "sub_groups",
        select: "name classes sub_groups",
        populate: {
          path: "classes.class_id",
          select: "name section"
        }
      })
      .sort({ name: 1 })
      .lean();

    return NextResponse.json({
      success: true,
      data: { groups },
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message || "Server error" }, { status: 500 });
  }
}

// POST — create a new class group
export async function POST(req: NextRequest) {
  const { schoolId, error } = requireAuth(req, ["school_admin", "super_admin"]);
  if (error) return error;

  try {
    await connectToDatabase();
    registerModels();
    const { name, academic_year, classes, sub_groups } = await req.json();

    const hasClasses = classes && Array.isArray(classes) && classes.length > 0;
    const hasSubgroups = sub_groups && Array.isArray(sub_groups) && sub_groups.length > 0;

    if (!name?.trim() || !academic_year?.trim() || (!hasClasses && !hasSubgroups)) {
      return NextResponse.json(
        { success: false, message: "name, academic_year, and either classes or sub_groups are required" },
        { status: 400 }
      );
    }

    // Check for duplicate name in the same academic year and school
    const existing = await ClassGroup.findOne({
      school_id: schoolId,
      academic_year,
      name: { $regex: new RegExp(`^${name.trim()}$`, "i") },
    }).lean();

    if (existing) {
      return NextResponse.json(
        { success: false, message: "A Class Group with this name already exists for this academic year." },
        { status: 409 }
      );
    }

    // Format classes array
    const formattedClasses = hasClasses ? classes.map((c: any) => ({
      class_id: c.class_id,
      stream_id: c.stream_id || null,
      section_id: c.section_id || null,
    })) : [];

    const newGroup = new ClassGroup({
      school_id: schoolId,
      name: name.trim(),
      academic_year,
      classes: formattedClasses,
      sub_groups: sub_groups || [],
      status: "Active",
    });

    await newGroup.save();
    return NextResponse.json({ success: true, data: newGroup }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message || "Server error" }, { status: 500 });
  }
}
