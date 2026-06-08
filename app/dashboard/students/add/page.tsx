"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAppState } from "../../../context/store";
import {
  Upload, User, FileText, LayoutGrid, Calendar, Hash, Droplet, Home, Users, CheckCircle, Smartphone, Mail, Settings, Briefcase, MapPin,
  Car, Map, Hotel, Activity, CreditCard,
  XCircle
} from "lucide-react";

function AddStudentContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("edit");
  const { addStudent, updateStudent, classes, students } = useAppState();

  // Core tracking states
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [classId, setClassId] = useState("c1");
  const [rollNo, setRollNo] = useState("");
  const [email, setEmail] = useState("");
  const [fatherName, setFatherName] = useState("");
  const [fatherContact, setFatherContact] = useState("");

  // Toggle states for Transport/Hostel
  const [hasTransport, setHasTransport] = useState(true);
  const [hasHostel, setHasHostel] = useState(true);

  useEffect(() => {
    if (editId) {
      const student = students.find((s) => s.id === editId);
      if (student) {
        const [first, ...last] = student.name.split(" ");
        setFirstName(first || "");
        setLastName(last.join(" ") || "");
        setClassId(student.classId);
        setRollNo(student.rollNo);
        setEmail(student.email);
        setFatherName(student.parentName);
        setFatherContact(student.parentContact);
      }
    }
  }, [editId, students]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      name: `${firstName} ${lastName}`.trim() || "New Student",
      email: email || "student@example.com",
      classId: classId,
      rollNo: rollNo || Math.floor(Math.random() * 1000).toString(),
      parentName: fatherName || "Parent",
      parentContact: fatherContact || "N/A",
      status: "Active" as const
    };

    if (editId) {
      const existingStudent = students.find((s) => s.id === editId);
      if (existingStudent) {
        updateStudent({ ...existingStudent, ...payload });
      }
    } else {
      addStudent(payload);
    }

    router.push("/dashboard/students");
  };

  return (
    <div className="space-y-6 bg-[#F8FAFC] dark:bg-[#0F172A] min-h-screen -m-6 p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-left">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">{editId ? "Edit Student" : "Add Student"}</h1>
          <div className="flex items-center gap-2 text-[13px] text-slate-500 dark:text-slate-400 mt-1">
            <span>Dashboard</span>
            <span>/</span>
            <Link href="/dashboard/students" className="hover:text-[#F59E0B]">Students</Link>
            <span>/</span>
            <span className="text-slate-900 dark:text-white font-medium">{editId ? "Edit Student" : "Add Student"}</span>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* 1. Personal Information */}
        <div className="bg-white dark:bg-slate-900 border border-border rounded-xl overflow-hidden card-shadow">
          <div className="bg-slate-50/80 dark:bg-slate-800/50 px-6 py-4 border-b border-border flex items-center gap-2">
            <User className="w-4 h-4 text-slate-500 dark:text-slate-400" />
            <h2 className="text-[14px] font-bold text-slate-800 dark:text-slate-100">Personal Information</h2>
          </div>
          <div className="p-6">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Photo Upload Area */}
              <div className="flex-shrink-0 w-full lg:w-48 flex flex-col items-center">
                <div className="w-32 h-32 bg-[#F1F5F9] dark:bg-slate-800 border-2 border-dashed border-slate-300 rounded-2xl flex flex-col items-center justify-center text-slate-400 dark:text-slate-500 mb-4">
                  <User className="w-10 h-10 mb-2 opacity-50" />
                </div>
                <div className="flex items-center gap-2">
                  <button type="button" className="px-4 py-1.5 bg-[#F1F5F9] dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-[12px] font-semibold rounded hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                    Upload
                  </button>
                  <button type="button" className="px-4 py-1.5 bg-[#F59E0B] text-white text-[12px] font-semibold rounded hover:bg-[#D97706] transition-colors">
                    Browse
                  </button>
                </div>
                <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-3 text-center">Allowed format JPEG, JPG, PNG, GIF</p>
                <p className="text-[10px] text-slate-400 dark:text-slate-500 text-center">Max file size 2 MB</p>
              </div>

              {/* Form Grid */}
              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-x-6 gap-y-5 text-left">
                <InputGroup label="Academic Year" type="select" options={["June 2023 - 2024", "June 2024 - 2025"]} />
                <InputGroup label="Admission Number" placeholder="e.g. ADM001" />
                <InputGroup label="Admission Date" type="date" />
                <InputGroup label="Roll Number" value={rollNo} onChange={(e) => setRollNo(e.target.value)} />

                <InputGroup label="First Name" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
                <InputGroup label="Last Name" value={lastName} onChange={(e) => setLastName(e.target.value)} />
                <InputGroup label="Class" type="select" value={classId} onChange={(e) => setClassId(e.target.value)} options={classes.map(c => c.name)} />
                <InputGroup label="Section" type="select" options={["Select", "A", "B", "C"]} />

                <InputGroup label="Gender" type="select" options={["Select", "Male", "Female"]} />
                <InputGroup label="Date of Birth" type="date" />
                <InputGroup label="Blood Group" type="select" options={["Select", "A+", "O+", "B+", "AB+"]} />
                <InputGroup label="House" type="select" options={["Select", "Red", "Blue", "Green"]} />

                <InputGroup label="Religion" type="select" options={["Select", "Christian", "Muslim", "Hindu", "Other"]} />
                <InputGroup label="Category" type="select" options={["Select", "General", "OBC", "SC/ST"]} />
                <InputGroup label="Primary Contact Number" />
                <InputGroup label="Email Address" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />

                <InputGroup label="Caste" />
                <InputGroup label="Mother Tongue" type="select" options={["Select", "English", "Spanish", "French"]} />
                <div className="col-span-1 xl:col-span-2">
                  <label className="block text-[12px] font-semibold text-slate-700 dark:text-slate-200 mb-1.5">Language Known</label>
                  <div className="flex gap-2">
                    <span className="px-3 py-1.5 bg-[#F1F5F9] dark:bg-slate-800 rounded-md text-[12px] font-medium text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
                      English <XCircle className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 cursor-pointer" />
                    </span>
                    <span className="px-3 py-1.5 bg-[#F1F5F9] dark:bg-slate-800 rounded-md text-[12px] font-medium text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
                      Spanish <XCircle className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 cursor-pointer" />
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 2. Parents & Guardian Information */}
        <div className="bg-white dark:bg-slate-900 border border-border rounded-xl overflow-hidden card-shadow">
          <div className="bg-slate-50/80 dark:bg-slate-800/50 px-6 py-4 border-b border-border flex items-center gap-2">
            <Users className="w-4 h-4 text-slate-500 dark:text-slate-400" />
            <h2 className="text-[14px] font-bold text-slate-800 dark:text-slate-100">Parents & Guardian Information</h2>
          </div>
          <div className="p-6 space-y-8">
            {/* Father */}
            <div>
              <h3 className="text-[13px] font-bold text-slate-800 dark:text-slate-100 mb-4 border-b border-border pb-2 text-left">Father Info</h3>
              <div className="flex flex-col lg:flex-row gap-8">
                <div className="flex-shrink-0 w-32 flex flex-col items-center">
                  <div className="w-20 h-20 bg-[#F1F5F9] dark:bg-slate-800 border-2 border-dashed border-slate-300 rounded-xl flex items-center justify-center text-slate-400 dark:text-slate-500 mb-3">
                    <User className="w-6 h-6 opacity-50" />
                  </div>
                  <div className="flex items-center gap-1">
                    <button type="button" className="px-3 py-1 bg-[#F1F5F9] dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-[11px] font-semibold rounded">Upload</button>
                    <button type="button" className="px-3 py-1 bg-[#F59E0B] text-white text-[11px] font-semibold rounded">Browse</button>
                  </div>
                </div>
                <div className="flex-1 grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-6 text-left">
                  <InputGroup label="Father Name" value={fatherName} onChange={(e) => setFatherName(e.target.value)} required />
                  <InputGroup label="Email" type="email" />
                  <InputGroup label="Phone Number" value={fatherContact} onChange={(e) => setFatherContact(e.target.value)} />
                  <InputGroup label="Father Occupation" />
                </div>
              </div>
            </div>

            {/* Mother */}
            <div>
              <h3 className="text-[13px] font-bold text-slate-800 dark:text-slate-100 mb-4 border-b border-border pb-2 text-left">Mother Info</h3>
              <div className="flex flex-col lg:flex-row gap-8">
                <div className="flex-shrink-0 w-32 flex flex-col items-center">
                  <div className="w-20 h-20 bg-[#F1F5F9] dark:bg-slate-800 border-2 border-dashed border-slate-300 rounded-xl flex items-center justify-center text-slate-400 dark:text-slate-500 mb-3">
                    <User className="w-6 h-6 opacity-50" />
                  </div>
                  <div className="flex items-center gap-1">
                    <button type="button" className="px-3 py-1 bg-[#F1F5F9] dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-[11px] font-semibold rounded">Upload</button>
                    <button type="button" className="px-3 py-1 bg-[#F59E0B] text-white text-[11px] font-semibold rounded">Browse</button>
                  </div>
                </div>
                <div className="flex-1 grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-6 text-left">
                  <InputGroup label="Mother Name" />
                  <InputGroup label="Email" type="email" />
                  <InputGroup label="Phone Number" />
                  <InputGroup label="Mother Occupation" />
                </div>
              </div>
            </div>

            {/* Guardian */}
            <div>
              <h3 className="text-[13px] font-bold text-slate-800 dark:text-slate-100 mb-4 border-b border-border pb-2 text-left">Guardian Details</h3>
              <div className="flex items-center gap-6 mb-5 text-left text-[13px] text-slate-700 dark:text-slate-200">
                <label className="font-semibold">Is Guardian?</label>
                <label className="flex items-center gap-2"><input type="radio" name="guardian" className="accent-[#F59E0B]" defaultChecked /> Father</label>
                <label className="flex items-center gap-2"><input type="radio" name="guardian" className="accent-[#F59E0B]" /> Mother</label>
                <label className="flex items-center gap-2"><input type="radio" name="guardian" className="accent-[#F59E0B]" /> Other</label>
              </div>
              <div className="flex flex-col lg:flex-row gap-8">
                <div className="flex-shrink-0 w-32 flex flex-col items-center">
                  <div className="w-20 h-20 bg-[#F1F5F9] dark:bg-slate-800 border-2 border-dashed border-slate-300 rounded-xl flex items-center justify-center text-slate-400 dark:text-slate-500 mb-3">
                    <User className="w-6 h-6 opacity-50" />
                  </div>
                  <div className="flex items-center gap-1">
                    <button type="button" className="px-3 py-1 bg-[#F1F5F9] dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-[11px] font-semibold rounded">Upload</button>
                    <button type="button" className="px-3 py-1 bg-[#F59E0B] text-white text-[11px] font-semibold rounded">Browse</button>
                  </div>
                </div>
                <div className="flex-1 grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-6 text-left">
                  <InputGroup label="Guardian Name" />
                  <InputGroup label="Guardian Relation" />
                  <InputGroup label="Phone Number" />
                  <InputGroup label="Email" type="email" />
                  <InputGroup label="Occupation" />
                  <div className="col-span-1 md:col-span-2 xl:col-span-3">
                    <label className="block text-[12px] font-semibold text-slate-700 dark:text-slate-200 mb-1.5">Address</label>
                    <textarea className="w-full h-10 px-3.5 py-2 text-[13px] text-slate-900 dark:text-white bg-white dark:bg-slate-900 border border-border rounded-lg outline-none focus:border-[#F59E0B]/50 transition-all"></textarea>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Siblings */}
        <div className="bg-white dark:bg-slate-900 border border-border rounded-xl overflow-hidden card-shadow">
          <div className="bg-slate-50/80 dark:bg-slate-800/50 px-6 py-4 border-b border-border flex items-center gap-2 text-left">
            <Users className="w-4 h-4 text-slate-500 dark:text-slate-400" />
            <h2 className="text-[14px] font-bold text-slate-800 dark:text-slate-100">Siblings</h2>
          </div>
          <div className="p-6 text-left">
            <div className="flex items-center gap-4 mb-4 text-[13px] text-slate-700 dark:text-slate-200">
              <label className="font-semibold">Is Sibling studying in same school?</label>
              <label className="flex items-center gap-2"><input type="radio" name="sibling" className="accent-[#F59E0B]" defaultChecked /> Yes</label>
              <label className="flex items-center gap-2"><input type="radio" name="sibling" className="accent-[#F59E0B]" /> No</label>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-4">
              <InputGroup label="Name" type="select" options={["Select"]} />
              <InputGroup label="Roll No" type="select" options={["Select"]} />
              <InputGroup label="Admission No" type="select" options={["Select"]} />
              <InputGroup label="Class" type="select" options={["Select"]} />
            </div>
            <button type="button" className="px-4 py-2 bg-[#F59E0B] text-white text-[13px] font-semibold rounded-lg hover:bg-[#D97706] transition-colors">
              + Add More
            </button>
          </div>
        </div>

        {/* 4. Address */}
        <div className="bg-white dark:bg-slate-900 border border-border rounded-xl overflow-hidden card-shadow">
          <div className="bg-slate-50/80 dark:bg-slate-800/50 px-6 py-4 border-b border-border flex items-center gap-2 text-left">
            <MapPin className="w-4 h-4 text-slate-500 dark:text-slate-400" />
            <h2 className="text-[14px] font-bold text-slate-800 dark:text-slate-100">Address</h2>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
            <div>
              <label className="block text-[12px] font-semibold text-slate-700 dark:text-slate-200 mb-1.5">Current Address</label>
              <textarea className="w-full h-20 px-3.5 py-2 text-[13px] text-slate-900 dark:text-white bg-white dark:bg-slate-900 border border-border rounded-lg outline-none focus:border-[#F59E0B]/50 transition-all"></textarea>
            </div>
            <div>
              <label className="block text-[12px] font-semibold text-slate-700 dark:text-slate-200 mb-1.5">Permanent Address</label>
              <textarea className="w-full h-20 px-3.5 py-2 text-[13px] text-slate-900 dark:text-white bg-white dark:bg-slate-900 border border-border rounded-lg outline-none focus:border-[#F59E0B]/50 transition-all"></textarea>
            </div>
          </div>
        </div>



        {/* 7. Documents */}
        <div className="bg-white dark:bg-slate-900 border border-border rounded-xl overflow-hidden card-shadow">
          <div className="bg-slate-50/80 dark:bg-slate-800/50 px-6 py-4 border-b border-border flex items-center gap-2 text-left">
            <FileText className="w-4 h-4 text-slate-500 dark:text-slate-400" />
            <h2 className="text-[14px] font-bold text-slate-800 dark:text-slate-100">Documents</h2>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
            <div>
              <label className="block text-[12px] font-semibold text-slate-700 dark:text-slate-200 mb-1.5">Medical Certificate</label>
              <p className="text-[11px] text-slate-400 dark:text-slate-500 mb-2">Upload document JPEG, PNG, or PDF format</p>
              <div className="flex items-center gap-3">
                <button type="button" className="px-4 py-2 bg-[#F59E0B] text-white text-[12px] font-semibold rounded hover:bg-[#D97706] transition-colors">
                  Choose File
                </button>
                <span className="text-[12px] text-slate-500 dark:text-slate-400">No file chosen</span>
              </div>
            </div>
            <div>
              <label className="block text-[12px] font-semibold text-slate-700 dark:text-slate-200 mb-1.5">Migration Certificate</label>
              <p className="text-[11px] text-slate-400 dark:text-slate-500 mb-2">Upload document JPEG, PNG, or PDF format</p>
              <div className="flex items-center gap-3">
                <button type="button" className="px-4 py-2 bg-[#F59E0B] text-white text-[12px] font-semibold rounded hover:bg-[#D97706] transition-colors">
                  Choose File
                </button>
                <span className="text-[12px] text-slate-500 dark:text-slate-400">No file chosen</span>
              </div>
            </div>
          </div>
        </div>

        {/* 8. Medical History */}
        <div className="bg-white dark:bg-slate-900 border border-border rounded-xl overflow-hidden card-shadow">
          <div className="bg-slate-50/80 dark:bg-slate-800/50 px-6 py-4 border-b border-border flex items-center gap-2 text-left">
            <Activity className="w-4 h-4 text-slate-500 dark:text-slate-400" />
            <h2 className="text-[14px] font-bold text-slate-800 dark:text-slate-100">Medical History</h2>
          </div>
          <div className="p-6 space-y-5 text-left">
            <div className="flex items-center gap-4 text-[13px] text-slate-700 dark:text-slate-200">
              <label className="font-semibold">Medical Conditions</label>
              <label className="flex items-center gap-2"><input type="radio" name="medical" className="accent-[#F59E0B]" defaultChecked /> Yes</label>
              <label className="flex items-center gap-2"><input type="radio" name="medical" className="accent-[#F59E0B]" /> No</label>
            </div>
            <div>
              <label className="block text-[12px] font-semibold text-slate-700 dark:text-slate-200 mb-2">Allergies</label>
              <div className="flex gap-2">
                <span className="px-3 py-1.5 bg-[#F1F5F9] dark:bg-slate-800 border border-border rounded-md text-[12px] font-medium text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
                  Allergy A <XCircle className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 cursor-pointer" />
                </span>
                <span className="px-3 py-1.5 bg-[#F1F5F9] dark:bg-slate-800 border border-border rounded-md text-[12px] font-medium text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
                  Skin Allergies <XCircle className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 cursor-pointer" />
                </span>
              </div>
            </div>
            <div>
              <label className="block text-[12px] font-semibold text-slate-700 dark:text-slate-200 mb-2">Medications</label>
              <div className="flex gap-2">
                <span className="px-3 py-1.5 bg-[#F1F5F9] dark:bg-slate-800 border border-border rounded-md text-[12px] font-medium text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
                  Medicine Name 01 <XCircle className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 cursor-pointer" />
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 9. Previous School */}
        <div className="bg-white dark:bg-slate-900 border border-border rounded-xl overflow-hidden card-shadow">
          <div className="bg-slate-50/80 dark:bg-slate-800/50 px-6 py-4 border-b border-border flex items-center gap-2 text-left">
            <Home className="w-4 h-4 text-slate-500 dark:text-slate-400" />
            <h2 className="text-[14px] font-bold text-slate-800 dark:text-slate-100">Previous School Details</h2>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
            <InputGroup label="School Name" />
            <InputGroup label="Address" />
          </div>
        </div>

        {/* 10. Other Details */}
        <div className="bg-white dark:bg-slate-900 border border-border rounded-xl overflow-hidden card-shadow">
          <div className="bg-slate-50/80 dark:bg-slate-800/50 px-6 py-4 border-b border-border flex items-center gap-2 text-left">
            <CreditCard className="w-4 h-4 text-slate-500 dark:text-slate-400" />
            <h2 className="text-[14px] font-bold text-slate-800 dark:text-slate-100">Other Details</h2>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            <InputGroup label="Bank Name" />
            <InputGroup label="Branch" />
            <InputGroup label="IFSC Number" />
            <div className="col-span-1 md:col-span-3">
              <label className="block text-[12px] font-semibold text-slate-700 dark:text-slate-200 mb-1.5">Other Information</label>
              <textarea className="w-full h-20 px-3.5 py-2 text-[13px] text-slate-900 dark:text-white bg-white dark:bg-slate-900 border border-border rounded-lg outline-none focus:border-[#F59E0B]/50 transition-all"></textarea>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-4 pt-2">
          <button type="button" onClick={() => router.push("/dashboard/students")} className="px-6 py-2.5 border border-border text-[13px] font-bold rounded-lg bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800/50 text-slate-700 dark:text-slate-200 transition-colors shadow-sm cursor-pointer">
            Cancel
          </button>
          <button type="submit" className="px-6 py-2.5 bg-[#F59E0B] hover:bg-[#D97706] text-[13px] font-semibold rounded-lg text-white shadow-sm transition-colors cursor-pointer">
            {editId ? "Update Student" : "Add Student"}
          </button>
        </div>

      </form>
    </div>
  );
}

