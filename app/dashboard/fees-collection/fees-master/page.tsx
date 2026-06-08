"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  Search, List, Grid, MoreVertical, Edit, Trash2, Plus,
  Calendar, Filter, ChevronDown, RefreshCw, Printer, Download, FileText
} from "lucide-react";
import { Modal } from "../../../components/ui/modal";
import { DataTable, ColumnDef } from "@/app/components/ui/data-table";

interface FeesMaster {
  id: string; // Database ID
  displayId: string;
  feesGroup: string;
  feesType: string;
  dueDate: string;
  amount: number;
  fineType: "None" | "Percentage" | "Fixed";
  fineAmount: number;
  status: "Active" | "Inactive";
}

const mockFeesMasterData: FeesMaster[] = [
  { id: "1", displayId: "FG80482", feesGroup: "Admission-Fees", feesType: "Tuition Fees", dueDate: "30 Jan 2025", amount: 1250, fineType: "None", fineAmount: 200, status: "Active" },
  { id: "2", displayId: "FG80481", feesGroup: "Class 1 General", feesType: "Monthly Fees", dueDate: "12 May 2025", amount: 250, fineType: "Percentage", fineAmount: 300, status: "Active" },
  { id: "3", displayId: "FG80481", feesGroup: "Monthly Fees", feesType: "Admission Fees", dueDate: "12 May 2025", amount: 250, fineType: "Percentage", fineAmount: 300, status: "Active" },
  { id: "4", displayId: "FG80481", feesGroup: "Class 1 Lump Sum", feesType: "Bus Fees", dueDate: "12 May 2025", amount: 250, fineType: "Percentage", fineAmount: 300, status: "Active" },
  { id: "5", displayId: "FG80481", feesGroup: "Class 1-I Installment", feesType: "Monthly Fees", dueDate: "12 May 2025", amount: 250, fineType: "Fixed", fineAmount: 300, status: "Active" },
  { id: "6", displayId: "FG80481", feesGroup: "Class 1-II Installment", feesType: "Monthly Fees", dueDate: "12 May 2025", amount: 250, fineType: "Percentage", fineAmount: 300, status: "Inactive" },
  { id: "7", displayId: "FG80481", feesGroup: "Discount", feesType: "Topper Discount", dueDate: "12 May 2025", amount: 250, fineType: "None", fineAmount: 300, status: "Inactive" },
  { id: "8", displayId: "FG80481", feesGroup: "Class 3-I Installment", feesType: "3rd-Installment Fees", dueDate: "12 May 2025", amount: 250, fineType: "None", fineAmount: 300, status: "Active" },
  { id: "9", displayId: "FG80481", feesGroup: "Class 2-I Installment", feesType: "3rd-Installment Fees", dueDate: "12 May 2025", amount: 250, fineType: "Fixed", fineAmount: 300, status: "Active" },
  { id: "10", displayId: "FG80481", feesGroup: "Class 4-I Installment", feesType: "3rd Installment Fees", dueDate: "12 May 2025", amount: 250, fineType: "Fixed", fineAmount: 300, status: "Active" },
];

