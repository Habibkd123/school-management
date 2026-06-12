import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { FeePayment, FeeMaster } from "@/lib/models";
import { requireAuth } from "@/lib/utils/auth";

// Generate a random unique receipt number
function generateReceiptNumber() {
  return "REC-" + Date.now().toString(36).toUpperCase() + "-" + Math.floor(Math.random() * 1000).toString().padStart(3, "0");
}

export async function GET(req: NextRequest) {
  try {
    const { schoolId, error } = requireAuth(req);
    if (error) return error;

    const url = new URL(req.url);
    const student_id = url.searchParams.get("student_id");

    const query: any = { school_id: schoolId };
    if (student_id) query.student_id = student_id;

    await connectDB();
    const payments = await FeePayment.find(query)
      .populate("student_id", "name admission_no roll_no")
      .populate({
        path: "fee_master_id",
        populate: [
          { path: "fee_group_id", select: "name" },
          { path: "fee_type_id", select: "name" }
        ]
      })
      .sort({ transaction_date: -1 });

    return NextResponse.json({ success: true, data: { payments } });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { role, schoolId, error } = requireAuth(req);
    if (error) return error;
    if (role !== "school_admin" && role !== "super_admin") {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }
    if (!schoolId) {
      return NextResponse.json({ success: false, message: "No school context" }, { status: 403 });
    }

    const body = await req.json();
    const { student_id, fee_master_id, amount_paid, payment_method, remarks } = body;

    if (!student_id || !fee_master_id || !amount_paid || !payment_method) {
      return NextResponse.json({ success: false, message: "Missing required fields" }, { status: 400 });
    }

    await connectDB();
    
    // Validate that fee master exists
    const master = await FeeMaster.findOne({ _id: fee_master_id, school_id: schoolId });
    if (!master) {
      return NextResponse.json({ success: false, message: "Invalid Fee Master record" }, { status: 400 });
    }

    const payment = await FeePayment.create({
      school_id: schoolId,
      student_id,
      fee_master_id,
      amount_paid: Number(amount_paid),
      payment_method,
      remarks,
      receipt_number: generateReceiptNumber(),
      transaction_date: new Date()
    });

    const populatedPayment = await FeePayment.findById(payment._id)
      .populate("student_id", "name admission_no roll_no")
      .populate({
        path: "fee_master_id",
        populate: [
          { path: "fee_group_id", select: "name" },
          { path: "fee_type_id", select: "name" }
        ]
      });

    return NextResponse.json({ success: true, message: "Payment recorded successfully", data: { payment: populatedPayment } }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 400 });
  }
}
