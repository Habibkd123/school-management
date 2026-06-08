"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  Plus, Search, List, Grid, MoreVertical, Edit, Trash2,
  Calendar, Filter, ChevronDown, RefreshCw, Printer, Download, ToggleRight
} from "lucide-react";
import { Modal } from "../../../components/ui/modal";

interface Schedule {
  id: string;
  type: string;
  startTime: string;
  endTime: string;
  status: "Active" | "Inactive";
}

const mockSchedules: Schedule[] = [
  { id: "S148239", type: "Class", startTime: "09:30 AM", endTime: "10:30 AM", status: "Active" },
  { id: "S148238", type: "Class", startTime: "10:30 AM", endTime: "11:30 AM", status: "Active" },
  { id: "S148237", type: "Class", startTime: "11:30 AM", endTime: "12:30 PM", status: "Active" },
  { id: "S148236", type: "Class", startTime: "12:30 PM", endTime: "01:30 PM", status: "Active" },
  { id: "S148235", type: "Class", startTime: "01:30 PM", endTime: "02:30 PM", status: "Active" },
  { id: "S148234", type: "Class", startTime: "02:30 PM", endTime: "03:30 PM", status: "Active" },
  { id: "S148233", type: "Class", startTime: "03:30 PM", endTime: "04:30 PM", status: "Active" },
  { id: "S148232", type: "Class", startTime: "04:30 PM", endTime: "05:30 PM", status: "Active" },
  { id: "S148231", type: "Class", startTime: "05:30 PM", endTime: "06:30 PM", status: "Active" },
  { id: "S148230", type: "Class", startTime: "06:30 PM", endTime: "07:30 PM", status: "Inactive" },
];

