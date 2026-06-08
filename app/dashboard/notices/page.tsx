"use client";

import React, { useState } from "react";
import { 
  RefreshCw, Printer, Download, Plus, Calendar, Filter, ChevronDown, Check, X, FileText, MoreVertical, Edit, Trash2
} from "lucide-react";
import { Modal } from "../../components/ui/modal";
import { DataTable, ColumnDef } from "@/app/components/ui/data-table";

interface NoticeItem {
  id: string;
  title: string;
  date: string;
}

const mockNotices: NoticeItem[] = [
  { id: "1", title: "Classes Preparation", date: "24 May 2024" },
  { id: "2", title: "Fees Reminder", date: "12 May 2024" },
  { id: "3", title: "Parents Teacher Meeting", date: "10 May 2024" },
  { id: "4", title: "New Academic Session For Admission (2024-25)", date: "28 Apr 2024" },
  { id: "5", title: "Staff Meeting", date: "23 Apr 2024" },
  { id: "6", title: "World Environment Day Program.....!!!", date: "21 Apr 2024" },
  { id: "7", title: "New Syllabus Instructions", date: "11 Mar 2024" },
  { id: "8", title: "Exam Preparation Notification!", date: "18 Mar 2024" },
  { id: "9", title: "Gandhi Jayanti Programmed", date: "16 Feb 2024" },
  { id: "10", title: "Republic Day Celebration", date: "24 Jan 2024" },
];

