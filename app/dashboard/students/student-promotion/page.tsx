"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Info, ArrowRightLeft, ChevronDown, Search, ArrowRight, Check, X, RefreshCcw, Printer, Download, Calendar } from "lucide-react";

export default function StudentPromotionPage() {
  const [isManaging, setIsManaging] = useState(false);
  const [selectedDateRange, setSelectedDateRange] = useState("Last 7 Days");

  return (
    <div className="space-y-6 bg-[#F8FAFC] dark:bg-[#0F172A] min-h-screen -m-6 p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-left">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">Student Promotion</h1>
          <div className="flex items-center gap-2 text-[13px] text-slate-500 mt-1">
            <span>Dashboard</span>
            <span>/</span>
            <Link href="/dashboard/students" className="hover:text-primary transition-colors">Students</Link>
            <span>/</span>
            <span className="text-slate-900 dark:text-white font-medium">Student Promotion</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button className="p-2 border border-border rounded-lg bg-white dark:bg-slate-900 text-slate-500 hover:text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-sm">
            <RefreshCcw className="w-4 h-4" />
          </button>
          <button className="p-2 border border-border rounded-lg bg-white dark:bg-slate-900 text-slate-500 hover:text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-sm">
            <Printer className="w-4 h-4" />
          </button>
          <button className="flex items-center gap-2 px-3 py-2 border border-border rounded-lg bg-white dark:bg-slate-900 text-[13px] font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-sm">
            <Download className="w-4 h-4" />
            <span>Export</span>
            <ChevronDown className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Info Alert */}
      <div className="flex items-start gap-2 bg-[#E0E7FF]/50 border border-[#818CF8] rounded-lg p-3 text-[13px] text-[#4338CA]">
        <Info className="w-4 h-4 mt-0.5 flex-shrink-0" />
        <p><span className="font-bold">Note : </span>Prompting Student from the Present class to the Next Class will Create an enrollment of the student to the next Session</p>
      </div>

      {/* Main Configuration Card */}
      <div className="bg-white dark:bg-slate-900 border border-border rounded-xl shadow-sm overflow-hidden">
        <div className="p-5 border-b border-border">
          <h2 className="text-[15px] font-bold text-slate-900 dark:text-white">Promotion</h2>
          <p className="text-[13px] text-slate-500">Select a Class to Promote next session and new class</p>
        </div>

        <div className="p-5">
          <div className="flex flex-col lg:flex-row items-center gap-8 relative">

            {/* Left Side */}
            <div className="flex-1 w-full border border-slate-100 dark:border-slate-800 rounded-xl p-5 bg-slate-50/50 dark:bg-slate-800/20">
              <div className="mb-6">
                <label className="text-[13px] font-bold text-slate-900 dark:text-white">Current Session <span className="text-red-500">*</span></label>
                <p className="text-[13px] text-slate-500 mt-2 font-medium">2024 - 2025</p>
              </div>

              <div className="space-y-3">
                <h3 className="text-[13px] font-bold text-slate-900 dark:text-white">Promotion from Class <span className="text-red-500">*</span></h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[12px] font-medium text-slate-600 dark:text-slate-400">Class</label>
                    <select className="px-3.5 py-2.5 border border-border rounded-lg bg-white dark:bg-slate-900 text-[13px] text-slate-700 dark:text-slate-300 outline-none focus:border-primary/50 transition-all appearance-none cursor-pointer">
                      <option>Select</option>
                      <option>I</option>
                      <option>II</option>
                      <option>III</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[12px] font-medium text-slate-600 dark:text-slate-400">Section</label>
                    <select className="px-3.5 py-2.5 border border-border rounded-lg bg-white dark:bg-slate-900 text-[13px] text-slate-700 dark:text-slate-300 outline-none focus:border-primary/50 transition-all appearance-none cursor-pointer">
                      <option>Select</option>
                      <option>A</option>
                      <option>B</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Swap Button */}
            <div className="hidden lg:flex shrink-0 w-12 h-12 rounded-xl bg-[#3B82F6] text-white items-center justify-center shadow-lg transform -mx-4 z-10">
              <ArrowRightLeft className="w-5 h-5" />
            </div>

            {/* Right Side */}
            <div className="flex-1 w-full border border-slate-100 dark:border-slate-800 rounded-xl p-5 bg-slate-50/50 dark:bg-slate-800/20">
              <div className="mb-6 flex flex-col gap-1.5">
                <label className="text-[13px] font-bold text-slate-900 dark:text-white">Promote to Session <span className="text-red-500">*</span></label>
                <select className="px-3.5 py-2.5 border border-border rounded-lg bg-white dark:bg-slate-900 text-[13px] text-slate-700 dark:text-slate-300 outline-none focus:border-primary/50 transition-all appearance-none cursor-pointer w-full">
                  <option>2025 - 2026</option>
                  <option>2026 - 2027</option>
                </select>
              </div>

              <div className="space-y-3">
                <h3 className="text-[13px] font-bold text-slate-900 dark:text-white">Promotion to Class <span className="text-red-500">*</span></h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[12px] font-medium text-slate-600 dark:text-slate-400">Class</label>
                    <select className="px-3.5 py-2.5 border border-border rounded-lg bg-white dark:bg-slate-900 text-[13px] text-slate-700 dark:text-slate-300 outline-none focus:border-primary/50 transition-all appearance-none cursor-pointer">
                      <option>Select</option>
                      <option>II</option>
                      <option>III</option>
                      <option>IV</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[12px] font-medium text-slate-600 dark:text-slate-400">Section</label>
                    <select className="px-3.5 py-2.5 border border-border rounded-lg bg-white dark:bg-slate-900 text-[13px] text-slate-700 dark:text-slate-300 outline-none focus:border-primary/50 transition-all appearance-none cursor-pointer">
                      <option>Select</option>
                      <option>A</option>
                      <option>B</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center gap-4 mt-8">
            <button className="px-6 py-2.5 rounded-lg text-[13px] font-bold text-slate-700 dark:text-slate-200 bg-[#F1F5F9] dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
              Reset Promotion
            </button>
            <button
              onClick={() => setIsManaging(true)}
              className="px-6 py-2.5 rounded-lg text-[13px] font-bold text-white bg-[#3B82F6] hover:bg-blue-600 transition-colors shadow-sm"
            >
              Manage Promotion
            </button>
          </div>
        </div>
      </div>

      {isManaging && (
        <>
          {/* Map Class Sections Card */}
          <div className="bg-white dark:bg-slate-900 border border-border rounded-xl shadow-sm overflow-hidden">
            <div className="p-5 border-b border-border">
              <h2 className="text-[15px] font-bold text-slate-900 dark:text-white">Map Class Sections</h2>
              <p className="text-[13px] text-slate-500">Select section mapping of old class to new class</p>
            </div>
            <div className="p-5">
              <div className="flex flex-col lg:flex-row items-center gap-8 relative">
                {/* Left */}
                <div className="flex-1 w-full border border-slate-100 dark:border-slate-800 rounded-xl p-5 bg-slate-50/50 dark:bg-slate-800/20">
                  <div className="mb-4">
                    <h4 className="text-[13px] font-bold text-slate-900 dark:text-white">From Class <span className="text-red-500">*</span></h4>
                    <p className="text-[13px] text-slate-600 dark:text-slate-400 mt-1">III</p>
                  </div>
                  <div>
                    <h4 className="text-[13px] font-bold text-slate-900 dark:text-white">Promotion from Section <span className="text-red-500">*</span></h4>
                    <p className="text-[13px] text-slate-600 dark:text-slate-400 mt-1">Student From Section <span className="text-red-500">*</span></p>
                    <p className="text-[13px] text-slate-600 dark:text-slate-400 font-bold">A</p>
                  </div>
                </div>

                {/* Swap */}
                <div className="hidden lg:flex shrink-0 w-10 h-10 rounded-full bg-[#3B82F6] text-white items-center justify-center shadow-md transform -mx-4 z-10">
                  <ArrowRightLeft className="w-4 h-4" />
                </div>

                {/* Right */}
                <div className="flex-1 w-full border border-slate-100 dark:border-slate-800 rounded-xl p-5 bg-slate-50/50 dark:bg-slate-800/20">
                  <div className="mb-4">
                    <h4 className="text-[13px] font-bold text-slate-900 dark:text-white">Promote to Session <span className="text-red-500">*</span></h4>
                    <p className="text-[13px] text-slate-600 dark:text-slate-400 mt-1">IV</p>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[13px] font-bold text-slate-900 dark:text-white">Assign to Section <span className="text-red-500">*</span></label>
                    <label className="text-[12px] font-medium text-slate-600 dark:text-slate-400 mt-0.5">Class</label>
                    <select className="px-3.5 py-2.5 border border-border rounded-lg bg-white dark:bg-slate-900 text-[13px] text-slate-700 dark:text-slate-300 outline-none focus:border-primary/50 transition-all appearance-none cursor-pointer w-full mt-1">
                      <option>A</option>
                      <option>B</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Students List Table */}
          <div className="bg-white dark:bg-slate-900 border border-border rounded-xl shadow-sm overflow-hidden">
            <div className="p-4 border-b border-border flex flex-col md:flex-row md:items-center justify-between gap-4">
              <h3 className="text-[15px] font-bold text-slate-900 dark:text-white">Students List</h3>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 px-3 py-2 border border-border rounded-lg text-[13px] text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-900">
                  <Calendar className="w-4 h-4 text-slate-400" />
                  <span>{selectedDateRange}</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-2 border border-border rounded-lg text-[13px] text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-900 cursor-pointer">
                  <Search className="w-4 h-4 text-slate-400" />
                  <span>Sort by A - Z</span>
                  <ChevronDown className="w-3.5 h-3.5 ml-1" />
                </div>
              </div>
            </div>

            <div className="p-4 border-b border-slate-100 dark:border-slate-800/50 flex items-center justify-between text-[13px] text-slate-500">
              <div className="flex items-center gap-2">
                <span>Row Per Page</span>
                <div className="flex items-center gap-2 px-3 py-1.5 border border-border rounded bg-white dark:bg-slate-900 font-medium text-slate-700 dark:text-slate-200 cursor-pointer">
                  10 <ChevronDown className="w-3.5 h-3.5" />
                </div>
                <span>Entries</span>
              </div>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search"
                  className="w-[200px] pl-3 pr-4 py-2 text-[13px] text-slate-900 dark:text-white bg-white dark:bg-slate-900 border border-border rounded-lg outline-none focus:border-[#F59E0B]/50 transition-all"
                />
              </div>
            </div>

            <div className="overflow-x-auto min-h-[300px]">
              <table className="w-full border-collapse text-left whitespace-nowrap">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-border text-[12px] font-bold text-slate-700 dark:text-slate-200">
                    <th className="px-5 py-4 w-12"><input type="checkbox" className="rounded border-slate-300 w-4 h-4 accent-[#3B82F6]" /></th>
                    <th className="px-5 py-4 flex items-center gap-1 cursor-pointer">Admission No <ChevronDown className="w-3 h-3 text-slate-400" /></th>
                    <th className="px-5 py-4 cursor-pointer">Roll No <span className="text-[10px] text-slate-400">▼</span></th>
                    <th className="px-5 py-4">Name</th>
                    <th className="px-5 py-4 cursor-pointer">Class <span className="text-[10px] text-slate-400">▼</span></th>
                    <th className="px-5 py-4 cursor-pointer">Section <span className="text-[10px] text-slate-400">▼</span></th>
                    <th className="px-5 py-4 cursor-pointer">Exam Result <span className="text-[10px] text-slate-400">▼</span></th>
                    <th className="px-5 py-4 text-left">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border text-[13px]">
                  {[
                    { id: "1", name: "Janet", roll: "35013", admin: "AD9892434", class: "III", sec: "A", res: "Pass", avatar: "/asset 12.webp" },
                    { id: "2", name: "Joann", roll: "35013", admin: "AD9892433", class: "IV", sec: "B", res: "Pass", avatar: "/asset 14.webp" },
                    { id: "3", name: "Kathleen", roll: "35011", admin: "AD9892432", class: "III", sec: "A", res: "Pass", avatar: "/asset 12.webp" },
                    { id: "4", name: "Gifford", roll: "35010", admin: "AD9892431", class: "I", sec: "B", res: "Pass", avatar: "/asset 14.webp" },
                    { id: "5", name: "Lisa", roll: "35009", admin: "AD9892430", class: "II", sec: "B", res: "Fail", avatar: "/asset 12.webp" },
                    { id: "6", name: "Ralph", roll: "35008", admin: "AD9892429", class: "III", sec: "B", res: "Pass", avatar: "/asset 14.webp" },
                  ].map(s => (
                    <tr key={s.id} className="hover:bg-slate-50/50 dark:bg-slate-800/50 transition-colors group">
                      <td className="px-5 py-3"><input type="checkbox" className="rounded border-slate-300 w-4 h-4 accent-[#3B82F6]" /></td>
                      <td className="px-5 py-3 font-semibold text-[#3B82F6]">{s.admin}</td>
                      <td className="px-5 py-3 text-slate-700 dark:text-slate-200">{s.roll}</td>
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-3">
                          <img src={s.avatar} className="w-8 h-8 rounded-full object-cover" alt="Avatar" />
                          <span className="font-semibold text-slate-900 dark:text-white">{s.name}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3 text-slate-700 dark:text-slate-200">{s.class}</td>
                      <td className="px-5 py-3 text-slate-700 dark:text-slate-200">{s.sec}</td>
                      <td className="px-5 py-3">
                        <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${s.res === 'Pass' ? 'bg-[#E8F8E8] text-[#1D7F2C] border border-[#1D7F2C]/20' : 'bg-[#FFEBF0] text-[#FF4A6B] border border-[#FF4A6B]/20'} flex items-center gap-1.5 w-max`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${s.res === 'Pass' ? 'bg-[#1DD04A]' : 'bg-[#FF4A6B]'}`}></span> {s.res}
                        </span>
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-2">
                          <select className="border border-border rounded px-2 py-1 text-[12px] bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 outline-none w-[130px]">
                            {s.res === "Fail" ? (
                              <>
                                <option>No Promotion</option>
                                <option>Promote to IV</option>
                              </>
                            ) : (
                              <>
                                <option>Promote to IV</option>
                                <option>No Promotion</option>
                              </>
                            )}
                          </select>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="p-6 border-t border-border flex flex-col items-center justify-center gap-4 bg-slate-50/30 dark:bg-slate-800/10">
              <p className="text-[13px] font-semibold text-slate-900 dark:text-white">Selected Students will be promoted to 2025 - 2026 Academic Session</p>
              <button className="px-8 py-2.5 rounded-lg text-[14px] font-bold text-white bg-[#3B82F6] hover:bg-blue-600 transition-colors shadow-md">
                Promote Students
              </button>
            </div>
          </div>
        </>
      )}

    </div>
  );
}