export default function SchedulePage() {
  const [schedules, setSchedules] = useState<Schedule[]>(mockSchedules);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(null);
  const [actionMenuId, setActionMenuId] = useState<string | null>(null);
  const [selectedDateRange, setSelectedDateRange] = useState("Last 7 Days");

  // Form states
  const [formType, setFormType] = useState("Class");
  const [formStartTime, setFormStartTime] = useState("09:30 AM");
  const [formEndTime, setFormEndTime] = useState("10:30 AM");
  const [formStatus, setFormStatus] = useState(true); // true = Active

  const openAddModal = () => {
    setFormType("Class");
    setFormStartTime("09:30 AM");
    setFormEndTime("10:30 AM");
    setFormStatus(true);
    setIsAddOpen(true);
  };

  const openEditModal = (schedule: Schedule) => {
    setSelectedSchedule(schedule);
    setFormType(schedule.type);
    setFormStartTime(schedule.startTime);
    setFormEndTime(schedule.endTime);
    setFormStatus(schedule.status === "Active");
    setIsEditOpen(true);
    setActionMenuId(null);
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newSchedule: Schedule = {
      id: `S${Math.floor(100000 + Math.random() * 900000)}`,
      type: formType,
      startTime: formStartTime,
      endTime: formEndTime,
      status: formStatus ? "Active" : "Inactive"
    };
    setSchedules([newSchedule, ...schedules]);
    setIsAddOpen(false);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedSchedule) {
      setSchedules(schedules.map(s => 
        s.id === selectedSchedule.id 
          ? { ...s, type: formType, startTime: formStartTime, endTime: formEndTime, status: formStatus ? "Active" : "Inactive" }
          : s
      ));
    }
    setIsEditOpen(false);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this schedule?")) {
      setSchedules(schedules.filter(s => s.id !== id));
    }
    setActionMenuId(null);
  };

  const filteredSchedules = schedules.filter(s => 
    s.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 bg-[#F8FAFC] dark:bg-[#0F172A] min-h-screen -m-6 p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">Schedule</h1>
          <div className="flex items-center gap-2 text-[13px] text-slate-500 dark:text-slate-400 mt-1">
            <span>Dashboard</span>
            <span>/</span>
            <Link href="/dashboard/classes" className="hover:text-[#F59E0B]">Classes</Link>
            <span>/</span>
            <span className="text-slate-900 dark:text-white font-medium">Schedule</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button className="w-9 h-9 rounded-full bg-white dark:bg-slate-900 border border-border flex items-center justify-center text-slate-500 dark:text-slate-400 hover:text-[#F59E0B] hover:bg-indigo-50 transition-colors shadow-sm cursor-pointer">
            <RefreshCw className="w-4 h-4" />
          </button>
          <button className="w-9 h-9 rounded-full bg-white dark:bg-slate-900 border border-border flex items-center justify-center text-slate-500 dark:text-slate-400 hover:text-[#F59E0B] hover:bg-indigo-50 transition-colors shadow-sm cursor-pointer">
            <Printer className="w-4 h-4" />
          </button>
          <button className="px-4 py-2 bg-white dark:bg-slate-900 border border-border text-slate-700 dark:text-slate-200 text-[13px] font-semibold rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors flex items-center gap-2 shadow-sm cursor-pointer">
            <Download className="w-4 h-4" /> Export <ChevronDown className="w-3 h-3 text-slate-400 dark:text-slate-500" />
          </button>
          <button 
            onClick={openAddModal}
            className="px-4 py-2 bg-[#F59E0B] hover:bg-[#D97706] text-white text-[13px] font-semibold rounded-lg flex items-center gap-2 transition-colors shadow-sm cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Add Schedule
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white dark:bg-slate-900 border border-border rounded-xl shadow-sm overflow-hidden text-left">
        {/* Table Header Section */}
        <div className="p-5 border-b border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <h2 className="text-[16px] font-bold text-slate-800 dark:text-slate-100">Schedule Classes</h2>
          <div className="flex items-center gap-3">
            <button className="px-3 py-2 bg-white dark:bg-slate-900 border border-border text-slate-700 dark:text-slate-200 text-[13px] font-medium rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors flex items-center gap-2 shadow-sm">
              <Calendar className="w-4 h-4 text-slate-400 dark:text-slate-500" /> {selectedDateRange}
            </button>
            <button className="px-3 py-2 bg-white dark:bg-slate-900 border border-border text-slate-700 dark:text-slate-200 text-[13px] font-medium rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors flex items-center gap-2 shadow-sm">
              <Filter className="w-4 h-4 text-slate-400 dark:text-slate-500" /> Filter <ChevronDown className="w-3 h-3 text-slate-400 dark:text-slate-500" />
            </button>
            <button className="px-3 py-2 bg-white dark:bg-slate-900 border border-border text-slate-700 dark:text-slate-200 text-[13px] font-medium rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors flex items-center gap-2 shadow-sm">
              <List className="w-4 h-4 text-slate-400 dark:text-slate-500" /> Sort by A-Z <ChevronDown className="w-3 h-3 text-slate-400 dark:text-slate-500" />
            </button>
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
          <table className="w-full text-[13px]">
            <thead className="bg-[#F8FAFC] dark:bg-[#0F172A] border-y border-border">
              <tr>
                <th className="px-6 py-4 text-left font-bold text-slate-700 dark:text-slate-200 w-12">
                  <input type="checkbox" className="rounded border-slate-300 text-[#F59E0B] focus:ring-[#F59E0B] cursor-pointer" />
                </th>
                <th className="px-6 py-4 text-left font-bold text-slate-700 dark:text-slate-200">ID</th>
                <th className="px-6 py-4 text-left font-bold text-slate-700 dark:text-slate-200">Type</th>
                <th className="px-6 py-4 text-left font-bold text-slate-700 dark:text-slate-200">Start Time</th>
                <th className="px-6 py-4 text-left font-bold text-slate-700 dark:text-slate-200">End Time</th>
                <th className="px-6 py-4 text-left font-bold text-slate-700 dark:text-slate-200">Status</th>
                <th className="px-6 py-4 text-left font-bold text-slate-700 dark:text-slate-200 w-20">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredSchedules.map((schedule) => (
                <tr key={schedule.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="px-6 py-4">
                    <input type="checkbox" className="rounded border-slate-300 text-[#F59E0B] focus:ring-[#F59E0B] cursor-pointer" />
                  </td>
                  <td className="px-6 py-4 font-semibold text-[#F59E0B]">{schedule.id}</td>
                  <td className="px-6 py-4 text-slate-600 dark:text-slate-300">{schedule.type}</td>
                  <td className="px-6 py-4 text-slate-600 dark:text-slate-300">{schedule.startTime}</td>
                  <td className="px-6 py-4 text-slate-600 dark:text-slate-300">{schedule.endTime}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-[11px] font-bold ${
                      schedule.status === "Active" 
                        ? "bg-[#E8F8E8] text-[#1D7F2C]" 
                        : "bg-[#FFEBEB] text-[#E02424]"
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${schedule.status === "Active" ? "bg-[#1DD04A]" : "bg-[#E02424]"}`} />
                      {schedule.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center relative" onClick={(e) => e.stopPropagation()}>
                    <button 
                      onClick={() => setActionMenuId(actionMenuId === schedule.id ? null : schedule.id)}
                      className={`p-1.5 rounded-lg transition-colors cursor-pointer ${actionMenuId === schedule.id ? "bg-[#F59E0B] text-white" : "hover:bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500"}`}
                    >
                      <MoreVertical className="w-4 h-4" />
                    </button>
                    {actionMenuId === schedule.id && (
                      <>
                        <div className="fixed inset-0 z-40" onClick={(e) => { e.stopPropagation(); setActionMenuId(null); }} />
                        <div className="absolute right-10 top-10 w-36 bg-white dark:bg-slate-900 border border-border rounded-xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)] z-50 overflow-hidden py-2 text-left">
                          <button onClick={() => openEditModal(schedule)} className="w-full px-4 py-2 text-[13px] text-[#0F172A] dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800/50 flex items-center gap-2 font-medium transition-colors cursor-pointer">
                            <Edit className="w-4 h-4 text-[#0F172A] dark:text-slate-100" /> Edit
                          </button>
                          <button onClick={() => handleDelete(schedule.id)} className="w-full px-4 py-2 text-[13px] text-[#0F172A] dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800/50 flex items-center gap-2 font-medium transition-colors cursor-pointer">
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
          <button className="w-7 h-7 rounded-lg hover:bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[13px] font-medium flex items-center justify-center transition-colors">2</button>
          <button className="px-3 py-1.5 text-[13px] font-medium text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:text-slate-200 transition-colors">Next</button>
        </div>
      </div>

      {/* Add / Edit Modals */}
      <Modal isOpen={isAddOpen || isEditOpen} onClose={() => { setIsAddOpen(false); setIsEditOpen(false); }} title={isAddOpen ? "Add Schedule" : "Edit Schedule"}>
        <form onSubmit={isAddOpen ? handleAddSubmit : handleEditSubmit} className="p-6 space-y-5 text-left">
          
          <div className="space-y-1.5">
            <label className="text-[13px] font-bold text-slate-800 dark:text-slate-100">Type</label>
            <div className="relative">
              <select 
                value={formType}
                onChange={(e) => setFormType(e.target.value)}
                className="w-full px-4 py-2.5 text-[14px] bg-white dark:bg-slate-900 border border-border rounded-lg outline-none focus:border-[#F59E0B] transition-colors appearance-none text-slate-700 dark:text-slate-200 cursor-pointer"
              >
                <option value="">Select</option>
                <option value="Class">Class</option>
                <option value="Exam">Exam</option>
                <option value="Event">Event</option>
              </select>
              <ChevronDown className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[13px] font-bold text-slate-800 dark:text-slate-100">Start Time</label>
            <div className="relative">
              <select 
                value={formStartTime}
                onChange={(e) => setFormStartTime(e.target.value)}
                className="w-full px-4 py-2.5 text-[14px] bg-white dark:bg-slate-900 border border-border rounded-lg outline-none focus:border-[#F59E0B] transition-colors appearance-none text-slate-700 dark:text-slate-200 cursor-pointer"
              >
                <option value="">Select</option>
                <option value="09:30 AM">09:30 AM</option>
                <option value="10:30 AM">10:30 AM</option>
                <option value="11:30 AM">11:30 AM</option>
                <option value="12:30 PM">12:30 PM</option>
                <option value="01:30 PM">01:30 PM</option>
                <option value="02:30 PM">02:30 PM</option>
                <option value="03:30 PM">03:30 PM</option>
                <option value="04:30 PM">04:30 PM</option>
                <option value="05:30 PM">05:30 PM</option>
                <option value="06:30 PM">06:30 PM</option>
              </select>
              <ChevronDown className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[13px] font-bold text-slate-800 dark:text-slate-100">End Time</label>
            <div className="relative">
              <select 
                value={formEndTime}
                onChange={(e) => setFormEndTime(e.target.value)}
                className="w-full px-4 py-2.5 text-[14px] bg-white dark:bg-slate-900 border border-border rounded-lg outline-none focus:border-[#F59E0B] transition-colors appearance-none text-slate-700 dark:text-slate-200 cursor-pointer"
              >
                <option value="">Select</option>
                <option value="10:30 AM">10:30 AM</option>
                <option value="11:30 AM">11:30 AM</option>
                <option value="12:30 PM">12:30 PM</option>
                <option value="01:30 PM">01:30 PM</option>
                <option value="02:30 PM">02:30 PM</option>
                <option value="03:30 PM">03:30 PM</option>
                <option value="04:30 PM">04:30 PM</option>
                <option value="05:30 PM">05:30 PM</option>
                <option value="06:30 PM">06:30 PM</option>
                <option value="07:30 PM">07:30 PM</option>
              </select>
              <ChevronDown className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          <div className="flex items-center justify-between py-2 border-b border-border pb-6">
            <div>
              <label className="text-[14px] font-bold text-[#0F172A] dark:text-slate-100 block">Status</label>
              <span className="text-[13px] text-slate-500 dark:text-slate-400 block mt-1">Change the Status by toggle</span>
            </div>
            <button 
              type="button" 
              onClick={() => setFormStatus(!formStatus)}
              className="cursor-pointer focus:outline-none"
            >
              {formStatus ? (
                <ToggleRight className="w-10 h-10 text-[#F59E0B]" />
              ) : (
                <div className="w-10 h-10 flex items-center justify-center">
                  <div className="w-8 h-4 bg-slate-300 rounded-full relative">
                    <div className="w-3 h-3 bg-white dark:bg-slate-900 rounded-full absolute left-0.5 top-0.5 shadow-sm"></div>
                  </div>
                </div>
              )}
            </button>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button 
              type="button" 
              onClick={() => { setIsAddOpen(false); setIsEditOpen(false); }}
              className="px-6 py-2.5 bg-[#F1F5F9] dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-[14px] font-bold rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="px-6 py-2.5 bg-[#F59E0B] text-white text-[14px] font-bold rounded-lg hover:bg-[#D97706] transition-colors shadow-sm cursor-pointer"
            >
              {isAddOpen ? "Add Schedule" : "Save Changes"}
            </button>
          </div>
        </form>
      </Modal>

    </div>
  );
}
