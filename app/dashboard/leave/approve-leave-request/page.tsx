"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  Search, List, Filter, ChevronDown, RefreshCw, Printer, Download, FileText, Calendar, MoreVertical, Check, X
} from "lucide-react";
import { Modal } from "../../../components/ui/modal";

interface LeaveRequest {
  id: string;
  submittedBy: string;
  idRollNo: string;
  leaveType: string;
  role: string;
  leaveDate: string;
  noOfDays: number;
  appliedOn: string;
  authority: string;
  status: "Approved" | "Pending" | "Disapproved";
  reason: string;
  note: string;
}

const mockLeaveRequests: LeaveRequest[] = [
  { id: "1", submittedBy: "James Deckar", idRollNo: "9004", leaveType: "Medical Leave", role: "Student", leaveDate: "05 May 2024 - 07 may 2024", noOfDays: 3, appliedOn: "04 May 2024", authority: "Jacquelin", status: "Approved", reason: "Headache & fever", note: "" },
  { id: "2", submittedBy: "Richard", idRollNo: "2145", leaveType: "Casual Leave", role: "Teacher", leaveDate: "07 May 2024 - 07 may 2024", noOfDays: 1, appliedOn: "07 May 2024", authority: "Elizabeth", status: "Approved", reason: "Personal work", note: "" },
  { id: "3", submittedBy: "Susan", idRollNo: "1147", leaveType: "Maternity Leave", role: "Admin", leaveDate: "08 May 2024 - 19 may 2024", noOfDays: 12, appliedOn: "02 May 2024", authority: "Teresa", status: "Approved", reason: "Maternity", note: "" },
  { id: "4", submittedBy: "Lisa", idRollNo: "2145", leaveType: "Sick Leave", role: "Librarian", leaveDate: "05 May 2024 - 07 may 2024", noOfDays: 3, appliedOn: "04 May 2024", authority: "Edward", status: "Approved", reason: "Fever", note: "" },
  { id: "5", submittedBy: "Janet", idRollNo: "1457", leaveType: "Paternity Leave", role: "Driver", leaveDate: "07 May 2024 - 07 may 2024", noOfDays: 1, appliedOn: "06 May 2024", authority: "Daniel", status: "Disapproved", reason: "Personal work", note: "" },
  { id: "6", submittedBy: "Ryan", idRollNo: "9784", leaveType: "Special Leave", role: "Student", leaveDate: "08 May 2024 - 19 may 2024", noOfDays: 12, appliedOn: "12 May 2024", authority: "Hellana", status: "Pending", reason: "Family event", note: "" },
  { id: "7", submittedBy: "Gifford", idRollNo: "7457", leaveType: "Medical Leave", role: "Student", leaveDate: "07 May 2024 - 07 may 2024", noOfDays: 1, appliedOn: "04 May 2024", authority: "Erickson", status: "Pending", reason: "Dentist appointment", note: "" },
  { id: "8", submittedBy: "Julie", idRollNo: "1655", leaveType: "Casual Leave", role: "Student", leaveDate: "05 May 2024 - 07 may 2024", noOfDays: 3, appliedOn: "04 May 2024", authority: "Raul", status: "Approved", reason: "Family trip", note: "" },
  { id: "9", submittedBy: "Joann", idRollNo: "4178", leaveType: "Medical Leave", role: "Student", leaveDate: "08 May 2024 - 19 may 2024", noOfDays: 12, appliedOn: "04 May 2024", authority: "Aaron", status: "Pending", reason: "Surgery recovery", note: "" },
  { id: "10", submittedBy: "Kathleen", idRollNo: "5898", leaveType: "Casual Leave", role: "Student", leaveDate: "07 May 2024 - 07 may 2024", noOfDays: 1, appliedOn: "04 May 2024", authority: "Morgan", status: "Pending", reason: "Festival", note: "" },
];

