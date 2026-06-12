"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { getAuthHeaders } from "@/lib/utils/session";

export type Role = "admin" | "teacher" | "student";

export interface Student {
  id: string;
  name: string;
  email: string;
  classId: string; // e.g. "10a"
  rollNo: string;
  status: "Active" | "Inactive";
  joinedDate: string;
  parentName: string;
  parentContact: string;
}

export interface Teacher {
  id: string;
  name: string;
  email: string;
  subject: string;
  classId: string; // class teacher of this class
  joinedDate: string;
  status: "Active" | "Inactive";
}

export interface SchoolClass {
  id: string;
  name: string;
  room: string;
  teacherId: string;
  subjects: string[];
}

export interface AttendanceRecord {
  date: string; // YYYY-MM-DD
  status: "Present" | "Absent" | "Late";
}

export interface AttendanceStore {
  [studentId: string]: {
    [date: string]: "Present" | "Absent" | "Late";
  };
}

export interface HomeworkSubmission {
  studentId: string;
  submittedAt: string;
  content: string;
  grade?: string; // A, B, C, D, F, or score
  feedback?: string;
}

export interface Homework {
  id: string;
  title: string;
  description: string;
  classId: string;
  subject: string;
  assignedDate: string;
  dueDate: string;
  submissions: HomeworkSubmission[];
}

export interface Grade {
  id: string;
  studentId: string;
  subject: string;
  examName: string; // e.g. "Mid-Term", "Final"
  score: number;
  maxScore: number;
  date: string;
}

export interface FeeInvoice {
  id: string;
  studentId: string;
  title: string;
  amount: number;
  dueDate: string;
  status: "Paid" | "Unpaid" | "Overdue";
  paidDate?: string;
}

export interface Notice {
  id: string;
  title: string;
  content: string;
  target: "All" | "Teachers" | "Students";
  date: string;
  type: "Announcement" | "Alert" | "Event";
  author: string;
}

interface AppState {
  activeRole: Role;
  students: Student[];
  teachers: Teacher[];
  classes: SchoolClass[];
  attendance: AttendanceStore;
  homework: Homework[];
  grades: Grade[];
  fees: FeeInvoice[];
  notices: Notice[];
  academicYear: string;
}

interface AppContextType extends AppState {
  setRole: (role: Role) => void;
  setAcademicYear: (year: string) => void;
  // Students
  addStudent: (student: Omit<Student, "id" | "joinedDate">) => void;
  updateStudent: (student: Student) => void;
  deleteStudent: (id: string) => void;
  // Teachers
  addTeacher: (teacher: Omit<Teacher, "id" | "joinedDate">) => void;
  updateTeacher: (teacher: Teacher) => void;
  deleteTeacher: (id: string) => void;
  // Attendance
  markAttendance: (date: string, records: { studentId: string; status: "Present" | "Absent" | "Late" }[]) => void;
  // Homework
  addHomework: (hw: Omit<Homework, "id" | "assignedDate" | "submissions">) => void;
  submitHomework: (homeworkId: string, studentId: string, content: string) => void;
  gradeHomework: (homeworkId: string, studentId: string, grade: string, feedback: string) => void;
  // Grades
  addGrade: (grade: Omit<Grade, "id" | "date">) => void;
  // Fees
  payFee: (feeId: string) => void;
  addFeeInvoice: (invoice: Omit<FeeInvoice, "id" | "status">) => void;
  // Notices
  addNotice: (notice: Omit<Notice, "id" | "date" | "author">) => void;
  deleteNotice: (id: string) => void;
}

