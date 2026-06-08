"use client";

import React, { useState } from "react";
import Link from "next/link";
import { GraduationCap, Eye, EyeOff, BookOpen } from "lucide-react";

export default function ResetPasswordPage() {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <div className="min-h-screen w-full flex bg-white font-sans text-foreground">
      {/* Left side - What's New Area */}
      <div className="hidden lg:flex flex-1 relative bg-primary/90 overflow-hidden items-center justify-center p-12">
        {/* Background Image Overlay Simulation */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary to-indigo-800 opacity-90 mix-blend-multiply" />
        
        {/* Glassmorphic Card */}
        <div className="relative z-10 w-full max-w-[500px] bg-white/20 backdrop-blur-md border border-white/30 rounded-2xl p-8 shadow-2xl">
          <h2 className="text-[20px] font-semibold text-white mb-6">What's New on PreSkool !!!</h2>
          
          <div className="space-y-4">
            {/* News Item 1 */}
            <div className="bg-white rounded-xl p-4 flex items-center justify-between cursor-pointer hover:shadow-md transition-shadow">
              <div>
                <h3 className="text-[14px] font-semibold text-gray-900 mb-1">Summer Vacation Holiday Homework</h3>
                <p className="text-[12px] text-gray-500">The school will remain closed from April 20th to June...</p>
              </div>
              <span className="text-gray-400">&raquo;</span>
            </div>
            
            {/* News Item 2 */}
            <div className="bg-white rounded-xl p-4 flex items-center justify-between cursor-pointer hover:shadow-md transition-shadow">
              <div>
                <h3 className="text-[14px] font-semibold text-gray-900 mb-1">New Academic Session Admission Start(2024-25)</h3>
                <p className="text-[12px] text-gray-500">An academic term is a portion of an academic year, the time ...</p>
              </div>
              <span className="text-gray-400">&raquo;</span>
            </div>

            {/* News Item 3 */}
            <div className="bg-white rounded-xl p-4 flex items-center justify-between cursor-pointer hover:shadow-md transition-shadow">
              <div>
                <h3 className="text-[14px] font-semibold text-gray-900 mb-1">Date sheet Final Exam Nursery to Sr.Kg</h3>
                <p className="text-[12px] text-gray-500">Dear Parents, As the final examination for the session 2024-25 is ...</p>
              </div>
              <span className="text-gray-400">&raquo;</span>
            </div>

            {/* News Item 4 */}
            <div className="bg-white rounded-xl p-4 flex items-center justify-between cursor-pointer hover:shadow-md transition-shadow">
              <div>
                <h3 className="text-[14px] font-semibold text-gray-900 mb-1">Annual Day Function</h3>
                <p className="text-[12px] text-gray-500">Annual functions provide a platform for students to showcase their...</p>
              </div>
              <span className="text-gray-400">&raquo;</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Reset Password Form */}
      <div className="flex-1 flex flex-col justify-center items-center bg-white p-8 sm:p-12">
        <div className="w-full max-w-[420px] flex flex-col">
          
          <div className="flex items-center justify-center gap-2 mb-12">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary text-white">
              <BookOpen className="w-5 h-5" />
            </div>
            <span className="text-[24px] font-bold text-gray-900 tracking-tight">PreSkool</span>
          </div>

          <div className="bg-white rounded-2xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-gray-100 p-8">
            <h1 className="text-[22px] font-bold text-gray-900 mb-2">Reset Password?</h1>
            <p className="text-[14px] text-gray-500 mb-8">
              Enter New Password & Confirm Password to get inside
            </p>

            <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[13px] font-semibold text-gray-900" htmlFor="oldPassword">
                    Old Password
                  </label>
                  <div className="relative">
                    <input
                      id="oldPassword"
                      type={showOldPassword ? "text" : "password"}
                      value={oldPassword}
                      onChange={(e) => setOldPassword(e.target.value)}
                      className="block w-full px-3 py-2.5 border border-border rounded-lg text-[14px] focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowOldPassword(!showOldPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400"
                    >
                      {showOldPassword ? <EyeOff className="h-[16px] w-[16px]" /> : <Eye className="h-[16px] w-[16px]" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[13px] font-semibold text-gray-900" htmlFor="newPassword">
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      id="newPassword"
                      type={showNewPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="block w-full px-3 py-2.5 border border-border rounded-lg text-[14px] focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400"
                    >
                      {showNewPassword ? <EyeOff className="h-[16px] w-[16px]" /> : <Eye className="h-[16px] w-[16px]" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[13px] font-semibold text-gray-900" htmlFor="confirmPassword">
                    New Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="block w-full px-3 py-2.5 border border-border rounded-lg text-[14px] focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400"
                    >
                      {showConfirmPassword ? <EyeOff className="h-[16px] w-[16px]" /> : <Eye className="h-[16px] w-[16px]" />}
                    </button>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-primary hover:bg-primary/90 text-white py-2.5 px-4 rounded-lg text-[14px] font-semibold transition-all shadow-sm"
              >
                Change Password
              </button>
            </form>

            <div className="mt-6 text-center text-[13px] text-gray-500">
              Return to <Link href="/login" className="text-primary hover:underline">Log in</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
