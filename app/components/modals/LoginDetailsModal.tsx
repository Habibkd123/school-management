import React from "react";
import { X, Lock } from "lucide-react";
import { ApiStudent } from "../../hooks/useStudents";
import { ApiTeacher } from "../../hooks/useTeachers";

export interface ApiParentForModal {
  _id: string;
  name: string;
  email?: string;
  user_id?: string | { _id: string; name: string; email: string; role: string; is_active: boolean } | null;
}

interface LoginDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  student?: ApiStudent | null;
  parent?: ApiParentForModal | null;
  teacher?: ApiTeacher | null;
  target: "student" | "parent" | "teacher";
}

export function LoginDetailsModal({ isOpen, onClose, student, parent, teacher, target }: LoginDetailsModalProps) {
  if (!isOpen) return null;

  const getAvatar = (name: string) => `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=F1F5F9&color=5D6BEE&bold=true`;
  const getClassName = (cid: any) => {
    if (typeof cid === "object" && cid?.name) {
      return `${cid.name} - ${cid.section || ""}`;
    }
    return "Student Profile";
  };

  // Resolve user info based on target
  let name = "";
  let subtext = "";
  let email = "";
  let userExists = false;
  let isActive = false;
  let photoUrl = "";
  let badgeLabel = "";
  let badgeStyle = "";

  if (target === "student" && student) {
    name = student.name;
    subtext = getClassName(student.class_id);
    email = (student.user_id && typeof student.user_id === "object" && student.user_id.email) ? student.user_id.email : (student.email || "");
    userExists = !!(student.user_id && typeof student.user_id === "object");
    isActive = student.user_id && typeof student.user_id === "object" ? student.user_id.is_active : student.is_active;
    photoUrl = student.photo_url || "";
    badgeLabel = "🎓 Student";
    badgeStyle = "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300";
  } else if (target === "parent") {
    // Parent details can come from `parent` prop or from `student.parent_id`
    let parentObj = parent;
    if (!parentObj && student && student.parent_id && typeof student.parent_id === "object") {
      parentObj = student.parent_id as any;
    }

    if (parentObj) {
      name = parentObj.name;
      subtext = "Parent Account";
      email = (parentObj.user_id && typeof parentObj.user_id === "object" && parentObj.user_id.email) ? parentObj.user_id.email : (parentObj.email || "");
      userExists = !!(parentObj.user_id && typeof parentObj.user_id === "object");
      isActive = parentObj.user_id && typeof parentObj.user_id === "object" ? parentObj.user_id.is_active : true;
      photoUrl = "";
      badgeLabel = "👨‍👩‍👧 Parent";
      badgeStyle = "bg-violet-50 dark:bg-violet-900/20 text-violet-700 dark:text-violet-300";
    }
  } else if (target === "teacher" && teacher) {
    name = teacher.name;
    subtext = `Employee ID: ${teacher.employee_id || "—"}`;
    email = (teacher.user_id && typeof teacher.user_id === "object" && teacher.user_id.email) ? teacher.user_id.email : (teacher.email || "");
    userExists = !!(teacher.user_id && typeof teacher.user_id === "object");
    isActive = teacher.user_id && typeof teacher.user_id === "object" ? teacher.user_id.is_active : teacher.is_active;
    photoUrl = teacher.photo_url || "";
    badgeLabel = "💼 Teacher";
    badgeStyle = "bg-[#F59E0B]/10 text-[#F59E0B]";
  }

  // Fallback for avatar
  const avatarUrl = photoUrl || getAvatar(name || "User");

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-opacity ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative bg-white dark:bg-slate-900 rounded-xl shadow-xl w-full max-w-md flex flex-col max-h-[90vh] overflow-hidden transform transition-all scale-100 border border-border text-left">

        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-border">
          <h2 className="text-[16px] font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Lock className="w-4 h-4 text-[#F59E0B]" />
            <span>Login Details</span>
          </h2>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto custom-scrollbar space-y-5">
          {/* User info header */}
          <div className="flex flex-col items-center gap-2 text-center">
            <img src={avatarUrl} className="w-16 h-16 rounded-xl object-cover shadow-sm border border-border" alt="Profile" />
            <div>
              <h3 className="text-[15px] font-bold text-slate-900 dark:text-white">{name || "—"}</h3>
              <p className="text-[12px] text-slate-500 font-medium">{subtext}</p>
            </div>
          </div>

          {/* Details table / representation */}
          <div className="p-4 border border-border bg-slate-50/50 dark:bg-slate-800/20 rounded-xl space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold ${badgeStyle}`}>
                {badgeLabel}
              </span>
              <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-bold ${isActive ? "bg-[#E8F8E8] text-[#1D7F2C]" : "bg-[#FFEBF0] text-[#FF4A6B]"}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${isActive ? "bg-[#1DD04A]" : "bg-[#FF4A6B]"}`} />
                {isActive ? "Active" : "Disabled"}
              </span>
            </div>

            <div className="space-y-2.5 text-[13px] border-t border-border pt-3">
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400 font-medium">Username (Email)</span>
                <span className="font-bold text-slate-900 dark:text-white font-mono break-all max-w-full sm:w-[200px] text-right">
                  {email || "—"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400 font-medium">Linked Account</span>
                <span className="font-bold text-slate-900 dark:text-white">
                  {userExists ? "Connected" : "No Account Linked"}
                </span>
              </div>
              {!userExists && (
                <p className="text-[11px] text-slate-400 italic mt-2">No user account has been created yet. Ensure email is populated in their profile details.</p>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-border flex items-center justify-end bg-slate-50 dark:bg-slate-800/30">
          <button onClick={onClose} className="px-5 py-2 rounded-lg text-[13px] font-bold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-900 border border-border hover:bg-slate-100 transition-colors">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
