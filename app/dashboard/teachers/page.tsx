"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAppState, Teacher } from "../../context/store";
import { Modal } from "../../components/ui/modal";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Phone,
  Mail,
  User,
  GraduationCap,
  Calendar,
  BookOpen,
  Briefcase,
  ChevronDown,
  RefreshCcw,
  Printer,
  Download,
  Filter,
  Grid,
  List,
  ArrowDownAZ,
  MoreVertical,
  AlignLeft,
  Lock,
  ToggleRight,
  FileText
} from "lucide-react";

export default function TeachersPage() {
  const router = useRouter();
  const {
    activeRole,
    teachers,
    classes,
    addTeacher,
    updateTeacher,
    deleteTeacher
  } = useAppState();

  const [search, setSearch] = useState("");
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
  const [actionMenuId, setActionMenuId] = useState<string | null>(null);
  const [isLoginDetailsOpen, setIsLoginDetailsOpen] = useState(false);

  // Popover states
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isDateRangeOpen, setIsDateRangeOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to dismiss/delete this teacher?")) {
      deleteTeacher(id);
    }
  };

  const filteredTeachers = teachers.filter((t) => {
    const matchesSearch =
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.email.toLowerCase().includes(search.toLowerCase()) ||
      t.subject.toLowerCase().includes(search.toLowerCase());
    return matchesSearch;
  });

  const getClassName = (cId: string) => {
    return classes.find((c) => c.id === cId)?.name || "None / Floating";
  };

  return (
    <div className="space-y-6 -m-6 p-6 bg-[#F8FAFC] min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-left">
        <div>
          <h1 className="page-title">Teacher List</h1>
          <div className="flex items-center gap-2 text-[14px] leading-[21px] text-[#68718a] mt-1 font-normal">
            <span>Dashboard</span>
            <span>/</span>
            <span>Peoples</span>
            <span>/</span>
            <span className="text-[#202c4b]">Teacher List</span>
          </div>
        </div>

        {activeRole === "admin" && (
          <div className="flex flex-wrap items-center gap-2">
            <button className="p-2 border border-border bg-white rounded-lg text-slate-500 hover:bg-slate-50 shadow-sm transition-colors">
              <RefreshCcw className="w-4 h-4" />
            </button>
            <button className="p-2 border border-border bg-white rounded-lg text-slate-500 hover:bg-slate-50 shadow-sm transition-colors">
              <Printer className="w-4 h-4" />
            </button>
            <div className="relative">
              <button
                onClick={() => setIsExportOpen(!isExportOpen)}
                className="flex items-center gap-2 px-3 py-2 border border-border bg-white rounded-lg text-slate-600 text-[13px] font-semibold hover:bg-slate-50 shadow-sm transition-colors"
              >
                <Download className="w-4 h-4" /> Export <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>
              {isExportOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsExportOpen(false)} />
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-border rounded-lg shadow-lg z-50 overflow-hidden py-2 text-left">
                    <button className="w-full px-4 py-2.5 text-[14px] font-medium text-[#202c4b] hover:bg-slate-50 flex items-center gap-3 transition-colors">
                      <FileText className="w-4 h-4 text-slate-500" /> Export as PDF
                    </button>
                    <button className="w-full px-4 py-2.5 text-[14px] font-medium text-[#202c4b] hover:bg-slate-50 flex items-center gap-3 transition-colors">
                      <FileText className="w-4 h-4 text-slate-500" /> Export as Excel
                    </button>
                  </div>
                </>
              )}
            </div>
            <button
              onClick={() => router.push('/dashboard/teachers/add')}
              className="flex items-center gap-2 px-4 py-2 text-[13px] font-semibold text-white bg-[#5D6BEE] hover:bg-[#4b58ce] rounded-lg shadow-sm transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Teacher</span>
            </button>
          </div>
        )}
      </div>

      {/* Directory Table Card */}
      <div className="bg-white border border-border rounded-xl card-shadow overflow-hidden text-left p-5">
        {/* Top Actions in Card */}
        <div className="flex flex-col xl:flex-row items-start xl:items-center justify-between gap-4 mb-5">
          <h2 className="text-[16px] font-semibold text-[#202c4b]">Teachers List</h2>
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
              <button
                onClick={() => setIsDateRangeOpen(!isDateRangeOpen)}
                className="flex items-center gap-2 px-3 py-1.5 border border-border rounded-lg text-[13px] text-slate-600 font-medium hover:bg-slate-50 transition-colors"
              >
                <Calendar className="w-4 h-4 text-slate-400" />
                06/01/2026 - 06/07/2026
              </button>
              {isDateRangeOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsDateRangeOpen(false)} />
                  <div className="absolute left-0 top-full mt-2 w-44 bg-white border border-border rounded-lg shadow-lg z-50 overflow-hidden py-1.5 text-left">
                    {["Today", "Yesterday", "Last 7 Days", "Last 30 Days", "This Year", "Next Year", "Custom Range"].map((item) => (
                      <button key={item} className={`w-full px-4 py-2 text-[13px] text-left transition-colors ${item === "Last 7 Days" ? "bg-[#5D6BEE] text-white font-semibold" : "text-slate-600 hover:bg-slate-50"}`}>
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
                className="flex items-center gap-2 px-3 py-1.5 border border-border rounded-lg text-[13px] text-slate-600 font-medium hover:bg-slate-50 transition-colors"
              >
                <Filter className="w-4 h-4 text-slate-400" />
                Filter <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>
              {isFilterOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsFilterOpen(false)} />
                  <div className="absolute right-0 sm:left-0 sm:right-auto top-full mt-2 w-64 bg-white border border-border rounded-lg shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)] z-50 text-left">
                    <div className="p-4 border-b border-border">
                      <h3 className="text-[15px] font-bold text-[#202c4b]">Filter</h3>
                    </div>
                    <div className="p-4 space-y-4">
                      <div className="space-y-1.5">
                        <label className="text-[13px] font-semibold text-[#202c4b]">Class</label>
                        <div className="relative">
                          <select className="w-full px-3 py-2 border border-border rounded-lg text-[13px] outline-none appearance-none bg-white text-slate-600 font-medium">
                            <option>I</option>
                            <option>II</option>
                          </select>
                          <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-2.5 pointer-events-none" />
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[13px] font-semibold text-[#202c4b]">Section</label>
                        <div className="relative">
                          <select className="w-full px-3 py-2 border border-border rounded-lg text-[13px] outline-none appearance-none bg-white text-slate-600 font-medium">
                            <option>A</option>
                            <option>B</option>
                          </select>
                          <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-2.5 pointer-events-none" />
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[13px] font-semibold text-[#202c4b]">Status</label>
                        <div className="relative">
                          <select className="w-full px-3 py-2 border border-border rounded-lg text-[13px] outline-none appearance-none bg-white text-slate-600 font-medium">
                            <option>Active</option>
                            <option>Inactive</option>
                          </select>
                          <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-2.5 pointer-events-none" />
                        </div>
                      </div>
                    </div>
                    <div className="p-4 flex justify-end gap-3 bg-white rounded-b-lg pt-2">
                      <button className="px-5 py-2.5 bg-[#F1F5F9] hover:bg-[#E2E8F0] text-[#202c4b] text-[13px] font-bold rounded-lg transition-colors">
                        Reset
                      </button>
                      <button className="px-5 py-2.5 bg-[#5D6BEE] hover:bg-[#4b58ce] text-white text-[13px] font-bold rounded-lg shadow-sm transition-colors">
                        Apply
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>

            <div className="flex items-center border border-border rounded-lg p-0.5 bg-slate-50">
              <button className="p-1.5 bg-[#5D6BEE] text-white rounded shadow-sm transition-colors cursor-pointer"><List className="w-4 h-4" /></button>
              <button className="p-1.5 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"><Grid className="w-4 h-4" /></button>
            </div>

            <div className="relative">
              <button
                onClick={() => setIsSortOpen(!isSortOpen)}
                className="flex items-center gap-2 px-3 py-1.5 border border-border rounded-lg text-[13px] text-slate-600 font-medium hover:bg-slate-50 transition-colors"
              >
                <ArrowDownAZ className="w-4 h-4 text-slate-400" />
                Sort by A-Z <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>
              {isSortOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsSortOpen(false)} />
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-border rounded-lg shadow-lg z-50 overflow-hidden py-1.5 text-left">
                    {["Ascending", "Descending", "Recently Viewed", "Recently Added"].map((item) => (
                      <button key={item} className="w-full px-4 py-2.5 text-[14px] text-slate-700 hover:bg-slate-50 text-left transition-colors font-medium">
                        {item}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Rows and Search */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5 border-b border-border pb-5">
          <div className="flex items-center gap-2 text-[13px] text-slate-500 font-medium">
            <span>Row Per Page</span>
            <select className="border border-border rounded-md px-2 py-1 outline-none text-slate-700 bg-white font-semibold cursor-pointer">
              <option>10</option>
            </select>
            <span>Entries</span>
          </div>
          <div className="relative w-full sm:w-64">
            <input
              type="text"
              placeholder="Search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-lg text-[13px] text-slate-700 outline-none focus:border-[#5D6BEE]/50 focus:ring-2 focus:ring-[#5D6BEE]/10 transition-all bg-white"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left text-[13px] min-w-[1000px]">
            <thead className="text-slate-900 font-semibold bg-white border-b border-border">
              <tr>
                <th className="px-4 py-4 w-12"><input type="checkbox" className="rounded border-slate-300 w-4 h-4 text-[#5D6BEE] cursor-pointer" /></th>
                <th className="px-4 py-4 cursor-pointer whitespace-nowrap">ID <span className="text-[10px] text-slate-400 ml-1">⇅</span></th>
                <th className="px-4 py-4 cursor-pointer whitespace-nowrap">Name <span className="text-[10px] text-slate-400 ml-1">⇅</span></th>
                <th className="px-4 py-4 cursor-pointer whitespace-nowrap">Class <span className="text-[10px] text-slate-400 ml-1">⇅</span></th>
                <th className="px-4 py-4 cursor-pointer whitespace-nowrap">Subject <span className="text-[10px] text-slate-400 ml-1">⇅</span></th>
                <th className="px-4 py-4 cursor-pointer whitespace-nowrap">Email <span className="text-[10px] text-slate-400 ml-1">⇅</span></th>
                <th className="px-4 py-4 cursor-pointer whitespace-nowrap">Phone <span className="text-[10px] text-slate-400 ml-1">⇅</span></th>
                <th className="px-4 py-4 cursor-pointer whitespace-nowrap">Date of Join <span className="text-[10px] text-slate-400 ml-1">⇅</span></th>
                <th className="px-4 py-4 cursor-pointer whitespace-nowrap">Status <span className="text-[10px] text-slate-400 ml-1">⇅</span></th>
                <th className="px-4 py-4 text-center cursor-pointer whitespace-nowrap">Action <span className="text-[10px] text-slate-400 ml-1">⇅</span></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border text-slate-600 font-medium">
              {filteredTeachers.length === 0 ? (
                <tr>
                  <td colSpan={10} className="px-4 py-12 text-center text-slate-500">
                    No faculty records matching filter.
                  </td>
                </tr>
              ) : (
                filteredTeachers.map((teacher, i) => {
                  // Generate an ID if needed for visual
                  const displayId = `T8491${27 - i}`;
                  // Hardcode some data to match the screenshot look
                  const mockPhone = "+1 82392 37359";
                  const mockJoinDate = teacher.joinedDate || "25 Mar 2024";

                  return (
                    <tr
                      key={teacher.id}
                      className="hover:bg-slate-50/50 transition-colors group cursor-pointer"
                      onClick={() => router.push(`/dashboard/teachers/${teacher.id}`)}
                    >
                      <td className="px-4 py-4" onClick={(e) => e.stopPropagation()}>
                        <input type="checkbox" className="rounded border-slate-300 w-4 h-4 text-[#5D6BEE] cursor-pointer" />
                      </td>
                      <td className="px-4 py-4 font-semibold text-[#5D6BEE] cursor-pointer hover:underline">{displayId}</td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <img src="/asset 7.webp" className="w-8 h-8 rounded-full object-cover border border-slate-200" alt={teacher.name} />
                          <span className="font-medium text-slate-900 group-hover:text-[#5D6BEE] transition-colors cursor-pointer">{teacher.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-slate-600">{getClassName(teacher.classId)}</td>
                      <td className="px-4 py-4 text-slate-600">{teacher.subject}</td>
                      <td className="px-4 py-4 text-slate-600">{teacher.email.toLowerCase()}</td>
                      <td className="px-4 py-4 whitespace-nowrap text-slate-600">{mockPhone}</td>
                      <td className="px-4 py-4 whitespace-nowrap text-slate-600">{mockJoinDate}</td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-[11px] font-bold ${teacher.status === "Active"
                            ? "bg-[#E8F8E8] text-[#1D7F2C]"
                            : "bg-[#FFEBEB] text-[#E02424]"
                            }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${teacher.status === "Active" ? "bg-[#1DD04A]" : "bg-[#E02424]"
                              }`}
                          />
                          {teacher.status}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-center relative" onClick={(e) => e.stopPropagation()}>
                        <div className="flex justify-center">
                          <button
                            onClick={() => setActionMenuId(actionMenuId === teacher.id ? null : teacher.id)}
                            className={`p-1.5 rounded-lg transition-colors ${actionMenuId === teacher.id ? "bg-[#5D6BEE] text-white" : "hover:bg-slate-100 text-slate-400"}`}
                          >
                            <MoreVertical className="w-4 h-4" />
                          </button>
                        </div>
                        {actionMenuId === teacher.id && (
                          <>
                            <div className="fixed inset-0 z-40" onClick={(e) => { e.stopPropagation(); setActionMenuId(null); }} />
                            <div className="absolute right-12 top-10 w-44 bg-white border border-border rounded-xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)] z-50 overflow-hidden py-2 text-left">
                              <button onClick={() => { router.push(`/dashboard/teachers/${teacher.id}`); setActionMenuId(null); }} className="w-full px-4 py-2.5 text-[14px] text-[#202c4b] hover:bg-slate-50 flex items-center gap-3 font-medium transition-colors">
                                <AlignLeft className="w-4 h-4 text-[#202c4b]" /> View Teacher
                              </button>
                              <button onClick={() => { router.push(`/dashboard/teachers/${teacher.id}/edit`); setActionMenuId(null); }} className="w-full px-4 py-2.5 text-[14px] text-[#202c4b] hover:bg-slate-50 flex items-center gap-3 font-medium transition-colors">
                                <Edit className="w-4 h-4 text-[#202c4b]" /> Edit
                              </button>
                              <button onClick={() => { setSelectedTeacher(teacher); setIsLoginDetailsOpen(true); setActionMenuId(null); }} className="w-full px-4 py-2.5 text-[14px] text-[#202c4b] hover:bg-slate-50 flex items-center gap-3 font-medium transition-colors">
                                <Lock className="w-4 h-4 text-[#202c4b]" /> Login Details
                              </button>
                              <button onClick={() => { setActionMenuId(null); }} className="w-full px-4 py-2.5 text-[14px] text-[#202c4b] hover:bg-slate-50 flex items-center gap-3 font-medium transition-colors">
                                <ToggleRight className="w-4 h-4 text-[#202c4b]" /> Disable
                              </button>
                              <button onClick={() => { handleDelete(teacher.id); setActionMenuId(null); }} className="w-full px-4 py-2.5 text-[14px] text-[#202c4b] hover:bg-slate-50 flex items-center gap-3 font-medium transition-colors">
                                <Trash2 className="w-4 h-4 text-[#202c4b]" /> Delete
                              </button>
                            </div>
                          </>
                        )}
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination placeholder matching the design */}
        <div className="mt-5 pt-5 border-t border-border flex items-center justify-end gap-2 text-[13px] font-medium text-slate-500">
          <button className="px-2 py-1 hover:text-slate-800 transition-colors">Prev</button>
          <button className="w-7 h-7 rounded bg-[#5D6BEE] text-white flex items-center justify-center font-semibold">1</button>
          <button className="w-7 h-7 rounded hover:bg-slate-100 text-slate-700 flex items-center justify-center transition-colors">2</button>
          <button className="px-2 py-1 hover:text-slate-800 transition-colors">Next</button>
        </div>
      </div>



      {/* ----------------------------------------------------
          LOGIN DETAILS MODAL
          ---------------------------------------------------- */}
      <Modal isOpen={isLoginDetailsOpen} onClose={() => setIsLoginDetailsOpen(false)} title="Login Details">
        {selectedTeacher && (
          <div className="space-y-6 text-left">
            <div className="flex justify-center mb-6 mt-4">
              <div className="flex items-center gap-3">
                <img src="/asset 7.webp" className="w-10 h-10 rounded-lg object-cover" alt="Teacher" />
                <div className="text-left">
                  <p className="font-semibold text-[#202c4b]">{selectedTeacher.name}</p>
                  <p className="text-[13px] font-medium text-slate-500">{getClassName(selectedTeacher.classId)}</p>
                </div>
              </div>
            </div>

            <div className="border border-border rounded-lg overflow-hidden">
              <table className="w-full text-left text-[13px]">
                <thead className="bg-[#F8FAFC] text-slate-700 border-b border-border">
                  <tr>
                    <th className="px-4 py-3 font-semibold">User Type <span className="text-[10px] text-slate-400 ml-1">⇅</span></th>
                    <th className="px-4 py-3 font-semibold">User Name <span className="text-[10px] text-slate-400 ml-1">⇅</span></th>
                    <th className="px-4 py-3 font-semibold">Password <span className="text-[10px] text-slate-400 ml-1">⇅</span></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border text-slate-600 font-medium">
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
                className="px-5 py-2.5 bg-[#F1F5F9] hover:bg-[#E2E8F0] text-[#202c4b] text-[14px] font-semibold rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
