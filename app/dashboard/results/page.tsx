"use client";

import React, { useState } from "react";
import { useAppState } from "../../context/store";
import { Modal } from "../../components/ui/modal";
import {
  ClipboardList,
  Plus,
  TrendingUp,
  Award,
  CheckCircle,
  FileText,
  Bookmark,
  Users
} from "lucide-react";

export default function ResultsPage() {
  const {
    activeRole,
    students,
    classes,
    grades,
    addGrade
  } = useAppState();

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [selectedClassId, setSelectedClassId] = useState("c1");
  const [selectedStudentId, setSelectedStudentId] = useState("s1");
  const [subject, setSubject] = useState("English");
  const [examName, setExamName] = useState("Mid-Term");
  const [score, setScore] = useState(85);
  const [maxScore, setMaxScore] = useState(100);

  const activeStudent = students[0] || { id: "s1", name: "Alex Rivera", classId: "c1" };

  const handleAddGradeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addGrade({
      studentId: selectedStudentId,
      subject,
      examName,
      score,
      maxScore
    });
    setIsAddOpen(false);
  };

  const getStudentName = (sId: string) => {
    return students.find((s) => s.id === sId)?.name || "Unknown Student";
  };

  const getClassName = (cId: string) => {
    return classes.find((c) => c.id === cId)?.name || "Unknown";
  };

  // Student details
  const studentGrades = grades.filter((g) => g.studentId === activeStudent.id);
  const studentAverage = studentGrades.length > 0
    ? Math.round(studentGrades.reduce((acc, curr) => acc + (curr.score / curr.maxScore) * 100, 0) / studentGrades.length)
    : 85;

  const letterRating = (percent: number) => {
    if (percent >= 90) return { text: "A", class: "bg-emerald-50 text-emerald-700 border border-emerald-200" };
    if (percent >= 80) return { text: "B", class: "bg-teal-50 text-teal-700 border border-teal-200" };
    if (percent >= 70) return { text: "C", class: "bg-amber-50 text-amber-700 border border-amber-200" };
    if (percent >= 60) return { text: "D", class: "bg-orange-50 text-orange-700 border border-orange-200" };
    return { text: "F", class: "bg-rose-50 text-rose-700 border border-rose-200" };
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-left">
        <div>
          <h1 className="page-title">
            {activeRole === "student" ? "My Academic Results" : "Exam Gradebook"}
          </h1>
          <p className="page-desc mt-1">
            Browse exam term ratings, transcript evaluation logs, and GPA records.
          </p>
        </div>

        {activeRole !== "student" && (
          <button
            onClick={() => setIsAddOpen(true)}
            className="flex items-center gap-2 px-4 py-2 text-[13px] font-semibold text-white bg-primary hover:bg-primary/90 rounded-lg shadow-sm transition-colors cursor-pointer self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Post Marks</span>
          </button>
        )}
      </div>

      {/* ----------------------------------------------------
          STUDENT VIEW (REPORT CARD TRANSCRIPT)
          ---------------------------------------------------- */}
      {activeRole === "student" && (
        <div className="space-y-6">
          {/* GPA Card Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="bg-white dark:bg-slate-900 border border-border rounded-xl p-6 card-shadow text-left flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[11px] uppercase font-bold text-slate-500 dark:text-slate-400 tracking-wider">Term Average GPA</span>
                <span className="text-2xl font-bold block text-slate-900 dark:text-white mt-0.5">{studentAverage}%</span>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-border rounded-xl p-6 card-shadow text-left flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-600 flex items-center justify-center">
                <CheckCircle className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[11px] uppercase font-bold text-slate-500 dark:text-slate-400 tracking-wider">Total Exams Written</span>
                <span className="text-2xl font-bold block text-slate-900 dark:text-white mt-0.5">{studentGrades.length} Subjects</span>
              </div>
            </div>

             <div className="bg-white dark:bg-slate-900 border border-border rounded-xl p-6 card-shadow text-left flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-100 text-amber-600 flex items-center justify-center">
                <TrendingUp className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[11px] uppercase font-bold text-slate-500 dark:text-slate-400 tracking-wider">Performance Status</span>
                <span className="text-2xl font-bold block text-emerald-600 mt-0.5">Pass / Excellent</span>
              </div>
            </div>
          </div>

          {/* Transcript List */}
          <div className="bg-white dark:bg-slate-900 border border-border rounded-xl card-shadow overflow-hidden text-left">
            <div className="px-6 py-4 border-b border-border bg-slate-50/50 dark:bg-slate-800/50">
              <h2 className="text-[15px] font-semibold text-slate-900 dark:text-white">Report Card transcript</h2>
            </div>
            <div className="overflow-x-auto bg-white dark:bg-slate-900">
              <table className="w-full border-collapse">
                <thead>
                   <tr className="border-b border-border bg-white dark:bg-slate-900 text-[11px] uppercase font-bold text-slate-500 dark:text-slate-400 tracking-wider">
                    <th className="px-6 py-4">Subject</th>
                    <th className="px-6 py-4">Exam Name</th>
                    <th className="px-6 py-4 font-mono">Date Entered</th>
                    <th className="px-6 py-4">Score Achieved</th>
                    <th className="px-6 py-4">Grade Rating</th>
                  </tr>
                </thead>
                 <tbody className="divide-y divide-border text-[13px]">
                  {studentGrades.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-slate-500 dark:text-slate-400">
                        No examination grades have been uploaded for your profile yet.
                      </td>
                    </tr>
                  ) : (
                    studentGrades.map((grade) => {
                      const percent = Math.round((grade.score / grade.maxScore) * 100);
                      const rate = letterRating(percent);
                      return (
                        <tr key={grade.id} className="hover:bg-slate-50/50 dark:bg-slate-800/50 transition-colors">
                           <td className="px-6 py-4 font-bold text-slate-900 dark:text-white">{grade.subject}</td>
                          <td className="px-6 py-4 text-slate-600 dark:text-slate-300">{grade.examName}</td>
                          <td className="px-6 py-4 text-slate-500 dark:text-slate-400 font-mono">{grade.date}</td>
                           <td className="px-6 py-4 font-mono font-semibold text-slate-700 dark:text-slate-200">
                            {grade.score} / {grade.maxScore} <span className="text-slate-400 dark:text-slate-500 text-[11px] ml-1">({percent}%)</span>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-2.5 py-1 rounded-md font-bold text-[11px] ${rate.class}`}>
                              Grade {rate.text}
                            </span>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ----------------------------------------------------
          FACULTY VIEW (GENERAL GRADEBOOK TRANSCRIPT)
          ---------------------------------------------------- */}
      {activeRole !== "student" && (
         <div className="bg-white dark:bg-slate-900 border border-border rounded-xl card-shadow overflow-hidden text-left">
           <div className="px-6 py-4 border-b border-border bg-slate-50/50 dark:bg-slate-800/50">
            <h2 className="text-[15px] font-semibold text-slate-900 dark:text-white">Institutional Gradebook Logs</h2>
          </div>
          <div className="overflow-x-auto bg-white dark:bg-slate-900">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-border bg-white dark:bg-slate-900 text-[11px] uppercase font-bold text-slate-500 dark:text-slate-400 tracking-wider">
                  <th className="px-6 py-4">Student</th>
                  <th className="px-6 py-4">Subject Specialty</th>
                  <th className="px-6 py-4">Exam Term</th>
                  <th className="px-6 py-4 font-mono">Date Logged</th>
                  <th className="px-6 py-4">Score</th>
                  <th className="px-6 py-4">Evaluated Grade</th>
                </tr>
              </thead>
               <tbody className="divide-y divide-border text-[13px]">
                {grades.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-slate-500 dark:text-slate-400">
                      No grade evaluations recorded yet. Use &ldquo;Post Marks&rdquo; to begin.
                    </td>
                  </tr>
                ) : (
                  grades.map((grade) => {
                    const percent = Math.round((grade.score / grade.maxScore) * 100);
                    const rate = letterRating(percent);
                    return (
                      <tr key={grade.id} className="hover:bg-slate-50/50 dark:bg-slate-800/50 transition-colors">
                        <td className="px-6 py-4 font-bold text-slate-900 dark:text-white">{getStudentName(grade.studentId)}</td>
                        <td className="px-6 py-4 font-bold text-slate-700 dark:text-slate-200">{grade.subject}</td>
                        <td className="px-6 py-4 text-slate-600 dark:text-slate-300">{grade.examName}</td>
                        <td className="px-6 py-4 text-slate-500 dark:text-slate-400 font-mono">{grade.date}</td>
                         <td className="px-6 py-4 font-mono font-semibold text-slate-700 dark:text-slate-200">
                          {grade.score} / {grade.maxScore} <span className="text-slate-400 dark:text-slate-500 text-[11px] ml-1">({percent}%)</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2.5 py-1 rounded-md font-bold text-[11px] ${rate.class}`}>
                            Grade {rate.text}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ----------------------------------------------------
          POST GRADE MARKS MODAL
          ---------------------------------------------------- */}
      <Modal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} title="Upload Exam marks">
        <form onSubmit={handleAddGradeSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5 text-left">
               <label className="text-[11px] font-semibold uppercase text-slate-500 dark:text-slate-400">Select Class</label>
              <select
                value={selectedClassId}
                onChange={(e) => setSelectedClassId(e.target.value)}
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
               <label className="text-[11px] font-semibold uppercase text-slate-500 dark:text-slate-400">Select Student</label>
              <select
                value={selectedStudentId}
                onChange={(e) => setSelectedStudentId(e.target.value)}
                 className="px-3.5 py-2.5 border border-border rounded-lg bg-white dark:bg-slate-900 text-[13px] font-medium text-slate-900 dark:text-white outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all shadow-sm cursor-pointer"
              >
                {students
                  .filter((s) => s.classId === selectedClassId)
                  .map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.rollNo})
                    </option>
                  ))}
                {students.filter((s) => s.classId === selectedClassId).length === 0 && (
                   <option value="" disabled>No students registered</option>
                )}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5 text-left">
               <label className="text-[11px] font-semibold uppercase text-slate-500 dark:text-slate-400">Subject specialty</label>
              <input
                required
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="e.g. Mathematics"
                className="px-3.5 py-2.5 border border-border rounded-lg bg-white dark:bg-slate-900 text-[13px] text-slate-900 dark:text-white outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all shadow-sm"
              />
            </div>

            <div className="flex flex-col gap-1.5 text-left">
               <label className="text-[11px] font-semibold uppercase text-slate-500 dark:text-slate-400">Examination Term</label>
              <input
                required
                type="text"
                value={examName}
                onChange={(e) => setExamName(e.target.value)}
                placeholder="e.g. Mid-Term / Final Prep"
                className="px-3.5 py-2.5 border border-border rounded-lg bg-white dark:bg-slate-900 text-[13px] text-slate-900 dark:text-white outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all shadow-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5 text-left">
               <label className="text-[11px] font-semibold uppercase text-slate-500 dark:text-slate-400">Marks Scored</label>
              <input
                required
                type="number"
                value={score}
                onChange={(e) => setScore(Number(e.target.value))}
                min={0}
                className="px-3.5 py-2.5 border border-border rounded-lg bg-white dark:bg-slate-900 text-[13px] text-slate-900 dark:text-white outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all shadow-sm"
              />
            </div>

            <div className="flex flex-col gap-1.5 text-left">
               <label className="text-[11px] font-semibold uppercase text-slate-500 dark:text-slate-400">Maximum Possible Marks</label>
              <input
                required
                type="number"
                value={maxScore}
                onChange={(e) => setMaxScore(Number(e.target.value))}
                min={1}
                className="px-3.5 py-2.5 border border-border rounded-lg bg-white dark:bg-slate-900 text-[13px] text-slate-900 dark:text-white outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all shadow-sm"
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
              Post Grades
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
