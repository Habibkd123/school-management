"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  Search, List, Filter, ChevronDown, RefreshCw, Printer, Download, FileText, Calendar
} from "lucide-react";
import Image from "next/image";

interface GradeReportItem {
  id: string;
  admissionNo: string;
  studentName: string;
  rollNo: string;
  avatar: string;
  english: number;
  spanish: number;
  physics: number;
  chemistry: number;
  maths: number;
  computer: number;
  envScience: number;
  total: number;
  percent: number;
  grade: string;
}

const mockGradeReport: GradeReportItem[] = [
  { id: "1", admissionNo: "AD9892425", studentName: "Richard", rollNo: "35003", avatar: "https://ui-avatars.com/api/?name=Richard&background=F1F5F9&color=5D6BEE&bold=true", english: 72, spanish: 78, physics: 85, chemistry: 83, maths: 86, computer: 90, envScience: 92, total: 586, percent: 83, grade: "A+" },
  { id: "2", admissionNo: "AD9892426", studentName: "Susan", rollNo: "35004", avatar: "https://ui-avatars.com/api/?name=Susan&background=F1F5F9&color=5D6BEE&bold=true", english: 60, spanish: 62, physics: 65, chemistry: 70, maths: 72, computer: 63, envScience: 78, total: 470, percent: 67, grade: "B+" },
  { id: "3", admissionNo: "AD9892427", studentName: "Ryan", rollNo: "35005", avatar: "https://ui-avatars.com/api/?name=Ryan&background=F1F5F9&color=5D6BEE&bold=true", english: 40, spanish: 48, physics: 42, chemistry: 47, maths: 32, computer: 58, envScience: 50, total: 317, percent: 45, grade: "F" },
  { id: "4", admissionNo: "AD9892428", studentName: "Julie", rollNo: "35007", avatar: "https://ui-avatars.com/api/?name=Julie&background=F1F5F9&color=5D6BEE&bold=true", english: 72, spanish: 80, physics: 75, chemistry: 78, maths: 84, computer: 87, envScience: 76, total: 552, percent: 78, grade: "A" },
  { id: "5", admissionNo: "AD9892429", studentName: "Ralph", rollNo: "35008", avatar: "https://ui-avatars.com/api/?name=Ralph&background=F1F5F9&color=5D6BEE&bold=true", english: 43, spanish: 50, physics: 62, chemistry: 70, maths: 65, computer: 58, envScience: 60, total: 408, percent: 58, grade: "B" },
  { id: "6", admissionNo: "AD9892430", studentName: "Lisa", rollNo: "35009", avatar: "https://ui-avatars.com/api/?name=Lisa&background=F1F5F9&color=5D6BEE&bold=true", english: 36, spanish: 30, physics: 40, chemistry: 38, maths: 50, computer: 48, envScience: 43, total: 285, percent: 40, grade: "F" },
  { id: "7", admissionNo: "AD9892431", studentName: "Gifford", rollNo: "35010", avatar: "https://ui-avatars.com/api/?name=Gifford&background=F1F5F9&color=5D6BEE&bold=true", english: 60, spanish: 68, physics: 65, chemistry: 70, maths: 67, computer: 72, envScience: 75, total: 477, percent: 68, grade: "B+" },
  { id: "8", admissionNo: "AD9892432", studentName: "Kathleen", rollNo: "35011", avatar: "https://ui-avatars.com/api/?name=Kathleen&background=F1F5F9&color=5D6BEE&bold=true", english: 70, spanish: 80, physics: 85, chemistry: 78, maths: 82, computer: 83, envScience: 80, total: 558, percent: 79, grade: "A" },
  { id: "9", admissionNo: "AD9892433", studentName: "Joann", rollNo: "35012", avatar: "https://ui-avatars.com/api/?name=Joann&background=F1F5F9&color=5D6BEE&bold=true", english: 30, spanish: 35, physics: 36, chemistry: 28, maths: 38, computer: 40, envScience: 37, total: 244, percent: 34, grade: "F" },
  { id: "10", admissionNo: "AD9892434", studentName: "Janet", rollNo: "35013", avatar: "https://ui-avatars.com/api/?name=Janet&background=F1F5F9&color=5D6BEE&bold=true", english: 95, spanish: 93, physics: 88, chemistry: 90, maths: 85, computer: 98, envScience: 95, total: 644, percent: 92, grade: "O" },
];