const defaultStudents: Student[] = [
  { id: "s1", name: "Alex Rivera", email: "alex.rivera@school.com", classId: "c1", rollNo: "01", status: "Active", joinedDate: "2025-08-15", parentName: "Maria Rivera", parentContact: "+1 (555) 123-4567" },
  { id: "s2", name: "Chloe Chen", email: "chloe.chen@school.com", classId: "c1", rollNo: "02", status: "Active", joinedDate: "2025-08-15", parentName: "Bo Chen", parentContact: "+1 (555) 234-5678" },
  { id: "s3", name: "Daniel Kim", email: "daniel.kim@school.com", classId: "c2", rollNo: "01", status: "Active", joinedDate: "2025-08-15", parentName: "Sun-Hee Kim", parentContact: "+1 (555) 345-6789" },
  { id: "s4", name: "Emily Watson", email: "emily.watson@school.com", classId: "c3", rollNo: "01", status: "Active", joinedDate: "2025-08-15", parentName: "Richard Watson", parentContact: "+1 (555) 456-7890" },
  { id: "s5", name: "Frank Miller", email: "frank.miller@school.com", classId: "c4", rollNo: "01", status: "Active", joinedDate: "2025-08-15", parentName: "John Miller", parentContact: "+1 (555) 567-8901" },
  { id: "s6", name: "Grace Hopper", email: "grace.hopper@school.com", classId: "c1", rollNo: "03", status: "Active", joinedDate: "2025-08-16", parentName: "Sarah Hopper", parentContact: "+1 (555) 678-9012" },
  { id: "s7", name: "Henry Cavill", email: "henry.cavill@school.com", classId: "c2", rollNo: "02", status: "Active", joinedDate: "2025-08-16", parentName: "Colin Cavill", parentContact: "+1 (555) 789-0123" },
  { id: "s8", name: "Isabella Ross", email: "isabella.ross@school.com", classId: "c3", rollNo: "02", status: "Active", joinedDate: "2025-08-17", parentName: "Patricia Ross", parentContact: "+1 (555) 890-1234" }
];

const defaultTeachers: Teacher[] = [
  { id: "t1", name: "Sarah Jenkins", email: "s.jenkins@school.com", subject: "English", classId: "c1", joinedDate: "2022-09-01", status: "Active" },
  { id: "t2", name: "David Miller", email: "d.miller@school.com", subject: "Mathematics", classId: "c2", joinedDate: "2021-08-15", status: "Active" },
  { id: "t3", name: "Elena Rostova", email: "e.rostova@school.com", subject: "Science", classId: "c3", joinedDate: "2023-01-10", status: "Active" },
  { id: "t4", name: "Marcus Aurelius", email: "m.aurelius@school.com", subject: "History", classId: "c4", joinedDate: "2020-08-01", status: "Active" }
];

const defaultClasses: SchoolClass[] = [
  { id: "c1", name: "Class 10A", room: "Room 301", teacherId: "t1", subjects: ["English", "Mathematics", "Science"] },
  { id: "c2", name: "Class 10B", room: "Room 302", teacherId: "t2", subjects: ["Mathematics", "Science", "History"] },
  { id: "c3", name: "Class 9A", room: "Room 201", teacherId: "t3", subjects: ["English", "Science", "Geography"] },
  { id: "c4", name: "Class 9B", room: "Room 202", teacherId: "t4", subjects: ["Mathematics", "History", "Civics"] }
];

const defaultAttendance: AttendanceStore = {
  s1: { "2026-06-05": "Present", "2026-06-04": "Present", "2026-06-03": "Late", "2026-06-02": "Present", "2026-06-01": "Present" },
  s2: { "2026-06-05": "Present", "2026-06-04": "Present", "2026-06-03": "Present", "2026-06-02": "Absent", "2026-06-01": "Present" },
  s3: { "2026-06-05": "Absent", "2026-06-04": "Absent", "2026-06-03": "Present", "2026-06-02": "Present", "2026-06-01": "Present" },
  s4: { "2026-06-05": "Present", "2026-06-04": "Present", "2026-06-03": "Present", "2026-06-02": "Present", "2026-06-01": "Present" },
  s5: { "2026-06-05": "Present", "2026-06-04": "Present", "2026-06-03": "Present", "2026-06-02": "Present", "2026-06-01": "Present" },
  s6: { "2026-06-05": "Present", "2026-06-04": "Present", "2026-06-03": "Late", "2026-06-02": "Present", "2026-06-01": "Present" },
  s7: { "2026-06-05": "Present", "2026-06-04": "Present", "2026-06-03": "Present", "2026-06-02": "Present", "2026-06-01": "Absent" },
  s8: { "2026-06-05": "Present", "2026-06-04": "Present", "2026-06-03": "Present", "2026-06-02": "Present", "2026-06-01": "Present" }
};

