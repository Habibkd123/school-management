"use client";

import React, { useState } from "react";
import { 
  Search, List, Filter, ChevronDown, RefreshCw, Printer, Download, FileText, Calendar
} from "lucide-react";
import Image from "next/image";
import { ReportTabs } from "../../../components/reports/ReportTabs";

interface TeacherDayWiseItem {
  id: string;
  sNo: number;
  teacherId: string;
  name: string;
  avatar: string;
  subject: string;
  attendance: "Present" | "Absent" | "Half Day" | "Late";
}

const mockData: TeacherDayWiseItem[] = [
  { id: "1", sNo: 1, teacherId: "T849127", name: "Teresa", avatar: "https://ui-avatars.com/api/?name=Teresa&background=F1F5F9&color=5D6BEE&bold=true", subject: "Physics", attendance: "Present" },
  { id: "2", sNo: 2, teacherId: "T849126", name: "Daniel", avatar: "https://ui-avatars.com/api/?name=Daniel&background=F1F5F9&color=5D6BEE&bold=true", subject: "Computer", attendance: "Present" },
  { id: "3", sNo: 3, teacherId: "T849125", name: "Hellana", avatar: "https://ui-avatars.com/api/?name=Hellana&background=F1F5F9&color=5D6BEE&bold=true", subject: "English", attendance: "Absent" },
  { id: "4", sNo: 4, teacherId: "T849124", name: "Erickson", avatar: "https://ui-avatars.com/api/?name=Erickson&background=F1F5F9&color=5D6BEE&bold=true", subject: "Spanish", attendance: "Present" },
  { id: "5", sNo: 5, teacherId: "T849123", name: "Morgan", avatar: "https://ui-avatars.com/api/?name=Morgan&background=F1F5F9&color=5D6BEE&bold=true", subject: "Env Science", attendance: "Half Day" },
  { id: "6", sNo: 6, teacherId: "T849122", name: "Aaron", avatar: "https://ui-avatars.com/api/?name=Aaron&background=F1F5F9&color=5D6BEE&bold=true", subject: "Chemistry", attendance: "Present" },
  { id: "7", sNo: 7, teacherId: "T849121", name: "Jacquelin", avatar: "https://ui-avatars.com/api/?name=Jacquelin&background=F1F5F9&color=5D6BEE&bold=true", subject: "Maths", attendance: "Present" },
  { id: "8", sNo: 8, teacherId: "T849120", name: "Raul", avatar: "https://ui-avatars.com/api/?name=Raul&background=F1F5F9&color=5D6BEE&bold=true", subject: "Biology", attendance: "Late" },
  { id: "9", sNo: 9, teacherId: "T849119", name: "Elizabeth", avatar: "https://ui-avatars.com/api/?name=Elizabeth&background=F1F5F9&color=5D6BEE&bold=true", subject: "Economics", attendance: "Present" },
  { id: "10", sNo: 10, teacherId: "T849118", name: "Edward", avatar: "https://ui-avatars.com/api/?name=Edward&background=F1F5F9&color=5D6BEE&bold=true", subject: "Finance", attendance: "Present" },
];

