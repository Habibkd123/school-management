"use client";

import React, { useState, useEffect } from "react";
import { Clock, Calendar as CalendarIcon, CheckCircle2, ShieldAlert, Loader2 } from "lucide-react";
import { useAuth } from "../../../context/auth";

export default function MyAttendancePage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  
  // For now, this is a placeholder UI since the backend for "My Attendance" might need to be built out.
  const stats = {
    total: 30,
    present: 28,
    absent: 2,
    late: 0
  };

  const attendanceRate = Math.round((stats.present / stats.total) * 100) || 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-left">
        <div>
          <h1 className="page-title">My Attendance</h1>
          <p className="page-desc mt-1">
            View your attendance records and statistics.
          </p>
        </div>
        <div className="flex items-center gap-2 bg-white dark:bg-slate-900 border border-border rounded-xl px-3.5 py-2 text-[13px] shadow-sm">
            <span className="font-bold text-slate-500 dark:text-slate-400 uppercase text-[11px] tracking-wider">Month:</span>
            <input
              type="month"
              defaultValue={new Date().toISOString().slice(0, 7)}
              className="bg-transparent text-slate-900 dark:text-white outline-none cursor-pointer font-bold font-mono"
            />
          </div>
      </div>

      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center text-slate-500 dark:text-slate-400 gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-[#5D6BEE]" />
          <span>Loading your attendance...</span>
        </div>
      ) : (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            <div className="bg-white dark:bg-slate-900 border border-border rounded-xl p-5 card-shadow text-left">
              <div className="flex items-center justify-between">
                <span className="text-[11px] uppercase font-bold text-slate-500 dark:text-slate-400 tracking-wider">Working Days</span>
                <CalendarIcon className="w-4 h-4 text-slate-400 dark:text-slate-500" />
              </div>
              <span className="text-2xl font-bold text-slate-900 dark:text-white block mt-1">{stats.total}</span>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-border rounded-xl p-5 card-shadow text-left">
              <div className="flex items-center justify-between">
                <span className="text-[11px] uppercase font-bold text-slate-500 dark:text-slate-400 tracking-wider">Present Rate</span>
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              </div>
              <span className="text-2xl font-bold text-emerald-600 block mt-1">{attendanceRate}%</span>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-border rounded-xl p-5 card-shadow text-left">
              <div className="flex items-center justify-between">
                <span className="text-[11px] uppercase font-bold text-slate-500 dark:text-slate-400 tracking-wider">Late</span>
                <Clock className="w-4 h-4 text-amber-500" />
              </div>
              <span className="text-2xl font-bold text-amber-600 block mt-1">{stats.late}</span>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-border rounded-xl p-5 card-shadow text-left">
              <div className="flex items-center justify-between">
                <span className="text-[11px] uppercase font-bold text-slate-500 dark:text-slate-400 tracking-wider">Absent</span>
                <ShieldAlert className="w-4 h-4 text-rose-500" />
              </div>
              <span className="text-2xl font-bold text-rose-600 block mt-1">{stats.absent}</span>
            </div>
          </div>

          {/* List */}
          <div className="bg-white dark:bg-slate-900 border border-border rounded-xl card-shadow overflow-hidden text-left">
            <div className="px-6 py-4 border-b border-border bg-slate-50/50 dark:bg-slate-800/50 flex items-center justify-between">
              <h2 className="text-[15px] font-semibold text-slate-900 dark:text-white">
                Recent Records
              </h2>
            </div>
            <div className="p-12 text-center text-slate-500 dark:text-slate-400 text-[13px]">
              Detailed attendance view for {user?.name} is coming soon.
            </div>
          </div>
        </>
      )}
    </div>
  );
}
