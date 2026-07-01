"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useSchedules } from "../../../hooks/useSchedules";
import { useClasses } from "../../../hooks/useClasses";
import { useTeachers } from "../../../hooks/useTeachers";
import { useSubjects } from "../../../hooks/useSubjects";
import { useAuth } from "../../../context/auth";
import { 
  Plus, Search, Edit, Trash2,
  Calendar, ChevronDown, RefreshCw, Loader2, Clock, MapPin, User, BookOpen
} from "lucide-react";
import { Modal } from "../../../components/ui/modal";

export default function SchedulePage() {
  const { user } = useAuth();
  const isAdmin = user?.role === "school_admin" || user?.role === "super_admin";
  const { classes, isLoading: classesLoading } = useClasses();
  const { teachers, isLoading: teachersLoading } = useTeachers();

  const [selectedTeacherId, setSelectedTeacherId] = useState<string>("");

  // Hook to fetch schedules filtered by teacher
  const { schedules, isLoading: schedulesLoading, fetchSchedules, createSchedule, updateSchedule, deleteSchedule } = useSchedules(
    undefined, 
    selectedTeacherId || undefined
  );

  const [searchTerm, setSearchTerm] = useState("");
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedScheduleId, setSelectedScheduleId] = useState<string | null>(null);

  // Form states
  const [formClassId, setFormClassId] = useState("");
  const [formSubject, setFormSubject] = useState("");
  const [formTeacherId, setFormTeacherId] = useState("");
  const [formDay, setFormDay] = useState("Monday");
  const [formStartTime, setFormStartTime] = useState("09:30 AM");
  const [formEndTime, setFormEndTime] = useState("10:30 AM");
  const [formRoom, setFormRoom] = useState("101");
  const [formPeriodNo, setFormPeriodNo] = useState("");

  // Fetch dynamic subjects based on selected class
  const { subjects: availableSubjects } = useSubjects(formClassId);

  // Generate time slots (every 15 mins from 7 AM to 6 PM)
  const timeSlots = [];
  for (let h = 7; h <= 18; h++) {
    for (let m = 0; m < 60; m += 15) {
      const period = h >= 12 ? 'PM' : 'AM';
      let hour = h > 12 ? h - 12 : h;
      if (hour === 0) hour = 12;
      timeSlots.push(`${hour.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')} ${period}`);
    }
  }

  // Set default teacher filter for logged-in teacher
  useEffect(() => {
    if (teachers.length > 0 && !selectedTeacherId) {
      if (user?.role === "teacher") {
        const matchingTeacher = teachers.find(t => {
          const tUserId = typeof t.user_id === "object" && t.user_id !== null ? t.user_id._id : t.user_id;
          return tUserId === user?.id;
        });
        if (matchingTeacher) {
          setSelectedTeacherId(matchingTeacher._id);
        }
      }
    }
  }, [teachers, user, selectedTeacherId]);

  useEffect(() => {
    if (classes.length > 0 && !formClassId) {
      setFormClassId(classes[0]._id);
    }
  }, [classes, formClassId]);

  useEffect(() => {
    if (teachers.length > 0 && !formTeacherId) {
      setFormTeacherId(teachers[0]._id);
    }
  }, [teachers, formTeacherId]);

  const openAddModal = () => {
    if (classes.length > 0) setFormClassId(classes[0]._id);
    if (teachers.length > 0) setFormTeacherId(teachers[0]._id);
    setFormSubject("");
    setFormDay("Monday");
    setFormStartTime("09:30 AM");
    setFormEndTime("10:30 AM");
    setFormRoom("101");
    setFormPeriodNo("");
    setIsAddOpen(true);
  };

  const openEditModal = (schedule: any) => {
    setSelectedScheduleId(schedule._id);
    setFormClassId(typeof schedule.class_id === "object" ? schedule.class_id._id : schedule.class_id || "");
    setFormTeacherId(typeof schedule.teacher_id === "object" ? schedule.teacher_id._id : schedule.teacher_id || "");
    setFormSubject(typeof schedule.subject_id === "object" ? schedule.subject_id._id : schedule.subject_id || "");
    setFormDay(schedule.day.charAt(0).toUpperCase() + schedule.day.slice(1));
    setFormStartTime(schedule.start_time);
    setFormEndTime(schedule.end_time);
    setFormRoom(schedule.room || "");
    setFormPeriodNo(schedule.period_no ? schedule.period_no.toString() : "");
    setIsEditOpen(true);
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await createSchedule({
      classId: formClassId,
      subject: formSubject,
      teacherId: formTeacherId,
      day: formDay,
      startTime: formStartTime,
      endTime: formEndTime,
      room: formRoom,
      periodNo: formPeriodNo ? parseInt(formPeriodNo, 10) : undefined
    });
    if (res.success) {
      setIsAddOpen(false);
    } else {
      alert(res.message || "Failed to create schedule");
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedScheduleId) return;
    const res = await updateSchedule(selectedScheduleId, {
      classId: formClassId,
      subject: formSubject,
      teacherId: formTeacherId,
      day: formDay,
      startTime: formStartTime,
      endTime: formEndTime,
      room: formRoom,
      periodNo: formPeriodNo ? parseInt(formPeriodNo, 10) : undefined
    });
    if (res.success) {
      setIsEditOpen(false);
    } else {
      alert(res.message || "Failed to save schedule");
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this schedule?")) {
      const res = await deleteSchedule(id);
      if (!res.success) {
        alert(res.message || "Failed to delete schedule");
      }
    }
  };

  const getClassName = (c: any) => {
    if (typeof c === "object" && c !== null) {
      return `${c.name} - ${c.section}`;
    }
    return classes.find(item => item._id === c)?.name || "N/A";
  };

  const getTeacherName = (t: any) => {
    if (typeof t === "object" && t !== null) {
      return t.name;
    }
    return teachers.find(item => item._id === t)?.name || "N/A";
  };

  const getSubjectName = (s: any) => {
    if (typeof s === "object" && s !== null) {
      return s.name;
    }
    return s || "N/A";
  };

  const getSubjectColor = (subjectName: string) => {
    const colors = [
      "border-l-4 border-l-rose-500 bg-rose-50/50 dark:bg-rose-950/20 text-rose-700 dark:text-rose-300",
      "border-l-4 border-l-blue-500 bg-blue-50/50 dark:bg-blue-950/20 text-blue-700 dark:text-blue-300",
      "border-l-4 border-l-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-300",
      "border-l-4 border-l-violet-500 bg-violet-50/50 dark:bg-violet-950/20 text-violet-700 dark:text-violet-300",
      "border-l-4 border-l-amber-500 bg-amber-50/50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-300",
      "border-l-4 border-l-cyan-500 bg-cyan-50/50 dark:bg-cyan-950/20 text-cyan-700 dark:text-cyan-300",
    ];
    let hash = 0;
    for (let i = 0; i < subjectName.length; i++) {
      hash = subjectName.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  };

  const DAYS_OF_WEEK = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  const parseTimeToMinutes = (t: string): number => {
    const match = t.trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
    if (!match) return 0;
    let [, h, m, period] = match;
    let hours = parseInt(h, 10);
    const mins = parseInt(m, 10);
    if (period.toUpperCase() === "PM" && hours !== 12) hours += 12;
    if (period.toUpperCase() === "AM" && hours === 12) hours = 0;
    return hours * 60 + mins;
  };

  const filteredSchedules = schedules.filter(s => {
    const sName = getSubjectName(s.subject_id).toLowerCase();
    const cName = getClassName(s.class_id).toLowerCase();
    const tName = getTeacherName(s.teacher_id).toLowerCase();
    const sId = s._id.toLowerCase();
    const search = searchTerm.toLowerCase();

    return sId.includes(search) || sName.includes(search) || cName.includes(search) || tName.includes(search);
  });

  // Group schedules by weekday
  const groupedSchedules = DAYS_OF_WEEK.reduce((acc, day) => {
    const daySchedules = filteredSchedules.filter(
      s => s.day.toLowerCase() === day.toLowerCase()
    );
    // Sort schedules chronologically by start time, and secondarily by period number
    daySchedules.sort((a, b) => {
      if (a.period_no !== undefined && b.period_no !== undefined && a.period_no !== b.period_no) {
        return a.period_no - b.period_no;
      }
      return parseTimeToMinutes(a.start_time) - parseTimeToMinutes(b.start_time);
    });
    acc[day] = daySchedules;
    return acc;
  }, {} as Record<string, typeof filteredSchedules>);

  const hasAnySchedules = filteredSchedules.length > 0;
  const isLoading = classesLoading || teachersLoading || schedulesLoading;

  return (
    <div className="space-y-6 bg-[#F8FAFC] dark:bg-[var(--sidebar-bg)] min-h-screen -m-6 p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="text-left">
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">My Routines</h1>
          <div className="flex items-center gap-2 text-[13px] text-slate-500 dark:text-slate-400 mt-1">
            <span>Dashboard</span>
            <span>/</span>
            <Link href="/classes" className="hover:text-primary">Classes</Link>
            <span>/</span>
            <span className="text-slate-900 dark:text-white font-medium">My Routines</span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button 
            onClick={() => fetchSchedules(undefined, selectedTeacherId || undefined)} 
            className="w-9 h-9 rounded-full bg-white dark:bg-slate-900 border border-border flex items-center justify-center text-slate-500 dark:text-slate-400 hover:text-primary hover:bg-primary/10 transition-colors shadow-sm cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          {isAdmin && (
            <button 
              onClick={openAddModal}
              className="px-4 py-2 bg-primary hover:bg-[var(--primary-hover)] text-white text-[13px] font-semibold rounded-lg flex items-center gap-2 transition-colors shadow-sm cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Add Routine
            </button>
          )}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-slate-900 border border-border rounded-xl shadow-sm p-4 text-left">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            {/* Teacher Select Filter */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Filter By Teacher</label>
              <div className="relative min-w-[200px]">
                <select
                  value={selectedTeacherId}
                  onChange={(e) => setSelectedTeacherId(e.target.value)}
                  className="w-full pl-3 pr-10 py-2 text-[13px] bg-[#F8FAFC] dark:bg-slate-800 border border-border rounded-lg outline-none focus:border-primary transition-colors appearance-none text-slate-700 dark:text-slate-200 cursor-pointer"
                >
                  <option value="">All Teachers</option>
                  {teachers.map(t => (
                    <option key={t._id} value={t._id}>{t.name}</option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
          </div>

          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Search routines" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2 w-full sm:w-[260px] bg-[#F8FAFC] dark:bg-slate-800 border border-border rounded-lg text-[13px] outline-none focus:border-primary transition-colors text-left"
            />
          </div>
        </div>
      </div>

      {/* Routine Timetable Grid */}
      <div>
        {isLoading ? (
          <div className="py-20 flex flex-col items-center justify-center text-slate-500 gap-2 dark:text-slate-400 bg-white dark:bg-slate-900 border border-border rounded-xl shadow-sm">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <span>Fetching routines data...</span>
          </div>
        ) : !hasAnySchedules ? (
          <div className="py-20 flex flex-col items-center justify-center text-slate-500 gap-3 dark:text-slate-400 bg-white dark:bg-slate-900 border border-border rounded-xl shadow-sm text-center px-4">
            <Calendar className="w-12 h-12 text-slate-300 dark:text-slate-700 animate-pulse" />
            <h3 className="font-bold text-slate-700 dark:text-slate-300">No Routines Found</h3>
            <p className="text-[13px] text-slate-400 max-w-[320px]">
              {selectedTeacherId 
                ? "This teacher doesn't have any classes scheduled yet." 
                : "No schedule routines mapped yet. Click 'Add Routine' to start planning."}
            </p>
          </div>
        ) : (
          <div className="space-y-8 text-left">
            {DAYS_OF_WEEK.map((day) => {
              const routines = groupedSchedules[day];
              if (routines.length === 0) return null;

              return (
                <div key={day} className="space-y-4">
                  <div className="flex items-center gap-2.5 pb-1.5 border-b border-border">
                    <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">{day}</h3>
                    <span className="px-2 py-0.5 text-[11px] font-bold bg-primary/10 text-primary rounded-full">
                      {routines.length} {routines.length === 1 ? "Class" : "Classes"}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {routines.map((schedule) => {
                      const subjectName = getSubjectName(schedule.subject_id);
                      const colorClass = getSubjectColor(subjectName);

                      return (
                        <div 
                          key={schedule._id} 
                          className={`relative rounded-xl border border-border p-4 transition-all duration-300 hover:scale-[1.02] hover:shadow-md ${colorClass}`}
                        >
                          <div className="flex items-start justify-between gap-3 mb-2">
                            <div>
                              <h4 className="text-base font-bold tracking-tight">{subjectName}</h4>
                              <p className="text-[13px] font-bold opacity-90 mt-0.5">{getClassName(schedule.class_id)}</p>
                            </div>
                            
                            {/* Actions & Period */}
                            <div className="flex items-center gap-2">
                              {schedule.period_no && (
                                <span className="px-2 py-0.5 text-[11px] font-bold bg-white/70 dark:bg-black/20 rounded-full border border-black/5 dark:border-white/5">
                                  P{schedule.period_no}
                                </span>
                              )}
                              {isAdmin && (
                                <div className="flex items-center gap-1 bg-white/70 dark:bg-black/20 rounded-lg p-0.5 border border-black/5 dark:border-white/5">
                                  <button 
                                    onClick={() => openEditModal(schedule)}
                                    className="p-1 text-slate-500 hover:text-primary rounded hover:bg-slate-100/50 dark:hover:bg-slate-800/50 cursor-pointer"
                                    title="Edit"
                                  >
                                    <Edit className="w-3.5 h-3.5" />
                                  </button>
                                  <button 
                                    onClick={() => handleDelete(schedule._id)}
                                    className="p-1 text-slate-500 hover:text-rose-500 rounded hover:bg-slate-100/50 dark:hover:bg-slate-800/50 cursor-pointer"
                                    title="Delete"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="space-y-2.5 pt-2.5 border-t border-black/5 dark:border-white/5 text-[13px] text-slate-600 dark:text-slate-300">
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4 text-slate-400 shrink-0" />
                              <span className="font-mono font-semibold">{schedule.start_time} - {schedule.end_time}</span>
                            </div>

                            <div className="flex items-center justify-between gap-4">
                              <div className="flex items-center gap-2">
                                <User className="w-4 h-4 text-slate-400 shrink-0" />
                                <span className="truncate max-w-[120px]">{getTeacherName(schedule.teacher_id)}</span>
                              </div>

                              <div className="flex items-center gap-2">
                                <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                                <span>Room {schedule.room || "N/A"}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Add / Edit Modals */}
      <Modal isOpen={isAddOpen || isEditOpen} onClose={() => { setIsAddOpen(false); setIsEditOpen(false); }} title={isAddOpen ? "Add Routine" : "Edit Routine"}>
        <form onSubmit={isAddOpen ? handleAddSubmit : handleEditSubmit} className="p-6 space-y-5 text-left">
          
          <div className="space-y-1.5">
            <label className="text-[13px] font-bold text-slate-800 dark:text-slate-100">Class</label>
            <div className="relative">
              <select 
                value={formClassId}
                onChange={(e) => setFormClassId(e.target.value)}
                className="w-full px-4 py-2.5 text-[14px] bg-white dark:bg-slate-900 border border-border rounded-lg outline-none focus:border-primary transition-colors appearance-none text-slate-700 dark:text-slate-200 cursor-pointer"
                required
              >
                {classes.map(c => <option key={c._id} value={c._id}>{c.name} - {c.section}</option>)}
              </select>
              <ChevronDown className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[13px] font-bold text-slate-800 dark:text-slate-100">Subject</label>
            <div className="relative">
              <select 
                value={formSubject}
                onChange={(e) => setFormSubject(e.target.value)}
                className="w-full px-4 py-2.5 text-[14px] bg-white dark:bg-slate-900 border border-border rounded-lg outline-none focus:border-primary transition-colors appearance-none text-slate-700 dark:text-slate-200 cursor-pointer disabled:opacity-50"
                required
                disabled={!formClassId || availableSubjects.length === 0}
              >
                <option value="">Select Subject</option>
                {availableSubjects.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
              </select>
              <ChevronDown className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[13px] font-bold text-slate-800 dark:text-slate-100">Teacher</label>
            <div className="relative">
              <select 
                value={formTeacherId}
                onChange={(e) => setFormTeacherId(e.target.value)}
                className="w-full px-4 py-2.5 text-[14px] bg-white dark:bg-slate-900 border border-border rounded-lg outline-none focus:border-primary transition-colors appearance-none text-slate-700 dark:text-slate-200 cursor-pointer"
                required
              >
                {teachers.map(t => <option key={t._id} value={t._id}>{t.name}</option>)}
              </select>
              <ChevronDown className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[13px] font-bold text-slate-800 dark:text-slate-100">Day</label>
              <div className="relative">
                <select 
                  value={formDay}
                  onChange={(e) => setFormDay(e.target.value)}
                  className="w-full px-4 py-2.5 text-[14px] bg-white dark:bg-slate-900 border border-border rounded-lg outline-none focus:border-primary transition-colors appearance-none text-slate-700 dark:text-slate-200 cursor-pointer"
                  required
                >
                  {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map(d => <option key={d} value={d}>{d}</option>)}
                </select>
                <ChevronDown className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[13px] font-bold text-slate-800 dark:text-slate-100">Period Number</label>
              <input 
                type="number" 
                min="1"
                max="20"
                value={formPeriodNo} 
                onChange={(e) => setFormPeriodNo(e.target.value)} 
                placeholder="e.g. 1, 2, 3"
                className="w-full px-4 py-2.5 text-[14px] bg-white dark:bg-slate-900 border border-border rounded-lg outline-none focus:border-primary transition-colors text-slate-700 dark:text-slate-200" 
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[13px] font-bold text-slate-800 dark:text-slate-100">Start Time</label>
              <div className="relative">
                <select 
                  value={formStartTime}
                  onChange={(e) => setFormStartTime(e.target.value)}
                  className="w-full px-4 py-2.5 text-[14px] bg-white dark:bg-slate-900 border border-border rounded-lg outline-none focus:border-primary transition-colors appearance-none text-slate-700 dark:text-slate-200 cursor-pointer font-mono"
                  required
                >
                  <option value="">Select Start Time</option>
                  {timeSlots.map(t => <option key={`start-${t}`} value={t}>{t}</option>)}
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
                  className="w-full px-4 py-2.5 text-[14px] bg-white dark:bg-slate-900 border border-border rounded-lg outline-none focus:border-primary transition-colors appearance-none text-slate-700 dark:text-slate-200 cursor-pointer font-mono"
                  required
                >
                  <option value="">Select End Time</option>
                  {timeSlots.map(t => <option key={`end-${t}`} value={t}>{t}</option>)}
                </select>
                <ChevronDown className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[13px] font-bold text-slate-800 dark:text-slate-100">Class Room / Room No</label>
            <input 
              type="text" 
              value={formRoom} 
              onChange={(e) => setFormRoom(e.target.value)} 
              placeholder="e.g. 101"
              className="w-full px-4 py-2.5 text-[14px] bg-white dark:bg-slate-900 border border-border rounded-lg outline-none focus:border-primary transition-colors text-slate-700 dark:text-slate-200" 
            />
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
              className="px-6 py-2.5 bg-primary text-white text-[14px] font-bold rounded-lg hover:bg-[var(--primary-hover)] transition-colors shadow-sm cursor-pointer"
            >
              {isAddOpen ? "Add Routine" : "Save Changes"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
