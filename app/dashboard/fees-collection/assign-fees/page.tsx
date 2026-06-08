"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Search, List, Grid, MoreVertical, Edit, Trash2, Plus,
  Calendar, Filter, ChevronDown, RefreshCw, Printer, Download, FileText, Info
} from "lucide-react";
import { Modal } from "../../../components/ui/modal";
import { DataTable, ColumnDef } from "@/app/components/ui/data-table";

interface AssignedFee {
  id: string;
  sNo: string;
  feesGroup: string;
  feesType: string;
  studentClass: string;
  section: string;
  amount: number;
  gender: string;
  category: string;
}

interface FeesTypeItem {
  id: string;
  feesType: string;
  feesGroup: string;
  amount: number;
}

interface StudentItem {
  id: string;
  admissionNumber: string;
  name: string;
  avatar: string;
  studentClass: string;
  section: string;
  gender: string;
  category: string;
}

const mockAssignedFees: AssignedFee[] = [
  { id: "1", sNo: "01", feesGroup: "Admission-Fees", feesType: "Tuition Fees", studentClass: "I", section: "B", amount: 1250, gender: "Male", category: "BC" },
  { id: "2", sNo: "02", feesGroup: "Class 1 General", feesType: "Monthly Fees", studentClass: "II", section: "C", amount: 250, gender: "Both", category: "MBC" },
  { id: "3", sNo: "03", feesGroup: "Monthly Fees", feesType: "Admission Fees", studentClass: "X", section: "F", amount: 656, gender: "Female", category: "FC" },
  { id: "4", sNo: "04", feesGroup: "Class 1 Lump Sum", feesType: "Bus Fees", studentClass: "X", section: "R", amount: 6225, gender: "Male", category: "BC" },
  { id: "5", sNo: "05", feesGroup: "Class 1-I Installment", feesType: "Monthly Fees", studentClass: "II", section: "F", amount: 454, gender: "Both", category: "MBC" },
  { id: "6", sNo: "06", feesGroup: "Class 1-II Installment", feesType: "Monthly Fees", studentClass: "V", section: "A", amount: 214, gender: "Male", category: "All" },
  { id: "7", sNo: "07", feesGroup: "Discount", feesType: "Topper Discount", studentClass: "V", section: "B", amount: 145, gender: "Both", category: "FC" },
  { id: "8", sNo: "08", feesGroup: "Class 3-I Installment", feesType: "3rd Installment Fees", studentClass: "X", section: "B", amount: 147, gender: "Male", category: "FC" },
  { id: "9", sNo: "09", feesGroup: "Class 2-I Installment", feesType: "3rd Installment Fees", studentClass: "VI", section: "A", amount: 457, gender: "Female", category: "FC" },
  { id: "10", sNo: "10", feesGroup: "Class 4-I Installment", feesType: "3rd Installment Fees", studentClass: "V", section: "A", amount: 654, gender: "Female", category: "All" },
];

const mockFeesTypes: FeesTypeItem[] = [
  { id: "1", feesType: "Admission Fees", feesGroup: "Admission Fees", amount: 5000 },
  { id: "2", feesType: "Apr-Mar", feesGroup: "Apr-Mar", amount: 656 },
  { id: "3", feesType: "Bus Fees", feesGroup: "Bus Fees", amount: 400 },
  { id: "4", feesType: "1st Installment Fees", feesGroup: "1st Installment Fees", amount: 2545 },
  { id: "5", feesType: "2nd Installment Fees", feesGroup: "2nd Installment Fees", amount: 7898 },
  { id: "6", feesType: "3rd Installment Fees", feesGroup: "3rd Installment Fees", amount: 4765 },
];

