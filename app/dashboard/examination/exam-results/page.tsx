"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  Search, List, Grid, 
  Calendar, Filter, ChevronDown, RefreshCw, Printer, Download, FileText
} from "lucide-react";

interface ExamResult {
  id: string; // Database ID
  admissionNo: string;
  name: string;
  image: string;
  rollNo: string;
  marks: {
    english: number;
    spanish: number;
    physics: number;
    chemistry: number;
    maths: number;
    computer: number;
    envScience: number;
  };
}

const mockResultData: ExamResult[] = [
  { 
    id: "1", admissionNo: "AD9892434", name: "Janet", image: "https://i.pravatar.cc/150?u=1", rollNo: "35013",
    marks: { english: 95, spanish: 93, physics: 88, chemistry: 90, maths: 85, computer: 98, envScience: 95 }
  },
  { 
    id: "2", admissionNo: "AD9892433", name: "Joann", image: "https://i.pravatar.cc/150?u=2", rollNo: "35012",
    marks: { english: 30, spanish: 35, physics: 36, chemistry: 28, maths: 38, computer: 40, envScience: 37 }
  },
  { 
    id: "3", admissionNo: "AD9892432", name: "Kathleen", image: "https://i.pravatar.cc/150?u=3", rollNo: "35011",
    marks: { english: 70, spanish: 80, physics: 85, chemistry: 78, maths: 82, computer: 83, envScience: 80 }
  },
  { 
    id: "4", admissionNo: "AD9892431", name: "Gifford", image: "https://i.pravatar.cc/150?u=4", rollNo: "35010",
    marks: { english: 60, spanish: 68, physics: 65, chemistry: 70, maths: 67, computer: 72, envScience: 75 }
  },
  { 
    id: "5", admissionNo: "AD9892430", name: "Lisa", image: "https://i.pravatar.cc/150?u=5", rollNo: "35009",
    marks: { english: 36, spanish: 30, physics: 40, chemistry: 38, maths: 50, computer: 48, envScience: 43 }
  },
  { 
    id: "6", admissionNo: "AD9892429", name: "Ralph", image: "https://i.pravatar.cc/150?u=6", rollNo: "35008",
    marks: { english: 43, spanish: 50, physics: 62, chemistry: 70, maths: 65, computer: 58, envScience: 60 }
  },
  { 
    id: "7", admissionNo: "AD9892428", name: "Julie", image: "https://i.pravatar.cc/150?u=7", rollNo: "35007",
    marks: { english: 72, spanish: 80, physics: 75, chemistry: 78, maths: 94, computer: 87, envScience: 76 }
  },
  { 
    id: "8", admissionNo: "AD9892427", name: "Ryan", image: "https://i.pravatar.cc/150?u=8", rollNo: "35006",
    marks: { english: 40, spanish: 48, physics: 42, chemistry: 47, maths: 32, computer: 58, envScience: 50 }
  },
];

const PASS_MARK = 35;