export default function ApproveLeaveRequestPage() {
  const [leaveData, setLeaveData] = useState<LeaveRequest[]>(mockLeaveRequests);
  const [searchTerm, setSearchTerm] = useState("");
  
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isDateRangeOpen, setIsDateRangeOpen] = useState(false);
  const [selectedDateRange, setSelectedDateRange] = useState("06/02/2026 - 06/08/2026");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [actionMenuId, setActionMenuId] = useState<string | null>(null);

  // Filter States
  const [filterLeaveType, setFilterLeaveType] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<LeaveRequest | null>(null);
  const [formStatus, setFormStatus] = useState<"Approved" | "Pending" | "Disapproved">("Pending");
  const [formNote, setFormNote] = useState("");

  const openApprovalModal = (item: LeaveRequest) => {
    setSelectedRequest(item);
    setFormStatus(item.status);
    setFormNote(item.note || "");
    setIsModalOpen(true);
    setActionMenuId(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedRequest) {
      setLeaveData(leaveData.map(req => 
        req.id === selectedRequest.id 
          ? { ...req, status: formStatus, note: formNote }
          : req
      ));
    }
    setIsModalOpen(false);
  };

  const filteredData = leaveData.filter(item => {
    const matchesSearch = item.submittedBy.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          item.idRollNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.leaveType.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesLeaveType = filterLeaveType ? item.leaveType === filterLeaveType : true;
    const matchesStatus = filterStatus ? item.status === filterStatus : true;
    
    return matchesSearch && matchesLeaveType && matchesStatus;
  });

  return (
    <div className="space-y-6 bg-[#F8FAFC] dark:bg-[#0F172A] min-h-screen -m-6 p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">Approved Leave Request</h1>
          <div className="flex items-center gap-2 text-[13px] text-slate-500 dark:text-slate-400 mt-1">
            <span>Dashboard</span>
            <span>/</span>
            <Link href="/dashboard/leave" className="hover:text-[#F59E0B]">HRM</Link>
            <span>/</span>
            <span className="text-slate-900 dark:text-white font-medium">Approved Leave Request</span>
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
            Approved Leave Request List
          </h2>
          
          <div className="flex items-center gap-3 flex-wrap">
            <div className="relative">
              <button 
                onClick={() => setIsDateRangeOpen(!isDateRangeOpen)}
                className="px-3 py-2 bg-white dark:bg-slate-900 border border-border text-slate-700 dark:text-slate-200 text-[13px] font-medium rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors flex items-center gap-2 shadow-sm cursor-pointer"
              >
                <Calendar className="w-4 h-4 text-slate-400 dark:text-slate-500" /> {selectedDateRange}
              </button>
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
                        <label className="text-[13px] font-bold text-slate-800 dark:text-slate-100">Leave Type</label>
                        <div className="relative">
                          <select 
                            value={filterLeaveType}
                            onChange={(e) => setFilterLeaveType(e.target.value)}
                            className="w-full px-3 py-2 border border-border rounded-lg text-[13px] outline-none appearance-none bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 font-medium cursor-pointer"
                          >
                            <option value="">Select</option>
                            <option value="Medical Leave">Medical Leave</option>
                            <option value="Casual Leave">Casual Leave</option>
                            <option value="Maternity Leave">Maternity Leave</option>
                            <option value="Sick Leave">Sick Leave</option>
                            <option value="Paternity Leave">Paternity Leave</option>
                            <option value="Special Leave">Special Leave</option>
                          </select>
                          <ChevronDown className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute right-3 top-2.5 pointer-events-none" />
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[13px] font-bold text-slate-800 dark:text-slate-100">Status</label>
                        <div className="relative">
                          <select 
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="w-full px-3 py-2 border border-border rounded-lg text-[13px] outline-none appearance-none bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 font-medium cursor-pointer"
                          >
                            <option value="">Select</option>
                            <option value="Approved">Approved</option>
                            <option value="Pending">Pending</option>
                            <option value="Disapproved">Disapproved</option>
                          </select>
                          <ChevronDown className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute right-3 top-2.5 pointer-events-none" />
                        </div>
                      </div>
                    </div>
                    <div className="p-4 flex justify-end gap-3 bg-white dark:bg-slate-900 rounded-b-lg border-t border-border mt-2">
                      <button 
                        onClick={() => { setFilterLeaveType(""); setFilterStatus(""); }}
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
                <th className="px-6 py-4 text-left font-bold text-slate-700 dark:text-slate-200 w-12">
                  <input type="checkbox" className="rounded border-slate-300 text-[#F59E0B] focus:ring-[#F59E0B] cursor-pointer" />
                </th>
                <th className="px-6 py-4 text-left font-bold text-slate-700 dark:text-slate-200">Submitted By</th>
                <th className="px-6 py-4 text-left font-bold text-slate-700 dark:text-slate-200">Leave Type</th>
                <th className="px-6 py-4 text-left font-bold text-slate-700 dark:text-slate-200">Role</th>
                <th className="px-6 py-4 text-left font-bold text-slate-700 dark:text-slate-200">Leave Date</th>
                <th className="px-6 py-4 text-left font-bold text-slate-700 dark:text-slate-200">No of Days</th>
                <th className="px-6 py-4 text-left font-bold text-slate-700 dark:text-slate-200">Applied On</th>
                <th className="px-6 py-4 text-left font-bold text-slate-700 dark:text-slate-200">Authority</th>
                <th className="px-6 py-4 text-left font-bold text-slate-700 dark:text-slate-200">Status</th>
                <th className="px-6 py-4 text-center font-bold text-slate-700 dark:text-slate-200 w-20">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredData.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="px-6 py-4">
                    <input type="checkbox" className="rounded border-slate-300 text-[#F59E0B] focus:ring-[#F59E0B] cursor-pointer" />
                  </td>
                  <td className="px-6 py-4 font-medium text-slate-700 dark:text-slate-200">
                    {item.submittedBy} <span className="text-slate-500 dark:text-slate-400 font-normal">({item.idRollNo})</span>
                  </td>
                  <td className="px-6 py-4 text-slate-600 dark:text-slate-300">
                    {item.leaveType}
                  </td>
                  <td className="px-6 py-4 text-slate-600 dark:text-slate-300">
                    {item.role}
                  </td>
                  <td className="px-6 py-4 text-slate-600 dark:text-slate-300">
                    {item.leaveDate}
                  </td>
                  <td className="px-6 py-4 text-slate-600 dark:text-slate-300">
                    {item.noOfDays}
                  </td>
                  <td className="px-6 py-4 text-slate-600 dark:text-slate-300">
                    {item.appliedOn}
                  </td>
                  <td className="px-6 py-4 text-slate-600 dark:text-slate-300">
                    {item.authority}
                  </td>
                  <td className="px-6 py-4">
                    {item.status === 'Approved' && (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[12px] font-semibold bg-emerald-50 text-emerald-600 border border-emerald-100">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                        Approved
                      </span>
                    )}
                    {item.status === 'Pending' && (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[12px] font-semibold bg-sky-50 text-sky-600 border border-sky-100">
                        <span className="w-1.5 h-1.5 rounded-full bg-sky-500"></span>
                        Pending
                      </span>
                    )}
                    {item.status === 'Disapproved' && (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[12px] font-semibold bg-rose-50 text-rose-600 border border-rose-100">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                        Disapproved
                      </span>
                    )}
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
                          <button onClick={() => openApprovalModal(item)} className="w-full px-4 py-2 text-[13px] text-[#0F172A] dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800/50 flex items-center gap-2 font-medium transition-colors cursor-pointer">
                            <Check className="w-4 h-4 text-[#0F172A] dark:text-slate-100" /> Review
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
          <button className="px-3 py-1.5 text-[13px] font-medium text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:text-slate-200 transition-colors">Next</button>
        </div>
      </div>

      {/* Leave Request Approval Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Leave Request"
      >
        {selectedRequest && (
          <form onSubmit={handleSubmit} className="space-y-6 text-left">
            
            <div className="bg-[#F8FAFC] dark:bg-[#0F172A] rounded-xl p-5 grid grid-cols-3 gap-x-4 gap-y-6">
              <div className="space-y-1">
                <p className="text-[13px] text-slate-500 dark:text-slate-400">Submitted By</p>
                <p className="text-[14px] font-semibold text-[#0F172A] dark:text-slate-100">{selectedRequest.submittedBy}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[13px] text-slate-500 dark:text-slate-400">ID / Roll No</p>
                <p className="text-[14px] font-semibold text-[#0F172A] dark:text-slate-100">{selectedRequest.idRollNo}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[13px] text-slate-500 dark:text-slate-400">Role</p>
                <p className="text-[14px] font-semibold text-[#0F172A] dark:text-slate-100">{selectedRequest.role}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[13px] text-slate-500 dark:text-slate-400">Leave Type</p>
                <p className="text-[14px] font-semibold text-[#0F172A] dark:text-slate-100">{selectedRequest.leaveType}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[13px] text-slate-500 dark:text-slate-400">No of Days</p>
                <p className="text-[14px] font-semibold text-[#0F172A] dark:text-slate-100">{selectedRequest.noOfDays}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[13px] text-slate-500 dark:text-slate-400">Applied On</p>
                <p className="text-[14px] font-semibold text-[#0F172A] dark:text-slate-100">{selectedRequest.appliedOn}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[13px] text-slate-500 dark:text-slate-400">Authority</p>
                <p className="text-[14px] font-semibold text-[#0F172A] dark:text-slate-100">{selectedRequest.authority}</p>
              </div>
              <div className="col-span-2 space-y-1">
                <p className="text-[13px] text-slate-500 dark:text-slate-400">Leave</p>
                <p className="text-[14px] font-semibold text-[#0F172A] dark:text-slate-100">{selectedRequest.leaveDate}</p>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-[15px] font-bold text-[#0F172A] dark:text-slate-100">Reason</h4>
              <p className="text-[14px] text-slate-600 dark:text-slate-300">{selectedRequest.reason}</p>
            </div>

            <div className="space-y-3">
              <h4 className="text-[15px] font-bold text-[#0F172A] dark:text-slate-100">Approval Status</h4>
              <div className="flex items-center gap-6">
                {(["Pending", "Approved", "Disapproved"] as const).map((status) => (
                  <label key={status} className="flex items-center gap-2 cursor-pointer group">
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${formStatus === status ? "border-[#F59E0B]" : "border-slate-300 group-hover:border-[#F59E0B]/50"}`}>
                      {formStatus === status && <div className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]" />}
                    </div>
                    <span className="text-[14px] text-slate-700 dark:text-slate-200">{status}</span>
                    <input 
                      type="radio" 
                      className="hidden" 
                      checked={formStatus === status} 
                      onChange={() => setFormStatus(status)} 
                    />
                  </label>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-[15px] font-bold text-[#0F172A] dark:text-slate-100">Note</h4>
              <textarea 
                placeholder="Add Comment"
                value={formNote}
                onChange={(e) => setFormNote(e.target.value)}
                className="w-full h-24 p-3 border border-border rounded-lg outline-none focus:border-[#F59E0B] bg-white dark:bg-slate-800 text-[14px] text-slate-700 dark:text-slate-200 resize-none transition-colors"
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button 
                type="button" 
                onClick={() => setIsModalOpen(false)}
                className="px-6 py-2.5 bg-[#F1F5F9] dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-[14px] font-bold rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="px-6 py-2.5 bg-[#F59E0B] text-white text-[14px] font-bold rounded-lg hover:bg-[#D97706] transition-colors shadow-sm cursor-pointer"
              >
                Submit
              </button>
            </div>

          </form>
        )}
      </Modal>

    </div>
  );
}
