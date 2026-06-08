"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  Plus, Search, List, Grid, MoreVertical, Edit, Trash2,
  Calendar, Filter, ChevronDown, RefreshCw, Printer, Download, Trash, FileText, Clock
} from "lucide-react";
import { Modal } from "../../../components/ui/modal";
import Image from "next/image";

// Mock Data
const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const pastelColors = [
  "bg-rose-50", "bg-blue-50", "bg-green-50", "bg-yellow-50", "bg-purple-50", "bg-orange-50"
];

const mockTimeTableData = [
  { day: "Monday", time: "09:00 - 09:45 AM", subject: "Maths", teacher: "Jacquelin", teacherId: "T1", img: "https://i.pravatar.cc/150?u=1", colorIndex: 0 },
  { day: "Tuesday", time: "09:00 - 09:45 AM", subject: "Spanish", teacher: "Erickson", teacherId: "T2", img: "https://i.pravatar.cc/150?u=2", colorIndex: 1 },
  { day: "Wednesday", time: "09:00 - 09:45 AM", subject: "Computer", teacher: "Daniel", teacherId: "T3", img: "https://i.pravatar.cc/150?u=3", colorIndex: 2 },
  { day: "Thursday", time: "09:00 - 09:45 AM", subject: "Physics", teacher: "Teresa", teacherId: "T4", img: "https://i.pravatar.cc/150?u=4", colorIndex: 3 },
  { day: "Friday", time: "09:00 - 09:45 AM", subject: "English", teacher: "Hellana", teacherId: "T5", img: "https://i.pravatar.cc/150?u=5", colorIndex: 4 },
  { day: "Saturday", time: "09:00 - 09:45 AM", subject: "English", teacher: "Hellana", teacherId: "T5", img: "https://i.pravatar.cc/150?u=5", colorIndex: 5 },

  { day: "Monday", time: "09:45 - 10:30 AM", subject: "English", teacher: "Hellana", teacherId: "T5", img: "https://i.pravatar.cc/150?u=5", colorIndex: 4 },
  { day: "Tuesday", time: "09:45 - 10:30 AM", subject: "Physics", teacher: "Teresa", teacherId: "T4", img: "https://i.pravatar.cc/150?u=4", colorIndex: 3 },
  { day: "Wednesday", time: "09:45 - 10:30 AM", subject: "Science", teacher: "Morgan", teacherId: "T6", img: "https://i.pravatar.cc/150?u=6", colorIndex: 1 },
  { day: "Thursday", time: "09:45 - 10:30 AM", subject: "Computer", teacher: "Daniel", teacherId: "T3", img: "https://i.pravatar.cc/150?u=3", colorIndex: 2 },
  { day: "Friday", time: "09:45 - 10:30 AM", subject: "Spanish", teacher: "Erickson", teacherId: "T2", img: "https://i.pravatar.cc/150?u=2", colorIndex: 0 },
  { day: "Saturday", time: "09:45 - 10:30 AM", subject: "Spanish", teacher: "Erickson", teacherId: "T2", img: "https://i.pravatar.cc/150?u=2", colorIndex: 1 },

  { day: "Monday", time: "10:45 - 11:30 AM", subject: "Computer", teacher: "Daniel", teacherId: "T3", img: "https://i.pravatar.cc/150?u=3", colorIndex: 2 },
  { day: "Tuesday", time: "10:45 - 11:30 AM", subject: "Chemistry", teacher: "Aaron", teacherId: "T7", img: "https://i.pravatar.cc/150?u=7", colorIndex: 5 },
  { day: "Wednesday", time: "10:45 - 11:30 AM", subject: "Maths", teacher: "Jacquelin", teacherId: "T1", img: "https://i.pravatar.cc/150?u=1", colorIndex: 0 },
  { day: "Thursday", time: "10:45 - 11:30 AM", subject: "English", teacher: "Hellana", teacherId: "T5", img: "https://i.pravatar.cc/150?u=5", colorIndex: 4 },
  { day: "Friday", time: "10:45 - 11:30 AM", subject: "Physics", teacher: "Teresa", teacherId: "T4", img: "https://i.pravatar.cc/150?u=4", colorIndex: 3 },
  { day: "Saturday", time: "10:45 - 11:30 AM", subject: "Physics", teacher: "Teresa", teacherId: "T4", img: "https://i.pravatar.cc/150?u=4", colorIndex: 3 },
];