const mockStudents: StudentItem[] = [
  { id: "1", admissionNumber: "AD9892430", name: "Janet", avatar: "https://ui-avatars.com/api/?name=Janet&background=F1F5F9&color=5D6BEE&bold=true", studentClass: "II", section: "B", gender: "Female", category: "MBC" },
  { id: "2", admissionNumber: "AD9892429", name: "Ralph", avatar: "https://i.pravatar.cc/150?u=Ralph", studentClass: "III", section: "B", gender: "Male", category: "BC" },
  { id: "3", admissionNumber: "AD9892428", name: "Jule", avatar: "https://i.pravatar.cc/150?u=Jule", studentClass: "V", section: "A", gender: "Female", category: "BC" },
  { id: "4", admissionNumber: "AD9892427", name: "Ryan", avatar: "https://i.pravatar.cc/150?u=Ryan", studentClass: "VI", section: "A", gender: "Male", category: "MBC" },
  { id: "5", admissionNumber: "AD9892426", name: "Susan", avatar: "https://i.pravatar.cc/150?u=Susan", studentClass: "VIII", section: "B", gender: "Female", category: "BC" },
  { id: "6", admissionNumber: "AD9892425", name: "Richard", avatar: "https://i.pravatar.cc/150?u=Richard", studentClass: "VII", section: "B", gender: "Male", category: "MBC" },
  { id: "7", admissionNumber: "AD9892424", name: "Veronica", avatar: "https://i.pravatar.cc/150?u=Veronica", studentClass: "IX", section: "A", gender: "Female", category: "BC" },
];