export default function FeesMasterPage() {
  const [feesMasterData, setFeesMasterData] = useState<FeesMaster[]>(mockFeesMasterData);
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
  
  const [selectedMaster, setSelectedMaster] = useState<FeesMaster | null>(null);
  const [actionMenuId, setActionMenuId] = useState<string | null>(null);

  // Form states
  const [formFeesGroup, setFormFeesGroup] = useState("");
  const [formFeesType, setFormFeesType] = useState("");
  const [formDueDate, setFormDueDate] = useState("");
  const [formAmount, setFormAmount] = useState("");
  const [formFineType, setFormFineType] = useState<"None" | "Percentage" | "Fixed">("None");
  const [formStatus, setFormStatus] = useState<"Active" | "Inactive">("Active");

  // Filter States
  const [filterId, setFilterId] = useState("");
  const [filterFeesGroup, setFilterFeesGroup] = useState("");
  const [filterFeesType, setFilterFeesType] = useState("");
  const [filterDueDate, setFilterDueDate] = useState("");
  const [filterFineType, setFilterFineType] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  const openAddModal = () => {
    setFormFeesGroup("");
    setFormFeesType("");
    setFormDueDate("");
    setFormAmount("");
    setFormFineType("None");
    setFormStatus("Active");
    setIsAddOpen(true);
  };

  const openEditModal = (item: FeesMaster) => {
    setSelectedMaster(item);
    setFormFeesGroup(item.feesGroup);
    setFormFeesType(item.feesType);
    setFormDueDate(item.dueDate);
    setFormAmount(item.amount.toString());
    setFormFineType(item.fineType);
    setFormStatus(item.status);
    setIsEditOpen(true);
    setActionMenuId(null);
  };

  const openDeleteModal = (item: FeesMaster) => {
    setSelectedMaster(item);
    setIsDeleteOpen(true);
    setActionMenuId(null);
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newItem: FeesMaster = {
      id: Math.random().toString(),
      displayId: `FG80${Math.floor(100 + Math.random() * 900)}`,
      feesGroup: formFeesGroup,
      feesType: formFeesType,
      dueDate: formDueDate,
      amount: parseFloat(formAmount) || 0,
      fineType: formFineType,
      fineAmount: 300, // Hardcoded for mockup
      status: formStatus,
    };
    setFeesMasterData([newItem, ...feesMasterData]);
    setIsAddOpen(false);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedMaster) {
      setFeesMasterData(feesMasterData.map(s => 
        s.id === selectedMaster.id 
          ? { 
              ...s, 
              feesGroup: formFeesGroup, 
              feesType: formFeesType, 
              dueDate: formDueDate, 
              amount: parseFloat(formAmount) || 0, 
              fineType: formFineType, 
              status: formStatus 
            }
          : s
      ));
    }
    setIsEditOpen(false);
  };

  const handleDeleteConfirm = () => {
    if (selectedMaster) {
      setFeesMasterData(feesMasterData.filter(s => s.id !== selectedMaster.id));
    }
    setIsDeleteOpen(false);
  };

  const filteredData = feesMasterData.filter(s => {
    const matchesSearch = s.feesGroup.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          s.displayId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          s.feesType.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Additional filters can be applied here
    return matchesSearch;
  });

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
            <span className="text-slate-900 dark:text-white font-medium">Fees Master</span>
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
            <Plus className="w-4 h-4" /> Add Fees Master
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
                  <div className="absolute right-0 sm:left-0 top-full mt-2 w-44 bg-white dark:bg-slate-900 border border-border rounded-lg shadow-lg z-50 overflow-hidden py-1.5 text-left">
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
                  <div className="absolute right-0 sm:left-0 sm:right-auto top-full mt-2 w-80 bg-white dark:bg-slate-900 border border-border rounded-lg shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)] z-50 text-left">
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
                              <option value="">Select ID</option>
                              <option value="FG80482">FG80482</option>
                              <option value="FG80481">FG80481</option>
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
                              <option value="">Select Fees Gr...</option>
                              <option value="Admission-Fees">Admission-Fees</option>
                              <option value="Monthly Fees">Monthly Fees</option>
                            </select>
                            <ChevronDown className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute right-3 top-2.5 pointer-events-none" />
                          </div>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-[13px] font-bold text-slate-800 dark:text-slate-100">Fees Type</label>
                          <div className="relative">
                            <select 
                              value={filterFeesType}
                              onChange={(e) => setFilterFeesType(e.target.value)}
                              className="w-full px-3 py-2 border border-border rounded-lg text-[13px] outline-none appearance-none bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 font-medium cursor-pointer"
                            >
                              <option value="">Select Fees Ty...</option>
                              <option value="Tuition Fees">Tuition Fees</option>
                              <option value="Monthly Fees">Monthly Fees</option>
                            </select>
                            <ChevronDown className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute right-3 top-2.5 pointer-events-none" />
                          </div>
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[13px] font-bold text-slate-800 dark:text-slate-100">Due Date</label>
                          <div className="relative">
                            <select 
                              value={filterDueDate}
                              onChange={(e) => setFilterDueDate(e.target.value)}
                              className="w-full px-3 py-2 border border-border rounded-lg text-[13px] outline-none appearance-none bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 font-medium cursor-pointer"
                            >
                              <option value="">Select Due Date</option>
                              <option value="30 Jan 2025">30 Jan 2025</option>
                              <option value="12 May 2025">12 May 2025</option>
                            </select>
                            <ChevronDown className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute right-3 top-2.5 pointer-events-none" />
                          </div>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-[13px] font-bold text-slate-800 dark:text-slate-100">Fine Type</label>
                          <div className="relative">
                            <select 
                              value={filterFineType}
                              onChange={(e) => setFilterFineType(e.target.value)}
                              className="w-full px-3 py-2 border border-border rounded-lg text-[13px] outline-none appearance-none bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 font-medium cursor-pointer"
                            >
                              <option value="">Select Fine Ty...</option>
                              <option value="None">None</option>
                              <option value="Percentage">Percentage</option>
                              <option value="Fixed">Fixed</option>
                            </select>
                            <ChevronDown className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute right-3 top-2.5 pointer-events-none" />
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
                              <option value="">Select Status</option>
                              <option value="Active">Active</option>
                              <option value="Inactive">Inactive</option>
                            </select>
                            <ChevronDown className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute right-3 top-2.5 pointer-events-none" />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="p-4 flex justify-end gap-3 bg-white dark:bg-slate-900 rounded-b-lg border-t border-border mt-2">
                      <button 
                        onClick={() => { 
                          setFilterId(""); setFilterFeesGroup(""); setFilterFeesType("");
                          setFilterDueDate(""); setFilterFineType(""); setFilterStatus(""); 
                        }}
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
        <DataTable 
          columns={[
            { header: "ID", accessorKey: "displayId", render: (item) => (
              <button className="font-semibold text-[#F59E0B] hover:text-[#D97706] transition-colors cursor-pointer">
                {item.displayId}
              </button>
            )},
            { header: "Fees Group", accessorKey: "feesGroup" },
            { header: "Fees Type", accessorKey: "feesType" },
            { header: "Due Date", accessorKey: "dueDate" },
            { header: "Amount ($)", accessorKey: "amount" },
            { header: "Fine Type", accessorKey: "fineType", render: (item) => (
              <>
                {item.fineType === 'None' && (
                  <span className="inline-flex px-2 py-1 rounded text-[11px] font-bold bg-amber-50 text-amber-600">
                    None
                  </span>
                )}
                {item.fineType === 'Percentage' && (
                  <span className="inline-flex px-2 py-1 rounded text-[11px] font-bold bg-blue-50 text-blue-600">
                    Percentage
                  </span>
                )}
                {item.fineType === 'Fixed' && (
                  <span className="inline-flex px-2 py-1 rounded text-[11px] font-bold bg-rose-50 text-rose-600">
                    Fixed
                  </span>
                )}
              </>
            )},
            { header: "Fine Amount ($)", accessorKey: "fineAmount" },
            { header: "Status", accessorKey: "status", render: (item) => (
                item.status === 'Active' ? (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[12px] font-semibold bg-emerald-50 text-emerald-600 border border-emerald-100">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    Active
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[12px] font-semibold bg-rose-50 text-rose-600 border border-rose-100">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                    Inactive
                  </span>
                )
            )},
            { header: "Action", sortable: false, className: "text-center w-20", render: (item) => (
              <div className="relative" onClick={(e) => e.stopPropagation()}>
                <button 
                  onClick={() => setActionMenuId(actionMenuId === item.id ? null : item.id)}
                  className={`p-1.5 rounded-lg transition-colors cursor-pointer ${actionMenuId === item.id ? "bg-[#F59E0B] text-white" : "hover:bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500"}`}
                >
                  <MoreVertical className="w-4 h-4" />
                </button>
                {actionMenuId === item.id && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={(e) => { e.stopPropagation(); setActionMenuId(null); }} />
                    <div className="absolute right-10 top-0 w-36 bg-white dark:bg-slate-900 border border-border rounded-xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)] z-50 py-2 text-left">
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
        title={
          <div className="flex items-center gap-2">
            {isAddOpen ? "Add Fees Master" : "Edit Fees Master"}
            <span className="text-[12px] bg-blue-100 text-[#F59E0B] px-2 py-0.5 rounded font-semibold">2024 - 2025</span>
          </div>
        }
      >
        <form onSubmit={isAddOpen ? handleAddSubmit : handleEditSubmit} className="p-6 space-y-5 text-left">
          
          <div className="space-y-1.5">
            <label className="text-[13px] font-bold text-slate-800 dark:text-slate-100">Fees Group</label>
            <div className="relative">
              <select 
                value={formFeesGroup}
                onChange={(e) => setFormFeesGroup(e.target.value)}
                className="w-full px-4 py-2.5 text-[14px] bg-white dark:bg-slate-900 border border-border rounded-lg outline-none appearance-none focus:border-[#F59E0B] transition-colors text-slate-700 dark:text-slate-200 cursor-pointer"
                required
              >
                <option value="">Select</option>
                <option value="Admission-Fees">Admission-Fees</option>
                <option value="Monthly Fees">Monthly Fees</option>
              </select>
              <ChevronDown className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute right-4 top-3 pointer-events-none" />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[13px] font-bold text-slate-800 dark:text-slate-100">Fees Type</label>
            <div className="relative">
              <select 
                value={formFeesType}
                onChange={(e) => setFormFeesType(e.target.value)}
                className="w-full px-4 py-2.5 text-[14px] bg-white dark:bg-slate-900 border border-border rounded-lg outline-none appearance-none focus:border-[#F59E0B] transition-colors text-slate-700 dark:text-slate-200 cursor-pointer"
                required
              >
                <option value="">Select</option>
                <option value="Tuition Fees">Tuition Fees</option>
                <option value="Monthly Fees">Monthly Fees</option>
              </select>
              <ChevronDown className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute right-4 top-3 pointer-events-none" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[13px] font-bold text-slate-800 dark:text-slate-100">Due Date</label>
              <div className="relative">
                <input 
                  type="date"
                  value={formDueDate}
                  onChange={(e) => setFormDueDate(e.target.value)}
                  className="w-full px-4 py-2.5 text-[14px] bg-white dark:bg-slate-900 border border-border rounded-lg outline-none focus:border-[#F59E0B] transition-colors text-slate-700 dark:text-slate-200"
                  required
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-[13px] font-bold text-slate-800 dark:text-slate-100">Amount</label>
              <input 
                type="text"
                placeholder={isEditOpen ? "$500" : ""}
                value={formAmount}
                onChange={(e) => setFormAmount(e.target.value)}
                className="w-full px-4 py-2.5 text-[14px] bg-white dark:bg-slate-900 border border-border rounded-lg outline-none focus:border-[#F59E0B] transition-colors text-slate-700 dark:text-slate-200"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[13px] font-bold text-slate-800 dark:text-slate-100">Fine Type</label>
            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${formFineType === "None" ? "border-[#F59E0B]" : "border-slate-300"}`}>
                  {formFineType === "None" && <div className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]" />}
                </div>
                <span className="text-[14px] text-slate-700 dark:text-slate-200">None</span>
                <input type="radio" className="hidden" checked={formFineType === "None"} onChange={() => setFormFineType("None")} />
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${formFineType === "Percentage" ? "border-[#F59E0B]" : "border-slate-300"}`}>
                  {formFineType === "Percentage" && <div className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]" />}
                </div>
                <span className="text-[14px] text-slate-700 dark:text-slate-200">Percentage</span>
                <input type="radio" className="hidden" checked={formFineType === "Percentage"} onChange={() => setFormFineType("Percentage")} />
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${formFineType === "Fixed" ? "border-[#F59E0B]" : "border-slate-300"}`}>
                  {formFineType === "Fixed" && <div className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]" />}
                </div>
                <span className="text-[14px] text-slate-700 dark:text-slate-200">Fixed</span>
                <input type="radio" className="hidden" checked={formFineType === "Fixed"} onChange={() => setFormFineType("Fixed")} />
              </label>
            </div>
          </div>

          <div className="space-y-1.5 flex items-center justify-between mt-2">
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
              {isAddOpen ? "Add Fees Master" : "Save Changes"}
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
