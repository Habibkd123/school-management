"use client";

import React, { useState, useEffect } from "react";
import {
  Plus, Search, RefreshCcw, Printer, Download, ChevronDown,
  MoreVertical, Edit, Trash2, Calendar, Filter, ArrowUpDown,
  FileText, Loader2, AlertCircle, CheckCircle2, X, BookOpen
} from "lucide-react";
import { Modal } from "../../components/ui/modal";
import { DataTable, ColumnDef } from "@/app/components/ui/data-table";
import { useClasses, ApiClass } from "../../hooks/useClasses";

// ─── Toast ────────────────────────────────────────────────────────
interface Toast { type: "success" | "error"; message: string; }

function ToastNotif({ toast, onClose }: { toast: Toast; onClose: () => void }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3500);
    return () => clearTimeout(t);
  }, [onClose]);
  return (
    <div className={`fixed bottom-6 right-6 z-[200] flex items-center gap-3 px-4 py-3.5 rounded-xl shadow-2xl text-white text-[13px] font-semibold
      ${toast.type === "success" ? "bg-emerald-500" : "bg-red-500"}`}
    >
      {toast.type === "success"
        ? <CheckCircle2 className="w-4 h-4 shrink-0" />
        : <AlertCircle className="w-4 h-4 shrink-0" />}
      <span>{toast.message}</span>
      <button onClick={onClose} className="ml-2 hover:opacity-75 transition-opacity">
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

// ─── Confirm Delete Modal ─────────────────────────────────────────
function ConfirmDeleteModal({
  isOpen, onClose, onConfirm, label, isDeleting
}: {
  isOpen: boolean; onClose: () => void; onConfirm: () => void;
  label: string; isDeleting: boolean;
}) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white dark:bg-slate-900 border border-border rounded-2xl shadow-2xl p-6 w-full max-w-sm z-10">
        <div className="flex flex-col items-center text-center gap-3">
          <div className="w-14 h-14 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
            <Trash2 className="w-6 h-6 text-red-500" />
          </div>
          <h3 className="text-[16px] font-bold text-[#0F172A] dark:text-slate-100">Delete Class?</h3>
          <p className="text-[13px] text-slate-500 dark:text-slate-400">
            Delete <span className="font-bold text-[#0F172A] dark:text-slate-200">{label}</span>? This cannot be undone.
          </p>
        </div>
        <div className="flex gap-3 mt-6">
          <button onClick={onClose} className="flex-1 px-4 py-2.5 bg-slate-100 dark:bg-slate-800 text-[#0F172A] dark:text-slate-100 text-[13px] font-bold rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
            Cancel
          </button>
          <button onClick={onConfirm} disabled={isDeleting}
            className="flex-1 px-4 py-2.5 bg-red-500 hover:bg-red-600 text-white text-[13px] font-bold rounded-xl transition-colors disabled:opacity-70 flex items-center justify-center gap-2"
          >
            {isDeleting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Class Form (shared for Add & Edit) ──────────────────────────
interface ClassForm { name: string; section: string; academic_year: string; capacity: string; }

function ClassFormFields({ form, onChange }: {
  form: ClassForm;
  onChange: (f: ClassForm) => void;
}) {
  const inputCls = "w-full px-3.5 py-2.5 border border-border rounded-lg text-[13px] outline-none focus:border-[#F59E0B]/60 focus:ring-2 focus:ring-[#F59E0B]/10 transition-all shadow-sm bg-white dark:bg-slate-800 dark:text-slate-100";
  const labelCls = "text-[13px] font-semibold text-[#0F172A] dark:text-slate-100";

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-1.5">
        <label className={labelCls}>Class Name <span className="text-red-500">*</span></label>
        <input
          type="text"
          placeholder="e.g. Class 1, Grade A, 10th"
          value={form.name}
          onChange={(e) => onChange({ ...form, name: e.target.value })}
          className={inputCls}
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label className={labelCls}>Section</label>
          <div className="relative">
            <select
              value={form.section}
              onChange={(e) => onChange({ ...form, section: e.target.value })}
              className={inputCls + " appearance-none pr-9"}
            >
              {["A", "B", "C", "D", "E", "F"].map(s => <option key={s}>{s}</option>)}
            </select>
            <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-3 pointer-events-none" />
          </div>
        </div>
        <div className="flex flex-col gap-1.5">
          <label className={labelCls}>Capacity</label>
          <input
            type="number"
            min="1"
            max="200"
            value={form.capacity}
            onChange={(e) => onChange({ ...form, capacity: e.target.value })}
            className={inputCls}
          />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className={labelCls}>Academic Year <span className="text-red-500">*</span></label>
        <input
          type="text"
          placeholder="e.g. 2025-2026"
          value={form.academic_year}
          onChange={(e) => onChange({ ...form, academic_year: e.target.value })}
          className={inputCls}
          required
        />
        <p className="text-[11px] text-slate-400 dark:text-slate-500">Format: YYYY-YYYY</p>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────
const CURRENT_YEAR = `${new Date().getFullYear()}-${new Date().getFullYear() + 1}`;
const EMPTY_FORM: ClassForm = { name: "", section: "A", academic_year: CURRENT_YEAR, capacity: "40" };

export default function ClassesPage() {
  const {
    classes, pagination, isLoading, error,
    updateFilters, refetch, addClass, updateClass, deleteClass,
  } = useClasses();

  // ── UI state ────────────────────────────────────────────────────
  const [search, setSearch]               = useState("");
  const [actionMenuId, setActionMenuId]   = useState<string | null>(null);
  const [toast, setToast]                 = useState<Toast | null>(null);

  // ── Popover states ───────────────────────────────────────────────
  const [isExportOpen, setIsExportOpen]         = useState(false);
  const [isDateRangeOpen, setIsDateRangeOpen]   = useState(false);
  const [selectedDateRange, setSelectedDateRange] = useState("Last 7 Days");
  const [isFilterOpen, setIsFilterOpen]         = useState(false);
  const [isSortOpen, setIsSortOpen]             = useState(false);
  const [selectedSort, setSelectedSort]         = useState("Ascending");

  // ── Add Modal ───────────────────────────────────────────────────
  const [isAddOpen, setIsAddOpen]   = useState(false);
  const [addLoading, setAddLoading] = useState(false);
  const [addForm, setAddForm]       = useState<ClassForm>(EMPTY_FORM);

  // ── Edit Modal ──────────────────────────────────────────────────
  const [editTarget, setEditTarget]   = useState<ApiClass | null>(null);
  const [editLoading, setEditLoading] = useState(false);
  const [editForm, setEditForm]       = useState<ClassForm>(EMPTY_FORM);

  // ── Delete Modal ─────────────────────────────────────────────────
  const [deleteTarget, setDeleteTarget]   = useState<ApiClass | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // ── Search debounce ──────────────────────────────────────────────
  useEffect(() => {
    const t = setTimeout(() => updateFilters({ search }), 400);
    return () => clearTimeout(t);
  }, [search]);

  const showToast = (type: "success" | "error", message: string) => setToast({ type, message });

  // ── ADD ──────────────────────────────────────────────────────────
  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addForm.name.trim() || !addForm.academic_year.trim()) {
      showToast("error", "Class Name and Academic Year are required"); return;
    }
    setAddLoading(true);
    const result = await addClass({
      name:          addForm.name.trim(),
      section:       addForm.section,
      academic_year: addForm.academic_year.trim(),
      capacity:      Number(addForm.capacity) || 40,
    });
    setAddLoading(false);
    if (result.success) {
      setIsAddOpen(false);
      setAddForm(EMPTY_FORM);
      showToast("success", "Class added successfully!");
    } else {
      showToast("error", result.message);
    }
  };

  // ── EDIT open ────────────────────────────────────────────────────
  const openEdit = (c: ApiClass) => {
    setEditTarget(c);
    setEditForm({ name: c.name, section: c.section, academic_year: c.academic_year, capacity: String(c.capacity) });
    setActionMenuId(null);
  };

  // ── EDIT submit ──────────────────────────────────────────────────
  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editTarget) return;
    setEditLoading(true);
    const result = await updateClass(editTarget._id, {
      name:          editForm.name.trim(),
      section:       editForm.section,
      academic_year: editForm.academic_year.trim(),
      capacity:      Number(editForm.capacity) || 40,
    });
    setEditLoading(false);
    if (result.success) {
      setEditTarget(null);
      showToast("success", "Class updated successfully!");
    } else {
      showToast("error", result.message);
    }
  };

  // ── DELETE ───────────────────────────────────────────────────────
  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleteLoading(true);
    const result = await deleteClass(deleteTarget._id);
    setDeleteLoading(false);
    if (result.success) {
      setDeleteTarget(null);
      showToast("success", "Class deleted successfully!");
    } else {
      showToast("error", result.message);
    }
  };

  // ── Columns ──────────────────────────────────────────────────────
  const columns: ColumnDef<ApiClass>[] = [
    {
      header: "Class Name",
      accessorKey: "name",
      render: (c) => <span className="font-bold text-[#F59E0B]">{c.name}</span>,
    },
    { header: "Section",       accessorKey: "section" },
    { header: "Academic Year", accessorKey: "academic_year" },
    {
      header: "Capacity",
      accessorKey: "capacity",
      render: (c) => (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-700/40">
          {c.capacity} students
        </span>
      ),
    },
    {
      header: "Class Teacher",
      accessorKey: "class_teacher_id",
      render: (c) => (
        c.class_teacher_id
          ? <span className="text-[13px] font-medium text-slate-700 dark:text-slate-200">{c.class_teacher_id.name}</span>
          : <span className="text-[12px] italic text-slate-400 dark:text-slate-500">Not assigned</span>
      ),
    },
    {
      header: "Action",
      sortable: false,
      render: (c) => (
        <div className="relative">
          <button
            onClick={() => setActionMenuId(actionMenuId === c._id ? null : c._id)}
            className="p-1 text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-200 transition-colors rounded"
          >
            <MoreVertical className="w-4 h-4" />
          </button>
          {actionMenuId === c._id && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setActionMenuId(null)} />
              <div className="absolute right-8 top-0 w-36 bg-white dark:bg-slate-900 border border-border rounded-xl shadow-xl z-50 overflow-hidden py-1.5">
                <button
                  onClick={() => openEdit(c)}
                  className="w-full px-4 py-2 text-[13px] font-semibold text-[#0F172A] dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800/50 flex items-center gap-2 transition-colors text-left"
                >
                  <Edit className="w-3.5 h-3.5 text-[#F59E0B]" /> Edit
                </button>
                <button
                  onClick={() => { setDeleteTarget(c); setActionMenuId(null); }}
                  className="w-full px-4 py-2 text-[13px] font-semibold text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2 transition-colors text-left"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Delete
                </button>
              </div>
            </>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toast && <ToastNotif toast={toast} onClose={() => setToast(null)} />}

      {/* Delete Confirm */}
      <ConfirmDeleteModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        label={deleteTarget ? `${deleteTarget.name} - Section ${deleteTarget.section}` : ""}
        isDeleting={deleteLoading}
      />

      {/* ── Header ──────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-left">
        <div>
          <h1 className="text-[20px] leading-[24px] font-bold text-[#0F172A] dark:text-slate-100">Classes List</h1>
          <div className="flex items-center gap-2 text-[14px] leading-[21px] text-[#68718a] mt-1 font-medium">
            <span>Dashboard</span><span>/</span>
            <span>Classes</span><span>/</span>
            <span className="text-[#0F172A] dark:text-slate-100">All Classes</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={refetch}
            title="Refresh"
            className="p-2 border border-border rounded-lg bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 shadow-sm transition-colors"
          >
            <RefreshCcw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
          </button>
          <button className="p-2 border border-border rounded-lg bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 shadow-sm transition-colors">
            <Printer className="w-4 h-4" />
          </button>

          {/* Export */}
          <div className="relative">
            <button
              onClick={() => setIsExportOpen(!isExportOpen)}
              className="flex items-center gap-2 px-3 py-2 border border-border rounded-lg bg-white dark:bg-slate-900 text-[13px] font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/50 shadow-sm transition-colors"
            >
              <Download className="w-4 h-4" /><span>Export</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>
            {isExportOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setIsExportOpen(false)} />
                <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-slate-900 border border-border rounded-lg shadow-lg z-50 overflow-hidden py-2">
                  {["Export as PDF", "Export as Excel"].map((item) => (
                    <button key={item} onClick={() => setIsExportOpen(false)}
                      className="w-full px-4 py-2.5 text-[14px] font-medium text-[#0F172A] dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800/50 flex items-center gap-3 transition-colors"
                    >
                      <FileText className="w-4 h-4 text-slate-400" />{item}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          <button
            onClick={() => { setAddForm(EMPTY_FORM); setIsAddOpen(true); }}
            className="flex items-center gap-2 px-4 py-2 bg-[#F59E0B] hover:bg-[#D97706] text-white text-[13px] font-bold rounded-lg shadow-sm transition-colors"
          >
            <Plus className="w-4 h-4" /><span>Add Class</span>
          </button>
        </div>
      </div>

      {/* ── Table Card ──────────────────────────────────────────── */}
      <div className="bg-white dark:bg-slate-900 border border-border rounded-xl card-shadow">
        {/* Top bar */}
        <div className="p-5 border-b border-border flex flex-col xl:flex-row xl:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <h3 className="text-[16px] font-bold text-slate-900 dark:text-white">Classes List</h3>
            {!isLoading && (
              <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-[#F59E0B]/10 text-[#F59E0B]">
                {pagination.total} total
              </span>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Date Range */}
            <div className="relative">
              <button onClick={() => setIsDateRangeOpen(!isDateRangeOpen)}
                className="flex items-center gap-2 px-3 py-2 border border-border rounded-lg bg-white dark:bg-slate-900 text-[13px] font-medium text-slate-600 dark:text-slate-300 shadow-sm hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
              >
                <Calendar className="w-4 h-4 text-slate-400" />
                <span>{selectedDateRange}</span>
              </button>
              {isDateRangeOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsDateRangeOpen(false)} />
                  <div className="absolute left-0 top-full mt-2 w-44 bg-white dark:bg-slate-900 border border-border rounded-lg shadow-lg z-50 overflow-hidden py-1.5">
                    {["Today", "Yesterday", "Last 7 Days", "Last 30 Days", "This Year"].map((item) => (
                      <button key={item}
                        onClick={() => { setSelectedDateRange(item); setIsDateRangeOpen(false); }}
                        className={`w-full px-4 py-2 text-[13px] text-left transition-colors ${item === selectedDateRange ? "bg-[#F59E0B] text-white font-semibold" : "text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50"}`}
                      >{item}</button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Filter */}
            <div className="relative">
              <button onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="flex items-center gap-2 px-3 py-2 border border-border rounded-lg bg-white dark:bg-slate-900 text-[13px] font-medium text-slate-600 dark:text-slate-300 shadow-sm hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
              >
                <Filter className="w-4 h-4 text-slate-400" /><span>Filter</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>
              {isFilterOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsFilterOpen(false)} />
                  <div className="absolute right-0 top-full mt-2 w-60 bg-white dark:bg-slate-900 border border-border rounded-xl shadow-xl z-50">
                    <div className="p-4 border-b border-border">
                      <h3 className="text-[15px] font-bold text-[#0F172A] dark:text-slate-100">Filter</h3>
                    </div>
                    <div className="p-4 space-y-4">
                      <div className="space-y-1.5">
                        <label className="text-[13px] font-semibold text-[#0F172A] dark:text-slate-100">Section</label>
                        <div className="relative">
                          <select className="w-full px-3 py-2 border border-border rounded-lg text-[13px] outline-none appearance-none bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 font-medium">
                            <option>All</option>
                            {["A","B","C","D","E"].map(s => <option key={s}>{s}</option>)}
                          </select>
                          <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-2.5 pointer-events-none" />
                        </div>
                      </div>
                    </div>
                    <div className="p-4 flex justify-end gap-3 pt-2">
                      <button onClick={() => setIsFilterOpen(false)} className="px-5 py-2.5 bg-[#F1F5F9] dark:bg-slate-800 text-[#0F172A] dark:text-slate-100 text-[13px] font-bold rounded-lg">Reset</button>
                      <button onClick={() => setIsFilterOpen(false)} className="px-5 py-2.5 bg-[#F59E0B] hover:bg-[#D97706] text-white text-[13px] font-bold rounded-lg">Apply</button>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Sort */}
            <div className="relative">
              <button onClick={() => setIsSortOpen(!isSortOpen)}
                className="flex items-center gap-2 px-3 py-2 border border-border rounded-lg bg-white dark:bg-slate-900 text-[13px] font-medium text-slate-600 dark:text-slate-300 shadow-sm hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
              >
                <ArrowUpDown className="w-4 h-4 text-slate-400" /><span>Sort by A-Z</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>
              {isSortOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsSortOpen(false)} />
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-slate-900 border border-border rounded-lg shadow-lg z-50 overflow-hidden py-1.5">
                    {["Ascending", "Descending", "Recently Added"].map((item) => (
                      <button key={item}
                        onClick={() => { setSelectedSort(item); setIsSortOpen(false); }}
                        className={`w-full px-4 py-2.5 text-[14px] text-left font-medium transition-colors ${item === selectedSort ? "bg-[#F59E0B] text-white" : "text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/50"}`}
                      >{item}</button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Search bar */}
        <div className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/50">
          <div className="flex items-center gap-2 text-[13px] text-slate-500 dark:text-slate-400 font-medium">
            <span>Row Per Page</span>
            <select className="border border-border rounded-lg px-2 py-1 outline-none bg-white dark:bg-slate-900 font-semibold text-slate-700 dark:text-slate-200">
              <option>10</option><option>25</option><option>50</option>
            </select>
            <span>Entries</span>
          </div>
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search classes..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-3 py-2 border border-border rounded-lg text-[13px] outline-none w-full sm:w-64 focus:border-[#F59E0B]/50 transition-colors shadow-sm bg-[#F8FAFC] dark:bg-[#0F172A] dark:text-slate-100"
            />
          </div>
        </div>

        {/* Error state */}
        {error && (
          <div className="mx-5 mt-4 flex items-center gap-3 px-4 py-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
            <p className="text-[13px] text-red-600 dark:text-red-400">{error}</p>
            <button onClick={refetch} className="ml-auto text-[12px] font-bold text-red-600 dark:text-red-400 underline">Retry</button>
          </div>
        )}

        {/* Loading */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20 gap-3 text-slate-500 dark:text-slate-400">
            <Loader2 className="w-6 h-6 animate-spin text-[#F59E0B]" />
            <span className="text-[14px] font-medium">Loading classes...</span>
          </div>
        ) : classes.length === 0 ? (
          /* Empty state */
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="w-16 h-16 rounded-full bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center">
              <BookOpen className="w-7 h-7 text-[#F59E0B]" />
            </div>
            <div className="text-center">
              <p className="text-[15px] font-bold text-slate-700 dark:text-slate-200">No classes found</p>
              <p className="text-[13px] text-slate-400 dark:text-slate-500 mt-1">
                {search ? `No results for "${search}"` : 'Click "Add Class" to create the first class'}
              </p>
            </div>
            {!search && (
              <button
                onClick={() => { setAddForm(EMPTY_FORM); setIsAddOpen(true); }}
                className="flex items-center gap-2 px-4 py-2 bg-[#F59E0B] hover:bg-[#D97706] text-white text-[13px] font-bold rounded-lg shadow-sm transition-colors"
              >
                <Plus className="w-4 h-4" /> Add First Class
              </button>
            )}
          </div>
        ) : (
          <DataTable
            columns={columns}
            data={classes}
            selectionHeader={<input type="checkbox" className="rounded border-slate-300 text-[#F59E0B] focus:ring-[#F59E0B] w-4 h-4" />}
            renderSelection={() => <input type="checkbox" className="rounded border-slate-300 text-[#F59E0B] focus:ring-[#F59E0B] w-4 h-4" />}
          />
        )}
      </div>

      {/* ── ADD CLASS MODAL ──────────────────────────────────────── */}
      <Modal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} title="Add New Class">
        <form onSubmit={handleAdd} className="space-y-5 text-left">
          <ClassFormFields form={addForm} onChange={setAddForm} />
          <div className="flex justify-end gap-3 pt-4 border-t border-border/50">
            <button type="button" onClick={() => setIsAddOpen(false)}
              className="px-5 py-2.5 bg-[#F1F5F9] dark:bg-slate-800 hover:bg-[#E2E8F0] text-[#0F172A] dark:text-slate-100 text-[14px] font-bold rounded-lg transition-colors"
            >Cancel</button>
            <button type="submit" disabled={addLoading}
              className="px-5 py-2.5 bg-[#F59E0B] hover:bg-[#D97706] text-white text-[14px] font-bold rounded-lg shadow-sm transition-colors disabled:opacity-70 flex items-center gap-2"
            >
              {addLoading && <Loader2 className="w-4 h-4 animate-spin" />}
              Add Class
            </button>
          </div>
        </form>
      </Modal>

      {/* ── EDIT CLASS MODAL ─────────────────────────────────────── */}
      <Modal isOpen={!!editTarget} onClose={() => setEditTarget(null)} title="Edit Class">
        <form onSubmit={handleEdit} className="space-y-5 text-left">
          <ClassFormFields form={editForm} onChange={setEditForm} />
          <div className="flex justify-end gap-3 pt-4 border-t border-border/50">
            <button type="button" onClick={() => setEditTarget(null)}
              className="px-5 py-2.5 bg-[#F1F5F9] dark:bg-slate-800 hover:bg-[#E2E8F0] text-[#0F172A] dark:text-slate-100 text-[14px] font-bold rounded-lg transition-colors"
            >Cancel</button>
            <button type="submit" disabled={editLoading}
              className="px-5 py-2.5 bg-[#F59E0B] hover:bg-[#D97706] text-white text-[14px] font-bold rounded-lg shadow-sm transition-colors disabled:opacity-70 flex items-center gap-2"
            >
              {editLoading && <Loader2 className="w-4 h-4 animate-spin" />}
              Save Changes
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
