"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAppState } from "../context/store";
import { LineChart, BarChart, DoughnutChart } from "../components/ui/charts";
import {
  Plus,
  ArrowRight,
  TrendingUp,
  Percent,
  CheckCircle2,
  CalendarDays,
  X,
  RefreshCcw,
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Award,
  Clock,
  BookOpen,
  DollarSign,
  FileText,
  UserCheck,
  Megaphone,
  Users,
  Share2,
  ChevronDown,
  Building2
} from "lucide-react";

export default function DashboardPage() {
  const {
    activeRole,
    students,
    teachers,
    classes,
    attendance,
    homework,
    grades,
    fees,
    notices
  } = useAppState();

  const [showAlert, setShowAlert] = useState(true);

  // ----------------------------------------------------
  // ADMIN DASHBOARD CALCULATIONS
  // ----------------------------------------------------
  const totalStudents = students.length;
  const totalTeachers = teachers.length;
  const totalClasses = classes.length;

  const totalRevenue = fees
    .filter((f) => f.status === "Paid")
    .reduce((acc, curr) => acc + curr.amount, 0);

  // ----------------------------------------------------
  // TEACHER & STUDENT LOGIC (Kept intact for multi-role support)
  // ----------------------------------------------------
  const teacher = teachers[0] || { id: "t1", name: "Sarah Jenkins", subject: "English", classId: "c1" };
  const assignedClass = classes.find((c) => c.teacherId === teacher.id) || classes[0];
  const classStudents = students.filter((s) => s.classId === assignedClass?.id);

  const todayDate = "2026-06-05";
  const todayAttendanceRecords = classStudents.map((s) => attendance[s.id]?.[todayDate]).filter(Boolean);
  const presentCount = todayAttendanceRecords.filter((status) => status === "Present" || status === "Late").length;
  const todayAttendanceRate = todayAttendanceRecords.length > 0
    ? Math.round((presentCount / todayAttendanceRecords.length) * 100)
    : 90;

  const classHomework = homework.filter((h) => h.classId === assignedClass?.id);
  const pendingSubmissions = classHomework.reduce((acc, curr) => {
    const ungraded = curr.submissions.filter((sub) => !sub.grade).length;
    return acc + ungraded;
  }, 0);

  const classGradeStats = [
    { label: "English", value: 87 },
    { label: "Mathematics", value: 81 },
    { label: "Science", value: 83 },
    { label: "History", value: 85 }
  ];

  const student = students[0] || { id: "s1", name: "Alex Rivera", classId: "c1" };
  const studentAttLog = attendance[student.id] || {};
  const totalAttDays = Object.keys(studentAttLog).length;
  const presentAttDays = Object.values(studentAttLog).filter((s) => s === "Present" || s === "Late").length;
  const studentAttendanceRate = totalAttDays > 0 ? Math.round((presentAttDays / totalAttDays) * 100) : 95;

  const studentHwList = homework.filter((h) => h.classId === student.classId);
  const studentSubmissions = studentHwList.filter((hw) =>
    hw.submissions.some((sub) => sub.studentId === student.id)
  ).length;
  const pendingHwCount = studentHwList.length - studentSubmissions;

  const studentGrades = grades.filter((g) => g.studentId === student.id);
  const averageGrade = studentGrades.length > 0
    ? Math.round(studentGrades.reduce((acc, curr) => acc + (curr.score / curr.maxScore) * 100, 0) / studentGrades.length)
    : 88;

  const studentPendingFees = fees
    .filter((f) => f.studentId === student.id && (f.status === "Unpaid" || f.status === "Overdue"))
    .reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto">
      {/* ----------------------------------------------------
          GLOBAL PAGE HEADER
          ---------------------------------------------------- */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="text-left">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            {activeRole === "admin"
              ? "Admin Dashboard"
              : activeRole === "teacher"
                ? "Teacher Dashboard"
                : "Student Dashboard"}
          </h1>
          <div className="flex items-center gap-2 text-[13px] text-slate-500 dark:text-slate-400 mt-1">
            <span>Dashboard</span>
            <span>/</span>
            <span className="text-slate-700 dark:text-slate-200">
              {activeRole === "admin"
                ? "Admin Dashboard"
                : activeRole === "teacher"
                  ? "Teacher Overview"
                  : "Student Overview"}
            </span>
          </div>
        </div>

        {/* Action Panel */}
        <div className="flex items-center gap-3">
          {activeRole === "admin" && (
            <>
              <Link
                href="/dashboard/students"
                className="flex items-center gap-2 px-4 py-2 text-[13px] font-semibold text-white bg-[#F59E0B] hover:bg-[#D97706] rounded-lg shadow-sm transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Student</span>
              </Link>
              <Link
                href="/dashboard/fees"
                className="flex items-center gap-2 px-4 py-2 text-[13px] font-semibold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
              >
                <span>Fees Details</span>
              </Link>
            </>
          )}
          {activeRole === "teacher" && (
            <Link
              href="/dashboard/attendance"
              className="flex items-center gap-2 px-4 py-2 text-[13px] font-semibold text-white bg-primary hover:bg-primary/90 rounded-lg shadow-sm transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Mark Attendance</span>
            </Link>
          )}
          {activeRole === "student" && (
            <Link
              href="/dashboard/homework"
              className="flex items-center gap-2 px-4 py-2 text-[13px] font-semibold text-white bg-primary hover:bg-primary/90 rounded-lg shadow-sm transition-colors cursor-pointer"
            >
              <span>View Homework</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          )}
        </div>
      </div>

      {/* ----------------------------------------------------
          ADMIN VIEW
          ---------------------------------------------------- */}
      {activeRole === "admin" && (
        <div className="space-y-6">
          {/* Notification Alert Banner */}
          {showAlert && (
            <div className="flex items-center justify-between bg-[#E8F8E8] border border-[#BDE8B5] text-[#1D7F2C] rounded-full px-4 py-2 shadow-sm text-left">
              <div className="flex items-center gap-3">
                <img src="/asset 14.webp" alt="Avatar" className="w-7 h-7 rounded-full bg-white dark:bg-slate-900 object-cover" />
                <p className="text-[13px]">
                  Fahed III,C has paid Fees for the <span className="font-bold">"Term1"</span>
                </p>
              </div>
              <button onClick={() => setShowAlert(false)} className="p-1 hover:bg-[#D1EFCF] rounded-full transition-colors text-[#5EA866]">
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Welcome Banner */}
          <div className="relative overflow-hidden bg-[#262D4A] rounded-xl text-white p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between text-left card-shadow">
            {/* Background elements mockup */}
            <div className="absolute top-0 right-0 w-full h-full opacity-20 pointer-events-none" style={{ backgroundImage: "url('/asset 11.svg')", backgroundSize: "cover", backgroundPosition: "center right" }}></div>

            <div className="relative z-10">
              <h2 className="text-2xl font-semibold flex items-center gap-3">
                Welcome Back, Mr. Herald
                <span className="bg-white/10 p-1.5 rounded-lg border border-white/20">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white"><path d="M12 20h9" /><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" /></svg>
                </span>
              </h2>
              <p className="text-[13px] text-slate-300 mt-2">Have a Good day at work</p>
            </div>
            <div className="relative z-10 mt-4 md:mt-0 flex items-center gap-1.5 text-[12px] text-slate-300 bg-black/20 px-4 py-2 rounded-lg">
              <RefreshCcw className="w-3.5 h-3.5" />
              <span>Updated Recently on 15 Jun 2024</span>
            </div>
          </div>

          {/* Top Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* Students Card */}
            <div className="bg-white dark:bg-slate-900 border border-border rounded-xl p-5 card-shadow flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <img src="/asset 7.webp" alt="Students" className="w-[52px] h-[52px] object-contain" />
                  <div className="text-left">
                    <h3 className="text-2xl font-semibold text-slate-900 dark:text-white leading-none">3654</h3>
                    <p className="text-[13px] text-slate-500 dark:text-slate-400 mt-1">Total Students</p>
                  </div>
                </div>
                <span className="bg-[#FF4A6B] text-white text-[10px] font-bold px-2 py-0.5 rounded">1.2%</span>
              </div>
              <div className="flex items-center justify-between text-[12px] pt-4 border-t border-slate-100 dark:border-slate-800/50">
                <span className="text-slate-500 dark:text-slate-400">Active : <strong className="text-slate-900 dark:text-white">3643</strong></span>
                <span className="text-slate-300">|</span>
                <span className="text-slate-500 dark:text-slate-400">Inactive : <strong className="text-slate-900 dark:text-white">11</strong></span>
              </div>
            </div>

            {/* Teachers Card */}
            <div className="bg-white dark:bg-slate-900 border border-border rounded-xl p-5 card-shadow flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <img src="/asset 8.webp" alt="Teachers" className="w-[52px] h-[52px] object-contain" />
                  <div className="text-left">
                    <h3 className="text-2xl font-semibold text-slate-900 dark:text-white leading-none">284</h3>
                    <p className="text-[13px] text-slate-500 dark:text-slate-400 mt-1">Total Teachers</p>
                  </div>
                </div>
                <span className="bg-[#00B5FF] text-white text-[10px] font-bold px-2 py-0.5 rounded">1.2%</span>
              </div>
              <div className="flex items-center justify-between text-[12px] pt-4 border-t border-slate-100 dark:border-slate-800/50">
                <span className="text-slate-500 dark:text-slate-400">Active : <strong className="text-slate-900 dark:text-white">254</strong></span>
                <span className="text-slate-300">|</span>
                <span className="text-slate-500 dark:text-slate-400">Inactive : <strong className="text-slate-900 dark:text-white">30</strong></span>
              </div>
            </div>

            {/* Staff Card */}
            <div className="bg-white dark:bg-slate-900 border border-border rounded-xl p-5 card-shadow flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <img src="/asset 9.webp" alt="Staff" className="w-[52px] h-[52px] object-contain" />
                  <div className="text-left">
                    <h3 className="text-2xl font-semibold text-slate-900 dark:text-white leading-none">162</h3>
                    <p className="text-[13px] text-slate-500 dark:text-slate-400 mt-1">Total Staff</p>
                  </div>
                </div>
                <span className="bg-[#FFB800] text-white text-[10px] font-bold px-2 py-0.5 rounded">1.2%</span>
              </div>
              <div className="flex items-center justify-between text-[12px] pt-4 border-t border-slate-100 dark:border-slate-800/50">
                <span className="text-slate-500 dark:text-slate-400">Active : <strong className="text-slate-900 dark:text-white">161</strong></span>
                <span className="text-slate-300">|</span>
                <span className="text-slate-500 dark:text-slate-400">Inactive : <strong className="text-slate-900 dark:text-white">02</strong></span>
              </div>
            </div>

            {/* Subjects Card */}
            <div className="bg-white dark:bg-slate-900 border border-border rounded-xl p-5 card-shadow flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <img src="/asset 10.webp" alt="Subjects" className="w-[52px] h-[52px] object-contain" />
                  <div className="text-left">
                    <h3 className="text-2xl font-semibold text-slate-900 dark:text-white leading-none">82</h3>
                    <p className="text-[13px] text-slate-500 dark:text-slate-400 mt-1">Total Subjects</p>
                  </div>
                </div>
                <span className="bg-[#1DD04A] text-white text-[10px] font-bold px-2 py-0.5 rounded">1.2%</span>
              </div>
              <div className="flex items-center justify-between text-[12px] pt-4 border-t border-slate-100 dark:border-slate-800/50">
                <span className="text-slate-500 dark:text-slate-400">Active : <strong className="text-slate-900 dark:text-white">81</strong></span>
                <span className="text-slate-300">|</span>
                <span className="text-slate-500 dark:text-slate-400">Inactive : <strong className="text-slate-900 dark:text-white">01</strong></span>
              </div>
            </div>
          </div>

          {/* 3-Column Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* COLUMN 1: Schedules & Upcoming Events */}
            <div className="space-y-6">
              {/* Schedules Card */}
              <div className="bg-white dark:bg-slate-900 border border-border rounded-xl p-6 card-shadow flex flex-col">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-[15px] font-semibold text-slate-900 dark:text-white">Schedules</h3>
                  <button className="text-[12px] font-semibold text-[#F59E0B] flex items-center gap-1 hover:text-[#D97706]">
                    <Plus className="w-3.5 h-3.5" />
                    Add New
                  </button>
                </div>

                {/* Mock Calendar */}
                <div className="w-full text-center">
                  <div className="flex items-center justify-between mb-4 px-2">
                    <button className="p-1 hover:bg-slate-100 dark:bg-slate-800 rounded text-slate-400 dark:text-slate-500">
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <span className="font-bold text-[14px] text-slate-900 dark:text-white">June 2026</span>
                    <button className="p-1 hover:bg-slate-100 dark:bg-slate-800 rounded text-slate-400 dark:text-slate-500">
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="grid grid-cols-7 gap-1 text-[12px] font-semibold text-slate-900 dark:text-white mb-2">
                    <div>Su</div><div>Mo</div><div>Tu</div><div>We</div><div>Th</div><div>Fr</div><div>Sa</div>
                  </div>
                  <div className="grid grid-cols-7 gap-1 text-[13px] text-slate-600 dark:text-slate-300">
                    <div className="p-2 text-slate-400 dark:text-slate-500">31</div>
                    <div className="p-2">1</div><div className="p-2">2</div><div className="p-2">3</div>
                    <div className="p-2">4</div><div className="p-2">5</div><div className="p-2">6</div>
                    <div className="p-2 bg-[#F59E0B] text-white rounded-lg font-bold shadow-sm">7</div>
                    <div className="p-2">8</div><div className="p-2">9</div><div className="p-2">10</div>
                    <div className="p-2">11</div><div className="p-2">12</div><div className="p-2">13</div>
                    <div className="p-2">14</div><div className="p-2">15</div><div className="p-2">16</div>
                    <div className="p-2">17</div><div className="p-2">18</div><div className="p-2">19</div>
                    <div className="p-2">20</div>
                  </div>
                </div>
              </div>

              {/* Upcoming Events Card */}
              <div className="bg-white dark:bg-slate-900 border border-border rounded-xl p-6 card-shadow flex flex-col  text-left">
                <h3 className="text-[15px] font-semibold text-slate-900 dark:text-white mb-5">Upcoming Events</h3>
                <div className="space-y-4">

                  {/* Event 1 */}
                  <div className="relative pl-4 border-l-2 border-[#00B5FF] py-1">
                    <div className="flex gap-3">
                      <div className="w-10 h-10 rounded-lg bg-[#E6F8FF] text-[#00B5FF] flex items-center justify-center shrink-0">
                        <UserCheck className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-[13px] font-semibold text-slate-900 dark:text-white">Parents, Teacher Meet</h4>
                        <div className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                          <CalendarIcon className="w-3.5 h-3.5" /> 15 July 2024
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400">
                        <Clock className="w-3.5 h-3.5" /> 09:10AM - 10:50PM
                      </div>
                      <div className="flex -space-x-2">
                        <img className="w-6 h-6 rounded-full border-2 border-white object-cover" src="/asset 12.webp" alt="" />
                        <img className="w-6 h-6 rounded-full border-2 border-white object-cover" src="/asset 13.webp" alt="" />
                        <img className="w-6 h-6 rounded-full border-2 border-white object-cover" src="/asset 14.webp" alt="" />
                      </div>
                    </div>
                  </div>

                  {/* Event 2 */}
                  <div className="relative pl-4 border-l-2 border-[#00B5FF] py-1">
                    <div className="flex gap-3">
                      <div className="w-10 h-10 rounded-lg bg-[#E6F8FF] text-[#00B5FF] flex items-center justify-center shrink-0">
                        <UserCheck className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-[13px] font-semibold text-slate-900 dark:text-white">Parents, Teacher Meet</h4>
                        <div className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                          <CalendarIcon className="w-3.5 h-3.5" /> 15 July 2024
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400">
                        <Clock className="w-3.5 h-3.5" /> 09:10AM - 10:50PM
                      </div>
                      <div className="flex -space-x-2">
                        <img className="w-6 h-6 rounded-full border-2 border-white object-cover" src="/asset 12.webp" alt="" />
                        <img className="w-6 h-6 rounded-full border-2 border-white object-cover" src="/asset 13.webp" alt="" />
                        <img className="w-6 h-6 rounded-full border-2 border-white object-cover" src="/asset 14.webp" alt="" />
                      </div>
                    </div>
                  </div>

                  {/* Event 3 */}
                  <div className="relative pl-4 border-l-2 border-[#FF4A6B] py-1">
                    <div className="flex gap-3">
                      <div className="w-10 h-10 rounded-lg bg-[#FFEBF0] text-[#FF4A6B] flex items-center justify-center shrink-0">
                        <UserCheck className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-[13px] font-semibold text-slate-900 dark:text-white">Vacation Meeting</h4>
                        <div className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                          <CalendarIcon className="w-3.5 h-3.5" /> 07 July 2024 - 07 July 2024
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400">
                        <Clock className="w-3.5 h-3.5" /> 09:10AM - 10:50PM
                      </div>
                      <div className="flex -space-x-2">
                        <img className="w-6 h-6 rounded-full border-2 border-white object-cover" src="/asset 12.webp" alt="" />
                        <img className="w-6 h-6 rounded-full border-2 border-white object-cover" src="/asset 13.webp" alt="" />
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </div>

            {/* COLUMN 2: Attendance & Performers */}
            <div className="space-y-6">
              {/* Attendance Card */}
              <div className="bg-white dark:bg-slate-900 border border-border rounded-xl p-6 card-shadow flex flex-col text-left">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-[15px] font-semibold text-slate-900 dark:text-white">Attendance</h3>
                  <button className="text-[12px] font-medium text-slate-500 dark:text-slate-400 flex items-center gap-1">
                    <CalendarIcon className="w-3.5 h-3.5" /> Today <span className="ml-1 text-[10px]">▼</span>
                  </button>
                </div>

                {/* Tabs */}
                <div className="flex items-center gap-6 border-b border-border text-[13px]">
                  <span className="font-semibold text-[#F59E0B] border-b-2 border-[#F59E0B] pb-2 px-1">Students</span>
                  <span className="text-slate-500 dark:text-slate-400 pb-2 px-1 hover:text-slate-700 dark:text-slate-200 cursor-pointer">Teachers</span>
                  <span className="text-slate-500 dark:text-slate-400 pb-2 px-1 hover:text-slate-700 dark:text-slate-200 cursor-pointer">Staff</span>
                </div>

                {/* Stats Blocks */}
                <div className="grid grid-cols-3 gap-2 mt-5">
                  <div className="bg-[#F8F9FA] rounded-lg p-3 text-center border border-slate-100 dark:border-slate-800/50">
                    <div className="text-[15px] font-bold text-slate-900 dark:text-white">28</div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400">Emergency</div>
                  </div>
                  <div className="bg-[#F8F9FA] rounded-lg p-3 text-center border border-slate-100 dark:border-slate-800/50">
                    <div className="text-[15px] font-bold text-slate-900 dark:text-white">01</div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400">Absent</div>
                  </div>
                  <div className="bg-[#F8F9FA] rounded-lg p-3 text-center border border-slate-100 dark:border-slate-800/50">
                    <div className="text-[15px] font-bold text-slate-900 dark:text-white">01</div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400">Late</div>
                  </div>
                </div>

                {/* Half Donut Mockup */}
                <div className="flex-1 mt-6 flex flex-col items-center justify-end overflow-hidden relative min-h-[140px]">
                  <svg viewBox="0 0 100 50" className="w-[80%] h-auto drop-shadow-md">
                    <path d="M 10 50 A 40 40 0 0 1 90 50" fill="none" stroke="#F59E0B" strokeWidth="20" />
                    <path d="M 85 50 A 40 40 0 0 0 90 50" fill="none" stroke="#1DD04A" strokeWidth="20" />
                  </svg>
                  <div className="absolute bottom-5 text-white text-[11px] font-bold">98.8%</div>
                </div>
                <div className="mt-4 flex justify-center">
                  <button className="bg-[#F1F3F5] text-slate-600 dark:text-slate-300 font-semibold text-[12px] px-4 py-2 rounded-lg flex items-center gap-1.5 hover:bg-slate-200">
                    <CalendarIcon className="w-3.5 h-3.5" /> View All
                  </button>
                </div>
              </div>

              {/* Best Performers Row */}
              <div className="grid grid-cols-2 gap-4">
                {/* Best Performer */}
                <div className="bg-[#3DC84A] rounded-xl card-shadow overflow-hidden text-center relative p-5 h-[280px] flex flex-col items-center">
                  <div className="absolute top-2 left-2 flex gap-1 opacity-20">
                    <Award className="w-6 h-6 text-white fill-white" />
                  </div>
                  <h4 className="text-[13px] text-white/90 font-semibold mb-1">Best Performer</h4>
                  <h3 className="text-xl font-semibold text-white leading-tight">Rubell</h3>
                  <p className="text-[11px] text-white/80">Physics Teacher</p>
                  {/* <div className="flex items-center gap-2 mt-4 z-10">
                    <button className="w-5 h-5 bg-white dark:bg-slate-900 rounded-full flex items-center justify-center text-[#3DC84A]"><ChevronLeft className="w-3 h-3" /></button>
                    <button className="w-5 h-5 bg-white dark:bg-slate-900 rounded-full flex items-center justify-center text-[#3DC84A]"><ChevronRight className="w-3 h-3" /></button>
                  </div> */}
                  <img src="/student-performer-01.png" alt="Rubell" className="absolute bottom-0 w-[80%] object-contain" />
                </div>

                {/* Star Students */}
                <div className="bg-[#1975D1] rounded-xl card-shadow overflow-hidden text-center relative p-5 h-[280px] flex flex-col items-center">
                  <div className="absolute top-4 left-4 opacity-10">
                    <svg className="w-16 h-16 text-white fill-white" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
                  </div>
                  <h4 className="text-[13px] text-white/90 font-semibold mb-1">Star Students</h4>
                  <h3 className="text-xl font-semibold text-white leading-tight mt-1">Tenesa</h3>
                  <p className="text-[11px] text-white/80">XII, A</p>
                  {/* <div className="flex items-center gap-2 mt-4 z-10">
                    <button className="w-5 h-5 bg-white dark:bg-slate-900 rounded-full flex items-center justify-center text-[#1975D1]"><ChevronLeft className="w-3 h-3" /></button>
                    <button className="w-5 h-5 bg-white dark:bg-slate-900 rounded-full flex items-center justify-center text-[#1975D1]"><ChevronRight className="w-3 h-3" /></button>
                  </div> */}
                  <img src="/performer-01.png" alt="Tenesa" className="absolute bottom-0 w-[85%] object-contain" />
                </div>
              </div>
            </div>

            {/* COLUMN 3: Quick Links, Class Routine, Performance */}
            <div className="space-y-6">

              {/* Quick Links Card */}
              <div className="bg-white dark:bg-slate-900 border border-border rounded-xl p-6 card-shadow flex flex-col text-left">
                <h3 className="text-[15px] font-semibold text-slate-900 dark:text-white mb-5">Quick Links</h3>
                <div className="grid grid-cols-3 gap-3">
                  <Link href="/dashboard" className="flex flex-col items-center gap-2 p-2 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-lg group">
                    <div className="w-12 h-12 rounded-full bg-[#E8F8E8] border border-[#BDE8B5] text-[#1D7F2C] flex items-center justify-center group-hover:scale-105 transition-transform">
                      <CalendarIcon className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-200">Calendar</span>
                  </Link>
                  <Link href="/dashboard/results" className="flex flex-col items-center gap-2 p-2 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-lg group">
                    <div className="w-12 h-12 rounded-full bg-[#EAEFFF] border border-[#C5D5FF] text-[#3B66FF] flex items-center justify-center group-hover:scale-105 transition-transform">
                      <FileText className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-200 text-center leading-tight">Exam Result</span>
                  </Link>
                  <Link href="/dashboard/attendance" className="flex flex-col items-center gap-2 p-2 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-lg group">
                    <div className="w-12 h-12 rounded-full bg-[#FFF7E6] border border-[#FFE7B3] text-[#F59E0B] flex items-center justify-center group-hover:scale-105 transition-transform">
                      <UserCheck className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-200">Attendance</span>
                  </Link>
                  <Link href="/dashboard/fees" className="flex flex-col items-center gap-2 p-2 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-lg group">
                    <div className="w-12 h-12 rounded-full bg-[#E6F8FF] border border-[#B3EEFF] text-[#00B5FF] flex items-center justify-center group-hover:scale-105 transition-transform">
                      <DollarSign className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-200">Fees</span>
                  </Link>
                  <Link href="/dashboard/homework" className="flex flex-col items-center gap-2 p-2 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-lg group">
                    <div className="w-12 h-12 rounded-full bg-[#FFEBF0] border border-[#FFCCD8] text-[#FF4A6B] flex items-center justify-center group-hover:scale-105 transition-transform">
                      <BookOpen className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-200 text-center leading-tight">Home work</span>
                  </Link>
                  <Link href="/dashboard" className="flex flex-col items-center gap-2 p-2 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-lg group">
                    <div className="w-12 h-12 rounded-full bg-[#EAF9F5] border border-[#C4F0E4] text-[#1DD04A] flex items-center justify-center group-hover:scale-105 transition-transform">
                      <FileText className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-200">Reports</span>
                  </Link>
                </div>
              </div>

              {/* Class Routine Card */}
              <div className="bg-white dark:bg-slate-900 border border-border rounded-xl p-6 card-shadow flex flex-col text-left">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-[15px] font-semibold text-slate-900 dark:text-white">Class Routine</h3>
                  <button className="text-[12px] font-semibold text-[#F59E0B] flex items-center gap-1 hover:text-[#D97706]">
                    <Plus className="w-3.5 h-3.5" />
                    Add New
                  </button>
                </div>
                <div className="space-y-4">
                  {/* Routine Item */}
                  <div className="border border-border rounded-xl p-3 flex gap-3 items-center">
                    <img src="/asset 12.webp" alt="Avatar" className="w-10 h-10 rounded-lg object-cover bg-slate-100 dark:bg-slate-800" />
                    <div className="flex-1">
                      <p className="text-[12px] text-slate-500 dark:text-slate-400 mb-1.5">Oct 2024</p>
                      <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5">
                        <div className="bg-[#F59E0B] h-1.5 rounded-full" style={{ width: '80%' }}></div>
                      </div>
                    </div>
                  </div>
                  {/* Routine Item */}
                  <div className="border border-border rounded-xl p-3 flex gap-3 items-center">
                    <img src="/asset 14.webp" alt="Avatar" className="w-10 h-10 rounded-lg object-cover bg-slate-100 dark:bg-slate-800" />
                    <div className="flex-1">
                      <p className="text-[12px] text-slate-500 dark:text-slate-400 mb-1.5">Nov 2024</p>
                      <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5">
                        <div className="bg-[#FFB800] h-1.5 rounded-full" style={{ width: '70%' }}></div>
                      </div>
                    </div>
                  </div>
                  {/* Routine Item */}
                  <div className="border border-border rounded-xl p-3 flex gap-3 items-center">
                    <img src="/asset 13.webp" alt="Avatar" className="w-10 h-10 rounded-lg object-cover bg-slate-100 dark:bg-slate-800" />
                    <div className="flex-1">
                      <p className="text-[12px] text-slate-500 dark:text-slate-400 mb-1.5">Oct 2024</p>
                      <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5">
                        <div className="bg-[#1DD04A] h-1.5 rounded-full" style={{ width: '60%' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Performance Card */}
              <div className="bg-white dark:bg-slate-900 border border-border rounded-xl p-6 card-shadow flex flex-col text-left">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-[15px] font-semibold text-slate-900 dark:text-white">Performance</h3>
                  <button className="text-[12px] font-medium text-slate-500 dark:text-slate-400 flex items-center gap-1">
                    Class II <span className="ml-1 text-[10px]">▼</span>
                  </button>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex-1 space-y-3 border border-border rounded-xl p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#F59E0B]"></span>
                        <span className="text-[12px] text-slate-500 dark:text-slate-400">Top</span>
                      </div>
                      <span className="text-[14px] font-bold text-slate-900 dark:text-white">45</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#FFB800]"></span>
                        <span className="text-[12px] text-slate-500 dark:text-slate-400">Average</span>
                      </div>
                      <span className="text-[14px] font-bold text-slate-900 dark:text-white">11</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#FF4A6B]"></span>
                        <span className="text-[12px] text-slate-500 dark:text-slate-400">Below Avg</span>
                      </div>
                      <span className="text-[14px] font-bold text-slate-900 dark:text-white">02</span>
                    </div>
                  </div>

                  <div className="w-[100px] h-[100px] relative shrink-0">
                    {/* Recreating Donut Chart with SVG to match exact colors */}
                    <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                      <circle cx="50" cy="50" r="40" fill="none" stroke="#F59E0B" strokeWidth="18" strokeDasharray="251.2" strokeDashoffset="0" />
                      <circle cx="50" cy="50" r="40" fill="none" stroke="#FFB800" strokeWidth="18" strokeDasharray="251.2" strokeDashoffset="180" />
                      <circle cx="50" cy="50" r="40" fill="none" stroke="#FF4A6B" strokeWidth="18" strokeDasharray="251.2" strokeDashoffset="230" />
                    </svg>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* ----------------------------------------------------
              BOTTOM ROW 1: FEES & LEAVE REQUESTS
              ---------------------------------------------------- */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Fees Collection */}
            <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-border rounded-xl p-6 card-shadow flex flex-col text-left">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-[15px] font-semibold text-slate-900 dark:text-white">Fees Collection</h3>
                <button className="text-[12px] font-medium text-slate-500 dark:text-slate-400 flex items-center gap-1">
                  <CalendarIcon className="w-3.5 h-3.5" /> Last 8 Quarter <span className="ml-1 text-[10px]">▼</span>
                </button>
              </div>
              <div className="flex items-center gap-4 text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-4">
                <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 bg-[#F59E0B] rounded-sm"></span> Collected Fee</div>
                <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 bg-slate-200 rounded-sm"></span> Total Fee</div>
              </div>
              <div className="flex-1 mt-2 min-h-[160px] relative">
                {/* Custom CSS Grouped Bar Chart Mockup */}
                <div className="absolute inset-0 flex items-end justify-between px-4 pb-6 border-b border-slate-200 dark:border-slate-800">
                  <div className="flex flex-col items-center gap-2 h-full justify-end">
                    <div className="w-10 bg-slate-200 h-[70%] rounded-t flex flex-col justify-end overflow-hidden"><div className="w-full bg-[#F59E0B] h-[40%]"></div></div>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold mt-2">Q1: 2023</span>
                  </div>
                  <div className="flex flex-col items-center gap-2 h-full justify-end">
                    <div className="w-10 bg-slate-200 h-[80%] rounded-t flex flex-col justify-end overflow-hidden"><div className="w-full bg-[#F59E0B] h-[55%]"></div></div>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold mt-2">Q2: 2023</span>
                  </div>
                  <div className="flex flex-col items-center gap-2 h-full justify-end">
                    <div className="w-10 bg-slate-200 h-[75%] rounded-t flex flex-col justify-end overflow-hidden"><div className="w-full bg-[#F59E0B] h-[48%]"></div></div>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold mt-2">Q3: 2023</span>
                  </div>
                  <div className="flex flex-col items-center gap-2 h-full justify-end">
                    <div className="w-10 bg-slate-200 h-[90%] rounded-t flex flex-col justify-end overflow-hidden"><div className="w-full bg-[#F59E0B] h-[60%]"></div></div>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold mt-2">Q4: 2023</span>
                  </div>
                  <div className="flex flex-col items-center gap-2 h-full justify-end">
                    <div className="w-10 bg-slate-200 h-[85%] rounded-t flex flex-col justify-end overflow-hidden"><div className="w-full bg-[#F59E0B] h-[55%]"></div></div>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold mt-2">Q1: 2024</span>
                  </div>
                  <div className="flex flex-col items-center gap-2 h-full justify-end">
                    <div className="w-10 bg-slate-200 h-[60%] rounded-t flex flex-col justify-end overflow-hidden"><div className="w-full bg-[#F59E0B] h-[45%]"></div></div>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold mt-2">Q2: 2024</span>
                  </div>
                  <div className="flex flex-col items-center gap-2 h-full justify-end">
                    <div className="w-10 bg-slate-200 h-[75%] rounded-t flex flex-col justify-end overflow-hidden"><div className="w-full bg-[#F59E0B] h-[50%]"></div></div>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold mt-2">Q3: 2024</span>
                  </div>
                  <div className="flex flex-col items-center gap-2 h-full justify-end">
                    <div className="w-10 bg-slate-200 h-[95%] rounded-t flex flex-col justify-end overflow-hidden"><div className="w-full bg-[#F59E0B] h-[65%]"></div></div>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold mt-2">Q4: 2024</span>
                  </div>
                </div>
                {/* Y-axis labels mock */}
                <div className="absolute left-0 h-[calc(100%-24px)] flex flex-col justify-between text-[10px] text-slate-400 dark:text-slate-500 font-medium py-2">
                  <span>100</span>
                  <span>50</span>
                  <span>0</span>
                </div>
              </div>
            </div>

            {/* Leave Requests */}
            <div className="bg-white dark:bg-slate-900 border border-border rounded-xl p-6 card-shadow flex flex-col text-left">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-[15px] font-semibold text-slate-900 dark:text-white">Leave Requests</h3>
                <button className="text-[12px] font-medium text-slate-500 dark:text-slate-400 flex items-center gap-1">
                  <CalendarIcon className="w-3.5 h-3.5" /> Today <span className="ml-1 text-[10px]">▼</span>
                </button>
              </div>
              <div className="flex-1 space-y-4">

                {/* Leave Item 1 */}
                <div className="border border-slate-100 dark:border-slate-800/50 rounded-xl p-4 flex flex-col gap-3 relative">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img src="/asset 12.webp" alt="James" className="w-10 h-10 rounded object-cover bg-slate-100 dark:bg-slate-800" />
                      <div>
                        <h4 className="text-[13px] font-bold text-slate-900 dark:text-white flex items-center gap-2">
                          James <span className="bg-[#FFEBF0] text-[#FF4A6B] text-[9px] px-1.5 py-0.5 rounded font-bold uppercase">Emergency</span>
                        </h4>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400">Physics Teacher</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <button className="w-6 h-6 bg-[#3DC84A] text-white rounded flex items-center justify-center hover:bg-[#34a83e]"><CheckCircle2 className="w-3.5 h-3.5" /></button>
                      <button className="w-6 h-6 bg-[#FF4A6B] text-white rounded flex items-center justify-center hover:bg-[#e03b5a]"><X className="w-3.5 h-3.5" /></button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-[11px] pt-3 border-t border-slate-100 dark:border-slate-800/50 text-slate-500 dark:text-slate-400">
                    <span>Leave : <strong className="text-slate-800 dark:text-slate-100">12 - 13 May</strong></span>
                    <span>Apply on : <strong className="text-slate-800 dark:text-slate-100">12 May</strong></span>
                  </div>
                </div>

                {/* Leave Item 2 */}
                <div className="border border-slate-100 dark:border-slate-800/50 rounded-xl p-4 flex flex-col gap-3 relative">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img src="/asset 14.webp" alt="Ramlan" className="w-10 h-10 rounded object-cover bg-slate-100 dark:bg-slate-800" />
                      <div>
                        <h4 className="text-[13px] font-bold text-slate-900 dark:text-white flex items-center gap-2">
                          Ramlan <span className="bg-[#FFF7E6] text-[#F59E0B] text-[9px] px-1.5 py-0.5 rounded font-bold uppercase">Casual</span>
                        </h4>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400">Accountant</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <button className="w-6 h-6 bg-[#3DC84A] text-white rounded flex items-center justify-center hover:bg-[#34a83e]"><CheckCircle2 className="w-3.5 h-3.5" /></button>
                      <button className="w-6 h-6 bg-[#FF4A6B] text-white rounded flex items-center justify-center hover:bg-[#e03b5a]"><X className="w-3.5 h-3.5" /></button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-[11px] pt-3 border-t border-slate-100 dark:border-slate-800/50 text-slate-500 dark:text-slate-400">
                    <span>Leave : <strong className="text-slate-800 dark:text-slate-100">12 - 13 May</strong></span>
                    <span>Apply on : <strong className="text-slate-800 dark:text-slate-100">11 May</strong></span>
                  </div>
                </div>

              </div>
            </div>
          </div>

          {/* ----------------------------------------------------
              BOTTOM ROW 2: ACTION BUTTONS
              ---------------------------------------------------- */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <Link href="/dashboard/attendance" className="bg-[#FFF7E6] hover:bg-[#ffeed1] transition-colors rounded-xl p-4 flex items-center justify-between border border-[#FFE7B3]">
              <div className="flex items-center gap-3 text-[#F59E0B] font-bold text-[13px]">
                <div className="w-10 h-10 bg-[#F59E0B] rounded-lg text-white flex items-center justify-center shadow-sm">
                  <UserCheck className="w-5 h-5" />
                </div>
                View Attendance
              </div>
              <div className="w-6 h-6 bg-white dark:bg-slate-900 rounded-full flex items-center justify-center text-[#F59E0B]"><ChevronRight className="w-3 h-3" /></div>
            </Link>

            <Link href="/dashboard/notices" className="bg-[#E8F8E8] hover:bg-[#d5f3d5] transition-colors rounded-xl p-4 flex items-center justify-between border border-[#BDE8B5]">
              <div className="flex items-center gap-3 text-[#1D7F2C] font-bold text-[13px]">
                <div className="w-10 h-10 bg-[#1DD04A] rounded-lg text-white flex items-center justify-center shadow-sm">
                  <CalendarDays className="w-5 h-5" />
                </div>
                New Events
              </div>
              <div className="w-6 h-6 bg-white dark:bg-slate-900 rounded-full flex items-center justify-center text-[#1DD04A]"><ChevronRight className="w-3 h-3" /></div>
            </Link>

            <Link href="/dashboard" className="bg-[#FFEBF0] hover:bg-[#ffdce5] transition-colors rounded-xl p-4 flex items-center justify-between border border-[#FFCCD8]">
              <div className="flex items-center gap-3 text-[#FF4A6B] font-bold text-[13px]">
                <div className="w-10 h-10 bg-[#FF4A6B] rounded-lg text-white flex items-center justify-center shadow-sm">
                  <Award className="w-5 h-5" />
                </div>
                Membership Plans
              </div>
              <div className="w-6 h-6 bg-white dark:bg-slate-900 rounded-full flex items-center justify-center text-[#FF4A6B]"><ChevronRight className="w-3 h-3" /></div>
            </Link>

            <Link href="/dashboard/fees" className="bg-[#E6F8FF] hover:bg-[#ccf1ff] transition-colors rounded-xl p-4 flex items-center justify-between border border-[#B3EEFF]">
              <div className="flex items-center gap-3 text-[#00B5FF] font-bold text-[13px]">
                <div className="w-10 h-10 bg-[#00B5FF] rounded-lg text-white flex items-center justify-center shadow-sm">
                  <FileText className="w-5 h-5" />
                </div>
                Finance & Accounts
              </div>
              <div className="w-6 h-6 bg-[#F59E0B] rounded-full flex items-center justify-center text-white"><ChevronRight className="w-3 h-3" /></div>
            </Link>
          </div>

          {/* ----------------------------------------------------
              BOTTOM ROW 3: STATS & NOTICES
              ---------------------------------------------------- */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pb-6">

            {/* Sparklines Column */}
            <div className="lg:col-span-3 space-y-6">
              <div className="bg-white dark:bg-slate-900 border border-border rounded-xl  card-shadow flex flex-col text-left ">
                <div className="flex items-center justify-between mb-2 p-2">
                  <div>
                    <p className="text-[12px] text-slate-500 dark:text-slate-400 font-semibold mb-1">Total Earnings</p>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">$64,522,24</h3>
                  </div>
                  <div className="w-8 h-8 rounded-lg bg-[#F59E0B] text-white flex items-center justify-center shadow-sm">
                    <TrendingUp className="w-4 h-4" />
                  </div>
                </div>
                <div className="flex-1 w-full min-h-[60px] relative mt-2 overflow-hidden">
                  {/* SVG Sparkline Mockup */}
                  <svg viewBox="0 0 200 50" preserveAspectRatio="none" className="w-full h-[60px] absolute bottom-0">
                    <path d="M0,40 L40,10 L80,30 L120,20 L160,10 L200,25 L200,50 L0,50 Z" fill="rgba(93, 107, 238, 0.1)" />
                    <path d="M0,40 L40,10 L80,30 L120,20 L160,10 L200,25" fill="none" stroke="#F59E0B" strokeWidth="2" />
                  </svg>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-900 border border-border rounded-xl  card-shadow flex flex-col text-left ">
                <div className="flex items-center justify-between mb-2 p-2">
                  <div>
                    <p className="text-[12px] text-slate-500 dark:text-slate-400 font-semibold mb-1">Total Expenses</p>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">$60,522,24</h3>
                  </div>
                  <div className="w-8 h-8 rounded-lg bg-[#FF4A6B] text-white flex items-center justify-center shadow-sm">
                    <TrendingUp className="w-4 h-4 transform rotate-180" />
                  </div>
                </div>
                <div className="flex-1 w-full min-h-[60px] relative mt-2 overflow-hidden">
                  {/* SVG Sparkline Mockup */}
                  <svg viewBox="0 0 200 50" preserveAspectRatio="none" className="w-full h-[60px] absolute bottom-0">
                    <path d="M0,30 L40,50 L80,10 L120,20 L160,30 L200,10 L200,50 L0,50 Z" fill="rgba(255, 74, 107, 0.1)" />
                    <path d="M0,30 L40,50 L80,10 L120,20 L160,30 L200,10" fill="none" stroke="#FF4A6B" strokeWidth="2" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Notice Board */}
            <div className="lg:col-span-6 bg-white dark:bg-slate-900 border border-border rounded-xl p-6 card-shadow flex flex-col text-left">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-[15px] font-semibold text-slate-900 dark:text-white">Notice Board</h3>
                <Link href="/dashboard/notices" className="text-[12px] font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:text-slate-200">View All</Link>
              </div>
              <div className="divide-y divide-border flex-1">

                <div className="py-3.5 first:pt-0 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded-full bg-[#EAEFFF] text-[#F59E0B] flex items-center justify-center shrink-0">
                      <FileText className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <h4 className="text-[13px] font-bold text-slate-900 dark:text-white">New Syllabus Instructions</h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1.5"><CalendarIcon className="w-3 h-3" /> Added on : 11 Mar 2024</p>
                    </div>
                  </div>
                  <span className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[10px] font-bold px-2.5 py-1 rounded">20 Days</span>
                </div>

                <div className="py-3.5 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded-full bg-[#E8F8E8] text-[#1DD04A] flex items-center justify-center shrink-0">
                      <Megaphone className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <h4 className="text-[13px] font-bold text-slate-900 dark:text-white">World Environment Day Program.......!!!</h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1.5"><CalendarIcon className="w-3 h-3" /> Added on : 21 Apr 2024</p>
                    </div>
                  </div>
                  <span className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[10px] font-bold px-2.5 py-1 rounded">15 Days</span>
                </div>

                <div className="py-3.5 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded-full bg-[#FFEBF0] text-[#FF4A6B] flex items-center justify-center shrink-0">
                      <CalendarDays className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <h4 className="text-[13px] font-bold text-slate-900 dark:text-white">Exam Preparation Notification!</h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1.5"><CalendarIcon className="w-3 h-3" /> Added on : 18 Mar 2024</p>
                    </div>
                  </div>
                  <span className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[10px] font-bold px-2.5 py-1 rounded">12 Days</span>
                </div>

                <div className="py-3.5 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded-full bg-[#E6F8FF] text-[#00B5FF] flex items-center justify-center shrink-0">
                      <BookOpen className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <h4 className="text-[13px] font-bold text-slate-900 dark:text-white">Online Classes Preparation</h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1.5"><CalendarIcon className="w-3 h-3" /> Added on : 24 May 2024</p>
                    </div>
                  </div>
                  <span className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[10px] font-bold px-2.5 py-1 rounded">02 Days</span>
                </div>

                <div className="py-3.5 pb-0 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded-full bg-[#FFF7E6] text-[#F59E0B] flex items-center justify-center shrink-0">
                      <Clock className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <h4 className="text-[13px] font-bold text-slate-900 dark:text-white">Exam Time Table Release</h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1.5"><CalendarIcon className="w-3 h-3" /> Added on : 24 May 2024</p>
                    </div>
                  </div>
                  <span className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[10px] font-bold px-2.5 py-1 rounded">08 Days</span>
                </div>

              </div>
            </div>

            {/* Fee Stats */}
            <div className="lg:col-span-3 space-y-4">
              <div className="bg-white dark:bg-slate-900 border border-border rounded-xl p-4 card-shadow flex items-center justify-between text-left">
                <div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold mb-1">Total Fees Collected</p>
                  <h3 className="text-[16px] font-bold text-slate-900 dark:text-white">$25,000,02</h3>
                </div>
                <span className="bg-[#E8F8E8] text-[#1D7F2C] text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-0.5">
                  <TrendingUp className="w-3 h-3" /> 1.2%
                </span>
              </div>

              <div className="bg-white dark:bg-slate-900 border border-border rounded-xl p-4 card-shadow flex items-center justify-between text-left">
                <div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold mb-1">Fine Collected till date</p>
                  <h3 className="text-[16px] font-bold text-slate-900 dark:text-white">$4,56,64</h3>
                </div>
                <span className="bg-[#FFEBF0] text-[#FF4A6B] text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-0.5">
                  <TrendingUp className="w-3 h-3 transform rotate-180" /> 1.2%
                </span>
              </div>

              <div className="bg-white dark:bg-slate-900 border border-border rounded-xl p-4 card-shadow flex items-center justify-between text-left">
                <div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold mb-1">Student Not Paid</p>
                  <h3 className="text-[16px] font-bold text-slate-900 dark:text-white">$545</h3>
                </div>
                <span className="bg-[#E6F8FF] text-[#00B5FF] text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-0.5">
                  <TrendingUp className="w-3 h-3" /> 1.2%
                </span>
              </div>

              <div className="bg-white dark:bg-slate-900 border border-border rounded-xl p-4 card-shadow flex items-center justify-between text-left">
                <div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold mb-1">Total Outstanding</p>
                  <h3 className="text-[16px] font-bold text-slate-900 dark:text-white">$4,56,64</h3>
                </div>
                <span className="bg-[#FFEBF0] text-[#FF4A6B] text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-0.5">
                  <TrendingUp className="w-3 h-3 transform rotate-180" /> 1.2%
                </span>
              </div>
            </div>

          </div>

        </div>
      )}

      {/* ----------------------------------------------------
          TEACHER VIEW
          ---------------------------------------------------- */}
      {activeRole === "teacher" && (
        <div className="space-y-6">
          
          {/* Top Row: Banner, Profile, Syllabus */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Welcome Banner */}
            <div className="lg:col-span-6 relative overflow-hidden bg-[#1975D1] rounded-xl text-white p-6 md:p-8 flex flex-col justify-center text-left card-shadow min-h-[160px]">
              <div className="absolute top-0 right-0 w-full h-full opacity-30 pointer-events-none" style={{ backgroundImage: "url('/asset 11.svg')", backgroundSize: "cover", backgroundPosition: "center right" }}></div>
              <div className="relative z-10">
                <h2 className="text-[22px] font-bold">Good Morning Ms.Teena</h2>
                <p className="text-[13px] text-white/80 mt-1">Have a Good day at work</p>
                <div className="mt-4 text-[12px] text-white/90 font-medium">
                  Notice : There is a staff meeting at 9AM today, Dont forget to Attend!!
                </div>
              </div>
              {/* Optional Illustration */}
              <img src="/student-performer-01.png" alt="" className="absolute right-4 bottom-0 h-[90%] object-contain" />
            </div>

            {/* Profile Card */}
            <div className="lg:col-span-3 bg-[#0F172A] rounded-xl p-5 card-shadow flex items-center gap-4 relative overflow-hidden">
              {/* Abstract dark shapes mockup */}
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#2D3748] rounded-full opacity-50"></div>
              
              <img src="/asset 12.webp" alt="Profile" className="w-[72px] h-[72px] rounded-lg object-cover border-2 border-slate-700 z-10" />
              <div className="z-10 text-left">
                <span className="bg-white text-[#F59E0B] text-[9px] font-bold px-2 py-0.5 rounded uppercase">#T094001</span>
                <h3 className="text-[15px] font-bold text-white mt-1.5">Henriques Morgan</h3>
                <p className="text-[11px] text-slate-300 mt-0.5">Classes : I A, V B  <span className="mx-1">•</span> Physics</p>
              </div>
              <button className="absolute bottom-4 right-4 bg-[#F59E0B] text-white text-[11px] font-bold px-3 py-1.5 rounded z-10 hover:bg-[#D97706]">
                Edit Profile
              </button>
            </div>

            {/* Syllabus Progress */}
            <div className="lg:col-span-3 bg-white dark:bg-slate-900 border border-border rounded-xl p-5 card-shadow flex items-center justify-between text-left">
              <div className="w-[80px] h-[80px] relative shrink-0">
                <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                  <circle cx="50" cy="50" r="40" fill="none" stroke="#FF4A6B" strokeWidth="16" />
                  <circle cx="50" cy="50" r="40" fill="none" stroke="#F59E0B" strokeWidth="16" strokeDasharray="251.2" strokeDashoffset="12.56" /> 
                  {/* ~95% filled */}
                </svg>
              </div>
              <div className="flex-1 ml-6">
                <h3 className="text-[14px] font-bold text-slate-900 dark:text-white mb-3">Syllabus</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-[12px] font-semibold text-slate-700 dark:text-slate-200">
                    <span className="w-2 h-2 rounded-full bg-[#F59E0B]"></span> Completed : 95%
                  </div>
                  <div className="flex items-center gap-2 text-[12px] font-semibold text-slate-700 dark:text-slate-200">
                    <span className="w-2 h-2 rounded-full bg-[#FF4A6B]"></span> Pending : 5%
                  </div>
                </div>
              </div>
            </div>
            
          </div>

          {/* Main Grid: 8 + 4 cols */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left Column (8-span) */}
            <div className="lg:col-span-8 space-y-6">
              
              {/* Today's Class */}
              <div className="bg-white dark:bg-slate-900 border border-border rounded-xl p-6 card-shadow text-left">
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-3">
                    <h3 className="text-[15px] font-semibold text-slate-900 dark:text-white">Today's Class</h3>
                    <div className="flex items-center gap-1">
                      <button className="w-6 h-6 rounded-full border border-border flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"><ChevronLeft className="w-3.5 h-3.5" /></button>
                      <button className="w-6 h-6 rounded-full border border-border flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"><ChevronRight className="w-3.5 h-3.5" /></button>
                    </div>
                  </div>
                  <div className="text-[12px] font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1">
                    <ChevronLeft className="w-3.5 h-3.5" /> 16 May 2024 <ChevronRight className="w-3.5 h-3.5" />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {/* Class Card 1 */}
                  <div className="bg-[#F8FAFC] dark:bg-slate-800/50 rounded-xl p-3 border border-slate-100 dark:border-slate-800/50">
                    <div className="bg-[#FF4A6B] text-white text-[11px] font-bold rounded-md px-2 py-1.5 flex items-center justify-center gap-1.5 w-max mb-3">
                      <Clock className="w-3 h-3" /> 09:00 - 09:45
                    </div>
                    <p className="text-[12px] font-semibold text-slate-700 dark:text-slate-200">Class V, B</p>
                  </div>
                  {/* Class Card 2 */}
                  <div className="bg-[#F8FAFC] dark:bg-slate-800/50 rounded-xl p-3 border border-slate-100 dark:border-slate-800/50">
                    <div className="bg-[#FF4A6B] text-white text-[11px] font-bold rounded-md px-2 py-1.5 flex items-center justify-center gap-1.5 w-max mb-3">
                      <Clock className="w-3 h-3" /> 09:00 - 09:45
                    </div>
                    <p className="text-[12px] font-semibold text-slate-700 dark:text-slate-200">Class IV, C</p>
                  </div>
                  {/* Class Card 3 */}
                  <div className="bg-[#F8FAFC] dark:bg-slate-800/50 rounded-xl p-3 border border-slate-100 dark:border-slate-800/50">
                    <div className="bg-[#F59E0B] text-white text-[11px] font-bold rounded-md px-2 py-1.5 flex items-center justify-center gap-1.5 w-max mb-3">
                      <Clock className="w-3 h-3" /> 11:30 - 12:150
                    </div>
                    <p className="text-[12px] font-semibold text-slate-700 dark:text-slate-200">Class V, B</p>
                  </div>
                  {/* Class Card 4 */}
                  <div className="bg-[#F8FAFC] dark:bg-slate-800/50 rounded-xl p-3 border border-slate-100 dark:border-slate-800/50">
                    <div className="bg-[#F59E0B] text-white text-[11px] font-bold rounded-md px-2 py-1.5 flex items-center justify-center gap-1.5 w-max mb-3">
                      <Clock className="w-3 h-3" /> 01:30 - 02:15
                    </div>
                    <p className="text-[12px] font-semibold text-slate-700 dark:text-slate-200">Class V, B</p>
                  </div>
                </div>
              </div>

              {/* Attendance & Performance */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Attendance */}
                <div className="bg-white dark:bg-slate-900 border border-border rounded-xl p-6 card-shadow text-left flex flex-col">
                  <div className="flex items-center justify-between mb-5">
                    <h3 className="text-[15px] font-semibold text-slate-900 dark:text-white">Attendance</h3>
                    <button className="text-[11px] border border-border px-2 py-1 rounded font-medium text-slate-600 dark:text-slate-300 flex items-center gap-1">
                      <CalendarIcon className="w-3 h-3" /> This Week <ChevronRight className="w-3 h-3 rotate-90" />
                    </button>
                  </div>
                  
                  <div className="flex items-center justify-between mb-3 border-b border-border pb-3">
                    <div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold mb-1">Last 7 Days</p>
                      <div className="flex gap-1">
                        <span className="w-5 h-5 rounded bg-[#1DD04A] text-white text-[9px] font-bold flex items-center justify-center">M</span>
                        <span className="w-5 h-5 rounded bg-[#1DD04A] text-white text-[9px] font-bold flex items-center justify-center">T</span>
                        <span className="w-5 h-5 rounded bg-[#1DD04A] text-white text-[9px] font-bold flex items-center justify-center">W</span>
                        <span className="w-5 h-5 rounded bg-[#1DD04A] text-white text-[9px] font-bold flex items-center justify-center">T</span>
                        <span className="w-5 h-5 rounded bg-[#FF4A6B] text-white text-[9px] font-bold flex items-center justify-center">F</span>
                        <span className="w-5 h-5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-[9px] font-bold flex items-center justify-center">S</span>
                        <span className="w-5 h-5 rounded border border-border text-slate-400 dark:text-slate-500 text-[9px] font-bold flex items-center justify-center">S</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold mb-1">14 May 2024 - 21 May 2024</p>
                    </div>
                  </div>
                  <div className="text-[11px] text-[#F59E0B] font-bold mb-4 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" /> No of total working days: <span className="text-slate-900 dark:text-white">28 Days</span>
                  </div>

                  <div className="grid grid-cols-4 gap-2 mb-6">
                    <div className="text-center">
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold">Present</p>
                      <p className="text-[13px] font-bold text-slate-900 dark:text-white">25</p>
                    </div>
                    <div className="text-center">
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold">Absent</p>
                      <p className="text-[13px] font-bold text-slate-900 dark:text-white">2</p>
                    </div>
                    <div className="text-center">
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold">Halfday</p>
                      <p className="text-[13px] font-bold text-slate-900 dark:text-white">0</p>
                    </div>
                    <div className="text-center">
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold">Late</p>
                      <p className="text-[13px] font-bold text-slate-900 dark:text-white">1</p>
                    </div>
                  </div>

                  <div className="flex-1 flex flex-col items-center justify-center relative">
                    <div className="w-[140px] h-[140px] relative">
                      <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                        {/* Base Ring */}
                        <circle cx="50" cy="50" r="40" fill="none" stroke="#F1F5F9" strokeWidth="18" className="dark:stroke-slate-800" />
                        {/* Sections (Rough mock values) */}
                        <circle cx="50" cy="50" r="40" fill="none" stroke="#1DD04A" strokeWidth="18" strokeDasharray="251.2" strokeDashoffset="50" />
                        <circle cx="50" cy="50" r="40" fill="none" stroke="#F59E0B" strokeWidth="18" strokeDasharray="251.2" strokeDashoffset="220" />
                        <circle cx="50" cy="50" r="40" fill="none" stroke="#FFB800" strokeWidth="18" strokeDasharray="251.2" strokeDashoffset="240" />
                        <circle cx="50" cy="50" r="40" fill="none" stroke="#FF4A6B" strokeWidth="18" strokeDasharray="251.2" strokeDashoffset="245" />
                      </svg>
                    </div>
                    <div className="mt-4 flex items-center justify-center gap-3 text-[10px] font-bold text-slate-600 dark:text-slate-300">
                      <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-[#1DD04A]"></span>Present</span>
                      <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-[#F59E0B]"></span>Late</span>
                      <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-[#FFB800]"></span>Half Day</span>
                      <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-[#FF4A6B]"></span>Absent</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  {/* Best Performers */}
                  <div className="bg-white dark:bg-slate-900 border border-border rounded-xl p-6 card-shadow text-left">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-[15px] font-semibold text-slate-900 dark:text-white">Best Performers</h3>
                      <Link href="#" className="text-[12px] font-semibold text-[#F59E0B]">View All</Link>
                    </div>
                    
                    <div className="space-y-5">
                      <div className="flex items-center justify-between text-[12px] font-bold text-slate-800 dark:text-slate-200">
                        <span className="w-16">Class IV, C</span>
                        <div className="flex-1 mx-3 h-5 bg-[#EAEFFF] dark:bg-[#F59E0B]/20 rounded-full relative overflow-hidden flex items-center px-1">
                           <div className="absolute left-0 top-0 h-full bg-[#F59E0B] rounded-full" style={{width: '85%'}}></div>
                           {/* Avatars inside bar */}
                           <div className="flex -space-x-1.5 relative z-10">
                             <img src="/asset 12.webp" className="w-4 h-4 rounded-full border border-white" alt="" />
                             <img src="/asset 13.webp" className="w-4 h-4 rounded-full border border-white" alt="" />
                           </div>
                        </div>
                        <span className="w-8 text-right">85%</span>
                      </div>
                      
                      <div className="flex items-center justify-between text-[12px] font-bold text-slate-800 dark:text-slate-200">
                        <span className="w-16">Class III, B</span>
                        <div className="flex-1 mx-3 h-5 bg-[#FFF7E6] dark:bg-[#FFB800]/20 rounded-full relative overflow-hidden flex items-center px-1">
                           <div className="absolute left-0 top-0 h-full bg-[#FFB800] rounded-full" style={{width: '54%'}}></div>
                           <div className="flex -space-x-1.5 relative z-10">
                             <img src="/asset 14.webp" className="w-4 h-4 rounded-full border border-white" alt="" />
                           </div>
                        </div>
                        <span className="w-8 text-right">54%</span>
                      </div>

                      <div className="flex items-center justify-between text-[12px] font-bold text-slate-800 dark:text-slate-200">
                        <span className="w-16">Class V, A</span>
                        <div className="flex-1 mx-3 h-5 bg-[#E6F8FF] dark:bg-[#00B5FF]/20 rounded-full relative overflow-hidden flex items-center px-1">
                           <div className="absolute left-0 top-0 h-full bg-[#00B5FF] rounded-full" style={{width: '78%'}}></div>
                           <div className="flex -space-x-1.5 relative z-10">
                             <img src="/asset 12.webp" className="w-4 h-4 rounded-full border border-white" alt="" />
                             <img src="/asset 14.webp" className="w-4 h-4 rounded-full border border-white" alt="" />
                           </div>
                        </div>
                        <span className="w-8 text-right">78%</span>
                      </div>
                    </div>
                  </div>

                  {/* Student Progress */}
                  <div className="bg-white dark:bg-slate-900 border border-border rounded-xl p-6 card-shadow text-left">
                    <div className="flex items-center justify-between mb-5">
                      <h3 className="text-[15px] font-semibold text-slate-900 dark:text-white">Student Progress</h3>
                      <button className="text-[11px] border border-border px-2 py-1 rounded font-medium text-slate-600 dark:text-slate-300 flex items-center gap-1">
                        <CalendarIcon className="w-3 h-3" /> This Month <ChevronRight className="w-3 h-3 rotate-90" />
                      </button>
                    </div>

                    <div className="space-y-4">
                      {/* Progress Item */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <img src="/asset 13.webp" alt="" className="w-10 h-10 rounded object-cover" />
                          <div>
                            <h4 className="text-[13px] font-bold text-slate-900 dark:text-white">Susan Boswell</h4>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400">III, B</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Award className="w-4 h-4 text-[#1DD04A]" />
                          <span className="bg-[#E8F8E8] text-[#1D7F2C] text-[11px] font-bold px-2 py-0.5 rounded">98%</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <img src="/asset 12.webp" alt="" className="w-10 h-10 rounded object-cover" />
                          <div>
                            <h4 className="text-[13px] font-bold text-slate-900 dark:text-white">Richard Mayes</h4>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400">V, A</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Award className="w-4 h-4 text-[#1DD04A]" />
                          <span className="bg-[#E8F8E8] text-[#1D7F2C] text-[11px] font-bold px-2 py-0.5 rounded">92%</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <img src="/asset 14.webp" alt="" className="w-10 h-10 rounded object-cover" />
                          <div>
                            <h4 className="text-[13px] font-bold text-slate-900 dark:text-white">Veronica Randle</h4>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400">V, B</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="bg-[#EAEFFF] text-[#F59E0B] text-[11px] font-bold px-2 py-0.5 rounded">78%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>

            {/* Right Column (4-span) */}
            <div className="lg:col-span-4 space-y-6">
              {/* Schedules Card */}
              <div className="bg-white dark:bg-slate-900 border border-border rounded-xl p-6 card-shadow flex flex-col">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-[15px] font-semibold text-slate-900 dark:text-white">Schedules</h3>
                  <button className="text-[12px] font-semibold text-[#F59E0B] flex items-center gap-1 hover:text-[#D97706]">
                    <Plus className="w-3.5 h-3.5" />
                    Add New
                  </button>
                </div>

                {/* Mock Calendar */}
                <div className="w-full text-center">
                  <div className="flex items-center justify-between mb-4 px-2">
                    <button className="p-1 hover:bg-slate-100 dark:bg-slate-800 rounded text-slate-400 dark:text-slate-500">
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <span className="font-bold text-[14px] text-slate-900 dark:text-white">June 2026</span>
                    <button className="p-1 hover:bg-slate-100 dark:bg-slate-800 rounded text-slate-400 dark:text-slate-500">
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="grid grid-cols-7 gap-1 text-[12px] font-semibold text-slate-900 dark:text-white mb-2">
                    <div>Su</div><div>Mo</div><div>Tu</div><div>We</div><div>Th</div><div>Fr</div><div>Sa</div>
                  </div>
                  <div className="grid grid-cols-7 gap-1 text-[13px] text-slate-600 dark:text-slate-300">
                    <div className="p-2 text-slate-400 dark:text-slate-500">31</div>
                    <div className="p-2">1</div><div className="p-2">2</div><div className="p-2">3</div>
                    <div className="p-2">4</div><div className="p-2">5</div><div className="p-2">6</div>
                    <div className="p-2">7</div>
                    <div className="p-2 bg-[#F59E0B] text-white rounded-lg font-bold shadow-sm">8</div>
                    <div className="p-2">9</div><div className="p-2">10</div>
                    <div className="p-2">11</div><div className="p-2">12</div><div className="p-2">13</div>
                    <div className="p-2">14</div><div className="p-2">15</div><div className="p-2">16</div>
                    <div className="p-2">17</div><div className="p-2">18</div><div className="p-2">19</div>
                    <div className="p-2">20</div>
                    <div className="p-2">21</div><div className="p-2">22</div><div className="p-2">23</div>
                    <div className="p-2">24</div><div className="p-2">25</div><div className="p-2">26</div>
                    <div className="p-2">27</div><div className="p-2">28</div><div className="p-2">29</div>
                    <div className="p-2">30</div><div className="p-2">1</div><div className="p-2">2</div>
                    <div className="p-2">3</div><div className="p-2">4</div>
                    <div className="p-2">5</div><div className="p-2">6</div><div className="p-2">7</div>
                    <div className="p-2">8</div><div className="p-2">9</div><div className="p-2">10</div>
                    <div className="p-2">11</div>
                  </div>
                </div>
              </div>

              {/* Upcoming Events Card */}
              <div className="bg-white dark:bg-slate-900 border border-border rounded-xl p-6 card-shadow flex flex-col text-left">
                <h3 className="text-[15px] font-semibold text-slate-900 dark:text-white mb-5">Upcoming Events</h3>
                <div className="space-y-4">

                  {/* Event 1 */}
                  <div className="relative pl-4 border-l-2 border-[#FF4A6B] py-1">
                    <div className="flex gap-3">
                      <div className="w-10 h-10 rounded-lg bg-[#FFEBF0] text-[#FF4A6B] flex items-center justify-center shrink-0">
                        <Award className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-[13px] font-bold text-slate-900 dark:text-white">Vacation Meeting</h4>
                        <div className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400 mt-1 font-semibold">
                          <CalendarIcon className="w-3.5 h-3.5" /> 07 July 2024 - 07 July 2024
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400 font-semibold">
                        <Clock className="w-3.5 h-3.5" /> 09:10 AM - 10:50 PM
                      </div>
                      <div className="flex -space-x-2">
                        <img className="w-6 h-6 rounded-full border-2 border-white object-cover" src="/asset 12.webp" alt="" />
                        <img className="w-6 h-6 rounded-full border-2 border-white object-cover" src="/asset 13.webp" alt="" />
                      </div>
                    </div>
                  </div>

                  {/* Event 2 */}
                  <div className="relative pl-4 border-l-2 border-[#00B5FF] py-1">
                    <div className="flex gap-3">
                      <div className="w-10 h-10 rounded-lg bg-[#E6F8FF] text-[#00B5FF] flex items-center justify-center shrink-0">
                        <UserCheck className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-[13px] font-bold text-slate-900 dark:text-white">Parents, Teacher Meet</h4>
                        <div className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400 mt-1 font-semibold">
                          <CalendarIcon className="w-3.5 h-3.5" /> 15 July 2024
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400 font-semibold">
                        <Clock className="w-3.5 h-3.5" /> 09:10 AM - 10:50 PM
                      </div>
                      <div className="flex -space-x-2">
                        <img className="w-6 h-6 rounded-full border-2 border-white object-cover" src="/asset 14.webp" alt="" />
                        <img className="w-6 h-6 rounded-full border-2 border-white object-cover" src="/asset 12.webp" alt="" />
                        <img className="w-6 h-6 rounded-full border-2 border-white object-cover" src="/asset 13.webp" alt="" />
                      </div>
                    </div>
                  </div>

                  {/* Event 3 */}
                  <div className="relative pl-4 border-l-2 border-[#F59E0B] py-1">
                    <div className="flex gap-3">
                      <div className="w-10 h-10 rounded-lg bg-[#EAEFFF] text-[#F59E0B] flex items-center justify-center shrink-0">
                        <Users className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-[13px] font-bold text-slate-900 dark:text-white">Staff Meeting</h4>
                        <div className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400 mt-1 font-semibold">
                          <CalendarIcon className="w-3.5 h-3.5" /> 10 July 2024
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400 font-semibold">
                        <Clock className="w-3.5 h-3.5" /> 09:10 AM - 10:50 PM
                      </div>
                      <div className="flex -space-x-2">
                        <img className="w-6 h-6 rounded-full border-2 border-white object-cover" src="/asset 12.webp" alt="" />
                        <img className="w-6 h-6 rounded-full border-2 border-white object-cover" src="/asset 14.webp" alt="" />
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </div>
            
          </div>

          {/* Bottom Rows: Lesson Plan */}
          <div className="bg-white dark:bg-slate-900 border border-border rounded-xl p-6 card-shadow text-left">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-[15px] font-semibold text-slate-900 dark:text-white">Syllabus / Lesson Plan</h3>
              <Link href="#" className="text-[12px] font-semibold text-[#F59E0B]">View All</Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              
              {/* Lesson 1 */}
              <div className="border border-border rounded-xl p-4 flex flex-col justify-between h-[140px] hover:shadow-md transition-shadow">
                <div className="bg-[#E8F8E8] text-[#1D7F2C] text-[11px] font-bold text-center py-1.5 rounded-md mb-3">
                  Class V, B
                </div>
                <h4 className="text-[13px] font-bold text-slate-900 dark:text-white mb-2 line-clamp-2">Introduction Note to Physics on Tech</h4>
                <div className="flex items-center justify-between border-t border-border pt-3 mt-auto">
                  <button className="text-[11px] font-semibold text-slate-600 dark:text-slate-300 flex items-center gap-1.5 hover:text-[#F59E0B]">
                    <RefreshCcw className="w-3 h-3" /> Reschedule
                  </button>
                  <button className="text-[11px] font-semibold text-[#00B5FF] flex items-center gap-1.5 hover:text-[#0091cc]">
                    <Share2 className="w-3 h-3" /> Share
                  </button>
                </div>
              </div>

              {/* Lesson 2 */}
              <div className="border border-border rounded-xl p-4 flex flex-col justify-between h-[140px] hover:shadow-md transition-shadow">
                <div className="bg-[#FFF7E6] text-[#F59E0B] text-[11px] font-bold text-center py-1.5 rounded-md mb-3">
                  Class V, A
                </div>
                <h4 className="text-[13px] font-bold text-slate-900 dark:text-white mb-2 line-clamp-2">Biometric & their Working Functionality</h4>
                <div className="flex items-center justify-between border-t border-border pt-3 mt-auto">
                  <button className="text-[11px] font-semibold text-slate-600 dark:text-slate-300 flex items-center gap-1.5 hover:text-[#F59E0B]">
                    <RefreshCcw className="w-3 h-3" /> Reschedule
                  </button>
                  <button className="text-[11px] font-semibold text-[#00B5FF] flex items-center gap-1.5 hover:text-[#0091cc]">
                    <Share2 className="w-3 h-3" /> Share
                  </button>
                </div>
              </div>

              {/* Lesson 3 */}
              <div className="border border-border rounded-xl p-4 flex flex-col justify-between h-[140px] hover:shadow-md transition-shadow">
                <div className="bg-[#E6F8FF] text-[#00B5FF] text-[11px] font-bold text-center py-1.5 rounded-md mb-3">
                  Class IV, C
                </div>
                <h4 className="text-[13px] font-bold text-slate-900 dark:text-white mb-2 line-clamp-2">Analyze and interpret literary texts skills</h4>
                <div className="flex items-center justify-between border-t border-border pt-3 mt-auto">
                  <button className="text-[11px] font-semibold text-slate-600 dark:text-slate-300 flex items-center gap-1.5 hover:text-[#F59E0B]">
                    <RefreshCcw className="w-3 h-3" /> Reschedule
                  </button>
                  <button className="text-[11px] font-semibold text-[#00B5FF] flex items-center gap-1.5 hover:text-[#0091cc]">
                    <Share2 className="w-3 h-3" /> Share
                  </button>
                </div>
              </div>

              {/* Lesson 4 */}
              <div className="border border-border rounded-xl p-4 flex flex-col justify-between h-[140px] hover:shadow-md transition-shadow">
                <div className="bg-[#FFEBF0] text-[#FF4A6B] text-[11px] font-bold text-center py-1.5 rounded-md mb-3">
                  Class V, A
                </div>
                <h4 className="text-[13px] font-bold text-slate-900 dark:text-white mb-2 line-clamp-2">Enhance vocabulary and grammar skills</h4>
                <div className="flex items-center justify-between border-t border-border pt-3 mt-auto">
                  <button className="text-[11px] font-semibold text-slate-600 dark:text-slate-300 flex items-center gap-1.5 hover:text-[#F59E0B]">
                    <RefreshCcw className="w-3 h-3" /> Reschedule
                  </button>
                  <button className="text-[11px] font-semibold text-[#00B5FF] flex items-center gap-1.5 hover:text-[#0091cc]">
                    <Share2 className="w-3 h-3" /> Share
                  </button>
                </div>
              </div>

            </div>
          </div>

          {/* Bottom Rows: Student Marks & Leave Status */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Student Marks Table */}
            <div className="lg:col-span-8 bg-white dark:bg-slate-900 border border-border rounded-xl p-6 card-shadow text-left overflow-x-auto">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-[15px] font-semibold text-slate-900 dark:text-white">Student Marks</h3>
                <div className="flex items-center gap-3">
                  <button className="text-[11px] font-semibold text-slate-600 dark:text-slate-300 flex items-center gap-1">
                    <Users className="w-3.5 h-3.5" /> All Classes <ChevronRight className="w-3 h-3 rotate-90" />
                  </button>
                  <button className="text-[11px] font-semibold text-slate-600 dark:text-slate-300 flex items-center gap-1">
                    <Users className="w-3.5 h-3.5" /> All Sections <ChevronRight className="w-3 h-3 rotate-90" />
                  </button>
                </div>
              </div>

              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-800/50 text-[12px] text-slate-500 dark:text-slate-400 font-bold border-b border-border">
                    <th className="py-3 px-4 rounded-tl-lg">ID</th>
                    <th className="py-3 px-4">Name</th>
                    <th className="py-3 px-4">Class</th>
                    <th className="py-3 px-4">Section</th>
                    <th className="py-3 px-4">Marks %</th>
                    <th className="py-3 px-4">CGPA</th>
                    <th className="py-3 px-4 rounded-tr-lg">Status</th>
                  </tr>
                </thead>
                <tbody className="text-[13px] text-slate-700 dark:text-slate-200 font-medium">
                  <tr className="border-b border-border hover:bg-slate-50 dark:hover:bg-slate-800/20">
                    <td className="py-3 px-4">35013</td>
                    <td className="py-3 px-4 flex items-center gap-2"><img src="/asset 12.webp" className="w-6 h-6 rounded-full" /> Janet</td>
                    <td className="py-3 px-4">III</td>
                    <td className="py-3 px-4">A</td>
                    <td className="py-3 px-4">89%</td>
                    <td className="py-3 px-4">4.2</td>
                    <td className="py-3 px-4"><span className="bg-[#1DD04A] text-white text-[10px] font-bold px-2 py-0.5 rounded">Pass</span></td>
                  </tr>
                  <tr className="border-b border-border hover:bg-slate-50 dark:hover:bg-slate-800/20">
                    <td className="py-3 px-4">35013</td>
                    <td className="py-3 px-4 flex items-center gap-2"><img src="/asset 13.webp" className="w-6 h-6 rounded-full" /> Joann</td>
                    <td className="py-3 px-4">IV</td>
                    <td className="py-3 px-4">B</td>
                    <td className="py-3 px-4">88%</td>
                    <td className="py-3 px-4">3.2</td>
                    <td className="py-3 px-4"><span className="bg-[#1DD04A] text-white text-[10px] font-bold px-2 py-0.5 rounded">Pass</span></td>
                  </tr>
                  <tr className="border-b border-border hover:bg-slate-50 dark:hover:bg-slate-800/20">
                    <td className="py-3 px-4">35011</td>
                    <td className="py-3 px-4 flex items-center gap-2"><img src="/asset 14.webp" className="w-6 h-6 rounded-full" /> Kathleen</td>
                    <td className="py-3 px-4">II</td>
                    <td className="py-3 px-4">A</td>
                    <td className="py-3 px-4">69%</td>
                    <td className="py-3 px-4">4.5</td>
                    <td className="py-3 px-4"><span className="bg-[#1DD04A] text-white text-[10px] font-bold px-2 py-0.5 rounded">Pass</span></td>
                  </tr>
                  <tr className="border-b border-border hover:bg-slate-50 dark:hover:bg-slate-800/20">
                    <td className="py-3 px-4">35010</td>
                    <td className="py-3 px-4 flex items-center gap-2"><img src="/asset 12.webp" className="w-6 h-6 rounded-full" /> Gifford</td>
                    <td className="py-3 px-4">I</td>
                    <td className="py-3 px-4">B</td>
                    <td className="py-3 px-4">21%</td>
                    <td className="py-3 px-4">4.5</td>
                    <td className="py-3 px-4"><span className="bg-[#1DD04A] text-white text-[10px] font-bold px-2 py-0.5 rounded">Pass</span></td>
                  </tr>
                  <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/20">
                    <td className="py-3 px-4">35009</td>
                    <td className="py-3 px-4 flex items-center gap-2"><img src="/asset 13.webp" className="w-6 h-6 rounded-full" /> Lisa</td>
                    <td className="py-3 px-4">II</td>
                    <td className="py-3 px-4">B</td>
                    <td className="py-3 px-4">31%</td>
                    <td className="py-3 px-4">3.9</td>
                    <td className="py-3 px-4"><span className="bg-[#FF4A6B] text-white text-[10px] font-bold px-2 py-0.5 rounded">Fail</span></td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Leave Status */}
            <div className="lg:col-span-4 bg-white dark:bg-slate-900 border border-border rounded-xl p-6 card-shadow flex flex-col text-left">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-[15px] font-semibold text-slate-900 dark:text-white">Leave Status</h3>
                <button className="text-[11px] font-semibold text-slate-600 dark:text-slate-300 flex items-center gap-1">
                  <CalendarIcon className="w-3.5 h-3.5" /> This Month <ChevronRight className="w-3 h-3 rotate-90" />
                </button>
              </div>

              <div className="space-y-4">
                {/* Leave 1 */}
                <div className="border border-border rounded-xl p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#FFEBF0] text-[#FF4A6B] flex items-center justify-center">
                      <X className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-[13px] font-bold text-slate-900 dark:text-white">Emergency Leave</h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Date : 15 Jun 2024</p>
                    </div>
                  </div>
                  <span className="bg-[#E6F8FF] text-[#00B5FF] text-[9px] font-bold px-2 py-1 rounded">Pending</span>
                </div>

                {/* Leave 2 */}
                <div className="border border-border rounded-xl p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#EAEFFF] text-[#F59E0B] flex items-center justify-center">
                      <CalendarDays className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-[13px] font-bold text-slate-900 dark:text-white">Medical Leave</h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Date : 15 Jun 2024</p>
                    </div>
                  </div>
                  <span className="bg-[#E8F8E8] text-[#1D7F2C] text-[9px] font-bold px-2 py-1 rounded">Approved</span>
                </div>

                {/* Leave 3 */}
                <div className="border border-border rounded-xl p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#EAEFFF] text-[#F59E0B] flex items-center justify-center">
                      <CalendarDays className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-[13px] font-bold text-slate-900 dark:text-white">Medical Leave</h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Date : 16 Jun 2024</p>
                    </div>
                  </div>
                  <span className="bg-[#FFEBF0] text-[#FF4A6B] text-[9px] font-bold px-2 py-1 rounded">Declined</span>
                </div>

                {/* Leave 4 */}
                <div className="border border-border rounded-xl p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#FFEBF0] text-[#FF4A6B] flex items-center justify-center">
                      <X className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-[13px] font-bold text-slate-900 dark:text-white">Not Well</h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Date : 16 Jun 2024</p>
                    </div>
                  </div>
                  <span className="bg-[#E8F8E8] text-[#1D7F2C] text-[9px] font-bold px-2 py-1 rounded">Approved</span>
                </div>
              </div>
            </div>

          </div>

        </div>
      )}

      {/* ----------------------------------------------------
          STUDENT VIEW
          ---------------------------------------------------- */}
      {activeRole === "student" && (
        <div className="space-y-6">
          
          {/* Top Section: Masonry-like 3 Columns */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Column 1 (Left): Profile & Today's Class */}
            <div className="lg:col-span-3 flex flex-col gap-6">
              
              {/* Profile Card */}
              <div className="bg-[#0F172A] rounded-xl p-5 text-white relative overflow-hidden flex flex-col justify-between shadow-[0_4px_20px_-4px_rgba(30,41,59,0.3)]">
                 <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none" style={{ backgroundImage: "radial-gradient(circle, #ffffff 1px, transparent 1px)", backgroundSize: "16px 16px" }}></div>
                 <div className="absolute top-3 right-3 w-0 h-0 border-l-[10px] border-l-transparent border-t-[10px] border-t-yellow-400 border-r-[10px] border-r-transparent transform rotate-45"></div>
                 
                 <div className="relative z-10 flex gap-4 items-center">
                   <div className="w-14 h-14 bg-white rounded flex items-center justify-center p-0.5 shadow-sm">
                     <img src="/asset 12.webp" alt="Profile" className="w-full h-full rounded object-cover" />
                   </div>
                   <div>
                     <span className="bg-white text-[#F59E0B] text-[9px] font-bold px-2 py-0.5 rounded uppercase">#ST1234567</span>
                     <h3 className="text-[16px] font-bold mt-1.5">Angelo Riana</h3>
                     <p className="text-[11px] text-white/70 mt-0.5">Class : III C | Roll No : 36545</p>
                   </div>
                 </div>

                 <div className="relative z-10 flex items-center justify-between mt-8 border-t border-white/10 pt-4">
                   <div className="flex items-center gap-2">
                     <span className="text-[12px] font-bold">1st Quarterly</span>
                     <span className="bg-[#1DD04A] text-white text-[9px] font-bold px-2 py-0.5 rounded">+ Plus</span>
                   </div>
                   <button className="bg-[#3B82F6] hover:bg-blue-600 transition-colors text-white text-[11px] font-bold px-4 py-1.5 rounded">
                     Edit Profile
                   </button>
                 </div>
              </div>

              {/* Today's Class */}
              <div className="bg-white dark:bg-slate-900 border border-border rounded-xl p-5 card-shadow flex-1">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-[15px] font-semibold text-slate-900 dark:text-white">Today's Class</h3>
                  <button className="text-[11px] font-medium text-slate-500 flex items-center gap-1 hover:text-slate-700">
                    <ChevronLeft className="w-3 h-3" /> 16 May 2024 <ChevronRight className="w-3 h-3" />
                  </button>
                </div>

                <div className="space-y-3">
                  {/* Class 1 */}
                  <div className="flex items-center justify-between p-3 rounded-lg border border-slate-100 dark:border-slate-800 bg-[#F8FAFC] dark:bg-slate-800/30">
                     <div className="flex items-center gap-3">
                       <img src="/asset 13.webp" alt="Teacher" className="w-8 h-8 rounded object-cover" />
                       <div>
                         <h4 className="text-[12px] font-bold text-slate-900 dark:text-white">English</h4>
                         <p className="text-[10px] text-slate-500 mt-0.5 flex items-center gap-1"><Clock className="w-3 h-3" /> 09:00 - 09:45 AM</p>
                       </div>
                     </div>
                     <span className="bg-[#E8F8E8] text-[#1D7F2C] text-[9px] font-bold px-2 py-0.5 rounded flex items-center gap-1">
                       <span className="w-1 h-1 rounded-full bg-[#1D7F2C]"></span> Completed
                     </span>
                  </div>
                  {/* Class 2 */}
                  <div className="flex items-center justify-between p-3 rounded-lg border border-slate-100 dark:border-slate-800 bg-[#F8FAFC] dark:bg-slate-800/30">
                     <div className="flex items-center gap-3">
                       <img src="/asset 14.webp" alt="Teacher" className="w-8 h-8 rounded object-cover" />
                       <div>
                         <h4 className="text-[12px] font-bold text-slate-900 dark:text-white">Chemistry</h4>
                         <p className="text-[10px] text-slate-500 mt-0.5 flex items-center gap-1"><Clock className="w-3 h-3" /> 10:45 - 11:30 AM</p>
                       </div>
                     </div>
                     <span className="bg-[#E8F8E8] text-[#1D7F2C] text-[9px] font-bold px-2 py-0.5 rounded flex items-center gap-1">
                       <span className="w-1 h-1 rounded-full bg-[#1D7F2C]"></span> Completed
                     </span>
                  </div>
                  {/* Class 3 */}
                  <div className="flex items-center justify-between p-3 rounded-lg border border-slate-100 dark:border-slate-800 bg-[#F8FAFC] dark:bg-slate-800/30">
                     <div className="flex items-center gap-3">
                       <img src="/asset 12.webp" alt="Teacher" className="w-8 h-8 rounded object-cover" />
                       <div>
                         <h4 className="text-[12px] font-bold text-slate-900 dark:text-white">Physics</h4>
                         <p className="text-[10px] text-slate-500 mt-0.5 flex items-center gap-1"><Clock className="w-3 h-3" /> 11:30 - 12:15 AM</p>
                       </div>
                     </div>
                     <span className="bg-[#FFF5E6] text-[#F59E0B] text-[9px] font-bold px-2 py-0.5 rounded flex items-center gap-1">
                       <span className="w-1 h-1 rounded-full bg-[#F59E0B]"></span> Inprogress
                     </span>
                  </div>
                </div>
              </div>

            </div>

            {/* Column 2 (Middle): Attendance & Buttons */}
            <div className="lg:col-span-5 flex flex-col gap-6">
              
              {/* Attendance Donut */}
              <div className="bg-white dark:bg-slate-900 border border-border rounded-xl p-5 card-shadow flex-1 flex flex-col relative">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-[15px] font-semibold text-slate-900 dark:text-white">Attendance</h3>
                  <button className="text-[11px] border border-border px-2 py-1 rounded font-medium text-slate-600 dark:text-slate-300 flex items-center gap-1">
                    <CalendarIcon className="w-3 h-3" /> This Week <ChevronDown className="w-3 h-3 ml-1" />
                  </button>
                </div>

                <div className="bg-[#F8FAFC] dark:bg-slate-800/50 rounded flex items-center gap-2 p-2 mb-4">
                  <CalendarIcon className="w-4 h-4 text-[#F59E0B]" />
                  <span className="text-[12px] font-bold text-slate-700 dark:text-slate-300">No of total working days <span className="text-slate-900 dark:text-white font-extrabold">28 Days</span></span>
                </div>

                <div className="flex items-center justify-between px-6 mb-6">
                   <div className="text-center">
                     <p className="text-[11px] text-slate-500 font-medium">Present</p>
                     <p className="text-[16px] font-bold mt-1">25</p>
                   </div>
                   <div className="w-px h-8 bg-border"></div>
                   <div className="text-center">
                     <p className="text-[11px] text-slate-500 font-medium">Absent</p>
                     <p className="text-[16px] font-bold mt-1">2</p>
                   </div>
                   <div className="w-px h-8 bg-border"></div>
                   <div className="text-center">
                     <p className="text-[11px] text-slate-500 font-medium">Halfday</p>
                     <p className="text-[16px] font-bold mt-1">0</p>
                   </div>
                </div>

                {/* Donut Chart SVG */}
                <div className="flex-1 flex flex-col items-center justify-center">
                  <div className="relative w-40 h-40">
                    <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                      {/* Background circle */}
                      <circle cx="50" cy="50" r="40" fill="transparent" stroke="#F1F5F9" strokeWidth="12" className="dark:stroke-slate-800" />
                      
                      {/* Absent (Red) - Top Left (approx 10%) */}
                      <circle cx="50" cy="50" r="40" fill="transparent" stroke="#EF4444" strokeWidth="12"
                        strokeDasharray="251.2" strokeDashoffset={251.2 - (251.2 * 10) / 100}
                        className="transition-all duration-1000 ease-out" />
                        
                      {/* Halfday (Blue) - Bottom Left (approx 15%) */}
                      <circle cx="50" cy="50" r="40" fill="transparent" stroke="#3B82F6" strokeWidth="12"
                        strokeDasharray="251.2" strokeDashoffset={251.2 - (251.2 * 15) / 100}
                        strokeLinecap="round"
                        transform="rotate(36, 50, 50)"
                        className="transition-all duration-1000 ease-out" />

                      {/* Present (Green) - Remaining (approx 75%) */}
                      <circle cx="50" cy="50" r="40" fill="transparent" stroke="#10B981" strokeWidth="12"
                        strokeDasharray="251.2" strokeDashoffset={251.2 - (251.2 * 75) / 100}
                        strokeLinecap="round"
                        transform="rotate(90, 50, 50)"
                        className="transition-all duration-1000 ease-out" />
                    </svg>
                  </div>
                  
                  {/* Legend */}
                  <div className="flex items-center gap-4 mt-6">
                    <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-[#10B981]"></div><span className="text-[11px] text-slate-500 font-medium">Present</span></div>
                    <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-[#3B82F6]"></div><span className="text-[11px] text-slate-500 font-medium">Late</span></div>
                    <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-slate-300"></div><span className="text-[11px] text-slate-500 font-medium">Half Day</span></div>
                    <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-[#EF4444]"></div><span className="text-[11px] text-slate-500 font-medium">Absent</span></div>
                  </div>
                </div>

                {/* Last 7 Days Footer inside Attendance */}
                <div className="mt-6 pt-4 border-t border-border flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-[11px] font-semibold text-slate-900 dark:text-white">Last 7 Days</span>
                    <div className="flex items-center gap-1 mt-1.5">
                      <div className="w-5 h-5 rounded flex items-center justify-center bg-[#10B981] text-white text-[9px] font-bold">M</div>
                      <div className="w-5 h-5 rounded flex items-center justify-center bg-[#10B981] text-white text-[9px] font-bold">T</div>
                      <div className="w-5 h-5 rounded flex items-center justify-center bg-[#10B981] text-white text-[9px] font-bold">W</div>
                      <div className="w-5 h-5 rounded flex items-center justify-center bg-[#10B981] text-white text-[9px] font-bold">T</div>
                      <div className="w-5 h-5 rounded flex items-center justify-center bg-[#EF4444] text-white text-[9px] font-bold">F</div>
                      <div className="w-5 h-5 rounded flex items-center justify-center bg-slate-100 dark:bg-slate-800 text-slate-400 text-[9px] font-bold border border-slate-200 dark:border-slate-700">S</div>
                      <div className="w-5 h-5 rounded flex items-center justify-center bg-slate-100 dark:bg-slate-800 text-slate-400 text-[9px] font-bold border border-slate-200 dark:border-slate-700">S</div>
                    </div>
                  </div>
                  <span className="text-[10px] text-slate-400">18 May 2024 - 24 May 2024</span>
                </div>
              </div>

              {/* Action Buttons Row */}
              <div className="grid grid-cols-4 gap-3">
                <button className="bg-white dark:bg-slate-900 border border-border rounded-xl p-3 flex items-center gap-2 justify-center hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-sm">
                  <div className="w-6 h-6 rounded bg-[#EAEFFF] flex items-center justify-center">
                    <DollarSign className="w-3.5 h-3.5 text-[#F59E0B]" />
                  </div>
                  <span className="text-[12px] font-bold text-slate-700 dark:text-slate-200">Pay Fees</span>
                </button>
                <button className="bg-white dark:bg-slate-900 border border-border rounded-xl p-3 flex items-center gap-2 justify-center hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-sm">
                  <div className="w-6 h-6 rounded bg-[#E8F8E8] flex items-center justify-center">
                    <FileText className="w-3.5 h-3.5 text-[#10B981]" />
                  </div>
                  <span className="text-[12px] font-bold text-slate-700 dark:text-slate-200">Exam Result</span>
                </button>
                <button className="bg-white dark:bg-slate-900 border border-border rounded-xl p-3 flex items-center gap-2 justify-center hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-sm">
                  <div className="w-6 h-6 rounded bg-[#FFF5E6] flex items-center justify-center">
                    <CalendarIcon className="w-3.5 h-3.5 text-[#F59E0B]" />
                  </div>
                  <span className="text-[12px] font-bold text-slate-700 dark:text-slate-200">Calendar</span>
                </button>
                <button className="bg-white dark:bg-slate-900 border border-border rounded-xl p-3 flex items-center gap-2 justify-center hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-sm">
                  <div className="w-6 h-6 rounded bg-[#EAEFFF] flex items-center justify-center">
                    <Users className="w-3.5 h-3.5 text-[#0F172A]" />
                  </div>
                  <span className="text-[12px] font-bold text-slate-700 dark:text-slate-200">Attendance</span>
                </button>
              </div>

            </div>

            {/* Column 3 (Right): Schedules & Exams */}
            <div className="lg:col-span-4 flex flex-col gap-6">
              
              {/* Schedules Calendar */}
              <div className="bg-white dark:bg-slate-900 border border-border rounded-xl p-5 card-shadow">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-[15px] font-semibold text-slate-900 dark:text-white">Schedules</h3>
                  <button className="text-[11px] text-[#F59E0B] font-medium flex items-center gap-1">
                    <Plus className="w-3 h-3" /> Add New
                  </button>
                </div>

                <div className="mb-4 flex items-center justify-between px-2">
                  <button className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded text-slate-400">
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="text-[13px] font-bold text-slate-800 dark:text-slate-200">June 2026</span>
                  <button className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded text-slate-400">
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-7 gap-1 text-center mb-2">
                  {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
                    <div key={day} className="text-[11px] font-semibold text-slate-500 py-1">{day}</div>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-1 text-center">
                  {[31, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((date, i) => {
                    const isToday = date === 8 && i === 8; // Example active day
                    const isMuted = i < 1 || i > 30; // Dim previous/next month dates
                    return (
                      <div key={i} className={`text-[12px] py-1.5 flex justify-center`}>
                        <span className={`w-7 h-7 flex items-center justify-center rounded-full ${isToday ? 'bg-[#F59E0B] text-white font-bold shadow-md shadow-[#F59E0B]/30' : isMuted ? 'text-slate-300 dark:text-slate-600' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer'}`}>
                          {date}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Exams list */}
              <div className="bg-white dark:bg-slate-900 border border-border rounded-xl p-5 card-shadow flex-1">
                 <h3 className="text-[15px] font-semibold text-slate-900 dark:text-white mb-4">Exams</h3>
                 
                 <div className="space-y-4">
                   <div className="border border-slate-100 dark:border-slate-800 rounded-lg p-3">
                     <div className="flex items-center justify-between mb-2">
                       <h4 className="text-[12px] font-bold">1st Quarterly</h4>
                       <span className="bg-[#FFEBF0] text-[#EF4444] text-[9px] font-bold px-2 py-0.5 rounded flex items-center gap-1">
                         <Clock className="w-2.5 h-2.5" /> 19 Days More
                       </span>
                     </div>
                     <div className="flex items-center justify-between">
                       <div>
                         <p className="text-[12px] font-semibold text-slate-700 dark:text-slate-300">Mathematics</p>
                         <p className="text-[10px] text-slate-500 mt-1 flex items-center gap-1"><Clock className="w-3 h-3" /> 01:30 - 02:15 PM</p>
                       </div>
                       <div className="text-right">
                         <p className="text-[10px] text-slate-500 flex items-center justify-end gap-1"><CalendarIcon className="w-3 h-3" /> 06 May 2024</p>
                         <p className="text-[10px] text-[#3B82F6] font-medium mt-1">Room No : 15</p>
                       </div>
                     </div>
                   </div>

                   <div className="border border-slate-100 dark:border-slate-800 rounded-lg p-3">
                     <div className="flex items-center justify-between mb-2">
                       <h4 className="text-[12px] font-bold">2nd Quarterly</h4>
                       <span className="bg-[#FFEBF0] text-[#EF4444] text-[9px] font-bold px-2 py-0.5 rounded flex items-center gap-1">
                         <Clock className="w-2.5 h-2.5" /> 23 Days More
                       </span>
                     </div>
                     <div className="flex items-center justify-between">
                       <div>
                         <p className="text-[12px] font-semibold text-slate-700 dark:text-slate-300">Physics</p>
                         <p className="text-[10px] text-slate-500 mt-1 flex items-center gap-1"><Clock className="w-3 h-3" /> 01:30 - 02:15 PM</p>
                       </div>
                       <div className="text-right">
                         <p className="text-[10px] text-slate-500 flex items-center justify-end gap-1"><CalendarIcon className="w-3 h-3" /> 07 May 2024</p>
                         <p className="text-[10px] text-[#3B82F6] font-medium mt-1">Room No : 15</p>
                       </div>
                     </div>
                   </div>
                 </div>
              </div>

            </div>
          </div>

          {/* Middle Row: Performance (8) & Home Works (4) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Performance */}
            <div className="lg:col-span-8 bg-white dark:bg-slate-900 border border-border rounded-xl p-5 card-shadow flex flex-col">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-[15px] font-semibold text-slate-900 dark:text-white">Performance</h3>
                <button className="text-[11px] border border-border px-2 py-1 rounded font-medium text-slate-600 dark:text-slate-300 flex items-center gap-1">
                  <CalendarIcon className="w-3 h-3" /> 2024 - 2025 <ChevronDown className="w-3 h-3 ml-1" />
                </button>
              </div>

              {/* Area Line Chart SVG Mockup */}
              <div className="flex-1 w-full relative min-h-[200px]">
                {/* Y-axis labels */}
                <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-[10px] text-slate-400 py-4">
                  <span>100</span>
                  <span>75</span>
                  <span>50</span>
                  <span>25</span>
                  <span>0</span>
                </div>
                {/* Grid lines */}
                <div className="absolute left-6 right-0 top-0 h-full flex flex-col justify-between py-5">
                  <div className="border-b border-dashed border-slate-200 dark:border-slate-800 w-full"></div>
                  <div className="border-b border-dashed border-slate-200 dark:border-slate-800 w-full"></div>
                  <div className="border-b border-dashed border-slate-200 dark:border-slate-800 w-full"></div>
                  <div className="border-b border-dashed border-slate-200 dark:border-slate-800 w-full"></div>
                  <div className="border-b border-slate-300 dark:border-slate-700 w-full"></div>
                </div>
                
                {/* SVG Area chart */}
                <svg className="absolute left-6 right-0 top-0 h-full w-[calc(100%-24px)]" preserveAspectRatio="none" viewBox="0 0 100 100">
                  <defs>
                    <linearGradient id="gradBlue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#00B5FF" stopOpacity="0.2" />
                      <stop offset="100%" stopColor="#00B5FF" stopOpacity="0" />
                    </linearGradient>
                    <linearGradient id="gradNavy" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.2" />
                      <stop offset="100%" stopColor="#F59E0B" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  
                  {/* Avg Attendance (Light Blue) line + area */}
                  <path d="M0,30 Q15,20 25,40 T50,50 T75,40 T100,20 L100,85 L0,85 Z" fill="url(#gradBlue)" />
                  <path d="M0,30 Q15,20 25,40 T50,50 T75,40 T100,20" fill="none" stroke="#00B5FF" strokeWidth="2" />
                  
                  {/* Dots for light blue line */}
                  <circle cx="25" cy="40" r="1.5" fill="#00B5FF" />
                  <circle cx="50" cy="50" r="1.5" fill="#00B5FF" />
                  <circle cx="75" cy="40" r="1.5" fill="#00B5FF" />
                  <circle cx="100" cy="20" r="1.5" fill="#00B5FF" />

                  {/* Avg Exam Score (Navy Blue) line + area */}
                  <path d="M0,85 Q15,80 25,70 T50,60 T75,80 T100,50 L100,85 L0,85 Z" fill="url(#gradNavy)" />
                  <path d="M0,85 Q15,80 25,70 T50,60 T75,80 T100,50" fill="none" stroke="#F59E0B" strokeWidth="2" />
                  
                  {/* Dots for navy line */}
                  <circle cx="25" cy="70" r="1.5" fill="#F59E0B" />
                  <circle cx="50" cy="60" r="1.5" fill="#F59E0B" />
                  <circle cx="75" cy="80" r="1.5" fill="#F59E0B" />
                  <circle cx="100" cy="50" r="1.5" fill="#F59E0B" />
                </svg>

                {/* X-axis labels */}
                <div className="absolute left-6 right-0 bottom-0 flex justify-between text-[10px] text-slate-400">
                  <span>Quarter 1</span>
                  <span>Quarter 2</span>
                  <span>Half Yearly</span>
                  <span>Model</span>
                  <span>Final</span>
                </div>
              </div>

              {/* Legend */}
              <div className="flex items-center justify-center gap-6 mt-4">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#F59E0B]"></div>
                  <span className="text-[11px] text-slate-500 font-medium">Avg. Exam Score</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#00B5FF]"></div>
                  <span className="text-[11px] text-slate-500 font-medium">Avg. Attendance</span>
                </div>
              </div>
            </div>

            {/* Home Works */}
            <div className="lg:col-span-4 bg-white dark:bg-slate-900 border border-border rounded-xl p-5 card-shadow">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-[15px] font-semibold text-slate-900 dark:text-white">Home Works</h3>
                <button className="text-[11px] border border-border px-2 py-1 rounded font-medium text-slate-600 dark:text-slate-300 flex items-center gap-1">
                  All Subject <ChevronDown className="w-3 h-3 ml-1" />
                </button>
              </div>

              <div className="space-y-4">
                 {/* Homework 1 */}
                 <div className="flex items-center justify-between gap-3">
                   <img src="/asset 13.webp" alt="Subject" className="w-10 h-10 rounded object-cover" />
                   <div className="flex-1">
                     <p className="text-[10px] text-[#3B82F6] font-bold flex items-center gap-1"><BookOpen className="w-3 h-3" /> Physics</p>
                     <h4 className="text-[12px] font-bold text-slate-900 dark:text-white line-clamp-1">Write about Theory of Pendulum</h4>
                     <div className="flex items-center gap-2 mt-1">
                       <div className="flex items-center gap-1">
                         <img src="/asset 12.webp" className="w-3 h-3 rounded-full" />
                         <span className="text-[10px] text-slate-500">Aaron</span>
                       </div>
                       <span className="text-[10px] text-slate-400">Due by: 16 Jun 2024</span>
                     </div>
                   </div>
                   <div className="relative w-8 h-8 flex items-center justify-center">
                     <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
                       <circle cx="18" cy="18" r="16" fill="transparent" stroke="#F1F5F9" strokeWidth="3" className="dark:stroke-slate-800" />
                       <circle cx="18" cy="18" r="16" fill="transparent" stroke="#10B981" strokeWidth="3" strokeDasharray="100" strokeDashoffset={100 - 92} strokeLinecap="round" />
                     </svg>
                     <span className="absolute text-[8px] font-bold text-slate-700 dark:text-slate-300">92%</span>
                   </div>
                 </div>

                 {/* Homework 2 */}
                 <div className="flex items-center justify-between gap-3">
                   <img src="/asset 14.webp" alt="Subject" className="w-10 h-10 rounded object-cover" />
                   <div className="flex-1">
                     <p className="text-[10px] text-[#10B981] font-bold flex items-center gap-1"><BookOpen className="w-3 h-3" /> Chemistry</p>
                     <h4 className="text-[12px] font-bold text-slate-900 dark:text-white line-clamp-1">Chemistry - Change of Elements</h4>
                     <div className="flex items-center gap-2 mt-1">
                       <div className="flex items-center gap-1">
                         <img src="/asset 15.webp" className="w-3 h-3 rounded-full" />
                         <span className="text-[10px] text-slate-500">Hellan</span>
                       </div>
                       <span className="text-[10px] text-slate-400">Due by: 16 Jun 2024</span>
                     </div>
                   </div>
                   <div className="relative w-8 h-8 flex items-center justify-center">
                     <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
                       <circle cx="18" cy="18" r="16" fill="transparent" stroke="#F1F5F9" strokeWidth="3" className="dark:stroke-slate-800" />
                       <circle cx="18" cy="18" r="16" fill="transparent" stroke="#3B82F6" strokeWidth="3" strokeDasharray="100" strokeDashoffset={100 - 65} strokeLinecap="round" />
                     </svg>
                     <span className="absolute text-[8px] font-bold text-slate-700 dark:text-slate-300">65%</span>
                   </div>
                 </div>

                 {/* Homework 3 */}
                 <div className="flex items-center justify-between gap-3">
                   <img src="/asset 12.webp" alt="Subject" className="w-10 h-10 rounded object-cover" />
                   <div className="flex-1">
                     <p className="text-[10px] text-[#F59E0B] font-bold flex items-center gap-1"><BookOpen className="w-3 h-3" /> Maths</p>
                     <h4 className="text-[12px] font-bold text-slate-900 dark:text-white line-clamp-1">Maths - Problems to Solve Page 21</h4>
                     <div className="flex items-center gap-2 mt-1">
                       <div className="flex items-center gap-1">
                         <img src="/asset 13.webp" className="w-3 h-3 rounded-full" />
                         <span className="text-[10px] text-slate-500">Morgan</span>
                       </div>
                       <span className="text-[10px] text-slate-400">Due by: 21 Jun 2024</span>
                     </div>
                   </div>
                   <div className="relative w-8 h-8 flex items-center justify-center">
                     <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
                       <circle cx="18" cy="18" r="16" fill="transparent" stroke="#F1F5F9" strokeWidth="3" className="dark:stroke-slate-800" />
                       <circle cx="18" cy="18" r="16" fill="transparent" stroke="#F59E0B" strokeWidth="3" strokeDasharray="100" strokeDashoffset={100 - 33} strokeLinecap="round" />
                     </svg>
                     <span className="absolute text-[8px] font-bold text-slate-700 dark:text-slate-300">33%</span>
                   </div>
                 </div>

                 {/* Homework 4 */}
                 <div className="flex items-center justify-between gap-3">
                   <img src="/asset 15.webp" alt="Subject" className="w-10 h-10 rounded object-cover" />
                   <div className="flex-1">
                     <p className="text-[10px] text-[#00B5FF] font-bold flex items-center gap-1"><BookOpen className="w-3 h-3" /> English</p>
                     <h4 className="text-[12px] font-bold text-slate-900 dark:text-white line-clamp-1">English - Vocabulary Introduction</h4>
                     <div className="flex items-center gap-2 mt-1">
                       <div className="flex items-center gap-1">
                         <img src="/asset 14.webp" className="w-3 h-3 rounded-full" />
                         <span className="text-[10px] text-slate-500">Daniel</span>
                       </div>
                       <span className="text-[10px] text-slate-400">Due by: 21 Jun 2024</span>
                     </div>
                   </div>
                   <div className="relative w-8 h-8 flex items-center justify-center">
                     <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
                       <circle cx="18" cy="18" r="16" fill="transparent" stroke="#F1F5F9" strokeWidth="3" className="dark:stroke-slate-800" />
                       <circle cx="18" cy="18" r="16" fill="transparent" stroke="#EF4444" strokeWidth="3" strokeDasharray="100" strokeDashoffset={100 - 10} strokeLinecap="round" />
                     </svg>
                     <span className="absolute text-[8px] font-bold text-slate-700 dark:text-slate-300">10%</span>
                   </div>
                 </div>
              </div>
            </div>

          </div>

          {/* Class Faculties Row */}
          <div className="bg-white dark:bg-slate-900 border border-border rounded-xl p-5 card-shadow relative">
             <div className="flex items-center justify-between mb-4">
                <h3 className="text-[15px] font-semibold text-slate-900 dark:text-white">Class Faculties</h3>
                <div className="flex items-center gap-2">
                  <button className="w-6 h-6 border border-slate-200 dark:border-slate-700 rounded flex items-center justify-center text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800">
                    <ChevronLeft className="w-3 h-3" />
                  </button>
                  <button className="w-6 h-6 border border-slate-200 dark:border-slate-700 rounded flex items-center justify-center text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800">
                    <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
             </div>

             <div className="flex items-center gap-4 overflow-x-auto pb-2 snap-x">
               {/* Teacher 1 */}
               <div className="min-w-[200px] border border-slate-100 dark:border-slate-800 rounded-lg p-3 snap-start">
                 <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-3 mb-3">
                   <img src="/asset 12.webp" className="w-10 h-10 rounded object-cover" />
                   <div>
                     <h4 className="text-[13px] font-bold text-slate-900 dark:text-white">Aaron</h4>
                     <p className="text-[11px] text-slate-500 mt-0.5">Chemistry</p>
                   </div>
                 </div>
                 <div className="grid grid-cols-2 gap-2">
                   <button className="flex items-center justify-center gap-1 text-[11px] font-semibold text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 py-1.5 rounded hover:bg-slate-50 dark:hover:bg-slate-800">
                     <FileText className="w-3 h-3" /> Email
                   </button>
                   <button className="flex items-center justify-center gap-1 text-[11px] font-semibold text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 py-1.5 rounded hover:bg-slate-50 dark:hover:bg-slate-800">
                     <Megaphone className="w-3 h-3" /> Chat
                   </button>
                 </div>
               </div>

               {/* Teacher 2 */}
               <div className="min-w-[200px] border border-slate-100 dark:border-slate-800 rounded-lg p-3 snap-start">
                 <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-3 mb-3">
                   <img src="/asset 13.webp" className="w-10 h-10 rounded object-cover" />
                   <div>
                     <h4 className="text-[13px] font-bold text-slate-900 dark:text-white">Hellan</h4>
                     <p className="text-[11px] text-slate-500 mt-0.5">English</p>
                   </div>
                 </div>
                 <div className="grid grid-cols-2 gap-2">
                   <button className="flex items-center justify-center gap-1 text-[11px] font-semibold text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 py-1.5 rounded hover:bg-slate-50 dark:hover:bg-slate-800">
                     <FileText className="w-3 h-3" /> Email
                   </button>
                   <button className="flex items-center justify-center gap-1 text-[11px] font-semibold text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 py-1.5 rounded hover:bg-slate-50 dark:hover:bg-slate-800">
                     <Megaphone className="w-3 h-3" /> Chat
                   </button>
                 </div>
               </div>

               {/* Teacher 3 */}
               <div className="min-w-[200px] border border-slate-100 dark:border-slate-800 rounded-lg p-3 snap-start">
                 <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-3 mb-3">
                   <img src="/asset 14.webp" className="w-10 h-10 rounded object-cover" />
                   <div>
                     <h4 className="text-[13px] font-bold text-slate-900 dark:text-white">Morgan</h4>
                     <p className="text-[11px] text-slate-500 mt-0.5">Physics</p>
                   </div>
                 </div>
                 <div className="grid grid-cols-2 gap-2">
                   <button className="flex items-center justify-center gap-1 text-[11px] font-semibold text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 py-1.5 rounded hover:bg-slate-50 dark:hover:bg-slate-800">
                     <FileText className="w-3 h-3" /> Email
                   </button>
                   <button className="flex items-center justify-center gap-1 text-[11px] font-semibold text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 py-1.5 rounded hover:bg-slate-50 dark:hover:bg-slate-800">
                     <Megaphone className="w-3 h-3" /> Chat
                   </button>
                 </div>
               </div>

               {/* Teacher 4 */}
               <div className="min-w-[200px] border border-slate-100 dark:border-slate-800 rounded-lg p-3 snap-start">
                 <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-3 mb-3">
                   <img src="/asset 15.webp" className="w-10 h-10 rounded object-cover" />
                   <div>
                     <h4 className="text-[13px] font-bold text-slate-900 dark:text-white">Daniel</h4>
                     <p className="text-[11px] text-slate-500 mt-0.5">Spanish</p>
                   </div>
                 </div>
                 <div className="grid grid-cols-2 gap-2">
                   <button className="flex items-center justify-center gap-1 text-[11px] font-semibold text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 py-1.5 rounded hover:bg-slate-50 dark:hover:bg-slate-800">
                     <FileText className="w-3 h-3" /> Email
                   </button>
                   <button className="flex items-center justify-center gap-1 text-[11px] font-semibold text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 py-1.5 rounded hover:bg-slate-50 dark:hover:bg-slate-800">
                     <Megaphone className="w-3 h-3" /> Chat
                   </button>
                 </div>
               </div>
             </div>
          </div>

          {/* Bottom Grid: 4 Columns (Leave, Exam, Fees, Syllabus) */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            
            {/* Leave Status */}
            <div className="bg-white dark:bg-slate-900 border border-border rounded-xl p-5 card-shadow flex flex-col">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-[15px] font-semibold text-slate-900 dark:text-white">Leave Status</h3>
                <button className="text-[11px] border border-border px-2 py-1 rounded font-medium text-slate-600 dark:text-slate-300 flex items-center gap-1">
                  <CalendarIcon className="w-3 h-3" /> This Month <ChevronDown className="w-3 h-3 ml-1" />
                </button>
              </div>

              <div className="space-y-4 flex-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded bg-[#FFEBF0] text-[#FF4A6B] flex items-center justify-center">
                      <X className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-[13px] font-bold text-slate-900 dark:text-white">Emergency Leave</h4>
                      <p className="text-[10px] text-slate-500 mt-0.5">Date : 15 Jun 2024</p>
                    </div>
                  </div>
                  <span className="bg-[#E6F8FF] text-[#00B5FF] text-[9px] font-bold px-2 py-0.5 rounded">Pending</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded bg-[#EAEFFF] text-[#F59E0B] flex items-center justify-center">
                      <Plus className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-[13px] font-bold text-slate-900 dark:text-white">Medical Leave</h4>
                      <p className="text-[10px] text-slate-500 mt-0.5">Date : 15 Jun 2024</p>
                    </div>
                  </div>
                  <span className="bg-[#E8F8E8] text-[#1DD04A] text-[9px] font-bold px-2 py-0.5 rounded">Approved</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded bg-[#EAEFFF] text-[#F59E0B] flex items-center justify-center">
                      <Plus className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-[13px] font-bold text-slate-900 dark:text-white">Medical Leave</h4>
                      <p className="text-[10px] text-slate-500 mt-0.5">Date : 14 Jun 2024</p>
                    </div>
                  </div>
                  <span className="bg-[#FFEBF0] text-[#EF4444] text-[9px] font-bold px-2 py-0.5 rounded">Declined</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded bg-[#FFEBF0] text-[#FF4A6B] flex items-center justify-center">
                      <RefreshCcw className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-[13px] font-bold text-slate-900 dark:text-white">Fever</h4>
                      <p className="text-[10px] text-slate-500 mt-0.5">Date : 10 Jun 2024</p>
                    </div>
                  </div>
                  <span className="bg-[#E8F8E8] text-[#1DD04A] text-[9px] font-bold px-2 py-0.5 rounded">Approved</span>
                </div>
              </div>
            </div>

            {/* Exam Result (Bar Chart) */}
            <div className="bg-white dark:bg-slate-900 border border-border rounded-xl p-5 card-shadow flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-[15px] font-semibold text-slate-900 dark:text-white">Exam Result</h3>
                <button className="text-[11px] border border-border px-2 py-1 rounded font-medium text-slate-600 dark:text-slate-300 flex items-center gap-1">
                  <CalendarIcon className="w-3 h-3" /> 1st Quarter <ChevronDown className="w-3 h-3 ml-1" />
                </button>
              </div>
              
              {/* Legend Badges */}
              <div className="flex items-center justify-center gap-2 mb-6 text-[10px] font-bold border-b border-border pb-4">
                <span className="bg-[#EAEFFF] text-[#F59E0B] px-2 py-0.5 rounded">Mat : 100</span>
                <span className="bg-[#E8F8E8] text-[#1DD04A] px-2 py-0.5 rounded">Phy : 92</span>
                <span className="bg-[#FFF5E6] text-[#F59E0B] px-2 py-0.5 rounded">Che : 90</span>
                <span className="bg-[#FFEBF0] text-[#EF4444] px-2 py-0.5 rounded">Eng : 80</span>
              </div>

              {/* Bar Chart */}
              <div className="flex-1 flex items-end justify-between px-2 pt-2 relative min-h-[140px]">
                {/* Grid Lines */}
                <div className="absolute left-0 top-0 h-full w-full flex flex-col justify-between py-1 z-0 pointer-events-none">
                  <div className="border-b border-dashed border-slate-200 dark:border-slate-800 flex items-center"><span className="absolute -left-2 text-[9px] text-slate-400">100</span></div>
                  <div className="border-b border-dashed border-slate-200 dark:border-slate-800 flex items-center"><span className="absolute -left-2 text-[9px] text-slate-400">80</span></div>
                  <div className="border-b border-dashed border-slate-200 dark:border-slate-800 flex items-center"><span className="absolute -left-2 text-[9px] text-slate-400">60</span></div>
                  <div className="border-b border-dashed border-slate-200 dark:border-slate-800 flex items-center"><span className="absolute -left-2 text-[9px] text-slate-400">40</span></div>
                  <div className="border-b border-dashed border-slate-200 dark:border-slate-800 flex items-center"><span className="absolute -left-2 text-[9px] text-slate-400">20</span></div>
                  <div className="border-b border-slate-300 dark:border-slate-700 flex items-center"><span className="absolute -left-2 text-[9px] text-slate-400">0</span></div>
                </div>

                {/* Bars */}
                <div className="flex flex-col items-center gap-1 z-10">
                  <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300">100%</span>
                  <div className="w-6 bg-slate-200 dark:bg-slate-700 rounded-t" style={{height: '100px'}}></div>
                  <span className="text-[10px] text-slate-500 mt-1">Mat</span>
                </div>
                <div className="flex flex-col items-center gap-1 z-10">
                  <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300">92%</span>
                  <div className="w-6 bg-[#F59E0B] rounded-t" style={{height: '92px'}}></div>
                  <span className="text-[10px] text-slate-500 mt-1">Phy</span>
                </div>
                <div className="flex flex-col items-center gap-1 z-10">
                  <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300">86%</span>
                  <div className="w-6 bg-slate-200 dark:bg-slate-700 rounded-t" style={{height: '86px'}}></div>
                  <span className="text-[10px] text-slate-500 mt-1">Che</span>
                </div>
                <div className="flex flex-col items-center gap-1 z-10">
                  <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300">82%</span>
                  <div className="w-6 bg-slate-200 dark:bg-slate-700 rounded-t" style={{height: '82px'}}></div>
                  <span className="text-[10px] text-slate-500 mt-1">Eng</span>
                </div>
                <div className="flex flex-col items-center gap-1 z-10">
                  <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300">90%</span>
                  <div className="w-6 bg-slate-200 dark:bg-slate-700 rounded-t" style={{height: '90px'}}></div>
                  <span className="text-[10px] text-slate-500 mt-1">Sci</span>
                </div>
              </div>
            </div>

            {/* Fees Reminder */}
            <div className="bg-white dark:bg-slate-900 border border-border rounded-xl p-5 card-shadow flex flex-col">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-[15px] font-semibold text-slate-900 dark:text-white">Fees Reminder</h3>
                <Link href="#" className="text-[12px] font-semibold text-[#F59E0B]">View All</Link>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#EAEFFF] text-[#F59E0B] flex items-center justify-center">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-[12px] font-bold text-slate-900 dark:text-white">Transport Fees</h4>
                      <p className="text-[11px] text-slate-500 mt-0.5">$2500</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[11px] font-bold text-slate-900 dark:text-white">Last Date</p>
                    <p className="text-[10px] text-slate-500 mt-0.5">25 May 2024</p>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#E8F8E8] text-[#1DD04A] flex items-center justify-center">
                      <BookOpen className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-[12px] font-bold text-slate-900 dark:text-white">Book Fees</h4>
                      <p className="text-[11px] text-slate-500 mt-0.5">$2500</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[11px] font-bold text-slate-900 dark:text-white">Last Date</p>
                    <p className="text-[10px] text-slate-500 mt-0.5">25 May 2024</p>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#EAEFFF] text-[#F59E0B] flex items-center justify-center">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-[12px] font-bold text-slate-900 dark:text-white">Exam Fees</h4>
                      <p className="text-[11px] text-slate-500 mt-0.5">$2500</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[11px] font-bold text-slate-900 dark:text-white">Last Date</p>
                    <p className="text-[10px] text-slate-500 mt-0.5">25 May 2024</p>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#E6F8FF] text-[#00B5FF] flex items-center justify-center">
                      <DollarSign className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-[12px] font-bold text-slate-900 dark:text-white">Mess Fees <span className="text-[#EF4444] text-[9px] bg-[#FFEBF0] px-1 rounded ml-1">Due</span></h4>
                      <p className="text-[11px] text-[#EF4444] font-medium mt-0.5">$2500 + $150</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[11px] font-bold text-slate-900 dark:text-white">Last Date</p>
                    <p className="text-[10px] text-slate-500 mt-0.5">25 May 2024</p>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#FFEBF0] text-[#EF4444] flex items-center justify-center">
                      <Building2 className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-[12px] font-bold text-slate-900 dark:text-white">Hostel</h4>
                      <p className="text-[11px] text-slate-500 mt-0.5">$2500</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[11px] font-bold text-slate-900 dark:text-white">Last Date</p>
                    <p className="text-[10px] text-slate-500 mt-0.5">25 May 2024</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Syllabus */}
            <div className="bg-white dark:bg-slate-900 border border-border rounded-xl p-5 card-shadow flex flex-col">
              <h3 className="text-[15px] font-semibold text-slate-900 dark:text-white mb-4">Syllabus</h3>
              
              <div className="bg-[#E8F8E8] text-[#1D7F2C] text-[11px] font-medium p-2.5 rounded-lg flex gap-2 mb-5">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <p>These Results are obtained from the syllabus completion on the respective Class.</p>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[12px] font-bold text-slate-800 dark:text-slate-200">Maths</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5">
                    <div className="bg-[#F59E0B] h-1.5 rounded-full" style={{ width: '40%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[12px] font-bold text-slate-800 dark:text-slate-200">Physics</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5">
                    <div className="bg-[#00B5FF] h-1.5 rounded-full" style={{ width: '30%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[12px] font-bold text-slate-800 dark:text-slate-200">Chemistry</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5">
                    <div className="bg-[#F59E0B] h-1.5 rounded-full" style={{ width: '60%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[12px] font-bold text-slate-800 dark:text-slate-200">Botany</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5">
                    <div className="bg-[#1DD04A] h-1.5 rounded-full" style={{ width: '80%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[12px] font-bold text-slate-800 dark:text-slate-200">English</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5">
                    <div className="bg-[#F59E0B] h-1.5 rounded-full" style={{ width: '90%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[12px] font-bold text-slate-800 dark:text-slate-200">Spanish</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5">
                    <div className="bg-[#EF4444] h-1.5 rounded-full" style={{ width: '60%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[12px] font-bold text-slate-800 dark:text-slate-200">Japanese</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5">
                    <div className="bg-[#F59E0B] h-1.5 rounded-full" style={{ width: '85%' }}></div>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Footer Grid: Notice Board & Todo */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Notice Board */}
            <div className="bg-white dark:bg-slate-900 border border-border rounded-xl p-5 card-shadow flex flex-col text-left">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-[15px] font-semibold text-slate-900 dark:text-white">Notice Board</h3>
                <Link href="/dashboard/notices" className="text-[12px] font-semibold text-[#F59E0B]">View All</Link>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded bg-[#EAEFFF] text-[#F59E0B] flex items-center justify-center shrink-0">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-[13px] font-bold text-slate-900 dark:text-white">New Syllabus Instructions</h4>
                    <p className="text-[10px] text-slate-500 mt-0.5 flex items-center gap-1"><CalendarIcon className="w-3 h-3" /> Added on : 11 Mar 2024</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded bg-[#E8F8E8] text-[#1DD04A] flex items-center justify-center shrink-0">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-[13px] font-bold text-slate-900 dark:text-white">World Environment Day Program...!!</h4>
                    <p className="text-[10px] text-slate-500 mt-0.5 flex items-center gap-1"><CalendarIcon className="w-3 h-3" /> Added on : 21 Apr 2024</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded bg-[#FFEBF0] text-[#EF4444] flex items-center justify-center shrink-0">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-[13px] font-bold text-slate-900 dark:text-white">Exam Preparation Notification!</h4>
                    <p className="text-[10px] text-slate-500 mt-0.5 flex items-center gap-1"><CalendarIcon className="w-3 h-3" /> Added on : 13 Mar 2024</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded bg-[#E6F8FF] text-[#00B5FF] flex items-center justify-center shrink-0">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-[13px] font-bold text-slate-900 dark:text-white">Online Classes Preparation</h4>
                    <p className="text-[10px] text-slate-500 mt-0.5 flex items-center gap-1"><CalendarIcon className="w-3 h-3" /> Added on : 24 May 2024</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
                </div>
              </div>
            </div>

            {/* Todo List */}
            <div className="bg-white dark:bg-slate-900 border border-border rounded-xl p-5 card-shadow flex flex-col text-left">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-[15px] font-semibold text-slate-900 dark:text-white">Todo</h3>
                <button className="text-[11px] border border-border px-2 py-1 rounded font-medium text-slate-600 dark:text-slate-300 flex items-center gap-1">
                  <CalendarIcon className="w-3 h-3" /> Today <ChevronDown className="w-3 h-3 ml-1" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="flex items-start justify-between">
                   <div className="flex items-start gap-3">
                     <div className="w-4 h-4 rounded bg-[#F59E0B] flex items-center justify-center text-white shrink-0 mt-0.5">
                       <CheckCircle2 className="w-3 h-3" />
                     </div>
                     <div>
                       <h4 className="text-[13px] font-bold text-slate-900 dark:text-white line-clamp-1">Send Reminder to Students</h4>
                       <p className="text-[10px] text-slate-500 mt-0.5">01:00 PM</p>
                     </div>
                   </div>
                   <span className="bg-[#E8F8E8] text-[#1DD04A] text-[9px] font-bold px-2 py-0.5 rounded ml-2 shrink-0">Completed</span>
                </div>
                
                <div className="flex items-start justify-between">
                   <div className="flex items-start gap-3">
                     <div className="w-4 h-4 rounded border border-slate-300 dark:border-slate-600 shrink-0 mt-0.5"></div>
                     <div>
                       <h4 className="text-[13px] font-bold text-slate-900 dark:text-white line-clamp-1">Create Routine to new staff</h4>
                       <p className="text-[10px] text-slate-500 mt-0.5">04:50 PM</p>
                     </div>
                   </div>
                   <span className="bg-[#E6F8FF] text-[#00B5FF] text-[9px] font-bold px-2 py-0.5 rounded ml-2 shrink-0">Inprogress</span>
                </div>

                <div className="flex items-start justify-between">
                   <div className="flex items-start gap-3">
                     <div className="w-4 h-4 rounded border border-slate-300 dark:border-slate-600 shrink-0 mt-0.5"></div>
                     <div>
                       <h4 className="text-[13px] font-bold text-slate-900 dark:text-white line-clamp-1">Extra Class Info to Students</h4>
                       <p className="text-[10px] text-slate-500 mt-0.5">04:55 PM</p>
                     </div>
                   </div>
                   <span className="bg-[#FFF5E6] text-[#F59E0B] text-[9px] font-bold px-2 py-0.5 rounded ml-2 shrink-0">Yet to Start</span>
                </div>

                <div className="flex items-start justify-between">
                   <div className="flex items-start gap-3">
                     <div className="w-4 h-4 rounded border border-slate-300 dark:border-slate-600 shrink-0 mt-0.5"></div>
                     <div>
                       <h4 className="text-[13px] font-bold text-slate-900 dark:text-white line-clamp-1">Fees for Upcoming Academics</h4>
                       <p className="text-[10px] text-slate-500 mt-0.5">04:55 PM</p>
                     </div>
                   </div>
                   <span className="bg-[#FFF5E6] text-[#F59E0B] text-[9px] font-bold px-2 py-0.5 rounded ml-2 shrink-0">Yet to Start</span>
                </div>

                <div className="flex items-start justify-between">
                   <div className="flex items-start gap-3">
                     <div className="w-4 h-4 rounded border border-slate-300 dark:border-slate-600 shrink-0 mt-0.5"></div>
                     <div>
                       <h4 className="text-[13px] font-bold text-slate-900 dark:text-white line-clamp-1">English - Essay on Visit</h4>
                       <p className="text-[10px] text-slate-500 mt-0.5">05:55 PM</p>
                     </div>
                   </div>
                   <span className="bg-[#FFF5E6] text-[#F59E0B] text-[9px] font-bold px-2 py-0.5 rounded ml-2 shrink-0">Yet to Start</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
