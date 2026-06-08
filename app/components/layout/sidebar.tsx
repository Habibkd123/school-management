"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAppState } from "../../context/store";
import {
  LayoutDashboard, Users, GraduationCap, Calendar, Clock, BookOpen,
  ClipboardList, DollarSign, Megaphone, ChevronDown, ChevronRight, Building2,
  Sparkles, BarChart, LogOut, User, ChevronUp, Menu
} from "lucide-react";

export function Sidebar() {
  const pathname = usePathname();
  const { activeRole } = useAppState();
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  const adminLinks = [
    { name: "Overview", href: "/dashboard", icon: <LayoutDashboard className="w-4 h-4" /> },
    { name: "Students", href: "/dashboard/students", icon: <GraduationCap className="w-4 h-4" /> },
    { name: "Teachers", href: "/dashboard/teachers", icon: <Users className="w-4 h-4" /> },
    {
      name: "Classes & Schedule", icon: <Calendar className="w-4 h-4" />, subItems: [
        { name: "All Classes", href: "/dashboard/classes" },
        { name: "Schedule", href: "/dashboard/classes/schedule" }
      ]
    },
    {
      name: "Academic", icon: <Building2 className="w-4 h-4" />, subItems: [
        { name: "Class Room", href: "/dashboard/academic/class-room" },
        { name: "Class Routine", href: "/dashboard/academic/class-routine" },
        { name: "Sections", href: "/dashboard/academic/sections" },
        { name: "Subjects", href: "/dashboard/academic/subjects" },
        { name: "Class Syllabus", href: "/dashboard/academic/class-syllabus" },
        { name: "Time Table", href: "/dashboard/academic/time-table" },
        { name: "Class Home Work", href: "/dashboard/academic/class-home-work" }
      ]
    },
    {
      name: "Examination", icon: <ClipboardList className="w-4 h-4" />, subItems: [
        { name: "Exam", href: "/dashboard/examination/exam" },
        { name: "Exam Schedule", href: "/dashboard/examination/exam-schedule" },
        { name: "Grade", href: "/dashboard/examination/grade" },
        { name: "Exam Attendance", href: "/dashboard/examination/exam-attendance" },
        { name: "Exam Results", href: "/dashboard/examination/exam-results" }
      ]
    },
    {
      name: "Attendance", icon: <Clock className="w-4 h-4" />, subItems: [
        { name: "Teacher Attendance List", href: "/dashboard/attendance/teacher-attendance" },
        { name: "Student Attendance List", href: "/dashboard/attendance/student-attendance" }
      ]
    },
    {
      name: "HRM", icon: <Calendar className="w-4 h-4" />, subItems: [
        { name: "Approve Leave Request", href: "/dashboard/leave/approve-leave-request" },
        { name: "Leave Type", href: "/dashboard/leave/leave-type" },
        { name: "Holidays", href: "/dashboard/holidays" }
      ]
    },
    {
      name: "Fees Collection", icon: <DollarSign className="w-4 h-4" />, subItems: [
        { name: "Collect Fees", href: "/dashboard/fees-collection/collect-fees" },
        { name: "Fees Group", href: "/dashboard/fees-collection/fees-group" },
        { name: "Fees Type", href: "/dashboard/fees-collection/fees-type" },
        { name: "Fees Master", href: "/dashboard/fees-collection/fees-master" },
        { name: "Assign Fees", href: "/dashboard/fees-collection/assign-fees" }
      ]
    },
    {
      name: "Reports", icon: <BarChart className="w-4 h-4" />, subItems: [
        { name: "Fees Report", href: "/dashboard/reports/fees-report" },
        { name: "Leave Report", href: "/dashboard/reports/leave-report" },
        { name: "Grade Report", href: "/dashboard/reports/grade-report" },
        { name: "Student Report", href: "/dashboard/reports/student-report" },
        { name: "Class Report", href: "/dashboard/reports/class-report" },
        { name: "Attendance Report", href: "/dashboard/reports/attendance-report" }
      ]
    },
    { name: "Notice Board", href: "/dashboard/notices", icon: <Megaphone className="w-4 h-4" /> }
  ];

  const teacherLinks = [
    { name: "Overview", href: "/dashboard", icon: <LayoutDashboard className="w-4 h-4" /> },
    {
      name: "Classes & Schedule", icon: <Calendar className="w-4 h-4" />, subItems: [
        { name: "All Classes", href: "/dashboard/classes" },
        { name: "Schedule", href: "/dashboard/classes/schedule" }
      ]
    },
    {
      name: "Academic", icon: <Building2 className="w-4 h-4" />, subItems: [
        { name: "Class Room", href: "/dashboard/academic/class-room" },
        { name: "Class Routine", href: "/dashboard/academic/class-routine" },
        { name: "Subjects", href: "/dashboard/academic/subjects" },
        { name: "Class Syllabus", href: "/dashboard/academic/class-syllabus" },
        { name: "Class Home Work", href: "/dashboard/academic/class-home-work" }
      ]
    },
    {
      name: "Examination", icon: <ClipboardList className="w-4 h-4" />, subItems: [
        { name: "Exam Schedule", href: "/dashboard/examination/exam-schedule" },
        { name: "Grade", href: "/dashboard/examination/grade" },
        { name: "Exam Attendance", href: "/dashboard/examination/exam-attendance" },
        { name: "Exam Results", href: "/dashboard/examination/exam-results" }
      ]
    },
    {
      name: "Attendance", icon: <Clock className="w-4 h-4" />, subItems: [
        { name: "Teacher Attendance List", href: "/dashboard/attendance/teacher-attendance" },
        { name: "Student Attendance List", href: "/dashboard/attendance/student-attendance" }
      ]
    },
    { name: "Notice Board", href: "/dashboard/notices", icon: <Megaphone className="w-4 h-4" /> }
  ];

  const studentLinks = [
    { name: "Overview", href: "/dashboard", icon: <LayoutDashboard className="w-4 h-4" /> },
    {
      name: "Academic", icon: <Building2 className="w-4 h-4" />, subItems: [
        { name: "My Routine", href: "/dashboard/academic/class-routine" },
        { name: "My Syllabus", href: "/dashboard/academic/class-syllabus" },
        { name: "My Subjects", href: "/dashboard/academic/subjects" }
      ]
    },
    {
      name: "Homework", icon: <BookOpen className="w-4 h-4" />, subItems: [
        { name: "Pending", href: "/dashboard/homework" },
        { name: "Completed", href: "/dashboard/homework" }
      ]
    },
    {
      name: "Attendance", icon: <Clock className="w-4 h-4" />, subItems: [
        { name: "My Attendance", href: "/dashboard/attendance" }
      ]
    },
    {
      name: "Examination", icon: <ClipboardList className="w-4 h-4" />, subItems: [
        { name: "Exam Schedule", href: "/dashboard/examination/exam-schedule" },
        { name: "My Grades", href: "/dashboard/results" }
      ]
    },
    {
      name: "Fees", icon: <DollarSign className="w-4 h-4" />, subItems: [
        { name: "My Fees", href: "/dashboard/fees" },
        { name: "Payment History", href: "/dashboard/fees" }
      ]
    },
    { name: "Notice Board", href: "/dashboard/notices", icon: <Megaphone className="w-4 h-4" /> }
  ];

  const links = activeRole === "admin" ? adminLinks : activeRole === "teacher" ? teacherLinks : studentLinks;

  const roleLabels = {
    admin: { text: "Administrator", badge: "bg-blue-500/20 text-blue-400" },
    teacher: { text: "Faculty Member", badge: "bg-emerald-500/20 text-emerald-400" },
    student: { text: "Student Profile", badge: "bg-amber-500/20 text-amber-400" }
  };

  const [expandedMenu, setExpandedMenu] = React.useState<string | null>(null);
  const [isCollapsed, setIsCollapsed] = React.useState(false);

  React.useEffect(() => {
    // Intentionally removed auto-expansion logic so menus are collapsed by default
  }, [pathname]);

  return (
    <aside className={`${isCollapsed ? 'w-[80px]' : 'w-[240px]'} bg-sidebar flex flex-col h-full flex-shrink-0 transition-all duration-300 border-r border-slate-800/50`}>
      {/* Branding */}
      <div className={`h-16 flex items-center ${isCollapsed ? 'justify-center px-0' : 'justify-between px-4'} border-b border-slate-800/50 mt-2`}>
        {!isCollapsed && (
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center overflow-hidden bg-white shrink-0">
              <img src="/logo.png" alt="Logo" className="w-full h-full object-contain p-1" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-white tracking-tight text-[15px]">
                Preskool
              </span>
              <span className="text-[10px] text-slate-400 dark:text-slate-500 tracking-wider uppercase">
                Management
              </span>
            </div>
          </div>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={`p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-md transition-colors cursor-pointer ${isCollapsed ? 'mx-auto' : ''}`}
          title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
          <Menu className="w-5 h-5" />
        </button>
      </div>

      {/* Navigation Links */}
      {/* Navigation Links */}
      <nav className={`flex-1 ${isCollapsed ? 'px-2' : 'px-4'} py-6 space-y-1 overflow-y-auto`}>
        {!isCollapsed && (
          <div className="px-2 mb-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Main Menu
          </div>
        )}
        {links.map((link) => {
          if ('subItems' in link && link.subItems) {
            const isExpanded = expandedMenu === link.name;
            const isChildActive = link.subItems.some((sub: { href: string }) => pathname === sub.href);
            return (
              <div key={link.name} className="flex flex-col gap-1">
                <button
                  onClick={() => {
                    if (isCollapsed) setIsCollapsed(false);
                    setExpandedMenu(isExpanded && !isCollapsed ? null : link.name);
                  }}
                  className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'} w-full ${isCollapsed ? 'px-0 py-3' : 'px-3 py-2.5'} text-[13px] rounded-lg transition-all duration-200 font-medium ${isChildActive && !isExpanded
                    ? "bg-primary/10 text-primary"
                    : "text-slate-400 dark:text-slate-500 hover:text-slate-200 hover:bg-slate-800/50"
                    }`}
                  title={isCollapsed ? link.name : undefined}
                >
                  <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'}`}>
                    <span className={`${isChildActive ? "text-primary" : "text-slate-400 dark:text-slate-500"}`}>
                      {link.icon}
                    </span>
                    {!isCollapsed && <span>{link.name}</span>}
                  </div>
                  {!isCollapsed && (isExpanded ? <ChevronDown className="w-4 h-4 text-slate-500 dark:text-slate-400" /> : <ChevronRight className="w-4 h-4 text-slate-500 dark:text-slate-400" />)}
                </button>

                {isExpanded && !isCollapsed && (
                  <div className="ml-9 flex flex-col gap-1 border-l border-slate-700/50 pl-3 py-1">
                    {link.subItems.map((sub: { name: string, href: string }) => {
                      const isSubActive = pathname === sub.href;
                      return (
                        <Link
                          key={sub.name}
                          href={sub.href}
                          className={`text-[12px] font-medium transition-colors py-1.5 ${isSubActive ? "text-primary" : "text-slate-500 dark:text-slate-400 hover:text-slate-300"
                            }`}
                        >
                          {sub.name}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          }

          const isActive = pathname === (link as any).href;
          return (
            <Link
              key={link.name}
              href={(link as any).href}
              className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'} ${isCollapsed ? 'px-0 py-3' : 'px-3 py-2.5'} text-[13px] rounded-lg transition-all duration-200 font-medium ${isActive
                ? "bg-primary/10 text-primary"
                : "text-slate-400 dark:text-slate-500 hover:text-slate-200 hover:bg-slate-800/50"
                }`}
              title={isCollapsed ? link.name : undefined}
            >
              <span className={`${isActive ? "text-primary" : "text-slate-400 dark:text-slate-500"}`}>
                {link.icon}
              </span>
              {!isCollapsed && <span>{link.name}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Role Indicator Footer & Profile Menu */}
      <div className={`relative ${isCollapsed ? 'p-2' : 'p-4'} border-t border-slate-800/50`}>
        {isProfileMenuOpen && !isCollapsed && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setIsProfileMenuOpen(false)} />
            <div className="absolute bottom-full left-4 right-4 mb-2 bg-slate-800 border border-slate-700 rounded-xl shadow-lg z-50 overflow-hidden py-1">
              <Link
                href="/dashboard/settings/profile"
                onClick={() => setIsProfileMenuOpen(false)}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-[13px] font-medium text-slate-300 hover:text-white hover:bg-slate-700/50 transition-colors cursor-pointer"
              >
                <User className="w-4 h-4" /> My Profile
              </Link>
              <div className="h-px w-full bg-slate-700/50 my-1" />
              <button
                onClick={() => setIsProfileMenuOpen(false)}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-[13px] font-medium text-rose-400 hover:text-rose-300 hover:bg-slate-700/50 transition-colors cursor-pointer text-left"
              >
                <LogOut className="w-4 h-4" /> Logout
              </button>
            </div>
          </>
        )}

        <button
          onClick={() => {
            if (isCollapsed) setIsCollapsed(false);
            else setIsProfileMenuOpen(!isProfileMenuOpen);
          }}
          className={`w-full ${isCollapsed ? 'p-2 justify-center' : 'p-3 justify-between'} rounded-xl bg-slate-800/30 border border-slate-700/50 flex items-center hover:bg-slate-800/50 transition-colors cursor-pointer`}
          title={isCollapsed ? roleLabels[activeRole].text : undefined}
        >
          {isCollapsed ? (
            <div className="w-10 h-10 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0">
              <User className="w-5 h-5 text-slate-400" />
            </div>
          ) : (
            <>
              <div className="flex flex-col gap-1.5 text-left">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-slate-400 dark:text-slate-500">Logged in as</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${roleLabels[activeRole].badge}`}>
                    {activeRole.toUpperCase()}
                  </span>
                </div>
                <span className="text-sm font-semibold text-white">
                  {roleLabels[activeRole].text}
                </span>
              </div>
              {isProfileMenuOpen ? (
                <ChevronDown className="w-4 h-4 text-slate-400 dark:text-slate-500" />
              ) : (
                <ChevronUp className="w-4 h-4 text-slate-400 dark:text-slate-500" />
              )}
            </>
          )}
        </button>
      </div>
    </aside>
  );
}
