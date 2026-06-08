"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useAppState, Teacher } from "../../context/store";
import { Modal } from "../../components/ui/modal";
import { DataTable, ColumnDef } from "@/app/components/ui/data-table";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Phone,
  Mail,
  User,
  GraduationCap,
  Calendar,
  BookOpen,
  Briefcase,
  ChevronDown,
  RefreshCcw,
  Printer,
  Download,
  Filter,
  Grid,
  List,
  ArrowDownAZ,
  MoreVertical,
  AlignLeft,
  Lock,
  ToggleRight,
  FileText
} from "lucide-react";

export default function TeachersPage() {
  const router = useRouter();
  const {
    activeRole,
    teachers,
    classes,
    addTeacher,
    updateTeacher,
    deleteTeacher
  } = useAppState();

  const [search, setSearch] = useState("");
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
  const [actionMenuId, setActionMenuId] = useState<string | null>(null);
  const [isLoginDetailsOpen, setIsLoginDetailsOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"list" | "grid">("grid");

  // Popover states
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isDateRangeOpen, setIsDateRangeOpen] = useState(false);
  const [selectedDateRange, setSelectedDateRange] = useState("Last 7 Days");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [selectedSort, setSelectedSort] = useState("Ascending");

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to dismiss/delete this teacher?")) {
      deleteTeacher(id);
    }
  };

  const filteredTeachers = teachers.filter((t) => {
    const matchesSearch =
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.email.toLowerCase().includes(search.toLowerCase()) ||
      t.subject.toLowerCase().includes(search.toLowerCase());
    return matchesSearch;
  });

  const getClassName = (cId: string) => {
    return classes.find((c) => c.id === cId)?.name || "None / Floating";
  };

  // Prepare data for DataTable
  const tableData = useMemo(() => {
    return filteredTeachers.map((teacher, i) => ({
      ...teacher,
      displayId: `T8491${27 - i}`,
      mockPhone: "+1 82392 37359",
      mockJoinDate: teacher.joinedDate || "25 Mar 2024",
      classNameStr: getClassName(teacher.classId)
    }));
  }, [filteredTeachers, classes]);

  const columns: ColumnDef<typeof tableData[0]>[] = [
    { header: "ID", accessorKey: "displayId", render: (t) => <span className="font-semibold text-[#F59E0B] cursor-pointer hover:underline">{t.displayId}</span> },
    { header: "Name", accessorKey: "name", render: (t) => (
        <div className="flex items-center gap-3">
          <img src="/asset 7.webp" className="w-8 h-8 rounded-full object-cover border border-slate-200 dark:border-slate-800" alt={t.name} />
          <span className="font-medium text-slate-900 dark:text-white group-hover:text-[#F59E0B] transition-colors cursor-pointer">{t.name}</span>
        </div>
    ) },
    { header: "Class", accessorKey: "classNameStr" },
    { header: "Subject", accessorKey: "subject" },
    { header: "Email", accessorKey: "email", render: (t) => t.email.toLowerCase() },
    { header: "Phone", accessorKey: "mockPhone" },
    { header: "Date of Join", accessorKey: "mockJoinDate" },
    { header: "Status", accessorKey: "status", render: (t) => (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-[11px] font-bold ${t.status === "Active" ? "bg-[#E8F8E8] text-[#1D7F2C]" : "bg-[#FFEBEB] text-[#E02424]"}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${t.status === "Active" ? "bg-[#1DD04A]" : "bg-[#E02424]"}`} />
          {t.status}
        </span>
    ) },
    { header: "Action", sortable: false, className: "text-center relative", render: (t) => (
        <div onClick={(e) => e.stopPropagation()}>
          <div className="flex justify-center">
            <button
              onClick={() => setActionMenuId(actionMenuId === t.id ? null : t.id)}
              className={`p-1.5 rounded-lg transition-colors ${actionMenuId === t.id ? "bg-[#F59E0B] text-white" : "hover:bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500"}`}
            >
              <MoreVertical className="w-4 h-4" />
            </button>
          </div>
          {actionMenuId === t.id && (
            <>
              <div className="fixed inset-0 z-40" onClick={(e) => { e.stopPropagation(); setActionMenuId(null); }} />
              <div className="absolute right-12 top-10 w-44 bg-white dark:bg-slate-900 border border-border rounded-xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)] z-50 overflow-hidden py-2 text-left">
                <button onClick={() => { router.push(`/dashboard/teachers/${t.id}`); setActionMenuId(null); }} className="w-full px-4 py-2.5 text-[14px] text-[#0F172A] dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800/50 flex items-center gap-3 font-medium transition-colors">
                  <AlignLeft className="w-4 h-4 text-[#0F172A] dark:text-slate-100" /> View Teacher
                </button>
                <button onClick={() => { router.push(`/dashboard/teachers/${t.id}/edit`); setActionMenuId(null); }} className="w-full px-4 py-2.5 text-[14px] text-[#0F172A] dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800/50 flex items-center gap-3 font-medium transition-colors">
                  <Edit className="w-4 h-4 text-[#0F172A] dark:text-slate-100" /> Edit
                </button>
                <button onClick={() => { setSelectedTeacher(t as Teacher); setIsLoginDetailsOpen(true); setActionMenuId(null); }} className="w-full px-4 py-2.5 text-[14px] text-[#0F172A] dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800/50 flex items-center gap-3 font-medium transition-colors">
                  <Lock className="w-4 h-4 text-[#0F172A] dark:text-slate-100" /> Login Details
                </button>
                <button onClick={() => { setActionMenuId(null); }} className="w-full px-4 py-2.5 text-[14px] text-[#0F172A] dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800/50 flex items-center gap-3 font-medium transition-colors">
                  <ToggleRight className="w-4 h-4 text-[#0F172A] dark:text-slate-100" /> Disable
                </button>
                <button onClick={() => { handleDelete(t.id); setActionMenuId(null); }} className="w-full px-4 py-2.5 text-[14px] text-[#0F172A] dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800/50 flex items-center gap-3 font-medium transition-colors">
                  <Trash2 className="w-4 h-4 text-[#0F172A] dark:text-slate-100" /> Delete
                </button>
              </div>
            </>
          )}
        </div>
    )}
  ];

  return (
    <div className="space-y-6 -m-6 p-6 bg-[#F8FAFC] dark:bg-[#0F172A] min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-left">
        <div>
          <h1 className="page-title">Teacher List</h1>
          <div className="flex items-center gap-2 text-[14px] leading-[21px] text-[#68718a] mt-1 font-normal">
            <span>Dashboard</span>
            <span>/</span>
            <span>Peoples</span>
            <span>/</span>
            <span className="text-[#0F172A] dark:text-slate-100">Teacher List</span>
          </div>
        </div>

        {activeRole === "admin" && (
          <div className="flex flex-wrap items-center gap-2">
            <button className="p-2 border border-border bg-white dark:bg-slate-900 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 shadow-sm transition-colors">
              <RefreshCcw className="w-4 h-4" />
            </button>
            <button className="p-2 border border-border bg-white dark:bg-slate-900 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 shadow-sm transition-colors">
              <Printer className="w-4 h-4" />
            </button>
            <div className="relative">
              <button
                onClick={() => setIsExportOpen(!isExportOpen)}
                className="flex items-center gap-2 px-3 py-2 border border-border bg-white dark:bg-slate-900 rounded-lg text-slate-600 dark:text-slate-300 text-[13px] font-semibold hover:bg-slate-50 dark:hover:bg-slate-800/50 shadow-sm transition-colors"
              >
                <Download className="w-4 h-4" /> Export <ChevronDown className="w-3 h-3 text-slate-400 dark:text-slate-500" />
              </button>
              {isExportOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsExportOpen(false)} />
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-slate-900 border border-border rounded-lg shadow-lg z-50 overflow-hidden py-2 text-left">
                    <button className="w-full px-4 py-2.5 text-[14px] font-medium text-[#0F172A] dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800/50 flex items-center gap-3 transition-colors">
                      <FileText className="w-4 h-4 text-slate-500 dark:text-slate-400" /> Export as PDF
                    </button>
                    <button className="w-full px-4 py-2.5 text-[14px] font-medium text-[#0F172A] dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800/50 flex items-center gap-3 transition-colors">
                      <FileText className="w-4 h-4 text-slate-500 dark:text-slate-400" /> Export as Excel
                    </button>
                  </div>
                </>
              )}
            </div>
            <button
              onClick={() => router.push('/dashboard/teachers/add')}
              className="flex items-center gap-2 px-4 py-2 text-[13px] font-semibold text-white bg-[#F59E0B] hover:bg-[#D97706] rounded-lg shadow-sm transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Teacher</span>
            </button>
          </div>
        )}
      </div>

      {/* Directory Table Card */}
      <div className="bg-white dark:bg-slate-900 border border-border rounded-xl card-shadow text-left p-5">
        {/* Top Actions in Card */}
        <div className="flex flex-col xl:flex-row items-start xl:items-center justify-between gap-4 mb-5">
          <h2 className="text-[16px] font-semibold text-[#0F172A] dark:text-slate-100">{viewMode === "list" ? "Teachers List" : "Teachers Grid"}</h2>
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
              <button
                onClick={() => setIsDateRangeOpen(!isDateRangeOpen)}
                className="flex items-center gap-2 px-3 py-1.5 border border-border rounded-lg text-[13px] text-slate-600 dark:text-slate-300 font-medium hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
              >
                <Calendar className="w-4 h-4 text-slate-400 dark:text-slate-500" />
                {selectedDateRange}
              </button>
              {isDateRangeOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsDateRangeOpen(false)} />
                  <div className="absolute left-0 top-full mt-2 w-44 bg-white dark:bg-slate-900 border border-border rounded-lg shadow-lg z-50 overflow-hidden py-1.5 text-left">
                    {["Today", "Yesterday", "Last 7 Days", "Last 30 Days", "This Year", "Next Year", "Custom Range"].map((item) => (
                      <button key={item} onClick={() => { setSelectedDateRange(item); setIsDateRangeOpen(false); }} className={`w-full px-4 py-2 text-[13px] text-left transition-colors ${item === selectedDateRange ? "bg-[#F59E0B] text-white font-semibold" : "text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50"}`}>
                        {item}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            <div className="relative">
              <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="flex items-center gap-2 px-3 py-1.5 border border-border rounded-lg text-[13px] text-slate-600 dark:text-slate-300 font-medium hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
              >
                <Filter className="w-4 h-4 text-slate-400 dark:text-slate-500" />
                Filter <ChevronDown className="w-3 h-3 text-slate-400 dark:text-slate-500" />
              </button>
              {isFilterOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsFilterOpen(false)} />
                  <div className="absolute right-0 sm:left-0 sm:right-auto top-full mt-2 w-64 bg-white dark:bg-slate-900 border border-border rounded-lg shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)] z-50 text-left">
                    <div className="p-4 border-b border-border">
                      <h3 className="text-[15px] font-bold text-[#0F172A] dark:text-slate-100">Filter</h3>
                    </div>
                    <div className="p-4 space-y-4">
                      <div className="space-y-1.5">
                        <label className="text-[13px] font-semibold text-[#0F172A] dark:text-slate-100">Class</label>
                        <div className="relative">
                          <select className="w-full px-3 py-2 border border-border rounded-lg text-[13px] outline-none appearance-none bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 font-medium">
                            <option>I</option>
                            <option>II</option>
                          </select>
                          <ChevronDown className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute right-3 top-2.5 pointer-events-none" />
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[13px] font-semibold text-[#0F172A] dark:text-slate-100">Section</label>
                        <div className="relative">
                          <select className="w-full px-3 py-2 border border-border rounded-lg text-[13px] outline-none appearance-none bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 font-medium">
                            <option>A</option>
                            <option>B</option>
                          </select>
                          <ChevronDown className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute right-3 top-2.5 pointer-events-none" />
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[13px] font-semibold text-[#0F172A] dark:text-slate-100">Status</label>
                        <div className="relative">
                          <select className="w-full px-3 py-2 border border-border rounded-lg text-[13px] outline-none appearance-none bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 font-medium">
                            <option>Active</option>
                            <option>Inactive</option>
                          </select>
                          <ChevronDown className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute right-3 top-2.5 pointer-events-none" />
                        </div>
                      </div>
                    </div>
                    <div className="p-4 flex justify-end gap-3 bg-white dark:bg-slate-900 rounded-b-lg pt-2">
                      <button onClick={() => setIsFilterOpen(false)} className="px-5 py-2.5 bg-[#F1F5F9] dark:bg-slate-800 hover:bg-[#E2E8F0] dark:hover:bg-slate-700 text-[#0F172A] dark:text-slate-100 text-[13px] font-bold rounded-lg transition-colors cursor-pointer">
                        Reset
                      </button>

                      <button onClick={() => setIsFilterOpen(false)} className="px-5 py-2.5 bg-[#F59E0B] hover:bg-[#D97706] text-white text-[13px] font-bold rounded-lg shadow-sm transition-colors cursor-pointer">
                        Apply
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>

            <div className="flex items-center border border-border rounded-lg p-0.5 bg-slate-50 dark:bg-slate-800/50">
              <button onClick={() => setViewMode("list")} className={`p-1.5 rounded shadow-sm transition-colors cursor-pointer ${viewMode === "list" ? "bg-[#F59E0B] text-white" : "text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:text-slate-300"}`}><List className="w-4 h-4" /></button>
              <button onClick={() => setViewMode("grid")} className={`p-1.5 rounded shadow-sm transition-colors cursor-pointer ${viewMode === "grid" ? "bg-[#F59E0B] text-white" : "text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:text-slate-300"}`}><Grid className="w-4 h-4" /></button>
            </div>

            <div className="relative">
              <button
                onClick={() => setIsSortOpen(!isSortOpen)}
                className="flex items-center gap-2 px-3 py-1.5 border border-border rounded-lg text-[13px] text-slate-600 dark:text-slate-300 font-medium hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
              >
                <ArrowDownAZ className="w-4 h-4 text-slate-400 dark:text-slate-500" />
                Sort by A-Z <ChevronDown className="w-3 h-3 text-slate-400 dark:text-slate-500" />
              </button>
              {isSortOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsSortOpen(false)} />
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-slate-900 border border-border rounded-lg shadow-lg z-50 overflow-hidden py-1.5 text-left">
                    {["Ascending", "Descending", "Recently Viewed", "Recently Added"].map((item) => (
                      <button 
                        key={item} 
                        onClick={() => { setSelectedSort(item); setIsSortOpen(false); }}
                        className={`w-full px-4 py-2.5 text-[14px] text-left transition-colors font-medium cursor-pointer ${item === selectedSort ? "bg-[#F59E0B] text-white" : "text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/50"}`}
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Rows and Search */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5 border-b border-border pb-5">
          <div className="flex items-center gap-2 text-[13px] text-slate-500 dark:text-slate-400 font-medium">
            <span>Row Per Page</span>
            <select className="border border-border rounded-md px-2 py-1 outline-none text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-900 font-semibold cursor-pointer">
              <option>10</option>
            </select>
            <span>Entries</span>
          </div>
          <div className="relative w-full sm:w-64">
            <input
              type="text"
              placeholder="Search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-lg text-[13px] text-slate-700 dark:text-slate-200 outline-none focus:border-[#F59E0B]/50 focus:ring-2 focus:ring-[#F59E0B]/10 transition-all bg-white dark:bg-slate-900"
            />
          </div>
        </div>

        {/* List/Grid View */}
        {viewMode === "list" ? (
          <DataTable 
            columns={columns} 
            data={tableData} 
            onRowClick={(item) => router.push(`/dashboard/teachers/${item.id}`)}
            selectionHeader={<input type="checkbox" className="rounded border-slate-300 w-4 h-4 text-[#F59E0B] cursor-pointer" />}
            renderSelection={() => <input type="checkbox" className="rounded border-slate-300 w-4 h-4 text-[#F59E0B] cursor-pointer" />}
            noDataMessage="No faculty records matching filter."
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredTeachers.length === 0 ? (
              <div className="col-span-full py-12 text-center text-slate-500 dark:text-slate-400">
                No faculty records matching filter.
              </div>
            ) : (
              filteredTeachers.map((teacher, i) => {
                const displayId = `T8491${27 - i}`;
                const mockPhone = "+1 82392 37359";

                return (
                  <div key={teacher.id} className="bg-white dark:bg-slate-900 border border-border rounded-xl p-5 hover:shadow-lg hover:shadow-slate-200/50 dark:hover:shadow-black/50 transition-all duration-300 relative text-left">
                    {/* Top row: ID, Status, Actions */}
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-[#3B82F6] font-semibold text-[13px] hover:underline cursor-pointer" onClick={() => router.push(`/dashboard/teachers/${teacher.id}`)}>{displayId}</span>
                      <div className="flex items-center gap-2">
                        <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-bold ${teacher.status === "Active" ? "bg-[#E8F8E8] text-[#1D7F2C]" : "bg-[#FFEBEB] text-[#E02424]"}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${teacher.status === "Active" ? "bg-[#1DD04A]" : "bg-[#E02424]"}`} />
                          {teacher.status}
                        </span>
                        <div className="relative">
                          <button onClick={() => setActionMenuId(actionMenuId === teacher.id ? null : teacher.id)} className={`p-1.5 rounded-lg transition-colors ${actionMenuId === teacher.id ? "bg-[#F59E0B] text-white" : "text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300"}`}>
                            <MoreVertical className="w-4 h-4" />
                          </button>

                          {actionMenuId === teacher.id && (
                            <>
                              <div className="fixed inset-0 z-40" onClick={(e) => { e.stopPropagation(); setActionMenuId(null); }} />
                              <div className="absolute right-0 top-10 w-44 bg-white dark:bg-slate-900 border border-border rounded-xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)] z-50 overflow-hidden py-2 text-left">
                                <button onClick={() => { router.push(`/dashboard/teachers/${teacher.id}`); setActionMenuId(null); }} className="w-full px-4 py-2.5 text-[14px] text-[#0F172A] dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800/50 flex items-center gap-3 font-medium transition-colors">
                                  <AlignLeft className="w-4 h-4 text-[#0F172A] dark:text-slate-100" /> View Teacher
                                </button>
                                <button onClick={() => { router.push(`/dashboard/teachers/${teacher.id}/edit`); setActionMenuId(null); }} className="w-full px-4 py-2.5 text-[14px] text-[#0F172A] dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800/50 flex items-center gap-3 font-medium transition-colors">
                                  <Edit className="w-4 h-4 text-[#0F172A] dark:text-slate-100" /> Edit
                                </button>
                                <button onClick={() => { setSelectedTeacher(teacher); setIsLoginDetailsOpen(true); setActionMenuId(null); }} className="w-full px-4 py-2.5 text-[14px] text-[#0F172A] dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800/50 flex items-center gap-3 font-medium transition-colors">
                                  <Lock className="w-4 h-4 text-[#0F172A] dark:text-slate-100" /> Login Details
                                </button>
                                <button onClick={() => { setActionMenuId(null); }} className="w-full px-4 py-2.5 text-[14px] text-[#0F172A] dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800/50 flex items-center gap-3 font-medium transition-colors">
                                  <ToggleRight className="w-4 h-4 text-[#0F172A] dark:text-slate-100" /> Disable
                                </button>
                                <button onClick={() => { handleDelete(teacher.id); setActionMenuId(null); }} className="w-full px-4 py-2.5 text-[14px] text-[#0F172A] dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800/50 flex items-center gap-3 font-medium transition-colors">
                                  <Trash2 className="w-4 h-4 text-[#0F172A] dark:text-slate-100" /> Delete
                                </button>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Avatar & Info */}
                    <div className="flex items-center gap-3 mb-5">
                      <img src="/asset 7.webp" className="w-12 h-12 rounded-full object-cover border border-slate-200 dark:border-slate-800" alt={teacher.name} />
                      <div>
                        <h3 className="font-bold text-[#0F172A] dark:text-slate-100 text-[14px] group-hover:text-[#F59E0B] transition-colors cursor-pointer" onClick={() => router.push(`/dashboard/teachers/${teacher.id}`)}>{teacher.name}</h3>
                        <p className="text-slate-500 dark:text-slate-400 text-[12px] font-medium">{getClassName(teacher.classId)}</p>
                      </div>
                    </div>

                    {/* Contact details */}
                    <div className="space-y-3 mb-5 text-[12px]">
                      <div>
                        <p className="text-slate-500 dark:text-slate-400 mb-0.5">Email</p>
                        <p className="text-[#0F172A] dark:text-slate-100 font-medium">{teacher.email.toLowerCase()}</p>
                      </div>
                      <div>
                        <p className="text-slate-500 dark:text-slate-400 mb-0.5">Phone</p>
                        <p className="text-[#0F172A] dark:text-slate-100 font-medium">{mockPhone}</p>
                      </div>
                    </div>

                    {/* Bottom: Subject & Button */}
                    <div className="flex items-center justify-between pt-4 border-t border-border mt-auto">
                      <span className="px-2 py-1 bg-red-50 text-red-500 dark:bg-red-500/10 dark:text-red-400 text-[10px] font-bold rounded">
                        {teacher.subject}
                      </span>
                      <button
                        onClick={() => router.push(`/dashboard/teachers/${teacher.id}`)}
                        className="px-3 py-1.5 bg-[#F1F5F9] dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[11px] font-bold rounded hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* Pagination placeholder matching the design */}
        <div className="mt-5 pt-5 border-t border-border flex items-center justify-end gap-2 text-[13px] font-medium text-slate-500 dark:text-slate-400">
          <button className="px-2 py-1 hover:text-slate-800 dark:text-slate-100 transition-colors">Prev</button>
          <button className="w-7 h-7 rounded bg-[#F59E0B] text-white flex items-center justify-center font-semibold">1</button>
          <button className="w-7 h-7 rounded hover:bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 flex items-center justify-center transition-colors">2</button>
          <button className="px-2 py-1 hover:text-slate-800 dark:text-slate-100 transition-colors">Next</button>
        </div>
      </div>



      {/* ----------------------------------------------------
          LOGIN DETAILS MODAL
          ---------------------------------------------------- */}
      <Modal isOpen={isLoginDetailsOpen} onClose={() => setIsLoginDetailsOpen(false)} title="Login Details">
        {selectedTeacher && (
          <div className="space-y-6 text-left">
            <div className="flex justify-center mb-6 mt-4">
              <div className="flex items-center gap-3">
                <img src="/asset 7.webp" className="w-10 h-10 rounded-lg object-cover" alt="Teacher" />
                <div className="text-left">
                  <p className="font-semibold text-[#0F172A] dark:text-slate-100">{selectedTeacher.name}</p>
                  <p className="text-[13px] font-medium text-slate-500 dark:text-slate-400">{getClassName(selectedTeacher.classId)}</p>
                </div>
              </div>
            </div>

            <div className="border border-border rounded-lg overflow-hidden">
              <table className="w-full text-left text-[13px]">
                <thead className="bg-[#F8FAFC] dark:bg-[#0F172A] text-slate-700 dark:text-slate-200 border-b border-border">
                  <tr>
                    <th className="px-4 py-3 font-semibold">User Type <span className="text-[10px] text-slate-400 dark:text-slate-500 ml-1">⇅</span></th>
                    <th className="px-4 py-3 font-semibold">User Name <span className="text-[10px] text-slate-400 dark:text-slate-500 ml-1">⇅</span></th>
                    <th className="px-4 py-3 font-semibold">Password <span className="text-[10px] text-slate-400 dark:text-slate-500 ml-1">⇅</span></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border text-slate-600 dark:text-slate-300 font-medium">
                  <tr>
                    <td className="px-4 py-4">Parent</td>
                    <td className="px-4 py-4">parent53</td>
                    <td className="px-4 py-4">parent@53</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-4">Teacher</td>
                    <td className="px-4 py-4">teacher20</td>
                    <td className="px-4 py-4">teacher@53</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setIsLoginDetailsOpen(false)}
                className="px-5 py-2.5 bg-[#F1F5F9] dark:bg-slate-800 hover:bg-[#E2E8F0] dark:hover:bg-slate-700 text-[#0F172A] dark:text-slate-100 text-[14px] font-semibold rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