export default function AssignFeesPage() {
  const [assignedFeesData, setAssignedFeesData] = useState<AssignedFee[]>(mockAssignedFees);
  const [searchTerm, setSearchTerm] = useState("");

  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isDateRangeOpen, setIsDateRangeOpen] = useState(false);
  const [selectedDateRange, setSelectedDateRange] = useState("06/02/2026 - 06/08/2026");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [isModalFilterOpen, setIsModalFilterOpen] = useState(false);

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const [selectedFee, setSelectedFee] = useState<AssignedFee | null>(null);
  const [actionMenuId, setActionMenuId] = useState<string | null>(null);

  // Modal specific state
  const [selectedFeesTypeIds, setSelectedFeesTypeIds] = useState<Set<string>>(new Set(["1", "4"]));
  const [selectedStudentIds, setSelectedStudentIds] = useState<Set<string>>(new Set(["1"]));

  const toggleFeeTypeSelection = (id: string) => {
    const newSelection = new Set(selectedFeesTypeIds);
    if (newSelection.has(id)) {
      newSelection.delete(id);
    } else {
      newSelection.add(id);
    }
    setSelectedFeesTypeIds(newSelection);
  };

  const toggleStudentSelection = (id: string) => {
    const newSelection = new Set(selectedStudentIds);
    if (newSelection.has(id)) {
      newSelection.delete(id);
    } else {
      newSelection.add(id);
    }
    setSelectedStudentIds(newSelection);
  };

  const openAddModal = () => {
    setSelectedFeesTypeIds(new Set(["1", "4"]));
    setSelectedStudentIds(new Set(["1"]));
    setIsAddOpen(true);
  };

  const openEditModal = (item: AssignedFee) => {
    setSelectedFee(item);
    setSelectedFeesTypeIds(new Set(["4", "5"])); // Just some mock defaults for editing
    setSelectedStudentIds(new Set(["1"]));
    setIsEditOpen(true);
    setActionMenuId(null);
  };

  const openDeleteModal = (item: AssignedFee) => {
    setSelectedFee(item);
    setIsDeleteOpen(true);
    setActionMenuId(null);
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsAddOpen(false);
    // In a real app, this would create multiple assignments based on selected students and fees
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsEditOpen(false);
  };

  const handleDeleteConfirm = () => {
    if (selectedFee) {
      setAssignedFeesData(assignedFeesData.filter(s => s.id !== selectedFee.id));
    }
    setIsDeleteOpen(false);
  };

  const filteredData = assignedFeesData.filter(s =>
    s.feesGroup.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.feesType.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.studentClass.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 bg-[#F8FAFC] dark:bg-[#0F172A] min-h-screen -m-6 p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">Fees Collection</h1>
          <div className="flex items-center gap-2 text-[13px] text-slate-500 dark:text-slate-400 mt-1">
            <span>Dashboard</span>
            <span>/</span>
            <Link href="/dashboard/fees-collection" className="hover:text-[#F59E0B]">Fees Collection</Link>
            <span>/</span>
            <span className="text-slate-900 dark:text-white font-medium">Assign Fees</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button className="w-9 h-9 rounded-full bg-white dark:bg-slate-900 border border-border flex items-center justify-center text-slate-500 dark:text-slate-400 hover:text-[#F59E0B] hover:bg-indigo-50 transition-colors shadow-sm cursor-pointer">
            <RefreshCw className="w-4 h-4" />
          </button>
          <button className="w-9 h-9 rounded-full bg-white dark:bg-slate-900 border border-border flex items-center justify-center text-slate-500 dark:text-slate-400 hover:text-[#F59E0B] hover:bg-indigo-50 transition-colors shadow-sm cursor-pointer">
            <Printer className="w-4 h-4" />
          </button>

          <div className="relative">
            <button
              onClick={() => setIsExportOpen(!isExportOpen)}
              className="px-4 py-2 bg-white dark:bg-slate-900 border border-border text-slate-700 dark:text-slate-200 text-[13px] font-semibold rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors flex items-center gap-2 shadow-sm cursor-pointer"
            >
              <Download className="w-4 h-4" /> Export <ChevronDown className="w-3 h-3 text-slate-400 dark:text-slate-500" />
            </button>
            {isExportOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setIsExportOpen(false)} />
                <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-slate-900 border border-border rounded-lg shadow-lg z-50 overflow-hidden py-2 text-left">
                  <button className="w-full px-4 py-2.5 text-[14px] font-medium text-[#0F172A] dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800/50 flex items-center gap-3 transition-colors cursor-pointer">
                    <FileText className="w-4 h-4 text-slate-500 dark:text-slate-400" /> Export as PDF
                  </button>
                  <button className="w-full px-4 py-2.5 text-[14px] font-medium text-[#0F172A] dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800/50 flex items-center gap-3 transition-colors cursor-pointer">
                    <FileText className="w-4 h-4 text-slate-500 dark:text-slate-400" /> Export as Excel
                  </button>
                </div>
              </>
            )}
          </div>

          <button
            onClick={openAddModal}
            className="px-4 py-2 bg-[#F59E0B] hover:bg-[#D97706] text-white text-[13px] font-semibold rounded-lg flex items-center gap-2 transition-colors shadow-sm cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Assign New
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white dark:bg-slate-900 border border-border rounded-xl shadow-sm text-left">
        {/* Table Header Section */}
        <div className="p-5 border-b border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <h2 className="text-[16px] font-bold text-slate-800 dark:text-slate-100">
            Fees Collection
          </h2>

          <div className="flex items-center gap-3">
            <div className="relative">
              <button
                onClick={() => setIsDateRangeOpen(!isDateRangeOpen)}
                className="px-3 py-2 bg-white dark:bg-slate-900 border border-border text-slate-700 dark:text-slate-200 text-[13px] font-medium rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors flex items-center gap-2 shadow-sm cursor-pointer"
              >
                <Calendar className="w-4 h-4 text-slate-400 dark:text-slate-500" /> {selectedDateRange}
              </button>
              {isDateRangeOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsDateRangeOpen(false)} />
                  <div className="absolute right-0 sm:left-0 sm:right-auto top-full mt-2 w-44 bg-white dark:bg-slate-900 border border-border rounded-lg shadow-lg z-50 overflow-hidden py-1.5 text-left">
                    {["Today", "Yesterday", "Last 7 Days", "Last 30 Days", "This Year", "Next Year", "Custom Range"].map((item) => (
                      <button key={item} onClick={() => { setSelectedDateRange(item); setIsDateRangeOpen(false); }} className={`w-full px-4 py-2 text-[13px] text-left transition-colors cursor-pointer ${item === selectedDateRange ? "bg-[#F59E0B] text-white font-semibold" : "text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50"}`}>
                        {item}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            <div className="relative">
              <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="px-3 py-2 bg-white dark:bg-slate-900 border border-border text-slate-700 dark:text-slate-200 text-[13px] font-medium rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors flex items-center gap-2 shadow-sm cursor-pointer"
              >
                <Filter className="w-4 h-4 text-slate-400 dark:text-slate-500" /> Filter <ChevronDown className="w-3 h-3 text-slate-400 dark:text-slate-500" />
              </button>
              {isFilterOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsFilterOpen(false)} />
                  <div className="absolute right-0 top-full mt-2 w-80 bg-white dark:bg-slate-900 border border-border rounded-lg shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)] z-50 text-left">
                    <div className="p-4 border-b border-border">
                      <h3 className="text-[15px] font-bold text-[#0F172A] dark:text-slate-100">Filter</h3>
                    </div>
                    <div className="p-4 space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-[13px] font-bold text-slate-800 dark:text-slate-100">Class</label>
                          <div className="relative">
                            <select className="w-full px-3 py-2 border border-border rounded-lg text-[13px] outline-none appearance-none bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 font-medium cursor-pointer">
                              <option value="">Select</option>
                              <option value="I">I</option>
                              <option value="II">II</option>
                            </select>
                            <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                          </div>
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[13px] font-bold text-slate-800 dark:text-slate-100">Section</label>
                          <div className="relative">
                            <select className="w-full px-3 py-2 border border-border rounded-lg text-[13px] outline-none appearance-none bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 font-medium cursor-pointer">
                              <option value="">Select</option>
                              <option value="A">A</option>
                              <option value="B">B</option>
                            </select>
                            <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="p-4 flex justify-end gap-3 bg-white dark:bg-slate-900 rounded-b-lg border-t border-border mt-2">
                      <button onClick={() => setIsFilterOpen(false)} className="px-5 py-2.5 bg-[#F1F5F9] dark:bg-slate-800 hover:bg-[#E2E8F0] dark:hover:bg-slate-700 text-[#0F172A] dark:text-slate-100 text-[13px] font-bold rounded-lg transition-colors cursor-pointer">
                        Reset
                      </button>
                      <button onClick={() => setIsFilterOpen(false)} className="px-5 py-2.5 bg-[#F59E0B] hover:bg-[#D97706] text-white text-[13px] font-bold rounded-lg shadow-sm transition-colors cursor-pointer">
                        Apply
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>

            <div className="relative">
              <button
                onClick={() => setIsSortOpen(!isSortOpen)}
                className="px-3 py-2 bg-white dark:bg-slate-900 border border-border text-slate-700 dark:text-slate-200 text-[13px] font-medium rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors flex items-center gap-2 shadow-sm cursor-pointer"
              >
                <List className="w-4 h-4 text-slate-400 dark:text-slate-500" /> Sort by A-Z <ChevronDown className="w-3 h-3 text-slate-400 dark:text-slate-500" />
              </button>
              {isSortOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsSortOpen(false)} />
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-slate-900 border border-border rounded-lg shadow-lg z-50 overflow-hidden py-1.5 text-left">
                    {["Ascending", "Descending", "Recently Viewed", "Recently Added"].map((item) => (
                      <button key={item} className="w-full px-4 py-2.5 text-[14px] text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/50 text-left transition-colors font-medium cursor-pointer">
                        {item}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Controls Section */}
        <div className="p-5 flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-50/50 dark:bg-slate-800/50">
          <div className="flex items-center gap-2 text-[13px] text-slate-500 dark:text-slate-400">
            <span>Row Per Page</span>
            <select className="px-2 py-1.5 bg-white dark:bg-slate-900 border border-border rounded-lg outline-none text-slate-700 dark:text-slate-200 font-medium cursor-pointer">
              <option>10</option>
              <option>25</option>
              <option>50</option>
            </select>
            <span>Entries</span>
          </div>

          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2 w-[240px] bg-white dark:bg-slate-900 border border-border rounded-lg text-[13px] outline-none focus:border-[#F59E0B] transition-colors"
            />
          </div>
        </div>

        {/* Table */}
        <DataTable 
          columns={[
            { header: "S. No", accessorKey: "sNo", render: (item) => <span className="font-medium text-slate-600 dark:text-slate-300">{item.sNo}</span> },
            { header: "Fees Group", accessorKey: "feesGroup", render: (item) => <span className="font-medium text-slate-600 dark:text-slate-300">{item.feesGroup}</span> },
            { header: "Fees Type", accessorKey: "feesType" },
            { header: "Class", accessorKey: "studentClass" },
            { header: "Section", accessorKey: "section" },
            { header: "Amount ($)", accessorKey: "amount" },
            { header: "Gender", accessorKey: "gender" },
            { header: "Category", accessorKey: "category" },
            { header: "Action", sortable: false, className: "text-center", render: (item) => (
                <div className="relative inline-block text-left" onClick={(e) => e.stopPropagation()}>
                  <button
                    onClick={() => setActionMenuId(actionMenuId === item.id ? null : item.id)}
                    className={`p-1.5 rounded-lg transition-colors cursor-pointer ${actionMenuId === item.id ? "bg-[#F59E0B] text-white" : "hover:bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500"}`}
                  >
                    <MoreVertical className="w-4 h-4" />
                  </button>
                  {actionMenuId === item.id && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={(e) => { e.stopPropagation(); setActionMenuId(null); }} />
                      <div className="absolute right-8 top-0 w-36 bg-white dark:bg-slate-900 border border-border rounded-xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)] z-50 overflow-hidden py-2 text-left">
                        <button onClick={() => openEditModal(item)} className="w-full px-4 py-2 text-[13px] text-[#0F172A] dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800/50 flex items-center gap-2 font-medium transition-colors cursor-pointer">
                          <Edit className="w-4 h-4 text-[#0F172A] dark:text-slate-100" /> Edit
                        </button>
                        <button onClick={() => openDeleteModal(item)} className="w-full px-4 py-2 text-[13px] text-[#0F172A] dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800/50 flex items-center gap-2 font-medium transition-colors cursor-pointer">
                          <Trash2 className="w-4 h-4 text-[#0F172A] dark:text-slate-100" /> Delete
                        </button>
                      </div>
                    </>
                  )}
                </div>
            )}
          ]}
          data={filteredData}
          selectionHeader={<input type="checkbox" className="rounded border-slate-300 text-[#F59E0B] focus:ring-[#F59E0B] cursor-pointer" />}
          renderSelection={() => <input type="checkbox" className="rounded border-slate-300 text-[#F59E0B] focus:ring-[#F59E0B] cursor-pointer" />}
        />
      </div>

      {/* Add / Edit Modals */}
      <Modal
        isOpen={isAddOpen || isEditOpen}
        onClose={() => { setIsAddOpen(false); setIsEditOpen(false); }}
        title={isAddOpen ? "Assign New Fees" : "Edit Fees"}
        size="xl"
      >
        <form onSubmit={isAddOpen ? handleAddSubmit : handleEditSubmit} className="space-y-6 text-left">

          <div className="flex items-center gap-2 mb-4">
            <span className="text-[13px] font-bold text-slate-800 dark:text-slate-100">Search Criteria</span>
            <div className="relative">
              <button type="button" onClick={() => setIsModalFilterOpen(!isModalFilterOpen)} className="flex items-center gap-2 px-3 py-1.5 border border-border rounded-lg text-[13px] font-medium text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition-colors">
                <Filter className="w-3.5 h-3.5" /> Filter <ChevronDown className="w-3.5 h-3.5" />
              </button>
              {isModalFilterOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsModalFilterOpen(false)} />
                  <div className="absolute left-0 top-full mt-2 w-80 bg-white dark:bg-slate-900 border border-border rounded-lg shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)] z-50 text-left">
                    <div className="p-4 border-b border-border">
                      <h3 className="text-[15px] font-bold text-[#0F172A] dark:text-slate-100">Filter</h3>
                    </div>
                    <div className="p-4 space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-[13px] font-bold text-slate-800 dark:text-slate-100">Section</label>
                          <div className="relative">
                            <select className="w-full px-3 py-2 border border-border rounded-lg text-[13px] outline-none appearance-none bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 font-medium cursor-pointer">
                              <option value="">Select</option>
                              <option value="A">A</option>
                              <option value="B">B</option>
                            </select>
                            <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                          </div>
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[13px] font-bold text-slate-800 dark:text-slate-100">Gender</label>
                          <div className="relative">
                            <select className="w-full px-3 py-2 border border-border rounded-lg text-[13px] outline-none appearance-none bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 font-medium cursor-pointer">
                              <option value="">Select</option>
                              <option value="Male">Male</option>
                              <option value="Female">Female</option>
                            </select>
                            <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                          </div>
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[13px] font-bold text-slate-800 dark:text-slate-100">Student Category</label>
                        <div className="relative">
                          <select className="w-full px-3 py-2 border border-border rounded-lg text-[13px] outline-none appearance-none bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 font-medium cursor-pointer">
                            <option value="">Select</option>
                            <option value="BC">BC</option>
                            <option value="MBC">MBC</option>
                            <option value="FC">FC</option>
                          </select>
                          <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                        </div>
                      </div>
                    </div>
                    <div className="p-4 flex justify-end gap-3 bg-white dark:bg-slate-900 rounded-b-lg border-t border-border mt-2">
                      <button onClick={() => setIsModalFilterOpen(false)} className="px-5 py-2.5 bg-[#F1F5F9] dark:bg-slate-800 hover:bg-[#E2E8F0] dark:hover:bg-slate-700 text-[#0F172A] dark:text-slate-100 text-[13px] font-bold rounded-lg transition-colors cursor-pointer">
                        Reset
                      </button>
                      <button onClick={() => setIsModalFilterOpen(false)} className="px-5 py-2.5 bg-[#4F46E5] hover:bg-[#4338CA] text-white text-[13px] font-bold rounded-lg shadow-sm transition-colors cursor-pointer">
                        Apply
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-[15px] font-bold text-slate-900 dark:text-white">List of Fees type</h3>
            <div className="border border-border rounded-xl overflow-hidden">
              <table className="w-full text-[13px] text-left whitespace-nowrap">
                <thead className="bg-[#F8FAFC] dark:bg-[#0F172A] border-b border-border">
                  <tr>
                    <th className="px-6 py-3 font-bold text-slate-700 dark:text-slate-200 w-12">
                      <input type="checkbox" className="rounded border-slate-300 text-[#F59E0B] focus:ring-[#F59E0B] cursor-pointer" />
                    </th>
                    <th className="px-6 py-3 font-bold text-slate-700 dark:text-slate-200">Fees Type</th>
                    <th className="px-6 py-3 font-bold text-slate-700 dark:text-slate-200">Fees Type</th>
                    <th className="px-6 py-3 font-bold text-slate-700 dark:text-slate-200">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {mockFeesTypes.map((type) => (
                    <tr key={type.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="px-6 py-3">
                        <input
                          type="checkbox"
                          checked={selectedFeesTypeIds.has(type.id)}
                          onChange={() => toggleFeeTypeSelection(type.id)}
                          className="rounded border-slate-300 text-[#F59E0B] focus:ring-[#F59E0B] cursor-pointer"
                        />
                      </td>
                      <td className="px-6 py-3 text-slate-600 dark:text-slate-300">{type.feesType}</td>
                      <td className="px-6 py-3 text-slate-600 dark:text-slate-300">{type.feesGroup}</td>
                      <td className="px-6 py-3 text-slate-600 dark:text-slate-300">{type.amount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="space-y-4 pt-4">
            <h3 className="text-[15px] font-bold text-slate-900 dark:text-white">Student Details</h3>
            <div className="border border-border rounded-xl overflow-hidden">
              <table className="w-full text-[13px] text-left whitespace-nowrap">
                <thead className="bg-[#F8FAFC] dark:bg-[#0F172A] border-b border-border">
                  <tr>
                    <th className="px-6 py-3 font-bold text-slate-700 dark:text-slate-200 w-12">
                      <input type="checkbox" className="rounded border-slate-300 text-[#F59E0B] focus:ring-[#F59E0B] cursor-pointer" />
                    </th>
                    <th className="px-6 py-3 font-bold text-slate-700 dark:text-slate-200">Admission Number</th>
                    <th className="px-6 py-3 font-bold text-slate-700 dark:text-slate-200">Student</th>
                    <th className="px-6 py-3 font-bold text-slate-700 dark:text-slate-200">Class</th>
                    <th className="px-6 py-3 font-bold text-slate-700 dark:text-slate-200">Section</th>
                    <th className="px-6 py-3 font-bold text-slate-700 dark:text-slate-200">Gender</th>
                    <th className="px-6 py-3 font-bold text-slate-700 dark:text-slate-200">Student Category</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {mockStudents.map((student) => (
                    <tr key={student.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="px-6 py-3">
                        <input
                          type="checkbox"
                          checked={selectedStudentIds.has(student.id)}
                          onChange={() => toggleStudentSelection(student.id)}
                          className="rounded border-slate-300 text-[#F59E0B] focus:ring-[#F59E0B] cursor-pointer"
                        />
                      </td>
                      <td className="px-6 py-3">
                        <button type="button" className="text-[#F59E0B] font-medium hover:underline">{student.admissionNumber}</button>
                      </td>
                      <td className="px-6 py-3">
                        <div className="flex items-center gap-3">
                          <Image src={student.avatar} alt={student.name} width={24} height={24} className="rounded-full" />
                          <span className="text-slate-700 dark:text-slate-200 font-medium">{student.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-3 text-slate-600 dark:text-slate-300">{student.studentClass}</td>
                      <td className="px-6 py-3 text-slate-600 dark:text-slate-300">{student.section}</td>
                      <td className="px-6 py-3 text-slate-600 dark:text-slate-300">{student.gender}</td>
                      <td className="px-6 py-3 text-slate-600 dark:text-slate-300">{student.category}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-[#EEF2FF] border border-[#C7D2FE] rounded-lg p-3 flex items-start gap-2 text-[13px] text-[#4F46E5] mt-4">
            <Info className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <p>Selected {selectedFeesTypeIds.size} Fees Group, {selectedStudentIds.size} Students</p>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-border mt-6">
            <button
              type="button"
              onClick={() => { setIsAddOpen(false); setIsEditOpen(false); }}
              className="px-6 py-2.5 bg-[#F1F5F9] dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-[14px] font-bold rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-[#F59E0B] text-white text-[14px] font-bold rounded-lg hover:bg-[#D97706] transition-colors shadow-sm cursor-pointer"
            >
              {isAddOpen ? "Add Fees" : "Save Changes"}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      {isDeleteOpen && (
        <>
          <div className="fixed inset-0 bg-slate-900/50 z-[60] backdrop-blur-sm" onClick={() => setIsDeleteOpen(false)} />
          <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[400px] bg-white dark:bg-slate-900 rounded-2xl shadow-xl z-[70] overflow-hidden p-8 text-center animate-in fade-in zoom-in duration-200">
            <div className="w-16 h-16 bg-rose-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Trash2 className="w-8 h-8 text-rose-500" />
            </div>
            <h2 className="text-xl font-bold text-[#0F172A] dark:text-slate-100 mb-3">Confirm Deletion</h2>
            <p className="text-[14px] text-slate-500 dark:text-slate-400 leading-relaxed mb-8">
              You want to delete all the marked items, this cant be undone once you delete.
            </p>
            <div className="flex justify-center gap-3">
              <button
                onClick={() => setIsDeleteOpen(false)}
                className="px-6 py-2.5 bg-[#F1F5F9] dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-[14px] font-bold rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="px-6 py-2.5 bg-rose-500 text-white text-[14px] font-bold rounded-lg hover:bg-rose-600 transition-colors shadow-sm shadow-rose-500/20 cursor-pointer"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </>
      )}

    </div>
  );
}
