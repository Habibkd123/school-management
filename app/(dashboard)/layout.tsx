"use client";

import React, { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Sidebar } from "../components/layout/sidebar";
import { Header } from "../components/layout/header";
import { CommandMenu } from "../components/ui/command-menu";
import { useAuth } from "../context/auth";
import { Loader2 } from "lucide-react";
import { hasPermission } from "@/lib/permissions";
import type { PermissionModule, AppRole } from "@/lib/permissions";

// Map URL path prefixes → permission module
const ROUTE_MODULE_MAP: { prefix: string; module: PermissionModule }[] = [
  { prefix: "/students", module: "students" },
  { prefix: "/teachers", module: "teachers" },
  { prefix: "/guardians", module: "parents" },
  { prefix: "/classes", module: "classes" },
  { prefix: "/academic", module: "academic" },
  { prefix: "/examination", module: "examination" },
  { prefix: "/attendance", module: "attendance" },
  { prefix: "/fees", module: "fees" },
  { prefix: "/fees-collection", module: "fees" },
  { prefix: "/transport", module: "transport" },
  { prefix: "/reports", module: "reports" },
  { prefix: "/notices", module: "notices" },
  { prefix: "/leave", module: "leaves" },
  { prefix: "/homework", module: "homework" },
  { prefix: "/results", module: "results" },
];

export default function DashboardLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { isAuthenticated, isLoading, user, permissions } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/login");
      return;
    }

    // ── Route-level permission guard ────────────────────────────────
    // If a user navigates to a restricted route, redirect them to /dashboard
    if (!isLoading && isAuthenticated && user?.role) {
      const matchedRoute = ROUTE_MODULE_MAP.find((entry) =>
        pathname.startsWith(entry.prefix)
      );
      if (matchedRoute) {
        let allowed = false;
        if (permissions && permissions[user.role]) {
          const rolePerms = permissions[user.role];
          const modulePerms = rolePerms[matchedRoute.module];
          allowed = Array.isArray(modulePerms) && modulePerms.includes("view");
        } else {
          allowed = hasPermission(user.role as AppRole, matchedRoute.module, "view");
        }
        if (!allowed) {
          router.replace("/dashboard");
        }
      }
    }
  }, [isAuthenticated, isLoading, router, pathname, user, permissions]);

  // Show spinner while checking auth
  if (isLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-[#5D6BEE] animate-spin" />
          <p className="text-[13px] text-slate-500 dark:text-slate-400 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  // Not authenticated — redirecting (return null to avoid flash)
  if (!isAuthenticated) return null;

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-background font-sans">
      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        {/* Header Top Bar */}
        <Header />

        {/* Dynamic Page Content */}
        <main className="flex-1 overflow-y-auto bg-background p-6 lg:p-8">
          <div className="w-full h-full">
            {children}
          </div>
        </main>
      </div>

      {/* Global Search Command Menu */}
      <CommandMenu />
    </div>
  );
}
