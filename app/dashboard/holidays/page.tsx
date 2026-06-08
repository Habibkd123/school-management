"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  Search, List, Filter, ChevronDown, RefreshCw, Printer, Download, FileText, Calendar, MoreVertical, Edit, Trash2, Plus
} from "lucide-react";
import { Modal } from "../../components/ui/modal";

interface HolidayItem {
  id: string;
  displayId: string;
  title: string;
  date: string;
  description: string;
  status: "Active" | "Inactive";
}

const mockHolidays: HolidayItem[] = [
  { id: "1", displayId: "H752762", title: "New Year", date: "01 Jan 2024", description: "First day of the new year", status: "Active" },
  { id: "2", displayId: "H752761", title: "Martin Luther King Jr. Day", date: "15 Jan 2024", description: "Celebrating the civil rights leader", status: "Active" },
  { id: "3", displayId: "H752760", title: "Presidents Day", date: "19 Feb 2024", description: "Honoring past US Presidents", status: "Active" },
  { id: "4", displayId: "H752759", title: "Good Friday", date: "29 Mar 2024", description: "Holiday before Easter", status: "Active" },
  { id: "5", displayId: "H752758", title: "Easter Monday", date: "01 Apr 2024", description: "Holiday after Easter", status: "Active" },
  { id: "6", displayId: "H752757", title: "Memorial Day", date: "27 May 2024", description: "Honors military personnel", status: "Active" },
  { id: "7", displayId: "H752756", title: "Independence Day", date: "04 Jul 2024", description: "Celebrates Independence", status: "Active" },
  { id: "8", displayId: "H752755", title: "Labor Day", date: "02 Sep 2024", description: "Honors working people", status: "Active" },
  { id: "9", displayId: "H752754", title: "Veterans Day", date: "11 Nov 2024", description: "Honors military veterans", status: "Active" },
  { id: "10", displayId: "H752753", title: "Christmas Day", date: "25 Dec 2024", description: "Celebration of Christmas", status: "Active" },
];

