"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/auth";
import { getAuthHeaders } from "@/lib/utils/session";
import {
  ArrowLeft, ClipboardList, BookOpen, BarChart2, CheckCircle,
  Edit, Loader2, Users, AlertTriangle, Calendar, Clock,
} from "lucide-react";

const STATUS_STYLES: Record<string, { bg: string; text: string; dot: string; label: string }> = {
  draft:     { bg: "bg-slate-100 dark:bg-slate-800", text: "text-slate-600 dark:text-slate-400", dot: "bg-slate-400", label: "Draft" },
  scheduled: { bg: "bg-blue-50 dark:bg-blue-500/10", text: "text-blue-600 dark:text-blue-400", dot: "bg-blue-500", label: "Scheduled" },
  ongoing:   { bg: "bg-amber-50 dark:bg-amber-500/10", text: "text-amber-600 dark:text-amber-400", dot: "bg-amber-500 animate-pulse", label: "Ongoing" },
  completed: { bg: "bg-purple-50 dark:bg-purple-500/10", text: "text-purple-600 dark:text-purple-400", dot: "bg-purple-500", label: "Completed" },
  published: { bg: "bg-emerald-50 dark:bg-emerald-500/10", text: "text-emerald-600 dark:text-emerald-400", dot: "bg-emerald-500", label: "Published ✓" },
};

