"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useAppState } from "../../../context/store";
import { Modal } from "../../../components/ui/modal";
import {
  User, Phone, Mail, FileText, Calendar, Droplet, Users, BookOpen, Clock, Settings, Building2, MapPin, Bus, Lock, Edit, ChevronDown, CheckCircle, RefreshCcw, Check, X, Download, Paperclip, Briefcase, Copy, Plus
} from "lucide-react";

export default function TeacherDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const teacherId = params.id as string;
  const { teachers, classes } = useAppState();

  const teacher = teachers.find(t => t.id === teacherId) || teachers[0];
  const [bottomTab, setBottomTab] = useState<"Hostel" | "Transportation">("Hostel");

  // Tab states
  const [activeMainTab, setActiveMainTab] = useState<string>("Teacher Details");
  const [attendanceSubTab, setAttendanceSubTab] = useState<"Leaves" | "Attendance">("Leaves");

  // Modal states
  const [isApplyLeaveOpen, setIsApplyLeaveOpen] = useState(false);
  const [isLoginDetailsOpen, setIsLoginDetailsOpen] = useState(false);

  if (!teacher) return <div className="p-10">Teacher not found.</div>;

  const getClassName = (cid: string) => classes.find(c => c.id === cid)?.name || "Unknown";

  const InfoRow = ({ label, value }: { label: string; value: string }) => (
    <div className="flex justify-between py-1">
      <span className="text-[14px] leading-[21px] font-medium text-[#0F172A] dark:text-slate-100">{label}</span>
      <span className="text-[14px] leading-[21px] text-[#68718a] text-right font-normal">{value}</span>
    </div>
  );

  const DocRow = ({ title }: { title: string }) => (
    <div className="flex items-center justify-between p-3 border border-border rounded-lg bg-slate-50/30">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-white dark:bg-slate-900 border border-border rounded flex items-center justify-center flex-shrink-0">
          <span className="text-[9px] font-bold text-slate-500 dark:text-slate-400 uppercase">PDF</span>
        </div>
        <p className="text-[13px] font-bold text-slate-900 dark:text-white">{title}</p>
      </div>
      <button className="p-1.5 hover:bg-slate-700 bg-slate-800 rounded text-white transition-colors">
        <Download className="w-3.5 h-3.5" />
      </button>
    </div>
  );

  const TabItem = ({ icon, label, active, onClick }: { icon: React.ReactNode, label: string, active: boolean, onClick: () => void }) => (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-3 text-[13px] font-bold transition-all border-b-2 whitespace-nowrap
        ${active ? "text-[#F59E0B] border-[#F59E0B] bg-[#F59E0B]/5" : "text-slate-500 dark:text-slate-400 border-transparent hover:text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/50"}
      `}
    >
      {icon}
      <span>{label}</span>
    </button>
  );

  const timeTableData = [
    [
      { room: "104", class: "III, A", subject: "Spanish", time: "09:45 - 10:30 AM" },
      { room: "104", class: "III, A", subject: "Spanish", time: "09:45 - 10:30 AM" },
      { room: "108", class: "I, A", subject: "Spanish", time: "03:15 - 04:00 AM" },
      { room: "107", class: "V, A", subject: "English", time: "11:30 - 12:15 AM" },
      { room: "105", class: "IV, B", subject: "Spanish", time: "02:15 - 03:00 AM" },
      { room: "106", class: "IV, A", subject: "English", time: "10:45 - 11:30 AM" },
      { room: "104", class: "III, A", subject: "Spanish", time: "09:45 - 10:30 AM" }
    ],
    [
      { room: "104", class: "III, A", subject: "Spanish", time: "09:45 - 10:30 AM" },
      { room: "108", class: "IV, B", subject: "Spanish", time: "02:15 - 03:00 AM" },
      { room: "107", class: "V, A", subject: "English", time: "11:30 - 12:15 AM" },
      { room: "106", class: "IV, A", subject: "English", time: "10:45 - 11:30 AM" },
      { room: "104", class: "I, A", subject: "Spanish", time: "03:15 - 04:00 AM" },
      { room: "104", class: "III, A", subject: "Spanish", time: "09:45 - 10:30 AM" },
      { room: "104", class: "III, A", subject: "Spanish", time: "09:45 - 10:30 AM" }
    ],
    [
      { room: "104", class: "III, A", subject: "Computer", time: "09:00 - 09:45 AM" },
      { room: "106", class: "II, A", subject: "Science", time: "09:45 - 10:30 AM" },
      { room: "106", class: "III, B", subject: "Maths", time: "10:45 - 11:30 AM" },
      { room: "108", class: "IV, A", subject: "Chemistry", time: "11:30 - 12:15 AM" },
      { room: "106", class: "III, A", subject: "Physics", time: "01:30 - 02:15 PM" },
      { room: "101", class: "III, A", subject: "English", time: "02:15 - 03:00 AM" },
      { room: "104", class: "III, A", subject: "Spanish", time: "03:15 - 04:00 AM" }
    ],
    [
      { room: "104", class: "III, A", subject: "Spanish", time: "09:00 - 09:45 AM" },
      { room: "106", class: "III, A", subject: "Physics", time: "09:45 - 10:30 AM" },
      { room: "108", class: "II, B", subject: "English", time: "10:45 - 11:30 AM" },
      { room: "106", class: "IV, A", subject: "Science", time: "11:30 - 12:15 AM" },
      { room: "104", class: "I, A", subject: "Spanish", time: "01:30 - 02:15 PM" },
      { room: "101", class: "III, B", subject: "Chemistry", time: "02:15 - 03:00 AM" },
      { room: "108", class: "III, A", subject: "Maths", time: "03:15 - 04:00 AM" }
    ],
    [
      { room: "104", class: "III, A", subject: "Spanish", time: "09:45 - 10:30 AM" },
      { room: "106", class: "IV, A", subject: "English", time: "10:45 - 11:30 AM" },
      { room: "107", class: "V, A", subject: "English", time: "11:30 - 12:15 AM" },
      { room: "108", class: "IV, B", subject: "Spanish", time: "02:15 - 03:00 AM" },
      { room: "106", class: "I, A", subject: "Spanish", time: "03:15 - 04:00 AM" },
      { room: "104", class: "III, A", subject: "Spanish", time: "09:45 - 10:30 AM" },
      { room: "104", class: "III, A", subject: "Spanish", time: "09:45 - 10:30 AM" }
    ],
    [
      { room: "104", class: "II, A", subject: "Spanish", time: "09:45 - 10:30 AM" },
      { room: "106", class: "IV, A", subject: "English", time: "10:45 - 11:30 AM" },
      { room: "107", class: "V, A", subject: "English", time: "11:30 - 12:15 AM" },
      { room: "108", class: "IV, B", subject: "Spanish", time: "02:15 - 03:00 AM" },
      { room: "106", class: "I, A", subject: "Spanish", time: "03:15 - 04:00 AM" },
      { room: "104", class: "III, A", subject: "Spanish", time: "09:45 - 10:30 AM" },
      { room: "104", class: "III, A", subject: "Spanish", time: "09:45 - 10:30 AM" }
    ]
  ];

  return (
    <div className="space-y-6 bg-[#F8FAFC] dark:bg-[#0F172A] min-h-screen -m-6 p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-left">
        <div>
          <h1 className="text-[20px] leading-[24px] font-semibold text-[#0F172A] dark:text-slate-100">Teacher Details</h1>
          <div className="flex items-center gap-2 text-[14px] leading-[21px] text-[#68718a] mt-1 font-normal">
            <span>Dashboard</span>
            <span>/</span>
            <Link href="/dashboard/teachers" className="hover:text-[#F59E0B]">Teachers</Link>
            <span>/</span>
            <span className="text-[#0F172A] dark:text-slate-100 font-normal">Teacher Details</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsLoginDetailsOpen(true)}
            className="flex items-center gap-2 px-3 py-1.5 border border-border rounded-lg bg-white dark:bg-slate-900 text-[12px] font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/50 shadow-sm transition-colors"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Login Details</span>
          </button>
          <button
            onClick={() => router.push(`/dashboard/teachers/${teacher.id}/edit`)}
            className="flex items-center gap-2 px-3 py-1.5 bg-[#F59E0B] hover:bg-[#D97706] text-white text-[12px] font-bold rounded-lg shadow-sm transition-colors"
          >
            <Edit className="w-3.5 h-3.5" />
            <span>Edit Teacher</span>
          </button>
        </div>
      </div>

      <div className="flex flex-col xl:flex-row gap-6 items-start">
        {/* LEFT SIDEBAR (30%) */}
        <div className="w-full xl:w-[300px] flex-shrink-0 space-y-6">

          {/* Profile Card */}
          <div className="bg-white dark:bg-slate-900 border border-border rounded-xl p-4 card-shadow text-left relative overflow-hidden">
            <div className="flex items-center gap-4">
              <img src="/asset 7.webp" className="w-[60px] h-[60px] rounded-xl object-cover border border-slate-200 dark:border-slate-800" alt="Avatar" />
              <div>
                <h2 className="text-[16px] leading-[19.2px] font-medium text-[#0F172A] dark:text-slate-100">{teacher.name}</h2>
                <p className="text-[12px] text-[#F59E0B] font-bold mt-0.5">T849126</p>
                <p className="text-[11px] text-[#68718a] font-medium mt-1">Joined : 25 May 24</p>
              </div>
            </div>
          </div>

          {/* Basic Information */}
          <div className="bg-white dark:bg-slate-900 border border-border rounded-xl overflow-hidden card-shadow text-left">
            <div className="p-4 text-[12px]">
              <h3 className="text-[14px] leading-[19.2px] font-medium text-[#0F172A] dark:text-slate-100 mb-4">Basic Information</h3>
              <div className="space-y-3.5">
                <InfoRow label="Class & Section" value={getClassName(teacher.classId)} />
                <InfoRow label="Subject" value={teacher.subject} />
                <InfoRow label="Gender" value="Female" />
                <InfoRow label="Blood Group" value="O +ve" />
                <InfoRow label="House" value="Red" />
                <InfoRow label="Language Known" value="English" />
                <div className="flex justify-between py-1 items-center">
                  <span className="text-[14px] leading-[21px] font-medium text-[#0F172A] dark:text-slate-100">Language</span>
                  <div className="flex gap-1.5">
                    <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 rounded-md text-[10px] font-bold text-slate-700 dark:text-slate-200">English</span>
                    <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 rounded-md text-[10px] font-bold text-slate-700 dark:text-slate-200">Spanish</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Primary Contact Info */}
          <div className="bg-white dark:bg-slate-900 border border-border rounded-xl overflow-hidden card-shadow text-left">
            <div className="p-4 space-y-4">
              <h3 className="text-[14px] font-bold text-slate-900 dark:text-white mb-2">Primary Contact Info</h3>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-slate-50 dark:bg-slate-800/50 flex items-center justify-center border border-slate-100 dark:border-slate-800/50 flex-shrink-0">
                  <Phone className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                </div>
                <div>
                  <p className="text-[11px] font-bold text-slate-900 dark:text-white mb-0.5">Phone Number</p>
                  <p className="text-[12px] text-slate-500 dark:text-slate-400 font-medium">+1 46548 84498</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-slate-50 dark:bg-slate-800/50 flex items-center justify-center border border-slate-100 dark:border-slate-800/50 flex-shrink-0">
                  <Mail className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                </div>
                <div>
                  <p className="text-[11px] font-bold text-slate-900 dark:text-white mb-0.5">Email Address</p>
                  <p className="text-[12px] text-slate-500 dark:text-slate-400 font-medium">{teacher.email}</p>
                </div>
              </div>
            </div>
          </div>

          {/* PAN Number */}
          <div className="bg-white dark:bg-slate-900 border border-border rounded-xl overflow-hidden card-shadow text-left p-4">
            <h3 className="text-[14px] font-bold text-slate-900 dark:text-white mb-3">PAN Number / ID Number</h3>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-slate-50 dark:bg-slate-800/50 flex items-center justify-center border border-slate-100 dark:border-slate-800/50 flex-shrink-0">
                  <FileText className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                </div>
                <span className="text-[13px] font-semibold text-slate-900 dark:text-white">343445954908</span>
              </div>
              <button className="p-1.5 rounded bg-[#F59E0B] text-white hover:bg-[#D97706] transition-colors shadow-sm">
                <Copy className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Bottom Tabs (Hostel/Transport) */}
          {/* <div className="bg-white dark:bg-slate-900 border border-border rounded-xl overflow-hidden card-shadow text-left">
            <div className="flex border-b border-border">
              <button
                onClick={() => setBottomTab("Hostel")}
                className={`flex-1 py-2.5 text-[12px] font-bold transition-colors ${bottomTab === "Hostel" ? "text-[#F59E0B] border-b-2 border-[#F59E0B]" : "text-slate-500 dark:text-slate-400"}`}
              >
                Hostel
              </button>
              <button
                onClick={() => setBottomTab("Transportation")}
                className={`flex-1 py-2.5 text-[12px] font-bold transition-colors ${bottomTab === "Transportation" ? "text-[#F59E0B] border-b-2 border-[#F59E0B]" : "text-slate-500 dark:text-slate-400"}`}
              >
                Transportation
              </button>
            </div>
            <div className="p-4">
              {bottomTab === "Hostel" ? (
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-slate-50 dark:bg-slate-800/50 flex items-center justify-center border border-slate-100 dark:border-slate-800/50 flex-shrink-0">
                    <Building2 className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                  </div>
                  <div>
                    <p className="text-[12px] font-bold text-slate-900 dark:text-white">HI-Hostel, Floor</p>
                    <p className="text-[11px] text-[#F59E0B] font-bold mt-0.5">Room No : 25</p>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-slate-50 dark:bg-slate-800/50 flex items-center justify-center border border-slate-100 dark:border-slate-800/50 flex-shrink-0">
                    <Bus className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                  </div>
                  <div>
                    <p className="text-[12px] font-bold text-slate-900 dark:text-white">Bus Route 42</p>
                    <p className="text-[11px] text-[#F59E0B] font-bold mt-0.5">Pickup : 07:30 AM</p>
                  </div>
                </div>
              )}
            </div>
          </div> */}

        </div>

        {/* RIGHT MAIN CONTENT (70%) */}
        <div className="flex-1 min-w-0 flex flex-col gap-5">

          {/* Top Tabs Header */}
          <div className="bg-white dark:bg-slate-900 border border-border rounded-t-xl overflow-x-auto custom-scrollbar flex items-center gap-1 px-1.5 pt-1.5">
            <TabItem icon={<User className="w-3.5 h-3.5" />} label="Teacher Details" active={activeMainTab === "Teacher Details"} onClick={() => setActiveMainTab("Teacher Details")} />
            <TabItem icon={<Calendar className="w-3.5 h-3.5" />} label="Routine" active={activeMainTab === "Routine"} onClick={() => setActiveMainTab("Routine")} />
            <TabItem icon={<Clock className="w-3.5 h-3.5" />} label="Leave & Attendance" active={activeMainTab === "Leave & Attendance"} onClick={() => setActiveMainTab("Leave & Attendance")} />
            <TabItem icon={<FileText className="w-3.5 h-3.5" />} label="Salary" active={activeMainTab === "Salary"} onClick={() => setActiveMainTab("Salary")} />
            {/* <TabItem icon={<BookOpen className="w-3.5 h-3.5" />} label="Library" active={activeMainTab === "Library"} onClick={() => setActiveMainTab("Library")} /> */}
          </div>

          {/* 1. Teacher Details Tab Content */}
          {activeMainTab === "Teacher Details" && (
            <div className="space-y-5 text-left animate-in fade-in zoom-in-95 duration-200">
              {/* Profile Details */}
              <div className="bg-white dark:bg-slate-900 border border-border rounded-xl card-shadow overflow-hidden">
                <div className="p-4 border-b border-border">
                  <h3 className="text-[14px] font-bold text-slate-900 dark:text-white">Profile Details</h3>
                </div>
                <div className="p-5 grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <div>
                    <p className="text-[11px] font-bold text-slate-900 dark:text-white mb-1">Father's Name</p>
                    <p className="text-[12px] text-slate-500 dark:text-slate-400 font-medium">Francis Savicur</p>
                  </div>
                  <div>
                    <p className="text-[11px] font-bold text-slate-900 dark:text-white mb-1">Mother Name</p>
                    <p className="text-[12px] text-slate-500 dark:text-slate-400 font-medium">Stella Bruce</p>
                  </div>
                  <div>
                    <p className="text-[11px] font-bold text-slate-900 dark:text-white mb-1">DOB</p>
                    <p className="text-[12px] text-slate-500 dark:text-slate-400 font-medium">25 Jan 1992</p>
                  </div>
                  <div>
                    <p className="text-[11px] font-bold text-slate-900 dark:text-white mb-1">Martial Status</p>
                    <p className="text-[12px] text-slate-500 dark:text-slate-400 font-medium">Single</p>
                  </div>
                  <div>
                    <p className="text-[11px] font-bold text-slate-900 dark:text-white mb-1">Qualification</p>
                    <p className="text-[12px] text-slate-500 dark:text-slate-400 font-medium">MBA</p>
                  </div>
                  <div>
                    <p className="text-[11px] font-bold text-slate-900 dark:text-white mb-1">Experience</p>
                    <p className="text-[12px] text-slate-500 dark:text-slate-400 font-medium">2 Years</p>
                  </div>
                </div>
              </div>

              {/* Documents and Address Row */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                {/* Documents */}
                <div className="bg-white dark:bg-slate-900 border border-border rounded-xl card-shadow overflow-hidden">
                  <div className="p-4 border-b border-border">
                    <h3 className="text-[14px] font-bold text-slate-900 dark:text-white">Documents</h3>
                  </div>
                  <div className="p-5 space-y-3">
                    <DocRow title="Resume.pdf" />
                    <DocRow title="Joining Letter.pdf" />
                  </div>
                </div>

                {/* Address */}
                <div className="bg-white dark:bg-slate-900 border border-border rounded-xl card-shadow overflow-hidden">
                  <div className="p-4 border-b border-border">
                    <h3 className="text-[14px] font-bold text-slate-900 dark:text-white">Address</h3>
                  </div>
                  <div className="p-5 space-y-5">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-slate-50 dark:bg-slate-800/50 flex items-center justify-center flex-shrink-0 border border-slate-100 dark:border-slate-800/50">
                        <MapPin className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                      </div>
                      <div>
                        <p className="text-[12px] font-bold text-slate-900 dark:text-white mb-1">Current Address</p>
                        <p className="text-[12px] text-slate-500 dark:text-slate-400 font-medium">3495 Red Hawk Road, Buffalo Lake, MN 55314</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-slate-50 dark:bg-slate-800/50 flex items-center justify-center flex-shrink-0 border border-slate-100 dark:border-slate-800/50">
                        <MapPin className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                      </div>
                      <div>
                        <p className="text-[12px] font-bold text-slate-900 dark:text-white mb-1">Permanent Address</p>
                        <p className="text-[12px] text-slate-500 dark:text-slate-400 font-medium">3495 Red Hawk Road, Buffalo Lake, MN 55314</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Previous School Details */}
              <div className="bg-white dark:bg-slate-900 border border-border rounded-xl card-shadow overflow-hidden">
                <div className="p-4 border-b border-border">
                  <h3 className="text-[14px] font-bold text-slate-900 dark:text-white">Previous School Details</h3>
                </div>
                <div className="p-5 grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <div>
                    <p className="text-[11px] font-bold text-slate-900 dark:text-white mb-1">Previous School Name</p>
                    <p className="text-[12px] text-slate-500 dark:text-slate-400 font-medium">Oxford Matriculation, USA</p>
                  </div>
                  <div>
                    <p className="text-[11px] font-bold text-slate-900 dark:text-white mb-1">School Address</p>
                    <p className="text-[12px] text-slate-500 dark:text-slate-400 font-medium">1852 Barnes Avenue, Cincinnati, OH 45202</p>
                  </div>
                  <div>
                    <p className="text-[11px] font-bold text-slate-900 dark:text-white mb-1">Phone Number</p>
                    <p className="text-[12px] text-slate-500 dark:text-slate-400 font-medium">+1 35676 45556</p>
                  </div>
                </div>
              </div>

              {/* Bank Details & Work Details */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                <div className="bg-white dark:bg-slate-900 border border-border rounded-xl card-shadow overflow-hidden h-full">
                  <div className="p-4 border-b border-border">
                    <h3 className="text-[14px] font-bold text-slate-900 dark:text-white">Bank Details</h3>
                  </div>
                  <div className="p-5 grid grid-cols-3 gap-4">
                    <div>
                      <p className="text-[11px] font-bold text-slate-900 dark:text-white mb-1">Bank Name</p>
                      <p className="text-[12px] text-slate-500 dark:text-slate-400 font-medium">Bank of America</p>
                    </div>
                    <div>
                      <p className="text-[11px] font-bold text-slate-900 dark:text-white mb-1">Branch</p>
                      <p className="text-[12px] text-slate-500 dark:text-slate-400 font-medium">Cincinnati</p>
                    </div>
                    <div>
                      <p className="text-[11px] font-bold text-slate-900 dark:text-white mb-1">IFSC</p>
                      <p className="text-[12px] text-slate-500 dark:text-slate-400 font-medium">BOA83209832</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white dark:bg-slate-900 border border-border rounded-xl card-shadow overflow-hidden h-full">
                  <div className="p-4 border-b border-border">
                    <h3 className="text-[14px] font-bold text-slate-900 dark:text-white">Work Details</h3>
                  </div>
                  <div className="p-5 grid grid-cols-3 gap-4">
                    <div>
                      <p className="text-[11px] font-bold text-slate-900 dark:text-white mb-1">Contract Type</p>
                      <p className="text-[12px] text-slate-500 dark:text-slate-400 font-medium">Permanent</p>
                    </div>
                    <div>
                      <p className="text-[11px] font-bold text-slate-900 dark:text-white mb-1">Shift</p>
                      <p className="text-[12px] text-slate-500 dark:text-slate-400 font-medium">Morning</p>
                    </div>
                    <div>
                      <p className="text-[11px] font-bold text-slate-900 dark:text-white mb-1">Work Location</p>
                      <p className="text-[12px] text-slate-500 dark:text-slate-400 font-medium">2nd Floor</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Social Media */}
              <div className="bg-white dark:bg-slate-900 border border-border rounded-xl card-shadow overflow-hidden">
                <div className="p-4 border-b border-border">
                  <h3 className="text-[14px] font-bold text-slate-900 dark:text-white">Social Media</h3>
                </div>
                <div className="p-5 grid grid-cols-2 sm:grid-cols-4 gap-6">
                  <div>
                    <p className="text-[11px] font-bold text-slate-900 dark:text-white mb-1">Facebook</p>
                    <p className="text-[12px] text-slate-500 dark:text-slate-400 font-medium">www.facebook.com</p>
                  </div>
                  <div>
                    <p className="text-[11px] font-bold text-slate-900 dark:text-white mb-1">Twitter</p>
                    <p className="text-[12px] text-slate-500 dark:text-slate-400 font-medium">www.twitter.com</p>
                  </div>
                  <div>
                    <p className="text-[11px] font-bold text-slate-900 dark:text-white mb-1">Linkedin</p>
                    <p className="text-[12px] text-slate-500 dark:text-slate-400 font-medium">www.linkedin.com</p>
                  </div>
                  <div>
                    <p className="text-[11px] font-bold text-slate-900 dark:text-white mb-1">Youtube</p>
                    <p className="text-[12px] text-slate-500 dark:text-slate-400 font-medium">www.youtube.com</p>
                  </div>
                </div>
              </div>

              {/* Other Info */}
              <div className="bg-white dark:bg-slate-900 border border-border rounded-xl card-shadow overflow-hidden">
                <div className="p-4 border-b border-border">
                  <h3 className="text-[14px] font-bold text-slate-900 dark:text-white">Other Info</h3>
                </div>
                <div className="p-5">
                  <p className="text-[12px] text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                    Depending on the specific needs of your organization or system, additional information may be collected or tracked. It's important to ensure that any data collected complies with privacy regulations and policies to protect students' sensitive information.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* 2. Routine Content */}
          {activeMainTab === "Routine" && (
            <div className="bg-white dark:bg-slate-900 border border-border rounded-xl card-shadow p-5 text-left animate-in fade-in zoom-in-95 duration-200">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-[14px] font-bold text-slate-900 dark:text-white">Time Table</h2>
                <div className="px-3 py-1.5 border border-border rounded-lg text-[11px] font-bold text-slate-700 dark:text-slate-200 flex items-center gap-2 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 shadow-sm">
                  <Calendar className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                  <span>This Year</span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                </div>
              </div>

              {/* Time Table Grid */}
              <div className="overflow-x-auto custom-scrollbar pb-6">
                <div className="min-w-[900px]">
                  <div className="grid grid-cols-6 gap-4 mb-4">
                    {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"].map(day => (
                      <div key={day} className="text-[13px] font-bold text-slate-900 dark:text-white pb-2">{day}</div>
                    ))}
                  </div>

                  <div className="grid grid-cols-6 gap-4 relative">
                    {timeTableData.map((col, idx) => (
                      <div key={idx} className="flex flex-col gap-4">
                        {col.map((slot, sIdx) => (
                          <div key={sIdx} className="bg-white dark:bg-slate-900 border border-[#FFE2E6] rounded-xl p-3 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer">
                            <span className="inline-block px-1.5 py-0.5 bg-[#FFF0F2] text-[#E02424] text-[10px] font-bold rounded mb-2">Room No:{slot.room}</span>
                            <div className="space-y-1.5">
                              <p className="text-[12px] font-bold text-slate-900 dark:text-white">Class : <span className="font-medium text-slate-500 dark:text-slate-400">{slot.class}</span></p>
                              <p className="text-[12px] font-bold text-slate-900 dark:text-white">Subject : <span className="font-medium text-slate-500 dark:text-slate-400">{slot.subject}</span></p>
                            </div>
                            <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800/50 flex items-center gap-1.5 text-[11px] font-bold text-slate-500 dark:text-slate-400">
                              <Clock className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                              {slot.time}
                            </div>
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>

                  {/* Break sections below table */}
                  <div className="grid grid-cols-3 gap-4 mt-6">
                    <div className="bg-[#EEF2FF] rounded-xl p-4 flex flex-col justify-center">
                      <span className="inline-block px-2 py-0.5 bg-[#F59E0B] text-white text-[10px] font-bold rounded mb-2 self-start">Morning Break</span>
                      <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-600 dark:text-slate-300 mt-1">
                        <Clock className="w-3.5 h-3.5" /> 10:30 to 10:45 AM
                      </div>
                    </div>
                    <div className="bg-[#FFF8E6] rounded-xl p-4 flex flex-col justify-center">
                      <span className="inline-block px-2 py-0.5 bg-[#F59E0B] text-white text-[10px] font-bold rounded mb-2 self-start">Lunch</span>
                      <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-600 dark:text-slate-300 mt-1">
                        <Clock className="w-3.5 h-3.5" /> 10:30 to 10:45 AM
                      </div>
                    </div>
                    <div className="bg-[#E6F4FE] rounded-xl p-4 flex flex-col justify-center">
                      <span className="inline-block px-2 py-0.5 bg-[#3B82F6] text-white text-[10px] font-bold rounded mb-2 self-start">Evening Break</span>
                      <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-600 dark:text-slate-300 mt-1">
                        <Clock className="w-3.5 h-3.5" /> 03:30 PM to 03:45 PM
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          )}

          {/* 3. Leave & Attendance Content */}
          {activeMainTab === "Leave & Attendance" && (
            <div className="space-y-5 text-left animate-in fade-in zoom-in-95 duration-200">
              <div className="flex border-b border-border">
                <button
                  onClick={() => setAttendanceSubTab("Leaves")}
                  className={`px-6 py-2.5 text-[13px] font-bold transition-all rounded-t-lg
                    ${attendanceSubTab === "Leaves" ? "bg-[#F59E0B] text-white" : "bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400 border border-b-0 border-border"}
                  `}
                >
                  Leaves
                </button>
                <button
                  onClick={() => setAttendanceSubTab("Attendance")}
                  className={`px-6 py-2.5 text-[13px] font-bold transition-all rounded-t-lg ml-2
                    ${attendanceSubTab === "Attendance" ? "bg-[#F59E0B] text-white" : "bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400 border border-b-0 border-border"}
                  `}
                >
                  Attendance
                </button>
              </div>

              {attendanceSubTab === "Leaves" && (
                <div className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    <div className="bg-white dark:bg-slate-900 border border-border rounded-xl p-4 card-shadow text-left">
                      <p className="text-[13px] font-bold text-slate-900 dark:text-white mb-2">Medical Leave (10)</p>
                      <p className="text-[12px] text-slate-500 dark:text-slate-400 font-medium">Used : 5 <span className="ml-2">Available : 5</span></p>
                    </div>
                    <div className="bg-white dark:bg-slate-900 border border-border rounded-xl p-4 card-shadow text-left">
                      <p className="text-[13px] font-bold text-slate-900 dark:text-white mb-2">Casual Leave (12)</p>
                      <p className="text-[12px] text-slate-500 dark:text-slate-400 font-medium">Used : 1 <span className="ml-2">Available : 11</span></p>
                    </div>
                    <div className="bg-white dark:bg-slate-900 border border-border rounded-xl p-4 card-shadow text-left">
                      <p className="text-[13px] font-bold text-slate-900 dark:text-white mb-2">Maternity Leave (10)</p>
                      <p className="text-[12px] text-slate-500 dark:text-slate-400 font-medium">Used : 0 <span className="ml-2">Available : 10</span></p>
                    </div>
                    <div className="bg-white dark:bg-slate-900 border border-border rounded-xl p-4 card-shadow text-left">
                      <p className="text-[13px] font-bold text-slate-900 dark:text-white mb-2">Paternity Leave (0)</p>
                      <p className="text-[12px] text-slate-500 dark:text-slate-400 font-medium">Used : 0 <span className="ml-2">Available : 0</span></p>
                    </div>
                  </div>

                  <div className="bg-white dark:bg-slate-900 border border-border rounded-xl card-shadow overflow-hidden">
                    <div className="p-4 border-b border-border flex items-center justify-between">
                      <h3 className="text-[14px] font-bold text-slate-900 dark:text-white">Leaves</h3>
                      <button
                        onClick={() => setIsApplyLeaveOpen(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-[#F59E0B] text-white text-[12px] font-bold rounded-lg hover:bg-[#D97706] transition-colors shadow-sm"
                      >
                        <Plus className="w-3.5 h-3.5" /> Apply Leave
                      </button>
                    </div>

                    <div className="p-4 flex items-center justify-between border-b border-border">
                      <div className="flex items-center gap-2 text-[12px] text-slate-600 dark:text-slate-300 font-medium">
                        <span>Row Per Page</span>
                        <select className="border border-border rounded px-2 py-1 outline-none bg-white dark:bg-slate-900 font-bold text-slate-700 dark:text-slate-200"><option>10</option></select>
                        <span>Entries</span>
                      </div>
                      <input type="text" placeholder="Search" className="px-3 py-1.5 border border-border rounded-lg text-[12px] outline-none w-64 focus:border-[#F59E0B]/50 transition-colors" />
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-[12px]">
                        <thead className="bg-[#F8FAFC] dark:bg-[#0F172A] text-slate-700 dark:text-slate-200 border-b border-border">
                          <tr>
                            <th className="px-5 py-3 font-semibold">Leave Type</th>
                            <th className="px-5 py-3 font-semibold">Leave Date</th>
                            <th className="px-5 py-3 font-semibold">No of Days</th>
                            <th className="px-5 py-3 font-semibold">Applied On</th>
                            <th className="px-5 py-3 font-semibold">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border text-slate-600 dark:text-slate-300 font-medium">
                          {[
                            { type: "Casual Leave", date: "07 May 2024 - 07 May 2024", days: 1, applied: "07 May 2024", status: "Approved" },
                            { type: "Casual Leave", date: "08 May 2024 - 08 May 2024", days: 1, applied: "04 May 2024", status: "Approved" },
                            { type: "Casual Leave", date: "20 May 2024 - 20 May 2024", days: 1, applied: "19 May 2024", status: "Pending" },
                            { type: "Medical Leave", date: "05 May 2024 - 09 May 2024", days: 5, applied: "05 May 2024", status: "Approved" },
                            { type: "Medical Leave", date: "08 May 2024 - 11 May 2024", days: 4, applied: "08 May 2024", status: "Pending" },
                            { type: "Special Leave", date: "09 May 2024 - 09 May 2024", days: 1, applied: "09 May 2024", status: "Pending" },
                          ].map((l, i) => (
                            <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                              <td className="px-5 py-3">{l.type}</td>
                              <td className="px-5 py-3">{l.date}</td>
                              <td className="px-5 py-3">{l.days}</td>
                              <td className="px-5 py-3">{l.applied}</td>
                              <td className="px-5 py-3">
                                <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-bold
                                  ${l.status === "Approved" ? "bg-[#E8F8E8] text-[#1D7F2C]" : "bg-[#E6F4FE] text-[#3B82F6]"}
                                `}>
                                  <span className={`w-1.5 h-1.5 rounded-full ${l.status === "Approved" ? "bg-[#1DD04A]" : "bg-[#3B82F6]"}`} />
                                  {l.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {attendanceSubTab === "Attendance" && (
                <div className="space-y-5 animate-in fade-in zoom-in-95 duration-200">
                  {/* Title & Top Controls */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <h2 className="text-[16px] font-bold text-slate-900 dark:text-white">Attendance</h2>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2 text-[12px] font-medium text-slate-600 dark:text-slate-300">
                        <span>Last Updated on : 25 May 2024</span>
                        <button className="p-1.5 bg-[#F59E0B] text-white rounded-md shadow-sm hover:bg-[#D97706] transition-colors">
                          <RefreshCcw className="w-3 h-3" />
                        </button>
                      </div>
                      <div className="flex items-center gap-2 px-3 py-1.5 border border-border rounded-lg text-[12px] font-bold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-900 shadow-sm cursor-pointer">
                        <Calendar className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                        <span>Year : 2024 / 2025</span>
                        <ChevronDown className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                      </div>
                    </div>
                  </div>

                  {/* Summary Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
                    <div className="bg-white dark:bg-slate-900 border border-border rounded-xl p-4 card-shadow flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg bg-[#E6F4FE] text-[#3B82F6] flex items-center justify-center flex-shrink-0">
                        <User className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-[12px] text-slate-500 dark:text-slate-400 font-medium mb-0.5">Total Present</p>
                        <p className="text-[18px] font-bold text-slate-900 dark:text-white">265</p>
                      </div>
                    </div>
                    <div className="bg-white dark:bg-slate-900 border border-border rounded-xl p-4 card-shadow flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg bg-[#FFEBEB] text-[#E02424] flex items-center justify-center flex-shrink-0">
                        <User className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-[12px] text-slate-500 dark:text-slate-400 font-medium mb-0.5">Total Absent</p>
                        <p className="text-[18px] font-bold text-slate-900 dark:text-white">05</p>
                      </div>
                    </div>
                    <div className="bg-white dark:bg-slate-900 border border-border rounded-xl p-4 card-shadow flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg bg-slate-50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-300 border border-slate-100 dark:border-slate-800/50 flex items-center justify-center flex-shrink-0">
                        <Calendar className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-[12px] text-slate-500 dark:text-slate-400 font-medium mb-0.5">Half Day</p>
                        <p className="text-[18px] font-bold text-slate-900 dark:text-white">01</p>
                      </div>
                    </div>
                    <div className="bg-white dark:bg-slate-900 border border-border rounded-xl p-4 card-shadow flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg bg-[#FFF8E6] text-[#F59E0B] flex items-center justify-center flex-shrink-0">
                        <Clock className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-[12px] text-slate-500 dark:text-slate-400 font-medium mb-0.5">Late</p>
                        <p className="text-[18px] font-bold text-slate-900 dark:text-white">12</p>
                      </div>
                    </div>
                  </div>

                  {/* Matrix Table Block */}
                  <div className="bg-white dark:bg-slate-900 border border-border rounded-xl card-shadow overflow-hidden p-5 space-y-5">

                    <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4">
                      <h3 className="text-[15px] font-bold text-slate-900 dark:text-white">Leave & Attendance</h3>
                      <div className="flex gap-3">
                        <button className="flex items-center gap-2 px-3 py-1.5 border border-border rounded-lg text-[12px] font-bold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors shadow-sm">
                          <Calendar className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                          <span>This Year</span>
                          <ChevronDown className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                        </button>
                        <button className="flex items-center gap-2 px-3 py-1.5 border border-border rounded-lg text-[12px] font-bold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors shadow-sm">
                          <Download className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                          <span>Export</span>
                          <ChevronDown className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                        </button>
                      </div>
                    </div>

                    {/* Legend */}
                    <div className="flex flex-wrap gap-3">
                      <div className="flex items-center gap-2 px-2.5 py-1 rounded bg-[#E8F8E8] text-[#1D7F2C] border border-[#1D7F2C]/20 text-[11px] font-bold">
                        <CheckCircle className="w-3.5 h-3.5" /> Present
                      </div>
                      <div className="flex items-center gap-2 px-2.5 py-1 rounded bg-[#FFEBEB] text-[#E02424] border border-[#E02424]/20 text-[11px] font-bold">
                        <X className="w-3.5 h-3.5" /> Absent
                      </div>
                      <div className="flex items-center gap-2 px-2.5 py-1 rounded bg-[#E6F4FE] text-[#3B82F6] border border-[#3B82F6]/20 text-[11px] font-bold">
                        <Clock className="w-3.5 h-3.5" /> Late
                      </div>
                      <div className="flex items-center gap-2 px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-300 text-[11px] font-bold">
                        <Calendar className="w-3.5 h-3.5" /> Halfday
                      </div>
                      <div className="flex items-center gap-2 px-2.5 py-1 rounded bg-[#E6F4FE] text-[#F59E0B] border border-[#F59E0B]/20 text-[11px] font-bold">
                        <Calendar className="w-3.5 h-3.5" /> Holiday
                      </div>
                    </div>

                    {/* Filters */}
                    <div className="flex items-center justify-between pt-2">
                      <div className="flex items-center gap-2 text-[12px] text-slate-600 dark:text-slate-300 font-medium">
                        <span>Row Per Page</span>
                        <select className="border border-border rounded px-2 py-1 outline-none bg-white dark:bg-slate-900 font-bold text-slate-700 dark:text-slate-200"><option>10</option></select>
                        <span>Entries</span>
                      </div>
                      <input type="text" placeholder="Search" className="px-3 py-1.5 border border-border rounded-lg text-[12px] outline-none w-48 sm:w-64 focus:border-[#F59E0B]/50 transition-colors" />
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto custom-scrollbar">
                      <table className="w-full text-left text-[12px] min-w-[800px]">
                        <thead className="bg-[#F8FAFC] dark:bg-[#0F172A] text-slate-700 dark:text-slate-200 border-y border-border">
                          <tr>
                            <th className="px-4 py-3 font-semibold whitespace-nowrap">Date | Month <span className="text-[10px] text-slate-400 dark:text-slate-500 ml-1">⇅</span></th>
                            {["Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar", "Apr"].map(m => (
                              <th key={m} className="px-3 py-3 font-semibold text-center">{m} <span className="text-[10px] text-slate-400 dark:text-slate-500 ml-1">⇅</span></th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border text-slate-600 dark:text-slate-300 font-medium">
                          {[
                            { day: "01", status: ["P", "P", "P", "P", "P", "P", "P", "P", "P", "", ""] },
                            { day: "02", status: ["P", "P", "P", "P", "P", "P", "P", "P", "P", "", ""] },
                            { day: "03", status: ["P", "A", "P", "P", "P", "P", "P", "P", "A", "", ""] },
                            { day: "04", status: ["P", "P", "P", "P", "P", "P", "P", "P", "P", "", ""] },
                            { day: "05", status: ["", "", "", "", "", "", "", "", "", "", ""] },
                            { day: "06", status: ["", "", "", "", "", "", "", "", "", "", ""] },
                            { day: "07", status: ["P", "P", "P", "P", "P", "P", "P", "P", "P", "", ""] },
                            { day: "08", status: ["P", "P", "P", "P", "P", "P", "P", "P", "P", "", ""] },
                            { day: "09", status: ["P", "P", "P", "A", "P", "L", "A", "P", "H", "", ""] },
                            { day: "10", status: ["", "", "", "", "", "", "", "", "", "", ""] },
                          ].map((row, i) => (
                            <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                              <td className="px-4 py-3">{row.day}</td>
                              {row.status.map((s, idx) => (
                                <td key={idx} className="px-3 py-3 text-center">
                                  {s === "P" && <span className="inline-block w-2 h-4 rounded-[4px] bg-[#1DD04A]" />}
                                  {s === "A" && <span className="inline-block w-2 h-4 rounded-[4px] bg-[#E02424]" />}
                                  {s === "L" && <span className="inline-block w-2 h-4 rounded-[4px] bg-[#3B82F6]" />}
                                  {s === "H" && <span className="inline-block w-2 h-4 rounded-[4px] bg-[#0F172A]" />}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Pagination placeholder matching the design */}
                    <div className="mt-5 pt-5 border-t border-border flex items-center justify-end gap-2 text-[13px] font-medium text-slate-500 dark:text-slate-400">
                      <button className="px-2 py-1 hover:text-slate-800 dark:text-slate-100 transition-colors">Prev</button>
                      <button className="w-7 h-7 rounded bg-[#F59E0B] text-white flex items-center justify-center font-semibold">1</button>
                      <button className="w-7 h-7 rounded hover:bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 flex items-center justify-center transition-colors">2</button>
                      <button className="px-2 py-1 hover:text-slate-800 dark:text-slate-100 transition-colors">Next</button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 4. Salary Content */}
          {activeMainTab === "Salary" && (
            <div className="space-y-5 text-left animate-in fade-in zoom-in-95 duration-200">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <div className="bg-white dark:bg-slate-900 border border-border rounded-xl p-5 card-shadow flex items-center justify-between">
                  <div>
                    <p className="text-[13px] font-bold text-slate-500 dark:text-slate-400 mb-1">Total Net Salary</p>
                    <p className="text-[20px] font-bold text-slate-900 dark:text-white">$5,55,410</p>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-[#E6F4FE] flex items-center justify-center border border-[#3B82F6]/20">
                    <User className="w-5 h-5 text-[#3B82F6]" />
                  </div>
                </div>
                <div className="bg-white dark:bg-slate-900 border border-border rounded-xl p-5 card-shadow flex items-center justify-between">
                  <div>
                    <p className="text-[13px] font-bold text-slate-500 dark:text-slate-400 mb-1">Total Gross Salary</p>
                    <p className="text-[20px] font-bold text-slate-900 dark:text-white">$5,58,380</p>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-[#E8F8E8] flex items-center justify-center border border-[#1D7F2C]/20">
                    <Briefcase className="w-5 h-5 text-[#1D7F2C]" />
                  </div>
                </div>
                <div className="bg-white dark:bg-slate-900 border border-border rounded-xl p-5 card-shadow flex items-center justify-between">
                  <div>
                    <p className="text-[13px] font-bold text-slate-500 dark:text-slate-400 mb-1">Total Deduction</p>
                    <p className="text-[20px] font-bold text-slate-900 dark:text-white">$2,500</p>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-[#FFF8E6] flex items-center justify-center border border-[#F59E0B]/20">
                    <Download className="w-5 h-5 text-[#F59E0B]" />
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-900 border border-border rounded-xl card-shadow overflow-hidden">
                <div className="p-4 border-b border-border">
                  <h3 className="text-[14px] font-bold text-slate-900 dark:text-white">Salary</h3>
                </div>

                <div className="p-4 flex items-center justify-between border-b border-border">
                  <div className="flex items-center gap-2 text-[12px] text-slate-600 dark:text-slate-300 font-medium">
                    <span>Row Per Page</span>
                    <select className="border border-border rounded px-2 py-1 outline-none bg-white dark:bg-slate-900 font-bold text-slate-700 dark:text-slate-200"><option>10</option></select>
                    <span>Entries</span>
                  </div>
                  <input type="text" placeholder="Search" className="px-3 py-1.5 border border-border rounded-lg text-[12px] outline-none w-64 focus:border-[#F59E0B]/50 transition-colors" />
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-[12px]">
                    <thead className="bg-[#F8FAFC] dark:bg-[#0F172A] text-slate-700 dark:text-slate-200 border-b border-border">
                      <tr>
                        <th className="px-5 py-3 font-semibold"><input type="checkbox" className="rounded" /></th>
                        <th className="px-5 py-3 font-semibold">ID <span className="text-[10px] text-slate-400 dark:text-slate-500 ml-1">⇅</span></th>
                        <th className="px-5 py-3 font-semibold">Salary For <span className="text-[10px] text-slate-400 dark:text-slate-500 ml-1">⇅</span></th>
                        <th className="px-5 py-3 font-semibold">Date <span className="text-[10px] text-slate-400 dark:text-slate-500 ml-1">⇅</span></th>
                        <th className="px-5 py-3 font-semibold">Payment Method</th>
                        <th className="px-5 py-3 font-semibold">Net Salary</th>
                        <th className="px-5 py-3"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border text-slate-600 dark:text-slate-300 font-medium">
                      {[
                        { id: "8198", month: "Apr - 2024", date: "04 May 2024", method: "Cash", salary: "$20,000" },
                        { id: "8197", month: "Mar - 2024", date: "05 Apr 2024", method: "Cheque", salary: "$19,000" },
                        { id: "8196", month: "Feb - 2024", date: "05 Mar 2024", method: "Cash", salary: "$19,500" },
                        { id: "8195", month: "Jan - 2024", date: "06 Feb 2024", method: "Cash", salary: "$20,000" },
                        { id: "8194", month: "Dec - 2023", date: "03 Jan 2024", method: "Cheque", salary: "$19,430" },
                        { id: "8193", month: "Nov - 2023", date: "05 Dec 2023", method: "Cheque", salary: "$19,480" },
                        { id: "8192", month: "Oct - 2023", date: "03 Nov 2023", method: "Cheque", salary: "$19,480" },
                        { id: "8191", month: "Sep - 2023", date: "04 Oct 2023", method: "Cheque", salary: "$18,000" },
                        { id: "8190", month: "Aug - 2023", date: "06 Sep 2023", method: "Cheque", salary: "$20,000" }
                      ].map((s, i) => (
                        <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                          <td className="px-5 py-3"><input type="checkbox" className="rounded" /></td>
                          <td className="px-5 py-3 text-[#F59E0B] font-bold">{s.id}</td>
                          <td className="px-5 py-3">{s.month}</td>
                          <td className="px-5 py-3">{s.date}</td>
                          <td className="px-5 py-3">{s.method}</td>
                          <td className="px-5 py-3">{s.salary}</td>
                          <td className="px-5 py-3">
                            <button className="px-3 py-1 bg-white dark:bg-slate-900 border border-border text-slate-700 dark:text-slate-200 text-[11px] font-bold rounded shadow-sm hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">View Payslip</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}


        </div>
      </div>

      {/* ----------------------------------------------------
          APPLY LEAVE MODAL
          ---------------------------------------------------- */}
      <Modal isOpen={isApplyLeaveOpen} onClose={() => setIsApplyLeaveOpen(false)} title="Apply Leave">
        <form onSubmit={(e) => { e.preventDefault(); setIsApplyLeaveOpen(false); }} className="space-y-4 text-left">
          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] font-semibold text-[#0F172A] dark:text-slate-100">Leave Date</label>
            <div className="relative">
              <input type="text" defaultValue="15 May 2024" className="w-full px-3.5 py-2.5 border border-border rounded-lg text-[13px] outline-none focus:border-[#F59E0B]/50 transition-colors" />
              <Calendar className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute right-3.5 top-3" />
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] font-semibold text-[#0F172A] dark:text-slate-100">Leave Type</label>
            <div className="relative">
              <select className="w-full px-3.5 py-2.5 border border-border rounded-lg text-[13px] outline-none focus:border-[#F59E0B]/50 transition-colors appearance-none bg-white dark:bg-slate-900">
                <option>Select</option>
                <option>Casual Leave</option>
                <option>Medical Leave</option>
              </select>
              <ChevronDown className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute right-3.5 top-3 pointer-events-none" />
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] font-semibold text-[#0F172A] dark:text-slate-100">Leave From date</label>
            <div className="relative">
              <input type="text" defaultValue="15 May 2024" className="w-full px-3.5 py-2.5 border border-border rounded-lg text-[13px] outline-none focus:border-[#F59E0B]/50 transition-colors" />
              <Calendar className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute right-3.5 top-3" />
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] font-semibold text-[#0F172A] dark:text-slate-100">Leave to Date</label>
            <div className="relative">
              <input type="text" defaultValue="15 May 2024" className="w-full px-3.5 py-2.5 border border-border rounded-lg text-[13px] outline-none focus:border-[#F59E0B]/50 transition-colors" />
              <Calendar className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute right-3.5 top-3" />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-[12px] font-semibold text-[#0F172A] dark:text-slate-100">Leave Days</label>
            <div className="flex items-center gap-4 text-[13px] text-slate-600 dark:text-slate-300">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="leaveDays" defaultChecked className="w-4 h-4 text-[#F59E0B] focus:ring-[#F59E0B] border-slate-300" />
                <span>Full Day</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="leaveDays" className="w-4 h-4 text-[#F59E0B] focus:ring-[#F59E0B] border-slate-300" />
                <span>First Half</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="leaveDays" className="w-4 h-4 text-[#F59E0B] focus:ring-[#F59E0B] border-slate-300" />
                <span>Second Half</span>
              </label>
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] font-semibold text-[#0F172A] dark:text-slate-100">No of Days</label>
            <input type="text" className="w-full px-3.5 py-2.5 border border-border rounded-lg text-[13px] outline-none focus:border-[#F59E0B]/50 transition-colors" />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] font-semibold text-[#0F172A] dark:text-slate-100">Reason</label>
            <textarea className="w-full px-3.5 py-2.5 border border-border rounded-lg text-[13px] outline-none focus:border-[#F59E0B]/50 transition-colors min-h-[60px]" />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setIsApplyLeaveOpen(false)}
              className="px-4 py-2 bg-[#F1F5F9] dark:bg-slate-800 hover:bg-[#E2E8F0] dark:hover:bg-slate-700 text-[#0F172A] dark:text-slate-100 text-[13px] font-semibold rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[#F59E0B] hover:bg-[#D97706] text-[13px] font-semibold rounded-lg text-white shadow-sm transition-colors"
            >
              Apply Leave
            </button>
          </div>
        </form>
      </Modal>

      {/* ----------------------------------------------------
          LOGIN DETAILS MODAL
          ---------------------------------------------------- */}
      <Modal isOpen={isLoginDetailsOpen} onClose={() => setIsLoginDetailsOpen(false)} title="Login Details">
        <div className="space-y-6 text-left">
          <div className="flex justify-center mb-6 mt-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary text-white flex items-center justify-center font-bold text-lg shadow-sm">
                {teacher.name.charAt(0)}
              </div>
              <div className="text-left">
                <p className="font-semibold text-[#0F172A] dark:text-slate-100">{teacher.name}</p>
                <p className="text-[13px] font-medium text-slate-500 dark:text-slate-400">{getClassName(teacher.classId)}</p>
              </div>
            </div>
          </div>

          <div className="border border-border rounded-lg overflow-hidden">
            <table className="w-full text-left text-[13px]">
              <thead className="bg-[#F8FAFC] dark:bg-[#0F172A] text-slate-700 dark:text-slate-200 border-b border-border">
                <tr>
                  <th className="px-4 py-3 font-semibold">User Type <span className="text-[10px] text-slate-400 dark:text-slate-500 ml-1">⇅</span></th>
                  <th className="px-4 py-3 font-semibold">User Name <span className="text-[10px] text-slate-400 dark:text-slate-500 ml-1">⇅</span></th>
                  <th className="px-4 py-3 font-semibold">Password <span className="text-[10px] text-slate-400 dark:text-slate-500 ml-1">⇅</span></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border text-slate-600 dark:text-slate-300 font-medium">
                <tr>
                  <td className="px-4 py-4">Parent</td>
                  <td className="px-4 py-4">parent53</td>
                  <td className="px-4 py-4">parent@53</td>
                </tr>
                <tr>
                  <td className="px-4 py-4">Teacher</td>
                  <td className="px-4 py-4">teacher20</td>
                  <td className="px-4 py-4">teacher@53</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="button"
              onClick={() => setIsLoginDetailsOpen(false)}
              className="px-5 py-2.5 bg-[#F1F5F9] dark:bg-slate-800 hover:bg-[#E2E8F0] dark:hover:bg-slate-700 text-[#0F172A] dark:text-slate-100 text-[14px] font-semibold rounded-lg transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </Modal>

    </div>
  );
}
