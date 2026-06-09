import React from "react";
import { Modal } from "../ui/modal";
import { X } from "lucide-react";
import { ApiStudent } from "../../hooks/useStudents";

interface LoginDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: ApiStudent | null;
}

export function LoginDetailsModal({ isOpen, onClose, student }: LoginDetailsModalProps) {
  if (!student) return null;

  const getAvatar = (name: string) => name.toLowerCase().match(/^[a-m]/) ? "/asset 12.webp" : "/asset 14.webp";
  const getSection = (id: string) => id.includes("1") ? "A" : id.includes("2") ? "B" : "C";

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-opacity ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative bg-white dark:bg-slate-900 rounded-xl shadow-xl w-full max-w-2xl flex flex-col max-h-[90vh] overflow-hidden transform transition-all scale-100">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-border">
          <h2 className="text-[18px] font-bold text-slate-900 dark:text-white">Login Details</h2>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto custom-scrollbar flex flex-col items-center">
           
           {/* Top Info */}
           <div className="flex flex-col items-center gap-2 mb-6 text-center">
              <img src={getAvatar(student.name)} className="w-12 h-12 rounded object-cover shadow-sm" alt="Student" />
              <div>
                <h3 className="text-[14px] font-bold text-slate-900 dark:text-white">{student.name}</h3>
                <p className="text-[12px] text-slate-500 font-medium">III, {getSection(student._id)}</p>
              </div>
           </div>

           {/* Table */}
           <div className="w-full border border-slate-100 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
              <table className="w-full text-left text-[13px]">
                 <thead>
                    <tr className="bg-slate-50/50 dark:bg-slate-800/50 border-b border-border text-[12px] font-bold text-slate-700 dark:text-slate-200">
                       <th className="px-5 py-3.5 flex items-center gap-1 cursor-pointer">User Type <span className="text-[10px] text-slate-400">▼</span></th>
                       <th className="px-5 py-3.5 cursor-pointer">User Name <span className="text-[10px] text-slate-400">▼</span></th>
                       <th className="px-5 py-3.5 cursor-pointer">Password <span className="text-[10px] text-slate-400">▼</span></th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-border bg-white dark:bg-slate-900">
                    <tr className="hover:bg-slate-50/50 dark:bg-slate-800/50 transition-colors">
                       <td className="px-5 py-4 text-slate-600 dark:text-slate-300">Parent</td>
                       <td className="px-5 py-4 text-slate-700 dark:text-slate-200 font-medium">parent53</td>
                       <td className="px-5 py-4 text-slate-700 dark:text-slate-200 font-mono">parent@53</td>
                    </tr>
                    <tr className="hover:bg-slate-50/50 dark:bg-slate-800/50 transition-colors">
                       <td className="px-5 py-4 text-slate-600 dark:text-slate-300">Student</td>
                       <td className="px-5 py-4 text-slate-700 dark:text-slate-200 font-medium">student20</td>
                       <td className="px-5 py-4 text-slate-700 dark:text-slate-200 font-mono">stdt@53</td>
                    </tr>
                 </tbody>
              </table>
           </div>

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-border flex items-center justify-end bg-slate-50 dark:bg-slate-800/30">
          <button onClick={onClose} className="px-5 py-2.5 rounded-lg text-[13px] font-bold text-slate-700 dark:text-slate-200 bg-[#F1F5F9] dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