export default function TeacherDayWisePage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isDateRangeOpen, setIsDateRangeOpen] = useState(false);
  const [selectedDateRange, setSelectedDateRange] = useState("06/02/2026 - 06/08/2026");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);

  const filteredData = mockData.filter(item => {
    return item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
           item.teacherId.toLowerCase().includes(searchTerm.toLowerCase()) ||
           item.subject.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div className="space-y-6 bg-[#F8FAFC] dark:bg-[#0F172A] min-h-screen -m-6 p-6 flex flex-col">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">Teacher Day Wise Report</h1>
          <div className="flex items-center gap-2 text-[13px] text-slate-500 dark:text-slate-400 mt-1">
            <span>Dashboard</span>
            <span>/</span>
            <span className="hover:text-[#F59E0B] cursor-pointer">Report</span>
            <span>/</span>
            <span className="text-slate-900 dark:text-white font-medium">Teacher Day Wise Report</span>
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

      {/* Main Content */}
      <div className="bg-white dark:bg-slate-900 border border-border rounded-xl shadow-sm overflow-hidden text-left flex-1 flex flex-col">
        {/* Table Header Section */}
        <div className="p-5 border-b border-border flex flex-col xl:flex-row xl:items-center justify-between gap-4">
          <h2 className="text-[16px] font-bold text-slate-800 dark:text-slate-100">
            Teacher Day Wise Report
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
                        onClick={() => setIsDateRangeOpen(false)}
                        className={`w-full px-4 py-2.5 text-left text-[14px] ${option === "Last 7 Days" ? "bg-[#F59E0B] text-white font-medium" : "text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50"}`}
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
                  <div className="absolute right-0 top-full mt-2 w-[300px] bg-white dark:bg-slate-900 border border-border rounded-lg shadow-[0_10px_40px_-10px_rgba(0,0,0,0.15)] z-50 flex flex-col text-left">
                    <div className="p-4 border-b border-border">
                      <h3 className="font-bold text-[#0F172A] dark:text-slate-100 text-[16px]">Filter</h3>
                    </div>
                    <div className="p-4">
                      <div className="space-y-1.5">
                        <label className="text-[13px] font-bold text-[#0F172A] dark:text-slate-200">Attendance Date</label>
                        <div className="relative">
                          <select className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-border rounded-md text-[13px] appearance-none outline-none text-slate-600 dark:text-slate-300">
                            <option>Date</option>
                          </select>
                          <ChevronDown className="w-3.5 h-3.5 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
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
                        onClick={() => setIsSortOpen(false)}
                        className="w-full px-3 py-2 text-left text-[14px] text-[#0F172A] dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-md"
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
          <table className="w-full text-[13px] whitespace-nowrap">
            <thead className="bg-[#F8FAFC] dark:bg-[#0F172A]">
              <tr className="border-y border-border">
                <th className="px-6 py-4 text-left font-bold text-slate-700 dark:text-slate-200">S.No</th>
                <th className="px-6 py-4 text-left font-bold text-slate-700 dark:text-slate-200">ID</th>
                <th className="px-6 py-4 text-left font-bold text-slate-700 dark:text-slate-200">Name</th>
                <th className="px-6 py-4 text-left font-bold text-slate-700 dark:text-slate-200">Subject</th>
                <th className="px-6 py-4 text-left font-bold text-slate-700 dark:text-slate-200">Attendance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredData.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="px-6 py-4 text-slate-600 dark:text-slate-300">{item.sNo}</td>
                  <td className="px-6 py-4 font-semibold text-[#F59E0B] hover:text-[#D97706] cursor-pointer">
                    {item.teacherId}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-full overflow-hidden flex-shrink-0 bg-slate-100 dark:bg-slate-800 relative">
                        <Image src={item.avatar} alt={item.name} fill sizes="40px" className="object-cover" />
                      </div>
                      <span className="font-semibold text-slate-800 dark:text-slate-100">{item.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-600 dark:text-slate-300">
                    {item.subject}
                  </td>
                  <td className="px-6 py-4">
                    {item.attendance === 'Present' && (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[12px] font-semibold bg-emerald-50 text-emerald-600 border border-emerald-100">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                        Present
                      </span>
                    )}
                    {item.attendance === 'Absent' && (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[12px] font-semibold bg-rose-50 text-rose-600 border border-rose-100">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                        Absent
                      </span>
                    )}
                    {item.attendance === 'Late' && (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[12px] font-semibold bg-sky-50 text-sky-600 border border-sky-100">
                        <span className="w-1.5 h-1.5 rounded-full bg-sky-500"></span>
                        Late
                      </span>
                    )}
                    {item.attendance === 'Half Day' && (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[12px] font-semibold bg-amber-50 text-amber-600 border border-amber-100">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                        Half Day
                      </span>
                    )}
                  </td>
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
