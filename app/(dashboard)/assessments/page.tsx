"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/auth";
import { getAuthHeaders } from "@/lib/utils/session";
import {
  Plus, Search, Filter, Eye, Edit, Trash2, CheckCircle, ClipboardList,
  ChevronLeft, ChevronRight, Loader2, AlertCircle, BookOpen, BarChart2,
} from "lucide-react";

const STATUS_STYLES: Record<string, { bg: string; text: string; label: string }> = {
  draft:      { bg: "bg-slate-500/10", text: "text-slate-500", label: "Draft" },
  scheduled:  { bg: "bg-blue-500/10",  text: "text-blue-600 dark:text-blue-400", label: "Scheduled" },
  ongoing:    { bg: "bg-amber-500/10", text: "text-amber-600 dark:text-amber-400", label: "Ongoing" },
  completed:  { bg: "bg-purple-500/10",text: "text-purple-600 dark:text-purple-400", label: "Completed" },
  published:  { bg: "bg-emerald-500/10",text: "text-emerald-600 dark:text-emerald-400", label: "Published" },
};

const STATUS_OPTIONS = ["All", "draft", "scheduled", "ongoing", "completed", "published"];

interface Test {
  _id: string;
  title: string;
  class_id: { _id: string; name: string; section: string } | null;
  subject_id: { _id: string; name: string } | null;
  teacher_id: { _id: string; name: string } | null;
  test_date: string;
  start_time: string;
  end_time: string;
  total_marks: number;
  passing_marks: number;
  is_published: boolean;
  computedStatus: string;
}

