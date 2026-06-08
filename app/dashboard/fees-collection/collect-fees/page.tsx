"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  Search, List, Grid, MoreVertical, Edit, Trash2, Plus,
  Calendar, Filter, ChevronDown, RefreshCw, Printer, Download, FileText
} from "lucide-react";
import { DataTable, ColumnDef } from "@/app/components/ui/data-table";

interface FeeListStudent {
  id: string;
  admNo: string;
  rollNo: string;
  name: string;
  avatar: string;
  studentClass: string;
  section: string;
  amount: number;
  lastDate: string;
  status: "Paid" | "Unpaid";
}

const mockFeeListData: FeeListStudent[] = [
  { id: "1", admNo: "AD124556", rollNo: "55365", name: "Janet", avatar: "https://ui-avatars.com/api/?name=Janet&background=F1F5F9&color=5D6BEE&bold=true", studentClass: "III", section: "A", amount: 2000, lastDate: "15 May 2024", status: "Paid" },
  { id: "2", admNo: "AD124555", rollNo: "12454", name: "Joann", avatar: "https://ui-avatars.com/api/?name=Joann&background=F1F5F9&color=5D6BEE&bold=true", studentClass: "IV", section: "B", amount: 156, lastDate: "15 May 2024", status: "Paid" },
  { id: "3", admNo: "AD124554", rollNo: "65454", name: "Kathleen", avatar: "https://ui-avatars.com/api/?name=Kathleen&background=F1F5F9&color=5D6BEE&bold=true", studentClass: "III", section: "A", amount: 645, lastDate: "15 May 2024", status: "Paid" },
  { id: "4", admNo: "AD124553", rollNo: "78787", name: "Gifford", avatar: "https://ui-avatars.com/api/?name=Gifford&background=F1F5F9&color=5D6BEE&bold=true", studentClass: "I", section: "B", amount: 456, lastDate: "15 May 2024", status: "Unpaid" },
  { id: "5", admNo: "AD124552", rollNo: "31564", name: "Lisa", avatar: "https://ui-avatars.com/api/?name=Lisa&background=F1F5F9&color=5D6BEE&bold=true", studentClass: "II", section: "B", amount: 645, lastDate: "15 May 2024", status: "Unpaid" },
  { id: "6", admNo: "AD124551", rollNo: "78456", name: "Ralph", avatar: "https://ui-avatars.com/api/?name=Ralph&background=F1F5F9&color=5D6BEE&bold=true", studentClass: "III", section: "B", amount: 156, lastDate: "15 May 2024", status: "Unpaid" },
  { id: "7", admNo: "AD124550", rollNo: "67897", name: "Julie", avatar: "https://ui-avatars.com/api/?name=Julie&background=F1F5F9&color=5D6BEE&bold=true", studentClass: "V", section: "A", amount: 645, lastDate: "15 May 2024", status: "Unpaid" },
  { id: "8", admNo: "AD124549", rollNo: "47895", name: "Ryan", avatar: "https://ui-avatars.com/api/?name=Ryan&background=F1F5F9&color=5D6BEE&bold=true", studentClass: "VI", section: "A", amount: 645, lastDate: "15 May 2024", status: "Unpaid" },
  { id: "9", admNo: "AD124548", rollNo: "65547", name: "Susan", avatar: "https://ui-avatars.com/api/?name=Susan&background=F1F5F9&color=5D6BEE&bold=true", studentClass: "VIII", section: "B", amount: 456, lastDate: "15 May 2024", status: "Unpaid" },
  { id: "10", admNo: "AD124547", rollNo: "32145", name: "Richard", avatar: "https://ui-avatars.com/api/?name=Richard&background=F1F5F9&color=5D6BEE&bold=true", studentClass: "VII", section: "B", amount: 456, lastDate: "15 May 2024", status: "Unpaid" },
];