export default function TestDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);
  const router = useRouter();
  const { user } = useAuth();
  const isAdmin = user?.role === "school_admin";
  const isTeacher = user?.role === "teacher";
  const canEdit = isAdmin || isTeacher;

  const [test, setTest] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPublishing, setIsPublishing] = useState(false);
  const [toast, setToast] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const showToast = (type: "success" | "error", text: string) => {
    setToast({ type, text });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    const fetchTest = async () => {
      try {
        const res = await fetch(`/api/assessments/${id}`, { headers: getAuthHeaders() });
        const data = await res.json();
        if (data.success) setTest(data.data);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTest();
  }, [id]);

  const handlePublish = async () => {
    setIsPublishing(true);
    try {
      const res = await fetch(`/api/assessments/${id}/publish`, {
        method: "POST", headers: getAuthHeaders(),
      });
      const data = await res.json();
      if (data.success) {
        showToast("success", "Results published successfully!");
        setTest((prev: any) => prev ? { ...prev, is_published: true, computedStatus: "published" } : prev);
      } else {
        showToast("error", data.message || "Failed to publish");
      }
    } finally {
      setIsPublishing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!test) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-center">
        <AlertTriangle className="w-12 h-12 text-slate-300 dark:text-slate-600 mb-4" />
        <p className="text-[14px] font-semibold text-slate-700 dark:text-slate-300">Test not found</p>
        <Link href="/assessments" className="mt-4 text-[13px] text-primary hover:underline">← Back to Tests</Link>
      </div>
    );
  }

  const statusStyle = STATUS_STYLES[test.computedStatus] || STATUS_STYLES.scheduled;
  const classLabel = test.class_id
    ? `${test.class_id.name}${test.class_id.section ? ` — ${test.class_id.section}` : ""}`
    : "—";

  const stats = [
    { label: "Total Students", value: test.totalStudents ?? "—", icon: Users, color: "text-blue-500", bg: "bg-blue-50 dark:bg-blue-500/10" },
    { label: "Marks Entered", value: test.marksEntered ?? 0, icon: CheckCircle, color: "text-emerald-500", bg: "bg-emerald-50 dark:bg-emerald-500/10" },
    { label: "Pending Marks", value: test.pendingMarks ?? "—", icon: ClipboardList, color: "text-amber-500", bg: "bg-amber-50 dark:bg-amber-500/10" },
    { label: "Total Marks", value: test.total_marks, icon: BarChart2, color: "text-purple-500", bg: "bg-purple-50 dark:bg-purple-500/10" },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-5 right-5 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-lg text-[13px] font-medium ${
          toast.type === "success"
            ? "bg-emerald-50 border border-emerald-200 text-emerald-700 dark:bg-emerald-500/10 dark:border-emerald-500/30 dark:text-emerald-400"
            : "bg-rose-50 border border-rose-200 text-rose-700 dark:bg-rose-500/10 dark:border-rose-500/30 dark:text-rose-400"
        }`}>
          {toast.text}
        </div>
      )}

      {/* Header */}
      <div className="flex items-start gap-3">
        <button onClick={() => router.back()}
          className="p-2 rounded-xl border border-border text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer mt-0.5">
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-3 mb-1">
            <h1 className="text-[20px] font-bold text-slate-900 dark:text-slate-100 truncate">{test.title}</h1>
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold ${statusStyle.bg} ${statusStyle.text}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${statusStyle.dot}`} />
              {statusStyle.label}
            </span>
          </div>
          <p className="text-[13px] text-slate-500 dark:text-slate-400">
            {classLabel} · {test.subject_id?.name || "—"}
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {canEdit && (
            <Link href={`/assessments/create?edit=${test._id}`}
              className="flex items-center gap-1.5 px-3 py-2 border border-border rounded-xl text-[12px] font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
              <Edit className="w-3.5 h-3.5" /> Edit
            </Link>
          )}
          {canEdit && (
            <Link href={`/assessments/${id}/marks`}
              className="flex items-center gap-1.5 px-3 py-2 border border-border rounded-xl text-[12px] font-semibold text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-500/10 transition-colors">
              <BookOpen className="w-3.5 h-3.5" /> Enter Marks
            </Link>
          )}
          {canEdit && !test.is_published && test.computedStatus !== "draft" && test.computedStatus !== "scheduled" && (
            <button onClick={handlePublish} disabled={isPublishing}
              className="flex items-center gap-1.5 px-3 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-[12px] font-semibold transition-colors disabled:opacity-70 cursor-pointer">
              {isPublishing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle className="w-3.5 h-3.5" />}
              Publish Results
            </button>
          )}
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="bg-white dark:bg-slate-900 border border-border rounded-2xl p-4 shadow-sm">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-3 ${s.bg}`}>
                <Icon className={`w-5 h-5 ${s.color}`} />
              </div>
              <p className="text-[22px] font-bold text-slate-900 dark:text-slate-100">{s.value}</p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{s.label}</p>
            </div>
          );
        })}
      </div>

      {/* Test Info Card */}
      <div className="bg-white dark:bg-slate-900 border border-border rounded-2xl p-6 shadow-sm">
        <h2 className="text-[14px] font-bold text-slate-800 dark:text-slate-200 mb-4 flex items-center gap-2">
          <ClipboardList className="w-4 h-4 text-primary" /> Test Details
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[
            { label: "Class", value: classLabel },
            { label: "Subject", value: test.subject_id?.name || "—" },
            { label: "Test Date", value: new Date(test.test_date).toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" }) },
            { label: "Time", value: `${test.start_time} – ${test.end_time}` },
            { label: "Total Marks", value: String(test.total_marks) },
            { label: "Passing Marks", value: String(test.passing_marks) },
            { label: "Chapter", value: test.chapter || "—" },
            { label: "Academic Year", value: test.academic_year || "—" },
            { label: "Created By", value: test.teacher_id?.name || "—" },
            { label: "Created On", value: new Date(test.createdAt).toLocaleDateString("en-IN") },
          ].map((item) => (
            <div key={item.label}>
              <p className="text-[11px] text-slate-400 dark:text-slate-500 uppercase tracking-wider font-semibold">{item.label}</p>
              <p className="text-[14px] font-semibold text-slate-800 dark:text-slate-200 mt-0.5">{item.value}</p>
            </div>
          ))}
        </div>

        {test.description && (
          <div className="mt-5 pt-5 border-t border-border">
            <p className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold mb-1.5">Description</p>
            <p className="text-[13px] text-slate-600 dark:text-slate-400 leading-relaxed">{test.description}</p>
          </div>
        )}
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {canEdit && (
          <Link href={`/assessments/${id}/marks`}
            className="flex items-center gap-3 p-4 bg-white dark:bg-slate-900 border border-border rounded-2xl shadow-sm hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-md transition-all group">
            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <p className="text-[13px] font-semibold text-slate-800 dark:text-slate-200 group-hover:text-blue-600">Enter Marks</p>
              <p className="text-[11px] text-slate-400">{test.pendingMarks ?? 0} pending</p>
            </div>
          </Link>
        )}
        <Link href={`/assessments/${id}/results`}
          className="flex items-center gap-3 p-4 bg-white dark:bg-slate-900 border border-border rounded-2xl shadow-sm hover:border-emerald-300 dark:hover:border-emerald-700 hover:shadow-md transition-all group">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center">
            <CheckCircle className="w-5 h-5 text-emerald-500" />
          </div>
          <div>
            <p className="text-[13px] font-semibold text-slate-800 dark:text-slate-200 group-hover:text-emerald-600">View Results</p>
            <p className="text-[11px] text-slate-400">{test.marksEntered ?? 0} entries</p>
          </div>
        </Link>
        <Link href={`/assessments/${id}/analytics`}
          className="flex items-center gap-3 p-4 bg-white dark:bg-slate-900 border border-border rounded-2xl shadow-sm hover:border-purple-300 dark:hover:border-purple-700 hover:shadow-md transition-all group">
          <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-500/10 flex items-center justify-center">
            <BarChart2 className="w-5 h-5 text-purple-500" />
          </div>
          <div>
            <p className="text-[13px] font-semibold text-slate-800 dark:text-slate-200 group-hover:text-purple-600">Analytics</p>
            <p className="text-[11px] text-slate-400">Performance overview</p>
          </div>
        </Link>
      </div>
    </div>
  );
}
