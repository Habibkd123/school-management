"use client";

import React, { useState, useEffect } from "react";
import { useAppState, Role } from "../../context/store";
import { Search, Bell, Shield, BookOpen, GraduationCap, ChevronDown } from "lucide-react";

export function Header() {
  const { activeRole, setRole, students, teachers } = useAppState();
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Scroll detection for sticky header styles
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 0);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const roles = [
    { value: "admin" as Role, label: "Admin Portal", icon: <Shield className="w-4 h-4 text-primary" /> },
    { value: "teacher" as Role, label: "Teacher Portal", icon: <BookOpen className="w-4 h-4 text-emerald-500" /> },
    { value: "student" as Role, label: "Student Portal", icon: <GraduationCap className="w-4 h-4 text-amber-500" /> }
  ];

  const currentRoleObj = roles.find((r) => r.value === activeRole);

  const getProfileInfo = () => {
    switch (activeRole) {
      case "admin":
        return { name: "Principal Vance", detail: "System Admin", avatar: "A" };
      case "teacher":
        return { name: teachers[0]?.name || "Sarah Jenkins", detail: `English Department`, avatar: "T" };
      case "student":
        return { name: students[0]?.name || "Alex Rivera", detail: `Roll No: ${students[0]?.rollNo || "01"}`, avatar: "S" };
    }
  };

  const profile = getProfileInfo();

  return (
    <header
      className={`sticky top-0 z-40 h-[68px] w-full px-8 flex items-center justify-between border-b transition-all duration-200 ${
        scrolled
          ? "bg-white/80 backdrop-blur-md border-border"
          : "bg-background border-transparent"
      }`}
    >
      {/* Search Input Bar (Shortcut trigger) */}
      <div className="flex-1 max-w-md">
        <button
          onClick={() => {
            const event = new KeyboardEvent("keydown", {
              key: "k",
              ctrlKey: true,
              bubbles: true
            });
            window.dispatchEvent(event);
          }}
          className="w-full flex items-center justify-between px-4 py-2 text-[13px] text-slate-400 border border-border hover:border-slate-300 bg-white rounded-lg text-left transition-colors cursor-pointer group shadow-sm"
        >
          <div className="flex items-center gap-2.5">
            <Search className="w-[15px] h-[15px] text-slate-400 group-hover:text-slate-500" />
            <span className="">Search anything...</span>
          </div>
          <kbd className="flex items-center gap-1 px-1.5 py-0.5 text-[10px] font-mono font-medium text-slate-500 bg-slate-50 border border-slate-200 rounded">
            Ctrl K
          </kbd>
        </button>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-5">
        {/* Role Portal Switcher Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowRoleDropdown((prev) => !prev)}
            className="flex items-center gap-2 px-3.5 py-2 rounded-lg border border-border bg-white hover:bg-slate-50 transition-colors text-[13px] font-semibold text-slate-700 cursor-pointer shadow-sm"
          >
            {currentRoleObj?.icon}
            <span>{currentRoleObj?.label}</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {showRoleDropdown && (
            <>
              {/* Overlay for closing */}
              <div className="fixed inset-0 z-40" onClick={() => setShowRoleDropdown(false)} />
              {/* Dropdown Items */}
              <div className="absolute right-0 mt-2 w-52 z-50 rounded-xl border border-border bg-white shadow-lg shadow-black/5 overflow-hidden py-1.5">
                {roles.map((r) => (
                  <button
                    key={r.value}
                    onClick={() => {
                      setRole(r.value);
                      setShowRoleDropdown(false);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 text-[13px] text-left cursor-pointer hover:bg-slate-50 transition-colors ${
                      activeRole === r.value
                        ? "text-slate-900 font-bold bg-slate-50/80"
                        : "text-slate-600 font-medium"
                    }`}
                  >
                    {r.icon}
                    <span>{r.label}</span>
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Notifications Icon (Mock badge) */}
        <button className="relative p-2.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer">
          <Bell className="w-4 h-4" />
          <span className="absolute top-2 right-2.5 w-1.5 h-1.5 bg-danger rounded-full ring-2 ring-white" />
        </button>

        {/* Vertical Divider */}
        <div className="w-px h-6 bg-border" />

        {/* User Card */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-slate-900 text-white flex items-center justify-center text-sm font-bold shadow-sm">
            {profile.avatar}
          </div>
          <div className="hidden sm:flex flex-col text-left">
            <span className="text-[13px] font-bold text-slate-900 leading-tight">
              {profile.name}
            </span>
            <span className="text-[11px] text-slate-500 leading-none mt-1">
              {profile.detail}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
