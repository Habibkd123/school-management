"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  Plus, Search, RefreshCcw, Printer, Download, ChevronDown, 
  MoreVertical, Edit, Trash2, Calendar, Filter, ArrowUpDown, FileText
} from "lucide-react";
import { Modal } from "../../components/ui/modal";

export default function ClassesPage() {
  const [isAddClassOpen, setIsAddClassOpen] = useState(false);
  const [actionMenuId, setActionMenuId] = useState<string | null>(null);

  // Popover states
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isDateRangeOpen, setIsDateRangeOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);

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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-left">
        <div>
          <h1 className="text-[20px] leading-[24px] font-bold text-[#202c4b]">Classes List</h1>
          <div className="flex items-center gap-2 text-[14px] leading-[21px] text-[#68718a] mt-1 font-medium">
            <span>Dashboard</span>
            <span>/</span>
            <span>Classes</span>
            <span>/</span>
            <span className="text-[#202c4b]">All Classes</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button className="p-2 border border-border rounded-lg bg-white text-slate-500 hover:bg-slate-50 shadow-sm transition-colors">
            <RefreshCcw className="w-4 h-4" />
          </button>
          <button className="p-2 border border-border rounded-lg bg-white text-slate-500 hover:bg-slate-50 shadow-sm transition-colors">
            <Printer className="w-4 h-4" />
          </button>
          <div className="relative">
            <button 
              onClick={() => setIsExportOpen(!isExportOpen)}
              className="flex items-center gap-2 px-3 py-2 border border-border rounded-lg bg-white text-[13px] font-bold text-slate-700 hover:bg-slate-50 shadow-sm transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Export</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>
            {isExportOpen && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-border rounded-lg shadow-lg z-50 overflow-hidden py-2 text-left">
                <button className="w-full px-4 py-2.5 text-[14px] font-medium text-[#202c4b] hover:bg-slate-50 flex items-center gap-3 transition-colors">
                  <FileText className="w-4 h-4 text-slate-500" /> Export as PDF
                </button>
                <button className="w-full px-4 py-2.5 text-[14px] font-medium text-[#202c4b] hover:bg-slate-50 flex items-center gap-3 transition-colors">
                  <FileText className="w-4 h-4 text-slate-500" /> Export as Excel
                </button>
              </div>
            )}
          </div>
          <button
            onClick={() => setIsAddClassOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-[#5D6BEE] hover:bg-[#4b58ce] text-white text-[13px] font-bold rounded-lg shadow-sm transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Class</span>
          </button>
        </div>
      </div>

      <div className="bg-white border border-border rounded-xl card-shadow overflow-hidden">
        {/* Top bar with filters */}
        <div className="p-5 border-b border-border flex flex-col xl:flex-row xl:items-center justify-between gap-4 text-left">
          <h3 className="text-[16px] font-bold text-slate-900">Classes List</h3>
          
          <div className="flex flex-wrap items-center gap-3">
            {/* Date Range Popover */}
            <div className="relative">
              <button 
                onClick={() => setIsDateRangeOpen(!isDateRangeOpen)}
                className="flex items-center gap-2 px-3 py-2 border border-border rounded-lg bg-white text-[13px] font-medium text-slate-600 shadow-sm hover:bg-slate-50 transition-colors"
              >
                <Calendar className="w-4 h-4 text-slate-400" />
                <span>06/01/2026 - 06/07/2026</span>
              </button>
              {isDateRangeOpen && (
                <div className="absolute left-0 top-full mt-2 w-44 bg-white border border-border rounded-lg shadow-lg z-50 overflow-hidden py-1.5 text-left">
                  {["Today", "Yesterday", "Last 7 Days", "Last 30 Days", "This Year", "Next Year", "Custom Range"].map((item) => (
                    <button key={item} className={`w-full px-4 py-2 text-[13px] text-left transition-colors ${item === "Last 7 Days" ? "bg-[#5D6BEE] text-white font-semibold" : "text-slate-600 hover:bg-slate-50"}`}>
                      {item}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Filter Popover */}
            <div className="relative">
              <button 
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="flex items-center gap-2 px-3 py-2 border border-border rounded-lg bg-white text-[13px] font-medium text-slate-600 shadow-sm hover:bg-slate-50 transition-colors"
              >
                <Filter className="w-4 h-4 text-slate-400" />
                <span>Filter</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>
              {isFilterOpen && (
                <div className="absolute right-0 sm:left-0 sm:right-auto top-full mt-2 w-64 bg-white border border-border rounded-lg shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)] z-50 text-left">
                  <div className="p-4 border-b border-border">
                    <h3 className="text-[15px] font-bold text-[#202c4b]">Filter</h3>
                  </div>
                  <div className="p-4 space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-[13px] font-semibold text-[#202c4b]">Class</label>
                      <div className="relative">
                        <select className="w-full px-3 py-2 border border-border rounded-lg text-[13px] outline-none appearance-none bg-white text-slate-600 font-medium">
                          <option>I</option>
                          <option>II</option>
                        </select>
                        <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-2.5 pointer-events-none" />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[13px] font-semibold text-[#202c4b]">Section</label>
                      <div className="relative">
                        <select className="w-full px-3 py-2 border border-border rounded-lg text-[13px] outline-none appearance-none bg-white text-slate-600 font-medium">
                          <option>A</option>
                          <option>B</option>
                        </select>
                        <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-2.5 pointer-events-none" />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[13px] font-semibold text-[#202c4b]">Status</label>
                      <div className="relative">
                        <select className="w-full px-3 py-2 border border-border rounded-lg text-[13px] outline-none appearance-none bg-white text-slate-600 font-medium">
                          <option>Active</option>
                          <option>Inactive</option>
                        </select>
                        <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-2.5 pointer-events-none" />
                      </div>
                    </div>
                  </div>
                  <div className="p-4 flex justify-end gap-3 bg-white rounded-b-lg pt-2">
                    <button className="px-5 py-2.5 bg-[#F1F5F9] hover:bg-[#E2E8F0] text-[#202c4b] text-[13px] font-bold rounded-lg transition-colors">
                      Reset
                    </button>
                    <button className="px-5 py-2.5 bg-[#5D6BEE] hover:bg-[#4b58ce] text-white text-[13px] font-bold rounded-lg shadow-sm transition-colors">
                      Apply
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Sort Popover */}
            <div className="relative">
              <button 
                onClick={() => setIsSortOpen(!isSortOpen)}
                className="flex items-center gap-2 px-3 py-2 border border-border rounded-lg bg-white text-[13px] font-medium text-slate-600 shadow-sm hover:bg-slate-50 transition-colors"
              >
                <ArrowUpDown className="w-4 h-4 text-slate-400" />
                <span>Sort by A-Z</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>
              {isSortOpen && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-border rounded-lg shadow-lg z-50 overflow-hidden py-1.5 text-left">
                  {["Ascending", "Descending", "Recently Viewed", "Recently Added"].map((item) => (
                    <button key={item} className="w-full px-4 py-2.5 text-[14px] text-slate-700 hover:bg-slate-50 text-left transition-colors font-medium">
                      {item}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Filters bar */}
        <div className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-left border-b border-border/50">
          <div className="flex items-center gap-2 text-[13px] text-slate-500 font-medium">
            <span>Row Per Page</span>
            <select className="border border-border rounded-lg px-2 py-1 outline-none bg-white font-semibold text-slate-700">
              <option>10</option>
            </select>
            <span>Entries</span>
          </div>
          <div className="relative">
            <input 
              type="text" 
              placeholder="Search" 
              className="px-3 py-2 border border-border rounded-lg text-[13px] outline-none w-full sm:w-64 focus:border-[#5D6BEE]/50 transition-colors shadow-sm bg-[#F8FAFC]"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[13px]">
            <thead className="bg-[#F8FAFC] text-slate-700 border-b border-border">
              <tr>
                <th className="px-5 py-3.5 w-10">
                  <input type="checkbox" className="rounded border-slate-300 text-[#5D6BEE] focus:ring-[#5D6BEE] w-4 h-4" />
                </th>
                <th className="px-5 py-3.5 font-semibold">ID <span className="text-[10px] text-slate-400 ml-1">⇅</span></th>
                <th className="px-5 py-3.5 font-semibold">Class <span className="text-[10px] text-slate-400 ml-1">⇅</span></th>
                <th className="px-5 py-3.5 font-semibold">Section <span className="text-[10px] text-slate-400 ml-1">⇅</span></th>
                <th className="px-5 py-3.5 font-semibold">No of Students <span className="text-[10px] text-slate-400 ml-1">⇅</span></th>
                <th className="px-5 py-3.5 font-semibold">No of Subjects <span className="text-[10px] text-slate-400 ml-1">⇅</span></th>
                <th className="px-5 py-3.5 font-semibold">Status <span className="text-[10px] text-slate-400 ml-1">⇅</span></th>
                <th className="px-5 py-3.5 font-semibold">Action <span className="text-[10px] text-slate-400 ml-1">⇅</span></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border text-slate-600">
              {classes.map((cls, idx) => (
                <tr key={idx} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-5 py-4">
                    <input type="checkbox" className="rounded border-slate-300 text-[#5D6BEE] focus:ring-[#5D6BEE] w-4 h-4" />
                  </td>
                  <td className="px-5 py-4 font-bold text-[#5D6BEE]">{cls.id}</td>
                  <td className="px-5 py-4 font-medium text-slate-700">{cls.class}</td>
                  <td className="px-5 py-4 font-medium text-slate-700">{cls.section}</td>
                  <td className="px-5 py-4 font-medium">{cls.students}</td>
                  <td className="px-5 py-4 font-medium">{cls.subjects}</td>
                  <td className="px-5 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-[11px] font-bold border
                      ${cls.status === "Active" 
                        ? "bg-[#E8F8E8] text-[#1D7F2C] border-[#1D7F2C]/20" 
                        : "bg-[#FFEBEB] text-[#E02424] border-[#E02424]/20"}
                    `}>
                      <span className={`w-1.5 h-1.5 rounded-full ${cls.status === "Active" ? "bg-[#1DD04A]" : "bg-[#E02424]"}`} />
                      {cls.status}
                    </span>
                  </td>
                  <td className="px-5 py-4 relative">
                    <button 
                      onClick={() => setActionMenuId(actionMenuId === cls.id ? null : cls.id)}
                      className="p-1 text-slate-400 hover:text-slate-700 transition-colors"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </button>
                    {actionMenuId === cls.id && (
                      <div className="absolute right-12 top-4 w-32 bg-white border border-border rounded-lg shadow-lg z-50 overflow-hidden py-1.5">
                        <button className="w-full px-4 py-2 text-[13px] font-semibold text-[#202c4b] hover:bg-slate-50 flex items-center gap-2 transition-colors text-left">
                          <Edit className="w-3.5 h-3.5" /> Edit
                        </button>
                        <button className="w-full px-4 py-2 text-[13px] font-semibold text-[#202c4b] hover:bg-slate-50 flex items-center gap-2 transition-colors text-left">
                          <Trash2 className="w-3.5 h-3.5" /> Delete
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination placeholder */}
        <div className="p-5 border-t border-border flex items-center justify-end gap-2 text-[13px] font-medium text-slate-500">
          <button className="px-2 py-1 hover:text-slate-800 transition-colors">Prev</button>
          <button className="w-7 h-7 rounded bg-[#5D6BEE] text-white flex items-center justify-center font-semibold">1</button>
          <button className="w-7 h-7 rounded hover:bg-slate-100 text-slate-700 flex items-center justify-center transition-colors">2</button>
          <button className="px-2 py-1 hover:text-slate-800 transition-colors">Next</button>
        </div>
      </div>

      {/* ----------------------------------------------------
          ADD CLASS MODAL
          ---------------------------------------------------- */}
      <Modal isOpen={isAddClassOpen} onClose={() => setIsAddClassOpen(false)} title="Add Class">
        <form onSubmit={handleAddSubmit} className="space-y-5 text-left">
          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-semibold text-[#202c4b]">Class Name</label>
            <input 
              type="text" 
              value={className}
              onChange={(e) => setClassName(e.target.value)}
              className="w-full px-3.5 py-2.5 border border-border rounded-lg text-[13px] outline-none focus:border-[#5D6BEE]/50 transition-colors shadow-sm" 
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-semibold text-[#202c4b]">Section</label>
            <div className="relative">
              <select 
                value={section}
                onChange={(e) => setSection(e.target.value)}
                className="w-full px-3.5 py-2.5 border border-border rounded-lg text-[13px] outline-none focus:border-[#5D6BEE]/50 transition-colors appearance-none bg-white shadow-sm font-medium"
              >
                <option value="">Select</option>
                <option value="A">A</option>
                <option value="B">B</option>
                <option value="C">C</option>
              </select>
              <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3.5 top-3 pointer-events-none" />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-semibold text-[#202c4b]">No of Students</label>
            <input 
              type="number" 
              value={noOfStudents}
              onChange={(e) => setNoOfStudents(e.target.value)}
              className="w-full px-3.5 py-2.5 border border-border rounded-lg text-[13px] outline-none focus:border-[#5D6BEE]/50 transition-colors shadow-sm" 
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-semibold text-[#202c4b]">No of Subjects</label>
            <input 
              type="number" 
              value={noOfSubjects}
              onChange={(e) => setNoOfSubjects(e.target.value)}
              className="w-full px-3.5 py-2.5 border border-border rounded-lg text-[13px] outline-none focus:border-[#5D6BEE]/50 transition-colors shadow-sm" 
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            <div>
              <p className="text-[13px] font-bold text-[#202c4b]">Status</p>
              <p className="text-[12px] font-medium text-slate-500 mt-0.5">Change the Status by toggle</p>
            </div>
            {/* Custom Toggle Switch */}
            <button 
              type="button"
              onClick={() => setIsActive(!isActive)}
              className={`w-11 h-6 rounded-full relative transition-colors ${isActive ? 'bg-[#5D6BEE]' : 'bg-slate-200'}`}
            >
              <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${isActive ? 'left-[26px]' : 'left-1'}`} />
            </button>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-border/50">
            <button
              type="button"
              onClick={() => setIsAddClassOpen(false)}
              className="px-5 py-2.5 bg-[#F1F5F9] hover:bg-[#E2E8F0] text-[#202c4b] text-[14px] font-bold rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-[#5D6BEE] hover:bg-[#4b58ce] text-[14px] font-bold rounded-lg text-white shadow-sm transition-colors"
            >
              Add Class
            </button>
          </div>
        </form>
      </Modal>

    </div>
  );
}
