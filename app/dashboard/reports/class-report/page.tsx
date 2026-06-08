"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  Search, List, Filter, ChevronDown, RefreshCw, Printer, Download, FileText, Calendar, X
} from "lucide-react";
import Image from "next/image";

interface ClassReportItem {
  id: string;
  className: string;
  section: string;
  noOfStudents: number;
}

const mockClassReport: ClassReportItem[] = [
  { id: "C138038", className: "I", section: "A", noOfStudents: 30 },
  { id: "C138037", className: "I", section: "B", noOfStudents: 25 },
  { id: "C138036", className: "II", section: "A", noOfStudents: 40 },
  { id: "C138035", className: "II", section: "B", noOfStudents: 35 },
  { id: "C138034", className: "II", section: "C", noOfStudents: 25 },
  { id: "C138033", className: "III", section: "A", noOfStudents: 30 },
  { id: "C138032", className: "III", section: "B", noOfStudents: 25 },
  { id: "C138031", className: "IV", section: "A", noOfStudents: 20 },
  { id: "C138030", className: "IV", section: "B", noOfStudents: 30 },
  { id: "C138029", className: "V", section: "A", noOfStudents: 35 },
];

interface ModalStudentItem {
  id: string;
  admissionNo: string;
  rollNo: string;
  name: string;
  avatar: string;
  className: string;
  section: string;
  gender: string;
  parentName: string;
  parentAvatar: string;
  dob: string;
  status: "Active" | "Inactive";
}

const mockModalStudents: ModalStudentItem[] = [
  { id: "1", admissionNo: "AD9892434", rollNo: "35013", name: "Janet", avatar: "https://ui-avatars.com/api/?name=Janet&background=F1F5F9&color=5D6BEE&bold=true", className: "III", section: "A", gender: "Female", parentName: "Thomas", parentAvatar: "https://ui-avatars.com/api/?name=Thomas&background=FEF3C7&color=D97706&bold=true", dob: "10 Jan 2015", status: "Active" },
  { id: "2", admissionNo: "AD9892433", rollNo: "35012", name: "Joann", avatar: "https://ui-avatars.com/api/?name=Joann&background=F1F5F9&color=5D6BEE&bold=true", className: "IV", section: "B", gender: "Male", parentName: "Marquita", parentAvatar: "https://ui-avatars.com/api/?name=Marquita&background=FEF3C7&color=D97706&bold=true", dob: "19 Aug 2014", status: "Active" },
  { id: "3", admissionNo: "AD9892432", rollNo: "35011", name: "Kathleen", avatar: "https://ui-avatars.com/api/?name=Kathleen&background=F1F5F9&color=5D6BEE&bold=true", className: "II", section: "A", gender: "Female", parentName: "Johnson", parentAvatar: "https://ui-avatars.com/api/?name=Johnson&background=FEF3C7&color=D97706&bold=true", dob: "05 Dec 2017", status: "Active" },
  { id: "4", admissionNo: "AD9892431", rollNo: "35010", name: "Gifford", avatar: "https://ui-avatars.com/api/?name=Gifford&background=F1F5F9&color=5D6BEE&bold=true", className: "I", section: "B", gender: "Male", parentName: "Claudia", parentAvatar: "https://ui-avatars.com/api/?name=Claudia&background=FEF3C7&color=D97706&bold=true", dob: "22 Mar 2018", status: "Active" },
  { id: "5", admissionNo: "AD9892430", rollNo: "35009", name: "Lisa", avatar: "https://ui-avatars.com/api/?name=Lisa&background=F1F5F9&color=5D6BEE&bold=true", className: "II", section: "B", gender: "Female", parentName: "Arthur", parentAvatar: "https://ui-avatars.com/api/?name=Arthur&background=FEF3C7&color=D97706&bold=true", dob: "13 May 2017", status: "Inactive" },
  { id: "6", admissionNo: "AD9892429", rollNo: "35008", name: "Ralph", avatar: "https://ui-avatars.com/api/?name=Ralph&background=F1F5F9&color=5D6BEE&bold=true", className: "III", section: "B", gender: "Male", parentName: "Colleen", parentAvatar: "https://ui-avatars.com/api/?name=Colleen&background=FEF3C7&color=D97706&bold=true", dob: "20 Jun 2015", status: "Active" },
  { id: "7", admissionNo: "AD9892428", rollNo: "35007", name: "Julie", avatar: "https://ui-avatars.com/api/?name=Julie&background=F1F5F9&color=5D6BEE&bold=true", className: "V", section: "A", gender: "Female", parentName: "Robert", parentAvatar: "https://ui-avatars.com/api/?name=Robert&background=FEF3C7&color=D97706&bold=true", dob: "18 Sep 2013", status: "Active" },
  { id: "8", admissionNo: "AD9892427", rollNo: "35006", name: "Ryan", avatar: "https://ui-avatars.com/api/?name=Ryan&background=F1F5F9&color=5D6BEE&bold=true", className: "VI", section: "A", gender: "Male", parentName: "Jessie", parentAvatar: "https://ui-avatars.com/api/?name=Jessie&background=FEF3C7&color=D97706&bold=true", dob: "26 Nov 2012", status: "Active" },
  { id: "9", admissionNo: "AD9892426", rollNo: "35005", name: "Susan", avatar: "https://ui-avatars.com/api/?name=Susan&background=F1F5F9&color=5D6BEE&bold=true", className: "VIII", section: "B", gender: "Female", parentName: "Michael", parentAvatar: "https://ui-avatars.com/api/?name=Michael&background=FEF3C7&color=D97706&bold=true", dob: "26 May 2010", status: "Inactive" },
  { id: "10", admissionNo: "AD9892425", rollNo: "35004", name: "Richard", avatar: "https://ui-avatars.com/api/?name=Richard&background=F1F5F9&color=5D6BEE&bold=true", className: "VII", section: "B", gender: "Male", parentName: "Mary", parentAvatar: "https://ui-avatars.com/api/?name=Mary&background=FEF3C7&color=D97706&bold=true", dob: "06 Oct 2011", status: "Active" },
];