export default function ExamResultsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isDateRangeOpen, setIsDateRangeOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);

  // Filter States
  const [filterClass, setFilterClass] = useState("");
  const [filterSection, setFilterSection] = useState("");
  const [filterExamType, setFilterExamType] = useState("");

  const filteredData = mockResultData.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.admissionNo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const calculateTotal = (marks: ExamResult["marks"]) => {
    return Object.values(marks).reduce((a, b) => a + b, 0);
  };

  const calculatePercent = (total: number, maxSubjects: number) => {
    return Math.round((total / (maxSubjects * 100)) * 100);
  };

  const calculateGrade = (percent: number) => {
    if (percent >= 90) return "O";
    if (percent >= 80) return "A+";
    if (percent >= 70) return "A";
    if (percent >= 60) return "B+";
    if (percent >= 50) return "B";
    if (percent >= 40) return "C+";
    if (percent >= 35) return "C";
    return "F";
  };

  const isFailed = (marks: ExamResult["marks"]) => {
    return Object.values(marks).some(mark => mark < PASS_MARK);
  };

  return (
    <div className="space-y-6 bg-[#F8FAFC] min-h-screen -m-6 p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Exam Result</h1>
          <div className="flex items-center gap-2 text-[13px] text-slate-500 mt-1">
            <span>Dashboard</span>
            <span>/</span>
            <Link href="/dashboard/examination" className="hover:text-[#5D6BEE]">Examination</Link>
            <span>/</span>
            <span className="text-slate-900 font-medium">Exam Result</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button className="w-9 h-9 rounded-full bg-white border border-border flex items-center justify-center text-slate-500 hover:text-[#5D6BEE] hover:bg-indigo-50 transition-colors shadow-sm cursor-pointer">
            <RefreshCw className="w-4 h-4" />
          </button>
          <button className="w-9 h-9 rounded-full bg-white border border-border flex items-center justify-center text-slate-500 hover:text-[#5D6BEE] hover:bg-indigo-50 transition-colors shadow-sm cursor-pointer">
            <Printer className="w-4 h-4" />
          </button>
          
          <div className="relative">
            <button 
              onClick={() => setIsExportOpen(!isExportOpen)}
              className="px-4 py-2 bg-white border border-border text-slate-700 text-[13px] font-semibold rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-2 shadow-sm cursor-pointer"
            >
              <Download className="w-4 h-4" /> Export <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>
            {isExportOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setIsExportOpen(false)} />
                <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-border rounded-lg shadow-lg z-50 overflow-hidden py-2 text-left">
                  <button className="w-full px-4 py-2.5 text-[14px] font-medium text-[#202c4b] hover:bg-slate-50 flex items-center gap-3 transition-colors cursor-pointer">
                    <FileText className="w-4 h-4 text-slate-500" /> Export as PDF
                  </button>
                  <button className="w-full px-4 py-2.5 text-[14px] font-medium text-[#202c4b] hover:bg-slate-50 flex items-center gap-3 transition-colors cursor-pointer">
                    <FileText className="w-4 h-4 text-slate-500" /> Export as Excel
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white border border-border rounded-xl shadow-sm overflow-hidden text-left">
        {/* Table Header Section */}
        <div className="p-5 border-b border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <h2 className="text-[16px] font-bold text-slate-800">Exam Results</h2>
          
          <div className="flex items-center gap-3">
            <div className="relative">
              <button 
                onClick={() => setIsDateRangeOpen(!isDateRangeOpen)}
                className="px-3 py-2 bg-white border border-border text-slate-700 text-[13px] font-medium rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-2 shadow-sm cursor-pointer"
              >
                <Calendar className="w-4 h-4 text-slate-400" /> 06/02/2026 - 06/08/2026
              </button>
              {isDateRangeOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsDateRangeOpen(false)} />
                  <div className="absolute right-0 sm:left-0 top-full mt-2 w-44 bg-white border border-border rounded-lg shadow-lg z-50 overflow-hidden py-1.5 text-left">
                    {["Today", "Yesterday", "Last 7 Days", "Last 30 Days", "This Year", "Next Year", "Custom Range"].map((item) => (
                      <button key={item} className={`w-full px-4 py-2 text-[13px] text-left transition-colors cursor-pointer ${item === "Last 7 Days" ? "bg-[#5D6BEE] text-white font-semibold" : "text-slate-600 hover:bg-slate-50"}`}>
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
                className="px-3 py-2 bg-white border border-border text-slate-700 text-[13px] font-medium rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-2 shadow-sm cursor-pointer"
              >
                <Filter className="w-4 h-4 text-slate-400" /> Filter <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>
              {isFilterOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsFilterOpen(false)} />
                  <div className="absolute right-0 sm:left-0 sm:right-auto top-full mt-2 w-64 bg-white border border-border rounded-lg shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)] z-50 text-left">
                    <div className="p-4 border-b border-border">
                      <h3 className="text-[15px] font-bold text-[#202c4b]">Filter</h3>
                    </div>
                    <div className="p-4 space-y-4">
                      <div className="space-y-1.5">
                        <label className="text-[13px] font-bold text-slate-800">Class</label>
                        <div className="relative">
                          <select 
                            value={filterClass}
                            onChange={(e) => setFilterClass(e.target.value)}
                            className="w-full px-3 py-2 border border-border rounded-lg text-[13px] outline-none appearance-none bg-white text-slate-600 font-medium cursor-pointer"
                          >
                            <option value="">Select</option>
                            <option value="I">I</option>
                            <option value="II">II</option>
                            <option value="III">III</option>
                          </select>
                          <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-2.5 pointer-events-none" />
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[13px] font-bold text-slate-800">Section</label>
                        <div className="relative">
                          <select 
                            value={filterSection}
                            onChange={(e) => setFilterSection(e.target.value)}
                            className="w-full px-3 py-2 border border-border rounded-lg text-[13px] outline-none appearance-none bg-white text-slate-600 font-medium cursor-pointer"
                          >
                            <option value="">Select</option>
                            <option value="A">A</option>
                            <option value="B">B</option>
                          </select>
                          <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-2.5 pointer-events-none" />
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[13px] font-bold text-slate-800">Exam Type</label>
                        <div className="relative">
                          <select 
                            value={filterExamType}
                            onChange={(e) => setFilterExamType(e.target.value)}
                            className="w-full px-3 py-2 border border-border rounded-lg text-[13px] outline-none appearance-none bg-white text-slate-600 font-medium cursor-pointer"
                          >
                            <option value="">Select</option>
                            <option value="Half Yearly">Half Yearly</option>
                            <option value="Annual">Annual</option>
                          </select>
                          <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-2.5 pointer-events-none" />
                        </div>
                      </div>
                    </div>
                    <div className="p-4 flex justify-end gap-3 bg-white rounded-b-lg border-t border-border mt-2">
                      <button 
                        onClick={() => { setFilterClass(""); setFilterSection(""); setFilterExamType(""); }}
                        className="px-5 py-2.5 bg-[#F1F5F9] hover:bg-[#E2E8F0] text-[#202c4b] text-[13px] font-bold rounded-lg transition-colors cursor-pointer"
                      >
                        Reset
                      </button>
                      <button 
                        onClick={() => setIsFilterOpen(false)}
                        className="px-5 py-2.5 bg-[#5D6BEE] hover:bg-[#4b58ce] text-white text-[13px] font-bold rounded-lg shadow-sm transition-colors cursor-pointer"
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
                className="px-3 py-2 bg-white border border-border text-slate-700 text-[13px] font-medium rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-2 shadow-sm cursor-pointer"
              >
                <List className="w-4 h-4 text-slate-400" /> Sort by A-Z <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>
              {isSortOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsSortOpen(false)} />
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-border rounded-lg shadow-lg z-50 overflow-hidden py-1.5 text-left">
                    {["Ascending", "Descending", "Recently Viewed", "Recently Added"].map((item) => (
                      <button key={item} className="w-full px-4 py-2.5 text-[14px] text-slate-700 hover:bg-slate-50 text-left transition-colors font-medium cursor-pointer">
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
        <div className="p-5 flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-50/50">
          <div className="flex items-center gap-2 text-[13px] text-slate-500">
            <span>Row Per Page</span>
            <select className="px-2 py-1.5 bg-white border border-border rounded-lg outline-none text-slate-700 font-medium cursor-pointer">
              <option>10</option>
              <option>25</option>
              <option>50</option>
            </select>
            <span>Entries</span>
          </div>

          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Search" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2 w-[240px] bg-white border border-border rounded-lg text-[13px] outline-none focus:border-[#5D6BEE] transition-colors"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-[13px] whitespace-nowrap">
            <thead className="bg-[#F8FAFC] border-y border-border">
              <tr>
                <th className="px-6 py-4 text-left font-bold text-slate-700 w-12">
                  <input type="checkbox" className="rounded border-slate-300 text-[#5D6BEE] focus:ring-[#5D6BEE] cursor-pointer" />
                </th>
                <th className="px-6 py-4 text-left font-bold text-slate-700">Admission No</th>
                <th className="px-6 py-4 text-left font-bold text-slate-700">Student Name</th>
                <th className="px-6 py-4 text-left font-bold text-slate-700">English</th>
                <th className="px-6 py-4 text-left font-bold text-slate-700">Spanish</th>
                <th className="px-6 py-4 text-left font-bold text-slate-700">Physics</th>
                <th className="px-6 py-4 text-left font-bold text-slate-700">Chemistry</th>
                <th className="px-6 py-4 text-left font-bold text-slate-700">Maths</th>
                <th className="px-6 py-4 text-left font-bold text-slate-700">Computer</th>
                <th className="px-6 py-4 text-left font-bold text-slate-700">Env Science</th>
                <th className="px-6 py-4 text-left font-bold text-slate-700">Total</th>
                <th className="px-6 py-4 text-left font-bold text-slate-700">Percent(%)</th>
                <th className="px-6 py-4 text-left font-bold text-slate-700">Grade</th>
                <th className="px-6 py-4 text-left font-bold text-slate-700">Result</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredData.map((item) => {
                const total = calculateTotal(item.marks);
                const percent = calculatePercent(total, 7);
                const grade = calculateGrade(percent);
                const failed = isFailed(item.marks);

                return (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-6 py-4">
                      <input type="checkbox" className="rounded border-slate-300 text-[#5D6BEE] focus:ring-[#5D6BEE] cursor-pointer" />
                    </td>
                    <td className="px-6 py-4">
                      <button className="font-semibold text-[#5D6BEE] hover:text-[#4b58ce] transition-colors cursor-pointer">
                        {item.admissionNo}
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      <Link href={`/dashboard/students/${item.id}`} className="flex items-center gap-3 hover:bg-slate-50 p-1.5 -ml-1.5 rounded-lg transition-colors cursor-pointer group w-fit">
                        <Image 
                          src={item.image} 
                          alt={item.name} 
                          width={32} 
                          height={32} 
                          className="rounded-full object-cover border border-slate-200"
                        />
                        <div className="flex flex-col">
                          <span className="font-semibold text-slate-800 group-hover:text-[#5D6BEE] transition-colors">{item.name}</span>
                          <span className="text-[12px] text-slate-500 font-medium">Roll No : {item.rollNo}</span>
                        </div>
                      </Link>
                    </td>
                    <td className={`px-6 py-4 font-medium ${item.marks.english < PASS_MARK ? 'text-rose-500' : 'text-slate-600'}`}>{item.marks.english}</td>
                    <td className={`px-6 py-4 font-medium ${item.marks.spanish < PASS_MARK ? 'text-rose-500' : 'text-slate-600'}`}>{item.marks.spanish}</td>
                    <td className={`px-6 py-4 font-medium ${item.marks.physics < PASS_MARK ? 'text-rose-500' : 'text-slate-600'}`}>{item.marks.physics}</td>
                    <td className={`px-6 py-4 font-medium ${item.marks.chemistry < PASS_MARK ? 'text-rose-500' : 'text-slate-600'}`}>{item.marks.chemistry}</td>
                    <td className={`px-6 py-4 font-medium ${item.marks.maths < PASS_MARK ? 'text-rose-500' : 'text-slate-600'}`}>{item.marks.maths}</td>
                    <td className={`px-6 py-4 font-medium ${item.marks.computer < PASS_MARK ? 'text-rose-500' : 'text-slate-600'}`}>{item.marks.computer}</td>
                    <td className={`px-6 py-4 font-medium ${item.marks.envScience < PASS_MARK ? 'text-rose-500' : 'text-slate-600'}`}>{item.marks.envScience}</td>
                    <td className="px-6 py-4 text-slate-600 font-medium">{total}</td>
                    <td className="px-6 py-4 text-slate-600 font-medium">{percent}</td>
                    <td className="px-6 py-4 text-slate-600 font-medium">{grade}</td>
                    <td className="px-6 py-4">
                      {failed ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[12px] font-semibold bg-rose-50 text-rose-600 border border-rose-100">
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                          Fail
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[12px] font-semibold bg-emerald-50 text-emerald-600 border border-emerald-100">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                          Pass
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-5 border-t border-border flex items-center justify-end gap-2">
          <button className="px-3 py-1.5 text-[13px] font-medium text-slate-500 hover:text-slate-700 transition-colors">Prev</button>
          <button className="w-7 h-7 rounded-lg bg-[#5D6BEE] text-white text-[13px] font-medium flex items-center justify-center">1</button>
          <button className="w-7 h-7 rounded-lg hover:bg-slate-100 text-slate-600 text-[13px] font-medium flex items-center justify-center transition-colors">2</button>
          <button className="px-3 py-1.5 text-[13px] font-medium text-slate-500 hover:text-slate-700 transition-colors">Next</button>
        </div>
      </div>
    </div>
  );
}
