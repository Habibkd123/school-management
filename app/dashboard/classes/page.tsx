"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Plus, Search, RefreshCcw, Printer, Download, ChevronDown,
  MoreVertical, Edit, Trash2, Calendar, Filter, ArrowUpDown, FileText
} from "lucide-react";
import { Modal } from "../../components/ui/modal";
import { DataTable, ColumnDef } from "@/app/components/ui/data-table";

export default function ClassesPage() {
  const [isAddClassOpen, setIsAddClassOpen] = useState(false);
  const [actionMenuId, setActionMenuId] = useState<string | null>(null);

  // Popover states
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isDateRangeOpen, setIsDateRangeOpen] = useState(false);
  const [selectedDateRange, setSelectedDateRange] = useState("Last 7 Days");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [selectedSort, setSelectedSort] = useState("Ascending");

  // Form states
  const [className, setClassName] = useState("");
  const [section, setSection] = useState("");
  const [noOfStudents, setNoOfStudents] = useState("");
  const [noOfSubjects, setNoOfSubjects] = useState("");
  const [isActive, setIsActive] = useState(true);

  // Mock Data
  const [classes, setClasses] = useState([
    { id: "C138038", class: "I", section: "A", students: 30, subjects: "03", status: "Active" },
    { id: "C138037", class: "I", section: "B", students: 25, subjects: "03", status: "Active" },
    { id: "C138036", class: "II", section: "A", students: 40, subjects: "03", status: "Active" },
    { id: "C138035", class: "II", section: "B", students: 35, subjects: "03", status: "Active" },
    { id: "C138034", class: "II", section: "C", students: 25, subjects: "03", status: "Inactive" },
    { id: "C138033", class: "III", section: "A", students: 30, subjects: "03", status: "Active" },
    { id: "C138032", class: "III", section: "B", students: 25, subjects: "05", status: "Active" },
    { id: "C138031", class: "IV", section: "A", students: 20, subjects: "05", status: "Active" },
    { id: "C138030", class: "IV", section: "B", students: 30, subjects: "05", status: "Inactive" },
    { id: "C138029", class: "V", section: "A", students: 35, subjects: "05", status: "Active" }
  ]);

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsAddClassOpen(false);
    // Submit logic here
  };

  const columns: ColumnDef<typeof classes[0]>[] = [
    { header: "ID", accessorKey: "id", render: (c) => <span className="font-bold text-[#F59E0B]">{c.id}</span> },
    { header: "Class", accessorKey: "class" },
    { header: "Section", accessorKey: "section" },
    { header: "No of Students", accessorKey: "students" },
    { header: "No of Subjects", accessorKey: "subjects" },
    { header: "Status", accessorKey: "status", render: (c) => (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-[11px] font-bold border
          ${c.status === "Active"
            ? "bg-[#E8F8E8] text-[#1D7F2C] border-[#1D7F2C]/20"
            : "bg-[#FFEBEB] text-[#E02424] border-[#E02424]/20"}
        `}>
          <span className={`w-1.5 h-1.5 rounded-full ${c.status === "Active" ? "bg-[#1DD04A]" : "bg-[#E02424]"}`} />
          {c.status}
        </span>
    )},
    { header: "Action", sortable: false, render: (c) => (
        <div className="relative">
          <button
            onClick={() => setActionMenuId(actionMenuId === c.id ? null : c.id)}
            className="p-1 text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:text-slate-200 transition-colors"
          >
            <MoreVertical className="w-4 h-4" />
          </button>
          {actionMenuId === c.id && (
            <div className="absolute right-12 top-4 w-32 bg-white dark:bg-slate-900 border border-border rounded-lg shadow-lg z-50 overflow-hidden py-1.5">
              <button className="w-full px-4 py-2 text-[13px] font-semibold text-[#0F172A] dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800/50 flex items-center gap-2 transition-colors text-left">
                <Edit className="w-3.5 h-3.5" /> Edit
              </button>
              <button className="w-full px-4 py-2 text-[13px] font-semibold text-[#0F172A] dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800/50 flex items-center gap-2 transition-colors text-left">
                <Trash2 className="w-3.5 h-3.5" /> Delete
              </button>
            </div>
          )}
        </div>
    )}
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-left">
        <div>
          <h1 className="text-[20px] leading-[24px] font-bold text-[#0F172A] dark:text-slate-100">Classes List</h1>
          <div className="flex items-center gap-2 text-[14px] leading-[21px] text-[#68718a] mt-1 font-medium">
            <span>Dashboard</span>
            <span>/</span>
            <span>Classes</span>
            <span>/</span>
            <span className="text-[#0F172A] dark:text-slate-100">All Classes</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button className="p-2 border border-border rounded-lg bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 shadow-sm transition-colors">
            <RefreshCcw className="w-4 h-4" />
          </button>
          <button className="p-2 border border-border rounded-lg bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 shadow-sm transition-colors">
            <Printer className="w-4 h-4" />
          </button>
          <div className="relative">
            <button
              onClick={() => setIsExportOpen(!isExportOpen)}
              className="flex items-center gap-2 px-3 py-2 border border-border rounded-lg bg-white dark:bg-slate-900 text-[13px] font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/50 shadow-sm transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Export</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
            </button>
            {isExportOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setIsExportOpen(false)} />
                <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-slate-900 border border-border rounded-lg shadow-lg z-50 overflow-hidden py-2 text-left">
                  <button onClick={() => setIsExportOpen(false)} className="w-full px-4 py-2.5 text-[14px] font-medium text-[#0F172A] dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800/50 flex items-center gap-3 transition-colors">
                    <FileText className="w-4 h-4 text-slate-500 dark:text-slate-400" /> Export as PDF
                  </button>
                  <button onClick={() => setIsExportOpen(false)} className="w-full px-4 py-2.5 text-[14px] font-medium text-[#0F172A] dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800/50 flex items-center gap-3 transition-colors">
                    <FileText className="w-4 h-4 text-slate-500 dark:text-slate-400" /> Export as Excel
                  </button>
                </div>
              </>
            )}
          </div>
          <button
            onClick={() => setIsAddClassOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-[#F59E0B] hover:bg-[#D97706] text-white text-[13px] font-bold rounded-lg shadow-sm transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Class</span>
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-border rounded-xl card-shadow">
        {/* Top bar with filters */}
        <div className="p-5 border-b border-border flex flex-col xl:flex-row xl:items-center justify-between gap-4 text-left">
          <h3 className="text-[16px] font-bold text-slate-900 dark:text-white">Classes List</h3>

          <div className="flex flex-wrap items-center gap-3">
            {/* Date Range Popover */}
            <div className="relative">
              <button
                onClick={() => setIsDateRangeOpen(!isDateRangeOpen)}
                className="flex items-center gap-2 px-3 py-2 border border-border rounded-lg bg-white dark:bg-slate-900 text-[13px] font-medium text-slate-600 dark:text-slate-300 shadow-sm hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
              >
                <Calendar className="w-4 h-4 text-slate-400 dark:text-slate-500" />
                <span>{selectedDateRange}</span>
              </button>
              {isDateRangeOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsDateRangeOpen(false)} />
                  <div className="absolute left-0 top-full mt-2 w-44 bg-white dark:bg-slate-900 border border-border rounded-lg shadow-lg z-50 overflow-hidden py-1.5 text-left">
                    {["Today", "Yesterday", "Last 7 Days", "Last 30 Days", "This Year", "Next Year", "Custom Range"].map((item) => (
                      <button onClick={() => { setSelectedDateRange(item); setIsDateRangeOpen(false); }} key={item} className={`w-full px-4 py-2 text-[13px] text-left transition-colors ${item === selectedDateRange ? "bg-[#F59E0B] text-white font-semibold" : "text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50"}`}>
                        {item}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Filter Popover */}
            <div className="relative">
              <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="flex items-center gap-2 px-3 py-2 border border-border rounded-lg bg-white dark:bg-slate-900 text-[13px] font-medium text-slate-600 dark:text-slate-300 shadow-sm hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
              >
                <Filter className="w-4 h-4 text-slate-400 dark:text-slate-500" />
                <span>Filter</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
              </button>
              {isFilterOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsFilterOpen(false)} />
                  <div className="absolute right-0 sm:right-0 sm:left-auto top-full mt-2 w-74 bg-white dark:bg-slate-900 border border-border rounded-lg shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)] z-50 text-left">
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
                      <button onClick={() => setIsFilterOpen(false)} className="px-5 py-2.5 bg-[#F1F5F9] dark:bg-slate-800 hover:bg-[#E2E8F0] dark:hover:bg-slate-700 text-[#0F172A] dark:text-slate-100 text-[13px] font-bold rounded-lg transition-colors">
                        Reset
                      </button>
                      <button onClick={() => setIsFilterOpen(false)} className="px-5 py-2.5 bg-[#F59E0B] hover:bg-[#D97706] text-white text-[13px] font-bold rounded-lg shadow-sm transition-colors">
                        Apply
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Sort Popover */}
            <div className="relative">
              <button
                onClick={() => setIsSortOpen(!isSortOpen)}
                className="flex items-center gap-2 px-3 py-2 border border-border rounded-lg bg-white dark:bg-slate-900 text-[13px] font-medium text-slate-600 dark:text-slate-300 shadow-sm hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
              >
                <ArrowUpDown className="w-4 h-4 text-slate-400 dark:text-slate-500" />
                <span>Sort by A-Z</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
              </button>
              {isSortOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsSortOpen(false)} />
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-slate-900 border border-border rounded-lg shadow-lg z-50 overflow-hidden py-1.5 text-left">
                    {["Ascending", "Descending", "Recently Viewed", "Recently Added"].map((item) => (
                      <button onClick={() => { setSelectedSort(item); setIsSortOpen(false); }} key={item} className={`w-full px-4 py-2.5 text-[14px] text-left transition-colors font-medium cursor-pointer ${item === selectedSort ? "bg-[#F59E0B] text-white" : "text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/50"}`}>
                        {item}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Filters bar */}
        <div className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-left border-b border-border/50">
          <div className="flex items-center gap-2 text-[13px] text-slate-500 dark:text-slate-400 font-medium">
            <span>Row Per Page</span>
            <select className="border border-border rounded-lg px-2 py-1 outline-none bg-white dark:bg-slate-900 font-semibold text-slate-700 dark:text-slate-200">
              <option>10</option>
            </select>
            <span>Entries</span>
          </div>
          <div className="relative">
            <input
              type="text"
              placeholder="Search"
              className="px-3 py-2 border border-border rounded-lg text-[13px] outline-none w-full sm:w-64 focus:border-[#F59E0B]/50 transition-colors shadow-sm bg-[#F8FAFC] dark:bg-[#0F172A]"
            />
          </div>
        </div>

        <DataTable 
          columns={columns} 
          data={classes} 
          selectionHeader={<input type="checkbox" className="rounded border-slate-300 text-[#F59E0B] focus:ring-[#F59E0B] w-4 h-4" />}
          renderSelection={() => <input type="checkbox" className="rounded border-slate-300 text-[#F59E0B] focus:ring-[#F59E0B] w-4 h-4" />}
        />
      </div>

      {/* ----------------------------------------------------
          ADD CLASS MODAL
          ---------------------------------------------------- */}
      <Modal isOpen={isAddClassOpen} onClose={() => setIsAddClassOpen(false)} title="Add Class">
        <form onSubmit={handleAddSubmit} className="space-y-5 text-left">
          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-semibold text-[#0F172A] dark:text-slate-100">Class Name</label>
            <input
              type="text"
              value={className}
              onChange={(e) => setClassName(e.target.value)}
              className="w-full px-3.5 py-2.5 border border-border rounded-lg text-[13px] outline-none focus:border-[#F59E0B]/50 transition-colors shadow-sm"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-semibold text-[#0F172A] dark:text-slate-100">Section</label>
            <div className="relative">
              <select
                value={section}
                onChange={(e) => setSection(e.target.value)}
                className="w-full px-3.5 py-2.5 border border-border rounded-lg text-[13px] outline-none focus:border-[#F59E0B]/50 transition-colors appearance-none bg-white dark:bg-slate-900 shadow-sm font-medium"
              >
                <option value="">Select</option>
                <option value="A">A</option>
                <option value="B">B</option>
                <option value="C">C</option>
              </select>
              <ChevronDown className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute right-3.5 top-3 pointer-events-none" />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-semibold text-[#0F172A] dark:text-slate-100">No of Students</label>
            <input
              type="number"
              value={noOfStudents}
              onChange={(e) => setNoOfStudents(e.target.value)}
              className="w-full px-3.5 py-2.5 border border-border rounded-lg text-[13px] outline-none focus:border-[#F59E0B]/50 transition-colors shadow-sm"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-semibold text-[#0F172A] dark:text-slate-100">No of Subjects</label>
            <input
              type="number"
              value={noOfSubjects}
              onChange={(e) => setNoOfSubjects(e.target.value)}
              className="w-full px-3.5 py-2.5 border border-border rounded-lg text-[13px] outline-none focus:border-[#F59E0B]/50 transition-colors shadow-sm"
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            <div>
              <p className="text-[13px] font-bold text-[#0F172A] dark:text-slate-100">Status</p>
              <p className="text-[12px] font-medium text-slate-500 dark:text-slate-400 mt-0.5">Change the Status by toggle</p>
            </div>
            {/* Custom Toggle Switch */}
            <button
              type="button"
              onClick={() => setIsActive(!isActive)}
              className={`w-11 h-6 rounded-full relative transition-colors ${isActive ? 'bg-[#F59E0B]' : 'bg-slate-200'}`}
            >
              <div className={`absolute top-1 w-4 h-4 rounded-full bg-white dark:bg-slate-900 transition-transform ${isActive ? 'left-[26px]' : 'left-1'}`} />
            </button>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-border/50">
            <button
              type="button"
              onClick={() => setIsAddClassOpen(false)}
              className="px-5 py-2.5 bg-[#F1F5F9] dark:bg-slate-800 hover:bg-[#E2E8F0] dark:hover:bg-slate-700 text-[#0F172A] dark:text-slate-100 text-[14px] font-bold rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-[#F59E0B] hover:bg-[#D97706] text-[14px] font-bold rounded-lg text-white shadow-sm transition-colors"
            >
              Add Class
            </button>
          </div>
        </form>
      </Modal>

    </div>
  );
}