const defaultHomework: Homework[] = [
  {
    id: "h1",
    title: "Shakespearean Drama Essay",
    description: "Write a 500-word essay detailing the role of the supernatural in Macbeth and Hamlet. Support with text references.",
    classId: "c1",
    subject: "English",
    assignedDate: "2026-06-04",
    dueDate: "2026-06-10",
    submissions: [
      { studentId: "s1", submittedAt: "2026-06-05T14:30:00Z", content: "Supernatural elements drive the plot in Macbeth through the witches...", grade: "A", feedback: "Excellent analysis and structured arguments!" }
    ]
  },
  {
    id: "h2",
    title: "Quadratic Equations Worksheet",
    description: "Complete exercises 1 to 15 on page 112 of the Mathematics textbook.",
    classId: "c2",
    subject: "Mathematics",
    assignedDate: "2026-06-05",
    dueDate: "2026-06-09",
    submissions: []
  },
  {
    id: "h3",
    title: "Photosynthesis Experiment Log",
    description: "Write down the observations of the elodea plant experiment under different light intensities.",
    classId: "c3",
    subject: "Science",
    assignedDate: "2026-06-06",
    dueDate: "2026-06-08",
    submissions: []
  }
];

const defaultGrades: Grade[] = [
  { id: "g1", studentId: "s1", subject: "English", examName: "Mid-Term", score: 88, maxScore: 100, date: "2026-04-15" },
  { id: "g2", studentId: "s1", subject: "Mathematics", examName: "Mid-Term", score: 92, maxScore: 100, date: "2026-04-16" },
  { id: "g3", studentId: "s1", subject: "Science", examName: "Mid-Term", score: 85, maxScore: 100, date: "2026-04-17" },
  { id: "g4", studentId: "s2", subject: "English", examName: "Mid-Term", score: 94, maxScore: 100, date: "2026-04-15" },
  { id: "g5", studentId: "s2", subject: "Mathematics", examName: "Mid-Term", score: 78, maxScore: 100, date: "2026-04-16" },
  { id: "g6", studentId: "s3", subject: "Mathematics", examName: "Mid-Term", score: 81, maxScore: 100, date: "2026-04-16" }
];

const defaultFees: FeeInvoice[] = [
  { id: "f1", studentId: "s1", title: "Term 1 Tuition Fees", amount: 1500, dueDate: "2026-05-01", status: "Paid", paidDate: "2026-04-28" },
  { id: "f2", studentId: "s1", title: "Term 2 Tuition Fees", amount: 1500, dueDate: "2026-06-30", status: "Unpaid" },
  { id: "f3", studentId: "s2", title: "Term 1 Tuition Fees", amount: 1500, dueDate: "2026-05-01", status: "Paid", paidDate: "2026-04-29" },
  { id: "f4", studentId: "s3", title: "Term 1 Tuition Fees", amount: 1500, dueDate: "2026-05-01", status: "Overdue" },
  { id: "f5", studentId: "s4", title: "Term 1 Tuition Fees", amount: 1500, dueDate: "2026-05-01", status: "Paid", paidDate: "2026-05-01" },
  { id: "f6", studentId: "s5", title: "Term 1 Tuition Fees", amount: 1500, dueDate: "2026-05-01", status: "Unpaid" }
];

