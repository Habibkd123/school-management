"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  Search, List, Filter, ChevronDown, RefreshCw, Printer, Download, FileText, Calendar, ChevronRight, ChevronLeft
} from "lucide-react";

interface FeesReportItem {
  id: string;
  feesGroupTitle: string;
  feesGroupSub: string;
  feesCode: string;
  dueDate: string;
  amount: number;
  status: "Paid" | "Unpaid" | "Partial";
  refId: string;
  mode: string;
  datePaid: string;
  discount: string;
  fine: number;
  balance: number;
}

const mockFeesReport: FeesReportItem[] = [
  { id: "1", feesGroupTitle: "Class 1 General", feesGroupSub: "Admission Fees", feesCode: "admission-fees", dueDate: "25 Mar 2024", amount: 2000, status: "Paid", refId: "#435454", mode: "Cash", datePaid: "25 Jan 2024", discount: "10%", fine: 200, balance: 0 },
  { id: "2", feesGroupTitle: "Class 1 General", feesGroupSub: "Apr month Fees", feesCode: "apr-month-fees", dueDate: "10 May 2024", amount: 2500, status: "Paid", refId: "#435453", mode: "Cash", datePaid: "03 Apr 2024", discount: "10%", fine: 0, balance: 0 },
  { id: "3", feesGroupTitle: "Class 1 General", feesGroupSub: "Dec month Fees", feesCode: "dec-month-fees", dueDate: "10 Jan 2024", amount: 2500, status: "Paid", refId: "#435443", mode: "Cash", datePaid: "05 Jan 2024", discount: "10%", fine: 0, balance: 0 },
  { id: "4", feesGroupTitle: "Class 1 General", feesGroupSub: "Jan month Fees", feesCode: "jan-month-fees", dueDate: "10 Feb 2024", amount: 2000, status: "Paid", refId: "#435443", mode: "Cash", datePaid: "01 Feb 2024", discount: "10%", fine: 200, balance: 0 },
  { id: "5", feesGroupTitle: "Class 1 General", feesGroupSub: "Jul month Fees", feesCode: "jul-month-fees", dueDate: "10 Aug 2024", amount: 2500, status: "Paid", refId: "#435449", mode: "Cash", datePaid: "01 Aug 2024", discount: "10%", fine: 200, balance: 0 },
  { id: "6", feesGroupTitle: "Class 1 General", feesGroupSub: "Jun month Fees", feesCode: "jun-month-fees", dueDate: "10 Jul 2024", amount: 2500, status: "Paid", refId: "#435450", mode: "Cash", datePaid: "05 Jul 2024", discount: "10%", fine: 200, balance: 0 },
  { id: "7", feesGroupTitle: "Class 1 General", feesGroupSub: "Mar month Fees", feesCode: "mar-month-fees", dueDate: "10 Apr 2024", amount: 2500, status: "Paid", refId: "#435453", mode: "Cash", datePaid: "03 Apr 2024", discount: "10%", fine: 0, balance: 0 },
  { id: "8", feesGroupTitle: "Class 1 General", feesGroupSub: "May month Fees", feesCode: "may-month-fees", dueDate: "10 Jun 2024", amount: 2500, status: "Paid", refId: "#435451", mode: "Cash", datePaid: "02 Jun 2024", discount: "10%", fine: 200, balance: 0 },
];

