"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Loader2, GraduationCap, BookOpen, ArrowRight, User, Search, RefreshCw } from "lucide-react";
import { useTeacherAssignment } from "@/app/hooks/useTeacherAssignment";
import { useAppState } from "@/app/context/store";
import { useAuth } from "@/app/context/auth";
import Link from "next/link";

export default function SyllabusClassListPage() {
  const { academicYear } = useAppState();
  const { user } = useAuth();
  const isTeacher = user?.role === "teacher";
  const { assignments, isLoading, fetchAssignments } = useTeacherAssignment();
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (!assignments || assignments.length === 0) {
      fetchAssignments({ limit: 5000 });
    }
  }, [assignments, fetchAssignments]);

  const classGroups = useMemo(() => {
    const groups: Record<string, { classId: string, className: string, section?: string, assignments: any[] }> = {};

    assignments.forEach(a => {
      if (a.academic_year !== academicYear) return;
      const classId = typeof a.class_id === 'object' ? a.class_id?._id : a.class_id;
      if (!classId) return;

      const className = typeof a.class_id === 'object' ? (a.class_id?.name || "Class") : "Class";
      const section = typeof a.class_id === 'object' ? (a.class_id?.section || "") : "";

      const key = `${classId}`;
      if (!groups[key]) {
        groups[key] = { classId, className, section, assignments: [] };
      }
      groups[key].assignments.push(a);
    });

    return Object.values(groups).sort((a, b) => a.className.localeCompare(b.className));
  }, [assignments, academicYear]);

  const filteredClassGroups = useMemo(() => {
    if (!searchTerm.trim()) return classGroups;
    const term = searchTerm.toLowerCase().trim();
    return classGroups.filter(c => {
      const nameMatch = c.className.toLowerCase().includes(term);
      const sectionMatch = c.section ? c.section.toLowerCase().includes(term) : false;
      const subjectMatch = c.assignments.some(a => {
        const subjectName = typeof a.subject_master_id === 'object' ? a.subject_master_id?.name : "";
        return subjectName.toLowerCase().includes(term);
      });
      return nameMatch || sectionMatch || subjectMatch;
    });
  }, [classGroups, searchTerm]);

  return (
    <div className="space-y-6 bg-[#F8FAFC] dark:bg-[var(--sidebar-bg)] min-h-screen -m-6 p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-left">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">Syllabus</h1>
          <div className="flex items-center gap-2 text-[13px] text-slate-500 dark:text-slate-400 mt-1">
            <span>Dashboard</span>
            <span>/</span>
            <Link href="/academic" className="hover:text-primary">Academic</Link>
            <span>/</span>
            <span className="text-slate-900 dark:text-white font-medium">Syllabus</span>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <button onClick={() => fetchAssignments({ limit: 5000 })} className="w-9 h-9 rounded-full bg-white dark:bg-slate-900 border border-border flex items-center justify-center text-slate-500 dark:text-slate-400 hover:text-primary hover:bg-primary/10 transition-colors shadow-sm cursor-pointer">
            <RefreshCw className="w-4 h-4" />
          </button>
          <div className="px-4 py-2 bg-white dark:bg-slate-900 border border-border rounded-lg text-[13px] font-bold text-slate-700 dark:text-slate-350 shadow-sm font-mono">
            Academic Year: {academicYear}
          </div>
        </div>
      </div>

      {/* Search Filter Card (consistent with other pages) */}
      <div className="bg-white dark:bg-slate-900 border border-border rounded-xl shadow-sm text-left">
        <div className="p-5 flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-50/50 dark:bg-slate-800/50">
          <div className="flex items-center gap-2 text-[13px] text-slate-500 dark:text-slate-400">
            <span>Total</span>
            <span className="font-bold text-slate-700 dark:text-slate-200">{filteredClassGroups.length}</span>
            <span>{filteredClassGroups.length === 1 ? "Class" : "Classes"}</span>
          </div>

          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Search classes or subjects..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2 w-full sm:w-[240px] bg-white dark:bg-slate-900 border border-border rounded-lg text-[13px] outline-none focus:border-primary transition-colors text-slate-800 dark:text-slate-100 placeholder:text-slate-400"
            />
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-40 text-slate-400">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : filteredClassGroups.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-40 bg-white dark:bg-slate-900 border border-border rounded-xl shadow-sm gap-3 text-slate-400">
          <GraduationCap className="w-10 h-10 opacity-30" />
          <p className="font-medium text-[14px]">No classes matching search found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredClassGroups.map((c) => (
            <div key={c.classId} className="bg-white dark:bg-slate-900 border border-border rounded-xl card-shadow overflow-hidden flex flex-col text-left hover:shadow-md transition-shadow">
              <div className="p-4 border-b border-border bg-[#F8FAFC] dark:bg-slate-800/40 flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center shrink-0 border border-primary/10">
                  <GraduationCap className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="text-[15px] font-bold text-slate-800 dark:text-white leading-tight">
                    {c.className} {c.section ? <span className="text-slate-400 font-medium text-[13px]">- {c.section}</span> : ""}
                  </h3>
                  <p className="text-[11px] font-bold text-slate-400 mt-0.5">{c.assignments.length} {c.assignments.length === 1 ? "Subject" : "Subjects"}</p>
                </div>
              </div>

              <div className="p-3 bg-slate-50/50 dark:bg-slate-900/30 flex-1">
                <div className="space-y-2">
                  {c.assignments.map(a => {
                    const subjectName = typeof a.subject_master_id === 'object' ? a.subject_master_id?.name : "Subject";
                    const teacherName = typeof a.teacher_id === 'object' ? a.teacher_id?.name : "Teacher";

                    return (
                      <Link
                        key={a._id}
                        href={`/academic-mgmt/syllabus/${c.classId}/${a._id}`}
                        className="block bg-white dark:bg-slate-800 border border-border rounded-lg p-3 hover:border-primary/50 hover:shadow-sm transition-all group"
                      >
                        <div className="flex flex-col gap-1.5">
                          <div className="flex items-start justify-between gap-2">
                            <h4 className="text-[13px] font-bold text-slate-805 dark:text-slate-205 group-hover:text-primary transition-colors flex items-center gap-1.5">
                              <BookOpen className="w-3.5 h-3.5 text-slate-400 group-hover:text-primary" /> {subjectName}
                            </h4>
                            <ArrowRight className="w-3.5 h-3.5 text-slate-300 dark:text-slate-600 group-hover:text-primary transition-colors" />
                          </div>
                          <p className="text-[11.5px] font-medium text-slate-500 dark:text-slate-405 flex items-center gap-1.5">
                            <User className="w-3 h-3 text-slate-400" /> <span className="font-semibold text-slate-600 dark:text-slate-300">{teacherName}</span>
                          </p>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
