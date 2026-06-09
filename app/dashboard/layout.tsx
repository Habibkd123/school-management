"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Sidebar } from "../components/layout/sidebar";
import { Header } from "../components/layout/header";
import { CommandMenu } from "../components/ui/command-menu";
import { useAuth } from "../context/auth";
import { Loader2 } from "lucide-react";

export default function DashboardLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/login");
    }
  }, [isAuthenticated, isLoading, router]);

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