export default function CollectFeesPage() {
  const [feesData, setFeesData] = useState<FeeListStudent[]>(mockFeeListData);
  const [searchTerm, setSearchTerm] = useState("");
  
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isDateRangeOpen, setIsDateRangeOpen] = useState(false);
  const [selectedDateRange, setSelectedDateRange] = useState("Last 7 Days");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [selectedSort, setSelectedSort] = useState("Ascending");

  // Filter States
  const [filterAdmNo, setFilterAdmNo] = useState("");
  const [filterRollNo, setFilterRollNo] = useState("");
  const [filterStudent, setFilterStudent] = useState("");
  const [filterClass, setFilterClass] = useState("");
  const [filterSection, setFilterSection] = useState("");
  const [filterAmount, setFilterAmount] = useState("");
  const [filterLastDate, setFilterLastDate] = useState("");

  const filteredData = feesData.filter(s => {
    const matchesSearch = s.admNo.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          s.rollNo.includes(searchTerm);
    return matchesSearch;
  });

  return (
    <div className="space-y-6 bg-[#F8FAFC] dark:bg-[#0F172A] min-h-screen -m-6 p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">Collect Fees</h1>
          <div className="flex items-center gap-2 text-[13px] text-slate-500 dark:text-slate-400 mt-1">
            <span>Dashboard</span>
            <span>/</span>
            <Link href="/dashboard/fees-collection" className="hover:text-[#F59E0B]">Fees Collection</Link>
            <span>/</span>
            <span className="text-slate-900 dark:text-white font-medium">Collect Fees</span>
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
      <div className="bg-white dark:bg-slate-900 border border-border rounded-xl shadow-sm text-left">
        {/* Table Header Section */}
        <div className="p-5 border-b border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <h2 className="text-[16px] font-bold text-slate-800 dark:text-slate-100">
            Fees List
          </h2>
          
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
                          <label className="text-[13px] font-bold text-slate-800 dark:text-slate-100">Admisson No</label>
                          <div className="relative">
                            <select 
                              value={filterAdmNo}
                              onChange={(e) => setFilterAdmNo(e.target.value)}
                              className="w-full px-3 py-2 border border-border rounded-lg text-[13px] outline-none appearance-none bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 font-medium cursor-pointer"
                            >
                              <option value="">Select</option>
                              <option value="AD124556">AD124556</option>
                            </select>
                            <ChevronDown className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute right-3 top-2.5 pointer-events-none" />
                          </div>
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[13px] font-bold text-slate-800 dark:text-slate-100">Roll No</label>
                          <div className="relative">
                            <select 
                              value={filterRollNo}
                              onChange={(e) => setFilterRollNo(e.target.value)}
                              className="w-full px-3 py-2 border border-border rounded-lg text-[13px] outline-none appearance-none bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 font-medium cursor-pointer"
                            >
                              <option value="">Select</option>
                              <option value="55365">55365</option>
                            </select>
                            <ChevronDown className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute right-3 top-2.5 pointer-events-none" />
                          </div>
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[13px] font-bold text-slate-800 dark:text-slate-100">Student</label>
                        <div className="relative">
                          <select 
                            value={filterStudent}
                            onChange={(e) => setFilterStudent(e.target.value)}
                            className="w-full px-3 py-2 border border-border rounded-lg text-[13px] outline-none appearance-none bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 font-medium cursor-pointer"
                          >
                            <option value="">Select</option>
                            <option value="Janet">Janet</option>
                          </select>
                          <ChevronDown className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute right-3 top-2.5 pointer-events-none" />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-[13px] font-bold text-slate-800 dark:text-slate-100">Class</label>
                          <div className="relative">
                            <select 
                              value={filterClass}
                              onChange={(e) => setFilterClass(e.target.value)}
                              className="w-full px-3 py-2 border border-border rounded-lg text-[13px] outline-none appearance-none bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 font-medium cursor-pointer"
                            >
                              <option value="">Select</option>
                              <option value="III">III</option>
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
                            </select>
                            <ChevronDown className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute right-3 top-2.5 pointer-events-none" />
                          </div>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-[13px] font-bold text-slate-800 dark:text-slate-100">Amount</label>
                          <div className="relative">
                            <select 
                              value={filterAmount}
                              onChange={(e) => setFilterAmount(e.target.value)}
                              className="w-full px-3 py-2 border border-border rounded-lg text-[13px] outline-none appearance-none bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 font-medium cursor-pointer"
                            >
                              <option value="">Select</option>
                              <option value="2000">2000</option>
                            </select>
                            <ChevronDown className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute right-3 top-2.5 pointer-events-none" />
                          </div>
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[13px] font-bold text-slate-800 dark:text-slate-100">Last Date</label>
                          <div className="relative">
                            <select 
                              value={filterLastDate}
                              onChange={(e) => setFilterLastDate(e.target.value)}
                              className="w-full px-3 py-2 border border-border rounded-lg text-[13px] outline-none appearance-none bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 font-medium cursor-pointer"
                            >
                              <option value="">Select</option>
                              <option value="15 May 2024">15 May 2024</option>
                            </select>
                            <ChevronDown className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute right-3 top-2.5 pointer-events-none" />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="p-4 flex justify-end gap-3 bg-white dark:bg-slate-900 rounded-b-lg border-t border-border mt-2">
                      <button 
                        onClick={() => { 
                          setFilterAdmNo(""); setFilterRollNo(""); setFilterStudent("");
                          setFilterClass(""); setFilterSection(""); setFilterAmount(""); setFilterLastDate(""); 
                        }}
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
                      <button 
                        key={item} 
                        onClick={() => { setSelectedSort(item); setIsSortOpen(false); }}
                        className={`w-full px-4 py-2.5 text-[14px] text-left transition-colors font-medium cursor-pointer ${item === selectedSort ? "bg-[#F59E0B] text-white" : "text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/50"}`}
                      >
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
        <DataTable 
          columns={[
            { header: "Adm No", accessorKey: "admNo", render: (item) => (
                <Link href={`/dashboard/students/${item.id}?tab=Fees`} className="font-semibold text-[#F59E0B] hover:text-[#D97706] transition-colors cursor-pointer">
                  {item.admNo}
                </Link>
            )},
            { header: "Roll No", accessorKey: "rollNo" },
            { header: "Student", accessorKey: "name", render: (item) => (
                <Link href={`/dashboard/students/${item.id}?tab=Fees`} className="flex items-center gap-3 group cursor-pointer">
                  <Image src={item.avatar} alt={item.name} width={32} height={32} className="rounded-full" />
                  <div>
                    <span className="text-slate-700 dark:text-slate-200 font-bold group-hover:text-[#F59E0B] transition-colors block">{item.name}</span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium block">{item.studentClass}, {item.section}</span>
                  </div>
                </Link>
            )},
            { header: "Class", accessorKey: "studentClass" },
            { header: "Section", accessorKey: "section" },
            { header: "Amount ($)", accessorKey: "amount" },
            { header: "Last Date", accessorKey: "lastDate" },
            { header: "Status", accessorKey: "status", render: (item) => (
                item.status === 'Paid' ? (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[12px] font-semibold bg-emerald-50 text-emerald-600 border border-emerald-100">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    Paid
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[12px] font-semibold bg-rose-50 text-rose-600 border border-rose-100">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                    Unpaid
                  </span>
                )
            )},
            { header: "Action", sortable: false, className: "text-center", render: (item) => (
                <Link href={`/dashboard/students/${item.id}?tab=Fees`}>
                  <button className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 text-[12px] font-bold rounded transition-colors cursor-pointer">
                    {item.status === 'Paid' ? 'View Details' : 'Collect Fees'}
                  </button>
                </Link>
            )}
          ]}
          data={filteredData}
          selectionHeader={<input type="checkbox" className="rounded border-slate-300 text-[#F59E0B] focus:ring-[#F59E0B] cursor-pointer" />}
          renderSelection={() => <input type="checkbox" className="rounded border-slate-300 text-[#F59E0B] focus:ring-[#F59E0B] cursor-pointer" />}
        />
      </div>
    </div>
  );
}