const defaultNotices: Notice[] = [
  { id: "n1", title: "Annual Sports Day Registrations", content: "Registrations for the Annual Sports Day track & field events are now open. Reach out to the physical education department.", target: "All", date: "2026-06-05", type: "Announcement", author: "Administration" },
  { id: "n2", title: "Final Examinations Prep Schedule", content: "The final examinations schedule has been uploaded. Revision classes will take place from Monday to Thursday after normal school hours.", target: "All", date: "2026-06-03", type: "Alert", author: "Principal Office" },
  { id: "n3", title: "Faculty Training: EdTech Integration", content: "A seminar on integrating new digital resources into lesson plans will happen this Friday at 3:00 PM in the auditorium.", target: "Teachers", date: "2026-06-06", type: "Event", author: "IT Department" }
];

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [activeRole, setActiveRole] = useState<Role>("admin");
  const [academicYear, setAcademicYearState] = useState<string>("2024-2025");
  const [students, setStudents] = useState<Student[]>(defaultStudents);
  const [teachers, setTeachers] = useState<Teacher[]>(defaultTeachers);
  const [classes, setClasses] = useState<SchoolClass[]>(defaultClasses);
  const [attendance, setAttendance] = useState<AttendanceStore>(defaultAttendance);
  const [homework, setHomework] = useState<Homework[]>(defaultHomework);
  const [grades, setGrades] = useState<Grade[]>(defaultGrades);
  const [fees, setFees] = useState<FeeInvoice[]>(defaultFees);
  const [notices, setNotices] = useState<Notice[]>(defaultNotices);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from local storage
  useEffect(() => {
    try {
      const storedRole = localStorage.getItem("sm_role");
      const storedYear = localStorage.getItem("sm_academic_year");
      const storedStudents = localStorage.getItem("sm_students");
      const storedTeachers = localStorage.getItem("sm_teachers");
      const storedClasses = localStorage.getItem("sm_classes");
      const storedAttendance = localStorage.getItem("sm_attendance");
      const storedHomework = localStorage.getItem("sm_homework");
      const storedGrades = localStorage.getItem("sm_grades");
      const storedFees = localStorage.getItem("sm_fees");
      const storedNotices = localStorage.getItem("sm_notices");

      if (storedRole) setActiveRole(storedRole as Role);
      if (storedYear) setAcademicYearState(storedYear);
      if (storedStudents) setStudents(JSON.parse(storedStudents));
      if (storedTeachers) setTeachers(JSON.parse(storedTeachers));
      if (storedClasses) setClasses(JSON.parse(storedClasses));
      if (storedAttendance) setAttendance(JSON.parse(storedAttendance));
      if (storedHomework) setHomework(JSON.parse(storedHomework));
      if (storedGrades) setGrades(JSON.parse(storedGrades));
      if (storedFees) setFees(JSON.parse(storedFees));
      if (storedNotices) setNotices(JSON.parse(storedNotices));
    } catch (e) {
      console.error("Failed to load local state", e);
    }
    setIsLoaded(true);
  }, []);

  // Fetch teachers from API
  useEffect(() => {
    async function fetchTeachers() {
      try {
        const res = await fetch("/api/teachers?limit=100", { headers: getAuthHeaders() });
        const data = await res.json();
        if (res.ok && data.success) {
          const apiTeachers = data.data.teachers.map((t: any) => ({
            id: t._id,
            name: t.name,
            email: t.email || "",
            subject: t.subject_specialization || "",
            classId: "", // Not explicitly stored in teacher model but required by UI interface
            joinedDate: new Date(t.join_date || t.createdAt).toISOString().split("T")[0],
            status: t.is_active ? "Active" : "Inactive"
          }));
          setTeachers(apiTeachers);
        }
      } catch (err) {
        console.error("Failed to fetch teachers from API:", err);
      }
    }
    fetchTeachers();
  }, []);

  // Save changes to local storage
  useEffect(() => {
    if (!isLoaded) return;
    localStorage.setItem("sm_role", activeRole);
  }, [activeRole, isLoaded]);

  useEffect(() => {
    if (!isLoaded) return;
    localStorage.setItem("sm_academic_year", academicYear);
  }, [academicYear, isLoaded]);

  useEffect(() => {
    if (!isLoaded) return;
    localStorage.setItem("sm_students", JSON.stringify(students));
  }, [students, isLoaded]);

  useEffect(() => {
    if (!isLoaded) return;
    localStorage.setItem("sm_teachers", JSON.stringify(teachers));
  }, [teachers, isLoaded]);

  useEffect(() => {
    if (!isLoaded) return;
    localStorage.setItem("sm_classes", JSON.stringify(classes));
  }, [classes, isLoaded]);

  useEffect(() => {
    if (!isLoaded) return;
    localStorage.setItem("sm_attendance", JSON.stringify(attendance));
  }, [attendance, isLoaded]);

  useEffect(() => {
    if (!isLoaded) return;
    localStorage.setItem("sm_homework", JSON.stringify(homework));
  }, [homework, isLoaded]);

  useEffect(() => {
    if (!isLoaded) return;
    localStorage.setItem("sm_grades", JSON.stringify(grades));
  }, [grades, isLoaded]);

  useEffect(() => {
    if (!isLoaded) return;
    localStorage.setItem("sm_fees", JSON.stringify(fees));
  }, [fees, isLoaded]);

  useEffect(() => {
    if (!isLoaded) return;
    localStorage.setItem("sm_notices", JSON.stringify(notices));
  }, [notices, isLoaded]);

  // Actions
  const setRole = (role: Role) => setActiveRole(role);

  const addStudent = (student: Omit<Student, "id" | "joinedDate">) => {
    const newStudent: Student = {
      ...student,
      id: `s${Date.now()}`,
      joinedDate: new Date().toISOString().split("T")[0]
    };
    setStudents((prev) => [...prev, newStudent]);
  };

  const updateStudent = (updatedStudent: Student) => {
    setStudents((prev) => prev.map((s) => (s.id === updatedStudent.id ? updatedStudent : s)));
  };

  const deleteStudent = (id: string) => {
    setStudents((prev) => prev.filter((s) => s.id !== id));
  };

  const addTeacher = (teacher: Omit<Teacher, "id" | "joinedDate">) => {
    const newTeacher: Teacher = {
      ...teacher,
      id: `t${Date.now()}`,
      joinedDate: new Date().toISOString().split("T")[0]
    };
    setTeachers((prev) => [...prev, newTeacher]);
  };

  const updateTeacher = (updatedTeacher: Teacher) => {
    setTeachers((prev) => prev.map((t) => (t.id === updatedTeacher.id ? updatedTeacher : t)));
  };

  const deleteTeacher = (id: string) => {
    setTeachers((prev) => prev.filter((t) => t.id !== id));
  };

  const markAttendance = (date: string, records: { studentId: string; status: "Present" | "Absent" | "Late" }[]) => {
    setAttendance((prev) => {
      const updated = { ...prev };
      records.forEach((r) => {
        if (!updated[r.studentId]) {
          updated[r.studentId] = {};
        }
        updated[r.studentId][date] = r.status;
      });
      return updated;
    });
  };

  const addHomework = (hw: Omit<Homework, "id" | "assignedDate" | "submissions">) => {
    const newHw: Homework = {
      ...hw,
      id: `h${Date.now()}`,
      assignedDate: new Date().toISOString().split("T")[0],
      submissions: []
    };
    setHomework((prev) => [newHw, ...prev]);
  };

  const submitHomework = (homeworkId: string, studentId: string, content: string) => {
    setHomework((prev) =>
      prev.map((hw) => {
        if (hw.id !== homeworkId) return hw;
        const existingSubIdx = hw.submissions.findIndex((s) => s.studentId === studentId);
        const newSubmission: HomeworkSubmission = {
          studentId,
          submittedAt: new Date().toISOString(),
          content
        };
        const submissions = [...hw.submissions];
        if (existingSubIdx > -1) {
          submissions[existingSubIdx] = newSubmission;
        } else {
          submissions.push(newSubmission);
        }
        return { ...hw, submissions };
      })
    );
  };

  const gradeHomework = (homeworkId: string, studentId: string, grade: string, feedback: string) => {
    setHomework((prev) =>
      prev.map((hw) => {
        if (hw.id !== homeworkId) return hw;
        const submissions = hw.submissions.map((sub) => {
          if (sub.studentId === studentId) {
            return { ...sub, grade, feedback };
          }
          return sub;
        });
        return { ...hw, submissions };
      })
    );
  };

  const addGrade = (grade: Omit<Grade, "id" | "date">) => {
    const newGrade: Grade = {
      ...grade,
      id: `g${Date.now()}`,
      date: new Date().toISOString().split("T")[0]
    };
    setGrades((prev) => [...prev, newGrade]);
  };

  const payFee = (feeId: string) => {
    setFees((prev) =>
      prev.map((f) =>
        f.id === feeId
          ? { ...f, status: "Paid" as const, paidDate: new Date().toISOString().split("T")[0] }
          : f
      )
    );
  };

  const addFeeInvoice = (invoice: Omit<FeeInvoice, "id" | "status">) => {
    const newInvoice: FeeInvoice = {
      ...invoice,
      id: `f${Date.now()}`,
      status: "Unpaid"
    };
    setFees((prev) => [newInvoice, ...prev]);
  };

  const addNotice = (notice: Omit<Notice, "id" | "date" | "author">) => {
    const newNotice: Notice = {
      ...notice,
      id: `n${Date.now()}`,
      date: new Date().toISOString().split("T")[0],
      author: activeRole === "admin" ? "Administration" : "Principal Office"
    };
    setNotices((prev) => [newNotice, ...prev]);
  };

  const deleteNotice = (id: string) => {
    setNotices((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <AppContext.Provider
      value={{
        activeRole,
        academicYear,
        students,
        teachers,
        classes,
        attendance,
        homework,
        grades,
        fees,
        notices,
        setRole,
        setAcademicYear: setAcademicYearState,
        addStudent,
        updateStudent,
        deleteStudent,
        addTeacher,
        updateTeacher,
        deleteTeacher,
        markAttendance,
        addHomework,
        submitHomework,
        gradeHomework,
        addGrade,
        payFee,
        addFeeInvoice,
        addNotice,
        deleteNotice
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppState() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useAppState must be used within an AppProvider");
  }
  return context;
}
