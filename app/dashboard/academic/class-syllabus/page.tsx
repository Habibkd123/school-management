"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  Plus, Search, List, Grid, MoreVertical, Edit, Trash2,
  Calendar, Filter, ChevronDown, RefreshCw, Printer, Download, Trash, FileText
} from "lucide-react";
import { Modal } from "../../../components/ui/modal";

interface Syllabus {
  id: string; // Internal id for tracking
  className: string;
  section: string;
  subjectGroup: string;
  createdDate: string;
  status: "Active" | "Inactive";
}

const mockSyllabus: Syllabus[] = [
  { id: "1", className: "I", section: "A", subjectGroup: "I, C English", createdDate: "10 May 2024", status: "Active" },
  { id: "2", className: "I", section: "B", subjectGroup: "III, A Maths", createdDate: "11 May 2024", status: "Active" },
  { id: "3", className: "II", section: "A", subjectGroup: "II, A English", createdDate: "12 May 2024", status: "Active" },
  { id: "4", className: "II", section: "B", subjectGroup: "IV, A Physics", createdDate: "13 May 2024", status: "Active" },
  { id: "5", className: "II", section: "C", subjectGroup: "V, A Chemistry", createdDate: "14 May 2024", status: "Active" },
  { id: "6", className: "III", section: "A", subjectGroup: "III, B Maths", createdDate: "15 May 2024", status: "Active" },
  { id: "7", className: "III", section: "B", subjectGroup: "IV, B Chemistry", createdDate: "16 May 2024", status: "Active" },
  { id: "8", className: "IV", section: "A", subjectGroup: "I, B Maths", createdDate: "17 May 2024", status: "Active" },
  { id: "9", className: "IV", section: "B", subjectGroup: "VI, B Chemistry", createdDate: "18 May 2024", status: "Active" },
  { id: "10", className: "V", section: "A", subjectGroup: "IV, D Maths", createdDate: "19 May 2024", status: "Active" },
];

