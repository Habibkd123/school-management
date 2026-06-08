"use client";

import React, { useState } from "react";
import { 
  Search, List, Filter, ChevronDown, RefreshCw, Printer, Download, FileText, Calendar,
  Check, X, Clock, Sun, Star
} from "lucide-react";
import Image from "next/image";
import { ReportTabs } from "../../../components/reports/ReportTabs";

interface AttendanceReportItem {
  id: string;
  name: string;
  avatar: string;
  percent: number;
  p: number;
  l: number;
  a: number;
  h: number;
  f: number;
  days: string[]; // "P", "A", "L", "H", "F"
}

const mockAttendanceReport: AttendanceReportItem[] = [
  { id: "1", name: "Gifford", avatar: "https://ui-avatars.com/api/?name=Gifford&background=F1F5F9&color=5D6BEE&bold=true", percent: 46, p: 16, l: 2, a: 1, h: 6, f: 1, days: ["P", "A", "P", "A", "P", "L", "L", "P", "P", "P", "P", "L", "L", "L", "P", "P", "L"] },
  { id: "2", name: "Janet", avatar: "https://ui-avatars.com/api/?name=Janet&background=F1F5F9&color=5D6BEE&bold=true", percent: 100, p: 24, l: 0, a: 0, h: 6, f: 0, days: ["P", "P", "P", "P", "P", "L", "L", "P", "P", "P", "P", "P", "L", "L", "P", "P", "L"] },
  { id: "3", name: "Joann", avatar: "https://ui-avatars.com/api/?name=Joann&background=F1F5F9&color=5D6BEE&bold=true", percent: 94, p: 23, l: 1, a: 3, h: 6, f: 1, days: ["P", "A", "P", "A", "P", "L", "L", "P", "P", "P", "P", "L", "L", "L", "P", "P", "L"] },
  { id: "4", name: "Julie", avatar: "https://ui-avatars.com/api/?name=Julie&background=F1F5F9&color=5D6BEE&bold=true", percent: 99, p: 22, l: 0, a: 4, h: 6, f: 2, days: ["P", "A", "P", "A", "P", "L", "L", "P", "P", "P", "P", "L", "L", "L", "P", "P", "L"] },
  { id: "5", name: "Kathleen", avatar: "https://ui-avatars.com/api/?name=Kathleen&background=F1F5F9&color=5D6BEE&bold=true", percent: 95, p: 23, l: 1, a: 2, h: 6, f: 1, days: ["P", "A", "P", "A", "P", "L", "L", "P", "P", "P", "P", "L", "L", "L", "P", "P", "L"] },
];

