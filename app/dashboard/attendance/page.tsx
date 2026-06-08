"use client";

import React, { useState, useEffect } from "react";
import { useAppState } from "../../context/store";
import { Clock, Calendar, Check, X, ShieldAlert, CheckCircle2, RefreshCw } from "lucide-react";

export default function AttendancePage() {
  const {
    activeRole,
    students,
    classes,
    attendance,
    markAttendance
  } = useAppState();

  const [selectedClassId, setSelectedClassId] = useState("c1");
  const [date, setDate] = useState("2026-06-05");
  const [tempRecords, setTempRecords] = useState<{ [studentId: string]: "Present" | "Absent" | "Late" }>({});
  const [isSaved, setIsSaved] = useState(false);

  const classStudents = students.filter((s) => s.classId === selectedClassId);

  // Initialize temporary attendance record mapping when class or date changes
  useEffect(() => {
    const initial: typeof tempRecords = {};
    classStudents.forEach((student) => {
      const existing = attendance[student.id]?.[date];
      initial[student.id] = existing || "Present"; // Default to Present if no record
    });
    setTempRecords(initial);
    setIsSaved(false);
  }, [selectedClassId, date, students]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleStatusChange = (studentId: string, status: "Present" | "Absent" | "Late") => {
    setTempRecords((prev) => ({
      ...prev,
      [studentId]: status
    }));
    setIsSaved(false);
  };

  const handleSave = () => {
    const recordsArray = Object.entries(tempRecords).map(([studentId, status]) => ({
      studentId,
      status
    }));
    markAttendance(date, recordsArray);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const currentClass = classes.find((c) => c.id === selectedClassId) || classes[0];

  // Stats
  const total = classStudents.length;
  const present = Object.values(tempRecords).filter((status) => status === "Present").length;
  const late = Object.values(tempRecords).filter((status) => status === "Late").length;
  const absent = Object.values(tempRecords).filter((status) => status === "Absent").length;
  const attendanceRate = total > 0 ? Math.round(((present + late) / total) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-left">
        <div>
          <h1 className="page-title">
            Attendance Register
          </h1>
          <p className="page-desc mt-1">
            Track and record student presence, tardiness, and leaves of absence.
          </p>
        </div>

        {/* Date and Class Selector Form */}
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2 bg-white border border-border rounded-xl px-3.5 py-2 text-[13px] shadow-sm">
            <span className="font-bold text-slate-500 uppercase text-[11px] tracking-wider">Class:</span>
            <select
              value={selectedClassId}
              onChange={(e) => setSelectedClassId(e.target.value)}
              className="bg-transparent text-slate-900 outline-none cursor-pointer font-bold"
            >
              {classes.map((c) => (
                 <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2 bg-white border border-border rounded-xl px-3.5 py-2 text-[13px] shadow-sm">
             <span className="font-bold text-slate-500 uppercase text-[11px] tracking-wider">Date:</span>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
               className="bg-transparent text-slate-900 outline-none cursor-pointer font-bold font-mono"
            />
          </div>
        </div>
      </div>

      {/* Attendance Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
         <div className="bg-white border border-border rounded-xl p-5 card-shadow text-left">
          <div className="flex items-center justify-between">
            <span className="text-[11px] uppercase font-bold text-slate-500 tracking-wider">Total Cohort</span>
            <Clock className="w-4 h-4 text-slate-400" />
          </div>
          <span className="text-2xl font-bold text-slate-900 block mt-1">{total} Students</span>
        </div>

        <div className="bg-white border border-border rounded-xl p-5 card-shadow text-left">
          <div className="flex items-center justify-between">
             <span className="text-[11px] uppercase font-bold text-slate-500 tracking-wider">Present Rate</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <span className="text-2xl font-bold text-emerald-600 block mt-1">{attendanceRate}%</span>
        </div>

        <div className="bg-white border border-border rounded-xl p-5 card-shadow text-left">
          <div className="flex items-center justify-between">
            <span className="text-[11px] uppercase font-bold text-slate-500 tracking-wider">Late Arrivals</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <span className="text-2xl font-bold text-amber-600 block mt-1">{late} Late</span>
        </div>

         <div className="bg-white border border-border rounded-xl p-5 card-shadow text-left">
          <div className="flex items-center justify-between">
             <span className="text-[11px] uppercase font-bold text-slate-500 tracking-wider">Absences</span>
            <ShieldAlert className="w-4 h-4 text-rose-500" />
          </div>
          <span className="text-2xl font-bold text-rose-600 block mt-1">{absent} Absent</span>
        </div>
      </div>

      {/* Main Registry Table Panel */}
      <div className="bg-white border border-border rounded-xl card-shadow overflow-hidden text-left">
        <div className="px-6 py-4 border-b border-border bg-slate-50/50 flex items-center justify-between">
           <h2 className="text-[15px] font-semibold text-slate-900">
            Attendance Register: {currentClass?.name} ({date})
          </h2>
          {isSaved && (
             <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full flex items-center gap-1 animate-pulse">
              <Check className="w-3.5 h-3.5" /> State Persisted Successfully!
            </span>
          )}
        </div>

        <div className="overflow-x-auto bg-white">
          <table className="w-full border-collapse text-left">
            <thead>
               <tr className="border-b border-border bg-white text-[11px] uppercase font-bold text-slate-500 tracking-wider">
                <th className="px-6 py-4">Roll No.</th>
                <th className="px-6 py-4">Student Name</th>
                <th className="px-6 py-4">Email Contact</th>
                <th className="px-6 py-4 text-center">Status Registration</th>
              </tr>
            </thead>
             <tbody className="divide-y divide-border text-[13px]">
              {classStudents.length === 0 ? (
                <tr>
                   <td colSpan={4} className="px-6 py-12 text-center text-slate-500">
                    No students enrolled in this class.
                  </td>
                </tr>
              ) : (
                classStudents.map((student) => {
                  const currentStatus = tempRecords[student.id] || "Present";
                  return (
                     <tr key={student.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4 font-mono font-semibold text-slate-500">{student.rollNo}</td>
                       <td className="px-6 py-4 font-bold text-slate-900">{student.name}</td>
                      <td className="px-6 py-4 text-slate-500">{student.email}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          {/* Present Button */}
                          <button
                            onClick={() => handleStatusChange(student.id, "Present")}
                             className={`px-3.5 py-1.5 rounded-lg border text-[12px] font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                              currentStatus === "Present"
                                 ? "bg-emerald-50 border-emerald-300 text-emerald-700 shadow-sm"
                                 : "border-border text-slate-500 bg-white hover:bg-slate-50"
                            }`}
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>Present</span>
                          </button>

                          {/* Late Button */}
                          <button
                            onClick={() => handleStatusChange(student.id, "Late")}
                             className={`px-3.5 py-1.5 rounded-lg border text-[12px] font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                              currentStatus === "Late"
                                 ? "bg-amber-50 border-amber-300 text-amber-700 shadow-sm"
                                 : "border-border text-slate-500 bg-white hover:bg-slate-50"
                            }`}
                          >
                            <Clock className="w-3.5 h-3.5" />
                            <span>Late</span>
                          </button>

                          {/* Absent Button */}
                          <button
                            onClick={() => handleStatusChange(student.id, "Absent")}
                             className={`px-3.5 py-1.5 rounded-lg border text-[12px] font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                              currentStatus === "Absent"
                                 ? "bg-rose-50 border-rose-300 text-rose-700 shadow-sm"
                                 : "border-border text-slate-500 bg-white hover:bg-slate-50"
                            }`}
                          >
                            <X className="w-3.5 h-3.5" />
                            <span>Absent</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer save block */}
        {classStudents.length > 0 && (
           <div className="px-6 py-4 border-t border-border bg-slate-50/80 flex justify-between items-center">
            <span className="text-[11px] text-slate-400 font-bold font-mono uppercase tracking-wider">
              Last Synced: Local Storage Session
            </span>
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-5 py-2.5 text-[13px] font-semibold text-white bg-primary hover:bg-primary/90 rounded-lg shadow-sm transition-colors cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Save & Sync Register</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
