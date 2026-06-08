"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useAppState } from "../../../context/store";
import {
  User, Phone, Mail, FileText, Calendar, Droplet, Users, BookOpen, Clock, Settings, Building2, MapPin, Bus, Lock, Edit, ChevronDown, CheckCircle, RefreshCcw, Check, X, Download, Paperclip
} from "lucide-react";

function StudentViewContent() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const studentId = params.id as string;
  const { students, classes } = useAppState();

  const student = students.find(s => s.id === studentId) || students[0];
  const [bottomTab, setBottomTab] = useState<"Hostel" | "Transportation">("Hostel");

  // Tab states
  const initialTab = searchParams.get("tab") || "Student Details";
  const [activeMainTab, setActiveMainTab] = useState<string>(initialTab);
  const [attendanceSubTab, setAttendanceSubTab] = useState<"Leaves" | "Attendance">("Leaves");
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isFeesModalOpen, setIsFeesModalOpen] = useState(false);
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);

  if (!student) return <div className="p-10">Student not found.</div>;

  const getAvatar = (name: string) => `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=F1F5F9&color=5D6BEE&bold=true`;
  const getClassName = (cid: string) => classes.find(c => c.id === cid)?.name || "Unknown";

  return (
    <div className="space-y-6 bg-[#F8FAFC] dark:bg-[#0F172A] min-h-screen -m-6 p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-left">
        <div>
          <h1 className="text-[20px] leading-[24px] font-semibold text-[#0F172A] dark:text-slate-100">Student Details</h1>
          <div className="flex items-center gap-2 text-[14px] leading-[21px] text-[#68718a] mt-1 font-normal">
            <span>Dashboard</span>
            <span>/</span>
            <Link href="/dashboard/students" className="hover:text-[#F59E0B]">Student</Link>
            <span>/</span>
            <span className="text-[#0F172A] dark:text-slate-100 font-normal">Student Details</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button onClick={() => setIsLoginModalOpen(true)} className="flex items-center gap-2 px-3 py-1.5 border border-border rounded-lg bg-white dark:bg-slate-900 text-[12px] font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/50 shadow-sm transition-colors">
            <Lock className="w-3.5 h-3.5" />
            <span>Login Details</span>
          </button>
          <button
            onClick={() => router.push(`/dashboard/students/add?edit=${student.id}`)}
            className="flex items-center gap-2 px-3 py-1.5 bg-[#F59E0B] hover:bg-[#D97706] text-white text-[12px] font-bold rounded-lg shadow-sm transition-colors"
          >
            <Edit className="w-3.5 h-3.5" />
            <span>Edit Student</span>
          </button>
        </div>
      </div>

      <div className="flex flex-col xl:flex-row gap-6 items-start">
        {/* LEFT SIDEBAR (30%) */}
        <div className="w-full xl:w-[300px] flex-shrink-0 space-y-6">

          {/* Profile Card */}
          <div className="bg-white dark:bg-slate-900 border border-border rounded-xl p-4 card-shadow text-left relative overflow-hidden">
            <div className="flex items-center gap-4">
              <img src={getAvatar(student.name)} className="w-[60px] h-[60px] rounded-xl object-cover border border-slate-200 dark:border-slate-800" alt="Avatar" />
              <div>
                <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[9px] font-bold bg-[#E8F8E8] text-[#1D7F2C] mb-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#1DD04A]" />
                  Active
                </div>
                <h2 className="text-[16px] leading-[19.2px] font-medium text-[#0F172A] dark:text-slate-100">{student.name}</h2>
                <p className="text-[12px] text-[#F59E0B] font-bold mt-0.5">AD1 256589</p>
              </div>
            </div>
          </div>

          {/* Basic Information */}
          <div className="bg-white dark:bg-slate-900 border border-border rounded-xl overflow-hidden card-shadow text-left">
            <div className="px-4 py-3 border-b border-border bg-slate-50/50 dark:bg-slate-800/50">
              <h3 className="text-[16px] leading-[19.2px] font-medium text-[#0F172A] dark:text-slate-100">Basic Information</h3>
            </div>
            <div className="p-4 text-[12px]">
              <div className="space-y-3.5">
                <InfoRow label="Roll No" value={student.rollNo} />
                <InfoRow label="Gender" value="Female" />
                <InfoRow label="Date Of Birth" value="25 Jan 2008" />
                <InfoRow label="Blood Group" value="O +ve" />
                <InfoRow label="Blood Group" value="Red" />
                <InfoRow label="Religion" value="Christianity" />
                <InfoRow label="Caste" value="Catholic" />
                <InfoRow label="Category" value="OBC" />
                <InfoRow label="Mother tongue" value="English" />
                <div className="flex justify-between py-1">
                  <span className="text-[14px] leading-[21px] font-medium text-[#0F172A] dark:text-slate-100">Language</span>
                  <div className="flex gap-1.5">
                    <span className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 rounded text-[10px] font-bold text-slate-700 dark:text-slate-200">English</span>
                    <span className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 rounded text-[10px] font-bold text-slate-700 dark:text-slate-200">Spanish</span>
                  </div>
                </div>
              </div>
              <button onClick={() => setIsFeesModalOpen(true)} className="w-full mt-5 py-2 bg-[#F59E0B] hover:bg-[#D97706] text-white text-[12px] font-bold rounded-lg shadow-sm transition-colors">
                Add Fees
              </button>
            </div>
          </div>

          {/* Primary Contact Info */}
          <div className="bg-white dark:bg-slate-900 border border-border rounded-xl overflow-hidden card-shadow text-left">
            <div className="px-4 py-3 border-b border-border bg-slate-50/50 dark:bg-slate-800/50">
              <h3 className="text-[13px] font-bold text-slate-900 dark:text-white">Primary Contact Info</h3>
            </div>
            <div className="p-4 space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-slate-50 dark:bg-slate-800/50 flex items-center justify-center border border-slate-100 dark:border-slate-800/50 flex-shrink-0">
                  <Phone className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                </div>
                <div>
                  <p className="text-[11px] font-bold text-slate-900 dark:text-white mb-0.5">Phone Number</p>
                  <p className="text-[12px] text-slate-500 dark:text-slate-400 font-medium">+1 46548 84498</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-slate-50 dark:bg-slate-800/50 flex items-center justify-center border border-slate-100 dark:border-slate-800/50 flex-shrink-0">
                  <Mail className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                </div>
                <div>
                  <p className="text-[11px] font-bold text-slate-900 dark:text-white mb-0.5">Email Address</p>
                  <p className="text-[12px] text-slate-500 dark:text-slate-400 font-medium">{student.email}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Sibling Information */}
          <div className="bg-white dark:bg-slate-900 border border-border rounded-xl overflow-hidden card-shadow text-left">
            <div className="px-4 py-3 border-b border-border bg-slate-50/50 dark:bg-slate-800/50">
              <h3 className="text-[13px] font-bold text-slate-900 dark:text-white">Sibling Information</h3>
            </div>
            <div className="p-4 space-y-3.5">
              <div className="flex items-center gap-3">
                <img src={getAvatar("Ralph Claudia")} className="w-9 h-9 rounded object-cover" />
                <div>
                  <p className="text-[12px] font-bold text-slate-900 dark:text-white">Ralph Claudia</p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">III, B</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded bg-[#FF4A6B]/10 flex items-center justify-center">
                  <img src={getAvatar("Julie Scott")} className="w-9 h-9 rounded object-cover" />
                </div>
                <div>
                  <p className="text-[12px] font-bold text-slate-900 dark:text-white">Julie Scott</p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">V, A</p>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Tabs (Hostel/Transport) */}
          <div className="bg-white dark:bg-slate-900 border border-border rounded-xl overflow-hidden card-shadow text-left">
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
                  <div className="w-8 h-8 rounded-lg bg-[#F59E0B]/10 flex items-center justify-center flex-shrink-0">
                    <Building2 className="w-3.5 h-3.5 text-[#F59E0B]" />
                  </div>
                  <div>
                    <p className="text-[12px] font-bold text-slate-900 dark:text-white">HI-Hostel, Floor</p>
                    <p className="text-[11px] text-[#F59E0B] font-bold">Room No : 25</p>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#F59E0B]/10 flex items-center justify-center flex-shrink-0">
                    <Bus className="w-3.5 h-3.5 text-[#F59E0B]" />
                  </div>
                  <div>
                    <p className="text-[12px] font-bold text-slate-900 dark:text-white">Bus Route 42</p>
                    <p className="text-[11px] text-[#F59E0B] font-bold">Pickup : 07:30 AM</p>
                  </div>
                </div>
              )}
            </div>
          </div>

        </div>

        {/* RIGHT MAIN CONTENT (70%) */}
        <div className="flex-1 min-w-0 flex flex-col gap-5">

          {/* Top Tabs Header */}
          <div className="bg-white dark:bg-slate-900 border-b border-border rounded-t-xl overflow-x-auto custom-scrollbar flex items-center gap-1 px-1.5 pt-1.5">
            <TabItem icon={<User className="w-3.5 h-3.5" />} label="Student Details" active={activeMainTab === "Student Details"} onClick={() => setActiveMainTab("Student Details")} />
            <TabItem icon={<Calendar className="w-3.5 h-3.5" />} label="Time Table" active={activeMainTab === "Time Table"} onClick={() => setActiveMainTab("Time Table")} />
            <TabItem icon={<Clock className="w-3.5 h-3.5" />} label="Leave & Attendance" active={activeMainTab === "Leave & Attendance"} onClick={() => setActiveMainTab("Leave & Attendance")} />
            <TabItem icon={<FileText className="w-3.5 h-3.5" />} label="Fees" active={activeMainTab === "Fees"} onClick={() => setActiveMainTab("Fees")} />
            <TabItem icon={<CheckCircle className="w-3.5 h-3.5" />} label="Exam & Results" active={activeMainTab === "Exam & Results"} onClick={() => setActiveMainTab("Exam & Results")} />
            <TabItem icon={<BookOpen className="w-3.5 h-3.5" />} label="Library" active={activeMainTab === "Library"} onClick={() => setActiveMainTab("Library")} />
          </div>

          {/* 1. Student Details Tab Content */}
          {activeMainTab === "Student Details" && (
            <div className="space-y-5 text-left animate-in fade-in zoom-in-95 duration-200">
              {/* Parents Information */}
              <div className="bg-white dark:bg-slate-900 border border-border rounded-xl card-shadow overflow-hidden">
                <div className="p-4 border-b border-border bg-slate-50/30">
                  <h3 className="text-[14px] font-bold text-slate-900 dark:text-white">Parents Information</h3>
                </div>
                <div className="p-5 space-y-4">
                  <ParentRow name="Jerald Vicinius" role="Father" phone="+1 45545 46464" email="jera@example.com" />
                  <ParentRow name="Roberta Webber" role="Mother" phone="+1 46499 24357" email="robe@example.com" />
                  <ParentRow name="Jerald Vicinius" role="Guardian (Father)" phone="+1 45545 46464" email="jera@example.com" hideBorder />
                </div>
              </div>

              {/* Documents and Address Row */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                {/* Documents */}
                <div className="bg-white dark:bg-slate-900 border border-border rounded-xl card-shadow overflow-hidden">
                  <div className="p-4 border-b border-border bg-slate-50/30">
                    <h3 className="text-[14px] font-bold text-slate-900 dark:text-white">Documents</h3>
                  </div>
                  <div className="p-5 space-y-3">
                    <DocRow title="BirthCertificate.pdf" />
                    <DocRow title="Transfer Certificate.pdf" />
                  </div>
                </div>

                {/* Address */}
                <div className="bg-white dark:bg-slate-900 border border-border rounded-xl card-shadow overflow-hidden">
                  <div className="p-4 border-b border-border bg-slate-50/30">
                    <h3 className="text-[14px] font-bold text-slate-900 dark:text-white">Address</h3>
                  </div>
                  <div className="p-5 space-y-5">
                    <div className="flex items-start gap-3">
                      <div className="w-7 h-7 rounded-full bg-slate-50 dark:bg-slate-800/50 flex items-center justify-center flex-shrink-0 border border-slate-100 dark:border-slate-800/50">
                        <MapPin className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                      </div>
                      <div>
                        <p className="text-[12px] font-bold text-slate-900 dark:text-white mb-0.5">Current Address</p>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">3495 Red Hawk Road, Buffalo Lake, MN 55314</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-7 h-7 rounded-full bg-slate-50 dark:bg-slate-800/50 flex items-center justify-center flex-shrink-0 border border-slate-100 dark:border-slate-800/50">
                        <MapPin className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                      </div>
                      <div>
                        <p className="text-[12px] font-bold text-slate-900 dark:text-white mb-0.5">Permanent Address</p>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">3495 Red Hawk Road, Buffalo Lake, MN 55314</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Previous School Details */}
              <div className="bg-white dark:bg-slate-900 border border-border rounded-xl card-shadow overflow-hidden">
                <div className="p-4 border-b border-border bg-slate-50/30">
                  <h3 className="text-[14px] font-bold text-slate-900 dark:text-white">Previous School Details</h3>
                </div>
                <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <p className="text-[11px] font-bold text-slate-900 dark:text-white mb-1">Previous School Name</p>
                    <p className="text-[12px] text-slate-500 dark:text-slate-400 font-medium">Oxford Matriculation, USA</p>
                  </div>
                  <div>
                    <p className="text-[11px] font-bold text-slate-900 dark:text-white mb-1">School Address</p>
                    <p className="text-[12px] text-slate-500 dark:text-slate-400 font-medium">1852 Barnes Avenue, Cincinnati, OH 45202</p>
                  </div>
                </div>
              </div>

              {/* Bank Details & Medical Row */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                <div className="bg-white dark:bg-slate-900 border border-border rounded-xl card-shadow overflow-hidden h-full">
                  <div className="p-4 border-b border-border bg-slate-50/30">
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
                  <div className="p-4 border-b border-border bg-slate-50/30">
                    <h3 className="text-[14px] font-bold text-slate-900 dark:text-white">Medical History</h3>
                  </div>
                  <div className="p-5 grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-[11px] font-bold text-slate-900 dark:text-white mb-2">Known Allergies</p>
                      <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-[10px] font-bold rounded border border-slate-200 dark:border-slate-800">Rashes</span>
                    </div>
                    <div>
                      <p className="text-[11px] font-bold text-slate-900 dark:text-white mb-1">Medications</p>
                      <p className="text-[12px] text-slate-500 dark:text-slate-400 font-medium">-</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Other Info */}
              <div className="bg-white dark:bg-slate-900 border border-border rounded-xl card-shadow overflow-hidden">
                <div className="p-4 border-b border-border bg-slate-50/30">
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

          {/* 2. Fees Tab Content */}
          {activeMainTab === "Fees" && (
            <div className="space-y-5 text-left animate-in fade-in zoom-in-95 duration-200">
              <div className="bg-white dark:bg-slate-900 border border-border rounded-xl card-shadow overflow-hidden">
                <div className="p-4 border-b border-border flex items-center justify-between">
                  <h3 className="text-[14px] font-bold text-slate-900 dark:text-white">Fees</h3>
                  <div className="px-3 py-1.5 border border-border rounded-lg flex items-center gap-2 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 text-[11px] font-bold text-slate-700 dark:text-slate-200">
                    <Calendar className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                    <span>Year : 2024 / 2025</span>
                    <ChevronDown className="w-3.5 h-3.5" />
                  </div>
                </div>

                <div className="p-4 border-b border-border flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-50/30">
                  <div className="flex items-center gap-2 text-[12px] text-slate-600 dark:text-slate-300 font-medium">
                    <span>Row Per Page</span>
                    <select className="border border-border rounded px-2 py-1 outline-none bg-white dark:bg-slate-900 font-bold text-slate-700 dark:text-slate-200"><option>10</option></select>
                    <span>Entries</span>
                  </div>
                  <input type="text" placeholder="Search" className="px-3 py-1.5 border border-border rounded-lg text-[12px] outline-none w-full sm:w-64 focus:border-[#F59E0B]/50 transition-colors" />
                </div>

                <div className="overflow-x-auto custom-scrollbar">
                  <table className="w-full text-left text-[12px] min-w-[900px]">
                    <thead className="bg-[#F8FAFC] dark:bg-[#0F172A] text-slate-700 dark:text-slate-200 border-b border-border font-bold">
                      <tr>
                        <th className="px-5 py-3 whitespace-nowrap">Fees Group</th>
                        <th className="px-5 py-3 whitespace-nowrap">Fees Code</th>
                        <th className="px-5 py-3 whitespace-nowrap">Due Date</th>
                        <th className="px-5 py-3 whitespace-nowrap">Amount $</th>
                        <th className="px-5 py-3 whitespace-nowrap">Status</th>
                        <th className="px-5 py-3 whitespace-nowrap">Ref ID</th>
                        <th className="px-5 py-3 whitespace-nowrap">Mode</th>
                        <th className="px-5 py-3 whitespace-nowrap">Date Paid</th>
                        <th className="px-5 py-3 whitespace-nowrap">Discount ($)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border text-slate-600 dark:text-slate-300 font-medium">
                      {/* Total Row */}
                      <tr className="bg-[#0F172A] text-white">
                        <td className="px-5 py-3">-</td>
                        <td className="px-5 py-3"></td>
                        <td className="px-5 py-3"></td>
                        <td className="px-5 py-3 font-bold">2000</td>
                        <td className="px-5 py-3"></td>
                        <td className="px-5 py-3"></td>
                        <td className="px-5 py-3"></td>
                        <td className="px-5 py-3"></td>
                        <td className="px-5 py-3 font-bold">200</td>
                      </tr>
                      <FeeRow group="Class 1 General (Dec month Fees)" code="dec-month-fees" due="10 Jan 2024" amount={2500} status="Paid" refId="#435443" mode="Cash" paid="05 Jan 2024" discount="10%" />
                      <FeeRow group="Class 1 General (Jan month Fees)" code="jan-month-fees" due="10 Feb 2024" amount={2000} status="Paid" refId="#435443" mode="Cash" paid="01 Feb 2024" discount="10%" />
                      <FeeRow group="Class 1 General (Jul month Fees)" code="jul-month-fees" due="10 Aug 2024" amount={2500} status="Paid" refId="#435449" mode="Cash" paid="01 Aug 2024" discount="10%" />
                      <FeeRow group="Class 1 General (Mar month Fees)" code="mar-month-fees" due="10 Apr 2024" amount={2500} status="Paid" refId="#435453" mode="Cash" paid="03 Apr 2024" discount="10%" />
                      <FeeRow group="Class 1 General (Apr month Fees)" code="apr-month-fees" due="10 May 2024" amount={2500} status="Paid" refId="#435453" mode="Cash" paid="03 Apr 2024" discount="10%" />
                      <FeeRow group="Class 1 General (Jun month Fees)" code="jun-month-fees" due="10 Jul 2024" amount={2500} status="Paid" refId="#435450" mode="Cash" paid="05 Jul 2024" discount="10%" />
                      <FeeRow group="Class 1 General (May month Fees)" code="may-month-fees" due="10 Jun 2024" amount={2500} status="Paid" refId="#435451" mode="Cash" paid="02 Jun 2024" discount="10%" />
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* 3. Exam & Results Tab Content */}
          {activeMainTab === "Exam & Results" && (
            <div className="space-y-5 text-left animate-in fade-in zoom-in-95 duration-200">
              <div className="bg-white dark:bg-slate-900 border border-border rounded-xl card-shadow overflow-hidden">
                <div className="p-4 border-b border-border flex items-center justify-between">
                  <h3 className="text-[14px] font-bold text-slate-900 dark:text-white">Exams & Results</h3>
                  <div className="px-3 py-1.5 border border-border rounded-lg flex items-center gap-2 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 text-[11px] font-bold text-slate-700 dark:text-slate-200">
                    <Calendar className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                    <span>Year : 2024 / 2025</span>
                    <ChevronDown className="w-3.5 h-3.5" />
                  </div>
                </div>

                <div className="p-5 space-y-4">
                  <ExamCard title="Monthly Test (May)" initiallyExpanded={true} />
                  <ExamCard title="Monthly Test (Apr)" initiallyExpanded={false} />
                  <ExamCard title="Monthly Test (Mar)" initiallyExpanded={false} />
                </div>
              </div>
            </div>
          )}

          {/* Time Table Content */}
          {activeMainTab === "Time Table" && (
            <div className="bg-white dark:bg-slate-900 border border-border rounded-xl card-shadow p-5 text-left animate-in fade-in zoom-in-95 duration-200">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-[14px] font-bold text-slate-900 dark:text-white">Exams & Results</h2>
                <div className="px-3 py-1.5 border border-border rounded-lg text-[11px] font-bold text-slate-700 dark:text-slate-200 flex items-center gap-2 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50">
                  <Calendar className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                  <span>This Year</span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                </div>
              </div>

              {/* Time Table Grid */}
              <div className="overflow-x-auto custom-scrollbar">
                <div className="min-w-[900px]">
                  <div className="grid grid-cols-6 gap-3 mb-3">
                    {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"].map(day => (
                      <div key={day} className="text-[13px] font-bold text-slate-900 dark:text-white pb-2 border-b border-slate-100 dark:border-slate-800/50">{day}</div>
                    ))}
                  </div>

                  <div className="grid grid-cols-6 gap-3">
                    {timeTableData.map((col, idx) => (
                      <div key={idx} className="flex flex-col gap-3">
                        {col.map((slot, sIdx) => (
                          <div key={sIdx} className={`p-3 rounded-lg border ${slot.bg} ${slot.border} transition-transform hover:-translate-y-1 cursor-pointer`}>
                            <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500 dark:text-slate-400 mb-1.5">
                              <Clock className="w-3 h-3" />
                              {slot.time}
                            </div>
                            <p className={`text-[12px] font-bold mb-2.5 ${slot.text}`}>Subject : {slot.subject}</p>
                            <div className="flex items-center gap-1.5">
                              <img src={getAvatar(slot.teacher)} className="w-5 h-5 rounded-md object-cover" />
                              <span className="text-[11px] font-bold text-slate-700 dark:text-slate-200">{slot.teacher}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>

                  {/* Breaks Section */}
                  <div className="flex items-center gap-5 mt-6 pt-5 border-t border-slate-100 dark:border-slate-800/50">
                    <div className="flex-1 p-3 rounded-xl border border-slate-100 dark:border-slate-800/50 flex flex-col gap-1.5">
                      <span className="px-2.5 py-0.5 bg-[#F59E0B] text-white text-[10px] font-bold rounded self-start">Morning Break</span>
                      <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-600 dark:text-slate-300 mt-1">
                        <Clock className="w-3.5 h-3.5" /> 10:30 to 10:45 AM
                      </div>
                    </div>
                    <div className="flex-1 p-3 rounded-xl border border-slate-100 dark:border-slate-800/50 flex flex-col gap-1.5">
                      <span className="px-2.5 py-0.5 bg-[#F59E0B] text-white text-[10px] font-bold rounded self-start">Lunch</span>
                      <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-600 dark:text-slate-300 mt-1">
                        <Clock className="w-3.5 h-3.5" /> 12:15 to 01:30 PM
                      </div>
                    </div>
                    <div className="flex-1 p-3 rounded-xl border border-slate-100 dark:border-slate-800/50 flex flex-col gap-1.5">
                      <span className="px-2.5 py-0.5 bg-[#10B981] text-white text-[10px] font-bold rounded self-start">Evening Break</span>
                      <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-600 dark:text-slate-300 mt-1">
                        <Clock className="w-3.5 h-3.5" /> 03:30 PM to 03:45 PM
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          )}

          {/* Leave & Attendance Content */}
          {activeMainTab === "Leave & Attendance" && (
            <div className="space-y-5 text-left animate-in fade-in zoom-in-95 duration-200">
              {/* Sub Tab Toggle */}
              <div className="bg-white dark:bg-slate-900 border border-border rounded-xl p-1 flex items-center gap-1 w-fit card-shadow">
                <button
                  onClick={() => setAttendanceSubTab("Leaves")}
                  className={`px-5 py-1.5 text-[12px] font-bold rounded-lg transition-colors ${attendanceSubTab === "Leaves" ? "bg-[#F59E0B] text-white" : "text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800/50 border border-transparent hover:border-slate-200 dark:border-slate-800"}`}
                >
                  Leaves
                </button>
                <button
                  onClick={() => setAttendanceSubTab("Attendance")}
                  className={`px-5 py-1.5 text-[12px] font-bold rounded-lg transition-colors ${attendanceSubTab === "Attendance" ? "bg-[#F59E0B] text-white" : "text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800/50 border border-transparent hover:border-slate-200 dark:border-slate-800"}`}
                >
                  Attendance
                </button>
              </div>

              {/* Leaves View */}
              {attendanceSubTab === "Leaves" && (
                <div className="space-y-5 animate-in slide-in-from-right-4 duration-300">
                  {/* Summary Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <LeaveCard title="Medical Leave (10)" used={5} available={5} />
                    <LeaveCard title="Casual Leave (12)" used={1} available={11} />
                    <LeaveCard title="Maternity Leave (10)" used={0} available={10} />
                    <LeaveCard title="Paternity Leave (0)" used={0} available={0} />
                  </div>

                  {/* Leaves Table */}
                  <div className="bg-white dark:bg-slate-900 border border-border rounded-xl card-shadow overflow-hidden">
                    <div className="p-4 border-b border-border flex items-center justify-between">
                      <h3 className="text-[14px] font-bold text-slate-900 dark:text-white">Leaves</h3>
                      <button onClick={() => setIsLeaveModalOpen(true)} className="flex items-center gap-2 px-3 py-1.5 bg-[#F59E0B] text-white rounded-lg text-[12px] font-bold shadow-sm hover:bg-[#D97706] transition-colors">
                        <Calendar className="w-3.5 h-3.5" /> Apply Leave
                      </button>
                    </div>

                    <div className="p-4 border-b border-border flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-50/30">
                      <div className="flex items-center gap-2 text-[12px] text-slate-600 dark:text-slate-300 font-medium">
                        <span>Row Per Page</span>
                        <select className="border border-border rounded px-2 py-1 outline-none bg-white dark:bg-slate-900 font-bold"><option>10</option></select>
                        <span>Entries</span>
                      </div>
                      <input type="text" placeholder="Search" className="px-3 py-1.5 border border-border rounded-lg text-[12px] outline-none w-full sm:w-64 focus:border-[#F59E0B]/50 transition-colors" />
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-[12px]">
                        <thead className="bg-[#F8FAFC] dark:bg-[#0F172A] text-slate-700 dark:text-slate-200 border-b border-border font-bold">
                          <tr>
                            <th className="px-5 py-3">Leave Type</th>
                            <th className="px-5 py-3">Leave Date</th>
                            <th className="px-5 py-3">No of Days</th>
                            <th className="px-5 py-3">Applied On</th>
                            <th className="px-5 py-3">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border text-slate-600 dark:text-slate-300 font-medium">
                          <LeaveRow type="Casual Leave" date="07 May 2024 - 07 may 2024" days={1} applied="07 May 2024" status="Approved" />
                          <LeaveRow type="Casual Leave" date="08 May 2024 - 08 may 2024" days={1} applied="04 May 2024" status="Approved" />
                          <LeaveRow type="Casual Leave" date="20 May 2024 - 20 may 2024" days={1} applied="19 May 2024" status="Pending" />
                          <LeaveRow type="Medical Leave" date="05 May 2024 - 09 may 2024" days={5} applied="05 May 2024" status="Approved" />
                          <LeaveRow type="Medical Leave" date="08 May 2024 - 11 may 2024" days={4} applied="08 May 2024" status="Pending" />
                          <LeaveRow type="Special Leave" date="09 May 2024 - 09 may 2024" days={1} applied="09 May 2024" status="Pending" />
                        </tbody>
                      </table>
                    </div>

                    <div className="p-3 flex items-center justify-end gap-2 text-[12px] font-bold border-t border-border">
                      <button className="px-2 py-1 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:text-white transition-colors">Prev</button>
                      <button className="w-6 h-6 rounded bg-[#F59E0B] text-white flex items-center justify-center shadow-sm">1</button>
                      <button className="px-2 py-1 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:text-white transition-colors">Next</button>
                    </div>
                  </div>
                </div>
              )}

              {/* Attendance View */}
              {attendanceSubTab === "Attendance" && (
                <div className="space-y-5 animate-in slide-in-from-left-4 duration-300">
                  <div className="bg-white dark:bg-slate-900 border border-border rounded-xl card-shadow overflow-hidden">
                    <div className="p-4 border-b border-border flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <h3 className="text-[14px] font-bold text-slate-900 dark:text-white">Attendance</h3>
                      <div className="flex items-center gap-3 text-[12px] text-slate-600 dark:text-slate-300 font-bold">
                        <span className="flex items-center gap-2">Last Updated on : 25 May 2024 <div className="w-5 h-5 rounded-full bg-[#F59E0B] text-white flex items-center justify-center cursor-pointer hover:bg-[#D97706] transition-colors"><RefreshCcw className="w-3 h-3" /></div></span>
                        <div className="px-3 py-1.5 border border-border rounded-lg flex items-center gap-2 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                          <Calendar className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                          <span>Year : 2024 / 2025</span>
                          <ChevronDown className="w-3.5 h-3.5" />
                        </div>
                      </div>
                    </div>
                    <div className="p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      <AttSumCard title="Present" value="265" icon={<User className="w-4 h-4 text-[#F59E0B]" />} iconBg="bg-[#F59E0B]/10" />
                      <AttSumCard title="Absent" value="05" icon={<User className="w-4 h-4 text-[#FF4A6B]" />} iconBg="bg-[#FF4A6B]/10" />
                      <AttSumCard title="Half Day" value="01" icon={<User className="w-4 h-4 text-[#3B82F6]" />} iconBg="bg-[#3B82F6]/10" />
                      <AttSumCard title="Late" value="12" icon={<User className="w-4 h-4 text-[#F59E0B]" />} iconBg="bg-[#F59E0B]/10" />
                    </div>
                  </div>

                  <div className="bg-white dark:bg-slate-900 border border-border rounded-xl card-shadow overflow-hidden">
                    <div className="p-4 border-b border-border flex items-center justify-between">
                      <h3 className="text-[14px] font-bold text-slate-900 dark:text-white">Leave & Attendance</h3>
                      <div className="flex items-center gap-3">
                        <div className="px-3 py-1.5 border border-border rounded-lg text-[12px] font-bold text-slate-700 dark:text-slate-200 flex items-center gap-2 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                          <Calendar className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                          <span>This Year</span>
                          <ChevronDown className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                        </div>
                        <div className="px-3 py-1.5 border border-border rounded-lg text-[12px] font-bold text-slate-700 dark:text-slate-200 flex items-center gap-2 cursor-pointer bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:bg-slate-800 transition-colors">
                          <FileText className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                          <span>Export</span>
                          <ChevronDown className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                        </div>
                      </div>
                    </div>

                    {/* Legend */}
                    <div className="p-4 flex items-center gap-4 flex-wrap border-b border-slate-50">
                      <LegendBadge label="Present" color="bg-[#10B981]" icon={<Check className="w-3 h-3 text-white" />} />
                      <LegendBadge label="Absent" color="bg-[#EF4444]" icon={<X className="w-3 h-3 text-white" />} />
                      <LegendBadge label="Late" color="bg-[#0EA5E9]" icon={<Clock className="w-3 h-3 text-white" />} />
                      <LegendBadge label="Halfday" color="bg-[#334155]" icon={<FileText className="w-3 h-3 text-white" />} />
                      <LegendBadge label="Holiday" color="bg-[#3B82F6]" icon={<FileText className="w-3 h-3 text-white" />} />
                    </div>

                    <div className="p-4 border-b border-border flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-50/30">
                      <div className="flex items-center gap-2 text-[12px] text-slate-600 dark:text-slate-300 font-medium">
                        <span>Row Per Page</span>
                        <select className="border border-border rounded px-2 py-1 outline-none bg-white dark:bg-slate-900 font-bold"><option>10</option></select>
                        <span>Entries</span>
                      </div>
                      <input type="text" placeholder="Search" className="px-3 py-1.5 border border-border rounded-lg text-[12px] outline-none w-full sm:w-64 focus:border-[#F59E0B]/50 transition-colors" />
                    </div>

                    <div className="overflow-x-auto custom-scrollbar">
                      <table className="w-full text-left text-[12px] min-w-[800px]">
                        <thead className="bg-[#F8FAFC] dark:bg-[#0F172A] text-slate-700 dark:text-slate-200 border-b border-border font-bold">
                          <tr>
                            <th className="px-4 py-3 whitespace-nowrap">Date | Month</th>
                            {["Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar", "Apr"].map(m => (
                              <th key={m} className="px-4 py-3 text-center">{m}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border text-slate-600 dark:text-slate-300 font-medium">
                          {[1, 2, 3, 4, 5].map(day => (
                            <tr key={day} className="hover:bg-slate-50/50 dark:bg-slate-800/50 transition-colors">
                              <td className="px-4 py-3.5 font-bold text-slate-900 dark:text-white">{day.toString().padStart(2, '0')}</td>
                              {["Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar", "Apr"].map(m => {
                                let bg = "bg-[#10B981]";
                                if (day === 3 && m === "Jul") bg = "bg-[#EF4444]";
                                if (day === 3 && m === "Feb") bg = "bg-[#EF4444]";
                                if (m === "Mar" || m === "Apr") return <td key={m} className="px-4 py-3 text-center"></td>;
                                return (
                                  <td key={m} className="px-4 py-3 text-center">
                                    <div className={`w-2 h-5 rounded-full ${bg} mx-auto shadow-sm`} />
                                  </td>
                                )
                              })}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                  </div>
                </div>
              )}
            </div>
          )}

        </div>
      </div>
      {/* --- MODALS --- */}
      {isLoginModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-xl w-[90%] max-w-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-5 border-b border-border">
              <h2 className="text-[16px] font-bold text-slate-900 dark:text-white">Login Details</h2>
              <button onClick={() => setIsLoginModalOpen(false)} className="w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:bg-slate-200 transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-6">
              <div className="flex flex-col items-center justify-center mb-6">
                <img src={getAvatar(student.name)} className="w-12 h-12 rounded-lg object-cover mb-2" />
                <h3 className="text-[14px] font-bold text-slate-900 dark:text-white">{student.name}</h3>
                <p className="text-[12px] font-medium text-slate-500 dark:text-slate-400">III, A</p>
              </div>
              <div className="border border-border rounded-xl overflow-hidden">
                <table className="w-full text-left text-[13px]">
                  <thead className="bg-[#F8FAFC] dark:bg-[#0F172A] text-slate-700 dark:text-slate-200 font-bold border-b border-border">
                    <tr>
                      <th className="px-5 py-3.5">User Type</th>
                      <th className="px-5 py-3.5">User Name</th>
                      <th className="px-5 py-3.5">Password</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border font-medium text-slate-600 dark:text-slate-300">
                    <tr>
                      <td className="px-5 py-4">Parent</td>
                      <td className="px-5 py-4">parent53</td>
                      <td className="px-5 py-4">parent@53</td>
                    </tr>
                    <tr>
                      <td className="px-5 py-4">Student</td>
                      <td className="px-5 py-4">student20</td>
                      <td className="px-5 py-4">stdt@53</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="mt-6 flex justify-end">
                <button onClick={() => setIsLoginModalOpen(false)} className="px-5 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-[13px] font-bold rounded-lg hover:bg-slate-200 transition-colors">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {isFeesModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-xl w-full max-w-3xl overflow-hidden my-auto animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-5 border-b border-border">
              <div className="flex items-center gap-3">
                <h2 className="text-[16px] font-bold text-slate-900 dark:text-white">Collect Fees</h2>
                <span className="px-2 py-0.5 bg-[#F59E0B] text-white text-[10px] font-bold rounded">AD1 24556</span>
              </div>
              <button onClick={() => setIsFeesModalOpen(false)} className="w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:bg-slate-200 transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-6">
              <div className="flex items-center justify-between bg-[#F8FAFC] dark:bg-[#0F172A] rounded-xl p-4 mb-6 border border-slate-100 dark:border-slate-800/50">
                <div className="flex items-center gap-3">
                  <img src={getAvatar(student.name)} className="w-10 h-10 rounded-lg object-cover" />
                  <div>
                    <h3 className="text-[13px] font-bold text-slate-900 dark:text-white">{student.name}</h3>
                    <p className="text-[12px] font-medium text-slate-500 dark:text-slate-400">III, A</p>
                  </div>
                </div>
                <div>
                  <p className="text-[11px] font-bold text-slate-900 dark:text-white mb-0.5">Total Outstanding</p>
                  <p className="text-[13px] font-bold text-slate-700 dark:text-slate-200">2000</p>
                </div>
                <div>
                  <p className="text-[11px] font-bold text-slate-900 dark:text-white mb-0.5">Last Date</p>
                  <p className="text-[13px] font-bold text-slate-700 dark:text-slate-200">25 May 2024</p>
                </div>
                <div>
                  <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded text-[10px] font-bold bg-[#FFF0F2] text-[#FF4A6B]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#FF4A6B]" /> Unpaid
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[12px] font-bold text-slate-900 dark:text-white">Fees Group</label>
                  <div className="relative border border-border rounded-lg overflow-hidden">
                    <select className="w-full px-3 py-2.5 text-[13px] font-medium text-slate-700 dark:text-slate-200 outline-none appearance-none bg-white dark:bg-slate-900 cursor-pointer"><option>Select</option></select>
                    <ChevronDown className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute right-3 top-3 pointer-events-none" />
                  </div>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[12px] font-bold text-slate-900 dark:text-white">Fees Type</label>
                  <div className="relative border border-border rounded-lg overflow-hidden">
                    <select className="w-full px-3 py-2.5 text-[13px] font-medium text-slate-700 dark:text-slate-200 outline-none appearance-none bg-white dark:bg-slate-900 cursor-pointer"><option>Select</option></select>
                    <ChevronDown className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute right-3 top-3 pointer-events-none" />
                  </div>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[12px] font-bold text-slate-900 dark:text-white">Amount</label>
                  <input type="text" placeholder="Enter Amount" className="px-3 py-2.5 border border-border rounded-lg text-[13px] font-medium outline-none focus:border-[#F59E0B]/50 transition-colors" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[12px] font-bold text-slate-900 dark:text-white">Collection Date</label>
                  <div className="relative border border-border rounded-lg overflow-hidden">
                    <input type="text" placeholder="Select" className="w-full px-3 py-2.5 text-[13px] font-medium outline-none bg-white dark:bg-slate-900" />
                    <Calendar className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute right-3 top-3 pointer-events-none" />
                  </div>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[12px] font-bold text-slate-900 dark:text-white">Payment Type</label>
                  <div className="relative border border-border rounded-lg overflow-hidden">
                    <select className="w-full px-3 py-2.5 text-[13px] font-medium text-slate-700 dark:text-slate-200 outline-none appearance-none bg-white dark:bg-slate-900 cursor-pointer"><option>Select</option></select>
                    <ChevronDown className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute right-3 top-3 pointer-events-none" />
                  </div>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[12px] font-bold text-slate-900 dark:text-white">Payment Reference No</label>
                  <input type="text" placeholder="Enter Payment Reference No" className="px-3 py-2.5 border border-border rounded-lg text-[13px] font-medium outline-none focus:border-[#F59E0B]/50 transition-colors" />
                </div>
              </div>

              <div className="flex items-center justify-between mb-5">
                <div>
                  <p className="text-[12px] font-bold text-slate-900 dark:text-white mb-0.5">Status</p>
                  <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400">Change the Status by toggle</p>
                </div>
                <div className="w-9 h-5 bg-slate-200 rounded-full relative cursor-pointer shadow-inner">
                  <div className="w-4 h-4 bg-white dark:bg-slate-900 rounded-full absolute left-0.5 top-0.5 shadow"></div>
                </div>
              </div>

              <div className="flex flex-col gap-1.5 mb-6">
                <label className="text-[12px] font-bold text-slate-900 dark:text-white">Notes</label>
                <textarea rows={3} placeholder="Add Notes" className="px-3 py-2.5 border border-border rounded-lg text-[13px] font-medium outline-none focus:border-[#F59E0B]/50 transition-colors resize-none"></textarea>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-border">
                <button onClick={() => setIsFeesModalOpen(false)} className="px-5 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-[13px] font-bold rounded-lg hover:bg-slate-200 transition-colors">
                  Cancel
                </button>
                <button onClick={() => setIsFeesModalOpen(false)} className="px-5 py-2 bg-[#F59E0B] text-white text-[13px] font-bold rounded-lg hover:bg-[#D97706] shadow-sm transition-colors">
                  Pay Fees
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {isLeaveModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-xl w-full max-w-lg overflow-hidden my-auto animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-5 border-b border-border">
              <h2 className="text-[16px] font-bold text-slate-900 dark:text-white">Apply Leave</h2>
              <button onClick={() => setIsLeaveModalOpen(false)} className="w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:bg-slate-200 transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-6 text-left">
              <div className="flex flex-col gap-1.5 mb-4">
                <label className="text-[12px] font-bold text-slate-900 dark:text-white">Leave Date</label>
                <div className="relative border border-border rounded-lg overflow-hidden shadow-sm">
                  <input type="text" placeholder="15 May 2024" className="w-full px-3 py-2.5 text-[13px] font-medium outline-none bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100" />
                  <Calendar className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute right-3 top-3 pointer-events-none" />
                </div>
              </div>

              <div className="flex flex-col gap-1.5 mb-4">
                <label className="text-[12px] font-bold text-slate-900 dark:text-white">Leave Type</label>
                <div className="relative border border-border rounded-lg overflow-hidden">
                  <select className="w-full px-3 py-2.5 text-[13px] font-medium text-slate-700 dark:text-slate-200 outline-none appearance-none bg-white dark:bg-slate-900 cursor-pointer"><option>Select</option></select>
                  <ChevronDown className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute right-3 top-3 pointer-events-none" />
                </div>
              </div>

              <div className="flex flex-col gap-1.5 mb-4">
                <label className="text-[12px] font-bold text-slate-900 dark:text-white">Leave From date</label>
                <div className="relative border border-border rounded-lg overflow-hidden shadow-sm">
                  <input type="text" placeholder="15 May 2024" className="w-full px-3 py-2.5 text-[13px] font-medium outline-none bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100" />
                  <Calendar className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute right-3 top-3 pointer-events-none" />
                </div>
              </div>

              <div className="flex flex-col gap-1.5 mb-4">
                <label className="text-[12px] font-bold text-slate-900 dark:text-white">Leave to Date</label>
                <div className="relative border border-border rounded-lg overflow-hidden shadow-sm">
                  <input type="text" placeholder="15 May 2024" className="w-full px-3 py-2.5 text-[13px] font-medium outline-none bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100" />
                  <Calendar className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute right-3 top-3 pointer-events-none" />
                </div>
              </div>

              <div className="flex flex-col gap-2 mb-4">
                <label className="text-[12px] font-bold text-slate-900 dark:text-white">Leave Days</label>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <div className="w-4 h-4 rounded-full border-4 border-[#F59E0B] bg-white dark:bg-slate-900 shadow-sm"></div>
                    <span className="text-[13px] font-medium text-slate-700 dark:text-slate-200">Full Day</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <div className="w-4 h-4 rounded-full border border-slate-300 bg-white dark:bg-slate-900"></div>
                    <span className="text-[13px] font-medium text-slate-700 dark:text-slate-200">First Half</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <div className="w-4 h-4 rounded-full border border-slate-300 bg-white dark:bg-slate-900"></div>
                    <span className="text-[13px] font-medium text-slate-700 dark:text-slate-200">Second Half</span>
                  </label>
                </div>
              </div>

              <div className="flex flex-col gap-1.5 mb-4">
                <label className="text-[12px] font-bold text-slate-900 dark:text-white">No of Days</label>
                <input type="text" className="px-3 py-2.5 border border-border rounded-lg text-[13px] font-medium outline-none focus:border-[#F59E0B]/50 transition-colors" />
              </div>

              <div className="flex flex-col gap-1.5 mb-6">
                <label className="text-[12px] font-bold text-slate-900 dark:text-white">Reason</label>
                <textarea rows={2} className="px-3 py-2.5 border border-border rounded-lg text-[13px] font-medium outline-none focus:border-[#F59E0B]/50 transition-colors resize-none"></textarea>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-border mt-2">
                <button onClick={() => setIsLeaveModalOpen(false)} className="px-5 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-[13px] font-bold rounded-lg hover:bg-slate-200 transition-colors">
                  Cancel
                </button>
                <button onClick={() => setIsLeaveModalOpen(false)} className="px-5 py-2 bg-[#F59E0B] text-white text-[13px] font-bold rounded-lg hover:bg-[#D97706] shadow-sm transition-colors">
                  Apply Leave
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Subcomponents & Helpers

function InfoRow({ label, value }: { label: string, value: string }) {
  return (
    <div className="flex justify-between py-1 border-b border-slate-50 last:border-0">
      <span className="text-[14px] leading-[21px] font-medium text-[#0F172A] dark:text-slate-100">{label}</span>
      <span className="text-[14px] leading-[21px] font-normal text-[#6a7287]">{value}</span>
    </div>
  );
}

function TabItem({ icon, label, active, onClick }: { icon: React.ReactNode, label: string, active: boolean, onClick: () => void }) {
  return (
    <div onClick={onClick} className={`flex flex-col items-center gap-2 px-5 py-2.5 cursor-pointer whitespace-nowrap transition-colors border-b-2 ${active ? "border-[#F59E0B] text-[#F59E0B]" : "border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/50"}`}>
      <div className="flex items-center gap-1.5">
        {icon}
        <span className="text-[12px] font-bold">{label}</span>
      </div>
    </div>
  );
}

function ParentRow({ name, role, phone, email, hideBorder = false }: { name: string, role: string, phone: string, email: string, hideBorder?: boolean }) {
  const getAvatar = (n: string) => `https://ui-avatars.com/api/?name=${encodeURIComponent(n)}&background=F1F5F9&color=5D6BEE&bold=true`;
  return (
    <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 ${hideBorder ? '' : 'border-b border-slate-100 dark:border-slate-800/50'}`}>
      <div className="flex items-center gap-3 w-48">
        <img src={getAvatar(name)} className="w-10 h-10 rounded-lg object-cover" />
        <div>
          <p className="text-[12px] font-bold text-slate-900 dark:text-white mb-0.5">{name}</p>
          <p className="text-[11px] text-[#F59E0B] font-bold">{role}</p>
        </div>
      </div>
      <div className="w-32">
        <p className="text-[11px] font-bold text-slate-900 dark:text-white mb-0.5">Phone</p>
        <p className="text-[12px] text-slate-500 dark:text-slate-400 font-medium">{phone}</p>
      </div>
      <div className="w-48">
        <p className="text-[11px] font-bold text-slate-900 dark:text-white mb-0.5">Email</p>
        <p className="text-[12px] text-slate-500 dark:text-slate-400 font-medium">{email}</p>
      </div>
      <div className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 cursor-pointer flex items-center justify-center transition-colors shadow-sm">
        <FileText className="w-3.5 h-3.5 text-white" />
      </div>
    </div>
  );
}

function DocRow({ title }: { title: string }) {
  return (
    <div className="flex items-center justify-between p-3 border border-slate-100 dark:border-slate-800/50 rounded-xl hover:border-slate-200 dark:border-slate-800 transition-colors bg-white dark:bg-slate-900">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800/50 flex items-center justify-center">
          <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500">PDF</span>
        </div>
        <span className="text-[12px] font-bold text-slate-800 dark:text-slate-100">{title}</span>
      </div>
      <div className="w-8 h-8 rounded bg-slate-800 hover:bg-slate-700 cursor-pointer flex items-center justify-center transition-colors shadow-sm">
        <Download className="w-3.5 h-3.5 text-white" />
      </div>
    </div>
  );
}

function FeeRow({ group, code, due, amount, status, refId, mode, paid, discount }: any) {
  return (
    <tr className="hover:bg-slate-50/50 dark:bg-slate-800/50 transition-colors">
      <td className="px-5 py-3 text-[#F59E0B] hover:underline cursor-pointer">{group}</td>
      <td className="px-5 py-3">{code}</td>
      <td className="px-5 py-3">{due}</td>
      <td className="px-5 py-3">{amount}</td>
      <td className="px-5 py-3">
        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-bold bg-[#E8F8E8] text-[#1D7F2C]">
          <span className="w-1 h-1 rounded-full bg-[#1DD04A]" /> {status}
        </span>
      </td>
      <td className="px-5 py-3">{refId}</td>
      <td className="px-5 py-3">{mode}</td>
      <td className="px-5 py-3">{paid}</td>
      <td className="px-5 py-3">{discount}</td>
    </tr>
  );
}

function ExamCard({ title, initiallyExpanded }: { title: string, initiallyExpanded: boolean }) {
  const [expanded, setExpanded] = useState(initiallyExpanded);
  return (
    <div className="border border-border rounded-xl overflow-hidden shadow-sm transition-all duration-200">
      <div onClick={() => setExpanded(!expanded)} className="p-4 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/50 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 rounded bg-[#10B981] text-white flex items-center justify-center shadow-sm">
            <Check className="w-3 h-3" />
          </div>
          <span className="text-[12px] font-bold text-slate-700 dark:text-slate-200">{title}</span>
        </div>
        <ChevronDown className={`w-4 h-4 text-slate-400 dark:text-slate-500 transition-transform duration-200 ${expanded ? "rotate-180" : ""}`} />
      </div>
      {expanded && (
        <div className="p-5 bg-white dark:bg-slate-900 border-t border-border animate-in slide-in-from-top-2 duration-200">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-[12px] min-w-[600px]">
              <thead className="border-b border-border text-slate-900 dark:text-white font-bold">
                <tr>
                  <th className="py-2.5 px-4">Subject</th>
                  <th className="py-2.5 px-4">Max Marks</th>
                  <th className="py-2.5 px-4">Min Marks</th>
                  <th className="py-2.5 px-4">Marks Obtained</th>
                  <th className="py-2.5 px-4 text-right">Result</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border text-slate-600 dark:text-slate-300 font-medium">
                <ExamRow subject="English (150)" max={100} min={35} obtained={65} />
                <ExamRow subject="Mathematics (214)" max={100} min={35} obtained={73} />
                <ExamRow subject="Physics (120)" max={100} min={35} obtained={55} />
                <ExamRow subject="Chemistry (110)" max={100} min={35} obtained={90} />
                <ExamRow subject="Spanish (140)" max={100} min={35} obtained={88} />
              </tbody>
            </table>
          </div>
          <div className="mt-4 bg-[#0F172A] text-white rounded-lg p-4 flex flex-wrap items-center justify-between gap-4 text-[12px] font-bold shadow-md">
            <div className="flex gap-8">
              <span>Rank : 30</span>
              <span>Total : 500</span>
              <span>Marks Obtained : 395</span>
            </div>
            <div className="flex items-center gap-4">
              <span>Percentage : 79.50</span>
              <span>Result : <span className="text-[#10B981]">Pass</span></span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ExamRow({ subject, max, min, obtained }: { subject: string, max: number, min: number, obtained: number }) {
  return (
    <tr className="hover:bg-slate-50/30 transition-colors">
      <td className="py-3 px-4">{subject}</td>
      <td className="py-3 px-4">{max}</td>
      <td className="py-3 px-4">{min}</td>
      <td className="py-3 px-4">{obtained}</td>
      <td className="py-3 px-4 text-right">
        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-[#E8F8E8] text-[#1D7F2C]">
          <span className="w-1 h-1 rounded-full bg-[#1DD04A] mr-1" /> Pass
        </span>
      </td>
    </tr>
  );
}

function LeaveCard({ title, used, available }: { title: string, used: number, available: number }) {
  return (
    <div className="bg-white dark:bg-slate-900 border border-border rounded-xl p-4 card-shadow flex flex-col gap-2">
      <h4 className="text-[13px] font-bold text-slate-800 dark:text-slate-100">{title}</h4>
      <p className="text-[12px] font-bold text-slate-500 dark:text-slate-400 flex items-center gap-3">
        <span>Used : <span className="text-slate-700 dark:text-slate-200">{used}</span></span>
        <span>Available : <span className="text-slate-700 dark:text-slate-200">{available}</span></span>
      </p>
    </div>
  );
}

function LeaveRow({ type, date, days, applied, status }: { type: string, date: string, days: number, applied: string, status: "Approved" | "Pending" }) {
  return (
    <tr className="hover:bg-slate-50/50 dark:bg-slate-800/50 transition-colors">
      <td className="px-5 py-3 font-bold text-slate-900 dark:text-white">{type}</td>
      <td className="px-5 py-3">{date}</td>
      <td className="px-5 py-3">{days}</td>
      <td className="px-5 py-3">{applied}</td>
      <td className="px-5 py-3">
        {status === "Approved" ? (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-bold bg-[#E8F8E8] text-[#1D7F2C]">
            <span className="w-1 h-1 rounded-full bg-[#1DD04A]" /> Approved
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-bold bg-[#E0F2FE] text-[#0284C7]">
            <span className="w-1 h-1 rounded-full bg-[#0EA5E9]" /> Pending
          </span>
        )}
      </td>
    </tr>
  );
}

function AttSumCard({ title, value, icon, iconBg }: { title: string, value: string, icon: React.ReactNode, iconBg: string }) {
  return (
    <div className="bg-white dark:bg-slate-900 border border-border rounded-xl p-4 flex items-center gap-3">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${iconBg}`}>
        {icon}
      </div>
      <div>
        <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-0.5">{title}</p>
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">{value}</h3>
      </div>
    </div>
  );
}

function LegendBadge({ label, color, icon }: { label: string, color: string, icon: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2">
      <div className={`w-5 h-5 rounded flex items-center justify-center shadow-sm ${color}`}>
        {icon}
      </div>
      <span className="text-[11px] font-bold text-slate-700 dark:text-slate-200">{label}</span>
    </div>
  );
}

// Mockup Data for Time Table Grid
const S_RED = { bg: "bg-rose-50", border: "border-rose-100", text: "text-rose-600" };
const S_BLUE = { bg: "bg-blue-50", border: "border-blue-100", text: "text-blue-600" };
const S_GREEN = { bg: "bg-emerald-50", border: "border-emerald-100", text: "text-emerald-600" };
const S_SLATE = { bg: "bg-slate-50 dark:bg-slate-800/50", border: "border-slate-200 dark:border-slate-800", text: "text-slate-700 dark:text-slate-200" };
const S_PURPLE = { bg: "bg-indigo-50", border: "border-indigo-100", text: "text-indigo-600" };
const S_TEAL = { bg: "bg-teal-50", border: "border-teal-100", text: "text-teal-600" };

const timeTableData = [
  [
    { time: "09:00 - 09:45 AM", subject: "Maths", teacher: "Jacquelin", ...S_RED },
    { time: "09:45 - 10:30 AM", subject: "English", teacher: "Hellana", ...S_TEAL },
    { time: "10:45 - 11:30 AM", subject: "Computer", teacher: "Daniel", ...S_GREEN },
    { time: "11:30 - 12:15 PM", subject: "Spanish", teacher: "Erickson", ...S_BLUE },
    { time: "01:30 - 02:15 PM", subject: "Science", teacher: "Morgan", ...S_PURPLE },
    { time: "02:15 - 03:00 PM", subject: "Chemistry", teacher: "Aaron", ...S_SLATE },
    { time: "03:15 - 04:00 PM", subject: "Physics", teacher: "Teresa", ...S_SLATE },
  ],
  [
    { time: "09:00 - 09:45 AM", subject: "Spanish", teacher: "Erickson", ...S_BLUE },
    { time: "09:45 - 10:30 AM", subject: "Physics", teacher: "Teresa", ...S_SLATE },
    { time: "10:45 - 11:30 AM", subject: "Chemistry", teacher: "Aaron", ...S_SLATE },
    { time: "11:30 - 12:15 PM", subject: "Maths", teacher: "Jacquelin", ...S_RED },
    { time: "01:30 - 02:15 PM", subject: "Computer", teacher: "Daniel", ...S_GREEN },
    { time: "02:15 - 03:00 PM", subject: "English", teacher: "Hellana", ...S_TEAL },
    { time: "03:15 - 04:00 PM", subject: "Science", teacher: "Morgan", ...S_PURPLE },
  ],
  [
    { time: "09:00 - 09:45 AM", subject: "Computer", teacher: "Daniel", ...S_GREEN },
    { time: "09:45 - 10:30 AM", subject: "Science", teacher: "Morgan", ...S_PURPLE },
    { time: "10:45 - 11:30 AM", subject: "Maths", teacher: "Jacquelin", ...S_RED },
    { time: "11:30 - 12:15 PM", subject: "Chemistry", teacher: "Aaron", ...S_SLATE },
    { time: "01:30 - 02:15 PM", subject: "Physics", teacher: "Teresa", ...S_SLATE },
    { time: "02:15 - 03:00 PM", subject: "English", teacher: "Hellana", ...S_TEAL },
    { time: "03:15 - 04:00 PM", subject: "Spanish", teacher: "Erickson", ...S_BLUE },
  ],
  [
    { time: "09:00 - 09:45 AM", subject: "Physics", teacher: "Teresa", ...S_SLATE },
    { time: "09:45 - 10:30 AM", subject: "Computer", teacher: "Daniel", ...S_GREEN },
    { time: "10:45 - 11:30 AM", subject: "English", teacher: "Hellana", ...S_TEAL },
    { time: "11:30 - 12:15 PM", subject: "Science", teacher: "Morgan", ...S_PURPLE },
    { time: "01:30 - 02:15 PM", subject: "Spanish", teacher: "Erickson", ...S_BLUE },
    { time: "02:15 - 03:00 PM", subject: "Chemistry", teacher: "Aaron", ...S_SLATE },
    { time: "03:15 - 04:00 PM", subject: "Maths", teacher: "Jacquelin", ...S_RED },
  ],
  [
    { time: "09:00 - 09:45 AM", subject: "English", teacher: "Hellana", ...S_TEAL },
    { time: "09:45 - 10:30 AM", subject: "Spanish", teacher: "Erickson", ...S_BLUE },
    { time: "10:45 - 11:30 AM", subject: "Physics", teacher: "Teresa", ...S_SLATE },
    { time: "11:30 - 12:15 PM", subject: "Chemistry", teacher: "Aaron", ...S_SLATE },
    { time: "01:30 - 02:15 PM", subject: "Maths", teacher: "Jacquelin", ...S_RED },
    { time: "02:15 - 03:00 PM", subject: "Computer", teacher: "Daniel", ...S_GREEN },
    { time: "03:15 - 04:00 PM", subject: "Science", teacher: "Morgan", ...S_PURPLE },
  ],
  [
    { time: "09:00 - 09:45 AM", subject: "English", teacher: "Hellana", ...S_TEAL },
    { time: "09:45 - 10:30 AM", subject: "Spanish", teacher: "Erickson", ...S_BLUE },
    { time: "10:45 - 11:30 AM", subject: "Physics", teacher: "Teresa", ...S_SLATE },
    { time: "11:30 - 12:15 PM", subject: "Chemistry", teacher: "Aaron", ...S_SLATE },
    { time: "01:30 - 02:15 PM", subject: "Maths", teacher: "Jacquelin", ...S_RED },
    { time: "02:15 - 03:00 PM", subject: "Computer", teacher: "Daniel", ...S_GREEN },
    { time: "03:15 - 04:00 PM", subject: "Science", teacher: "Morgan", ...S_PURPLE },
  ]
];

export default function StudentViewPage() {
  return (
    <Suspense fallback={<div className="p-6 text-slate-500">Loading...</div>}>
      <StudentViewContent />
    </Suspense>
  );
}
