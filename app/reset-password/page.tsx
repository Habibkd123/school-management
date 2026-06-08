"use client";

import React, { useState } from "react";
import { Eye, EyeOff, ChevronRight } from "lucide-react";
import Link from "next/link";

const newsItems = [
  {
    title: "Summer Vacation Holiday Homework",
    desc: "The school will remain closed from April 20th to June..."
  },
  {
    title: "New Academic Session Admission Start(2024-25)",
    desc: "An academic term is a portion of an academic year, the time ...."
  },
  {
    title: "Date sheet Final Exam Nursery to Sr.Kg",
    desc: "Dear Parents, As the final examination for the session 2024-25 is ..."
  },
  {
    title: "Annual Day Function",
    desc: "Annual functions provide a platform for students to showcase their..."
  },
  {
    title: "Summer Vacation Holiday Homework",
    desc: "The school will remain closed from April 20th to June 15th for summer..."
  }
];

export default function ResetPasswordPage() {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      // In a real app, show success message here
    }, 1500);
  };

  return (
    <div className="min-h-screen w-full flex bg-white dark:bg-slate-900 font-sans">
      
      {/* Left Side - Image & News (Hidden on mobile) */}
      <div 
        className="hidden lg:flex flex-1 relative flex-col justify-center items-center p-12 bg-cover bg-center"
        style={{ backgroundImage: `url('https://preskool.dreamstechnologies.com/html/assets/img/authentication/authentication-04.jpg')` }}
      >
        {/* Blue Tint Overlay */}
        <div className="absolute inset-0 bg-[#5D6BEE]/80 dark:bg-slate-900/80 backdrop-blur-[2px]" />

        {/* Glassmorphism Card */}
        <div className="relative z-10 w-full max-w-[500px] bg-white/20 backdrop-blur-md border border-white/30 rounded-2xl p-6 shadow-2xl">
          <h2 className="text-xl font-bold text-white mb-6">What's New on Preskool !!!</h2>
          
          <div className="space-y-3">
            {newsItems.map((item, idx) => (
              <div key={idx} className="bg-white dark:bg-slate-900 rounded-lg p-4 flex items-center justify-between gap-4 cursor-pointer hover:shadow-md transition-shadow">
                <div className="flex flex-col gap-1">
                  <h3 className="text-[13px] font-bold text-slate-800 dark:text-slate-100 leading-tight">{item.title}</h3>
                  <p className="text-[12px] text-slate-500 dark:text-slate-400 leading-tight truncate max-w-[320px]">{item.desc}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 dark:text-slate-500 shrink-0" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 flex flex-col relative bg-white dark:bg-slate-900 h-screen overflow-y-auto">
        
        {/* Header Logo */}
        <div className="w-full flex justify-center pt-10 pb-6 lg:pt-16 lg:pb-10 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl overflow-hidden bg-white shadow-sm shrink-0">
              <img src="/logo.png" alt="Logo" className="w-full h-full object-contain p-1" />
            </div>
            <span className="text-[24px] font-bold text-slate-800 dark:text-slate-100 tracking-tight">Pre<span className="text-slate-600 dark:text-slate-300">Skool</span></span>
          </div>
        </div>

        {/* Main Form Container */}
        <div className="flex-1 flex flex-col justify-start items-center px-6 sm:px-12 lg:px-16 xl:px-24">
          <div className="w-full max-w-[420px] bg-white dark:bg-slate-900 border border-border/60 dark:border-slate-800 rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8">
            
            <div className="mb-6">
              <h1 className="text-[22px] font-bold text-[#202c4b] dark:text-slate-100 mb-2">Reset Password?</h1>
              <p className="text-[13px] text-slate-500 dark:text-slate-400 leading-relaxed">
                Enter New Password & Confirm Password to get inside
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              
              <div className="space-y-1.5">
                <label className="text-[13px] font-bold text-[#202c4b] dark:text-slate-100">Old Password</label>
                <div className="relative">
                  <input
                    type={showOldPassword ? "text" : "password"}
                    required
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    className="w-full pl-4 pr-10 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-[13px] outline-none focus:border-[#5D6BEE] transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowOldPassword(!showOldPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:text-slate-300 transition-colors"
                  >
                    {showOldPassword ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[13px] font-bold text-[#202c4b] dark:text-slate-100">New Password</label>
                <div className="relative">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full pl-4 pr-10 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-[13px] outline-none focus:border-[#5D6BEE] transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:text-slate-300 transition-colors"
                  >
                    {showNewPassword ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-1.5 pb-2">
                <label className="text-[13px] font-bold text-[#202c4b] dark:text-slate-100">New Confirm Password</label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full pl-4 pr-10 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-[13px] outline-none focus:border-[#5D6BEE] transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:text-slate-300 transition-colors"
                  >
                    {showConfirmPassword ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center py-2.5 bg-[#5D6BEE] hover:bg-[#4b58ce] text-white rounded-lg text-[13px] font-semibold transition-colors disabled:opacity-70 disabled:cursor-not-allowed shadow-sm"
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  "Change Password"
                )}
              </button>
            </form>

            <p className="w-full text-center text-[13px] text-slate-600 dark:text-slate-300 font-medium mt-6">
              Return to{" "}
              <Link href="/login" className="text-[#5D6BEE] hover:text-[#4b58ce] transition-colors">
                Login
              </Link>
            </p>
          </div>
          
          {/* Footer Copyright */}
          <div className="mt-auto pt-8 text-center shrink-0 w-full mb-8">
            <p className="text-[12px] text-slate-500 dark:text-slate-400 font-medium">Copyright © 2024 - Preskool</p>
          </div>
        </div>
      </div>
    </div>
  );
}
