"use client";

import React, { useState } from "react";
import Image from "next/image";
import { 
  RefreshCw, Upload, Edit, EyeOff, Eye
} from "lucide-react";

export default function ProfilePage() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="space-y-6 bg-[#F8FAFC] dark:bg-[#0F172A] min-h-screen -m-6 p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">Profile</h1>
          <div className="flex items-center gap-2 text-[13px] text-slate-500 dark:text-slate-400 mt-1">
            <span>Dashboard</span>
            <span>/</span>
            <span className="hover:text-[#F59E0B] cursor-pointer">Settings</span>
            <span>/</span>
            <span className="text-slate-900 dark:text-white font-medium">Profile</span>
          </div>
        </div>

        <button className="w-9 h-9 rounded-full bg-white dark:bg-slate-900 border border-border flex items-center justify-center text-slate-500 dark:text-slate-400 hover:text-[#F59E0B] hover:bg-indigo-50 transition-colors shadow-sm cursor-pointer">
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        
        {/* LEFT COLUMN */}
        <div className="w-full lg:w-[300px] shrink-0 space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-border rounded-xl shadow-sm overflow-hidden text-left">
            <div className="p-5 border-b border-border">
              <h2 className="text-[16px] font-bold text-slate-800 dark:text-slate-100">
                Personal Information
              </h2>
            </div>
            
            <div className="p-5 flex flex-col gap-6">
              {/* Avatar Section */}
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full overflow-hidden bg-slate-100 dark:bg-slate-800 shrink-0 relative">
                  <Image 
                    src="https://ui-avatars.com/api/?name=Admin&background=F1F5F9&color=5D6BEE&bold=true" 
                    alt="Admin Photo" 
                    fill 
                    className="object-cover" 
                  />
                </div>
                <div>
                  <h3 className="text-[14px] font-bold text-[#0F172A] dark:text-slate-100 mb-1">Edit Your Photo</h3>
                  <div className="flex items-center gap-3 text-[13px]">
                    <button className="text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:text-slate-200 transition-colors font-medium">Delete</button>
                    <button className="text-[#F59E0B] hover:text-[#D97706] transition-colors font-medium">Update</button>
                  </div>
                </div>
              </div>

              {/* Upload Box */}
              <div className="border border-dashed border-slate-300 rounded-lg bg-slate-50/50 dark:bg-slate-800/50 p-6 flex flex-col items-center justify-center text-center hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer group">
                <Upload className="w-6 h-6 text-slate-400 dark:text-slate-500 mb-3 group-hover:text-[#F59E0B] transition-colors" />
                <p className="text-[12px] text-slate-600 dark:text-slate-300 mb-1">
                  <span className="text-[#F59E0B] font-bold">Click to Upload</span> or drag and drop
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  JPG or PNG<br/>(Max 450 x 450 px)
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="flex-1 space-y-6">
          
          {/* Personal Information */}
          <div className="bg-white dark:bg-slate-900 border border-border rounded-xl shadow-sm overflow-hidden text-left">
            <div className="p-5 border-b border-border flex items-center justify-between">
              <h2 className="text-[16px] font-bold text-slate-800 dark:text-slate-100">
                Personal Information
              </h2>
              <button className="flex items-center gap-2 px-4 py-1.5 bg-[#F59E0B] text-white text-[13px] font-bold rounded-lg hover:bg-[#D97706] transition-colors shadow-sm">
                <Edit className="w-3.5 h-3.5" /> Edit
              </button>
            </div>
            
            <div className="p-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[13px] font-bold text-[#0F172A] dark:text-slate-100">First Name</label>
                  <input 
                    type="text" 
                    placeholder="Enter First Name" 
                    className="px-4 py-2.5 bg-[#F8FAFC] dark:bg-[#0F172A] border border-border rounded-lg text-[13px] outline-none focus:border-[#F59E0B] transition-colors w-full"
                  />
                </div>
                
                <div className="flex flex-col gap-1.5">
                  <label className="text-[13px] font-bold text-[#0F172A] dark:text-slate-100">Last Name</label>
                  <input 
                    type="text" 
                    placeholder="Enter Last Name" 
                    className="px-4 py-2.5 bg-[#F8FAFC] dark:bg-[#0F172A] border border-border rounded-lg text-[13px] outline-none focus:border-[#F59E0B] transition-colors w-full"
                  />
                </div>

                <div className="flex flex-col gap-1.5 sm:col-span-2">
                  <label className="text-[13px] font-bold text-[#0F172A] dark:text-slate-100">Email Address</label>
                  <input 
                    type="email" 
                    placeholder="Enter Email" 
                    className="px-4 py-2.5 bg-[#F8FAFC] dark:bg-[#0F172A] border border-border rounded-lg text-[13px] outline-none focus:border-[#F59E0B] transition-colors w-full"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[13px] font-bold text-[#0F172A] dark:text-slate-100">User Name</label>
                  <input 
                    type="text" 
                    placeholder="Enter User Name" 
                    className="px-4 py-2.5 bg-[#F8FAFC] dark:bg-[#0F172A] border border-border rounded-lg text-[13px] outline-none focus:border-[#F59E0B] transition-colors w-full"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[13px] font-bold text-[#0F172A] dark:text-slate-100">Phone Number</label>
                  <input 
                    type="text" 
                    placeholder="Enter Phone Number" 
                    className="px-4 py-2.5 bg-[#F8FAFC] dark:bg-[#0F172A] border border-border rounded-lg text-[13px] outline-none focus:border-[#F59E0B] transition-colors w-full"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Address Information */}
          <div className="bg-white dark:bg-slate-900 border border-border rounded-xl shadow-sm overflow-hidden text-left">
            <div className="p-5 border-b border-border flex items-center justify-between">
              <h2 className="text-[16px] font-bold text-slate-800 dark:text-slate-100">
                Address Information
              </h2>
              <button className="flex items-center gap-2 px-4 py-1.5 bg-[#F59E0B] text-white text-[13px] font-bold rounded-lg hover:bg-[#D97706] transition-colors shadow-sm">
                <Edit className="w-3.5 h-3.5" /> Edit
              </button>
            </div>
            
            <div className="p-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">
                <div className="flex flex-col gap-1.5 sm:col-span-2">
                  <label className="text-[13px] font-bold text-[#0F172A] dark:text-slate-100">Address</label>
                  <input 
                    type="text" 
                    placeholder="Enter Address" 
                    className="px-4 py-2.5 bg-[#F8FAFC] dark:bg-[#0F172A] border border-border rounded-lg text-[13px] outline-none focus:border-[#F59E0B] transition-colors w-full"
                  />
                </div>
                
                <div className="flex flex-col gap-1.5">
                  <label className="text-[13px] font-bold text-[#0F172A] dark:text-slate-100">Country</label>
                  <input 
                    type="text" 
                    placeholder="Enter Country" 
                    className="px-4 py-2.5 bg-[#F8FAFC] dark:bg-[#0F172A] border border-border rounded-lg text-[13px] outline-none focus:border-[#F59E0B] transition-colors w-full"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[13px] font-bold text-[#0F172A] dark:text-slate-100">State / Province</label>
                  <input 
                    type="text" 
                    placeholder="Enter State" 
                    className="px-4 py-2.5 bg-[#F8FAFC] dark:bg-[#0F172A] border border-border rounded-lg text-[13px] outline-none focus:border-[#F59E0B] transition-colors w-full"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[13px] font-bold text-[#0F172A] dark:text-slate-100">City</label>
                  <input 
                    type="text" 
                    placeholder="City" 
                    className="px-4 py-2.5 bg-[#F8FAFC] dark:bg-[#0F172A] border border-border rounded-lg text-[13px] outline-none focus:border-[#F59E0B] transition-colors w-full"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[13px] font-bold text-[#0F172A] dark:text-slate-100">Postal Code</label>
                  <input 
                    type="text" 
                    placeholder="Enter Postal Code" 
                    className="px-4 py-2.5 bg-[#F8FAFC] dark:bg-[#0F172A] border border-border rounded-lg text-[13px] outline-none focus:border-[#F59E0B] transition-colors w-full"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Password Section */}
          <div className="bg-white dark:bg-slate-900 border border-border rounded-xl shadow-sm overflow-hidden text-left mb-6">
            <div className="p-5 border-b border-border flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/50">
              <h2 className="text-[16px] font-bold text-slate-800 dark:text-slate-100">
                Password
              </h2>
              <button className="px-5 py-1.5 bg-[#F59E0B] text-white text-[13px] font-bold rounded-lg hover:bg-[#D97706] transition-colors shadow-sm">
                Change
              </button>
            </div>
            
            <div className="p-5">
              <div className="flex flex-col gap-1.5 max-w-full">
                <label className="text-[13px] font-bold text-[#0F172A] dark:text-slate-100">Current Password</label>
                <div className="relative">
                  <input 
                    type={showPassword ? "text" : "password"} 
                    className="px-4 py-2.5 bg-[#F8FAFC] dark:bg-[#0F172A] border border-border rounded-lg text-[13px] outline-none focus:border-[#F59E0B] transition-colors w-full pr-10"
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:text-slate-300 transition-colors"
                  >
                    {showPassword ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