export default function HolidaysPage() {
  const [holidaysData, setHolidaysData] = useState<HolidayItem[]>(mockHolidays);
  const [searchTerm, setSearchTerm] = useState("");
  
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isDateRangeOpen, setIsDateRangeOpen] = useState(false);
  const [selectedDateRange, setSelectedDateRange] = useState("06/02/2026 - 06/08/2026");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [actionMenuId, setActionMenuId] = useState<string | null>(null);

  // Filter States
  const [filterTitle, setFilterTitle] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formTitle, setFormTitle] = useState("");
  const [formDate, setFormDate] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formStatus, setFormStatus] = useState<"Active" | "Inactive">("Active");
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  const openAddModal = () => {
    setIsEditing(false);
    setEditId(null);
    setFormTitle("");
    setFormDate("");
    setFormDescription("");
    setFormStatus("Active");
    setIsModalOpen(true);
    setActionMenuId(null);
  };

  const openEditModal = (item: HolidayItem) => {
    setIsEditing(true);
    setEditId(item.id);
    setFormTitle(item.title);
    setFormDate(item.date);
    setFormDescription(item.description);
    setFormStatus(item.status);
    setIsModalOpen(true);
    setActionMenuId(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditing && editId) {
      setHolidaysData(holidaysData.map(item => 
        item.id === editId 
          ? { ...item, title: formTitle, date: formDate, description: formDescription, status: formStatus }
          : item
      ));
    } else {
      const newItem: HolidayItem = {
        id: Math.random().toString(),
        displayId: `H${Math.floor(100000 + Math.random() * 900000)}`,
        title: formTitle,
        date: formDate,
        description: formDescription,
        status: formStatus,
      };
      setHolidaysData([newItem, ...holidaysData]);
    }
    setIsModalOpen(false);
  };

  const filteredData = holidaysData.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          item.displayId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTitle = filterTitle ? item.title === filterTitle : true;
    const matchesStatus = filterStatus ? item.status === filterStatus : true;
    
    return matchesSearch && matchesTitle && matchesStatus;
  });

  return (
    <div className="space-y-6 bg-[#F8FAFC] dark:bg-[#0F172A] min-h-screen -m-6 p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">Holidays</h1>
          <div className="flex items-center gap-2 text-[13px] text-slate-500 dark:text-slate-400 mt-1">
            <span>Dashboard</span>
            <span>/</span>
            <Link href="/dashboard" className="hover:text-[#F59E0B]">HRM</Link>
            <span>/</span>
            <span className="text-slate-900 dark:text-white font-medium">Holidays</span>
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
            onClick={openAddModal}
            className="px-4 py-2 bg-[#F59E0B] hover:bg-[#D97706] text-white text-[13px] font-semibold rounded-lg flex items-center gap-2 transition-colors shadow-sm cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Add Holiday
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white dark:bg-slate-900 border border-border rounded-xl shadow-sm overflow-hidden text-left">
        {/* Table Header Section */}
        <div className="p-5 border-b border-border flex flex-col xl:flex-row xl:items-center justify-between gap-4">
          <h2 className="text-[16px] font-bold text-slate-800 dark:text-slate-100">
            Holidays List
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
                        <label className="text-[13px] font-bold text-slate-800 dark:text-slate-100">Holiday Title</label>
                        <div className="relative">
                          <select 
                            value={filterTitle}
                            onChange={(e) => setFilterTitle(e.target.value)}
                            className="w-full px-3 py-2 border border-border rounded-lg text-[13px] outline-none appearance-none bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 font-medium cursor-pointer"
                          >
                            <option value="">Select</option>
                            <option value="New Year">New Year</option>
                            <option value="Martin Luther King Jr. Day">Martin Luther King Jr. Day</option>
                            <option value="Presidents Day">Presidents Day</option>
                            <option value="Christmas Day">Christmas Day</option>
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
                            <option value="Active">Active</option>
                            <option value="Inactive">Inactive</option>
                          </select>
                          <ChevronDown className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute right-3 top-2.5 pointer-events-none" />
                        </div>
                      </div>
                    </div>
                    <div className="p-4 flex justify-end gap-3 bg-white dark:bg-slate-900 rounded-b-lg border-t border-border mt-2">
                      <button 
                        onClick={() => { setFilterTitle(""); setFilterStatus(""); }}
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
                <th className="px-6 py-4 text-left font-bold text-slate-700 dark:text-slate-200">ID</th>
                <th className="px-6 py-4 text-left font-bold text-slate-700 dark:text-slate-200">Holiday Title</th>
                <th className="px-6 py-4 text-left font-bold text-slate-700 dark:text-slate-200">Date</th>
                <th className="px-6 py-4 text-left font-bold text-slate-700 dark:text-slate-200">Description</th>
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
                  <td className="px-6 py-4 font-semibold text-[#F59E0B] cursor-pointer hover:text-[#D97706]">
                    {item.displayId}
                  </td>
                  <td className="px-6 py-4 font-medium text-slate-700 dark:text-slate-200">
                    {item.title}
                  </td>
                  <td className="px-6 py-4 text-slate-600 dark:text-slate-300">
                    {item.date}
                  </td>
                  <td className="px-6 py-4 text-slate-600 dark:text-slate-300">
                    {item.description}
                  </td>
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
                          <button onClick={() => openEditModal(item)} className="w-full px-4 py-2 text-[13px] text-[#0F172A] dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800/50 flex items-center gap-2 font-medium transition-colors cursor-pointer">
                            <Edit className="w-4 h-4 text-[#0F172A] dark:text-slate-100" /> Edit
                          </button>
                          <button className="w-full px-4 py-2 text-[13px] text-[#0F172A] dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800/50 flex items-center gap-2 font-medium transition-colors cursor-pointer">
                            <Trash2 className="w-4 h-4 text-[#0F172A] dark:text-slate-100" /> Delete
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

      {/* Add Holiday Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={isEditing ? "Edit Holiday" : "Add Holiday"}
      >
        <form onSubmit={handleSubmit} className="space-y-6 text-left">
          
          <div className="space-y-1.5">
            <label className="text-[14px] font-bold text-[#0F172A] dark:text-slate-100">Holiday Title</label>
            <input 
              type="text" 
              value={formTitle}
              onChange={(e) => setFormTitle(e.target.value)}
              className="w-full px-4 py-2.5 border border-border rounded-lg outline-none focus:border-[#F59E0B] bg-white dark:bg-slate-800 text-[14px] text-slate-700 dark:text-slate-200 transition-colors"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[14px] font-bold text-[#0F172A] dark:text-slate-100">Date</label>
            <input 
              type="date" 
              value={formDate}
              onChange={(e) => setFormDate(e.target.value)}
              className="w-full px-4 py-2.5 border border-border rounded-lg outline-none focus:border-[#F59E0B] bg-white dark:bg-slate-800 text-[14px] text-slate-700 dark:text-slate-200 transition-colors"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[14px] font-bold text-[#0F172A] dark:text-slate-100">Description</label>
            <textarea 
              value={formDescription}
              onChange={(e) => setFormDescription(e.target.value)}
              className="w-full h-24 p-3 border border-border rounded-lg outline-none focus:border-[#F59E0B] bg-white dark:bg-slate-800 text-[14px] text-slate-700 dark:text-slate-200 resize-none transition-colors"
              required
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            <div>
              <label className="text-[14px] font-bold text-[#0F172A] dark:text-slate-100 block">Status</label>
              <span className="text-[13px] text-slate-500 dark:text-slate-400">Change the Status by toggle</span>
            </div>
            <button 
              type="button"
              onClick={() => setFormStatus(formStatus === "Active" ? "Inactive" : "Active")}
              className={`w-11 h-6 rounded-full flex items-center px-1 transition-colors ${formStatus === "Active" ? "bg-[#F59E0B]" : "bg-slate-200"}`}
            >
              <div className={`w-4 h-4 rounded-full bg-white dark:bg-slate-900 transition-transform ${formStatus === "Active" ? "translate-x-5" : "translate-x-0"}`} />
            </button>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-border">
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
              {isEditing ? "Save Changes" : "Add Holiday"}
            </button>
          </div>

        </form>
      </Modal>

    </div>
  );
}
