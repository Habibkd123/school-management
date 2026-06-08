"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  Plus, Search, List, Grid, MoreVertical, Edit, Trash2,
  Calendar, Filter, ChevronDown, RefreshCw, Printer, Download, ToggleRight, Trash, FileText
} from "lucide-react";
import { Modal } from "../../../components/ui/modal";

interface Subject {
  id: string;
  name: string;
  code: string;
  type: "Theory" | "Practical";
  status: "Active" | "Inactive";
}

const mockSubjects: Subject[] = [
  { id: "SU128394", name: "English", code: "101", type: "Theory", status: "Active" },
  { id: "SU128393", name: "Math", code: "102", type: "Theory", status: "Active" },
  { id: "SU128392", name: "Physics", code: "103", type: "Practical", status: "Active" },
  { id: "SU128391", name: "Chemistry", code: "104", type: "Practical", status: "Active" },
  { id: "SU128390", name: "Biology", code: "105", type: "Practical", status: "Inactive" },
  { id: "SU128389", name: "Higher Math", code: "106", type: "Practical", status: "Active" },
  { id: "SU128388", name: "Information Technology", code: "107", type: "Practical", status: "Active" },
  { id: "SU128387", name: "Moral Education", code: "108", type: "Practical", status: "Inactive" },
  { id: "SU128386", name: "Finance", code: "109", type: "Theory", status: "Active" },
  { id: "SU128385", name: "Economics", code: "110", type: "Theory", status: "Active" },
];

