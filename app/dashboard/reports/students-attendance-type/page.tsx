"use client";

import React, { useState } from "react";
import { 
  Search, List, Filter, ChevronDown, RefreshCw, Printer, Download, FileText, Calendar
} from "lucide-react";
import Image from "next/image";
import { ReportTabs } from "../../../components/reports/ReportTabs";

interface StudentAttendanceTypeItem {
  id: string;
  admissionNo: string;
  dateOfAdmission: string;
  studentName: string;
  avatar: string;
  className: string;
  dob: string;
  fatherName: string;
  fatherAvatar: string;
  count: number;
}

const mockData: StudentAttendanceTypeItem[] = [
  { id: "1", admissionNo: "AD9892424", dateOfAdmission: "15 Dec 2024", studentName: "Veronica", avatar: "https://ui-avatars.com/api/?name=Veronica&background=F1F5F9&color=5D6BEE&bold=true", className: "IX", dob: "27 Dec 2009", fatherName: "Jessie", fatherAvatar: "https://ui-avatars.com/api/?name=Jessie&background=FEF3C7&color=D97706&bold=true", count: 24 },
  { id: "2", admissionNo: "AD9892425", dateOfAdmission: "22 Dec 2024", studentName: "Richard", avatar: "https://ui-avatars.com/api/?name=Richard&background=F1F5F9&color=5D6BEE&bold=true", className: "VII", dob: "06 Oct 2011", fatherName: "Thomas", fatherAvatar: "https://ui-avatars.com/api/?name=Thomas&background=FEF3C7&color=D97706&bold=true", count: 24 },
  { id: "3", admissionNo: "AD9892426", dateOfAdmission: "08 Jan 2024", studentName: "Susan", avatar: "https://ui-avatars.com/api/?name=Susan&background=F1F5F9&color=5D6BEE&bold=true", className: "VIII", dob: "26 May 2010", fatherName: "Marquita", fatherAvatar: "https://ui-avatars.com/api/?name=Marquita&background=FEF3C7&color=D97706&bold=true", count: 24 },
  { id: "4", admissionNo: "AD9892427", dateOfAdmission: "19 Jan 2024", studentName: "Ryan", avatar: "https://ui-avatars.com/api/?name=Ryan&background=F1F5F9&color=5D6BEE&bold=true", className: "VI", dob: "26 Nov 2012", fatherName: "Johnson", fatherAvatar: "https://ui-avatars.com/api/?name=Johnson&background=FEF3C7&color=D97706&bold=true", count: 21 },
  { id: "5", admissionNo: "AD9892428", dateOfAdmission: "24 Jan 2024", studentName: "Julie", avatar: "https://ui-avatars.com/api/?name=Julie&background=F1F5F9&color=5D6BEE&bold=true", className: "V", dob: "18 Sep 2013", fatherName: "Claudia", fatherAvatar: "https://ui-avatars.com/api/?name=Claudia&background=FEF3C7&color=D97706&bold=true", count: 24 },
  { id: "6", admissionNo: "AD9892429", dateOfAdmission: "11 Feb 2024", studentName: "Ralph", avatar: "https://ui-avatars.com/api/?name=Ralph&background=F1F5F9&color=5D6BEE&bold=true", className: "III", dob: "20 Jun 2015", fatherName: "Arthur", fatherAvatar: "https://ui-avatars.com/api/?name=Arthur&background=FEF3C7&color=D97706&bold=true", count: 24 },
  { id: "7", admissionNo: "AD9892430", dateOfAdmission: "13 Feb 2024", studentName: "Gifford", avatar: "https://ui-avatars.com/api/?name=Gifford&background=F1F5F9&color=5D6BEE&bold=true", className: "II", dob: "13 May 2017", fatherName: "Colleen", fatherAvatar: "https://ui-avatars.com/api/?name=Colleen&background=FEF3C7&color=D97706&bold=true", count: 22 },
  { id: "8", admissionNo: "AD9892431", dateOfAdmission: "27 Feb 2024", studentName: "Gifford", avatar: "https://ui-avatars.com/api/?name=Gifford&background=F1F5F9&color=5D6BEE&bold=true", className: "I", dob: "22 Mar 2018", fatherName: "Robert", fatherAvatar: "https://ui-avatars.com/api/?name=Robert&background=FEF3C7&color=D97706&bold=true", count: 22 },
  { id: "9", admissionNo: "AD9892432", dateOfAdmission: "14 Mar 2024", studentName: "Kathleen", avatar: "https://ui-avatars.com/api/?name=Kathleen&background=F1F5F9&color=5D6BEE&bold=true", className: "II", dob: "05 Dec 2017", fatherName: "Jessie", fatherAvatar: "https://ui-avatars.com/api/?name=Jessie&background=FEF3C7&color=D97706&bold=true", count: 24 },
  { id: "10", admissionNo: "AD9892433", dateOfAdmission: "18 Mar 2024", studentName: "Joann", avatar: "https://ui-avatars.com/api/?name=Joann&background=F1F5F9&color=5D6BEE&bold=true", className: "IV", dob: "19 Aug 2014", fatherName: "Michael", fatherAvatar: "https://ui-avatars.com/api/?name=Michael&background=FEF3C7&color=D97706&bold=true", count: 15 },
];