export default function TimeTablePage() {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  const [activeTab, setActiveTab] = useState("Monday");
  const [dynamicRows, setDynamicRows] = useState([{ id: 1 }]);

  const addRow = () => {
    setDynamicRows([...dynamicRows, { id: dynamicRows.length + 1 }]);
  };

  const removeRow = (id: number) => {
    setDynamicRows(dynamicRows.filter(row => row.id !== id));
  };

  return (
    <div className="space-y-6 bg-[#F8FAFC] min-h-screen -m-6 p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Time Table</h1>
          <div className="flex items-center gap-2 text-[13px] text-slate-500 mt-1">
            <span>Dashboard</span>
            <span>/</span>
            <Link href="/dashboard/academic" className="hover:text-[#5D6BEE]">Academic</Link>
            <span>/</span>
            <span className="text-slate-900 font-medium">Time Table</span>
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

          <button 
            onClick={() => setIsAddOpen(true)}
            className="px-4 py-2 bg-[#5D6BEE] hover:bg-[#4b58ce] text-white text-[13px] font-semibold rounded-lg flex items-center gap-2 transition-colors shadow-sm cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Add Time Table
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white border border-border rounded-xl shadow-sm overflow-hidden text-left p-6">
        
        {/* Table Header Section */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
          <h2 className="text-[16px] font-bold text-slate-800">Time Table</h2>
          
          <div className="flex items-center gap-3">
            <div className="relative">
              <button 
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="px-4 py-2 bg-white border border-border text-slate-700 text-[13px] font-medium rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-2 shadow-sm cursor-pointer"
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
                          <select className="w-full px-3 py-2 border border-border rounded-lg text-[13px] outline-none appearance-none bg-white text-slate-600 font-medium cursor-pointer">
                            <option>Select</option>
                            <option>I</option>
                            <option>II</option>
                            <option>III</option>
                          </select>
                          <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-2.5 pointer-events-none" />
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[13px] font-bold text-slate-800">Section</label>
                        <div className="relative">
                          <select className="w-full px-3 py-2 border border-border rounded-lg text-[13px] outline-none appearance-none bg-white text-slate-600 font-medium cursor-pointer">
                            <option>Select</option>
                            <option>A</option>
                            <option>B</option>
                            <option>C</option>
                          </select>
                          <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-2.5 pointer-events-none" />
                        </div>
                      </div>
                    </div>
                    <div className="p-4 flex justify-end gap-3 bg-white rounded-b-lg border-t border-border mt-2">
                      <button className="px-5 py-2.5 bg-[#F1F5F9] hover:bg-[#E2E8F0] text-[#202c4b] text-[13px] font-bold rounded-lg transition-colors cursor-pointer">
                        Reset
                      </button>
                      <button className="px-5 py-2.5 bg-[#5D6BEE] hover:bg-[#4b58ce] text-white text-[13px] font-bold rounded-lg shadow-sm transition-colors cursor-pointer">
                        Apply
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Grid View */}
        <div className="overflow-x-auto pb-4">
          <div className="min-w-[1000px]">
            {/* Headers */}
            <div className="grid grid-cols-6 gap-4 mb-4">
              {days.map(day => (
                <div key={day} className="font-bold text-[14px] text-[#202c4b] pl-2">{day}</div>
              ))}
            </div>

            {/* Time Table Content */}
            <div className="grid grid-cols-6 gap-4">
              {days.map(day => (
                <div key={day} className="space-y-4">
                  {mockTimeTableData.filter(d => d.day === day).map((item, index) => (
                    <div key={index} className={`p-4 rounded-xl ${pastelColors[item.colorIndex]} border border-white/50 shadow-sm transition-all hover:shadow-md`}>
                      <div className="flex items-center gap-1.5 text-slate-500 text-[12px] font-medium mb-2">
                        <Clock className="w-3.5 h-3.5" />
                        {item.time}
                      </div>
                      <div className="text-[13px] font-bold text-[#202c4b] mb-4">
                        Subject : {item.subject}
                      </div>
                      <div className="bg-white/60 rounded-lg p-2 flex items-center gap-3 hover:bg-white transition-colors">
                        <Link href={`/dashboard/teachers/${item.teacherId}`} className="flex items-center gap-3 w-full">
                          <img src={item.img} alt={item.teacher} className="w-8 h-8 rounded-full object-cover border border-white shadow-sm" />
                          <span className="text-[13px] font-bold text-slate-700 hover:text-[#5D6BEE] transition-colors">{item.teacher}</span>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>

            {/* Break Blocks */}
            <div className="grid grid-cols-6 gap-4 mt-8">
              <div className="col-span-2 bg-[#F8FAFC] border border-border rounded-xl p-4 flex flex-col justify-center">
                <span className="inline-block bg-[#5D6BEE] text-white text-[11px] font-bold px-2.5 py-1 rounded w-max mb-2">Morning Break</span>
                <div className="flex items-center gap-1.5 text-slate-500 text-[12px] font-medium">
                  <Clock className="w-3.5 h-3.5" /> 10:30 to 10:45 AM
                </div>
              </div>
              
              <div className="col-span-2 bg-[#F8FAFC] border border-border rounded-xl p-4 flex flex-col justify-center">
                <span className="inline-block bg-[#F59E0B] text-white text-[11px] font-bold px-2.5 py-1 rounded w-max mb-2">Lunch</span>
                <div className="flex items-center gap-1.5 text-slate-500 text-[12px] font-medium">
                  <Clock className="w-3.5 h-3.5" /> 12:15 to 01:30 PM
                </div>
              </div>

              <div className="col-span-2 bg-[#F8FAFC] border border-border rounded-xl p-4 flex flex-col justify-center">
                <span className="inline-block bg-[#0284C7] text-white text-[11px] font-bold px-2.5 py-1 rounded w-max mb-2">Evening Break</span>
                <div className="flex items-center gap-1.5 text-slate-500 text-[12px] font-medium">
                  <Clock className="w-3.5 h-3.5" /> 03:00 to 03:15 PM
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Add Time Table Modal */}
      {isAddOpen && (
        <>
          <div className="fixed inset-0 bg-slate-900/50 z-[60] backdrop-blur-sm" onClick={() => setIsAddOpen(false)} />
          <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[900px] bg-white rounded-2xl shadow-xl z-[70] overflow-hidden text-left flex flex-col max-h-[90vh]">
            
            <div className="flex items-center justify-between p-6 border-b border-border bg-white">
              <h2 className="text-xl font-bold text-[#202c4b]">Add Time Table</h2>
              <button 
                onClick={() => setIsAddOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 transition-colors cursor-pointer"
              >
                <Trash2 className="w-4 h-4 hidden" /> {/* Placeholder for alignment if needed */}
                ✕
              </button>
            </div>

            <div className="p-6 overflow-y-auto custom-scrollbar">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="space-y-1.5">
                  <label className="text-[13px] font-bold text-slate-800">Class</label>
                  <input type="text" className="w-full px-4 py-2.5 text-[14px] bg-white border border-border rounded-lg outline-none focus:border-[#5D6BEE] transition-colors text-slate-700" />
                </div>
                
                <div className="space-y-1.5">
                  <label className="text-[13px] font-bold text-slate-800">Section</label>
                  <div className="relative">
                    <select className="w-full px-4 py-2.5 text-[14px] bg-white border border-border rounded-lg outline-none focus:border-[#5D6BEE] transition-colors appearance-none text-slate-700 cursor-pointer">
                      <option>A</option>
                      <option>B</option>
                      <option>C</option>
                    </select>
                    <ChevronDown className="w-4 h-4 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[13px] font-bold text-slate-800">Subject Group</label>
                  <div className="relative">
                    <select className="w-full px-4 py-2.5 text-[14px] bg-white border border-border rounded-lg outline-none focus:border-[#5D6BEE] transition-colors appearance-none text-slate-700 cursor-pointer">
                      <option>Class I</option>
                      <option>Class II</option>
                    </select>
                    <ChevronDown className="w-4 h-4 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[13px] font-bold text-slate-800">Period Start Time</label>
                  <div className="relative">
                    <select className="w-full px-4 py-2.5 text-[14px] bg-white border border-border rounded-lg outline-none focus:border-[#5D6BEE] transition-colors appearance-none text-slate-700 cursor-pointer">
                      <option>Select</option>
                      <option>09:00 AM</option>
                    </select>
                    <ChevronDown className="w-4 h-4 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[13px] font-bold text-slate-800">Duration(min)</label>
                  <div className="relative">
                    <select className="w-full px-4 py-2.5 text-[14px] bg-white border border-border rounded-lg outline-none focus:border-[#5D6BEE] transition-colors appearance-none text-slate-700 cursor-pointer">
                      <option>Select</option>
                      <option>45</option>
                    </select>
                    <ChevronDown className="w-4 h-4 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* Tabs */}
              <div className="bg-[#F8FAFC] border border-border rounded-xl p-4">
                <div className="flex border-b border-border mb-6 overflow-x-auto custom-scrollbar">
                  {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"].map(day => (
                    <button 
                      key={day}
                      onClick={() => setActiveTab(day)}
                      className={`px-6 py-3 text-[14px] font-bold border-b-2 transition-colors whitespace-nowrap ${activeTab === day ? "border-[#5D6BEE] text-[#5D6BEE]" : "border-transparent text-slate-500 hover:text-slate-700"}`}
                    >
                      {day}
                    </button>
                  ))}
                </div>

                {/* Tab Content */}
                <div className="space-y-4">
                  {dynamicRows.map((row) => (
                    <div key={row.id} className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
                      <div className="space-y-1.5">
                        <label className="text-[13px] font-bold text-slate-800">Subject</label>
                        <div className="relative">
                          <select className="w-full px-4 py-2.5 text-[14px] bg-white border border-border rounded-lg outline-none focus:border-[#5D6BEE] transition-colors appearance-none text-slate-700 cursor-pointer">
                            <option>Select</option>
                            <option>Maths</option>
                            <option>English</option>
                          </select>
                          <ChevronDown className="w-4 h-4 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[13px] font-bold text-slate-800">Teacher</label>
                        <div className="relative">
                          <select className="w-full px-4 py-2.5 text-[14px] bg-white border border-border rounded-lg outline-none focus:border-[#5D6BEE] transition-colors appearance-none text-slate-700 cursor-pointer">
                            <option>Select</option>
                            <option>Jacquelin</option>
                            <option>Erickson</option>
                          </select>
                          <ChevronDown className="w-4 h-4 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[13px] font-bold text-slate-800">Time From</label>
                        <div className="relative">
                          <select className="w-full px-4 py-2.5 text-[14px] bg-white border border-border rounded-lg outline-none focus:border-[#5D6BEE] transition-colors appearance-none text-slate-700 cursor-pointer">
                            <option>Select</option>
                            <option>09:00 AM</option>
                          </select>
                          <ChevronDown className="w-4 h-4 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[13px] font-bold text-slate-800">Time To</label>
                        <div className="relative">
                          <select className="w-full px-4 py-2.5 text-[14px] bg-white border border-border rounded-lg outline-none focus:border-[#5D6BEE] transition-colors appearance-none text-slate-700 cursor-pointer">
                            <option>Select</option>
                            <option>09:45 AM</option>
                          </select>
                          <ChevronDown className="w-4 h-4 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                        </div>
                      </div>

                      <div className="pb-1">
                        <button 
                          onClick={() => removeRow(row.id)}
                          className="w-10 h-10 flex items-center justify-center rounded-lg bg-rose-50 text-rose-500 hover:bg-rose-100 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                  
                  <button 
                    onClick={addRow}
                    className="px-4 py-2 bg-[#5D6BEE] hover:bg-[#4b58ce] text-white text-[13px] font-bold rounded-lg flex items-center gap-2 transition-colors mt-4 shadow-sm cursor-pointer"
                  >
                    <Plus className="w-4 h-4" /> Add New
                  </button>
                </div>
              </div>

            </div>

            <div className="p-6 border-t border-border bg-white flex items-center justify-end gap-3">
              <button 
                onClick={() => setIsAddOpen(false)}
                className="px-6 py-2.5 bg-[#F1F5F9] text-slate-700 text-[14px] font-bold rounded-lg hover:bg-slate-200 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button 
                onClick={() => setIsAddOpen(false)}
                className="px-6 py-2.5 bg-[#5D6BEE] text-white text-[14px] font-bold rounded-lg hover:bg-[#4b58ce] transition-colors shadow-sm cursor-pointer"
              >
                Add Time Table
              </button>
            </div>
          </div>
        </>
      )}

    </div>
  );
}
