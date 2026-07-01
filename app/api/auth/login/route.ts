import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/lib/models/User";
import School from "@/lib/models/School";
import { generateAccessToken, generateRefreshToken } from "@/lib/utils/jwt";

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

    // ─── Step 1: Basic Input Validation ─────────────────────────
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

    // ─── Super Admin Fast Path ───────────────────────────────────
    if (isSuperAdmin) {
      const user = await User.findOne({
        username: usernameInput,
        role: "super_admin",
      }).select("+password_hash");

      if (!user) {
        return NextResponse.json(
          { success: false, message: "Invalid credentials." },
          { status: 401 }
        );
      }

      if (user.is_active === false) {
        return NextResponse.json(
          { success: false, message: "Your account has been disabled." },
          { status: 403 }
        );
      }

      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        return NextResponse.json(
          { success: false, message: "Incorrect password." },
          { status: 401 }
        );
      }

      const tokenPayload = {
        user_id: user._id.toString(),
        school_id: null,
        role: user.role,
      };

      const accessToken = generateAccessToken(tokenPayload);
      const refreshToken = generateRefreshToken(tokenPayload);
      await User.findByIdAndUpdate(user._id, { last_login: new Date() });

      return NextResponse.json({
        success: true,
        message: "Login successful",
        data: {
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            school_id: null,
            must_change_password: user.must_change_password ?? false,
          },
          access_token: accessToken,
          refresh_token: refreshToken,
        },
      });
    }

    // ─── Step 2: School ID Required for Non-Super-Admin ─────────
    if (!school_id) {
      return NextResponse.json(
        { success: false, message: "School ID is required." },
        { status: 400 }
      );
    }

    // ─── Step 3: Validate School First ──────────────────────────
    // Check that the school exists and is active BEFORE looking up the user.
    // This lets us give accurate "School not found" vs "Invalid credentials" errors.
    const schoolDoc = await School.findById(school_id)
      .select("is_active login_config")
      .lean();

    if (!schoolDoc) {
      return NextResponse.json(
        { success: false, message: "School not found." },
        { status: 404 }
      );
    }

    if (schoolDoc.is_active === false) {
      return NextResponse.json(
        { success: false, message: "This school account has been disabled." },
        { status: 403 }
      );
    }

    // ─── Step 4: Find User Within That School ───────────────────
    const user = await User.findOne({
      username: usernameInput,
      school_id,
    }).select("+password_hash");

    // Generic "invalid credentials" — do NOT reveal whether the username
    // exists, only show that the school was already verified.
    if (!user) {
      return NextResponse.json(
        { success: false, message: "Invalid Student ID or Password." },
        { status: 401 }
      );
    }

    // ─── Step 5: Account Active Check ───────────────────────────
    if (user.is_active === false) {
      return NextResponse.json(
        { success: false, message: "Your account is inactive. Please contact your school administrator." },
        { status: 403 }
      );
    }

    // ─── Step 6: Role-Specific Login Config Checks ──────────────
    if (schoolDoc.login_config) {
      const { disable_student_login, disable_teacher_login } = schoolDoc.login_config;

      if (user.role === "student" && disable_student_login) {
        return NextResponse.json(
          { success: false, message: "Student login is currently disabled. Please contact your school administrator." },
          { status: 403 }
        );
      }

      if (user.role === "teacher" && disable_teacher_login) {
        return NextResponse.json(
          { success: false, message: "Teacher login is currently disabled. Please contact your school administrator." },
          { status: 403 }
        );
      }
    }

    // ─── Step 7: Verify Password ─────────────────────────────────
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      // Role-aware wrong-password message
      if (user.role === "student") {
        return NextResponse.json(
          { success: false, message: "Invalid Student ID or Password." },
          { status: 401 }
        );
      }
      return NextResponse.json(
        { success: false, message: "Incorrect password." },
        { status: 401 }
      );
    }

    // ─── Step 8: Generate Tokens & Respond ───────────────────────
    const tokenPayload = {
      user_id: user._id.toString(),
      school_id: user.school_id?.toString() ?? null,
      role: user.role,
    };

    const accessToken = generateAccessToken(tokenPayload);
    const refreshToken = generateRefreshToken(tokenPayload);

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
