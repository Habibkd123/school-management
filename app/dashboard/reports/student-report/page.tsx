"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  Search, List, Filter, ChevronDown, RefreshCw, Printer, Download, FileText, Calendar
} from "lucide-react";
import Image from "next/image";

interface StudentReportItem {
  id: string;
  admissionNo: string;
  rollNo: string;
  name: string;
  avatar: string;
  className: string;
  section: string;
  gender: string;
  parent: string;
  parentAvatar: string;
  dateOfJoin: string;
  dob: string;
  status: "Active" | "Inactive";
}

const mockStudentReport: StudentReportItem[] = [
  { id: "1", admissionNo: "AD9892425", rollNo: "35004", name: "Richard", avatar: "https://ui-avatars.com/api/?name=Richard&background=F1F5F9&color=5D6BEE&bold=true", className: "I", section: "A", gender: "Male", parent: "Mary", parentAvatar: "https://ui-avatars.com/api/?name=Mary&background=FEF3C7&color=D97706&bold=true", dateOfJoin: "22 Dec 2024", dob: "06 Oct 2011", status: "Active" },
  { id: "2", admissionNo: "AD9892426", rollNo: "35005", name: "Susan", avatar: "https://ui-avatars.com/api/?name=Susan&background=F1F5F9&color=5D6BEE&bold=true", className: "I", section: "A", gender: "Female", parent: "Michael", parentAvatar: "https://ui-avatars.com/api/?name=Michael&background=FEF3C7&color=D97706&bold=true", dateOfJoin: "08 Jan 2024", dob: "26 May 2010", status: "Inactive" },
  { id: "3", admissionNo: "AD9892427", rollNo: "35006", name: "Ryan", avatar: "https://ui-avatars.com/api/?name=Ryan&background=F1F5F9&color=5D6BEE&bold=true", className: "I", section: "A", gender: "Male", parent: "Jessie", parentAvatar: "https://ui-avatars.com/api/?name=Jessie&background=FEF3C7&color=D97706&bold=true", dateOfJoin: "19 Jan 2024", dob: "26 Nov 2012", status: "Active" },
  { id: "4", admissionNo: "AD9892428", rollNo: "35007", name: "Julie", avatar: "https://ui-avatars.com/api/?name=Julie&background=F1F5F9&color=5D6BEE&bold=true", className: "I", section: "A", gender: "Female", parent: "Robert", parentAvatar: "https://ui-avatars.com/api/?name=Robert&background=FEF3C7&color=D97706&bold=true", dateOfJoin: "24 Jan 2024", dob: "18 Sep 2013", status: "Active" },
  { id: "5", admissionNo: "AD9892429", rollNo: "35008", name: "Lisa", avatar: "https://ui-avatars.com/api/?name=Lisa&background=F1F5F9&color=5D6BEE&bold=true", className: "I", section: "A", gender: "Female", parent: "Colleen", parentAvatar: "https://ui-avatars.com/api/?name=Colleen&background=FEF3C7&color=D97706&bold=true", dateOfJoin: "11 Feb 2024", dob: "20 Jun 2015", status: "Active" },
  { id: "6", admissionNo: "AD9892430", rollNo: "35009", name: "Lisa", avatar: "https://ui-avatars.com/api/?name=Lisa&background=F1F5F9&color=5D6BEE&bold=true", className: "I", section: "A", gender: "Female", parent: "Arthur", parentAvatar: "https://ui-avatars.com/api/?name=Arthur&background=FEF3C7&color=D97706&bold=true", dateOfJoin: "13 Feb 2024", dob: "13 May 2017", status: "Inactive" },
  { id: "7", admissionNo: "AD9892431", rollNo: "35010", name: "Gifford", avatar: "https://ui-avatars.com/api/?name=Gifford&background=F1F5F9&color=5D6BEE&bold=true", className: "I", section: "A", gender: "Male", parent: "Claudia", parentAvatar: "https://ui-avatars.com/api/?name=Claudia&background=FEF3C7&color=D97706&bold=true", dateOfJoin: "27 Feb 2024", dob: "22 Mar 2018", status: "Active" },
  { id: "8", admissionNo: "AD9892432", rollNo: "35011", name: "Kathleen", avatar: "https://ui-avatars.com/api/?name=Kathleen&background=F1F5F9&color=5D6BEE&bold=true", className: "I", section: "A", gender: "Female", parent: "Johnson", parentAvatar: "https://ui-avatars.com/api/?name=Johnson&background=FEF3C7&color=D97706&bold=true", dateOfJoin: "14 Mar 2024", dob: "05 Dec 2017", status: "Active" },
  { id: "9", admissionNo: "AD9892433", rollNo: "35012", name: "Joann", avatar: "https://ui-avatars.com/api/?name=Joann&background=F1F5F9&color=5D6BEE&bold=true", className: "I", section: "A", gender: "Female", parent: "Marquita", parentAvatar: "https://ui-avatars.com/api/?name=Marquita&background=FEF3C7&color=D97706&bold=true", dateOfJoin: "18 Mar 2024", dob: "19 Aug 2014", status: "Active" },
  { id: "10", admissionNo: "AD9892434", rollNo: "35013", name: "Janet", avatar: "https://ui-avatars.com/api/?name=Janet&background=F1F5F9&color=5D6BEE&bold=true", className: "I", section: "A", gender: "Female", parent: "Thomas", parentAvatar: "https://ui-avatars.com/api/?name=Thomas&background=FEF3C7&color=D97706&bold=true", dateOfJoin: "25 Mar 2024", dob: "10 Jan 2015", status: "Active" },
];

