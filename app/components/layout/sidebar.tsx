"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAppState } from "../../context/store";
import {
  LayoutDashboard, Users, GraduationCap, Calendar, Clock, BookOpen,
  ClipboardList, DollarSign, Megaphone, ChevronDown, ChevronRight, Building2,
  Sparkles
} from "lucide-react";

export function Sidebar() {
  const pathname = usePathname();
  const { activeRole } = useAppState();

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
    { name: "Fees Collection", icon: <DollarSign className="w-4 h-4" />, subItems: [
        { name: "Fees Group", href: "/dashboard/fees-collection/fees-group" },
        { name: "Fees Type", href: "/dashboard/fees-collection/fees-type" }
      ]
    },
    { name: "Notice Board", href: "/dashboard/notices", icon: <Megaphone className="w-4 h-4" /> }
  ];

  const teacherLinks = [
    { name: "Overview", href: "/dashboard", icon: <LayoutDashboard className="w-4 h-4" /> },
    { name: "Attendance", href: "/dashboard/attendance", icon: <Clock className="w-4 h-4" /> },
    { name: "Homework", href: "/dashboard/homework", icon: <BookOpen className="w-4 h-4" /> },
    { name: "Exam Results", href: "/dashboard/results", icon: <ClipboardList className="w-4 h-4" /> },
    { name: "Notice Board", href: "/dashboard/notices", icon: <Megaphone className="w-4 h-4" /> }
  ];

  const studentLinks = [
    { name: "Overview", href: "/dashboard", icon: <LayoutDashboard className="w-4 h-4" /> },
    { name: "My Schedule", href: "/dashboard/classes", icon: <Calendar className="w-4 h-4" /> },
    { name: "My Attendance", href: "/dashboard/attendance", icon: <Clock className="w-4 h-4" /> },
    { name: "My Homework", href: "/dashboard/homework", icon: <BookOpen className="w-4 h-4" /> },
    { name: "My Grades", href: "/dashboard/results", icon: <ClipboardList className="w-4 h-4" /> },
    { name: "My Fees", href: "/dashboard/fees", icon: <DollarSign className="w-4 h-4" /> },
    { name: "Notice Board", href: "/dashboard/notices", icon: <Megaphone className="w-4 h-4" /> }
  ];

  const links = activeRole === "admin" ? adminLinks : activeRole === "teacher" ? teacherLinks : studentLinks;

  const roleLabels = {
    admin: { text: "Administrator", badge: "bg-blue-500/20 text-blue-400" },
    teacher: { text: "Faculty Member", badge: "bg-emerald-500/20 text-emerald-400" },
    student: { text: "Student Profile", badge: "bg-amber-500/20 text-amber-400" }
  };

  const [expandedMenu, setExpandedMenu] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (pathname.includes("/dashboard/classes")) {
      setExpandedMenu("Classes & Schedule");
    } else if (pathname.includes("/dashboard/academic")) {
      setExpandedMenu("Academic");
    }
  }, [pathname]);

  return (
    <aside className="w-[260px] bg-sidebar flex flex-col h-full flex-shrink-0 transition-all duration-300 border-r border-slate-800/50">
      {/* Branding */}
      <div className="h-16 px-6 flex items-center gap-3 border-b border-slate-800/50 mt-2">
        <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
          <Sparkles className="w-4 h-4 text-white" />
        </div>
        <div className="flex flex-col">
          <span className="font-bold text-white tracking-tight text-sm">
            Academix
          </span>
          <span className="text-[10px] text-slate-400 tracking-wider uppercase">
            Workspace
          </span>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
        <div className="px-2 mb-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
          Main Menu
        </div>
        {links.map((link) => {
          if ('subItems' in link && link.subItems) {
            const isExpanded = expandedMenu === link.name;
            const isChildActive = link.subItems.some((sub: { href: string }) => pathname === sub.href);
            return (
              <div key={link.name} className="flex flex-col gap-1">
                <button
                  onClick={() => setExpandedMenu(isExpanded ? null : link.name)}
                  className={`flex items-center justify-between w-full px-3 py-2.5 text-[13px] rounded-lg transition-all duration-200 font-medium ${isChildActive && !isExpanded
                      ? "bg-primary/10 text-primary"
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
                    }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={`${isChildActive ? "text-primary" : "text-slate-400"}`}>
                      {link.icon}
                    </span>
                    <span>{link.name}</span>
                  </div>
                  {isExpanded ? <ChevronDown className="w-4 h-4 text-slate-500" /> : <ChevronRight className="w-4 h-4 text-slate-500" />}
                </button>

                {isExpanded && (
                  <div className="ml-9 flex flex-col gap-1 border-l border-slate-700/50 pl-3 py-1">
                    {link.subItems.map((sub: { name: string, href: string }) => {
                      const isSubActive = pathname === sub.href;
                      return (
                        <Link
                          key={sub.name}
                          href={sub.href}
                          className={`text-[12px] font-medium transition-colors py-1.5 ${isSubActive ? "text-primary" : "text-slate-500 hover:text-slate-300"
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
              className={`flex items-center gap-3 px-3 py-2.5 text-[13px] rounded-lg transition-all duration-200 font-medium ${isActive
                  ? "bg-primary/10 text-primary"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
                }`}
            >
              <span className={`${isActive ? "text-primary" : "text-slate-400"}`}>
                {link.icon}
              </span>
              <span>{link.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Role Indicator Footer */}
      <div className="p-4 border-t border-slate-800/50">
        <div className="p-3 rounded-xl bg-slate-800/30 border border-slate-700/50 flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-slate-400">Logged in as</span>
            <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${roleLabels[activeRole].badge}`}>
              {activeRole.toUpperCase()}
            </span>
          </div>
          <span className="text-sm font-semibold text-white">
            {roleLabels[activeRole].text}
          </span>
        </div>
      </div>
    </aside>
  );
}
