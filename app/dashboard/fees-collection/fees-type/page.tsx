"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  Search, List, Grid, MoreVertical, Edit, Trash2, Plus,
  Calendar, Filter, ChevronDown, RefreshCw, Printer, Download, FileText
} from "lucide-react";
import { Modal } from "../../../components/ui/modal";
import { DataTable, ColumnDef } from "@/app/components/ui/data-table";

interface FeesType {
  id: string; // Database ID
  displayId: string;
  feesType: string;
  feesCode: string;
  feesGroup: string;
  description: string;
  status: "Active" | "Inactive";
}

const mockFeesTypeData: FeesType[] = [
  { id: "1", displayId: "FG80482", feesType: "Admission Fees", feesCode: "Admission-Fees", feesGroup: "Tuition Fees", description: "The money that you pay to be taught", status: "Active" },
  { id: "2", displayId: "FG80481", feesType: "Apr-Mar", feesCode: "Apr-Mar", feesGroup: "Monthly Fees", description: "The money that you pay to be taught", status: "Active" },
  { id: "3", displayId: "FG80480", feesType: "Bus Fees", feesCode: "Bus Fees", feesGroup: "Class 1 General", description: "The money that you pay to be taught", status: "Active" },
  { id: "4", displayId: "FG80479", feesType: "1st Installment Fees", feesCode: "1st-Installment-Fees", feesGroup: "Class 1 Lump Sum", description: "The money that you pay to be taught", status: "Active" },
  { id: "5", displayId: "FG80478", feesType: "2nd Installment Fees", feesCode: "2nd-Installment-Fees", feesGroup: "Class 1-I Installment", description: "The money that you pay to be taught", status: "Inactive" },
  { id: "6", displayId: "FG80477", feesType: "3rd Installment Fees", feesCode: "3rd-Installment-Fees", feesGroup: "Class 1-II Installment", description: "The money that you pay to be taught", status: "Active" },
  { id: "7", displayId: "FG80476", feesType: "4th Installment Fees", feesCode: "4th-Installment-Fees", feesGroup: "Class 1-III Installment", description: "The money that you pay to be taught", status: "Active" },
  { id: "8", displayId: "FG80475", feesType: "Topper Discount", feesCode: "Topper-Discount", feesGroup: "Discount", description: "The money that you pay to be taught", status: "Inactive" },
];

