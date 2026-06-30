import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { TransportAllocation } from "@/lib/models";
import Class from "@/lib/models/Class";
import mongoose from "mongoose";

const DEFAULT_SCHOOL_ID = new mongoose.Types.ObjectId("65f0a1b2c3d4e5f6a7b8c9d0");

export async function GET(request: Request) {
  try {
    await connectDB();

    const allocations = await TransportAllocation.find({ school_id: DEFAULT_SCHOOL_ID })
      .populate({
        path: "student_id",
        select: "name admission_no class_id",
        populate: { path: "class_id", select: "name section" }
      })
      .populate("route_id", "routeName")
      .populate("bus_id", "busNumber")
      .sort({ createdAt: -1 })
      .lean();

    const transformed = allocations.map((alloc: any) => {
      const student = alloc.student_id;
      const classObj = student?.class_id;
      const className = classObj ? `${classObj.name}${classObj.section ? ` - ${classObj.section}` : ""}` : "N/A";

      return {
        _id: alloc._id,
        id: alloc._id.toString(),
        studentName: student?.name || "Unknown Student",
        studentId: student?._id ? student._id.toString() : "",
        admissionNo: student?.admission_no || "N/A",
        className: className,
        route: alloc.route_id?.routeName || "Unknown",
        route_id: alloc.route_id?._id ? alloc.route_id._id.toString() : "",
        busNumber: alloc.bus_id?.busNumber || "Unknown",
        bus_id: alloc.bus_id?._id ? alloc.bus_id._id.toString() : "",
        pickupStop: alloc.pickupStop,
        status: alloc.status,
        createdAt: alloc.createdAt
      };
    });

    return NextResponse.json({ success: true, data: transformed });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    await connectDB();

    const payload = { ...body };
    if (!payload.bus_id) {
      payload.bus_id = null;
    }

    const newAlloc = await TransportAllocation.create({
      ...payload,
      school_id: DEFAULT_SCHOOL_ID
    });

    return NextResponse.json({ success: true, data: newAlloc }, { status: 201 });
  } catch (error: any) {
    if (error.code === 11000) {
      return NextResponse.json({ success: false, error: "Student is already allocated to a transport route" }, { status: 400 });
    }
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