export default function ClassReportPage() {
  const [searchTerm, setSearchTerm] = useState("");
  
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isDateRangeOpen, setIsDateRangeOpen] = useState(false);
  const [selectedDateRange, setSelectedDateRange] = useState("06/02/2026 - 06/08/2026");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);

  const [selectedClass, setSelectedClass] = useState<ClassReportItem | null>(null);

  const filteredData = mockClassReport.filter(item => {
    const matchesSearch = item.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          item.className.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="space-y-6 bg-[#F8FAFC] dark:bg-[#0F172A] min-h-screen -m-6 p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">Class Report</h1>
          <div className="flex items-center gap-2 text-[13px] text-slate-500 dark:text-slate-400 mt-1">
            <span>Dashboard</span>
            <span>/</span>
            <span className="hover:text-[#F59E0B] cursor-pointer">Report</span>
            <span>/</span>
            <span className="text-slate-900 dark:text-white font-medium">Class Report</span>
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
            Class Report List
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
                    <div className="p-4 space-y-4">
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
                        <label className="text-[13px] font-bold text-slate-800 dark:text-slate-100">No Of Students</label>
                        <div className="relative">
                          <select className="w-full px-3 py-2 border border-border rounded-lg text-[13px] outline-none appearance-none bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 font-medium cursor-pointer">
                            <option value="">Select</option>
                            <option value="10-20">10-20</option>
                            <option value="20-30">20-30</option>
                            <option value="30-40">30-40</option>
                          </select>
                          <ChevronDown className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute right-3 top-2.5 pointer-events-none" />
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
                <th className="px-6 py-4 text-left font-bold text-slate-700 dark:text-slate-200 w-12">
                  <input type="checkbox" className="rounded border-slate-300 text-[#F59E0B] focus:ring-[#F59E0B]" />
                </th>
                <th className="px-6 py-4 text-left font-bold text-slate-700 dark:text-slate-200">ID</th>
                <th className="px-6 py-4 text-left font-bold text-slate-700 dark:text-slate-200">Class</th>
                <th className="px-6 py-4 text-left font-bold text-slate-700 dark:text-slate-200">Section</th>
                <th className="px-6 py-4 text-left font-bold text-slate-700 dark:text-slate-200">No of Students</th>
                <th className="px-6 py-4 text-left font-bold text-slate-700 dark:text-slate-200">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredData.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="px-6 py-4">
                    <input type="checkbox" className="rounded border-slate-300 text-[#F59E0B] focus:ring-[#F59E0B]" />
                  </td>
                  <td className="px-6 py-4 font-semibold text-[#F59E0B] hover:text-[#D97706] cursor-pointer">
                    {item.id}
                  </td>
                  <td className="px-6 py-4 text-slate-600 dark:text-slate-300">
                    {item.className}
                  </td>
                  <td className="px-6 py-4 text-slate-600 dark:text-slate-300">
                    {item.section}
                  </td>
                  <td className="px-6 py-4 text-slate-600 dark:text-slate-300">
                    {item.noOfStudents}
                  </td>
                  <td className="px-6 py-4">
                    <button 
                      onClick={() => setSelectedClass(item)}
                      className="px-4 py-1.5 bg-[#F1F5F9] dark:bg-slate-800 text-[#0F172A] dark:text-slate-100 text-[13px] font-bold rounded-md hover:bg-[#E2E8F0] dark:hover:bg-slate-700 transition-colors shadow-sm border border-[#E2E8F0] dark:border-slate-700 cursor-pointer"
                    >
                      View Details
                    </button>
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

      {/* Light Modal */}
      {selectedClass && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl w-full max-w-6xl max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-200">
            {/* Modal Header containing Search and Select */}
            <div className="p-5 flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-border bg-slate-50/50 dark:bg-slate-800/50 rounded-t-xl relative">
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
                  className="pl-9 pr-4 py-2 w-[240px] bg-white dark:bg-slate-900 border border-border rounded-lg text-[13px] outline-none focus:border-[#F59E0B] transition-colors"
                />
              </div>

              <button 
                onClick={() => setSelectedClass(null)}
                className="absolute right-4 top-4 w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-200 text-slate-500 dark:text-slate-400 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Table Content */}
            <div className="overflow-x-auto overflow-y-auto flex-1">
              <table className="w-full text-[13px] whitespace-nowrap">
                <thead className="bg-[#F8FAFC] dark:bg-[#0F172A] sticky top-0 z-10">
                  <tr className="border-b border-border">
                    <th className="px-6 py-4 text-left font-bold text-slate-700 dark:text-slate-200 w-12">
                      <input type="checkbox" className="rounded border-slate-300 text-[#F59E0B] focus:ring-[#F59E0B]" />
                    </th>
                    <th className="px-6 py-4 text-left font-bold text-slate-700 dark:text-slate-200">Admission No</th>
                    <th className="px-6 py-4 text-left font-bold text-slate-700 dark:text-slate-200">Roll No</th>
                    <th className="px-6 py-4 text-left font-bold text-slate-700 dark:text-slate-200">Name</th>
                    <th className="px-6 py-4 text-left font-bold text-slate-700 dark:text-slate-200">Class</th>
                    <th className="px-6 py-4 text-left font-bold text-slate-700 dark:text-slate-200">Section</th>
                    <th className="px-6 py-4 text-left font-bold text-slate-700 dark:text-slate-200">Gender</th>
                    <th className="px-6 py-4 text-left font-bold text-slate-700 dark:text-slate-200">Parent Name</th>
                    <th className="px-6 py-4 text-left font-bold text-slate-700 dark:text-slate-200">DOB</th>
                    <th className="px-6 py-4 text-left font-bold text-slate-700 dark:text-slate-200">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {mockModalStudents.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="px-6 py-4">
                        <input type="checkbox" className="rounded border-slate-300 text-[#F59E0B] focus:ring-[#F59E0B]" />
                      </td>
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
                            <Image src={item.parentAvatar} alt={item.parentName} fill className="object-cover" />
                          </div>
                          <span className="text-slate-600 dark:text-slate-300">{item.parentName}</span>
                        </div>
                      </td>
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

            {/* Modal Pagination */}
            <div className="p-5 border-t border-border flex items-center justify-end gap-2 bg-white dark:bg-slate-900 rounded-b-xl shrink-0">
              <button className="px-3 py-1.5 text-[13px] font-medium text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:text-slate-200 transition-colors">Prev</button>
              <button className="w-7 h-7 rounded-lg bg-[#F59E0B] text-white text-[13px] font-medium flex items-center justify-center">1</button>
              <button className="px-3 py-1.5 text-[13px] font-medium text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:text-slate-200 transition-colors">Next</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