export default function ClassSyllabusPage() {
  const [syllabusData, setSyllabusData] = useState<Syllabus[]>(mockSyllabus);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isDateRangeOpen, setIsDateRangeOpen] = useState(false);
  const [selectedDateRange, setSelectedDateRange] = useState("06/02/2026 - 06/08/2026");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);
  
  const [selectedSyllabus, setSelectedSyllabus] = useState<Syllabus | null>(null);
  const [actionMenuId, setActionMenuId] = useState<string | null>(null);

  // Form states
  const [formClass, setFormClass] = useState("");
  const [formSection, setFormSection] = useState("");
  const [formSubjectGroup, setFormSubjectGroup] = useState("");

  const openAddModal = () => {
    setFormClass("");
    setFormSection("");
    setFormSubjectGroup("");
    setIsAddOpen(true);
  };

  const openEditModal = (item: Syllabus) => {
    setSelectedSyllabus(item);
    setFormClass(item.className);
    setFormSection(item.section);
    setFormSubjectGroup(item.subjectGroup);
    setIsEditOpen(true);
    setActionMenuId(null);
  };

  const openDeleteModal = (item: Syllabus) => {
    setSelectedSyllabus(item);
    setIsDeleteOpen(true);
    setActionMenuId(null);
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newItem: Syllabus = {
      id: Math.random().toString(),
      className: formClass,
      section: formSection,
      subjectGroup: formSubjectGroup,
      createdDate: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
      status: "Active" // Default to Active as per design
    };
    setSyllabusData([newItem, ...syllabusData]);
    setIsAddOpen(false);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedSyllabus) {
      setSyllabusData(syllabusData.map(s => 
        s.id === selectedSyllabus.id 
          ? { ...s, className: formClass, section: formSection, subjectGroup: formSubjectGroup }
          : s
      ));
    }
    setIsEditOpen(false);
  };

  const handleDeleteConfirm = () => {
    if (selectedSyllabus) {
      setSyllabusData(syllabusData.filter(s => s.id !== selectedSyllabus.id));
    }
    setIsDeleteOpen(false);
  };

  const filteredData = syllabusData.filter(s => 
    s.className.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.section.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.subjectGroup.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 bg-[#F8FAFC] dark:bg-[#0F172A] min-h-screen -m-6 p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">Class Syllabus</h1>
          <div className="flex items-center gap-2 text-[13px] text-slate-500 dark:text-slate-400 mt-1">
            <span>Dashboard</span>
            <span>/</span>
            <Link href="/dashboard/academic" className="hover:text-[#F59E0B]">Academic</Link>
            <span>/</span>
            <span className="text-slate-900 dark:text-white font-medium">Class Syllabus</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button className="w-9 h-9 rounded-full bg-white dark:bg-slate-900 border border-border flex items-center justify-center text-slate-500 dark:text-slate-400 hover:text-[#F59E0B] hover:bg-indigo-50 transition-colors shadow-sm cursor-pointer">
            <RefreshCw className="w-4 h-4" />
          </button>
          <button className="w-9 h-9 rounded-full bg-white dark:bg-slate-900 border border-border flex items-center justify-center text-slate-500 dark:text-slate-400 hover:text-[#F59E0B] hover:bg-indigo-50 transition-colors shadow-sm cursor-pointer">
            <Printer className="w-4 h-4" />
          </button>
          
          <div className="relative">
            <button 
              onClick={() => setIsExportOpen(!isExportOpen)}
              className="px-4 py-2 bg-white dark:bg-slate-900 border border-border text-slate-700 dark:text-slate-200 text-[13px] font-semibold rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors flex items-center gap-2 shadow-sm cursor-pointer"
            >
              <Download className="w-4 h-4" /> Export <ChevronDown className="w-3 h-3 text-slate-400 dark:text-slate-500" />
            </button>
            {isExportOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setIsExportOpen(false)} />
                <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-slate-900 border border-border rounded-lg shadow-lg z-50 overflow-hidden py-2 text-left">
                  <button className="w-full px-4 py-2.5 text-[14px] font-medium text-[#0F172A] dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800/50 flex items-center gap-3 transition-colors cursor-pointer">
                    <FileText className="w-4 h-4 text-slate-500 dark:text-slate-400" /> Export as PDF
                  </button>
                  <button className="w-full px-4 py-2.5 text-[14px] font-medium text-[#0F172A] dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800/50 flex items-center gap-3 transition-colors cursor-pointer">
                    <FileText className="w-4 h-4 text-slate-500 dark:text-slate-400" /> Export as Excel
                  </button>
                </div>
              </>
            )}
          </div>

          <button 
            onClick={openAddModal}
            className="px-4 py-2 bg-[#F59E0B] hover:bg-[#D97706] text-white text-[13px] font-semibold rounded-lg flex items-center gap-2 transition-colors shadow-sm cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Add Subject Group
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white dark:bg-slate-900 border border-border rounded-xl shadow-sm overflow-hidden text-left">
        {/* Table Header Section */}
        <div className="p-5 border-b border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <h2 className="text-[16px] font-bold text-slate-800 dark:text-slate-100">Class Syllabus</h2>
          
          <div className="flex items-center gap-3">
            <div className="relative">
              <button 
                onClick={() => setIsDateRangeOpen(!isDateRangeOpen)}
                className="px-3 py-2 bg-white dark:bg-slate-900 border border-border text-slate-700 dark:text-slate-200 text-[13px] font-medium rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors flex items-center gap-2 shadow-sm cursor-pointer"
              >
                <Calendar className="w-4 h-4 text-slate-400 dark:text-slate-500" /> {selectedDateRange}
              </button>
              {isDateRangeOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsDateRangeOpen(false)} />
                  <div className="absolute right-0 sm:left-0 top-full mt-2 w-44 bg-white dark:bg-slate-900 border border-border rounded-lg shadow-lg z-50 overflow-hidden py-1.5 text-left">
                    {["Today", "Yesterday", "Last 7 Days", "Last 30 Days", "This Year", "Next Year", "Custom Range"].map((item) => (
                      <button key={item} onClick={() => { setSelectedDateRange(item); setIsDateRangeOpen(false); }} className={`w-full px-4 py-2 text-[13px] text-left transition-colors cursor-pointer ${item === selectedDateRange ? "bg-[#F59E0B] text-white font-semibold" : "text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50"}`}>
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
                className="px-3 py-2 bg-white dark:bg-slate-900 border border-border text-slate-700 dark:text-slate-200 text-[13px] font-medium rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors flex items-center gap-2 shadow-sm cursor-pointer"
              >
                <Filter className="w-4 h-4 text-slate-400 dark:text-slate-500" /> Filter <ChevronDown className="w-3 h-3 text-slate-400 dark:text-slate-500" />
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
                        <label className="text-[13px] font-bold text-slate-800 dark:text-slate-100">Class</label>
                        <div className="relative">
                          <select className="w-full px-3 py-2 border border-border rounded-lg text-[13px] outline-none appearance-none bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 font-medium cursor-pointer">
                            <option>Select</option>
                            <option>I</option>
                            <option>II</option>
                            <option>III</option>
                            <option>IV</option>
                            <option>V</option>
                          </select>
                          <ChevronDown className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute right-3 top-2.5 pointer-events-none" />
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[13px] font-bold text-slate-800 dark:text-slate-100">Section</label>
                        <div className="relative">
                          <select className="w-full px-3 py-2 border border-border rounded-lg text-[13px] outline-none appearance-none bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 font-medium cursor-pointer">
                            <option>Select</option>
                            <option>A</option>
                            <option>B</option>
                            <option>C</option>
                          </select>
                          <ChevronDown className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute right-3 top-2.5 pointer-events-none" />
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[13px] font-bold text-slate-800 dark:text-slate-100">Status</label>
                        <div className="relative">
                          <select className="w-full px-3 py-2 border border-border rounded-lg text-[13px] outline-none appearance-none bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 font-medium cursor-pointer">
                            <option>Select</option>
                            <option>Active</option>
                            <option>Inactive</option>
                          </select>
                          <ChevronDown className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute right-3 top-2.5 pointer-events-none" />
                        </div>
                      </div>
                    </div>
                    <div className="p-4 flex justify-end gap-3 bg-white dark:bg-slate-900 rounded-b-lg border-t border-border mt-2">
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

            <div className="relative">
              <button 
                onClick={() => setIsSortOpen(!isSortOpen)}
                className="px-3 py-2 bg-white dark:bg-slate-900 border border-border text-slate-700 dark:text-slate-200 text-[13px] font-medium rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors flex items-center gap-2 shadow-sm cursor-pointer"
              >
                <List className="w-4 h-4 text-slate-400 dark:text-slate-500" /> Sort by A-Z <ChevronDown className="w-3 h-3 text-slate-400 dark:text-slate-500" />
              </button>
              {isSortOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsSortOpen(false)} />
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-slate-900 border border-border rounded-lg shadow-lg z-50 overflow-hidden py-1.5 text-left">
                    {["Ascending", "Descending", "Recently Viewed", "Recently Added"].map((item) => (
                      <button key={item} className="w-full px-4 py-2.5 text-[14px] text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/50 text-left transition-colors font-medium cursor-pointer">
                        {item}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Controls Section */}
        <div className="p-5 flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-50/50 dark:bg-slate-800/50">
          <div className="flex items-center gap-2 text-[13px] text-slate-500 dark:text-slate-400">
            <span>Row Per Page</span>
            <select className="px-2 py-1.5 bg-white dark:bg-slate-900 border border-border rounded-lg outline-none text-slate-700 dark:text-slate-200 font-medium cursor-pointer">
              <option>10</option>
              <option>25</option>
              <option>50</option>
            </select>
            <span>Entries</span>
          </div>

          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Search" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2 w-[240px] bg-white dark:bg-slate-900 border border-border rounded-lg text-[13px] outline-none focus:border-[#F59E0B] transition-colors"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-[13px]">
            <thead className="bg-[#F8FAFC] dark:bg-[#0F172A] border-y border-border">
              <tr>
                <th className="px-6 py-4 text-left font-bold text-slate-700 dark:text-slate-200 w-12">
                  <input type="checkbox" className="rounded border-slate-300 text-[#F59E0B] focus:ring-[#F59E0B] cursor-pointer" />
                </th>
                <th className="px-6 py-4 text-left font-bold text-slate-700 dark:text-slate-200">Class</th>
                <th className="px-6 py-4 text-left font-bold text-slate-700 dark:text-slate-200">Section</th>
                <th className="px-6 py-4 text-left font-bold text-slate-700 dark:text-slate-200">Subject Group</th>
                <th className="px-6 py-4 text-left font-bold text-slate-700 dark:text-slate-200">Created Date</th>
                <th className="px-6 py-4 text-left font-bold text-slate-700 dark:text-slate-200">Status</th>
                <th className="px-6 py-4 text-left font-bold text-slate-700 dark:text-slate-200 w-20">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredData.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="px-6 py-4">
                    <input type="checkbox" className="rounded border-slate-300 text-[#F59E0B] focus:ring-[#F59E0B] cursor-pointer" />
                  </td>
                  <td className="px-6 py-4 text-slate-600 dark:text-slate-300">{item.className}</td>
                  <td className="px-6 py-4 text-slate-600 dark:text-slate-300">{item.section}</td>
                  <td className="px-6 py-4 text-slate-600 dark:text-slate-300">{item.subjectGroup}</td>
                  <td className="px-6 py-4 text-slate-600 dark:text-slate-300">{item.createdDate}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-[11px] font-bold ${
                      item.status === "Active" 
                        ? "bg-[#E8F8E8] text-[#1D7F2C]" 
                        : "bg-[#FFEBEB] text-[#E02424]"
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${item.status === "Active" ? "bg-[#1DD04A]" : "bg-[#E02424]"}`} />
                      {item.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center relative" onClick={(e) => e.stopPropagation()}>
                    <button 
                      onClick={() => setActionMenuId(actionMenuId === item.id ? null : item.id)}
                      className={`p-1.5 rounded-lg transition-colors cursor-pointer ${actionMenuId === item.id ? "bg-[#F59E0B] text-white" : "hover:bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500"}`}
                    >
                      <MoreVertical className="w-4 h-4" />
                    </button>
                    {actionMenuId === item.id && (
                      <>
                        <div className="fixed inset-0 z-40" onClick={(e) => { e.stopPropagation(); setActionMenuId(null); }} />
                        <div className="absolute right-10 top-10 w-36 bg-white dark:bg-slate-900 border border-border rounded-xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)] z-50 overflow-hidden py-2 text-left">
                          <button onClick={() => openEditModal(item)} className="w-full px-4 py-2 text-[13px] text-[#0F172A] dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800/50 flex items-center gap-2 font-medium transition-colors cursor-pointer">
                            <Edit className="w-4 h-4 text-[#0F172A] dark:text-slate-100" /> Edit
                          </button>
                          <button onClick={() => openDeleteModal(item)} className="w-full px-4 py-2 text-[13px] text-[#0F172A] dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800/50 flex items-center gap-2 font-medium transition-colors cursor-pointer">
                            <Trash2 className="w-4 h-4 text-[#0F172A] dark:text-slate-100" /> Delete
                          </button>
                        </div>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-5 border-t border-border flex items-center justify-end gap-2">
          <button className="px-3 py-1.5 text-[13px] font-medium text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:text-slate-200 transition-colors">Prev</button>
          <button className="w-7 h-7 rounded-lg bg-[#F59E0B] text-white text-[13px] font-medium flex items-center justify-center">1</button>
          <button className="w-7 h-7 rounded-lg hover:bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[13px] font-medium flex items-center justify-center transition-colors">2</button>
          <button className="px-3 py-1.5 text-[13px] font-medium text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:text-slate-200 transition-colors">Next</button>
        </div>
      </div>

      {/* Add / Edit Modals */}
      <Modal isOpen={isAddOpen || isEditOpen} onClose={() => { setIsAddOpen(false); setIsEditOpen(false); }} title={isAddOpen ? "Add Subject Group" : "Edit Subject Group"}>
        <form onSubmit={isAddOpen ? handleAddSubmit : handleEditSubmit} className="p-6 space-y-5 text-left">
          
          <div className="space-y-1.5">
            <label className="text-[13px] font-bold text-slate-800 dark:text-slate-100">Class</label>
            <div className="relative">
              <select 
                value={formClass}
                onChange={(e) => setFormClass(e.target.value)}
                className="w-full px-4 py-2.5 text-[14px] bg-white dark:bg-slate-900 border border-border rounded-lg outline-none focus:border-[#F59E0B] transition-colors appearance-none text-slate-700 dark:text-slate-200 cursor-pointer"
                required
              >
                <option value="">Select</option>
                <option value="I">I</option>
                <option value="II">II</option>
                <option value="III">III</option>
                <option value="IV">IV</option>
                <option value="V">V</option>
              </select>
              <ChevronDown className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[13px] font-bold text-slate-800 dark:text-slate-100">Section</label>
            <div className="relative">
              <select 
                value={formSection}
                onChange={(e) => setFormSection(e.target.value)}
                className="w-full px-4 py-2.5 text-[14px] bg-white dark:bg-slate-900 border border-border rounded-lg outline-none focus:border-[#F59E0B] transition-colors appearance-none text-slate-700 dark:text-slate-200 cursor-pointer"
                required
              >
                <option value="">Select</option>
                <option value="A">A</option>
                <option value="B">B</option>
                <option value="C">C</option>
              </select>
              <ChevronDown className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[13px] font-bold text-slate-800 dark:text-slate-100">Subject Group</label>
            <input 
              type="text"
              value={formSubjectGroup}
              onChange={(e) => setFormSubjectGroup(e.target.value)}
              className="w-full px-4 py-2.5 text-[14px] bg-white dark:bg-slate-900 border border-border rounded-lg outline-none focus:border-[#F59E0B] transition-colors text-slate-700 dark:text-slate-200"
              required
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
            <button 
              type="button" 
              onClick={() => { setIsAddOpen(false); setIsEditOpen(false); }}
              className="px-6 py-2.5 bg-[#F1F5F9] dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-[14px] font-bold rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="px-6 py-2.5 bg-[#F59E0B] text-white text-[14px] font-bold rounded-lg hover:bg-[#D97706] transition-colors shadow-sm cursor-pointer"
            >
              {isAddOpen ? "Add Subject Group" : "Save Changes"}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      {isDeleteOpen && (
        <>
          <div className="fixed inset-0 bg-slate-900/50 z-[60] backdrop-blur-sm" onClick={() => setIsDeleteOpen(false)} />
          <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[400px] bg-white dark:bg-slate-900 rounded-2xl shadow-xl z-[70] overflow-hidden p-8 text-center animate-in fade-in zoom-in duration-200">
            <div className="w-16 h-16 bg-rose-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Trash2 className="w-8 h-8 text-rose-500" />
            </div>
            <h2 className="text-xl font-bold text-[#0F172A] dark:text-slate-100 mb-3">Confirm Deletion</h2>
            <p className="text-[14px] text-slate-500 dark:text-slate-400 leading-relaxed mb-8">
              You want to delete all the marked items, this cant be undone once you delete.
            </p>
            <div className="flex justify-center gap-3">
              <button 
                onClick={() => setIsDeleteOpen(false)}
                className="px-6 py-2.5 bg-[#F1F5F9] dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-[14px] font-bold rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button 
                onClick={handleDeleteConfirm}
                className="px-6 py-2.5 bg-rose-500 text-white text-[14px] font-bold rounded-lg hover:bg-rose-600 transition-colors shadow-sm shadow-rose-500/20 cursor-pointer"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </>
      )}

    </div>
  );
}
