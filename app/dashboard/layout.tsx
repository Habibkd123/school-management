"use client";

import React from "react";
import { Sidebar } from "../components/layout/sidebar";
import { Header } from "../components/layout/header";
import { CommandMenu } from "../components/ui/command-menu";

export default function DashboardLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
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
          <div className="mx-auto w-full max-w-7xl">
            {children}
          </div>
        </main>
      </div>

      {/* Global Search Command Menu */}
      <CommandMenu />
    </div>
  );
}
