"use client";

import React, { useState, useEffect } from "react";
import { useClasses } from "../../hooks/useClasses";
import { useStudents } from "../../hooks/useStudents";
import { useAttendance } from "../../hooks/useAttendance";
import { Clock, Calendar, Check, X, ShieldAlert, CheckCircle2, RefreshCw, Loader2 } from "lucide-react";

export default function AttendancePage() {
  const { classes, isLoading: classesLoading } = useClasses();
  const { students, isLoading: studentsLoading } = useStudents();
  const { fetchAttendance, saveAttendance, isLoading: attendanceLoading } = useAttendance();

  const [selectedClassId, setSelectedClassId] = useState("");
  const [date, setDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  });
  const [tempRecords, setTempRecords] = useState<{ [studentId: string]: "Present" | "Absent" | "Late" }>({});
  const [isSaved, setIsSaved] = useState(false);

  // Set default class once loaded
  useEffect(() => {
    if (classes.length > 0 && !selectedClassId) {
      setSelectedClassId(classes[0]?._id);
    }
  }, [classes, selectedClassId]);

  const classStudents = students.filter((s) => {
    const cId = typeof s?.class_id === "object" ? s.class_id?._id : s?.class_id;
    return cId === selectedClassId;
  });

  // Fetch / initialize attendance records when class or date changes
  useEffect(() => {
    async function loadAttendance() {
      if (!selectedClassId || !date) return;
      const initial: typeof tempRecords = {};
      classStudents.forEach((student) => {
        initial[student._id] = "Present"; // default
      });

      const dbAttendance = await fetchAttendance(selectedClassId, date);
      if (dbAttendance && dbAttendance.records) {
        dbAttendance.records.forEach((rec) => {
          const sId = typeof rec.student_id === "object" ? rec.student_id._id : rec.student_id;
          const statusMap: Record<string, "Present" | "Absent" | "Late"> = {
            present: "Present",
            absent: "Absent",
            late: "Late",
          };
          initial[sId] = statusMap[rec.status] || "Present";
        });
      }
      setTempRecords(initial);
      setIsSaved(false);
    }
    loadAttendance();
  }, [selectedClassId, date, students]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleStatusChange = (studentId: string, status: "Present" | "Absent" | "Late") => {
    setTempRecords((prev) => ({
      ...prev,
      [studentId]: status
    }));
    setIsSaved(false);
  };

  const handleSave = async () => {
    const recordsArray = Object.entries(tempRecords).map(([studentId, status]) => ({
      studentId,
      status
    }));
    const res = await saveAttendance(selectedClassId, date, recordsArray);
    if (res.success) {
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
    } else {
      alert(res.message || "Failed to save attendance");
    }
  };

  const currentClass = classes.find((c) => c._id === selectedClassId) || classes[0];

  // Stats
  const total = classStudents.length;
  const present = Object.values(tempRecords).filter((status) => status === "Present").length;
  const late = Object.values(tempRecords).filter((status) => status === "Late").length;
  const absent = Object.values(tempRecords).filter((status) => status === "Absent").length;
  const attendanceRate = total > 0 ? Math.round(((present + late) / total) * 100) : 0;

  const isLoading = classesLoading || studentsLoading;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-left">
        <div>
          <h1 className="page-title">Attendance Register</h1>
          <p className="page-desc mt-1">
            Track and record student presence, tardiness, and leaves of absence.
          </p>
        </div>

        {/* Date and Class Selector Form */}
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2 bg-white dark:bg-slate-900 border border-border rounded-xl px-3.5 py-2 text-[13px] shadow-sm">
            <span className="font-bold text-slate-500 dark:text-slate-400 uppercase text-[11px] tracking-wider">Class:</span>
            <select
              value={selectedClassId}
              onChange={(e) => setSelectedClassId(e.target.value)}
              className="bg-transparent text-slate-900 dark:text-white outline-none cursor-pointer font-bold"
            >
              {classes.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name} - {c.section}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2 bg-white dark:bg-slate-900 border border-border rounded-xl px-3.5 py-2 text-[13px] shadow-sm">
            <span className="font-bold text-slate-500 dark:text-slate-400 uppercase text-[11px] tracking-wider">Date:</span>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="bg-transparent text-slate-900 dark:text-white outline-none cursor-pointer font-bold font-mono"
            />
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="py-20 flex flex-col items-center justify-center text-slate-500 dark:text-slate-400 gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-[#F59E0B]" />
          <span>Loading classes and student cohort...</span>
        </div>
      ) : (
        <>
          {/* Attendance Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            <div className="bg-white dark:bg-slate-900 border border-border rounded-xl p-5 card-shadow text-left">
              <div className="flex items-center justify-between">
                <span className="text-[11px] uppercase font-bold text-slate-500 dark:text-slate-400 tracking-wider">Total Cohort</span>
                <Clock className="w-4 h-4 text-slate-400 dark:text-slate-500" />
              </div>
              <span className="text-2xl font-bold text-slate-900 dark:text-white block mt-1">{total} Students</span>
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
                <span className="text-[11px] uppercase font-bold text-slate-500 dark:text-slate-400 tracking-wider">Late Arrivals</span>
                <Clock className="w-4 h-4 text-amber-500" />
              </div>
              <span className="text-2xl font-bold text-amber-600 block mt-1">{late} Late</span>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-border rounded-xl p-5 card-shadow text-left">
              <div className="flex items-center justify-between">
                <span className="text-[11px] uppercase font-bold text-slate-500 dark:text-slate-400 tracking-wider">Absences</span>
                <ShieldAlert className="w-4 h-4 text-rose-500" />
              </div>
              <span className="text-2xl font-bold text-rose-600 block mt-1">{absent} Absent</span>
            </div>
          </div>

          {/* Main Registry Table Panel */}
          <div className="bg-white dark:bg-slate-900 border border-border rounded-xl card-shadow overflow-hidden text-left">
            <div className="px-6 py-4 border-b border-border bg-slate-50/50 dark:bg-slate-800/50 flex items-center justify-between">
              <h2 className="text-[15px] font-semibold text-slate-900 dark:text-white">
                Attendance Register: {currentClass ? `${currentClass.name} - ${currentClass.section}` : ""} ({date})
              </h2>
              {isSaved && (
                <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full flex items-center gap-1 animate-pulse">
                  <Check className="w-3.5 h-3.5" /> State Persisted Successfully!
                </span>
              )}
            </div>

            <div className="overflow-x-auto bg-white dark:bg-slate-900">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="border-b border-border bg-white dark:bg-slate-900 text-[11px] uppercase font-bold text-slate-500 dark:text-slate-400 tracking-wider">
                    <th className="px-6 py-4">Roll No.</th>
                    <th className="px-6 py-4">Student Name</th>
                    <th className="px-6 py-4">Email Contact</th>
                    <th className="px-6 py-4 text-center">Status Registration</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border text-[13px]">
                  {attendanceLoading ? (
                    <tr>
                      <td colSpan={4} className="px-6 py-12 text-center text-slate-500 dark:text-slate-400">
                        <div className="flex items-center justify-center gap-2">
                          <Loader2 className="w-4 h-4 animate-spin text-[#F59E0B]" />
                          <span>Fetching attendance records...</span>
                        </div>
                      </td>
                    </tr>
                  ) : classStudents.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-6 py-12 text-center text-slate-500 dark:text-slate-400">
                        No students enrolled in this class.
                      </td>
                    </tr>
                  ) : (
                    classStudents.map((student) => {
                      const currentStatus = tempRecords[student._id] || "Present";
                      return (
                        <tr key={student._id} className="hover:bg-slate-50/50 dark:bg-slate-800/50 transition-colors">
                          <td className="px-6 py-4 font-mono font-semibold text-slate-500 dark:text-slate-400">
                            {student.roll_no || "N/A"}
                          </td>
                          <td className="px-6 py-4 font-bold text-slate-900 dark:text-white">
                            {student.name}
                          </td>
                          <td className="px-6 py-4 text-slate-500 dark:text-slate-400">
                            {student.guardian_email || "N/A"}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center justify-center gap-2">
                              {/* Present Button */}
                              <button
                                onClick={() => handleStatusChange(student._id, "Present")}
                                className={`px-3.5 py-1.5 rounded-lg border text-[12px] font-bold flex items-center gap-1.5 transition-all cursor-pointer ${currentStatus === "Present"
                                    ? "bg-emerald-50 border-emerald-300 text-emerald-700 shadow-sm"
                                    : "border-border text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                                  }`}
                              >
                                <Check className="w-3.5 h-3.5" />
                                <span>Present</span>
                              </button>

                              {/* Late Button */}
                              <button
                                onClick={() => handleStatusChange(student._id, "Late")}
                                className={`px-3.5 py-1.5 rounded-lg border text-[12px] font-bold flex items-center gap-1.5 transition-all cursor-pointer ${currentStatus === "Late"
                                    ? "bg-amber-50 border-amber-300 text-amber-700 shadow-sm"
                                    : "border-border text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                                  }`}
                              >
                                <Clock className="w-3.5 h-3.5" />
                                <span>Late</span>
                              </button>

                              {/* Absent Button */}
                              <button
                                onClick={() => handleStatusChange(student._id, "Absent")}
                                className={`px-3.5 py-1.5 rounded-lg border text-[12px] font-bold flex items-center gap-1.5 transition-all cursor-pointer ${currentStatus === "Absent"
                                    ? "bg-rose-50 border-rose-300 text-rose-700 shadow-sm"
                                    : "border-border text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800/50"
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
                <span className="text-[11px] text-slate-400 dark:text-slate-500 font-bold font-mono uppercase tracking-wider">
                  Syncing with MongoDB Database
                </span>
                <button
                  onClick={handleSave}
                  disabled={attendanceLoading}
                  className="flex items-center gap-2 px-5 py-2.5 text-[13px] font-semibold text-white bg-[#F59E0B] hover:bg-[#D97706] rounded-lg shadow-sm transition-colors cursor-pointer disabled:opacity-50"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Save & Sync Register</span>
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