export default function FeesReportPage() {
  const [searchTerm, setSearchTerm] = useState("");
  
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isDateRangeOpen, setIsDateRangeOpen] = useState(false);
  const [selectedDateRange, setSelectedDateRange] = useState("06/02/2026 - 06/08/2026");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);

  // Filter States
  const [filterClass, setFilterClass] = useState("");
  const [filterSection, setFilterSection] = useState("");
  const [filterStudent, setFilterStudent] = useState("");

  const filteredData = mockFeesReport.filter(item => {
    const matchesSearch = item.feesGroupTitle.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          item.feesGroupSub.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.feesCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.refId.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesSearch; // Extend with class/section filters if actual data supports it
  });

  return (
    <div className="space-y-6 bg-[#F8FAFC] dark:bg-[#0F172A] min-h-screen -m-6 p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">Fees Report</h1>
          <div className="flex items-center gap-2 text-[13px] text-slate-500 dark:text-slate-400 mt-1">
            <span>Dashboard</span>
            <span>/</span>
            <span className="hover:text-[#F59E0B] cursor-pointer">Report</span>
            <span>/</span>
            <span className="text-slate-900 dark:text-white font-medium">Fees Report</span>
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
            Fees Report List
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
                          <select 
                            value={filterClass}
                            onChange={(e) => setFilterClass(e.target.value)}
                            className="w-full px-3 py-2 border border-border rounded-lg text-[13px] outline-none appearance-none bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 font-medium cursor-pointer"
                          >
                            <option value="">Select</option>
                            <option value="I">Class I</option>
                            <option value="II">Class II</option>
                            <option value="III">Class III</option>
                          </select>
                          <ChevronDown className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute right-3 top-2.5 pointer-events-none" />
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[13px] font-bold text-slate-800 dark:text-slate-100">Section</label>
                        <div className="relative">
                          <select 
                            value={filterSection}
                            onChange={(e) => setFilterSection(e.target.value)}
                            className="w-full px-3 py-2 border border-border rounded-lg text-[13px] outline-none appearance-none bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 font-medium cursor-pointer"
                          >
                            <option value="">Select</option>
                            <option value="A">A</option>
                            <option value="B">B</option>
                          </select>
                          <ChevronDown className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute right-3 top-2.5 pointer-events-none" />
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[13px] font-bold text-slate-800 dark:text-slate-100">Students</label>
                        <div className="relative">
                          <select 
                            value={filterStudent}
                            onChange={(e) => setFilterStudent(e.target.value)}
                            className="w-full px-3 py-2 border border-border rounded-lg text-[13px] outline-none appearance-none bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 font-medium cursor-pointer"
                          >
                            <option value="">Select</option>
                            <option value="Janet">Janet</option>
                            <option value="James">James</option>
                          </select>
                          <ChevronDown className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute right-3 top-2.5 pointer-events-none" />
                        </div>
                      </div>
                    </div>
                    <div className="p-4 flex justify-end gap-3 bg-white dark:bg-slate-900 rounded-b-lg border-t border-border mt-2">
                      <button 
                        onClick={() => { setFilterClass(""); setFilterSection(""); setFilterStudent(""); setIsFilterOpen(false); }}
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
            <thead className="bg-[#F8FAFC] dark:bg-[#0F172A] border-y border-border">
              <tr>
                <th className="px-6 py-4 text-left font-bold text-slate-700 dark:text-slate-200">Fees Group</th>
                <th className="px-6 py-4 text-left font-bold text-slate-700 dark:text-slate-200">Fees Code</th>
                <th className="px-6 py-4 text-left font-bold text-slate-700 dark:text-slate-200">Due Date</th>
                <th className="px-6 py-4 text-left font-bold text-slate-700 dark:text-slate-200">Amount $</th>
                <th className="px-6 py-4 text-left font-bold text-slate-700 dark:text-slate-200">Status</th>
                <th className="px-6 py-4 text-left font-bold text-slate-700 dark:text-slate-200">Ref ID</th>
                <th className="px-6 py-4 text-left font-bold text-slate-700 dark:text-slate-200">Mode</th>
                <th className="px-6 py-4 text-left font-bold text-slate-700 dark:text-slate-200">Date Paid</th>
                <th className="px-6 py-4 text-left font-bold text-slate-700 dark:text-slate-200">Discount ($)</th>
                <th className="px-6 py-4 text-left font-bold text-slate-700 dark:text-slate-200">Fine ($)</th>
                <th className="px-6 py-4 text-left font-bold text-slate-700 dark:text-slate-200">Balance ($)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              <tr className="bg-[#F8FAFC] dark:bg-[#0F172A]/50">
                <td colSpan={3}></td>
                <td className="px-6 py-3 font-semibold text-slate-800 dark:text-slate-100">2000</td>
                <td colSpan={4}></td>
                <td className="px-6 py-3 font-semibold text-slate-800 dark:text-slate-100">200</td>
                <td className="px-6 py-3 font-semibold text-slate-800 dark:text-slate-100">200</td>
                <td className="px-6 py-3 font-semibold text-slate-800 dark:text-slate-100">0</td>
              </tr>
              {filteredData.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="text-[#F59E0B] font-medium hover:underline cursor-pointer">
                      {item.feesGroupTitle}
                      <div className="text-[12px]">({item.feesGroupSub})</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-600 dark:text-slate-300">
                    {item.feesCode}
                  </td>
                  <td className="px-6 py-4 text-slate-600 dark:text-slate-300">
                    {item.dueDate}
                  </td>
                  <td className="px-6 py-4 text-slate-600 dark:text-slate-300">
                    {item.amount}
                  </td>
                  <td className="px-6 py-4">
                    {item.status === 'Paid' && (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[12px] font-semibold bg-emerald-50 text-emerald-600 border border-emerald-100">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                        Paid
                      </span>
                    )}
                    {item.status === 'Unpaid' && (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[12px] font-semibold bg-rose-50 text-rose-600 border border-rose-100">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                        Unpaid
                      </span>
                    )}
                    {item.status === 'Partial' && (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[12px] font-semibold bg-sky-50 text-sky-600 border border-sky-100">
                        <span className="w-1.5 h-1.5 rounded-full bg-sky-500"></span>
                        Partial
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-slate-600 dark:text-slate-300">
                    {item.refId}
                  </td>
                  <td className="px-6 py-4 text-slate-600 dark:text-slate-300">
                    {item.mode}
                  </td>
                  <td className="px-6 py-4 text-slate-600 dark:text-slate-300">
                    {item.datePaid}
                  </td>
                  <td className="px-6 py-4 text-slate-600 dark:text-slate-300">
                    {item.discount}
                  </td>
                  <td className="px-6 py-4 text-slate-600 dark:text-slate-300">
                    {item.fine}
                  </td>
                  <td className="px-6 py-4 text-slate-600 dark:text-slate-300">
                    {item.balance}
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
