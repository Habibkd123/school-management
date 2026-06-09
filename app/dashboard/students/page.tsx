"use client";

import React, { useState, useCallback, useEffect } from "react";
import { Modal } from "../../components/ui/modal";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CollectFeesModal } from "../../components/modals/CollectFeesModal";
import { LoginDetailsModal } from "../../components/modals/LoginDetailsModal";
import { ConfirmModal } from "../../components/modals/ConfirmModal";
import { useStudents, ApiStudent } from "../../hooks/useStudents";
import { useAuth } from "../../context/auth";
import {
  Plus,
  Filter,
  MoreVertical,
  Edit,
  Trash2,
  Phone,
  Mail,
  User,
  GraduationCap,
  Calendar,
  XCircle,
  FileText,
  RefreshCcw,
  Printer,
  Download,
  LayoutGrid,
  List,
  MessageSquare,
  ChevronDown,
  AlignLeft,
  ArrowUpDown,
  Loader2,
  AlertCircle
} from "lucide-react";
import { DataTable, ColumnDef } from "@/app/components/ui/data-table";

export default function StudentsPage() {
  const { user } = useAuth();
  const activeRole = user?.role === "school_admin" ? "admin" : user?.role || "admin";

  const router = useRouter();

  // ─── Real API Data ────────────────────────────────────────────
  const {
    students,
    pagination,
    isLoading,
    error,
    filters,
    updateFilters,
    refetch,
    addStudent,
    updateStudent,
    deleteStudent,
  } = useStudents();

  const [search, setSearch] = useState("");
  const [selectedStudent, setSelectedStudent] = useState<ApiStudent | null>(null);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isCollectFeesOpen, setIsCollectFeesOpen] = useState(false);
  const [isLoginDetailsOpen, setIsLoginDetailsOpen] = useState(false);
  const [isDisableOpen, setIsDisableOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formError, setFormError] = useState("");
  const [viewMode, setViewMode] = useState<"list" | "grid">("grid");

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [isDateRangeOpen, setIsDateRangeOpen] = useState(false);
  const [selectedDateRange, setSelectedDateRange] = useState("Last 7 Days");
  const [selectedSort, setSelectedSort] = useState("Ascending");
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  // ─── Search debounce ──────────────────────────────────────────
  useEffect(() => {
    const timer = setTimeout(() => {
      updateFilters({ search, page: 1 });
    }, 400);
    return () => clearTimeout(timer);
  }, [search]);

  // Form states
  const [formName, setFormName] = useState("");
  const [formClassId, setFormClassId] = useState("");
  const [formRollNo, setFormRollNo] = useState("");
  const [formGender, setFormGender] = useState("");
  const [formPhone, setFormPhone] = useState("");
  const [formGuardianName, setFormGuardianName] = useState("");
  const [formGuardianPhone, setFormGuardianPhone] = useState("");
  const [formDob, setFormDob] = useState("");
  const [formAddress, setFormAddress] = useState("");
  const [formAcademicYear, setFormAcademicYear] = useState(
    `${new Date().getFullYear()}-${new Date().getFullYear() + 1}`
  );

  const resetForm = () => {
    setFormName(""); setFormClassId(""); setFormRollNo(""); setFormGender("");
    setFormPhone(""); setFormGuardianName(""); setFormGuardianPhone("");
    setFormDob(""); setFormAddress(""); setFormError("");
  };

  const openEdit = (student: ApiStudent) => {
    setSelectedStudent(student);
    const cls = student.class_id as { _id: string; name: string };
    setFormName(student.name);
    setFormClassId(typeof student.class_id === "string" ? student.class_id : cls._id);
    setFormRollNo(student.roll_no || "");
    setFormGender(student.gender || "");
    setFormPhone(student.phone || "");
    setFormGuardianName(student.guardian_name || "");
    setFormGuardianPhone(student.guardian_phone || "");
    setFormDob(student.dob ? student.dob.split("T")[0] : "");
    setFormAddress(student.address || "");
    setFormError("");
    setIsEditOpen(true);
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) { setFormError("Name is required"); return; }
    if (!formClassId) { setFormError("Please select a class"); return; }
    setIsSaving(true); setFormError("");
    const result = await addStudent({
      name: formName,
      class_id: formClassId as unknown as ApiStudent["class_id"],
      roll_no: formRollNo || undefined,
      gender: formGender as ApiStudent["gender"] || undefined,
      phone: formPhone || undefined,
      guardian_name: formGuardianName || undefined,
      guardian_phone: formGuardianPhone || undefined,
      dob: formDob || undefined,
      address: formAddress || undefined,
      academic_year: formAcademicYear,
    });
    setIsSaving(false);
    if (result.success) { resetForm(); setIsAddOpen(false); }
    else setFormError(result.message);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudent) return;
    if (!formName.trim()) { setFormError("Name is required"); return; }
    setIsSaving(true); setFormError("");
    const result = await updateStudent(selectedStudent._id, {
      name: formName,
      class_id: formClassId as unknown as ApiStudent["class_id"],
      roll_no: formRollNo || undefined,
      gender: formGender as ApiStudent["gender"] || undefined,
      phone: formPhone || undefined,
      guardian_name: formGuardianName || undefined,
      guardian_phone: formGuardianPhone || undefined,
      dob: formDob || undefined,
      address: formAddress || undefined,
    });
    setIsSaving(false);
    if (result.success) { setIsEditOpen(false); }
    else setFormError(result.message);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedStudent) return;
    await deleteStudent(selectedStudent._id);
    setIsDeleteOpen(false);
    setSelectedStudent(null);
  };

  const handleDisableConfirm = async () => {
    if (!selectedStudent) return;
    await updateStudent(selectedStudent._id, { is_active: false });
    setIsDisableOpen(false);
    setSelectedStudent(null);
  };

  // ─── Display helpers ──────────────────────────────────────────
  const getClassName = (student: ApiStudent) => {
    if (typeof student.class_id === "object" && student.class_id?.name) return student.class_id.name;
    return "Unknown";
  };
  const getAvatar = (name: string) => name.toLowerCase().match(/^[a-m]/) ? "/asset 12.webp" : "/asset 14.webp";
  const formatDate = (dateString?: string) => {
    if (!dateString) return "—";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return date.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
  };

  const tableData = React.useMemo(() => {
    return students.map((student) => ({
      ...student,
      displayId: student.admission_no || "—",
      avatar: getAvatar(student.name),
      classNameStr: getClassName(student),
      section: typeof student.class_id === "object" ? (student.class_id?.section || "—") : "—",
      gender: student.gender ? student.gender.charAt(0).toUpperCase() + student.gender.slice(1) : "—",
      joinDateStr: formatDate(student.admission_date),
      dobStr: formatDate(student.dob),
      status: student.is_active ? "Active" : "Inactive",
    }));
  }, [students]);

  const columns: ColumnDef<typeof tableData[0]>[] = [
    { header: "Admission No", accessorKey: "displayId", render: (s) => <span className="font-semibold text-[#F59E0B]">{s.displayId}</span> },
    { header: "Roll No", accessorKey: "roll_no" },
    { header: "Name", accessorKey: "name", render: (s) => (
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => router.push(`/dashboard/students/${s._id}`)}>
           <img src={s.avatar} className="w-8 h-8 rounded-full object-cover" alt="Avatar" />
           <span className="font-semibold text-slate-900 dark:text-white group-hover:text-[#F59E0B] transition-colors">{s.name}</span>
        </div>
    )},
    { header: "Class", accessorKey: "classNameStr" },
    { header: "Section", accessorKey: "section" },
    { header: "Gender", accessorKey: "gender" },
    { header: "Status", accessorKey: "status", render: (s) => (
        <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded text-[11px] font-bold ${s.status === "Active" ? "bg-[#E8F8E8] text-[#1D7F2C]" : "bg-[#FFEBF0] text-[#FF4A6B]"}`}>
           <span className={`w-1.5 h-1.5 rounded-full ${s.status === "Active" ? "bg-[#1DD04A]" : "bg-[#FF4A6B]"}`} />
          {s.status}
        </span>
    )},
    { header: "Date of Join", accessorKey: "joinDateStr" },
    { header: "DOB", accessorKey: "dobStr" },
    { header: "Action", sortable: false, render: (s) => (
        <div className="flex items-center gap-2">
          <button 
            onClick={(e) => { e.stopPropagation(); setSelectedStudent(s as ApiStudent); setIsCollectFeesOpen(true); }}
            className="px-3 py-1.5 rounded bg-[#F1F5F9] dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-[11px] font-bold hover:bg-[#E2E8F0] dark:hover:bg-slate-700 transition-colors"
          >
             Collect Fees
          </button>
          <div className="relative">
            <button 
              onClick={(e) => {
                e.stopPropagation();
                setActiveDropdown(activeDropdown === s._id ? null : s._id);
              }}
              className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors bg-[#F59E0B] text-white hover:bg-[#D97706]`}
            >
               <MoreVertical className="w-4 h-4" />
            </button>
            
            {/* Dropdown Menu */}
            {activeDropdown === s._id && (
              <div className="absolute right-0 top-10 w-48 bg-white dark:bg-slate-900 rounded-xl shadow-lg border border-border py-2 z-50">
                 <button onClick={() => { router.push(`/dashboard/students/${s._id}`); setActiveDropdown(null); }} className="w-full px-4 py-2 text-left text-[13px] text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/50 flex items-center gap-3">
                   <FileText className="w-4 h-4 text-slate-400 dark:text-slate-500" /> View Student
                 </button>
                 <button onClick={() => { openEdit(s as ApiStudent); setActiveDropdown(null); }} className="w-full px-4 py-2 text-left text-[13px] text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/50 flex items-center gap-3">
                   <Edit className="w-4 h-4 text-slate-400 dark:text-slate-500" /> Edit
                 </button>
                 <button onClick={() => { setSelectedStudent(s as ApiStudent); setIsLoginDetailsOpen(true); setActiveDropdown(null); }} className="w-full px-4 py-2 text-left text-[13px] text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/50 flex items-center gap-3">
                   <User className="w-4 h-4 text-slate-400 dark:text-slate-500" /> Login Details
                 </button>
                 <button onClick={() => { setSelectedStudent(s as ApiStudent); setIsDisableOpen(true); setActiveDropdown(null); }} className="w-full px-4 py-2 text-left text-[13px] text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/50 flex items-center gap-3">
                   <XCircle className="w-4 h-4 text-slate-400 dark:text-slate-500" /> Disable
                 </button>
                 <button onClick={() => { router.push('/dashboard/students/student-promotion'); setActiveDropdown(null); }} className="w-full px-4 py-2 text-left text-[13px] text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/50 flex items-center gap-3">
                   <GraduationCap className="w-4 h-4 text-slate-400 dark:text-slate-500" /> Promote Student
                 </button>
                 <button onClick={() => { setSelectedStudent(s as ApiStudent); setIsDeleteOpen(true); setActiveDropdown(null); }} className="w-full px-4 py-2 text-left text-[13px] text-rose-600 hover:bg-rose-50 flex items-center gap-3">
                   <Trash2 className="w-4 h-4 text-rose-400" /> Delete
                 </button>
              </div>
            )}
          </div>
        </div>
    )}
  ];

  return (
    <div className="space-y-6 bg-[#F8FAFC] dark:bg-[#0F172A] min-h-screen -m-6 p-6" onClick={() => setActiveDropdown(null)}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-left">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">Students List</h1>
          <div className="flex items-center gap-2 text-[13px] text-slate-500 dark:text-slate-400 mt-1">
             <span>Dashboard</span>
             <span>/</span>
             <span>Students</span>
             <span>/</span>
             <span className="text-slate-900 dark:text-white font-medium">All Students</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
           <button onClick={refetch} className="p-2 border border-border rounded-lg bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/50 shadow-sm">
             <RefreshCcw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
           </button>
           <button className="p-2 border border-border rounded-lg bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/50 shadow-sm">
             <Printer className="w-4 h-4" />
           </button>
           <button className="flex items-center gap-2 px-3 py-2 border border-border rounded-lg bg-white dark:bg-slate-900 text-[13px] font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/50 shadow-sm">
             <Download className="w-4 h-4" />
             <span>Export</span>
             <ChevronDown className="w-3.5 h-3.5" />
           </button>
          {activeRole === "admin" && (
            <Link
              href="/dashboard/students/add"
              className="flex items-center gap-2 px-4 py-2 text-[13px] font-semibold text-white bg-[#F59E0B] hover:bg-[#D97706] rounded-lg shadow-sm transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Student</span>
            </Link>
          )}
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-border rounded-xl card-shadow">
        
        {/* Filters Row */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-800/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h3 className="text-[15px] font-bold text-slate-900 dark:text-white">Students List</h3>
          <div className="flex items-center gap-3">
             <div className="relative">
               <button 
                 onClick={() => setIsDateRangeOpen(!isDateRangeOpen)}
                 className="flex items-center gap-2 px-3 py-2 border border-border rounded-lg text-[13px] text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-900 shadow-sm hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
               >
                 <Calendar className="w-4 h-4 text-slate-400 dark:text-slate-500" />
                 <span>{selectedDateRange}</span>
               </button>
               {isDateRangeOpen && (
                 <>
                   <div className="fixed inset-0 z-40" onClick={() => setIsDateRangeOpen(false)} />
                   <div className="absolute left-0 top-full mt-2 w-44 bg-white dark:bg-slate-900 border border-border rounded-lg shadow-lg z-50 overflow-hidden py-1.5 text-left">
                     {["Today", "Yesterday", "Last 7 Days", "Last 30 Days", "This Year", "Next Year", "Custom Range"].map((item) => (
                       <button onClick={() => { setSelectedDateRange(item); setIsDateRangeOpen(false); }} key={item} className={`w-full px-4 py-2 text-[13px] text-left transition-colors ${item === selectedDateRange ? "bg-[#F59E0B] text-white font-semibold" : "text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50"}`}>
                         {item}
                       </button>
                     ))}
                   </div>
                 </>
               )}
             </div>
             <div className="relative">
               <div 
                 className={`flex items-center gap-2 px-3 py-2 border border-border rounded-lg text-[13px] text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-900 cursor-pointer transition-colors ${isFilterOpen ? "bg-slate-100 dark:bg-slate-800 border-slate-300" : "hover:bg-slate-50 dark:hover:bg-slate-800/50"}`}
                 onClick={() => setIsFilterOpen(!isFilterOpen)}
               >
                  <Filter className="w-4 h-4 text-slate-400 dark:text-slate-500" />
                  <span>Filter</span>
                  <ChevronDown className="w-3.5 h-3.5" />
               </div>
               
               {/* Filter Dropdown Popover */}
               {isFilterOpen && (
                 <>
                   <div className="fixed inset-0 z-40" onClick={() => setIsFilterOpen(false)} />
                   <div className="absolute right-0 top-11 w-[380px] bg-white dark:bg-slate-900 rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-border z-50 overflow-hidden">
                   <div className="p-4 border-b border-border">
                     <h3 className="text-[15px] font-bold text-slate-900 dark:text-white">Filter</h3>
                   </div>
                   <div className="p-5 grid grid-cols-2 gap-4">
                     <div className="flex flex-col gap-1.5 text-left">
                       <label className="text-[12px] font-semibold text-slate-700 dark:text-slate-200">Class</label>
                       <select className="w-full px-3 py-2 text-[13px] text-slate-700 dark:text-slate-200 border border-border rounded-lg outline-none appearance-none cursor-pointer bg-white dark:bg-slate-900">
                         <option>Select</option>
                       </select>
                     </div>
                     <div className="flex flex-col gap-1.5 text-left">
                       <label className="text-[12px] font-semibold text-slate-700 dark:text-slate-200">Section</label>
                       <select className="w-full px-3 py-2 text-[13px] text-slate-700 dark:text-slate-200 border border-border rounded-lg outline-none appearance-none cursor-pointer bg-white dark:bg-slate-900">
                         <option>Select</option>
                       </select>
                     </div>
                     <div className="flex flex-col gap-1.5 text-left col-span-2">
                       <label className="text-[12px] font-semibold text-slate-700 dark:text-slate-200">Name</label>
                       <select className="w-full px-3 py-2 text-[13px] text-slate-700 dark:text-slate-200 border border-border rounded-lg outline-none appearance-none cursor-pointer bg-white dark:bg-slate-900">
                         <option>Select</option>
                       </select>
                     </div>
                     <div className="flex flex-col gap-1.5 text-left">
                       <label className="text-[12px] font-semibold text-slate-700 dark:text-slate-200">Gender</label>
                       <select className="w-full px-3 py-2 text-[13px] text-slate-700 dark:text-slate-200 border border-border rounded-lg outline-none appearance-none cursor-pointer bg-white dark:bg-slate-900">
                         <option>Select</option>
                       </select>
                     </div>
                     <div className="flex flex-col gap-1.5 text-left">
                       <label className="text-[12px] font-semibold text-slate-700 dark:text-slate-200">Status</label>
                       <select className="w-full px-3 py-2 text-[13px] text-slate-700 dark:text-slate-200 border border-border rounded-lg outline-none appearance-none cursor-pointer bg-white dark:bg-slate-900">
                         <option>Select</option>
                       </select>
                     </div>
                   </div>
                   <div className="p-4 border-t border-border flex items-center justify-end gap-3 bg-slate-50/50 dark:bg-slate-800/50">
                     <button onClick={() => setIsFilterOpen(false)} className="px-5 py-2 rounded-lg text-[13px] font-semibold text-slate-600 dark:text-slate-300 bg-[#F1F5F9] dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                       Reset
                     </button>
                     <button onClick={() => setIsFilterOpen(false)} className="px-5 py-2 rounded-lg text-[13px] font-semibold text-white bg-[#F59E0B] hover:bg-[#D97706] transition-colors shadow-sm">
                       Apply
                     </button>
                    </div>
                  </div>
                </>
              )}
             </div>

             {/* Sort Popover */}
             <div className="relative">
               <button 
                 onClick={() => setIsSortOpen(!isSortOpen)}
                 className="flex items-center gap-2 px-3 py-2 border border-border rounded-lg text-[13px] text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-900 shadow-sm hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
               >
                 <ArrowUpDown className="w-4 h-4 text-slate-400 dark:text-slate-500" />
                 <span>Sort by A-Z</span>
                 <ChevronDown className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
               </button>
               {isSortOpen && (
                 <>
                   <div className="fixed inset-0 z-40" onClick={() => setIsSortOpen(false)} />
                   <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-slate-900 border border-border rounded-lg shadow-lg z-50 overflow-hidden py-1.5 text-left">
                     {["Ascending", "Descending", "Recently Viewed", "Recently Added"].map((item) => (
                       <button onClick={() => { setSelectedSort(item); setIsSortOpen(false); }} key={item} className={`w-full px-4 py-2.5 text-[14px] text-left transition-colors font-medium cursor-pointer ${item === selectedSort ? "bg-[#F59E0B] text-white" : "text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/50"}`}>
                         {item}
                       </button>
                     ))}
                   </div>
                 </>
               )}
             </div>

             <div className="flex items-center border border-border rounded-lg bg-white dark:bg-slate-900 p-1">
                <button onClick={() => setViewMode("grid")} className={`p-1 rounded ${viewMode === 'grid' ? 'bg-[#F59E0B] text-white' : 'text-slate-400 dark:text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800'}`}><LayoutGrid className="w-4 h-4" /></button>
                <button onClick={() => setViewMode("list")} className={`p-1 rounded ${viewMode === 'list' ? 'bg-[#F59E0B] text-white' : 'text-slate-400 dark:text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800'}`}><List className="w-4 h-4" /></button>
             </div>
             <div className="flex items-center gap-2 px-3 py-2 border border-border rounded-lg text-[13px] text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-900 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50">
                <AlignLeft className="w-4 h-4 text-slate-400 dark:text-slate-500" />
                <span>Sort by A-Z</span>
                <ChevronDown className="w-3.5 h-3.5" />
             </div>
          </div>
        </div>

        {/* Search & Pagination Row */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-800/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-[13px] text-slate-500 dark:text-slate-400">
           <div className="flex items-center gap-2">
              <span>Row Per Page</span>
              <div className="flex items-center gap-2 px-3 py-1.5 border border-border rounded bg-white dark:bg-slate-900 font-medium text-slate-700 dark:text-slate-200 cursor-pointer">
                 10 <ChevronDown className="w-3.5 h-3.5" />
              </div>
              <span>Entries</span>
           </div>
           <div className="relative">
             <input
               type="text"
               placeholder="Search"
               value={search}
               onChange={(e) => setSearch(e.target.value)}
               className="w-[250px] pl-3 pr-4 py-2 text-[13px] text-slate-900 dark:text-white bg-white dark:bg-slate-900 border border-border rounded-lg outline-none focus:border-[#F59E0B]/50 transition-all"
             />
           </div>
        </div>

        {viewMode === "list" ? (
          <DataTable 
            columns={columns} 
            data={tableData} 
            selectionHeader={<input type="checkbox" className="rounded border-slate-300 w-4 h-4 accent-[#F59E0B]" />}
            renderSelection={() => <input type="checkbox" className="rounded border-slate-300 w-4 h-4 accent-[#F59E0B]" />}
            noDataMessage="No students registered or matching filters."
          />
        ) : (
          <div className="p-6 bg-slate-50/50 dark:bg-slate-900/20 min-h-[400px]">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {isLoading ? (
                <div className="col-span-full py-16 flex flex-col items-center gap-3 text-slate-400">
                  <Loader2 className="w-8 h-8 animate-spin text-[#F59E0B]" />
                  <span className="text-[13px] font-medium">Loading students...</span>
                </div>
              ) : students.length === 0 ? (
                <div className="col-span-full py-12 text-center text-slate-500 text-[13px]">
                  No students registered or matching filters.
                </div>
              ) : (
                students.map((student) => (
                  <div key={student._id} className="bg-white dark:bg-slate-800 rounded-xl border border-border shadow-sm p-5 relative group flex flex-col hover:border-[#F59E0B]/50 transition-colors">
                     {/* Top Row */}
                     <div className="flex items-center justify-between mb-4">
                        <span className="text-[13px] font-bold text-[#F59E0B]">{student.admission_no || "—"}</span>
                        <div className="flex items-center gap-2">
                           <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-bold ${student.is_active ? "bg-[#E8F8E8] text-[#1D7F2C] dark:bg-[#1D7F2C]/20 dark:text-[#1DD04A]" : "bg-[#FFEBF0] text-[#FF4A6B] dark:bg-[#FF4A6B]/20"}`}>
                             <span className={`w-1.5 h-1.5 rounded-full ${student.is_active ? "bg-[#1DD04A]" : "bg-[#FF4A6B]"}`} /> {student.is_active ? "Active" : "Inactive"}
                           </span>
                           <div className="relative">
                             <button
                               onClick={(e) => { e.stopPropagation(); setActiveDropdown(activeDropdown === student._id ? null : student._id); }}
                               className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                             >
                               <MoreVertical className="w-4 h-4" />
                             </button>
                             {activeDropdown === student._id && (
                                <div className="absolute right-0 top-6 w-48 bg-white dark:bg-slate-900 rounded-xl shadow-lg border border-border py-2 z-50">
                                   <button onClick={() => { router.push(`/dashboard/students/${student._id}`); setActiveDropdown(null); }} className="w-full px-4 py-2 text-left text-[13px] text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/50 flex items-center gap-3">
                                     <FileText className="w-4 h-4 text-slate-400" /> View Student
                                   </button>
                                   <button onClick={() => { openEdit(student); setActiveDropdown(null); }} className="w-full px-4 py-2 text-left text-[13px] text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/50 flex items-center gap-3">
                                     <Edit className="w-4 h-4 text-slate-400" /> Edit
                                   </button>
                                   <button onClick={() => { setSelectedStudent(student); setIsLoginDetailsOpen(true); setActiveDropdown(null); }} className="w-full px-4 py-2 text-left text-[13px] text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/50 flex items-center gap-3">
                                     <User className="w-4 h-4 text-slate-400" /> Login Details
                                   </button>
                                   <button onClick={() => { setSelectedStudent(student); setIsDisableOpen(true); setActiveDropdown(null); }} className="w-full px-4 py-2 text-left text-[13px] text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/50 flex items-center gap-3">
                                     <XCircle className="w-4 h-4 text-slate-400" /> Disable
                                   </button>
                                   <button onClick={() => { router.push('/dashboard/students/student-promotion'); setActiveDropdown(null); }} className="w-full px-4 py-2 text-left text-[13px] text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/50 flex items-center gap-3">
                                     <GraduationCap className="w-4 h-4 text-slate-400" /> Promote Student
                                   </button>
                                   <button onClick={() => { setSelectedStudent(student); setIsDeleteOpen(true); setActiveDropdown(null); }} className="w-full px-4 py-2 text-left text-[13px] text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-500/10 flex items-center gap-3">
                                     <Trash2 className="w-4 h-4 text-rose-400" /> Delete
                                   </button>
                                </div>
                             )}
                           </div>
                        </div>
                     </div>

                     {/* Profile info */}
                     <div className="flex items-center gap-4 mb-5 cursor-pointer" onClick={() => router.push(`/dashboard/students/${student._id}`)}>
                        <img src={getAvatar(student.name)} alt="Avatar" className="w-12 h-12 rounded-full object-cover shadow-sm border border-border" />
                        <div>
                          <h3 className="text-[15px] font-bold text-slate-900 dark:text-white group-hover:text-[#F59E0B] transition-colors">{student.name}</h3>
                          <p className="text-[12px] font-medium text-slate-500">{getClassName(student)}</p>
                        </div>
                     </div>

                     {/* Details grid */}
                     <div className="grid grid-cols-3 gap-2 mb-5 border-t border-b border-slate-100 dark:border-slate-700/50 py-4">
                        <div>
                           <p className="text-[11px] text-slate-500 mb-1">Roll No</p>
                           <p className="text-[12px] font-bold text-slate-900 dark:text-white">{student.roll_no || "—"}</p>
                        </div>
                        <div>
                           <p className="text-[11px] text-slate-500 mb-1">Gender</p>
                           <p className="text-[12px] font-bold text-slate-900 dark:text-white">
                             {student.gender ? student.gender.charAt(0).toUpperCase() + student.gender.slice(1) : "—"}
                           </p>
                        </div>
                        <div>
                           <p className="text-[11px] text-slate-500 mb-1">Joined On</p>
                           <p className="text-[12px] font-bold text-slate-900 dark:text-white">{formatDate(student.admission_date)}</p>
                        </div>
                     </div>

                     {/* Footer buttons */}
                     <div className="flex items-center justify-between mt-auto">
                        <div className="flex items-center gap-2">
                           <button className="w-8 h-8 rounded-full border border-border flex items-center justify-center text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"><MessageSquare className="w-3.5 h-3.5" /></button>
                           <button className="w-8 h-8 rounded-full border border-border flex items-center justify-center text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"><Phone className="w-3.5 h-3.5" /></button>
                           <button className="w-8 h-8 rounded-full border border-border flex items-center justify-center text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"><Mail className="w-3.5 h-3.5" /></button>
                        </div>
                        <button onClick={() => { setSelectedStudent(student); setIsCollectFeesOpen(true); }} className="px-3 py-1.5 rounded bg-[#F1F5F9] dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-[11px] font-bold hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors">
                          Collect Fees
                        </button>
                     </div>
                  </div>
                ))
              )}
            </div>
            {!isLoading && students.length > 0 && pagination.page < pagination.totalPages && (
              <div className="flex justify-center mt-8">
                <button onClick={() => updateFilters({ page: pagination.page + 1 })} className="px-6 py-2.5 rounded-lg text-[13px] font-bold text-white bg-[#F59E0B] hover:bg-[#D97706] transition-colors shadow-sm flex items-center gap-2">
                  <RefreshCcw className="w-4 h-4" /> Load More
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ----------------------------------------------------
          REGISTER MODAL
          ---------------------------------------------------- */}
      <Modal isOpen={isAddOpen} onClose={() => { setIsAddOpen(false); resetForm(); }} title="Register New Student">
        <form onSubmit={handleAddSubmit} className="space-y-4">
          {formError && (
            <div className="flex items-center gap-2 bg-rose-50 border border-rose-200 text-rose-600 rounded-lg px-3 py-2.5 text-[12.5px]">
              <AlertCircle className="w-4 h-4 shrink-0" /> {formError}
            </div>
          )}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5 text-left">
              <label className="text-[11px] font-semibold uppercase text-slate-500 dark:text-slate-400">Full Name *</label>
              <input required type="text" value={formName} onChange={(e) => setFormName(e.target.value)}
                placeholder="e.g. Ahmed Ali"
                className="px-3.5 py-2.5 border border-border rounded-lg bg-white dark:bg-slate-900 text-[13px] text-slate-900 dark:text-white outline-none focus:border-[#F59E0B]/50 transition-all shadow-sm" />
            </div>
            <div className="flex flex-col gap-1.5 text-left">
              <label className="text-[11px] font-semibold uppercase text-slate-500 dark:text-slate-400">Roll Number</label>
              <input type="text" value={formRollNo} onChange={(e) => setFormRollNo(e.target.value)}
                placeholder="e.g. 05"
                className="px-3.5 py-2.5 border border-border rounded-lg bg-white dark:bg-slate-900 text-[13px] text-slate-900 dark:text-white outline-none focus:border-[#F59E0B]/50 transition-all shadow-sm" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5 text-left">
              <label className="text-[11px] font-semibold uppercase text-slate-500 dark:text-slate-400">Class ID (MongoDB) *</label>
              <input required type="text" value={formClassId} onChange={(e) => setFormClassId(e.target.value)}
                placeholder="Class _id from DB"
                className="px-3.5 py-2.5 border border-border rounded-lg bg-white dark:bg-slate-900 text-[13px] text-slate-900 dark:text-white outline-none focus:border-[#F59E0B]/50 transition-all shadow-sm font-mono" />
            </div>
            <div className="flex flex-col gap-1.5 text-left">
              <label className="text-[11px] font-semibold uppercase text-slate-500 dark:text-slate-400">Gender</label>
              <select value={formGender} onChange={(e) => setFormGender(e.target.value)}
                className="px-3.5 py-2.5 border border-border rounded-lg bg-white dark:bg-slate-900 text-[13px] text-slate-900 dark:text-white outline-none focus:border-[#F59E0B]/50 transition-all shadow-sm cursor-pointer">
                <option value="">Select</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5 text-left">
              <label className="text-[11px] font-semibold uppercase text-slate-500 dark:text-slate-400">Date of Birth</label>
              <input type="date" value={formDob} onChange={(e) => setFormDob(e.target.value)}
                className="px-3.5 py-2.5 border border-border rounded-lg bg-white dark:bg-slate-900 text-[13px] text-slate-900 dark:text-white outline-none focus:border-[#F59E0B]/50 transition-all shadow-sm" />
            </div>
            <div className="flex flex-col gap-1.5 text-left">
              <label className="text-[11px] font-semibold uppercase text-slate-500 dark:text-slate-400">Student Phone</label>
              <input type="text" value={formPhone} onChange={(e) => setFormPhone(e.target.value)}
                placeholder="+92 300 0000000"
                className="px-3.5 py-2.5 border border-border rounded-lg bg-white dark:bg-slate-900 text-[13px] text-slate-900 dark:text-white outline-none focus:border-[#F59E0B]/50 transition-all shadow-sm" />
            </div>
          </div>

          <div className="w-full h-px bg-border my-1" />

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5 text-left">
              <label className="text-[11px] font-semibold uppercase text-slate-500 dark:text-slate-400">Guardian Name</label>
              <input type="text" value={formGuardianName} onChange={(e) => setFormGuardianName(e.target.value)}
                placeholder="e.g. Mr. Ali Khan"
                className="px-3.5 py-2.5 border border-border rounded-lg bg-white dark:bg-slate-900 text-[13px] text-slate-900 dark:text-white outline-none focus:border-[#F59E0B]/50 transition-all shadow-sm" />
            </div>
            <div className="flex flex-col gap-1.5 text-left">
              <label className="text-[11px] font-semibold uppercase text-slate-500 dark:text-slate-400">Guardian Phone</label>
              <input type="text" value={formGuardianPhone} onChange={(e) => setFormGuardianPhone(e.target.value)}
                placeholder="+92 300 0000000"
                className="px-3.5 py-2.5 border border-border rounded-lg bg-white dark:bg-slate-900 text-[13px] text-slate-900 dark:text-white outline-none focus:border-[#F59E0B]/50 transition-all shadow-sm" />
            </div>
          </div>

          <div className="flex flex-col gap-1.5 text-left">
            <label className="text-[11px] font-semibold uppercase text-slate-500 dark:text-slate-400">Address</label>
            <input type="text" value={formAddress} onChange={(e) => setFormAddress(e.target.value)}
              placeholder="Full address"
              className="px-3.5 py-2.5 border border-border rounded-lg bg-white dark:bg-slate-900 text-[13px] text-slate-900 dark:text-white outline-none focus:border-[#F59E0B]/50 transition-all shadow-sm" />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button type="button" onClick={() => { setIsAddOpen(false); resetForm(); }}
              className="px-4 py-2 border border-border text-[13px] font-bold rounded-lg bg-white dark:bg-slate-900 hover:bg-slate-50 text-slate-700 dark:text-slate-200 transition-colors shadow-sm">
              Cancel
            </button>
            <button type="submit" disabled={isSaving}
              className="px-4 py-2 bg-[#F59E0B] hover:bg-[#D97706] text-[13px] font-semibold rounded-lg text-white shadow-sm transition-colors flex items-center gap-2 disabled:opacity-70">
              {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
              Register Student
            </button>
          </div>
        </form>
      </Modal>

      {/* ----------------------------------------------------
          EDIT MODAL
          ---------------------------------------------------- */}
      <Modal isOpen={isEditOpen} onClose={() => { setIsEditOpen(false); resetForm(); }} title="Edit Student Info">
        <form onSubmit={handleEditSubmit} className="space-y-4">
          {formError && (
            <div className="flex items-center gap-2 bg-rose-50 border border-rose-200 text-rose-600 rounded-lg px-3 py-2.5 text-[12.5px]">
              <AlertCircle className="w-4 h-4 shrink-0" /> {formError}
            </div>
          )}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5 text-left">
              <label className="text-[11px] font-semibold uppercase text-slate-500 dark:text-slate-400">Full Name *</label>
              <input required type="text" value={formName} onChange={(e) => setFormName(e.target.value)}
                className="px-3.5 py-2.5 border border-border rounded-lg bg-white dark:bg-slate-900 text-[13px] text-slate-900 dark:text-white outline-none focus:border-[#F59E0B]/50 transition-all shadow-sm" />
            </div>
            <div className="flex flex-col gap-1.5 text-left">
              <label className="text-[11px] font-semibold uppercase text-slate-500 dark:text-slate-400">Roll Number</label>
              <input type="text" value={formRollNo} onChange={(e) => setFormRollNo(e.target.value)}
                className="px-3.5 py-2.5 border border-border rounded-lg bg-white dark:bg-slate-900 text-[13px] text-slate-900 dark:text-white outline-none focus:border-[#F59E0B]/50 transition-all shadow-sm" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5 text-left">
              <label className="text-[11px] font-semibold uppercase text-slate-500 dark:text-slate-400">Gender</label>
              <select value={formGender} onChange={(e) => setFormGender(e.target.value)}
                className="px-3.5 py-2.5 border border-border rounded-lg bg-white dark:bg-slate-900 text-[13px] text-slate-900 dark:text-white outline-none focus:border-[#F59E0B]/50 transition-all shadow-sm cursor-pointer">
                <option value="">Select</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className="flex flex-col gap-1.5 text-left">
              <label className="text-[11px] font-semibold uppercase text-slate-500 dark:text-slate-400">Date of Birth</label>
              <input type="date" value={formDob} onChange={(e) => setFormDob(e.target.value)}
                className="px-3.5 py-2.5 border border-border rounded-lg bg-white dark:bg-slate-900 text-[13px] text-slate-900 dark:text-white outline-none focus:border-[#F59E0B]/50 transition-all shadow-sm" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5 text-left">
              <label className="text-[11px] font-semibold uppercase text-slate-500 dark:text-slate-400">Guardian Name</label>
              <input type="text" value={formGuardianName} onChange={(e) => setFormGuardianName(e.target.value)}
                className="px-3.5 py-2.5 border border-border rounded-lg bg-white dark:bg-slate-900 text-[13px] text-slate-900 dark:text-white outline-none focus:border-[#F59E0B]/50 transition-all shadow-sm" />
            </div>
            <div className="flex flex-col gap-1.5 text-left">
              <label className="text-[11px] font-semibold uppercase text-slate-500 dark:text-slate-400">Guardian Phone</label>
              <input type="text" value={formGuardianPhone} onChange={(e) => setFormGuardianPhone(e.target.value)}
                className="px-3.5 py-2.5 border border-border rounded-lg bg-white dark:bg-slate-900 text-[13px] text-slate-900 dark:text-white outline-none focus:border-[#F59E0B]/50 transition-all shadow-sm" />
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <button type="button" onClick={() => { setIsEditOpen(false); resetForm(); }}
              className="px-4 py-2 border border-border text-[13px] font-bold rounded-lg bg-white dark:bg-slate-900 hover:bg-slate-50 text-slate-700 dark:text-slate-200 transition-colors shadow-sm">
              Cancel
            </button>
            <button type="submit" disabled={isSaving}
              className="px-4 py-2 bg-[#F59E0B] hover:bg-[#D97706] text-[13px] font-semibold rounded-lg text-white shadow-sm transition-colors flex items-center gap-2 disabled:opacity-70">
              {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
              Save Changes
            </button>
          </div>
        </form>
      </Modal>



      <CollectFeesModal 
        isOpen={isCollectFeesOpen} 
        onClose={() => setIsCollectFeesOpen(false)} 
        student={selectedStudent} 
      />

      <LoginDetailsModal 
        isOpen={isLoginDetailsOpen} 
        onClose={() => setIsLoginDetailsOpen(false)} 
        student={selectedStudent} 
      />

      <ConfirmModal 
        isOpen={isDisableOpen}
        onClose={() => setIsDisableOpen(false)}
        title="Disable Student"
        message={`Are you sure you want to disable ${selectedStudent?.name}? They will no longer be able to log in.`}
        confirmText="Disable Student"
        onConfirm={handleDisableConfirm}
      />

      <ConfirmModal 
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        title="Delete Student"
        message={`Are you sure you want to delete ${selectedStudent?.name}? This action cannot be undone.`}
        confirmText="Delete"
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
}
