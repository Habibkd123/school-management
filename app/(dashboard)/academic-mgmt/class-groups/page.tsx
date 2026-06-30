"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  Plus, Search, RefreshCcw, Trash2, Loader2, AlertCircle, Layers, GraduationCap, X
} from "lucide-react";
import { Modal } from "@/app/components/ui/modal";
import { DataTable, ColumnDef } from "@/app/components/ui/data-table";
import { useClassGroups, ApiClassGroup } from "@/app/hooks/useClassGroups";
import { useClasses } from "@/app/hooks/useClasses";
import { useStreams } from "@/app/hooks/useStreams";
import { useSections } from "@/app/hooks/useSections";
import { useAcademicConfig } from "@/app/hooks/useAcademicConfig";
import { useAppState } from "@/app/context/store";
import { useAuth } from "@/app/context/auth";

interface ClassRowInput {
  id: string; // random local id for react keys
  class_id: string;
  stream_id: string;
  section_id: string;
}

export default function ClassGroupsPage() {
  const { user } = useAuth();
  const isAdmin = user?.role === "school_admin" || user?.role === "super_admin";
  const { academicYear } = useAppState();
  const { enableStreams, enableSections } = useAcademicConfig();

  const { groups, isLoading, error, fetchGroups, createGroup, deleteGroup } = useClassGroups({
    skip: false,
    academicYear
  });

  const { classes } = useClasses({ filterByYear: true });
  const { streams } = useStreams({ skip: !enableStreams });
  const { sections } = useSections({ skip: !enableSections });

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selected, setSelected] = useState<ApiClassGroup | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // Form State
  const [formName, setFormName] = useState("");
  const [formYear, setFormYear] = useState(academicYear);
  const [classRows, setClassRows] = useState<ClassRowInput[]>([
    { id: Math.random().toString(), class_id: "", stream_id: "", section_id: "" }
  ]);
  const [selectedSubGroups, setSelectedSubGroups] = useState<string[]>([]);

  useEffect(() => {
    setFormYear(academicYear);
  }, [academicYear]);

  const doFetch = useCallback(() => {
    fetchGroups({ academic_year: academicYear });
  }, [fetchGroups, academicYear]);

  const resetForm = () => {
    setFormName("");
    setFormYear(academicYear);
    setFormError("");
    setClassRows([{ id: Math.random().toString(), class_id: "", stream_id: "", section_id: "" }]);
    setSelectedSubGroups([]);
  };

  const addClassRow = () => {
    setClassRows(prev => [
      ...prev,
      { id: Math.random().toString(), class_id: "", stream_id: "", section_id: "" }
    ]);
  };

  const removeClassRow = (id: string) => {
    setClassRows(prev => prev.filter(r => r.id !== id));
  };

  const updateClassRow = (id: string, field: keyof ClassRowInput, value: string) => {
    setClassRows(prev => prev.map(r => {
      if (r.id !== id) return r;
      
      const updatedRow = { ...r, [field]: value };
      
      // Auto stream/section behavior on class select
      if (field === "class_id") {
        const selectedClass = classes.find(c => c._id === value);
        if (!selectedClass) {
          updatedRow.stream_id = "";
          updatedRow.section_id = "";
        } else {
          // Auto stream selection for Class 11/12
          if (enableStreams) {
            const isHigherClass = selectedClass.name.startsWith("Class 11") || selectedClass.name.startsWith("Class 12");
            if (isHigherClass) {
              const activeStreams = streams.filter(s => s.status === "Active");
              let foundStreamId = "";
              for (const stream of activeStreams) {
                const escapedStreamName = stream.name.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
                const regex = new RegExp(`\\b${escapedStreamName}\\b`, 'i');
                if (regex.test(selectedClass.name)) {
                  foundStreamId = stream._id;
                  break;
                }
              }
              updatedRow.stream_id = foundStreamId;
            } else {
              updatedRow.stream_id = "";
            }
          } else {
            updatedRow.stream_id = "";
          }

          // Auto section selection based on class section
          if (enableSections && sections.length > 0 && selectedClass.section) {
            const matchedSec = sections.find(s => s.name.toLowerCase() === selectedClass.section.toLowerCase());
            updatedRow.section_id = matchedSec ? matchedSec._id : "";
          } else {
            updatedRow.section_id = "";
          }
        }
      }
      return updatedRow;
    }));
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) { setFormError("Group name is required."); return; }
    if (!formYear.trim()) { setFormError("Academic year is required."); return; }
    
    // Validate classes or sub_groups
    const validClasses = classRows.filter(r => r.class_id);
    if (validClasses.length === 0 && selectedSubGroups.length === 0) {
      setFormError("At least one class or sub-group must be added to the group."); return;
    }

    setSubmitting(true);
    const res = await createGroup({
      name: formName.trim(),
      academic_year: formYear,
      classes: validClasses.map(r => ({
        class_id: r.class_id,
        stream_id: r.stream_id || null,
        section_id: r.section_id || null,
      })),
      sub_groups: selectedSubGroups
    });
    setSubmitting(false);

    if (res.success) {
      setIsAddOpen(false);
      resetForm();
      doFetch();
    } else {
      setFormError(res.message);
    }
  };

  const handleDelete = async () => {
    if (!selected) return;
    setSubmitting(true);
    const res = await deleteGroup(selected._id, academicYear);
    setSubmitting(false);
    setIsDeleteOpen(false);
    doFetch();
  };

  // Filter groups by search query
  const filteredGroups = groups.filter(g => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      g.name.toLowerCase().includes(q) ||
      g.classes.some((c: any) => 
        (typeof c.class_id === "object" && c.class_id?.name?.toLowerCase().includes(q))
      )
    );
  });

  const columns: ColumnDef<ApiClassGroup>[] = [
    {
      header: "Group Name", accessorKey: "name", render: (g) => (
        <span className="font-semibold text-slate-800 dark:text-slate-200">{g.name}</span>
      )
    },
    {
      header: "Academic Year", accessorKey: "academic_year", render: (g) => (
        <span className="font-mono text-[12px] bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-slate-600 dark:text-slate-300">{g.academic_year}</span>
      )
    },
    {
      header: "Included Classes & Sections", accessorKey: "classes", render: (g) => (
        <div className="flex flex-wrap gap-1.5 max-w-[500px]">
          {g.classes.map((c: any, index: number) => {
            const className = typeof c.class_id === "object" ? c.class_id.name : "Unknown Class";
            const sectionName = c.section_id && typeof c.section_id === "object" ? c.section_id.name : "";
            const streamName = c.stream_id && typeof c.stream_id === "object" ? c.stream_id.name : "";
            
            let label = className;
            if (streamName) label += ` (${streamName})`;
            if (sectionName) label += ` - Sec ${sectionName}`;

            return (
              <span key={index} className="inline-flex items-center gap-1 text-[11px] font-medium bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 px-2.5 py-1 rounded-md border border-indigo-100 dark:border-indigo-900/20">
                <GraduationCap className="w-3 h-3 text-indigo-500" />
                {label}
              </span>
            );
          })}
        </div>
      )
    },
    {
      header: "Nested Sub-groups", accessorKey: "sub_groups", render: (g) => (
        <div className="flex flex-wrap gap-1.5 max-w-[300px]">
          {g.sub_groups && g.sub_groups.length > 0 ? (
            g.sub_groups.map((sg: any, idx: number) => {
              const sgName = typeof sg === "object" ? sg.name : "Subgroup";
              return (
                <span key={idx} className="inline-flex items-center gap-1 text-[11px] font-semibold bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded-md border border-emerald-100 dark:border-emerald-900/20">
                  <Layers className="w-3 h-3 text-emerald-500" />
                  {sgName}
                </span>
              );
            })
          ) : (
            <span className="text-slate-400 text-xs italic">None</span>
          )}
        </div>
      )
    },
    ...(isAdmin ? [{
      header: "Action", sortable: false,
      render: (g: ApiClassGroup) => (
        <button onClick={() => { setSelected(g); setIsDeleteOpen(true); }}
          className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors">
          <Trash2 className="w-4 h-4" />
        </button>
      ),
    } as ColumnDef<ApiClassGroup>] : []),
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-left">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">Class Groups</h1>
          <div className="flex items-center gap-2 text-[13px] text-slate-500 dark:text-slate-400 mt-1">
            <span>Academic Management</span><span>/</span>
            <span className="text-slate-900 dark:text-white font-medium">Class Groups</span>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button onClick={doFetch} className="p-2 border border-border rounded-lg bg-white dark:bg-slate-900 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800/50 shadow-sm dark:text-slate-400">
            <RefreshCcw className="w-4 h-4" />
          </button>
          {isAdmin && (
            <button onClick={() => { resetForm(); setIsAddOpen(true); }}
              className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-[#d68600] text-white text-[13px] font-bold rounded-lg shadow-sm transition-colors">
              <Plus className="w-4 h-4" /><span>Add Class Group</span>
            </button>
          )}
        </div>
      </div>

      {/* List Card */}
      <div className="bg-white dark:bg-slate-900 border border-border rounded-xl card-shadow">
        <div className="p-5 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-left">
          <h3 className="text-[16px] font-bold text-slate-900 dark:text-white">
            Class Groups List {!isLoading && <span className="ml-2 text-[13px] font-normal text-slate-400">({filteredGroups.length})</span>}
          </h3>
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input type="text" placeholder="Search groups..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-3 py-2 border border-border rounded-lg text-[13px] outline-none w-full sm:w-56 focus:border-primary/50 transition-colors shadow-sm bg-[#F8FAFC] dark:bg-[var(--sidebar-bg)]" />
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20 gap-3 text-slate-400">
            <Loader2 className="w-5 h-5 animate-spin" /><span className="text-[14px] font-medium">Loading groups...</span>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3 text-red-500">
            <AlertCircle className="w-6 h-6" /><p className="text-[14px] font-medium">{error}</p>
          </div>
        ) : filteredGroups.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3 text-slate-400">
            <Layers className="w-10 h-10 opacity-30" />
            <p className="text-[14px] font-medium">No Class Groups found</p>
            <p className="text-[12px] text-slate-400">Groups let you assign teachers to multiple sections/classes at once</p>
            {isAdmin && (
              <button onClick={() => { resetForm(); setIsAddOpen(true); }}
                className="mt-2 px-4 py-2 text-[13px] font-bold bg-primary hover:bg-[#d68600] text-white rounded-lg">
                Create First Group
              </button>
            )}
          </div>
        ) : (
          <DataTable columns={columns} data={filteredGroups} />
        )}
      </div>

      {/* Add Group Modal */}
      <Modal isOpen={isAddOpen} onClose={() => { setIsAddOpen(false); resetForm(); }} title="Create Class Group" size="lg">
        <form onSubmit={handleAdd} className="space-y-5 text-left">
          {formError && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-[13px] font-medium">
              <AlertCircle className="w-4 h-4 shrink-0" /> {formError}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-semibold text-slate-900 dark:text-white font-medium">Group Name <span className="text-red-500">*</span></label>
              <input type="text" value={formName} onChange={(e) => setFormName(e.target.value)} required
                placeholder="e.g. Class 10 All Sections, Science Practical Group"
                className="w-full px-3.5 py-2.5 border border-border rounded-lg text-[13px] outline-none focus:border-[#10B981]/50 bg-white dark:bg-slate-900 shadow-sm font-medium" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-semibold text-slate-900 dark:text-white font-medium">Academic Year <span className="text-red-500">*</span></label>
              <input type="text" value={formYear} onChange={(e) => setFormYear(e.target.value)} required disabled
                className="w-full px-3.5 py-2.5 border border-border rounded-lg text-[13px] outline-none focus:border-[#10B981]/50 bg-slate-50 dark:bg-slate-800 shadow-sm font-medium cursor-not-allowed" />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-semibold text-slate-900 dark:text-white font-medium">Sub-groups (Nested Groups)</label>
            <div className="border border-border rounded-lg p-3 bg-slate-50 dark:bg-slate-900/50 max-h-[120px] overflow-y-auto space-y-2">
              {groups.length === 0 ? (
                <p className="text-xs text-slate-400">No other groups available to nest.</p>
              ) : (
                groups.map(g => (
                  <label key={g._id} className="flex items-center gap-2 text-[13px] font-medium text-slate-700 dark:text-slate-350 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={selectedSubGroups.includes(g._id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedSubGroups(prev => [...prev, g._id]);
                        } else {
                          setSelectedSubGroups(prev => prev.filter(id => id !== g._id));
                        }
                      }}
                      className="rounded border-border text-primary focus:ring-primary w-4 h-4 cursor-pointer"
                    />
                    <span>{g.name}</span>
                  </label>
                ))
              )}
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-border pb-2">
              <label className="text-[13px] font-bold text-slate-900 dark:text-white uppercase tracking-wider">Group Classes / Sections</label>
              <button type="button" onClick={addClassRow}
                className="text-[12px] font-bold text-primary hover:text-[#d68600] flex items-center gap-1 transition-colors">
                <Plus className="w-3.5 h-3.5" /> Add Class
              </button>
            </div>

            <div className="space-y-3 max-h-[250px] overflow-y-auto pr-1">
              {classRows.map((row, index) => {
                const selectedClass = classes.find(c => c._id === row.class_id);
                const isHigherClass = selectedClass ? (selectedClass.name.startsWith("Class 11") || selectedClass.name.startsWith("Class 12")) : false;
                
                return (
                  <div key={row.id} className="flex flex-wrap items-center gap-3 p-3 bg-slate-50 dark:bg-slate-900/50 border border-border rounded-xl">
                    <div className="flex-1 min-w-[140px] flex flex-col gap-1">
                      <select value={row.class_id} onChange={(e) => updateClassRow(row.id, "class_id", e.target.value)} required
                        className="w-full px-3 py-2 border border-border rounded-lg text-[13px] bg-white dark:bg-slate-900 outline-none focus:border-primary/50">
                        <option value="">Select Class</option>
                        {classes.map(c => <option key={c._id} value={c._id}>{c.name}{c.section ? ` - ${c.section}` : ""}</option>)}
                      </select>
                    </div>

                    {enableStreams && isHigherClass && (
                      <div className="flex-1 min-w-[140px] flex flex-col gap-1">
                        <select value={row.stream_id} onChange={(e) => updateClassRow(row.id, "stream_id", e.target.value)}
                          className="w-full px-3 py-2 border border-border rounded-lg text-[13px] bg-white dark:bg-slate-900 outline-none focus:border-primary/50">
                          <option value="">Select Stream</option>
                          {streams.filter(s => s.status === "Active").map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
                        </select>
                      </div>
                    )}

                    {enableSections && sections.length > 0 && (
                      <div className="flex-1 min-w-[140px] flex flex-col gap-1">
                        <select value={row.section_id} onChange={(e) => updateClassRow(row.id, "section_id", e.target.value)}
                          className="w-full px-3 py-2 border border-border rounded-lg text-[13px] bg-white dark:bg-slate-900 outline-none focus:border-primary/50">
                          <option value="">Select Section</option>
                          {sections.filter(s => s.status === "Active").map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
                        </select>
                      </div>
                    )}

                    <button type="button" onClick={() => removeClassRow(row.id)} disabled={classRows.length <= 1}
                      className="p-1.5 text-slate-400 hover:text-red-500 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors disabled:opacity-30 disabled:hover:bg-transparent">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-border/50">
            <button type="button" onClick={() => { setIsAddOpen(false); resetForm(); }}
              className="px-5 py-2.5 bg-[#F1F5F9] dark:bg-slate-800 text-slate-900 dark:text-white font-medium text-[14px] font-bold rounded-lg transition-colors">Cancel</button>
            <button type="submit" disabled={submitting}
              className="px-5 py-2.5 bg-primary hover:bg-[#d68600] text-[14px] font-bold rounded-lg text-white shadow-sm transition-colors disabled:opacity-60 flex items-center gap-2">
              {submitting && <Loader2 className="w-4 h-4 animate-spin" />} Create Group
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={isDeleteOpen} onClose={() => setIsDeleteOpen(false)} title="Delete Class Group">
        <div className="space-y-5 text-left">
          <p className="text-[14px] text-slate-600 dark:text-slate-300">
            Are you sure you want to delete class group <span className="font-bold text-red-500">{selected?.name}</span>?
            <br /><br />
            <span className="text-red-500 font-bold bg-red-50 p-2.5 rounded block text-[13px]">
              Warning: This will also delete any Teacher Assignments and associated Syllabuses assigned to this Group!
            </span>
          </p>
          <div className="flex justify-end gap-3">
            <button onClick={() => setIsDeleteOpen(false)} className="px-5 py-2.5 bg-[#F1F5F9] dark:bg-slate-800 text-slate-900 dark:text-white font-medium text-[14px] font-bold rounded-lg">Cancel</button>
            <button onClick={handleDelete} disabled={submitting} className="px-5 py-2.5 bg-red-500 hover:bg-red-600 text-white text-[14px] font-bold rounded-lg shadow-sm disabled:opacity-60 flex items-center gap-2">
              {submitting && <Loader2 className="w-4 h-4 animate-spin" />} Delete Group
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
