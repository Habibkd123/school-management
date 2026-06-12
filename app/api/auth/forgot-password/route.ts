import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import connectDB from "@/lib/db";
import User from "@/lib/models/User";

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const { email, school_id } = body as { email: string; school_id: string };

    if (!email || !school_id) {
      return NextResponse.json(
        { success: false, message: "Email and school_id are required" },
        { status: 400 }
      );
    }

    // ─── Find user (don't reveal if email exists or not) ──────────
    const user = await User.findOne({
      email: email.toLowerCase().trim(),
      school_id,
      is_active: true,
    }).select("+reset_token +reset_token_expiry");

    // Always return success to prevent email enumeration attacks
    if (!user) {
      return NextResponse.json({
        success: true,
        message: "If that email exists, a reset link has been sent.",
      });
    }

    // ─── Generate secure token ────────────────────────────────────
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    // ─── Save token to DB ─────────────────────────────────────────
    await User.findByIdAndUpdate(user._id, {
      reset_token: resetToken,
      reset_token_expiry: resetTokenExpiry,
    });

    // ─── In production: send email here ──────────────────────────
    // For now, return token in response (dev mode only)
    const isDev = process.env.NODE_ENV !== "production";

    return NextResponse.json({
      success: true,
      message: "Password reset link generated successfully.",
      ...(isDev && {
        dev_token: resetToken, // Only visible in development
        dev_note: "In production, this token is emailed. Use it at /reset-password?token=<token>",
      }),
    });
  } catch (error) {
    console.error("[FORGOT PASSWORD ERROR]", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
