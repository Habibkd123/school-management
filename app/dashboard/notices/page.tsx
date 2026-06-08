"use client";

import React, { useState } from "react";
import { useAppState } from "../../context/store";
import { Modal } from "../../components/ui/modal";
import { Megaphone, Plus, Calendar, Trash2, Tag, User, Users } from "lucide-react";

export default function NoticesPage() {
  const {
    activeRole,
    notices,
    addNotice,
    deleteNotice
  } = useAppState();

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [target, setTarget] = useState<"All" | "Teachers" | "Students">("All");
  const [type, setType] = useState<"Announcement" | "Alert" | "Event">("Announcement");

  const handlePublishSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addNotice({
      title,
      content,
      target,
      type
    });
    setTitle("");
    setContent("");
    setIsAddOpen(false);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to take down this notice?")) {
      deleteNotice(id);
    }
  };

  // Filter notices based on role scope
  // Students should not see Teacher-targeted notices
  // Teachers should not see Student-targeted notices (or maybe they can, but let's hide private targets)
  const visibleNotices = notices.filter((n) => {
    if (activeRole === "student" && n.target === "Teachers") return false;
    if (activeRole === "teacher" && n.target === "Students") return false;
    return true;
  });

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-left">
        <div>
          <h1 className="page-title">
            Notice Board
          </h1>
          <p className="page-desc mt-1">
            Global bulletin feed for announcements, academic events, and emergency alerts.
          </p>
        </div>

        {activeRole === "admin" && (
           <button
            onClick={() => setIsAddOpen(true)}
             className="flex items-center gap-2 px-4 py-2 text-[13px] font-semibold text-white bg-primary hover:bg-primary/90 rounded-lg shadow-sm transition-colors cursor-pointer self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Publish Bulletin</span>
          </button>
        )}
      </div>

      {/* Notices Feed List */}
      <div className="space-y-5">
        {visibleNotices.length === 0 ? (
           <div className="bg-white border border-border rounded-xl p-12 text-center text-slate-500">
            No notices are currently published on the board.
          </div>
        ) : (
          visibleNotices.map((notice) => (
            <div
              key={notice.id}
               className="bg-white border border-border rounded-xl p-6 card-shadow flex flex-col justify-between text-left relative group hover:border-primary/40 transition-all"
            >
              {activeRole === "admin" && (
                <button
                  onClick={() => handleDelete(notice.id)}
                   className="absolute top-5 right-5 p-2 rounded-lg hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                  title="Remove Bulletin"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}

              <div className="space-y-4">
                {/* Notice Badges */}
                <div className="flex flex-wrap items-center gap-2.5 text-[11px] font-bold tracking-wider uppercase">
                  <span
                     className={`px-2.5 py-1 rounded-md border ${
                      notice.type === "Alert"
                         ? "bg-rose-50 text-rose-700 border-rose-200"
                        : notice.type === "Event"
                         ? "bg-indigo-50 text-indigo-700 border-indigo-200"
                         : "bg-slate-50 text-slate-600 border-slate-200"
                    }`}
                  >
                    {notice.type}
                  </span>
                   <span className="px-2.5 py-1 rounded-md bg-white text-slate-500 border border-border shadow-sm">
                    Scope: {notice.target}
                  </span>
                </div>

                <div className="space-y-1.5">
                   <h2 className="text-[16px] font-semibold text-slate-900 leading-tight">
                    {notice.title}
                  </h2>
                   <p className="text-[14px] text-slate-600 leading-relaxed">
                    {notice.content}
                  </p>
                </div>
              </div>

              {/* Publisher Footer */}
               <div className="mt-6 pt-4 border-t border-border flex items-center gap-4 text-[12px] text-slate-500">
                <div className="flex items-center gap-1.5">
                  <User className="w-4 h-4" />
                  <span>Published by {notice.author}</span>
                </div>
                <span>•</span>
                 <div className="flex items-center gap-1.5 font-bold font-mono text-slate-600">
                  <Calendar className="w-4 h-4" />
                  <span>{notice.date}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* ----------------------------------------------------
          PUBLISH NOTICE MODAL
          ---------------------------------------------------- */}
      <Modal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} title="Publish Notice Bulletin">
        <form onSubmit={handlePublishSubmit} className="space-y-4">
          <div className="flex flex-col gap-1.5 text-left">
             <label className="text-[11px] font-semibold uppercase text-slate-500">Notice Title</label>
            <input
              required
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Weather Alert: School Closure Details"
               className="px-3.5 py-2.5 border border-border rounded-lg bg-white text-[13px] text-slate-900 outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all shadow-sm"
            />
          </div>

          <div className="flex flex-col gap-1.5 text-left">
             <label className="text-[11px] font-semibold uppercase text-slate-500">Bulletin Content Body</label>
            <textarea
              required
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={4}
              placeholder="Enter details of the notice announcement..."
               className="px-3.5 py-2.5 border border-border rounded-lg bg-white text-[13px] text-slate-900 outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all shadow-sm resize-none leading-relaxed"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5 text-left">
               <label className="text-[11px] font-semibold uppercase text-slate-500">Target Audience Scope</label>
              <select
                value={target}
                onChange={(e) => setTarget(e.target.value as "All" | "Teachers" | "Students")}
                 className="px-3.5 py-2.5 border border-border rounded-lg bg-white text-[13px] font-medium text-slate-900 outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all shadow-sm cursor-pointer"
              >
                <option value="All">Everyone (All Profiles)</option>
                <option value="Teachers">Teachers Only</option>
                <option value="Students">Students & Parents Only</option>
              </select>
            </div>

            <div className="flex flex-col gap-1.5 text-left">
               <label className="text-[11px] font-semibold uppercase text-slate-500">Classification Tag</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as "Announcement" | "Alert" | "Event")}
                 className="px-3.5 py-2.5 border border-border rounded-lg bg-white text-[13px] font-medium text-slate-900 outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all shadow-sm cursor-pointer"
              >
                <option value="Announcement">Standard Announcement</option>
                <option value="Alert">High-Priority Alert</option>
                <option value="Event">Scheduled Event Notification</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-border">
             <button
              type="button"
              onClick={() => setIsAddOpen(false)}
               className="px-4 py-2 border border-border text-[13px] font-bold rounded-lg bg-white hover:bg-slate-50 text-slate-700 transition-colors shadow-sm cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
               className="px-4 py-2 bg-primary hover:bg-primary/90 text-[13px] font-semibold rounded-lg text-white shadow-sm transition-colors cursor-pointer"
            >
              Publish Notice
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
