import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/lib/models/User";
import Student from "@/lib/models/Student";
import Teacher from "@/lib/models/Teacher";
import School from "@/lib/models/School";
import { generateAccessToken, generateRefreshToken } from "@/lib/utils/jwt";
import { validate, validationErrorResponse } from "@/lib/utils/validate";

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();

    let { username, email, password, school_id, is_super_admin } = body as {
      username?: string;
      email?: string;
      password?: string;
      school_id?: string;
      is_super_admin?: boolean;
    };

    // Alias compatibility
    const usernameInput = (username || email || "").toLowerCase().trim();

    // ─── School Username Format Validation ──────────────────────
    if (!usernameInput) {
      return NextResponse.json(
        { success: false, message: "Please enter your School Username." },
        { status: 400 }
      );
    }

    if (!usernameInput.endsWith(".myschoollife") || usernameInput.includes(" ") || usernameInput.includes("@")) {
      return NextResponse.json(
        { success: false, message: "Please enter a valid School Username." },
        { status: 400 }
      );
    }

    if (!password || password.length < 6) {
      return NextResponse.json(
        { success: false, message: "Password must be at least 6 characters." },
        { status: 400 }
      );
    }

    const isSuperAdmin = is_super_admin === true || usernameInput.startsWith("superadmin.");

    if (!isSuperAdmin && !school_id) {
      return NextResponse.json(
        { success: false, message: "School ID is required for non-superadmin login" },
        { status: 400 }
      );
    }

    // ─── Find user by username ──────────────────────────────────
    let user;

    if (isSuperAdmin) {
      user = await User.findOne({
        username: usernameInput,
        role: "super_admin",
      }).select("+password_hash");
    } else {
      user = await User.findOne({
        username: usernameInput,
        school_id,
      }).select("+password_hash");
    }

    // Username existence check
    if (!user) {
      return NextResponse.json(
        { success: false, message: "School Username not found." },
        { status: 401 }
      );
    }

    // Account active check
    if (user.is_active === false) {
      return NextResponse.json(
        { success: false, message: "Your user account has been disabled." },
        { status: 403 }
      );
    }

    // School active & role restrictions checks
    if (!isSuperAdmin && user.school_id) {
      const schoolDoc = await School.findById(user.school_id).select("is_active login_config").lean();
      if (!schoolDoc || schoolDoc.is_active === false) {
        return NextResponse.json(
          { success: false, message: "This school account has been disabled." },
          { status: 403 }
        );
      }

      if (schoolDoc.login_config) {
        const { disable_student_login, disable_teacher_login } = schoolDoc.login_config;
        if (user.role === "student" && disable_student_login) {
          return NextResponse.json(
            { success: false, message: "Student login is currently disabled by the administrator. Please contact your school administrator for assistance." },
            { status: 403 }
          );
        }
        if (user.role === "teacher" && disable_teacher_login) {
          return NextResponse.json(
            { success: false, message: "Teacher login is currently disabled by the administrator. Please contact your school administrator for assistance." },
            { status: 403 }
          );
        }
      }
    }

    // ─── Verify password ─────────────────────────────────────────
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return NextResponse.json(
        { success: false, message: "Incorrect password." },
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