export default function StudentReportPage() {
  const [searchTerm, setSearchTerm] = useState("");
  
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isDateRangeOpen, setIsDateRangeOpen] = useState(false);
  const [selectedDateRange, setSelectedDateRange] = useState("06/02/2026 - 06/08/2026");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);

  const filteredData = mockStudentReport.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          item.admissionNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.rollNo.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="space-y-6 bg-[#F8FAFC] dark:bg-[#0F172A] min-h-screen -m-6 p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">Student Report</h1>
          <div className="flex items-center gap-2 text-[13px] text-slate-500 dark:text-slate-400 mt-1">
            <span>Dashboard</span>
            <span>/</span>
            <span className="hover:text-[#F59E0B] cursor-pointer">Report</span>
            <span>/</span>
            <span className="text-slate-900 dark:text-white font-medium">Student Report</span>
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
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white dark:bg-slate-900 border border-border rounded-xl shadow-sm overflow-hidden text-left">
        {/* Table Header Section */}
        <div className="p-5 border-b border-border flex flex-col xl:flex-row xl:items-center justify-between gap-4">
          <h2 className="text-[16px] font-bold text-slate-800 dark:text-slate-100">
            Student Report List
          </h2>
          
          <div className="flex items-center gap-3 flex-wrap">
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
                  <div className="absolute right-0 top-full mt-2 w-44 bg-white dark:bg-slate-900 border border-border rounded-lg shadow-lg z-50 overflow-hidden py-1.5 text-left">
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
                  <div className="absolute right-0 top-full mt-2 w-80 bg-white dark:bg-slate-900 border border-border rounded-lg shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)] z-50 text-left">
                    <div className="p-4 border-b border-border">
                      <h3 className="text-[15px] font-bold text-[#0F172A] dark:text-slate-100">Filter</h3>
                    </div>
                    <div className="p-4 space-y-4 max-h-[60vh] overflow-y-auto">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-[13px] font-bold text-slate-800 dark:text-slate-100">Class</label>
                          <div className="relative">
                            <select className="w-full px-3 py-2 border border-border rounded-lg text-[13px] outline-none appearance-none bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 font-medium cursor-pointer">
                              <option value="">Select</option>
                              <option value="I">I</option>
                              <option value="II">II</option>
                            </select>
                            <ChevronDown className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute right-3 top-2.5 pointer-events-none" />
                          </div>
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[13px] font-bold text-slate-800 dark:text-slate-100">Section</label>
                          <div className="relative">
                            <select className="w-full px-3 py-2 border border-border rounded-lg text-[13px] outline-none appearance-none bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 font-medium cursor-pointer">
                              <option value="">Select</option>
                              <option value="A">A</option>
                              <option value="B">B</option>
                            </select>
                            <ChevronDown className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute right-3 top-2.5 pointer-events-none" />
                          </div>
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[13px] font-bold text-slate-800 dark:text-slate-100">Name</label>
                        <div className="relative">
                          <select className="w-full px-3 py-2 border border-border rounded-lg text-[13px] outline-none appearance-none bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 font-medium cursor-pointer">
                            <option value="">Select</option>
                            <option value="Richard">Richard</option>
                            <option value="Susan">Susan</option>
                          </select>
                          <ChevronDown className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute right-3 top-2.5 pointer-events-none" />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-[13px] font-bold text-slate-800 dark:text-slate-100">Gender</label>
                          <div className="relative">
                            <select className="w-full px-3 py-2 border border-border rounded-lg text-[13px] outline-none appearance-none bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 font-medium cursor-pointer">
                              <option value="">Select</option>
                              <option value="Male">Male</option>
                              <option value="Female">Female</option>
                            </select>
                            <ChevronDown className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute right-3 top-2.5 pointer-events-none" />
                          </div>
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[13px] font-bold text-slate-800 dark:text-slate-100">Status</label>
                          <div className="relative">
                            <select className="w-full px-3 py-2 border border-border rounded-lg text-[13px] outline-none appearance-none bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 font-medium cursor-pointer">
                              <option value="">Select</option>
                              <option value="Active">Active</option>
                              <option value="Inactive">Inactive</option>
                            </select>
                            <ChevronDown className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute right-3 top-2.5 pointer-events-none" />
                          </div>
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[13px] font-bold text-slate-800 dark:text-slate-100">Date of Join</label>
                        <div className="relative">
                          <input 
                            type="date"
                            className="w-full px-3 py-2 border border-border rounded-lg text-[13px] outline-none bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 font-medium cursor-pointer [color-scheme:light] dark:[color-scheme:dark]"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="p-4 flex justify-end gap-3 bg-white dark:bg-slate-900 rounded-b-lg border-t border-border mt-2">
                      <button 
                        onClick={() => setIsFilterOpen(false)}
                        className="px-5 py-2.5 bg-[#F1F5F9] dark:bg-slate-800 hover:bg-[#E2E8F0] dark:hover:bg-slate-700 text-[#0F172A] dark:text-slate-100 text-[13px] font-bold rounded-lg transition-colors cursor-pointer"
                      >
                        Reset
                      </button>
                      <button 
                        onClick={() => setIsFilterOpen(false)}
                        className="px-5 py-2.5 bg-[#F59E0B] hover:bg-[#D97706] text-white text-[13px] font-bold rounded-lg shadow-sm transition-colors cursor-pointer"
                      >
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
          <table className="w-full text-[13px] whitespace-nowrap">
            <thead className="bg-[#F8FAFC] dark:bg-[#0F172A]">
              <tr className="border-y border-border">
                <th className="px-6 py-4 text-left font-bold text-slate-700 dark:text-slate-200">Admission No</th>
                <th className="px-6 py-4 text-left font-bold text-slate-700 dark:text-slate-200">Roll No</th>
                <th className="px-6 py-4 text-left font-bold text-slate-700 dark:text-slate-200">Name</th>
                <th className="px-6 py-4 text-left font-bold text-slate-700 dark:text-slate-200">Class</th>
                <th className="px-6 py-4 text-left font-bold text-slate-700 dark:text-slate-200">Section</th>
                <th className="px-6 py-4 text-left font-bold text-slate-700 dark:text-slate-200">Gender</th>
                <th className="px-6 py-4 text-left font-bold text-slate-700 dark:text-slate-200">Parent</th>
                <th className="px-6 py-4 text-left font-bold text-slate-700 dark:text-slate-200">Date of Join</th>
                <th className="px-6 py-4 text-left font-bold text-slate-700 dark:text-slate-200">DOB</th>
                <th className="px-6 py-4 text-left font-bold text-slate-700 dark:text-slate-200">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredData.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="px-6 py-4 font-semibold text-[#F59E0B] hover:text-[#D97706] cursor-pointer">
                    {item.admissionNo}
                  </td>
                  <td className="px-6 py-4 text-slate-600 dark:text-slate-300">
                    {item.rollNo}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-full overflow-hidden flex-shrink-0 bg-slate-100 dark:bg-slate-800 relative">
                        <Image src={item.avatar} alt={item.name} fill className="object-cover" />
                      </div>
                      <span className="font-semibold text-[#0F172A] dark:text-slate-100">{item.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-600 dark:text-slate-300">{item.className}</td>
                  <td className="px-6 py-4 text-slate-600 dark:text-slate-300">{item.section}</td>
                  <td className="px-6 py-4 text-slate-600 dark:text-slate-300">{item.gender}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full overflow-hidden flex-shrink-0 bg-slate-100 dark:bg-slate-800 relative">
                        <Image src={item.parentAvatar} alt={item.parent} fill className="object-cover" />
                      </div>
                      <span className="text-slate-600 dark:text-slate-300">{item.parent}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-600 dark:text-slate-300">{item.dateOfJoin}</td>
                  <td className="px-6 py-4 text-slate-600 dark:text-slate-300">{item.dob}</td>
                  <td className="px-6 py-4">
                    {item.status === 'Active' ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[12px] font-semibold bg-emerald-50 text-emerald-600 border border-emerald-100">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                        Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[12px] font-semibold bg-rose-50 text-rose-600 border border-rose-100">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                        Inactive
                      </span>
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
          <button className="px-3 py-1.5 text-[13px] font-medium text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:text-slate-200 transition-colors">Next</button>
        </div>
      </div>
    </div>
  );
}
