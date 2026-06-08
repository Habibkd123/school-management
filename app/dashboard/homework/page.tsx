"use client";

import React, { useState } from "react";
import { useAppState } from "../../context/store";
import { Modal } from "../../components/ui/modal";
import {
  BookOpen,
  Plus,
  Calendar,
  ClipboardCheck,
  CheckCircle2,
  AlertCircle,
  FileText,
  User,
  GraduationCap,
  MessageSquare
} from "lucide-react";

export default function HomeworkPage() {
  const {
    activeRole,
    students,
    classes,
    homework,
    addHomework,
    submitHomework,
    gradeHomework
  } = useAppState();

  // Dialog controllers
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isSubmitOpen, setIsSubmitOpen] = useState(false);
  const [isGradeOpen, setIsGradeOpen] = useState(false);
  const [isSubmissionsOpen, setIsSubmissionsOpen] = useState(false);

  // Form states
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [classId, setClassId] = useState("c1");
  const [subject, setSubject] = useState("English");
  const [dueDate, setDueDate] = useState("2026-06-12");

  // Selection states
  const [selectedHwId, setSelectedHwId] = useState("");
  const [selectedStudentId, setSelectedStudentId] = useState("");
  const [submissionContent, setSubmissionContent] = useState("");
  const [grade, setGrade] = useState("A");
  const [feedback, setFeedback] = useState("");

  const activeStudent = students[0] || { id: "s1", name: "Alex Rivera", classId: "c1" };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addHomework({
      title,
      description,
      classId,
      subject,
      dueDate
    });
    setTitle("");
    setDescription("");
    setIsAddOpen(false);
  };

  const handleSubmitWork = (e: React.FormEvent) => {
    e.preventDefault();
    submitHomework(selectedHwId, activeStudent.id, submissionContent);
    setSubmissionContent("");
    setIsSubmitOpen(false);
  };

  const handleGradeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    gradeHomework(selectedHwId, selectedStudentId, grade, feedback);
    setGrade("A");
    setFeedback("");
    setIsGradeOpen(false);
  };

  const getClassName = (cId: string) => {
    return classes.find((c) => c.id === cId)?.name || "Unknown";
  };

  const getStudentName = (sId: string) => {
    return students.find((s) => s.id === sId)?.name || "Unknown Student";
  };

  const getSubmissionStatus = (hwId: string, studentId: string) => {
    const hw = homework.find((h) => h.id === hwId);
    const sub = hw?.submissions.find((s) => s.studentId === studentId);
    if (!sub) return { text: "Pending", class: "bg-amber-50 text-amber-700 border border-amber-200" };
    if (sub.grade) return { text: `Graded (${sub.grade})`, class: "bg-emerald-50 text-emerald-700 border border-emerald-200" };
    return { text: "Submitted", class: "bg-indigo-50 text-indigo-700 border border-indigo-200" };
  };

  const activeHw = homework.find((h) => h.id === selectedHwId);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-left">
        <div>
          <h1 className="page-title">
            {activeRole === "student" ? "My Homework Assignments" : "Homework Manager"}
          </h1>
          <p className="page-desc mt-1">
            Assign tasks, submit essays, and review homework evaluations.
          </p>
        </div>

        {activeRole !== "student" && (
          <button
            onClick={() => setIsAddOpen(true)}
            className="flex items-center gap-2 px-4 py-2 text-[13px] font-semibold text-white bg-primary hover:bg-primary/90 rounded-lg shadow-sm transition-colors cursor-pointer self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Create Assignment</span>
          </button>
        )}
      </div>

      {/* Homework List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {homework.map((hw) => {
          const classObj = classes.find((c) => c.id === hw.classId);
          // For students, filter homework that is not assigned to their class
          if (activeRole === "student" && hw.classId !== activeStudent.classId) return null;

          const submission = hw.submissions.find((s) => s.studentId === activeStudent.id);
          const studentStatus = getSubmissionStatus(hw.id, activeStudent.id);

          return (
            <div
              key={hw.id}
              className="bg-white dark:bg-slate-900 border border-border rounded-xl p-5 card-shadow transition-all flex flex-col justify-between text-left h-full"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/50 border border-border px-2.5 py-1 rounded-md">
                    {hw.subject} • {getClassName(hw.classId)}
                  </span>
                  {activeRole === "student" ? (
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${studentStatus.class}`}>
                      {studentStatus.text}
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-800 px-2.5 py-1 rounded-full">
                      {hw.submissions.length} Submissions
                    </span>
                  )}
                </div>

                <div className="space-y-2">
                  <h3 className="font-semibold text-[15px] text-slate-900 dark:text-white leading-tight">
                    {hw.title}
                  </h3>
                  <p className="text-[13px] text-slate-500 dark:text-slate-400 line-clamp-3">
                    {hw.description}
                  </p>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-border flex items-center justify-between text-[13px]">
                <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 font-mono text-[11px] font-bold">
                  <Calendar className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                  <span>Due: {hw.dueDate}</span>
                </div>

                {/* Role Specific Actions */}
                {activeRole === "student" ? (
                  !submission ? (
                    <button
                      onClick={() => {
                        setSelectedHwId(hw.id);
                        setIsSubmitOpen(true);
                      }}
                      className="px-3.5 py-2 text-[12px] font-bold text-white bg-primary hover:bg-primary/90 rounded-lg shadow-sm transition-colors cursor-pointer"
                    >
                      Submit Work
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        setSelectedHwId(hw.id);
                        setIsSubmissionsOpen(true);
                      }}
                       className="px-3.5 py-2 text-[12px] font-bold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800/50 border border-border rounded-lg shadow-sm transition-colors cursor-pointer"
                    >
                      View Submission
                    </button>
                  )
                ) : (
                  <button
                    onClick={() => {
                      setSelectedHwId(hw.id);
                      setIsSubmissionsOpen(true);
                    }}
                    className="px-3.5 py-2 text-[12px] font-bold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800/50 border border-border rounded-lg shadow-sm transition-colors cursor-pointer"
                  >
                    Submissions List ({hw.submissions.length})
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* ----------------------------------------------------
          CREATE ASSIGNMENT MODAL
          ---------------------------------------------------- */}
      <Modal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} title="New Homework Assignment">
        <form onSubmit={handleAddSubmit} className="space-y-4">
          <div className="flex flex-col gap-1.5 text-left">
            <label className="text-[11px] font-semibold uppercase text-slate-500 dark:text-slate-400">Assignment Title</label>
            <input
              required
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Shakespearean Drama Analysis"
               className="px-3.5 py-2.5 border border-border rounded-lg bg-white dark:bg-slate-900 text-[13px] text-slate-900 dark:text-white outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all shadow-sm"
            />
          </div>

          <div className="flex flex-col gap-1.5 text-left">
            <label className="text-[11px] font-semibold uppercase text-slate-500 dark:text-slate-400">Task Details & Description</label>
            <textarea
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="Provide a prompt, text readings, or instructions..."
              className="px-3.5 py-2.5 border border-border rounded-lg bg-white dark:bg-slate-900 text-[13px] text-slate-900 dark:text-white outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all shadow-sm resize-none"
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="flex flex-col gap-1.5 text-left">
              <label className="text-[11px] font-semibold uppercase text-slate-500 dark:text-slate-400">Class Target</label>
              <select
                value={classId}
                onChange={(e) => setClassId(e.target.value)}
                 className="px-3.5 py-2.5 border border-border rounded-lg bg-white dark:bg-slate-900 text-[13px] font-medium text-slate-900 dark:text-white outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all shadow-sm cursor-pointer"
              >
                {classes.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-1.5 text-left">
              <label className="text-[11px] font-semibold uppercase text-slate-500 dark:text-slate-400">Subject</label>
              <input
                required
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="e.g. English"
                className="px-3.5 py-2.5 border border-border rounded-lg bg-white dark:bg-slate-900 text-[13px] text-slate-900 dark:text-white outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all shadow-sm"
              />
            </div>
            <div className="flex flex-col gap-1.5 text-left">
              <label className="text-[11px] font-semibold uppercase text-slate-500 dark:text-slate-400">Due Date</label>
              <input
                required
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                 className="px-3.5 py-2.5 border border-border rounded-lg bg-white dark:bg-slate-900 text-[13px] text-slate-900 dark:text-white outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all shadow-sm font-mono font-bold text-slate-600 dark:text-slate-300 cursor-pointer"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
             <button
              type="button"
              onClick={() => setIsAddOpen(false)}
               className="px-4 py-2 border border-border text-[13px] font-bold rounded-lg bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800/50 text-slate-700 dark:text-slate-200 transition-colors shadow-sm cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
               className="px-4 py-2 bg-primary hover:bg-primary/90 text-[13px] font-semibold rounded-lg text-white shadow-sm transition-colors cursor-pointer"
            >
              Assign Homework
            </button>
          </div>
        </form>
      </Modal>

      {/* ----------------------------------------------------
          STUDENT WORK SUBMISSION MODAL
          ---------------------------------------------------- */}
      <Modal isOpen={isSubmitOpen} onClose={() => setIsSubmitOpen(false)} title="Submit Assignment Response">
        <form onSubmit={handleSubmitWork} className="space-y-4">
           <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-border text-left">
            <h4 className="font-semibold text-slate-900 dark:text-white text-[14px]">{activeHw?.title}</h4>
            <p className="mt-1.5 leading-relaxed text-[13px] text-slate-600 dark:text-slate-300">{activeHw?.description}</p>
          </div>

          <div className="flex flex-col gap-1.5 text-left">
            <label className="text-[11px] font-semibold uppercase text-slate-500 dark:text-slate-400">Your Response / Essay</label>
            <textarea
              required
              value={submissionContent}
              onChange={(e) => setSubmissionContent(e.target.value)}
              rows={6}
              placeholder="Write your assignment text here..."
               className="px-3.5 py-3 border border-border rounded-lg bg-white dark:bg-slate-900 text-[13px] text-slate-900 dark:text-white outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all shadow-sm resize-none leading-relaxed"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
             <button
              type="button"
              onClick={() => setIsSubmitOpen(false)}
               className="px-4 py-2 border border-border text-[13px] font-bold rounded-lg bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800/50 text-slate-700 dark:text-slate-200 transition-colors shadow-sm cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
               className="px-4 py-2 bg-primary hover:bg-primary/90 text-[13px] font-semibold rounded-lg text-white shadow-sm transition-colors cursor-pointer"
            >
              Submit Assignment
            </button>
          </div>
        </form>
      </Modal>

      {/* ----------------------------------------------------
          SUBMISSIONS LIST MODAL (FOR GRADING / VIEW)
          ---------------------------------------------------- */}
      <Modal
        isOpen={isSubmissionsOpen}
        onClose={() => setIsSubmissionsOpen(false)}
        title={activeHw ? `Submissions: ${activeHw.title}` : "Submissions"}
        size="lg"
      >
        <div className="space-y-5">
           <div className="text-left space-y-1 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-border">
            <h3 className="font-semibold text-[14px] text-slate-900 dark:text-white">Assignment Overview</h3>
            <p className="text-[13px] text-slate-600 dark:text-slate-300 mt-1">{activeHw?.description}</p>
          </div>

          <div className="border border-border rounded-xl overflow-hidden text-left card-shadow">
            <table className="w-full text-[13px] border-collapse">
              <thead>
                 <tr className="bg-slate-50/50 dark:bg-slate-800/50 border-b border-border text-[11px] uppercase font-bold text-slate-500 dark:text-slate-400">
                  <th className="px-5 py-3.5">Student</th>
                  <th className="px-5 py-3.5">Response Content</th>
                  <th className="px-5 py-3.5">Grade Status</th>
                  {activeRole !== "student" && <th className="px-5 py-3.5 text-right">Actions</th>}
                </tr>
              </thead>
               <tbody className="divide-y divide-border bg-white dark:bg-slate-900">
                {activeHw?.submissions.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-5 py-8 text-center text-slate-500 dark:text-slate-400">
                      No submissions uploaded yet.
                    </td>
                  </tr>
                ) : (
                  activeHw?.submissions
                    .filter((s) => activeRole !== "student" || s.studentId === activeStudent.id)
                    .map((sub) => (
                       <tr key={sub.studentId} className="align-top hover:bg-slate-50/50 dark:bg-slate-800/50 transition-colors">
                        <td className="px-5 py-4 font-bold text-slate-900 dark:text-white">
                          {getStudentName(sub.studentId)}
                        </td>
                         <td className="px-5 py-4 space-y-3 max-w-sm">
                           <p className="text-slate-700 dark:text-slate-200 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-lg border border-border leading-relaxed text-[12px] shadow-sm">
                            {sub.content}
                          </p>
                          {sub.feedback && (
                             <div className="flex gap-2 items-start text-[11px] text-slate-600 dark:text-slate-300 bg-indigo-50/50 p-2.5 rounded-lg border border-indigo-100">
                              <MessageSquare className="w-4 h-4 mt-0.5 text-indigo-500 flex-shrink-0" />
                              <span className="italic">&ldquo;{sub.feedback}&rdquo;</span>
                            </div>
                          )}
                        </td>
                        <td className="px-5 py-4">
                          {sub.grade ? (
                             <span className="px-2.5 py-1 rounded-md font-bold text-[11px] bg-emerald-50 text-emerald-700 border border-emerald-200">
                              Rated: {sub.grade}
                            </span>
                          ) : (
                             <span className="px-2.5 py-1 rounded-md font-bold text-[11px] bg-amber-50 text-amber-700 border border-amber-200">
                              Ungraded
                            </span>
                          )}
                        </td>
                        {activeRole !== "student" && (
                          <td className="px-5 py-4 text-right">
                            <button
                              onClick={() => {
                                setSelectedStudentId(sub.studentId);
                                setIsGradeOpen(true);
                              }}
                               className="px-3 py-1.5 text-[11px] font-bold text-primary bg-primary/10 hover:bg-primary/20 rounded-md transition-colors cursor-pointer flex items-center gap-1.5 inline-flex"
                            >
                              <ClipboardCheck className="w-3.5 h-3.5" />
                              <span>Evaluate</span>
                            </button>
                          </td>
                        )}
                      </tr>
                    ))
                )}
              </tbody>
            </table>
          </div>

          <div className="flex justify-end pt-4 border-t border-border">
             <button
              type="button"
              onClick={() => setIsSubmissionsOpen(false)}
               className="px-4 py-2 border border-border text-[13px] font-bold rounded-lg bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800/50 text-slate-700 dark:text-slate-200 transition-colors shadow-sm cursor-pointer"
            >
              Close List
            </button>
          </div>
        </div>
      </Modal>

      {/* ----------------------------------------------------
          EVALUATE / GRADE SUBMISSION MODAL
          ---------------------------------------------------- */}
      <Modal isOpen={isGradeOpen} onClose={() => setIsGradeOpen(false)} title="Evaluate Student Assignment">
        <form onSubmit={handleGradeSubmit} className="space-y-4">
           <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-border text-left space-y-1.5">
             <p className="text-[11px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">Student Submission</p>
            <p className="font-bold text-[14px] text-slate-900 dark:text-white">
              {getStudentName(selectedStudentId)}
            </p>
             <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-[13px] pt-1">
              {activeHw?.submissions.find((s) => s.studentId === selectedStudentId)?.content}
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="flex flex-col gap-1.5 text-left col-span-1">
              <label className="text-[11px] font-semibold uppercase text-slate-500 dark:text-slate-400">Award Grade</label>
              <select
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
                 className="px-3.5 py-2.5 border border-border rounded-lg bg-white dark:bg-slate-900 text-[13px] font-bold text-slate-900 dark:text-white outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all shadow-sm cursor-pointer"
              >
                <option value="A">Grade A</option>
                <option value="B">Grade B</option>
                <option value="C">Grade C</option>
                <option value="D">Grade D</option>
                <option value="F">Grade F</option>
              </select>
            </div>
            <div className="flex flex-col gap-1.5 text-left col-span-2">
               <label className="text-[11px] font-semibold uppercase text-slate-500 dark:text-slate-400">Evaluation Comments</label>
              <input
                required
                type="text"
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Good analytical structure..."
                 className="px-3.5 py-2.5 border border-border rounded-lg bg-white dark:bg-slate-900 text-[13px] text-slate-900 dark:text-white outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all shadow-sm"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
             <button
              type="button"
              onClick={() => setIsGradeOpen(false)}
               className="px-4 py-2 border border-border text-[13px] font-bold rounded-lg bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800/50 text-slate-700 dark:text-slate-200 transition-colors shadow-sm cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
               className="px-4 py-2 bg-primary hover:bg-primary/90 text-[13px] font-semibold rounded-lg text-white shadow-sm transition-colors cursor-pointer"
            >
              Submit Review
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