export default function SubjectsPage() {
  const [subjects, setSubjects] = useState<Subject[]>(mockSubjects);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isDateRangeOpen, setIsDateRangeOpen] = useState(false);
  const [selectedDateRange, setSelectedDateRange] = useState("06/02/2026 - 06/08/2026");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);
  
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [actionMenuId, setActionMenuId] = useState<string | null>(null);

  // Form states
  const [formName, setFormName] = useState("");
  const [formCode, setFormCode] = useState("");
  const [formType, setFormType] = useState<"Theory" | "Practical">("Theory");
  const [formStatus, setFormStatus] = useState(true);

  const openAddModal = () => {
    setFormName("");
    setFormCode("");
    setFormType("Theory");
    setFormStatus(true);
    setIsAddOpen(true);
  };

  const openEditModal = (subject: Subject) => {
    setSelectedSubject(subject);
    setFormName(subject.name);
    setFormCode(subject.code);
    setFormType(subject.type);
    setFormStatus(subject.status === "Active");
    setIsEditOpen(true);
    setActionMenuId(null);
  };

  const openDeleteModal = (subject: Subject) => {
    setSelectedSubject(subject);
    setIsDeleteOpen(true);
    setActionMenuId(null);
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newSubject: Subject = {
      id: `SU${Math.floor(100000 + Math.random() * 900000)}`,
      name: formName,
      code: formCode,
      type: formType,
      status: formStatus ? "Active" : "Inactive"
    };
    setSubjects([newSubject, ...subjects]);
    setIsAddOpen(false);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedSubject) {
      setSubjects(subjects.map(s => 
        s.id === selectedSubject.id 
          ? { ...s, name: formName, code: formCode, type: formType, status: formStatus ? "Active" : "Inactive" }
          : s
      ));
    }
    setIsEditOpen(false);
  };

  const handleDeleteConfirm = () => {
    if (selectedSubject) {
      setSubjects(subjects.filter(s => s.id !== selectedSubject.id));
    }
    setIsDeleteOpen(false);
  };

  const filteredSubjects = subjects.filter(s => 
    s.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 bg-[#F8FAFC] dark:bg-[#0F172A] min-h-screen -m-6 p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">Subjects</h1>
          <div className="flex items-center gap-2 text-[13px] text-slate-500 dark:text-slate-400 mt-1">
            <span>Dashboard</span>
            <span>/</span>
            <Link href="/dashboard/academic" className="hover:text-[#F59E0B]">Academic</Link>
            <span>/</span>
            <span className="text-slate-900 dark:text-white font-medium">Subjects</span>
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
            <Plus className="w-4 h-4" /> Add Subject
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white dark:bg-slate-900 border border-border rounded-xl shadow-sm overflow-hidden text-left">
        {/* Table Header Section */}
        <div className="p-5 border-b border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <h2 className="text-[16px] font-bold text-slate-800 dark:text-slate-100">Class Subject</h2>
          
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
                        <label className="text-[13px] font-bold text-slate-800 dark:text-slate-100">Name</label>
                        <div className="relative">
                          <select className="w-full px-3 py-2 border border-border rounded-lg text-[13px] outline-none appearance-none bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 font-medium cursor-pointer">
                            <option>Select</option>
                            <option>English</option>
                            <option>Math</option>
                            <option>Physics</option>
                          </select>
                          <ChevronDown className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute right-3 top-2.5 pointer-events-none" />
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[13px] font-bold text-slate-800 dark:text-slate-100">Code</label>
                        <div className="relative">
                          <select className="w-full px-3 py-2 border border-border rounded-lg text-[13px] outline-none appearance-none bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 font-medium cursor-pointer">
                            <option>Select</option>
                            <option>101</option>
                            <option>102</option>
                            <option>103</option>
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
                <th className="px-6 py-4 text-left font-bold text-slate-700 dark:text-slate-200">ID</th>
                <th className="px-6 py-4 text-left font-bold text-slate-700 dark:text-slate-200">Name</th>
                <th className="px-6 py-4 text-left font-bold text-slate-700 dark:text-slate-200">Code</th>
                <th className="px-6 py-4 text-left font-bold text-slate-700 dark:text-slate-200">Type</th>
                <th className="px-6 py-4 text-left font-bold text-slate-700 dark:text-slate-200">Status</th>
                <th className="px-6 py-4 text-left font-bold text-slate-700 dark:text-slate-200 w-20">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredSubjects.map((subject) => (
                <tr key={subject.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="px-6 py-4">
                    <input type="checkbox" className="rounded border-slate-300 text-[#F59E0B] focus:ring-[#F59E0B] cursor-pointer" />
                  </td>
                  <td className="px-6 py-4 font-semibold text-[#F59E0B]">{subject.id}</td>
                  <td className="px-6 py-4 text-slate-600 dark:text-slate-300">{subject.name}</td>
                  <td className="px-6 py-4 text-slate-600 dark:text-slate-300">{subject.code}</td>
                  <td className="px-6 py-4 text-slate-600 dark:text-slate-300">{subject.type}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-[11px] font-bold ${
                      subject.status === "Active" 
                        ? "bg-[#E8F8E8] text-[#1D7F2C]" 
                        : "bg-[#FFEBEB] text-[#E02424]"
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${subject.status === "Active" ? "bg-[#1DD04A]" : "bg-[#E02424]"}`} />
                      {subject.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center relative" onClick={(e) => e.stopPropagation()}>
                    <button 
                      onClick={() => setActionMenuId(actionMenuId === subject.id ? null : subject.id)}
                      className={`p-1.5 rounded-lg transition-colors cursor-pointer ${actionMenuId === subject.id ? "bg-[#F59E0B] text-white" : "hover:bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500"}`}
                    >
                      <MoreVertical className="w-4 h-4" />
                    </button>
                    {actionMenuId === subject.id && (
                      <>
                        <div className="fixed inset-0 z-40" onClick={(e) => { e.stopPropagation(); setActionMenuId(null); }} />
                        <div className="absolute right-10 top-10 w-36 bg-white dark:bg-slate-900 border border-border rounded-xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)] z-50 overflow-hidden py-2 text-left">
                          <button onClick={() => openEditModal(subject)} className="w-full px-4 py-2 text-[13px] text-[#0F172A] dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800/50 flex items-center gap-2 font-medium transition-colors cursor-pointer">
                            <Edit className="w-4 h-4 text-[#0F172A] dark:text-slate-100" /> Edit
                          </button>
                          <button onClick={() => openDeleteModal(subject)} className="w-full px-4 py-2 text-[13px] text-[#0F172A] dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800/50 flex items-center gap-2 font-medium transition-colors cursor-pointer">
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
      <Modal isOpen={isAddOpen || isEditOpen} onClose={() => { setIsAddOpen(false); setIsEditOpen(false); }} title={isAddOpen ? "Add Subject" : "Edit Subject"}>
        <form onSubmit={isAddOpen ? handleAddSubmit : handleEditSubmit} className="p-6 space-y-5 text-left">
          
          <div className="space-y-1.5">
            <label className="text-[13px] font-bold text-slate-800 dark:text-slate-100">Name</label>
            <input 
              type="text"
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
              className="w-full px-4 py-2.5 text-[14px] bg-white dark:bg-slate-900 border border-border rounded-lg outline-none focus:border-[#F59E0B] transition-colors text-slate-700 dark:text-slate-200"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[13px] font-bold text-slate-800 dark:text-slate-100">Code</label>
            <div className="relative">
              <select 
                value={formCode}
                onChange={(e) => setFormCode(e.target.value)}
                className="w-full px-4 py-2.5 text-[14px] bg-white dark:bg-slate-900 border border-border rounded-lg outline-none focus:border-[#F59E0B] transition-colors appearance-none text-slate-700 dark:text-slate-200 cursor-pointer"
                required
              >
                <option value="">Select</option>
                <option value="101">101</option>
                <option value="102">102</option>
                <option value="103">103</option>
                <option value="104">104</option>
                <option value="105">105</option>
                <option value="106">106</option>
                <option value="107">107</option>
                <option value="108">108</option>
                <option value="109">109</option>
                <option value="110">110</option>
              </select>
              <ChevronDown className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[13px] font-bold text-slate-800 dark:text-slate-100">Type</label>
            <div className="relative">
              <select 
                value={formType}
                onChange={(e) => setFormType(e.target.value as "Theory" | "Practical")}
                className="w-full px-4 py-2.5 text-[14px] bg-white dark:bg-slate-900 border border-border rounded-lg outline-none focus:border-[#F59E0B] transition-colors appearance-none text-slate-700 dark:text-slate-200 cursor-pointer"
                required
              >
                <option value="">Select</option>
                <option value="Theory">Theory</option>
                <option value="Practical">Practical</option>
              </select>
              <ChevronDown className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          <div className="flex items-center justify-between py-2 border-b border-border pb-6">
            <div>
              <label className="text-[14px] font-bold text-[#0F172A] dark:text-slate-100 block">Status</label>
              <span className="text-[13px] text-slate-500 dark:text-slate-400 block mt-1">Change the Status by toggle</span>
            </div>
            <button 
              type="button" 
              onClick={() => setFormStatus(!formStatus)}
              className="cursor-pointer focus:outline-none"
            >
              {formStatus ? (
                <ToggleRight className="w-10 h-10 text-[#F59E0B]" />
              ) : (
                <div className="w-10 h-10 flex items-center justify-center">
                  <div className="w-8 h-4 bg-slate-300 rounded-full relative">
                    <div className="w-3 h-3 bg-white dark:bg-slate-900 rounded-full absolute left-0.5 top-0.5 shadow-sm"></div>
                  </div>
                </div>
              )}
            </button>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
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
              {isAddOpen ? "Add Subject" : "Save Changes"}
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