export default function GradeReportPage() {
  const [searchTerm, setSearchTerm] = useState("");
  
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isDateRangeOpen, setIsDateRangeOpen] = useState(false);
  const [selectedDateRange, setSelectedDateRange] = useState("06/02/2026 - 06/08/2026");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);

  const filteredData = mockGradeReport.filter(item => {
    const matchesSearch = item.studentName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          item.admissionNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.rollNo.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const getScoreColor = (score: number) => score < 35 ? "text-rose-500 font-bold" : "text-slate-600 dark:text-slate-300";

  return (
    <div className="space-y-6 bg-[#F8FAFC] dark:bg-[#0F172A] min-h-screen -m-6 p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">Grade Report</h1>
          <div className="flex items-center gap-2 text-[13px] text-slate-500 dark:text-slate-400 mt-1">
            <span>Dashboard</span>
            <span>/</span>
            <span className="hover:text-[#F59E0B] cursor-pointer">Report</span>
            <span>/</span>
            <span className="text-slate-900 dark:text-white font-medium">Grade Report</span>
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
            Grade Report List
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
                      <div className="space-y-1.5">
                        <label className="text-[13px] font-bold text-slate-800 dark:text-slate-100">Exam Type</label>
                        <div className="relative">
                          <select className="w-full px-3 py-2 border border-border rounded-lg text-[13px] outline-none appearance-none bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 font-medium cursor-pointer">
                            <option value="">Select</option>
                            <option value="Half Yearly">Half Yearly</option>
                            <option value="Annual">Annual</option>
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
                <th className="px-6 py-4 text-left font-bold text-slate-700 dark:text-slate-200">Admission No</th>
                <th className="px-6 py-4 text-left font-bold text-slate-700 dark:text-slate-200 border-r border-border/50">Student Name</th>
                <th className="px-6 py-4 text-left font-bold text-slate-700 dark:text-slate-200">English</th>
                <th className="px-6 py-4 text-left font-bold text-slate-700 dark:text-slate-200">Spanish</th>
                <th className="px-6 py-4 text-left font-bold text-slate-700 dark:text-slate-200">Physics</th>
                <th className="px-6 py-4 text-left font-bold text-slate-700 dark:text-slate-200">Chemistry</th>
                <th className="px-6 py-4 text-left font-bold text-slate-700 dark:text-slate-200">Maths</th>
                <th className="px-6 py-4 text-left font-bold text-slate-700 dark:text-slate-200">Computer</th>
                <th className="px-6 py-4 text-left font-bold text-slate-700 dark:text-slate-200">Env Science</th>
                <th className="px-6 py-4 text-left font-bold text-slate-700 dark:text-slate-200 border-l border-border/50">Total</th>
                <th className="px-6 py-4 text-left font-bold text-slate-700 dark:text-slate-200">Percent(%)</th>
                <th className="px-6 py-4 text-left font-bold text-slate-700 dark:text-slate-200">Grade</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredData.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="px-6 py-4 font-semibold text-[#F59E0B] hover:text-[#D97706] cursor-pointer">
                    {item.admissionNo}
                  </td>
                  <td className="px-6 py-4 border-r border-border/50">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0 bg-slate-100 dark:bg-slate-800 relative">
                        <Image src={item.avatar} alt={item.studentName} fill className="object-cover" />
                      </div>
                      <div>
                        <div className="font-semibold text-slate-800 dark:text-slate-100">{item.studentName}</div>
                        <div className="text-[12px] text-slate-500 dark:text-slate-400">Roll No : {item.rollNo}</div>
                      </div>
                    </div>
                  </td>
                  <td className={`px-6 py-4 ${getScoreColor(item.english)}`}>{item.english}</td>
                  <td className={`px-6 py-4 ${getScoreColor(item.spanish)}`}>{item.spanish}</td>
                  <td className={`px-6 py-4 ${getScoreColor(item.physics)}`}>{item.physics}</td>
                  <td className={`px-6 py-4 ${getScoreColor(item.chemistry)}`}>{item.chemistry}</td>
                  <td className={`px-6 py-4 ${getScoreColor(item.maths)}`}>{item.maths}</td>
                  <td className={`px-6 py-4 ${getScoreColor(item.computer)}`}>{item.computer}</td>
                  <td className={`px-6 py-4 ${getScoreColor(item.envScience)}`}>{item.envScience}</td>
                  <td className="px-6 py-4 text-slate-700 dark:text-slate-200 font-medium border-l border-border/50">{item.total}</td>
                  <td className="px-6 py-4 text-slate-700 dark:text-slate-200 font-medium">{item.percent}</td>
                  <td className="px-6 py-4 text-slate-700 dark:text-slate-200 font-medium">{item.grade}</td>
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