export default function AssessmentsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const isAdmin = user?.role === "school_admin";
  const isTeacher = user?.role === "teacher";
  const canCreate = isAdmin || isTeacher;

  const [tests, setTests] = useState<Test[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [publishingId, setPublishingId] = useState<string | null>(null);
  const [toastMsg, setToastMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const showToast = (type: "success" | "error", text: string) => {
    setToastMsg({ type, text });
    setTimeout(() => setToastMsg(null), 3500);
  };

  const fetchTests = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), limit: "20" });
      if (search.trim()) params.set("search", search.trim());
      if (statusFilter !== "All") params.set("status", statusFilter);

      const res = await fetch(`/api/assessments?${params}`, { headers: getAuthHeaders() });
      const data = await res.json();
      if (data.success) {
        setTests(data.data);
        setTotalPages(data.pagination.pages || 1);
        setTotalCount(data.pagination.total || 0);
      }
    } catch {
      showToast("error", "Failed to load tests");
    } finally {
      setIsLoading(false);
    }
  }, [page, search, statusFilter]);

  useEffect(() => { fetchTests(); }, [fetchTests]);

  // debounce search
  useEffect(() => { setPage(1); }, [search, statusFilter]);

  const handleDelete = async () => {
    if (!deleteId) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/assessments/${deleteId}`, {
        method: "DELETE", headers: getAuthHeaders(),
      });
      const data = await res.json();
      if (data.success) {
        showToast("success", "Test deleted successfully");
        fetchTests();
      } else {
        showToast("error", data.message || "Delete failed");
      }
    } finally {
      setIsDeleting(false);
      setDeleteId(null);
    }
  };

  const handlePublish = async (id: string) => {
    setPublishingId(id);
    try {
      const res = await fetch(`/api/assessments/${id}/publish`, {
        method: "POST", headers: getAuthHeaders(),
      });
      const data = await res.json();
      if (data.success) {
        showToast("success", "Results published successfully!");
        fetchTests();
      } else {
        showToast("error", data.message || "Publish failed");
      }
    } finally {
      setPublishingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toastMsg && (
        <div className={`fixed top-5 right-5 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-lg text-[13px] font-medium transition-all ${
          toastMsg.type === "success"
            ? "bg-emerald-50 border border-emerald-200 text-emerald-700 dark:bg-emerald-500/10 dark:border-emerald-500/30 dark:text-emerald-400"
            : "bg-rose-50 border border-rose-200 text-rose-700 dark:bg-rose-500/10 dark:border-rose-500/30 dark:text-rose-400"
        }`}>
          {toastMsg.type === "success" ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
          {toastMsg.text}
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 border border-border rounded-2xl shadow-xl p-6 max-w-sm w-full mx-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-rose-50 dark:bg-rose-500/10 flex items-center justify-center">
                <Trash2 className="w-5 h-5 text-rose-500" />
              </div>
              <h2 className="text-[16px] font-bold text-slate-900 dark:text-slate-100">Delete Test?</h2>
            </div>
            <p className="text-[13px] text-slate-500 dark:text-slate-400 mb-6">
              This will permanently delete the test and all marks entries. This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteId(null)}
                className="flex-1 px-4 py-2.5 rounded-xl border border-border text-[13px] font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer">
                Cancel
              </button>
              <button onClick={handleDelete} disabled={isDeleting}
                className="flex-1 px-4 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-[13px] font-semibold transition-colors disabled:opacity-70 cursor-pointer flex items-center justify-center gap-2">
                {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-[22px] font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <ClipboardList className="w-6 h-6 text-primary" />
            Assessments
          </h1>
          <p className="text-[13px] text-slate-500 dark:text-slate-400 mt-0.5">
            Manage class tests and assessments
          </p>
        </div>
        {canCreate && (
          <Link href="/assessments/create"
            className="flex items-center gap-2 px-4 py-2.5 bg-primary hover:bg-primary/90 text-white rounded-xl text-[13px] font-semibold transition-colors shadow-sm">
            <Plus className="w-4 h-4" /> Create Test
          </Link>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[200px] max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search tests..."
            className="w-full pl-9 pr-4 py-2.5 bg-white dark:bg-slate-800 border border-border rounded-xl text-[13px] outline-none focus:border-primary transition-colors"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2.5 bg-white dark:bg-slate-800 border border-border rounded-xl text-[13px] outline-none focus:border-primary transition-colors cursor-pointer">
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>{s === "All" ? "All Status" : STATUS_STYLES[s]?.label || s}</option>
            ))}
          </select>
        </div>
        <span className="text-[12px] text-slate-400 dark:text-slate-500 ml-auto">
          {totalCount} test{totalCount !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-slate-900 border border-border rounded-2xl overflow-hidden shadow-sm">
        {isLoading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : tests.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-16 h-16 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center mb-4">
              <ClipboardList className="w-8 h-8 text-slate-300 dark:text-slate-600" />
            </div>
            <p className="text-[14px] font-semibold text-slate-700 dark:text-slate-300">No tests found</p>
            <p className="text-[12px] text-slate-400 dark:text-slate-500 mt-1">
              {canCreate ? "Create your first test to get started." : "No tests available yet."}
            </p>
            {canCreate && (
              <Link href="/assessments/create"
                className="mt-4 flex items-center gap-1.5 px-4 py-2 bg-primary text-white rounded-xl text-[13px] font-semibold">
                <Plus className="w-4 h-4" /> Create Test
              </Link>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-slate-50/50 dark:bg-slate-800/30">
                  {["Test Title", "Class", "Subject", "Date & Time", "Marks", "Created By", "Status", "Actions"].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {tests.map((t) => {
                  const statusStyle = STATUS_STYLES[t.computedStatus] || STATUS_STYLES.scheduled;
                  const classLabel = t.class_id
                    ? `${t.class_id.name}${t.class_id.section ? ` — ${t.class_id.section}` : ""}`
                    : "—";
                  return (
                    <tr key={t._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors">
                      <td className="px-4 py-3">
                        <Link href={`/assessments/${t._id}`}
                          className="text-[13px] font-semibold text-slate-800 dark:text-slate-200 hover:text-primary transition-colors">
                          {t.title}
                        </Link>
                      </td>
                      <td className="px-4 py-3 text-[13px] text-slate-600 dark:text-slate-400 whitespace-nowrap">
                        {classLabel}
                      </td>
                      <td className="px-4 py-3 text-[13px] text-slate-600 dark:text-slate-400">
                        {t.subject_id?.name || "—"}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <p className="text-[13px] font-medium text-slate-700 dark:text-slate-300">
                          {new Date(t.test_date).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                        </p>
                        <p className="text-[11px] text-slate-400 dark:text-slate-500">
                          {t.start_time} – {t.end_time}
                        </p>
                      </td>
                      <td className="px-4 py-3 text-[13px] text-slate-600 dark:text-slate-400 whitespace-nowrap">
                        <span className="font-semibold text-slate-800 dark:text-slate-200">{t.total_marks}</span>
                        <span className="text-slate-400"> / Pass: {t.passing_marks}</span>
                      </td>
                      <td className="px-4 py-3 text-[13px] text-slate-500 dark:text-slate-400">
                        {t.teacher_id?.name || "—"}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold ${statusStyle.bg} ${statusStyle.text}`}>
                          {statusStyle.label}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5">
                          {/* View */}
                          <Link href={`/assessments/${t._id}`} title="View Details"
                            className="p-1.5 text-slate-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors">
                            <Eye className="w-4 h-4" />
                          </Link>
                          {/* Enter Marks */}
                          {(isAdmin || isTeacher) && (
                            <Link href={`/assessments/${t._id}/marks`} title="Enter Marks"
                              className="p-1.5 text-slate-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-lg transition-colors">
                              <BookOpen className="w-4 h-4" />
                            </Link>
                          )}
                          {/* Analytics */}
                          <Link href={`/assessments/${t._id}/analytics`} title="Analytics"
                            className="p-1.5 text-slate-400 hover:text-purple-500 hover:bg-purple-50 dark:hover:bg-purple-500/10 rounded-lg transition-colors">
                            <BarChart2 className="w-4 h-4" />
                          </Link>
                          {/* Publish */}
                          {(isAdmin || isTeacher) && !t.is_published && t.computedStatus !== "draft" && t.computedStatus !== "scheduled" && (
                            <button
                              onClick={() => handlePublish(t._id)}
                              disabled={publishingId === t._id}
                              title="Publish Results"
                              className="p-1.5 text-slate-400 hover:text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 rounded-lg transition-colors disabled:opacity-50">
                              {publishingId === t._id ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                            </button>
                          )}
                          {/* Edit */}
                          {(isAdmin || isTeacher) && (
                            <Link href={`/assessments/create?edit=${t._id}`} title="Edit"
                              className="p-1.5 text-slate-400 hover:text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-500/10 rounded-lg transition-colors">
                              <Edit className="w-4 h-4" />
                            </Link>
                          )}
                          {/* Delete (admin only) */}
                          {isAdmin && (
                            <button onClick={() => setDeleteId(t._id)} title="Delete"
                              className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-lg transition-colors cursor-pointer">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-border bg-slate-50/30 dark:bg-slate-800/20">
            <p className="text-[12px] text-slate-500 dark:text-slate-400">
              Page {page} of {totalPages}
            </p>
            <div className="flex gap-2">
              <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}
                className="p-2 rounded-lg border border-border text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40 transition-colors cursor-pointer">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                className="p-2 rounded-lg border border-border text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40 transition-colors cursor-pointer">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