export default function FeesTypePage() {
  const [feesTypeData, setFeesTypeData] = useState<FeesType[]>(mockFeesTypeData);
  const [searchTerm, setSearchTerm] = useState("");
  
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isDateRangeOpen, setIsDateRangeOpen] = useState(false);
  const [selectedDateRange, setSelectedDateRange] = useState("Last 7 Days");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [selectedSort, setSelectedSort] = useState("Ascending");
  
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  
  const [selectedType, setSelectedType] = useState<FeesType | null>(null);
  const [actionMenuId, setActionMenuId] = useState<string | null>(null);

  // Form states
  const [formName, setFormName] = useState("");
  const [formFeesGroup, setFormFeesGroup] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formStatus, setFormStatus] = useState<"Active" | "Inactive">("Active");

  // Filter States
  const [filterId, setFilterId] = useState("");
  const [filterName, setFilterName] = useState("");
  const [filterFeesGroup, setFilterFeesGroup] = useState("");
  const [filterFeesType, setFilterFeesType] = useState("");
  const [filterStatus, setFilterStatus] = useState("Active");

  const openAddModal = () => {
    setFormName("");
    setFormFeesGroup("");
    setFormDescription("");
    setFormStatus("Active");
    setIsAddOpen(true);
  };

  const openEditModal = (item: FeesType) => {
    setSelectedType(item);
    setFormName(item.feesType);
    setFormFeesGroup(item.feesGroup);
    setFormDescription(item.description);
    setFormStatus(item.status);
    setIsEditOpen(true);
    setActionMenuId(null);
  };

  const openDeleteModal = (item: FeesType) => {
    setSelectedType(item);
    setIsDeleteOpen(true);
    setActionMenuId(null);
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newItem: FeesType = {
      id: Math.random().toString(),
      displayId: `FG80${Math.floor(100 + Math.random() * 900)}`,
      feesType: formName,
      feesCode: formName.replace(/\s+/g, '-'),
      feesGroup: formFeesGroup || "General",
      description: formDescription,
      status: formStatus,
    };
    setFeesTypeData([newItem, ...feesTypeData]);
    setIsAddOpen(false);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedType) {
      setFeesTypeData(feesTypeData.map(s => 
        s.id === selectedType.id 
          ? { 
              ...s, 
              feesType: formName, 
              feesCode: formName.replace(/\s+/g, '-'), 
              feesGroup: formFeesGroup, 
              description: formDescription, 
              status: formStatus 
            }
          : s
      ));
    }
    setIsEditOpen(false);
  };

  const handleDeleteConfirm = () => {
    if (selectedType) {
      setFeesTypeData(feesTypeData.filter(s => s.id !== selectedType.id));
    }
    setIsDeleteOpen(false);
  };

  const filteredData = feesTypeData.filter(s => 
    s.feesType.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.displayId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.feesGroup.toLowerCase().includes(searchTerm.toLowerCase())
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
            <span className="text-slate-900 dark:text-white font-medium">Fees Type</span>
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
            <Plus className="w-4 h-4" /> Add Fees Type
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white dark:bg-slate-900 border border-border rounded-xl shadow-sm text-left">
        {/* Table Header Section */}
        <div className="p-5 border-b border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <h2 className="text-[16px] font-bold text-slate-800 dark:text-slate-100">Fees Collection</h2>
          
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
                  <div className="absolute right-0 top-full mt-2 w-44 bg-white dark:bg-slate-900 border border-border rounded-lg shadow-lg z-50 overflow-hidden py-1.5 text-left">
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
                  <div className="absolute right-0 top-full mt-2 w-[420px] bg-white dark:bg-slate-900 border border-border rounded-lg shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)] z-50 text-left">
                    <div className="p-4 border-b border-border">
                      <h3 className="text-[15px] font-bold text-[#0F172A] dark:text-slate-100">Filter</h3>
                    </div>
                    <div className="p-4 space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-[13px] font-bold text-slate-800 dark:text-slate-100">ID</label>
                          <div className="relative">
                            <select 
                              value={filterId}
                              onChange={(e) => setFilterId(e.target.value)}
                              className="w-full px-3 py-2 border border-border rounded-lg text-[13px] outline-none appearance-none bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 font-medium cursor-pointer"
                            >
                              <option value="">Select</option>
                              <option value="FG80482">FG80482</option>
                            </select>
                            <ChevronDown className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute right-3 top-2.5 pointer-events-none" />
                          </div>
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[13px] font-bold text-slate-800 dark:text-slate-100">Name</label>
                          <div className="relative">
                            <select 
                              value={filterName}
                              onChange={(e) => setFilterName(e.target.value)}
                              className="w-full px-3 py-2 border border-border rounded-lg text-[13px] outline-none appearance-none bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 font-medium cursor-pointer"
                            >
                              <option value="">Select Name</option>
                              <option value="Admission Fees">Admission Fees</option>
                            </select>
                            <ChevronDown className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute right-3 top-2.5 pointer-events-none" />
                          </div>
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[13px] font-bold text-slate-800 dark:text-slate-100">Fees Group</label>
                          <div className="relative">
                            <select 
                              value={filterFeesGroup}
                              onChange={(e) => setFilterFeesGroup(e.target.value)}
                              className="w-full px-3 py-2 border border-border rounded-lg text-[13px] outline-none appearance-none bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 font-medium cursor-pointer"
                            >
                              <option value="">Select Fees Group</option>
                              <option value="Tuition Fees">Tuition Fees</option>
                            </select>
                            <ChevronDown className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute right-3 top-2.5 pointer-events-none" />
                          </div>
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[13px] font-bold text-slate-800 dark:text-slate-100">Fees Type</label>
                          <div className="relative">
                            <select 
                              value={filterFeesType}
                              onChange={(e) => setFilterFeesType(e.target.value)}
                              className="w-full px-3 py-2 border border-border rounded-lg text-[13px] outline-none appearance-none bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 font-medium cursor-pointer"
                            >
                              <option value="">Select Fees Type</option>
                              <option value="Admission Fees">Admission Fees</option>
                            </select>
                            <ChevronDown className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute right-3 top-2.5 pointer-events-none" />
                          </div>
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[13px] font-bold text-slate-800 dark:text-slate-100">Status</label>
                        <div className="relative">
                          <select 
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="w-full px-3 py-2 border border-border rounded-lg text-[13px] outline-none appearance-none bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 font-medium cursor-pointer"
                          >
                            <option value="Active">Active</option>
                            <option value="Inactive">Inactive</option>
                          </select>
                          <ChevronDown className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute right-3 top-2.5 pointer-events-none" />
                        </div>
                      </div>
                    </div>
                    <div className="p-4 flex justify-end gap-3 bg-white dark:bg-slate-900 rounded-b-lg border-t border-border mt-2">
                      <button 
                        onClick={() => { setFilterId(""); setFilterName(""); setFilterFeesGroup(""); setFilterFeesType(""); setFilterStatus("Active"); }}
                        className="px-5 py-2.5 bg-[#F1F5F9] dark:bg-slate-800 hover:bg-[#E2E8F0] dark:hover:bg-slate-700 text-[#0F172A] dark:text-slate-100 text-[13px] font-bold rounded-lg transition-colors cursor-pointer"
                      >
                        Reset
                      </button>
                      <button 
                        onClick={() => setIsFilterOpen(false)}
                        className="px-5 py-2.5 bg-[#F59E0B] hover:bg-[#D97706] text-white text-[13px] font-bold rounded-lg shadow-sm transition-colors cursor-pointer"
                      >
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
                      <button 
                        key={item} 
                        onClick={() => { setSelectedSort(item); setIsSortOpen(false); }}
                        className={`w-full px-4 py-2.5 text-[14px] text-left transition-colors font-medium cursor-pointer ${item === selectedSort ? "bg-[#F59E0B] text-white" : "text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/50"}`}
                      >
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
      </div>

      {/* Add / Edit Modals */}
      <Modal isOpen={isAddOpen || isEditOpen} onClose={() => { setIsAddOpen(false); setIsEditOpen(false); }} title={isAddOpen ? "Add Fees Type" : "Edit Fees Type"} size="lg">
        <form onSubmit={isAddOpen ? handleAddSubmit : handleEditSubmit} className="p-6 space-y-5 text-left">
          
          <div className="space-y-1.5">
            <label className="text-[13px] font-bold text-slate-800 dark:text-slate-100">Name</label>
            <input 
              type="text"
              placeholder={isEditOpen ? "Enter Name" : ""}
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
              className="w-full px-4 py-2.5 text-[14px] bg-white dark:bg-slate-900 border border-border rounded-lg outline-none focus:border-[#F59E0B] transition-colors text-slate-700 dark:text-slate-200"
              required
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-[13px] font-bold text-slate-800 dark:text-slate-100">Fees Group</label>
              <Link href="/dashboard/fees-collection/fees-group" className="text-[13px] font-bold text-[#F59E0B] hover:text-[#D97706] flex items-center gap-1 transition-colors cursor-pointer">
                <Plus className="w-3 h-3" /> Add New
              </Link>
            </div>
            <div className="relative">
              <select 
                value={formFeesGroup}
                onChange={(e) => setFormFeesGroup(e.target.value)}
                className="w-full px-4 py-2.5 text-[14px] bg-white dark:bg-slate-900 border border-border rounded-lg outline-none focus:border-[#F59E0B] transition-colors text-slate-700 dark:text-slate-200 appearance-none cursor-pointer"
                required
              >
                <option value="">Select</option>
                <option value="Tuition Fees">Tuition Fees</option>
                <option value="Monthly Fees">Monthly Fees</option>
                <option value="Class 1 General">Class 1 General</option>
                <option value="Class 1 Lump Sum">Class 1 Lump Sum</option>
                <option value="Discount">Discount</option>
              </select>
              <ChevronDown className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute right-3 top-3 pointer-events-none" />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[13px] font-bold text-slate-800 dark:text-slate-100">Description</label>
            <textarea 
              rows={4}
              placeholder={isEditOpen ? "Add Comment" : ""}
              value={formDescription}
              onChange={(e) => setFormDescription(e.target.value)}
              className="w-full px-4 py-2.5 text-[14px] bg-white dark:bg-slate-900 border border-border rounded-lg outline-none focus:border-[#F59E0B] transition-colors text-slate-700 dark:text-slate-200 resize-none"
            />
          </div>

          <div className="space-y-1.5 flex items-center justify-between">
            <div>
              <label className="text-[13px] font-bold text-slate-800 dark:text-slate-100 block">Status</label>
              <span className="text-[12px] text-slate-500 dark:text-slate-400">Change the Status by toggle</span>
            </div>
            <button 
              type="button"
              onClick={() => setFormStatus(formStatus === "Active" ? "Inactive" : "Active")}
              className={`w-11 h-6 rounded-full flex items-center px-1 transition-colors ${formStatus === "Active" ? "bg-[#F59E0B]" : "bg-slate-200"}`}
            >
              <div className={`w-4 h-4 rounded-full bg-white dark:bg-slate-900 transition-transform ${formStatus === "Active" ? "translate-x-5" : "translate-x-0"}`} />
            </button>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
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
              {isAddOpen ? "Add Fees Type" : "Save Changes"}
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
