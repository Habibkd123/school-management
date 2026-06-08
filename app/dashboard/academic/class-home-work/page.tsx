"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  Plus, Search, List, Grid, MoreVertical, Edit, Trash2,
  Calendar, Filter, ChevronDown, RefreshCw, Printer, Download, Trash, FileText, ToggleRight
} from "lucide-react";
import { Modal } from "../../../components/ui/modal";

interface HomeWork {
  id: string;
  className: string;
  section: string;
  subject: string;
  homeworkDate: string;
  submissionDate: string;
  createdBy: { name: string; img: string };
  status: "Active" | "Inactive";
}

const mockHomeWorkData: HomeWork[] = [
  { id: "HW1783929", className: "I", section: "A", subject: "English", homeworkDate: "10 May 2024", submissionDate: "12 May 2024", createdBy: { name: "Janet", img: "https://i.pravatar.cc/150?u=1" }, status: "Active" },
  { id: "HW1783928", className: "I", section: "B", subject: "Math", homeworkDate: "11 May 2024", submissionDate: "13 May 2024", createdBy: { name: "Joann", img: "https://i.pravatar.cc/150?u=2" }, status: "Active" },
  { id: "HW1783927", className: "II", section: "A", subject: "Physics", homeworkDate: "12 May 2024", submissionDate: "14 May 2024", createdBy: { name: "Kathleen", img: "https://i.pravatar.cc/150?u=3" }, status: "Active" },
  { id: "HW1783926", className: "II", section: "B", subject: "Chemistry", homeworkDate: "13 May 2024", submissionDate: "15 May 2024", createdBy: { name: "Gifford", img: "https://i.pravatar.cc/150?u=4" }, status: "Active" },
  { id: "HW1783925", className: "II", section: "C", subject: "Biology", homeworkDate: "14 May 2024", submissionDate: "16 May 2024", createdBy: { name: "Lisa", img: "https://i.pravatar.cc/150?u=5" }, status: "Active" },
  { id: "HW1783924", className: "III", section: "A", subject: "Higher Math", homeworkDate: "15 May 2024", submissionDate: "17 May 2024", createdBy: { name: "Ralph", img: "https://i.pravatar.cc/150?u=6" }, status: "Active" },
  { id: "HW1783923", className: "III", section: "B", subject: "Information Technology", homeworkDate: "16 May 2024", submissionDate: "18 May 2024", createdBy: { name: "Julie", img: "https://i.pravatar.cc/150?u=7" }, status: "Active" },
  { id: "HW1783922", className: "IV", section: "A", subject: "Moral Education", homeworkDate: "17 May 2024", submissionDate: "19 May 2024", createdBy: { name: "Ryan", img: "https://i.pravatar.cc/150?u=8" }, status: "Active" },
  { id: "HW1783921", className: "IV", section: "B", subject: "Finance", homeworkDate: "18 May 2024", submissionDate: "20 May 2024", createdBy: { name: "Susan", img: "https://i.pravatar.cc/150?u=9" }, status: "Active" },
  { id: "HW1783920", className: "V", section: "A", subject: "Economics", homeworkDate: "19 May 2024", submissionDate: "21 May 2024", createdBy: { name: "Richard", img: "https://i.pravatar.cc/150?u=10" }, status: "Active" },
];