export default function AttendanceReportPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isDateRangeOpen, setIsDateRangeOpen] = useState(false);
  const [selectedDateRange, setSelectedDateRange] = useState("Last 7 Days");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [selectedSort, setSelectedSort] = useState("Ascending");

  const getStatusColor = (status: string) => {
    switch (status) {
      case "P": return "bg-emerald-500";
      case "A": return "bg-rose-500";
      case "L": return "bg-sky-500";
      case "H": return "bg-amber-500";
      case "F": return "bg-indigo-500";
      default: return "bg-slate-200";
    }
  };

  const getPercentColor = (percent: number) => {
    if (percent === 100) return "text-emerald-600 bg-emerald-50 border-emerald-100";
    if (percent >= 90) return "text-sky-600 bg-sky-50 border-sky-100";
    if (percent >= 50) return "text-amber-600 bg-amber-50 border-amber-100";
    return "text-rose-600 bg-rose-50 border-rose-100";
  };

  return (
    <div className="space-y-6 bg-[#F8FAFC] dark:bg-[#0F172A] min-h-screen -m-6 p-6 flex flex-col">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">Attendance Report</h1>
          <div className="flex items-center gap-2 text-[13px] text-slate-500 dark:text-slate-400 mt-1">
            <span>Dashboard</span>
            <span>/</span>
            <span className="hover:text-[#F59E0B] cursor-pointer">Report</span>
            <span>/</span>
            <span className="text-slate-900 dark:text-white font-medium">Attendance Report</span>
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

      <ReportTabs />

      {/* Legend */}
      <div className="flex flex-wrap items-center justify-end gap-3 mb-2">
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[13px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100">
          <Check className="w-3.5 h-3.5" /> Present
        </div>
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[13px] font-semibold bg-rose-50 text-rose-700 border border-rose-100">
          <X className="w-3.5 h-3.5" /> Absent
        </div>
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[13px] font-semibold bg-sky-50 text-sky-700 border border-sky-100">
          <Clock className="w-3.5 h-3.5" /> Late
        </div>
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[13px] font-semibold bg-amber-50 text-amber-700 border border-amber-100">
          <Sun className="w-3.5 h-3.5" /> Halfday
        </div>
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[13px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100">
          <Star className="w-3.5 h-3.5" /> Holiday
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white dark:bg-slate-900 border border-border rounded-xl shadow-sm overflow-hidden text-left flex-1 flex flex-col">
        {/* Table Header Section */}
        <div className="p-5 border-b border-border flex flex-col xl:flex-row xl:items-center justify-between gap-4">
          <h2 className="text-[16px] font-bold text-slate-800 dark:text-slate-100">
            Attendance Report
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
                  <div className="absolute left-0 top-full mt-2 w-48 bg-white dark:bg-slate-900 border border-border rounded-lg shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] z-50 py-1.5">
                    {["Today", "Yesterday", "Last 7 Days", "Last 30 Days", "This Year", "Next Year", "Custom Range"].map((option) => (
                      <button 
                        key={option}
                        onClick={() => { setSelectedDateRange(option); setIsDateRangeOpen(false); }}
                        className={`w-full px-4 py-2.5 text-left text-[14px] ${option === selectedDateRange ? "bg-[#F59E0B] text-white font-medium" : "text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50"}`}
                      >
                        {option}
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
                  <div className="absolute right-0 top-full mt-2 w-[320px] bg-white dark:bg-slate-900 border border-border rounded-lg shadow-[0_10px_40px_-10px_rgba(0,0,0,0.15)] z-50 flex flex-col text-left">
                    <div className="p-4 border-b border-border">
                      <h3 className="font-bold text-[#0F172A] dark:text-slate-100 text-[16px]">Filter</h3>
                    </div>
                    <div className="p-4 grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[13px] font-bold text-[#0F172A] dark:text-slate-200">Class</label>
                        <div className="relative">
                          <select className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-border rounded-md text-[13px] appearance-none outline-none text-slate-600 dark:text-slate-300">
                            <option>Select</option>
                          </select>
                          <ChevronDown className="w-3.5 h-3.5 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[13px] font-bold text-[#0F172A] dark:text-slate-200">Section</label>
                        <div className="relative">
                          <select className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-border rounded-md text-[13px] appearance-none outline-none text-slate-600 dark:text-slate-300">
                            <option>Select</option>
                          </select>
                          <ChevronDown className="w-3.5 h-3.5 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        </div>
                      </div>
                      <div className="col-span-2 space-y-1.5">
                        <label className="text-[13px] font-bold text-[#0F172A] dark:text-slate-200">Name</label>
                        <div className="relative">
                          <select className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-border rounded-md text-[13px] appearance-none outline-none text-slate-600 dark:text-slate-300">
                            <option>Select</option>
                          </select>
                          <ChevronDown className="w-3.5 h-3.5 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[13px] font-bold text-[#0F172A] dark:text-slate-200">Gender</label>
                        <div className="relative">
                          <select className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-border rounded-md text-[13px] appearance-none outline-none text-slate-600 dark:text-slate-300">
                            <option>Select</option>
                          </select>
                          <ChevronDown className="w-3.5 h-3.5 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[13px] font-bold text-[#0F172A] dark:text-slate-200">Status</label>
                        <div className="relative">
                          <select className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-border rounded-md text-[13px] appearance-none outline-none text-slate-600 dark:text-slate-300">
                            <option>Select</option>
                          </select>
                          <ChevronDown className="w-3.5 h-3.5 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        </div>
                      </div>
                      <div className="col-span-2 space-y-1.5">
                        <label className="text-[13px] font-bold text-[#0F172A] dark:text-slate-200">Date of Join</label>
                        <div className="relative">
                          <input type="text" placeholder="dd-mm-yyyy" className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-border rounded-md text-[13px] outline-none text-slate-600 dark:text-slate-300" />
                          <Calendar className="w-3.5 h-3.5 absolute right-3 top-1/2 -translate-y-1/2 text-[#0F172A] dark:text-slate-400" />
                        </div>
                      </div>
                    </div>
                    <div className="p-4 border-t border-border flex justify-end gap-3 bg-white dark:bg-slate-900 rounded-b-lg">
                      <button onClick={() => setIsFilterOpen(false)} className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-[#0F172A] dark:text-slate-200 text-[13px] font-bold rounded-md hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">Reset</button>
                      <button onClick={() => setIsFilterOpen(false)} className="px-4 py-2 bg-[#F59E0B] text-white text-[13px] font-bold rounded-md hover:bg-[#D97706] transition-colors">Apply</button>
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
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-slate-900 border border-border rounded-lg shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] z-50 py-2 p-2">
                    {["Ascending", "Descending", "Recently Viewed", "Recently Added"].map((option) => (
                      <button 
                        key={option}
                        onClick={() => { setSelectedSort(option); setIsSortOpen(false); }}
                        className={`w-full px-4 py-2.5 text-left text-[14px] transition-colors ${option === selectedSort ? "bg-[#F59E0B] text-white font-medium" : "text-[#0F172A] dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/50"}`}
                      >
                        {option}
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
          <table className="w-full text-[13px] whitespace-nowrap min-w-[1200px]">
            <thead className="bg-[#F8FAFC] dark:bg-[#0F172A]">
              <tr className="border-y border-border">
                <th className="px-6 py-4 text-left font-bold text-slate-700 dark:text-slate-200 sticky left-0 bg-[#F8FAFC] dark:bg-[#0F172A] z-10 border-r border-border/50 shadow-[4px_0_10px_-5px_rgba(0,0,0,0.1)]">Student / Date</th>
                <th className="px-4 py-4 text-center font-bold text-slate-700 dark:text-slate-200">%</th>
                <th className="px-4 py-4 text-center font-bold text-slate-700 dark:text-slate-200">P</th>
                <th className="px-4 py-4 text-center font-bold text-slate-700 dark:text-slate-200">L</th>
                <th className="px-4 py-4 text-center font-bold text-slate-700 dark:text-slate-200">A</th>
                <th className="px-4 py-4 text-center font-bold text-slate-700 dark:text-slate-200">H</th>
                <th className="px-4 py-4 text-center font-bold text-slate-700 dark:text-slate-200 border-r border-border/50">F</th>
                {[...Array(17)].map((_, i) => {
                  const dayMap = ["M", "T", "W", "T", "F", "S", "S"];
                  return (
                    <th key={i} className="px-2 py-4 text-center font-bold text-slate-700 dark:text-slate-200 min-w-[40px]">
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight">{(i+1).toString().padStart(2, '0')}</div>
                      <div>{dayMap[i % 7]}</div>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {mockAttendanceReport.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="px-6 py-4 sticky left-0 bg-white dark:bg-slate-900 z-10 border-r border-border/50 shadow-[4px_0_10px_-5px_rgba(0,0,0,0.1)]">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0 bg-slate-100 dark:bg-slate-800 relative">
                        <Image src={item.avatar} alt={item.name} fill className="object-cover" />
                      </div>
                      <span className="font-semibold text-slate-800 dark:text-slate-100">{item.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-center">
                    <span className={`px-2 py-0.5 rounded text-[11px] font-bold border ${getPercentColor(item.percent)}`}>
                      {item.percent}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-center text-slate-600 dark:text-slate-300 font-medium">{item.p}</td>
                  <td className="px-4 py-4 text-center text-slate-600 dark:text-slate-300 font-medium">{item.l}</td>
                  <td className="px-4 py-4 text-center text-slate-600 dark:text-slate-300 font-medium">{item.a}</td>
                  <td className="px-4 py-4 text-center text-slate-600 dark:text-slate-300 font-medium">{item.h}</td>
                  <td className="px-4 py-4 text-center text-slate-600 dark:text-slate-300 font-medium border-r border-border/50">{item.f}</td>
                  
                  {item.days.map((status, i) => (
                    <td key={i} className="px-2 py-4 text-center">
                      <div className={`w-2.5 h-3.5 rounded-sm mx-auto ${getStatusColor(status)}`}></div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-5 border-t border-border flex items-center justify-end gap-2 mt-auto">
          <button className="px-3 py-1.5 text-[13px] font-medium text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:text-slate-200 transition-colors">Prev</button>
          <button className="w-7 h-7 rounded-lg bg-[#F59E0B] text-white text-[13px] font-medium flex items-center justify-center">1</button>
          <button className="px-3 py-1.5 text-[13px] font-medium text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:text-slate-200 transition-colors">Next</button>
        </div>
      </div>
    </div>
  );
}
