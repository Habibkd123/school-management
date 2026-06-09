import { NextRequest, NextResponse } from "next/server";
import { verifyAccessToken, JWTPayload } from "@/lib/utils/jwt";

// Attach user to a header so Route Handlers can read it
export function getAuthUser(request: NextRequest): JWTPayload | null {
  try {
    const authHeader = request.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) return null;

    const token = authHeader.split(" ")[1];
    return verifyAccessToken(token);
  } catch {
    return null;
  }
}

// ─── Reusable guard: authenticate + tenant-scope ─────────────────
// Usage in route handler:
//   const { user, schoolId, error } = await requireAuth(request);
//   if (error) return error;
export function requireAuth(
  request: NextRequest,
  requiredRoles?: string[]
): { user: JWTPayload; schoolId: string | null; error: null } | { user: null; schoolId: null; error: NextResponse } {
  const user = getAuthUser(request);

  if (!user) {
    return {
      user: null,
      schoolId: null,
      error: NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 }),
    };
  }

  if (requiredRoles && !requiredRoles.includes(user.role)) {
    return {
      user: null,
      schoolId: null,
      error: NextResponse.json(
        { success: false, message: `Access denied. Required: ${requiredRoles.join(", ")}` },
        { status: 403 }
      ),
    };
  }

  // Non-super-admins MUST have school_id
  if (user.role !== "super_admin" && !user.school_id) {
    return {
      user: null,
      schoolId: null,
      error: NextResponse.json({ success: false, message: "No school context" }, { status: 403 }),
    };
  }

  return { user, schoolId: user.school_id, error: null };
}