export default function ClassHomeWorkPage() {
  const [hwData, setHwData] = useState<HomeWork[]>(mockHomeWorkData);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isDateRangeOpen, setIsDateRangeOpen] = useState(false);
  const [selectedDateRange, setSelectedDateRange] = useState("06/02/2026 - 06/08/2026");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);
  
  const [selectedHw, setSelectedHw] = useState<HomeWork | null>(null);
  const [actionMenuId, setActionMenuId] = useState<string | null>(null);

  // Form states
  const [formClass, setFormClass] = useState("");
  const [formSection, setFormSection] = useState("");
  const [formSubject, setFormSubject] = useState("");
  const [formHomeworkDate, setFormHomeworkDate] = useState("");
  const [formSubmissionDate, setFormSubmissionDate] = useState("");
  const [formAttachmentText, setFormAttachmentText] = useState("");
  const [formComment, setFormComment] = useState("");
  const [formStatus, setFormStatus] = useState(true);

  const openAddModal = () => {
    setFormClass("");
    setFormSection("");
    setFormSubject("");
    setFormHomeworkDate("");
    setFormSubmissionDate("");
    setFormAttachmentText("");
    setFormComment("");
    setFormStatus(true);
    setIsAddOpen(true);
  };

  const openEditModal = (item: HomeWork) => {
    setSelectedHw(item);
    setFormClass(item.className);
    setFormSection(item.section);
    setFormSubject(item.subject);
    setFormHomeworkDate(item.homeworkDate);
    setFormSubmissionDate(item.submissionDate);
    setFormAttachmentText("");
    setFormComment("");
    setFormStatus(item.status === "Active");
    setIsEditOpen(true);
    setActionMenuId(null);
  };

  const openDeleteModal = (item: HomeWork) => {
    setSelectedHw(item);
    setIsDeleteOpen(true);
    setActionMenuId(null);
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newItem: HomeWork = {
      id: `HW1${Math.floor(100000 + Math.random() * 900000)}`,
      className: formClass,
      section: formSection,
      subject: formSubject,
      homeworkDate: formHomeworkDate || new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
      submissionDate: formSubmissionDate || new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
      createdBy: { name: "You", img: "https://i.pravatar.cc/150?u=you" },
      status: formStatus ? "Active" : "Inactive"
    };
    setHwData([newItem, ...hwData]);
    setIsAddOpen(false);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedHw) {
      setHwData(hwData.map(s => 
        s.id === selectedHw.id 
          ? { ...s, className: formClass, section: formSection, subject: formSubject, homeworkDate: formHomeworkDate, submissionDate: formSubmissionDate, status: formStatus ? "Active" : "Inactive" }
          : s
      ));
    }
    setIsEditOpen(false);
  };

  const handleDeleteConfirm = () => {
    if (selectedHw) {
      setHwData(hwData.filter(s => s.id !== selectedHw.id));
    }
    setIsDeleteOpen(false);
  };

  const filteredData = hwData.filter(s => 
    s.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.className.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.createdBy.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 bg-[#F8FAFC] dark:bg-[#0F172A] min-h-screen -m-6 p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">Class Work</h1>
          <div className="flex items-center gap-2 text-[13px] text-slate-500 dark:text-slate-400 mt-1">
            <span>Dashboard</span>
            <span>/</span>
            <Link href="/dashboard/academic" className="hover:text-[#F59E0B]">Academic</Link>
            <span>/</span>
            <span className="text-slate-900 dark:text-white font-medium">Class Work</span>
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
            <Plus className="w-4 h-4" /> Add Home Work
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white dark:bg-slate-900 border border-border rounded-xl shadow-sm overflow-hidden text-left">
        {/* Table Header Section */}
        <div className="p-5 border-b border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <h2 className="text-[16px] font-bold text-slate-800 dark:text-slate-100">Class Home Work</h2>
          
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
                        <label className="text-[13px] font-bold text-slate-800 dark:text-slate-100">Subject</label>
                        <div className="relative">
                          <select className="w-full px-3 py-2 border border-border rounded-lg text-[13px] outline-none appearance-none bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 font-medium cursor-pointer">
                            <option>Select</option>
                            <option>English</option>
                            <option>Maths</option>
                            <option>Physics</option>
                          </select>
                          <ChevronDown className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute right-3 top-2.5 pointer-events-none" />
                        </div>
                      </div>
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
                        <label className="text-[13px] font-bold text-slate-800 dark:text-slate-100">Date</label>
                        <div className="relative">
                          <select className="w-full px-3 py-2 border border-border rounded-lg text-[13px] outline-none appearance-none bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 font-medium cursor-pointer">
                            <option>Select</option>
                            <option>Today</option>
                            <option>Yesterday</option>
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
                <th className="px-6 py-4 text-left font-bold text-slate-700 dark:text-slate-200">Class</th>
                <th className="px-6 py-4 text-left font-bold text-slate-700 dark:text-slate-200">Section</th>
                <th className="px-6 py-4 text-left font-bold text-slate-700 dark:text-slate-200">Subject</th>
                <th className="px-6 py-4 text-left font-bold text-slate-700 dark:text-slate-200">Homework Date</th>
                <th className="px-6 py-4 text-left font-bold text-slate-700 dark:text-slate-200">Submission Date</th>
                <th className="px-6 py-4 text-left font-bold text-slate-700 dark:text-slate-200">Created By</th>
                <th className="px-6 py-4 text-left font-bold text-slate-700 dark:text-slate-200 w-20">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredData.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="px-6 py-4">
                    <input type="checkbox" className="rounded border-slate-300 text-[#F59E0B] focus:ring-[#F59E0B] cursor-pointer" />
                  </td>
                  <td className="px-6 py-4">
                    <button className="font-semibold text-[#F59E0B] hover:text-[#D97706] transition-colors cursor-pointer">
                      {item.id}
                    </button>
                  </td>
                  <td className="px-6 py-4 text-slate-600 dark:text-slate-300">{item.className}</td>
                  <td className="px-6 py-4 text-slate-600 dark:text-slate-300">{item.section}</td>
                  <td className="px-6 py-4 text-slate-600 dark:text-slate-300">{item.subject}</td>
                  <td className="px-6 py-4 text-slate-600 dark:text-slate-300">{item.homeworkDate}</td>
                  <td className="px-6 py-4 text-slate-600 dark:text-slate-300">{item.submissionDate}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img src={item.createdBy.img} alt={item.createdBy.name} className="w-8 h-8 rounded-full object-cover border border-white shadow-sm" />
                      <span className="text-slate-700 dark:text-slate-200 font-medium">{item.createdBy.name}</span>
                    </div>
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
      <Modal isOpen={isAddOpen || isEditOpen} onClose={() => { setIsAddOpen(false); setIsEditOpen(false); }} title={isAddOpen ? "Add Home Work" : "Edit Home Work"}>
        <form onSubmit={isAddOpen ? handleAddSubmit : handleEditSubmit} className="p-6 space-y-5 text-left max-h-[80vh] overflow-y-auto custom-scrollbar">
          
          <div className="space-y-1.5">
            <label className="text-[13px] font-bold text-slate-800 dark:text-slate-100">Class</label>
            <input 
              type="text"
              value={formClass}
              onChange={(e) => setFormClass(e.target.value)}
              className="w-full px-4 py-2.5 text-[14px] bg-white dark:bg-slate-900 border border-border rounded-lg outline-none focus:border-[#F59E0B] transition-colors text-slate-700 dark:text-slate-200"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
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
              <label className="text-[13px] font-bold text-slate-800 dark:text-slate-100">Subject</label>
              <div className="relative">
                <select 
                  value={formSubject}
                  onChange={(e) => setFormSubject(e.target.value)}
                  className="w-full px-4 py-2.5 text-[14px] bg-white dark:bg-slate-900 border border-border rounded-lg outline-none focus:border-[#F59E0B] transition-colors appearance-none text-slate-700 dark:text-slate-200 cursor-pointer"
                  required
                >
                  <option value="">Select</option>
                  <option value="English">English</option>
                  <option value="Math">Math</option>
                  <option value="Physics">Physics</option>
                  <option value="Chemistry">Chemistry</option>
                  <option value="Biology">Biology</option>
                </select>
                <ChevronDown className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[13px] font-bold text-slate-800 dark:text-slate-100">Homework Date</label>
              <input 
                type="text"
                placeholder="10 May 2024"
                value={formHomeworkDate}
                onChange={(e) => setFormHomeworkDate(e.target.value)}
                className="w-full px-4 py-2.5 text-[14px] bg-white dark:bg-slate-900 border border-border rounded-lg outline-none focus:border-[#F59E0B] transition-colors text-slate-700 dark:text-slate-200"
                required
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[13px] font-bold text-slate-800 dark:text-slate-100">Submission Date</label>
              <input 
                type="text"
                placeholder="12 May 2024"
                value={formSubmissionDate}
                onChange={(e) => setFormSubmissionDate(e.target.value)}
                className="w-full px-4 py-2.5 text-[14px] bg-white dark:bg-slate-900 border border-border rounded-lg outline-none focus:border-[#F59E0B] transition-colors text-slate-700 dark:text-slate-200"
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[13px] font-bold text-slate-800 dark:text-slate-100">Attachments</label>
            <input 
              type="text"
              placeholder="Placeholders"
              value={formAttachmentText}
              onChange={(e) => setFormAttachmentText(e.target.value)}
              className="w-full px-4 py-2.5 text-[14px] bg-white dark:bg-slate-900 border border-border rounded-lg outline-none focus:border-[#F59E0B] transition-colors text-slate-700 dark:text-slate-200"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[13px] font-bold text-slate-800 dark:text-slate-100">Attachments</label>
            <textarea 
              rows={4}
              placeholder="Add Comment"
              value={formComment}
              onChange={(e) => setFormComment(e.target.value)}
              className="w-full px-4 py-2.5 text-[14px] bg-white dark:bg-slate-900 border border-border rounded-lg outline-none focus:border-[#F59E0B] transition-colors text-slate-700 dark:text-slate-200 resize-none"
            />
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
              {isAddOpen ? "Add Homework" : "Save Changes"}
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
