"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAppState } from "../../../context/store";
import {
  User, Briefcase, Calendar, CreditCard, Bus, Building2, Share2, FileText, Lock, XCircle, Upload, CheckCircle
} from "lucide-react";

export default function AddTeacherPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("edit");
  const { addTeacher, updateTeacher, teachers, classes } = useAppState();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [classId, setClassId] = useState("c1");
  const [status, setStatus] = useState<"Active" | "Inactive">("Active");

  useEffect(() => {
    if (editId) {
      const teacher = teachers.find((t) => t.id === editId);
      if (teacher) {
        const [first, ...last] = teacher.name.split(" ");
        setFirstName(first || "");
        setLastName(last.join(" ") || "");
        setEmail(teacher.email);
        setSubject(teacher.subject);
        setClassId(teacher.classId);
        setStatus(teacher.status);
      }
    }
  }, [editId, teachers]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      name: `${firstName} ${lastName}`.trim() || "New Teacher",
      email: email || "teacher@example.com",
      subject: subject || "General",
      classId: classId,
      status: status
    };

    if (editId) {
      const existingTeacher = teachers.find((t) => t.id === editId);
      if (existingTeacher) {
        updateTeacher({ ...existingTeacher, ...payload });
      }
    } else {
      addTeacher(payload);
    }

    router.push("/dashboard/teachers");
  };

  return (
    <div className="space-y-6 bg-[#F8FAFC] min-h-screen -m-6 p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-left">
        <div>
          <h1 className="text-xl font-bold text-slate-900">{editId ? "Edit Teacher" : "Add Teacher"}</h1>
          <div className="flex items-center gap-2 text-[13px] text-slate-500 mt-1">
            <span>Dashboard</span>
            <span>/</span>
            <Link href="/dashboard/teachers" className="hover:text-[#5D6BEE]">Teachers</Link>
            <span>/</span>
            <span className="text-slate-900 font-medium">{editId ? "Edit Teacher" : "Add Teacher"}</span>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 1. Personal Information */}
        <div className="bg-white border border-border rounded-xl overflow-hidden card-shadow">
          <div className="bg-slate-50/80 px-6 py-4 border-b border-border flex items-center gap-2">
            <User className="w-4 h-4 text-slate-500" />
            <h2 className="text-[14px] font-bold text-slate-800">Personal Information</h2>
          </div>
          <div className="p-6">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Photo Upload Area */}
              <div className="flex-shrink-0 w-full lg:w-48 flex flex-col items-center">
                <div className="w-32 h-32 bg-[#F1F5F9] border-2 border-dashed border-slate-300 rounded-2xl flex flex-col items-center justify-center text-slate-400 mb-4">
                  <User className="w-10 h-10 mb-2 opacity-50" />
                </div>
                <div className="flex items-center gap-2">
                  <button type="button" className="px-4 py-1.5 bg-[#F1F5F9] text-slate-700 text-[12px] font-semibold rounded hover:bg-slate-200 transition-colors">
                    Upload
                  </button>
                  <button type="button" className="px-4 py-1.5 bg-[#5D6BEE] text-white text-[12px] font-semibold rounded hover:bg-[#4b58ce] transition-colors">
                    Browse
                  </button>
                </div>
                <p className="text-[10px] text-slate-400 mt-3 text-center">Allowed format JPEG, JPG, PNG, GIF</p>
                <p className="text-[10px] text-slate-400 text-center">Max file size 2 MB</p>
              </div>

              {/* Form Grid */}
              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-x-6 gap-y-5 text-left">
                <InputGroup label="Teacher ID" />
                <InputGroup label="First Name" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
                <InputGroup label="Last Name" value={lastName} onChange={(e) => setLastName(e.target.value)} />
                <InputGroup label="Class" type="select" value={classId} onChange={(e) => setClassId(e.target.value)} options={classes.map(c => c.name)} />
                <InputGroup label="Subject" type="select" value={subject} onChange={(e) => setSubject(e.target.value)} options={["Select", "Physics", "Chemistry", "Maths", "English", "Spanish", "Biology", "Computer"]} />

                <InputGroup label="Gender" type="select" options={["Select", "Male", "Female"]} />
                <InputGroup label="Primary Contact Number" />
                <InputGroup label="Email Address" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                <InputGroup label="Blood Group" type="select" options={["Select", "A+", "O+", "B+", "AB+"]} />
                <InputGroup label="Date of Joining" type="date" />

                <InputGroup label="Father's Name" />
                <InputGroup label="Mother's Name" />
                <InputGroup label="Date of Birth" type="date" />
                <InputGroup label="Marital Status" type="select" options={["Select", "Single", "Married"]} />
                <div className="col-span-1">
                  <label className="block text-[12px] font-semibold text-slate-700 mb-1.5">Language Known</label>
                  <div className="flex gap-2">
                    <span className="px-3 py-1.5 bg-[#F1F5F9] rounded-md text-[12px] font-medium text-slate-700 flex items-center gap-1.5">
                      English <XCircle className="w-3.5 h-3.5 text-slate-400 cursor-pointer" />
                    </span>
                    <span className="px-3 py-1.5 bg-[#F1F5F9] rounded-md text-[12px] font-medium text-slate-700 flex items-center gap-1.5">
                      Spanish <XCircle className="w-3.5 h-3.5 text-slate-400 cursor-pointer" />
                    </span>
                  </div>
                </div>

                <InputGroup label="Qualification" />
                <InputGroup label="Work Experience" />
                <InputGroup label="Previous School If Any" />
                <InputGroup label="Previous School Address" />
                <InputGroup label="Previous School Phone No" />

                <InputGroup label="Address" />
                <InputGroup label="Permanent Address" />
                <InputGroup label="PAN Number / ID Number" />
                <InputGroup label="Status" type="select" value={status} onChange={(e) => setStatus(e.target.value as "Active" | "Inactive")} options={["Active", "Inactive"]} />
                
                <div className="col-span-1 md:col-span-2 xl:col-span-4">
                  <label className="block text-[12px] font-semibold text-slate-700 mb-1.5">Notes</label>
                  <textarea placeholder="Other information" className="w-full h-24 px-3.5 py-2 text-[13px] text-slate-900 bg-white border border-border rounded-lg outline-none focus:border-[#5D6BEE]/50 transition-all"></textarea>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 2. Payroll */}
        <div className="bg-white border border-border rounded-xl overflow-hidden card-shadow">
          <div className="bg-slate-50/80 px-6 py-4 border-b border-border flex items-center gap-2 text-left">
            <Briefcase className="w-4 h-4 text-slate-500" />
            <h2 className="text-[14px] font-bold text-slate-800">Payroll</h2>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 text-left">
            <InputGroup label="EPF No" />
            <InputGroup label="Basic Salary" />
            <InputGroup label="Contract Type" type="select" options={["Select", "Permanent", "Contract"]} />
            <InputGroup label="Work Shift" type="select" options={["Select", "Morning", "Evening"]} />
            <InputGroup label="Work Location" />
            <InputGroup label="Date of Leaving" type="date" />
          </div>
        </div>

        {/* 3. Leaves */}
        <div className="bg-white border border-border rounded-xl overflow-hidden card-shadow">
          <div className="bg-slate-50/80 px-6 py-4 border-b border-border flex items-center gap-2 text-left">
            <Calendar className="w-4 h-4 text-slate-500" />
            <h2 className="text-[14px] font-bold text-slate-800">Leaves</h2>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 text-left">
            <InputGroup label="Medical Leaves" />
            <InputGroup label="Casual Leaves" />
            <InputGroup label="Maternity Leaves" />
            <InputGroup label="Sick Leaves" />
          </div>
        </div>

        {/* 4. Bank Account Detail */}
        <div className="bg-white border border-border rounded-xl overflow-hidden card-shadow">
          <div className="bg-slate-50/80 px-6 py-4 border-b border-border flex items-center gap-2 text-left">
            <CreditCard className="w-4 h-4 text-slate-500" />
            <h2 className="text-[14px] font-bold text-slate-800">Bank Account Detail</h2>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            <InputGroup label="Account Name" />
            <InputGroup label="Account Number" />
            <InputGroup label="Bank Name" />
            <InputGroup label="IFSC Code" />
            <InputGroup label="Branch Name" />
          </div>
        </div>

        {/* 5. Transport Information */}
        <div className="bg-white border border-border rounded-xl overflow-hidden card-shadow">
          <div className="bg-slate-50/80 px-6 py-4 border-b border-border flex items-center gap-2 text-left">
            <Bus className="w-4 h-4 text-slate-500" />
            <h2 className="text-[14px] font-bold text-slate-800">Transport Information</h2>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            <InputGroup label="Route" type="select" options={["Select", "Route 1", "Route 2"]} />
            <InputGroup label="Vehicle Number" type="select" options={["Select", "Bus 42", "Bus 50"]} />
            <InputGroup label="Pickup Point" type="select" options={["Select", "Point A", "Point B"]} />
          </div>
        </div>

        {/* 6. Hostel Information */}
        <div className="bg-white border border-border rounded-xl overflow-hidden card-shadow">
          <div className="bg-slate-50/80 px-6 py-4 border-b border-border flex items-center gap-2 text-left">
            <Building2 className="w-4 h-4 text-slate-500" />
            <h2 className="text-[14px] font-bold text-slate-800">Hostel Information</h2>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
            <InputGroup label="Hostel" type="select" options={["Select", "HI-Hostel", "Boys Hostel"]} />
            <InputGroup label="Room No" type="select" options={["Select", "Room 25", "Room 30"]} />
          </div>
        </div>

        {/* 7. Social Media Links */}
        <div className="bg-white border border-border rounded-xl overflow-hidden card-shadow">
          <div className="bg-slate-50/80 px-6 py-4 border-b border-border flex items-center gap-2 text-left">
            <Share2 className="w-4 h-4 text-slate-500" />
            <h2 className="text-[14px] font-bold text-slate-800">Social Media Links</h2>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-3 xl:grid-cols-5 gap-6 text-left">
            <InputGroup label="Facebook" />
            <InputGroup label="Instagram" />
            <InputGroup label="Linked In" />
            <InputGroup label="Youtube" />
            <InputGroup label="Twitter URL" />
          </div>
        </div>

        {/* 8. Documents */}
        <div className="bg-white border border-border rounded-xl overflow-hidden card-shadow">
          <div className="bg-slate-50/80 px-6 py-4 border-b border-border flex items-center gap-2 text-left">
            <FileText className="w-4 h-4 text-slate-500" />
            <h2 className="text-[14px] font-bold text-slate-800">Documents</h2>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
            <div>
              <label className="block text-[12px] font-semibold text-slate-700 mb-1.5">Upload Resume</label>
              <p className="text-[10px] text-slate-400 mb-3">Upload image size of 4MB, Accepted Format PDF</p>
              <div className="flex items-center gap-3">
                <button type="button" className="px-4 py-2 bg-[#5D6BEE] hover:bg-[#4b58ce] text-white text-[11px] font-semibold rounded-lg flex items-center gap-2 transition-colors">
                  <Upload className="w-3.5 h-3.5" /> Upload Document
                </button>
                <span className="text-[12px] text-slate-600 font-medium">Resume.pdf</span>
              </div>
            </div>
            <div>
              <label className="block text-[12px] font-semibold text-slate-700 mb-1.5">Upload Joining Letter</label>
              <p className="text-[10px] text-slate-400 mb-3">Upload image size of 4MB, Accepted Format PDF</p>
              <div className="flex items-center gap-3">
                <button type="button" className="px-4 py-2 bg-[#5D6BEE] hover:bg-[#4b58ce] text-white text-[11px] font-semibold rounded-lg flex items-center gap-2 transition-colors">
                  <Upload className="w-3.5 h-3.5" /> Upload Document
                </button>
                <span className="text-[12px] text-slate-600 font-medium">Resume.pdf</span>
              </div>
            </div>
          </div>
        </div>

        {/* 9. Password */}
        <div className="bg-white border border-border rounded-xl overflow-hidden card-shadow">
          <div className="bg-slate-50/80 px-6 py-4 border-b border-border flex items-center gap-2 text-left">
            <Lock className="w-4 h-4 text-slate-500" />
            <h2 className="text-[14px] font-bold text-slate-800">Password</h2>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
            <InputGroup label="New Password" type="password" />
            <InputGroup label="Confirm Password" type="password" />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-4 pt-2">
          <button type="button" onClick={() => router.push("/dashboard/teachers")} className="px-6 py-2.5 border border-border text-[13px] font-bold rounded-lg bg-white hover:bg-slate-50 text-slate-700 transition-colors shadow-sm cursor-pointer">
            Cancel
          </button>
          <button type="submit" className="px-6 py-2.5 bg-[#5D6BEE] hover:bg-[#4b58ce] text-[13px] font-semibold rounded-lg text-white shadow-sm transition-colors cursor-pointer">
            {editId ? "Update Teacher" : "Add Teacher"}
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
  type?: "text" | "email" | "date" | "select" | "password",
  placeholder?: string,
  options?: string[],
  value?: string,
  onChange?: (e: any) => void,
  required?: boolean
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[12px] font-semibold text-slate-700">
        {label} {required && <span className="text-rose-500">*</span>}
      </label>
      {type === "select" ? (
        <select
          className="w-full px-3.5 py-2.5 text-[13px] text-slate-900 bg-white border border-border rounded-lg outline-none focus:border-[#5D6BEE]/50 transition-all appearance-none cursor-pointer"
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
          className="w-full px-3.5 py-2.5 text-[13px] text-slate-900 bg-white border border-border rounded-lg outline-none focus:border-[#5D6BEE]/50 transition-all"
        />
      )}
    </div>
  );
}
