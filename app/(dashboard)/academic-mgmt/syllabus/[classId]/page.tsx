"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Loader2, BookOpen, GraduationCap, ArrowRight, User, AlertCircle, BarChart3, ChevronLeft, ArrowLeft, Search, RefreshCw } from "lucide-react";
import { useTeacherAssignment } from "@/app/hooks/useTeacherAssignment";
import { useAppState } from "@/app/context/store";
import { useAuth } from "@/app/context/auth";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { getAuthHeaders } from "@/lib/utils/session";

export default function SyllabusSubjectListPage() {
  const router = useRouter();
  const params = useParams<{ classId: string }>();
  const classId = params?.classId || "";

  const { academicYear } = useAppState();
  const { user } = useAuth();
  const isTeacher = user?.role === "teacher";
  const { assignments, isLoading: loadingAssignments, fetchAssignments } = useTeacherAssignment();

  const [syllabiStats, setSyllabiStats] = useState<Record<string, { total: number, completed: number, percent: number, updatedAt?: string }>>({});
  const [loadingStats, setLoadingStats] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (!assignments || assignments.length === 0) {
      fetchAssignments({ limit: 5000 });
    }
  }, [assignments, fetchAssignments]);

  const classAssignments = useMemo(() => {
    return assignments.filter(a => {
      const aClassId = typeof a.class_id === 'object' ? a.class_id?._id : a.class_id;
      return aClassId === classId && a.academic_year === academicYear;
    });
  }, [assignments, classId, academicYear]);

  const filteredAssignments = useMemo(() => {
    if (!searchTerm.trim()) return classAssignments;
    const term = searchTerm.toLowerCase().trim();
    return classAssignments.filter(a => {
      const subjectName = typeof a.subject_master_id === 'object' ? a.subject_master_id?.name : "";
      const teacherName = typeof a.teacher_id === 'object' ? a.teacher_id?.name : "";
      const streamName = a.stream_id ? (typeof a.stream_id === 'object' ? a.stream_id.name : "") : "";
      return subjectName.toLowerCase().includes(term) || teacherName.toLowerCase().includes(term) || streamName.toLowerCase().includes(term);
    });
  }, [classAssignments, searchTerm]);

  useEffect(() => {
    async function fetchAllStats() {
      if (classAssignments.length === 0) return;
      setLoadingStats(true);
      const stats: Record<string, any> = {};
      
      await Promise.all(classAssignments.map(async (a) => {
        try {
          const res = await fetch(`/api/syllabus?teacher_assignment_id=${a._id}`, { headers: getAuthHeaders() });
          const data = await res.json();
          if (res.ok && data.success && data.data) {
            const chapters = data.data.chapters || [];
            const total = chapters.length;
            const completed = chapters.filter((c: any) => c.status === "Completed").length;
            const percent = total === 0 ? 0 : Math.round((completed / total) * 100);
            stats[a._id] = { total, completed, percent, updatedAt: data.data.updatedAt };
          } else {
            stats[a._id] = { total: 0, completed: 0, percent: 0 };
          }
        } catch (e) {
          stats[a._id] = { total: 0, completed: 0, percent: 0 };
        }
      }));

      setSyllabiStats(stats);
      setLoadingStats(false);
    }

    fetchAllStats();
  }, [classAssignments]);

  if (loadingAssignments) {
    return (
      <div className="flex items-center justify-center py-40 text-slate-400">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const firstAssignment = classAssignments[0];
  const className = firstAssignment?.class_id ? (typeof firstAssignment.class_id === 'object' ? firstAssignment.class_id.name : "Class") : "Class";
  const sectionName = firstAssignment?.section_id ? (typeof firstAssignment.section_id === 'object' ? firstAssignment.section_id.name : "") : "";

  return (
    <div className="space-y-6 bg-[#F8FAFC] dark:bg-[var(--sidebar-bg)] min-h-screen -m-6 p-6">
      {/* Header and Breadcrumbs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-left">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
            <Link href="/academic-mgmt/syllabus" className="p-1.5 bg-white dark:bg-slate-900 border border-border rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 shadow-sm transition-colors cursor-pointer">
              <ArrowLeft className="w-5 h-5 text-slate-600 dark:text-slate-300" />
            </Link>
            Subject Syllabus
          </h1>
          <div className="flex items-center gap-2 text-[13px] text-slate-500 dark:text-slate-400 mt-2 font-medium">
            <Link href="/academic-mgmt/syllabus" className="hover:text-primary transition-colors">Syllabus</Link>
            <ChevronLeft className="w-3.5 h-3.5 rotate-180" />
            <span className="text-slate-950 dark:text-white font-bold">{className} {sectionName ? `- ${sectionName}` : ''}</span>
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
            <span className="font-bold text-slate-700 dark:text-slate-200">{filteredAssignments.length}</span>
            <span>{filteredAssignments.length === 1 ? "Subject" : "Subjects"}</span>
          </div>

          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Search subjects or teachers..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2 w-full sm:w-[240px] bg-white dark:bg-slate-900 border border-border rounded-lg text-[13px] outline-none focus:border-primary transition-colors text-slate-800 dark:text-slate-100 placeholder:text-slate-400"
            />
          </div>
        </div>
      </div>

      {classAssignments.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-40 bg-white dark:bg-slate-900 border border-border rounded-xl shadow-sm gap-3 text-slate-400">
          <BookOpen className="w-10 h-10 opacity-30" />
          <p className="font-medium text-[14px]">No subjects found for this class.</p>
        </div>
      ) : filteredAssignments.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-40 bg-white dark:bg-slate-900 border border-border rounded-xl shadow-sm gap-3 text-slate-400">
          <BookOpen className="w-10 h-10 opacity-30" />
          <p className="font-medium text-[14px]">No subjects matching search found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAssignments.map((a) => {
            const subjectName = typeof a.subject_master_id === 'object' ? a.subject_master_id?.name : "Subject";
            const teacherName = typeof a.teacher_id === 'object' ? a.teacher_id?.name : "Teacher";
            const streamName = a.stream_id ? (typeof a.stream_id === 'object' ? a.stream_id.name : "") : "";
            
            const stats = syllabiStats[a._id] || { total: 0, completed: 0, percent: 0 };

            return (
              <div key={a._id} className="bg-white dark:bg-slate-900 border border-border rounded-xl card-shadow overflow-hidden flex flex-col justify-between text-left hover:shadow-md transition-shadow group animate-in fade-in">
                <div>
                  {/* Header of card */}
                  <div className="p-5 border-b border-border bg-[#F8FAFC] dark:bg-slate-800/40 flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center shrink-0 border border-primary/10">
                        <BookOpen className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-bold text-[15px] text-slate-900 dark:text-white leading-tight">
                          {subjectName}
                        </h4>
                        <p className="text-[12px] font-medium text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1.5">
                          <User className="w-3.5 h-3.5 text-slate-400" /> <span className="font-semibold text-slate-700 dark:text-slate-300">{teacherName}</span>
                        </p>
                      </div>
                    </div>
                    {streamName && (
                      <span className="font-mono text-[10px] bg-purple-100 dark:bg-purple-900/30 px-2 py-0.5 rounded font-bold text-purple-600 dark:text-purple-400 whitespace-nowrap mt-1">
                        {streamName}
                      </span>
                    )}
                  </div>

                  <div className="p-5 space-y-4">
                    {loadingStats ? (
                      <div className="animate-pulse space-y-3">
                        <div className="h-2 bg-slate-200 dark:bg-slate-800 rounded w-full"></div>
                        <div className="h-2 bg-slate-200 dark:bg-slate-800 rounded w-2/3"></div>
                      </div>
                    ) : (
                      <>
                        <div className="flex items-end justify-between">
                          <div>
                            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">Progress</p>
                            <p className="text-[18px] font-bold text-slate-850 dark:text-slate-200 leading-tight mt-1">{stats.percent}%</p>
                          </div>
                          <div className="text-right">
                            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">Chapters</p>
                            <p className="text-[13px] font-bold text-slate-650 dark:text-slate-300 mt-1">{stats.completed} / {stats.total} done</p>
                          </div>
                        </div>

                        <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                          <div className="h-full bg-emerald-500 transition-all duration-500 rounded-full" style={{ width: `${stats.percent}%` }} />
                        </div>

                        {stats.updatedAt && (
                          <p className="text-[11px] text-slate-400 font-medium">Last updated: {new Date(stats.updatedAt).toLocaleDateString()}</p>
                        )}
                      </>
                    )}
                  </div>
                </div>

                <Link href={`/academic-mgmt/syllabus/${classId}/${a._id}`} className="p-3 border-t border-border/50 bg-slate-50 dark:bg-slate-855/50 flex items-center justify-center gap-2 text-[13px] font-bold text-blue-500 group-hover:text-blue-600 dark:group-hover:text-blue-400 group-hover:bg-blue-50 dark:group-hover:bg-blue-900/20 transition-colors">
                  View Details <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