export default function NoticesPage() {
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isDateRangeOpen, setIsDateRangeOpen] = useState(false);
  const [selectedDateRange, setSelectedDateRange] = useState("Last 7 Days");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isAddMessageOpen, setIsAddMessageOpen] = useState(false);
  const [selectedNotices, setSelectedNotices] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(false);

  const toggleSelectAll = () => {
    if (selectAll) {
      setSelectedNotices([]);
    } else {
      setSelectedNotices(mockNotices.map(n => n.id));
    }
    setSelectAll(!selectAll);
  };

  const toggleSelect = (id: string) => {
    if (selectedNotices.includes(id)) {
      setSelectedNotices(selectedNotices.filter(nId => nId !== id));
      setSelectAll(false);
    } else {
      setSelectedNotices([...selectedNotices, id]);
    }
  };

  return (
    <div className="space-y-6 bg-[#F8FAFC] dark:bg-[#0F172A] min-h-screen -m-6 p-6 flex flex-col">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">Notice Board</h1>
          <div className="flex items-center gap-2 text-[13px] text-slate-500 dark:text-slate-400 mt-1">
            <span>Dashboard</span>
            <span>/</span>
            <span className="hover:text-[#F59E0B] cursor-pointer">Announcement</span>
            <span>/</span>
            <span className="text-slate-900 dark:text-white font-medium">Notice Board</span>
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
          
          <button 
            onClick={() => setIsAddMessageOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-[#F59E0B] text-white text-[13px] font-semibold rounded-lg hover:bg-[#D97706] transition-colors shadow-sm cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Add Message
          </button>
        </div>
      </div>

      {/* Filter Row */}
      <div className="flex flex-col sm:flex-row items-center justify-end gap-4 bg-transparent pt-2">
        <label className="flex items-center gap-2 cursor-pointer mr-auto sm:mr-0">
          <input 
            type="checkbox" 
            checked={selectAll}
            onChange={toggleSelectAll}
            className="rounded border-slate-300 text-[#F59E0B] focus:ring-[#F59E0B] w-4 h-4 cursor-pointer"
          />
          <span className="text-[13px] font-medium text-slate-600 dark:text-slate-300">Mark & Delete All</span>
        </label>

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
                <div className="absolute right-0 sm:left-0 sm:right-auto top-full mt-2 w-44 bg-white dark:bg-slate-900 border border-border rounded-lg shadow-lg z-50 overflow-hidden py-1.5 text-left">
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
                <div className="absolute right-0 top-full mt-2 w-[320px] bg-white dark:bg-slate-900 border border-border rounded-lg shadow-[0_10px_40px_-10px_rgba(0,0,0,0.15)] z-50 flex flex-col text-left">
                  <div className="p-4 border-b border-border">
                    <h3 className="font-bold text-[#0F172A] dark:text-slate-100 text-[16px]">Filter</h3>
                  </div>
                  <div className="p-4 space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-[13px] font-bold text-[#0F172A] dark:text-slate-200">Message to</label>
                      <div className="relative">
                        <select className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-border rounded-md text-[13px] appearance-none outline-none text-slate-600 dark:text-slate-300 cursor-pointer">
                          <option>Select</option>
                        </select>
                        <ChevronDown className="w-3.5 h-3.5 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[13px] font-bold text-[#0F172A] dark:text-slate-200">Added Date</label>
                      <div className="relative">
                        <select className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-border rounded-md text-[13px] appearance-none outline-none text-slate-600 dark:text-slate-300 cursor-pointer">
                          <option>Select</option>
                        </select>
                        <ChevronDown className="w-3.5 h-3.5 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                      </div>
                    </div>
                  </div>
                  <div className="p-4 flex justify-end gap-3 bg-white dark:bg-slate-900 rounded-b-lg border-t border-border mt-2">
                    <button onClick={() => setIsFilterOpen(false)} className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-[#0F172A] dark:text-slate-200 text-[13px] font-bold rounded-md hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer">Reset</button>
                    <button onClick={() => setIsFilterOpen(false)} className="px-4 py-2 bg-[#F59E0B] hover:bg-[#D97706] text-white text-[13px] font-bold rounded-md transition-colors shadow-sm cursor-pointer">Apply</button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Notice List */}
      <div className="bg-white dark:bg-slate-900 border border-border rounded-xl shadow-sm text-left mt-4">
        <DataTable 
          columns={[
            { header: "Title", accessorKey: "title", render: (item) => (
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center flex-shrink-0 text-[#F59E0B]">
                    <RefreshCw className="w-5 h-5" />
                  </div>
                  <span className="font-bold text-[#0F172A] dark:text-slate-100">{item.title}</span>
                </div>
            )},
            { header: "Date", accessorKey: "date", render: (item) => (
                <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 font-medium">
                  <Calendar className="w-4 h-4" />
                  <span>Added on : {item.date}</span>
                </div>
            )},
            { header: "Action", sortable: false, className: "text-center w-24", render: (item) => (
                <div className="flex items-center justify-center gap-2" onClick={(e) => e.stopPropagation()}>
                  <button className="p-1.5 rounded-lg text-slate-400 hover:text-[#F59E0B] hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
            )}
          ]}
          data={mockNotices}
          selectionHeader={<input type="checkbox" checked={selectAll} onChange={toggleSelectAll} className="rounded border-slate-300 text-[#F59E0B] focus:ring-[#F59E0B] cursor-pointer" />}
          renderSelection={(item) => <input type="checkbox" checked={selectedNotices.includes(item.id)} onChange={() => toggleSelect(item.id)} className="rounded border-slate-300 text-[#F59E0B] focus:ring-[#F59E0B] cursor-pointer" />}
        />
      </div>

      {/* Load More */}
      <div className="flex justify-center pt-4 pb-8">
        <button className="px-6 py-2.5 bg-[#F59E0B] hover:bg-[#D97706] text-white text-[13px] font-semibold rounded-lg transition-colors shadow-sm flex items-center gap-2 cursor-pointer">
          <RefreshCw className="w-4 h-4" /> Load More
        </button>
      </div>

      {/* Modal */}
      <Modal
        isOpen={isAddMessageOpen}
        onClose={() => setIsAddMessageOpen(false)}
        title="New Message"
        size="lg"
      >
        <form className="space-y-6 text-left">
          <div className="space-y-1.5">
            <label className="text-[13px] font-bold text-slate-800 dark:text-slate-100">Title</label>
            <input type="text" className="w-full px-4 py-2.5 bg-white dark:bg-slate-900 border border-border rounded-lg outline-none focus:border-[#F59E0B] transition-colors text-slate-700 dark:text-slate-200 text-[14px]" />
          </div>

          <div className="space-y-1.5">
            <label className="text-[13px] font-bold text-slate-800 dark:text-slate-100">Notice Date</label>
            <div className="relative">
              <input type="text" className="w-full px-4 py-2.5 bg-white dark:bg-slate-900 border border-border rounded-lg outline-none focus:border-[#F59E0B] transition-colors text-slate-700 dark:text-slate-200 text-[14px]" />
              <Calendar className="w-4 h-4 absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[13px] font-bold text-slate-800 dark:text-slate-100">Publish On</label>
            <div className="relative">
              <input type="text" className="w-full px-4 py-2.5 bg-white dark:bg-slate-900 border border-border rounded-lg outline-none focus:border-[#F59E0B] transition-colors text-slate-700 dark:text-slate-200 text-[14px]" />
              <Calendar className="w-4 h-4 absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" />
            </div>
          </div>

          <div className="p-5 bg-[#EEF2FF] dark:bg-indigo-900/20 border border-[#E0E7FF] dark:border-indigo-500/20 rounded-xl space-y-3">
            <label className="text-[13px] font-bold text-slate-800 dark:text-slate-100">Attachment</label>
            <p className="text-[13px] text-slate-500 dark:text-slate-400">Upload size of 4MB, Accepted Format PDF</p>
            <button type="button" className="px-4 py-2 bg-[#F59E0B] hover:bg-[#D97706] text-white text-[13px] font-semibold rounded-lg transition-colors flex items-center gap-2 cursor-pointer shadow-sm">
              <FileText className="w-4 h-4" /> Upload
            </button>
          </div>

          <div className="space-y-1.5">
            <label className="text-[13px] font-bold text-slate-800 dark:text-slate-100">Message</label>
            <textarea className="w-full px-4 py-2.5 bg-white dark:bg-slate-900 border border-border rounded-lg outline-none focus:border-[#F59E0B] transition-colors text-slate-700 dark:text-slate-200 text-[14px] min-h-[120px] resize-y" />
          </div>

          <div className="space-y-3">
            <label className="text-[13px] font-bold text-slate-800 dark:text-slate-100">Message To</label>
            <div className="grid grid-cols-2 gap-y-3">
              {["Student", "Accountant", "Parent", "Librarian", "Admin", "Receptionist", "Teacher", "Super Admin"].map(role => (
                <label key={role} className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="rounded border-slate-300 text-[#F59E0B] focus:ring-[#F59E0B] w-4 h-4 cursor-pointer" />
                  <span className="text-[14px] text-slate-700 dark:text-slate-300">{role}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-border mt-6">
            <button type="button" onClick={() => setIsAddMessageOpen(false)} className="px-6 py-2.5 bg-[#F1F5F9] dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-[14px] font-bold rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer">Cancel</button>
            <button type="button" className="px-6 py-2.5 bg-[#F59E0B] text-white text-[14px] font-bold rounded-lg hover:bg-[#D97706] transition-colors shadow-sm cursor-pointer">Add New Message</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