// Reusable input component for cleaner code
function InputGroup({
  label,
  type = "text",
  placeholder,
  options,
  value,
  onChange,
  required
}: {
  label: string,
  type?: "text" | "email" | "date" | "select",
  placeholder?: string,
  options?: string[],
  value?: string,
  onChange?: (e: any) => void,
  required?: boolean
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[12px] font-semibold text-slate-700 dark:text-slate-200">
        {label} {required && <span className="text-rose-500">*</span>}
      </label>
      {type === "select" ? (
        <select
          className="w-full px-3.5 py-2.5 text-[13px] text-slate-900 dark:text-white bg-white dark:bg-slate-900 border border-border rounded-lg outline-none focus:border-[#F59E0B]/50 transition-all appearance-none cursor-pointer"
          value={value}
          onChange={onChange}
        >
          {options?.map(opt => <option key={opt} value={opt}>{opt}</option>)}
        </select>
      ) : (
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required={required}
          className="w-full px-3.5 py-2.5 text-[13px] text-slate-900 dark:text-white bg-white dark:bg-slate-900 border border-border rounded-lg outline-none focus:border-[#F59E0B]/50 transition-all"
        />
      )}
    </div>
  );
}

export default function AddStudentPage() {
  return (
    <Suspense fallback={<div className="p-6 text-slate-500">Loading...</div>}>
      <AddStudentContent />
    </Suspense>
  );
}
