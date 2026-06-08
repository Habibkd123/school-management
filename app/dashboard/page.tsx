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
  Megaphone
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
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            {activeRole === "admin"
              ? "Admin Dashboard"
              : activeRole === "teacher"
                ? "Teacher Dashboard"
                : "Student Dashboard"}
          </h1>
          <div className="flex items-center gap-2 text-[13px] text-slate-500 mt-1">
            <span>Dashboard</span>
            <span>/</span>
            <span className="text-slate-700">
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
                className="flex items-center gap-2 px-4 py-2 text-[13px] font-semibold text-white bg-[#5D6BEE] hover:bg-[#4b58ce] rounded-lg shadow-sm transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Student</span>
              </Link>
              <Link
                href="/dashboard/fees"
                className="flex items-center gap-2 px-4 py-2 text-[13px] font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
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
                <img src="/asset 14.webp" alt="Avatar" className="w-7 h-7 rounded-full bg-white object-cover" />
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
            <div className="bg-white border border-border rounded-xl p-5 card-shadow flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <img src="/asset 7.webp" alt="Students" className="w-[52px] h-[52px] object-contain" />
                  <div className="text-left">
                    <h3 className="text-2xl font-semibold text-slate-900 leading-none">3654</h3>
                    <p className="text-[13px] text-slate-500 mt-1">Total Students</p>
                  </div>
                </div>
                <span className="bg-[#FF4A6B] text-white text-[10px] font-bold px-2 py-0.5 rounded">1.2%</span>
              </div>
              <div className="flex items-center justify-between text-[12px] pt-4 border-t border-slate-100">
                <span className="text-slate-500">Active : <strong className="text-slate-900">3643</strong></span>
                <span className="text-slate-300">|</span>
                <span className="text-slate-500">Inactive : <strong className="text-slate-900">11</strong></span>
              </div>
            </div>

            {/* Teachers Card */}
            <div className="bg-white border border-border rounded-xl p-5 card-shadow flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <img src="/asset 8.webp" alt="Teachers" className="w-[52px] h-[52px] object-contain" />
                  <div className="text-left">
                    <h3 className="text-2xl font-semibold text-slate-900 leading-none">284</h3>
                    <p className="text-[13px] text-slate-500 mt-1">Total Teachers</p>
                  </div>
                </div>
                <span className="bg-[#00B5FF] text-white text-[10px] font-bold px-2 py-0.5 rounded">1.2%</span>
              </div>
              <div className="flex items-center justify-between text-[12px] pt-4 border-t border-slate-100">
                <span className="text-slate-500">Active : <strong className="text-slate-900">254</strong></span>
                <span className="text-slate-300">|</span>
                <span className="text-slate-500">Inactive : <strong className="text-slate-900">30</strong></span>
              </div>
            </div>

            {/* Staff Card */}
            <div className="bg-white border border-border rounded-xl p-5 card-shadow flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <img src="/asset 9.webp" alt="Staff" className="w-[52px] h-[52px] object-contain" />
                  <div className="text-left">
                    <h3 className="text-2xl font-semibold text-slate-900 leading-none">162</h3>
                    <p className="text-[13px] text-slate-500 mt-1">Total Staff</p>
                  </div>
                </div>
                <span className="bg-[#FFB800] text-white text-[10px] font-bold px-2 py-0.5 rounded">1.2%</span>
              </div>
              <div className="flex items-center justify-between text-[12px] pt-4 border-t border-slate-100">
                <span className="text-slate-500">Active : <strong className="text-slate-900">161</strong></span>
                <span className="text-slate-300">|</span>
                <span className="text-slate-500">Inactive : <strong className="text-slate-900">02</strong></span>
              </div>
            </div>

            {/* Subjects Card */}
            <div className="bg-white border border-border rounded-xl p-5 card-shadow flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <img src="/asset 10.webp" alt="Subjects" className="w-[52px] h-[52px] object-contain" />
                  <div className="text-left">
                    <h3 className="text-2xl font-semibold text-slate-900 leading-none">82</h3>
                    <p className="text-[13px] text-slate-500 mt-1">Total Subjects</p>
                  </div>
                </div>
                <span className="bg-[#1DD04A] text-white text-[10px] font-bold px-2 py-0.5 rounded">1.2%</span>
              </div>
              <div className="flex items-center justify-between text-[12px] pt-4 border-t border-slate-100">
                <span className="text-slate-500">Active : <strong className="text-slate-900">81</strong></span>
                <span className="text-slate-300">|</span>
                <span className="text-slate-500">Inactive : <strong className="text-slate-900">01</strong></span>
              </div>
            </div>
          </div>

          {/* 3-Column Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* COLUMN 1: Schedules & Upcoming Events */}
            <div className="space-y-6">
              {/* Schedules Card */}
              <div className="bg-white border border-border rounded-xl p-6 card-shadow flex flex-col">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-[15px] font-semibold text-slate-900">Schedules</h3>
                  <button className="text-[12px] font-semibold text-[#5D6BEE] flex items-center gap-1 hover:text-[#4b58ce]">
                    <Plus className="w-3.5 h-3.5" />
                    Add New
                  </button>
                </div>

                {/* Mock Calendar */}
                <div className="w-full text-center">
                  <div className="flex items-center justify-between mb-4 px-2">
                    <button className="p-1 hover:bg-slate-100 rounded text-slate-400">
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <span className="font-bold text-[14px] text-slate-900">June 2026</span>
                    <button className="p-1 hover:bg-slate-100 rounded text-slate-400">
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="grid grid-cols-7 gap-1 text-[12px] font-semibold text-slate-900 mb-2">
                    <div>Su</div><div>Mo</div><div>Tu</div><div>We</div><div>Th</div><div>Fr</div><div>Sa</div>
                  </div>
                  <div className="grid grid-cols-7 gap-1 text-[13px] text-slate-600">
                    <div className="p-2 text-slate-400">31</div>
                    <div className="p-2">1</div><div className="p-2">2</div><div className="p-2">3</div>
                    <div className="p-2">4</div><div className="p-2">5</div><div className="p-2">6</div>
                    <div className="p-2 bg-[#5D6BEE] text-white rounded-lg font-bold shadow-sm">7</div>
                    <div className="p-2">8</div><div className="p-2">9</div><div className="p-2">10</div>
                    <div className="p-2">11</div><div className="p-2">12</div><div className="p-2">13</div>
                    <div className="p-2">14</div><div className="p-2">15</div><div className="p-2">16</div>
                    <div className="p-2">17</div><div className="p-2">18</div><div className="p-2">19</div>
                    <div className="p-2">20</div>
                  </div>
                </div>
              </div>

              {/* Upcoming Events Card */}
              <div className="bg-white border border-border rounded-xl p-6 card-shadow flex flex-col  text-left">
                <h3 className="text-[15px] font-semibold text-slate-900 mb-5">Upcoming Events</h3>
                <div className="space-y-4">

                  {/* Event 1 */}
                  <div className="relative pl-4 border-l-2 border-[#00B5FF] py-1">
                    <div className="flex gap-3">
                      <div className="w-10 h-10 rounded-lg bg-[#E6F8FF] text-[#00B5FF] flex items-center justify-center shrink-0">
                        <UserCheck className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-[13px] font-semibold text-slate-900">Parents, Teacher Meet</h4>
                        <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mt-1">
                          <CalendarIcon className="w-3.5 h-3.5" /> 15 July 2024
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
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
                        <h4 className="text-[13px] font-semibold text-slate-900">Parents, Teacher Meet</h4>
                        <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mt-1">
                          <CalendarIcon className="w-3.5 h-3.5" /> 15 July 2024
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
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
                        <h4 className="text-[13px] font-semibold text-slate-900">Vacation Meeting</h4>
                        <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mt-1">
                          <CalendarIcon className="w-3.5 h-3.5" /> 07 July 2024 - 07 July 2024
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
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
              <div className="bg-white border border-border rounded-xl p-6 card-shadow flex flex-col text-left">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-[15px] font-semibold text-slate-900">Attendance</h3>
                  <button className="text-[12px] font-medium text-slate-500 flex items-center gap-1">
                    <CalendarIcon className="w-3.5 h-3.5" /> Today <span className="ml-1 text-[10px]">▼</span>
                  </button>
                </div>

                {/* Tabs */}
                <div className="flex items-center gap-6 border-b border-border text-[13px]">
                  <span className="font-semibold text-[#5D6BEE] border-b-2 border-[#5D6BEE] pb-2 px-1">Students</span>
                  <span className="text-slate-500 pb-2 px-1 hover:text-slate-700 cursor-pointer">Teachers</span>
                  <span className="text-slate-500 pb-2 px-1 hover:text-slate-700 cursor-pointer">Staff</span>
                </div>

                {/* Stats Blocks */}
                <div className="grid grid-cols-3 gap-2 mt-5">
                  <div className="bg-[#F8F9FA] rounded-lg p-3 text-center border border-slate-100">
                    <div className="text-[15px] font-bold text-slate-900">28</div>
                    <div className="text-[10px] text-slate-500">Emergency</div>
                  </div>
                  <div className="bg-[#F8F9FA] rounded-lg p-3 text-center border border-slate-100">
                    <div className="text-[15px] font-bold text-slate-900">01</div>
                    <div className="text-[10px] text-slate-500">Absent</div>
                  </div>
                  <div className="bg-[#F8F9FA] rounded-lg p-3 text-center border border-slate-100">
                    <div className="text-[15px] font-bold text-slate-900">01</div>
                    <div className="text-[10px] text-slate-500">Late</div>
                  </div>
                </div>

                {/* Half Donut Mockup */}
                <div className="flex-1 mt-6 flex flex-col items-center justify-end overflow-hidden relative min-h-[140px]">
                  <svg viewBox="0 0 100 50" className="w-[80%] h-auto drop-shadow-md">
                    <path d="M 10 50 A 40 40 0 0 1 90 50" fill="none" stroke="#5D6BEE" strokeWidth="20" />
                    <path d="M 85 50 A 40 40 0 0 0 90 50" fill="none" stroke="#1DD04A" strokeWidth="20" />
                  </svg>
                  <div className="absolute bottom-5 text-white text-[11px] font-bold">98.8%</div>
                </div>
                <div className="mt-4 flex justify-center">
                  <button className="bg-[#F1F3F5] text-slate-600 font-semibold text-[12px] px-4 py-2 rounded-lg flex items-center gap-1.5 hover:bg-slate-200">
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
                    <button className="w-5 h-5 bg-white rounded-full flex items-center justify-center text-[#3DC84A]"><ChevronLeft className="w-3 h-3" /></button>
                    <button className="w-5 h-5 bg-white rounded-full flex items-center justify-center text-[#3DC84A]"><ChevronRight className="w-3 h-3" /></button>
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
                    <button className="w-5 h-5 bg-white rounded-full flex items-center justify-center text-[#1975D1]"><ChevronLeft className="w-3 h-3" /></button>
                    <button className="w-5 h-5 bg-white rounded-full flex items-center justify-center text-[#1975D1]"><ChevronRight className="w-3 h-3" /></button>
                  </div> */}
                  <img src="/performer-01.png" alt="Tenesa" className="absolute bottom-0 w-[85%] object-contain" />
                </div>
              </div>
            </div>

            {/* COLUMN 3: Quick Links, Class Routine, Performance */}
            <div className="space-y-6">

              {/* Quick Links Card */}
              <div className="bg-white border border-border rounded-xl p-6 card-shadow flex flex-col text-left">
                <h3 className="text-[15px] font-semibold text-slate-900 mb-5">Quick Links</h3>
                <div className="grid grid-cols-3 gap-3">
                  <Link href="/dashboard" className="flex flex-col items-center gap-2 p-2 hover:bg-slate-50 rounded-lg group">
                    <div className="w-12 h-12 rounded-full bg-[#E8F8E8] border border-[#BDE8B5] text-[#1D7F2C] flex items-center justify-center group-hover:scale-105 transition-transform">
                      <CalendarIcon className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] font-semibold text-slate-700">Calendar</span>
                  </Link>
                  <Link href="/dashboard/results" className="flex flex-col items-center gap-2 p-2 hover:bg-slate-50 rounded-lg group">
                    <div className="w-12 h-12 rounded-full bg-[#EAEFFF] border border-[#C5D5FF] text-[#3B66FF] flex items-center justify-center group-hover:scale-105 transition-transform">
                      <FileText className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] font-semibold text-slate-700 text-center leading-tight">Exam Result</span>
                  </Link>
                  <Link href="/dashboard/attendance" className="flex flex-col items-center gap-2 p-2 hover:bg-slate-50 rounded-lg group">
                    <div className="w-12 h-12 rounded-full bg-[#FFF7E6] border border-[#FFE7B3] text-[#F59E0B] flex items-center justify-center group-hover:scale-105 transition-transform">
                      <UserCheck className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] font-semibold text-slate-700">Attendance</span>
                  </Link>
                  <Link href="/dashboard/fees" className="flex flex-col items-center gap-2 p-2 hover:bg-slate-50 rounded-lg group">
                    <div className="w-12 h-12 rounded-full bg-[#E6F8FF] border border-[#B3EEFF] text-[#00B5FF] flex items-center justify-center group-hover:scale-105 transition-transform">
                      <DollarSign className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] font-semibold text-slate-700">Fees</span>
                  </Link>
                  <Link href="/dashboard/homework" className="flex flex-col items-center gap-2 p-2 hover:bg-slate-50 rounded-lg group">
                    <div className="w-12 h-12 rounded-full bg-[#FFEBF0] border border-[#FFCCD8] text-[#FF4A6B] flex items-center justify-center group-hover:scale-105 transition-transform">
                      <BookOpen className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] font-semibold text-slate-700 text-center leading-tight">Home work</span>
                  </Link>
                  <Link href="/dashboard" className="flex flex-col items-center gap-2 p-2 hover:bg-slate-50 rounded-lg group">
                    <div className="w-12 h-12 rounded-full bg-[#EAF9F5] border border-[#C4F0E4] text-[#1DD04A] flex items-center justify-center group-hover:scale-105 transition-transform">
                      <FileText className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] font-semibold text-slate-700">Reports</span>
                  </Link>
                </div>
              </div>

              {/* Class Routine Card */}
              <div className="bg-white border border-border rounded-xl p-6 card-shadow flex flex-col text-left">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-[15px] font-semibold text-slate-900">Class Routine</h3>
                  <button className="text-[12px] font-semibold text-[#5D6BEE] flex items-center gap-1 hover:text-[#4b58ce]">
                    <Plus className="w-3.5 h-3.5" />
                    Add New
                  </button>
                </div>
                <div className="space-y-4">
                  {/* Routine Item */}
                  <div className="border border-border rounded-xl p-3 flex gap-3 items-center">
                    <img src="/asset 12.webp" alt="Avatar" className="w-10 h-10 rounded-lg object-cover bg-slate-100" />
                    <div className="flex-1">
                      <p className="text-[12px] text-slate-500 mb-1.5">Oct 2024</p>
                      <div className="w-full bg-slate-100 rounded-full h-1.5">
                        <div className="bg-[#5D6BEE] h-1.5 rounded-full" style={{ width: '80%' }}></div>
                      </div>
                    </div>
                  </div>
                  {/* Routine Item */}
                  <div className="border border-border rounded-xl p-3 flex gap-3 items-center">
                    <img src="/asset 14.webp" alt="Avatar" className="w-10 h-10 rounded-lg object-cover bg-slate-100" />
                    <div className="flex-1">
                      <p className="text-[12px] text-slate-500 mb-1.5">Nov 2024</p>
                      <div className="w-full bg-slate-100 rounded-full h-1.5">
                        <div className="bg-[#FFB800] h-1.5 rounded-full" style={{ width: '70%' }}></div>
                      </div>
                    </div>
                  </div>
                  {/* Routine Item */}
                  <div className="border border-border rounded-xl p-3 flex gap-3 items-center">
                    <img src="/asset 13.webp" alt="Avatar" className="w-10 h-10 rounded-lg object-cover bg-slate-100" />
                    <div className="flex-1">
                      <p className="text-[12px] text-slate-500 mb-1.5">Oct 2024</p>
                      <div className="w-full bg-slate-100 rounded-full h-1.5">
                        <div className="bg-[#1DD04A] h-1.5 rounded-full" style={{ width: '60%' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Performance Card */}
              <div className="bg-white border border-border rounded-xl p-6 card-shadow flex flex-col text-left">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-[15px] font-semibold text-slate-900">Performance</h3>
                  <button className="text-[12px] font-medium text-slate-500 flex items-center gap-1">
                    Class II <span className="ml-1 text-[10px]">▼</span>
                  </button>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex-1 space-y-3 border border-border rounded-xl p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#5D6BEE]"></span>
                        <span className="text-[12px] text-slate-500">Top</span>
                      </div>
                      <span className="text-[14px] font-bold text-slate-900">45</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#FFB800]"></span>
                        <span className="text-[12px] text-slate-500">Average</span>
                      </div>
                      <span className="text-[14px] font-bold text-slate-900">11</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#FF4A6B]"></span>
                        <span className="text-[12px] text-slate-500">Below Avg</span>
                      </div>
                      <span className="text-[14px] font-bold text-slate-900">02</span>
                    </div>
                  </div>

                  <div className="w-[100px] h-[100px] relative shrink-0">
                    {/* Recreating Donut Chart with SVG to match exact colors */}
                    <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                      <circle cx="50" cy="50" r="40" fill="none" stroke="#5D6BEE" strokeWidth="18" strokeDasharray="251.2" strokeDashoffset="0" />
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
            <div className="lg:col-span-2 bg-white border border-border rounded-xl p-6 card-shadow flex flex-col text-left">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-[15px] font-semibold text-slate-900">Fees Collection</h3>
                <button className="text-[12px] font-medium text-slate-500 flex items-center gap-1">
                  <CalendarIcon className="w-3.5 h-3.5" /> Last 8 Quarter <span className="ml-1 text-[10px]">▼</span>
                </button>
              </div>
              <div className="flex items-center gap-4 text-[11px] font-semibold text-slate-500 mb-4">
                <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 bg-[#5D6BEE] rounded-sm"></span> Collected Fee</div>
                <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 bg-slate-200 rounded-sm"></span> Total Fee</div>
              </div>
              <div className="flex-1 mt-2 min-h-[160px] relative">
                {/* Custom CSS Grouped Bar Chart Mockup */}
                <div className="absolute inset-0 flex items-end justify-between px-4 pb-6 border-b border-slate-200">
                  <div className="flex flex-col items-center gap-2 h-full justify-end">
                    <div className="w-10 bg-slate-200 h-[70%] rounded-t flex flex-col justify-end overflow-hidden"><div className="w-full bg-[#5D6BEE] h-[40%]"></div></div>
                    <span className="text-[10px] text-slate-500 font-semibold mt-2">Q1: 2023</span>
                  </div>
                  <div className="flex flex-col items-center gap-2 h-full justify-end">
                    <div className="w-10 bg-slate-200 h-[80%] rounded-t flex flex-col justify-end overflow-hidden"><div className="w-full bg-[#5D6BEE] h-[55%]"></div></div>
                    <span className="text-[10px] text-slate-500 font-semibold mt-2">Q2: 2023</span>
                  </div>
                  <div className="flex flex-col items-center gap-2 h-full justify-end">
                    <div className="w-10 bg-slate-200 h-[75%] rounded-t flex flex-col justify-end overflow-hidden"><div className="w-full bg-[#5D6BEE] h-[48%]"></div></div>
                    <span className="text-[10px] text-slate-500 font-semibold mt-2">Q3: 2023</span>
                  </div>
                  <div className="flex flex-col items-center gap-2 h-full justify-end">
                    <div className="w-10 bg-slate-200 h-[90%] rounded-t flex flex-col justify-end overflow-hidden"><div className="w-full bg-[#5D6BEE] h-[60%]"></div></div>
                    <span className="text-[10px] text-slate-500 font-semibold mt-2">Q4: 2023</span>
                  </div>
                  <div className="flex flex-col items-center gap-2 h-full justify-end">
                    <div className="w-10 bg-slate-200 h-[85%] rounded-t flex flex-col justify-end overflow-hidden"><div className="w-full bg-[#5D6BEE] h-[55%]"></div></div>
                    <span className="text-[10px] text-slate-500 font-semibold mt-2">Q1: 2024</span>
                  </div>
                  <div className="flex flex-col items-center gap-2 h-full justify-end">
                    <div className="w-10 bg-slate-200 h-[60%] rounded-t flex flex-col justify-end overflow-hidden"><div className="w-full bg-[#5D6BEE] h-[45%]"></div></div>
                    <span className="text-[10px] text-slate-500 font-semibold mt-2">Q2: 2024</span>
                  </div>
                  <div className="flex flex-col items-center gap-2 h-full justify-end">
                    <div className="w-10 bg-slate-200 h-[75%] rounded-t flex flex-col justify-end overflow-hidden"><div className="w-full bg-[#5D6BEE] h-[50%]"></div></div>
                    <span className="text-[10px] text-slate-500 font-semibold mt-2">Q3: 2024</span>
                  </div>
                  <div className="flex flex-col items-center gap-2 h-full justify-end">
                    <div className="w-10 bg-slate-200 h-[95%] rounded-t flex flex-col justify-end overflow-hidden"><div className="w-full bg-[#5D6BEE] h-[65%]"></div></div>
                    <span className="text-[10px] text-slate-500 font-semibold mt-2">Q4: 2024</span>
                  </div>
                </div>
                {/* Y-axis labels mock */}
                <div className="absolute left-0 h-[calc(100%-24px)] flex flex-col justify-between text-[10px] text-slate-400 font-medium py-2">
                  <span>100</span>
                  <span>50</span>
                  <span>0</span>
                </div>
              </div>
            </div>

            {/* Leave Requests */}
            <div className="bg-white border border-border rounded-xl p-6 card-shadow flex flex-col text-left">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-[15px] font-semibold text-slate-900">Leave Requests</h3>
                <button className="text-[12px] font-medium text-slate-500 flex items-center gap-1">
                  <CalendarIcon className="w-3.5 h-3.5" /> Today <span className="ml-1 text-[10px]">▼</span>
                </button>
              </div>
              <div className="flex-1 space-y-4">

                {/* Leave Item 1 */}
                <div className="border border-slate-100 rounded-xl p-4 flex flex-col gap-3 relative">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img src="/asset 12.webp" alt="James" className="w-10 h-10 rounded object-cover bg-slate-100" />
                      <div>
                        <h4 className="text-[13px] font-bold text-slate-900 flex items-center gap-2">
                          James <span className="bg-[#FFEBF0] text-[#FF4A6B] text-[9px] px-1.5 py-0.5 rounded font-bold uppercase">Emergency</span>
                        </h4>
                        <p className="text-[11px] text-slate-500">Physics Teacher</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <button className="w-6 h-6 bg-[#3DC84A] text-white rounded flex items-center justify-center hover:bg-[#34a83e]"><CheckCircle2 className="w-3.5 h-3.5" /></button>
                      <button className="w-6 h-6 bg-[#FF4A6B] text-white rounded flex items-center justify-center hover:bg-[#e03b5a]"><X className="w-3.5 h-3.5" /></button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-[11px] pt-3 border-t border-slate-100 text-slate-500">
                    <span>Leave : <strong className="text-slate-800">12 - 13 May</strong></span>
                    <span>Apply on : <strong className="text-slate-800">12 May</strong></span>
                  </div>
                </div>

                {/* Leave Item 2 */}
                <div className="border border-slate-100 rounded-xl p-4 flex flex-col gap-3 relative">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img src="/asset 14.webp" alt="Ramlan" className="w-10 h-10 rounded object-cover bg-slate-100" />
                      <div>
                        <h4 className="text-[13px] font-bold text-slate-900 flex items-center gap-2">
                          Ramlan <span className="bg-[#FFF7E6] text-[#F59E0B] text-[9px] px-1.5 py-0.5 rounded font-bold uppercase">Casual</span>
                        </h4>
                        <p className="text-[11px] text-slate-500">Accountant</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <button className="w-6 h-6 bg-[#3DC84A] text-white rounded flex items-center justify-center hover:bg-[#34a83e]"><CheckCircle2 className="w-3.5 h-3.5" /></button>
                      <button className="w-6 h-6 bg-[#FF4A6B] text-white rounded flex items-center justify-center hover:bg-[#e03b5a]"><X className="w-3.5 h-3.5" /></button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-[11px] pt-3 border-t border-slate-100 text-slate-500">
                    <span>Leave : <strong className="text-slate-800">12 - 13 May</strong></span>
                    <span>Apply on : <strong className="text-slate-800">11 May</strong></span>
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
              <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center text-[#F59E0B]"><ChevronRight className="w-3 h-3" /></div>
            </Link>

            <Link href="/dashboard/notices" className="bg-[#E8F8E8] hover:bg-[#d5f3d5] transition-colors rounded-xl p-4 flex items-center justify-between border border-[#BDE8B5]">
              <div className="flex items-center gap-3 text-[#1D7F2C] font-bold text-[13px]">
                <div className="w-10 h-10 bg-[#1DD04A] rounded-lg text-white flex items-center justify-center shadow-sm">
                  <CalendarDays className="w-5 h-5" />
                </div>
                New Events
              </div>
              <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center text-[#1DD04A]"><ChevronRight className="w-3 h-3" /></div>
            </Link>

            <Link href="/dashboard" className="bg-[#FFEBF0] hover:bg-[#ffdce5] transition-colors rounded-xl p-4 flex items-center justify-between border border-[#FFCCD8]">
              <div className="flex items-center gap-3 text-[#FF4A6B] font-bold text-[13px]">
                <div className="w-10 h-10 bg-[#FF4A6B] rounded-lg text-white flex items-center justify-center shadow-sm">
                  <Award className="w-5 h-5" />
                </div>
                Membership Plans
              </div>
              <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center text-[#FF4A6B]"><ChevronRight className="w-3 h-3" /></div>
            </Link>

            <Link href="/dashboard/fees" className="bg-[#E6F8FF] hover:bg-[#ccf1ff] transition-colors rounded-xl p-4 flex items-center justify-between border border-[#B3EEFF]">
              <div className="flex items-center gap-3 text-[#00B5FF] font-bold text-[13px]">
                <div className="w-10 h-10 bg-[#00B5FF] rounded-lg text-white flex items-center justify-center shadow-sm">
                  <FileText className="w-5 h-5" />
                </div>
                Finance & Accounts
              </div>
              <div className="w-6 h-6 bg-[#5D6BEE] rounded-full flex items-center justify-center text-white"><ChevronRight className="w-3 h-3" /></div>
            </Link>
          </div>

          {/* ----------------------------------------------------
              BOTTOM ROW 3: STATS & NOTICES
              ---------------------------------------------------- */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pb-6">

            {/* Sparklines Column */}
            <div className="lg:col-span-3 space-y-6">
              <div className="bg-white border border-border rounded-xl  card-shadow flex flex-col text-left ">
                <div className="flex items-center justify-between mb-2 p-2">
                  <div>
                    <p className="text-[12px] text-slate-500 font-semibold mb-1">Total Earnings</p>
                    <h3 className="text-xl font-bold text-slate-900">$64,522,24</h3>
                  </div>
                  <div className="w-8 h-8 rounded-lg bg-[#5D6BEE] text-white flex items-center justify-center shadow-sm">
                    <TrendingUp className="w-4 h-4" />
                  </div>
                </div>
                <div className="flex-1 w-full min-h-[60px] relative mt-2 overflow-hidden">
                  {/* SVG Sparkline Mockup */}
                  <svg viewBox="0 0 200 50" preserveAspectRatio="none" className="w-full h-[60px] absolute bottom-0">
                    <path d="M0,40 L40,10 L80,30 L120,20 L160,10 L200,25 L200,50 L0,50 Z" fill="rgba(93, 107, 238, 0.1)" />
                    <path d="M0,40 L40,10 L80,30 L120,20 L160,10 L200,25" fill="none" stroke="#5D6BEE" strokeWidth="2" />
                  </svg>
                </div>
              </div>

              <div className="bg-white border border-border rounded-xl  card-shadow flex flex-col text-left ">
                <div className="flex items-center justify-between mb-2 p-2">
                  <div>
                    <p className="text-[12px] text-slate-500 font-semibold mb-1">Total Expenses</p>
                    <h3 className="text-xl font-bold text-slate-900">$60,522,24</h3>
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
            <div className="lg:col-span-6 bg-white border border-border rounded-xl p-6 card-shadow flex flex-col text-left">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-[15px] font-semibold text-slate-900">Notice Board</h3>
                <Link href="/dashboard/notices" className="text-[12px] font-semibold text-slate-500 hover:text-slate-700">View All</Link>
              </div>
              <div className="divide-y divide-border flex-1">

                <div className="py-3.5 first:pt-0 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded-full bg-[#EAEFFF] text-[#5D6BEE] flex items-center justify-center shrink-0">
                      <FileText className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <h4 className="text-[13px] font-bold text-slate-900">New Syllabus Instructions</h4>
                      <p className="text-[11px] text-slate-500 mt-1 flex items-center gap-1.5"><CalendarIcon className="w-3 h-3" /> Added on : 11 Mar 2024</p>
                    </div>
                  </div>
                  <span className="bg-slate-100 text-slate-600 text-[10px] font-bold px-2.5 py-1 rounded">20 Days</span>
                </div>

                <div className="py-3.5 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded-full bg-[#E8F8E8] text-[#1DD04A] flex items-center justify-center shrink-0">
                      <Megaphone className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <h4 className="text-[13px] font-bold text-slate-900">World Environment Day Program.......!!!</h4>
                      <p className="text-[11px] text-slate-500 mt-1 flex items-center gap-1.5"><CalendarIcon className="w-3 h-3" /> Added on : 21 Apr 2024</p>
                    </div>
                  </div>
                  <span className="bg-slate-100 text-slate-600 text-[10px] font-bold px-2.5 py-1 rounded">15 Days</span>
                </div>

                <div className="py-3.5 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded-full bg-[#FFEBF0] text-[#FF4A6B] flex items-center justify-center shrink-0">
                      <CalendarDays className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <h4 className="text-[13px] font-bold text-slate-900">Exam Preparation Notification!</h4>
                      <p className="text-[11px] text-slate-500 mt-1 flex items-center gap-1.5"><CalendarIcon className="w-3 h-3" /> Added on : 18 Mar 2024</p>
                    </div>
                  </div>
                  <span className="bg-slate-100 text-slate-600 text-[10px] font-bold px-2.5 py-1 rounded">12 Days</span>
                </div>

                <div className="py-3.5 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded-full bg-[#E6F8FF] text-[#00B5FF] flex items-center justify-center shrink-0">
                      <BookOpen className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <h4 className="text-[13px] font-bold text-slate-900">Online Classes Preparation</h4>
                      <p className="text-[11px] text-slate-500 mt-1 flex items-center gap-1.5"><CalendarIcon className="w-3 h-3" /> Added on : 24 May 2024</p>
                    </div>
                  </div>
                  <span className="bg-slate-100 text-slate-600 text-[10px] font-bold px-2.5 py-1 rounded">02 Days</span>
                </div>

                <div className="py-3.5 pb-0 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded-full bg-[#FFF7E6] text-[#F59E0B] flex items-center justify-center shrink-0">
                      <Clock className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <h4 className="text-[13px] font-bold text-slate-900">Exam Time Table Release</h4>
                      <p className="text-[11px] text-slate-500 mt-1 flex items-center gap-1.5"><CalendarIcon className="w-3 h-3" /> Added on : 24 May 2024</p>
                    </div>
                  </div>
                  <span className="bg-slate-100 text-slate-600 text-[10px] font-bold px-2.5 py-1 rounded">08 Days</span>
                </div>

              </div>
            </div>

            {/* Fee Stats */}
            <div className="lg:col-span-3 space-y-4">
              <div className="bg-white border border-border rounded-xl p-4 card-shadow flex items-center justify-between text-left">
                <div>
                  <p className="text-[11px] text-slate-500 font-semibold mb-1">Total Fees Collected</p>
                  <h3 className="text-[16px] font-bold text-slate-900">$25,000,02</h3>
                </div>
                <span className="bg-[#E8F8E8] text-[#1D7F2C] text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-0.5">
                  <TrendingUp className="w-3 h-3" /> 1.2%
                </span>
              </div>

              <div className="bg-white border border-border rounded-xl p-4 card-shadow flex items-center justify-between text-left">
                <div>
                  <p className="text-[11px] text-slate-500 font-semibold mb-1">Fine Collected till date</p>
                  <h3 className="text-[16px] font-bold text-slate-900">$4,56,64</h3>
                </div>
                <span className="bg-[#FFEBF0] text-[#FF4A6B] text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-0.5">
                  <TrendingUp className="w-3 h-3 transform rotate-180" /> 1.2%
                </span>
              </div>

              <div className="bg-white border border-border rounded-xl p-4 card-shadow flex items-center justify-between text-left">
                <div>
                  <p className="text-[11px] text-slate-500 font-semibold mb-1">Student Not Paid</p>
                  <h3 className="text-[16px] font-bold text-slate-900">$545</h3>
                </div>
                <span className="bg-[#E6F8FF] text-[#00B5FF] text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-0.5">
                  <TrendingUp className="w-3 h-3" /> 1.2%
                </span>
              </div>

              <div className="bg-white border border-border rounded-xl p-4 card-shadow flex items-center justify-between text-left">
                <div>
                  <p className="text-[11px] text-slate-500 font-semibold mb-1">Total Outstanding</p>
                  <h3 className="text-[16px] font-bold text-slate-900">$4,56,64</h3>
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
          TEACHER & STUDENT VIEW (Fallbacks)
          ---------------------------------------------------- */}
      {activeRole !== "admin" && (
        <div className="py-12 text-center border-t border-border mt-8">
          <h2 className="text-xl font-semibold text-slate-800">Welcome to your Portal</h2>
          <p className="text-[14px] text-slate-500 mt-2">Use the navigation bar to access your specific modules.</p>
        </div>
      )}
    </div>
  );
}