export default function StudentsAttendanceTypePage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isDateRangeOpen, setIsDateRangeOpen] = useState(false);
  const [selectedDateRange, setSelectedDateRange] = useState("06/02/2026 - 06/08/2026");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);

  const filteredData = mockData.filter(item => {
    return item.studentName.toLowerCase().includes(searchTerm.toLowerCase()) || 
           item.admissionNo.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div className="space-y-6 bg-[#F8FAFC] dark:bg-[#0F172A] min-h-screen -m-6 p-6 flex flex-col">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">Students Attendance Type</h1>
          <div className="flex items-center gap-2 text-[13px] text-slate-500 dark:text-slate-400 mt-1">
            <span>Dashboard</span>
            <span>/</span>
            <span className="hover:text-[#F59E0B] cursor-pointer">Report</span>
            <span>/</span>
            <span className="text-slate-900 dark:text-white font-medium">Students Attendance Type</span>
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
            Students Attendance Type
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
                        <label className="text-[13px] font-bold text-[#0F172A] dark:text-slate-200">Attendance Type</label>
                        <div className="relative">
                          <select className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-border rounded-md text-[13px] appearance-none outline-none text-slate-600 dark:text-slate-300">
                            <option>Select</option>
                          </select>
                          <ChevronDown className="w-3.5 h-3.5 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[13px] font-bold text-[#0F172A] dark:text-slate-200">Count</label>
                        <div className="relative">
                          <select className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-border rounded-md text-[13px] appearance-none outline-none text-slate-600 dark:text-slate-300">
                            <option>Select</option>
                          </select>
                          <ChevronDown className="w-3.5 h-3.5 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        </div>
                      </div>
                      <div className="col-span-2 space-y-1.5">
                        <label className="text-[13px] font-bold text-[#0F172A] dark:text-slate-200">Date of Admission</label>
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
                <th className="px-6 py-4 text-left font-bold text-slate-700 dark:text-slate-200">Admission No</th>
                <th className="px-6 py-4 text-left font-bold text-slate-700 dark:text-slate-200">Date of Admission</th>
                <th className="px-6 py-4 text-left font-bold text-slate-700 dark:text-slate-200">Student Name</th>
                <th className="px-6 py-4 text-left font-bold text-slate-700 dark:text-slate-200">Class</th>
                <th className="px-6 py-4 text-left font-bold text-slate-700 dark:text-slate-200">Date of Birth</th>
                <th className="px-6 py-4 text-left font-bold text-slate-700 dark:text-slate-200">Father Name</th>
                <th className="px-6 py-4 text-left font-bold text-slate-700 dark:text-slate-200">Count</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredData.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="px-6 py-4 font-semibold text-[#F59E0B] hover:text-[#D97706] cursor-pointer">
                    {item.admissionNo}
                  </td>
                  <td className="px-6 py-4 text-slate-600 dark:text-slate-300">
                    {item.dateOfAdmission}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-full overflow-hidden flex-shrink-0 bg-slate-100 dark:bg-slate-800 relative">
                        <Image src={item.avatar} alt={item.studentName} fill sizes="40px" className="object-cover" />
                      </div>
                      <span className="font-semibold text-slate-800 dark:text-slate-100">{item.studentName}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-600 dark:text-slate-300">{item.className}</td>
                  <td className="px-6 py-4 text-slate-600 dark:text-slate-300">{item.dob}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full overflow-hidden flex-shrink-0 bg-slate-100 dark:bg-slate-800 relative">
                        <Image src={item.fatherAvatar} alt={item.fatherName} fill sizes="40px" className="object-cover" />
                      </div>
                      <span className="text-slate-600 dark:text-slate-300">{item.fatherName}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-600 dark:text-slate-300">{item.count}</td>
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
