import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/lib/models/User";
import { generateAccessToken, generateRefreshToken } from "@/lib/utils/jwt";
import { validate, validationErrorResponse } from "@/lib/utils/validate";

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();

    // ─── Strict Validation ──────────────────────────────────────
    const errors = validate(body, {
      email: { required: true, isEmail: true },
      password: { required: true, minLength: 6 },
      school_id: { required: true, isMongoId: true },
    });

    if (errors.length > 0) return validationErrorResponse(errors);

    const { email, password, school_id } = body as {
      email: string;
      password: string;
      school_id: string;
    };

    // ─── Find user scoped to this school ────────────────────────
    // STRICT: same email in different school = different user
    const user = await User.findOne({
      email: email.toLowerCase().trim(),
      school_id,
      is_active: true,
    }).select("+password_hash"); // password_hash is hidden by default, select it

    if (!user) {
      // Generic message — don't reveal if email exists or not
      return NextResponse.json(
        { success: false, message: "Invalid email or password" },
        { status: 401 }
      );
    }

    // ─── Verify password ─────────────────────────────────────────
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return NextResponse.json(
        { success: false, message: "Invalid email or password" },
        { status: 401 }
      );
    }

    // ─── Generate tokens ──────────────────────────────────────────
    const tokenPayload = {
      user_id: user._id.toString(),
      school_id: user.school_id?.toString() ?? null,
      role: user.role,
    };

    const accessToken = generateAccessToken(tokenPayload);
    const refreshToken = generateRefreshToken(tokenPayload);

    // ─── Update last login ────────────────────────────────────────
    await User.findByIdAndUpdate(user._id, { last_login: new Date() });

    return NextResponse.json(
      {
        success: true,
        message: "Login successful",
        data: {
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            school_id: user.school_id,
            must_change_password: user.must_change_password ?? false,
          },
          access_token: accessToken,
          refresh_token: refreshToken,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("[LOGIN ERROR]", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
