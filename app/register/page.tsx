"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAppState } from "../context/store";
import { Mail, Eye, EyeOff, ChevronRight, User } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

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

export default function RegisterPage() {
  const router = useRouter();
  const { setRole } = useAppState();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      // Mock registration
      setRole("student");
      
      router.push("/dashboard");
    }, 1500);
  };

  return (
    <div className="min-h-screen w-full flex bg-white dark:bg-slate-900 font-sans">
      
      {/* Left Side - Image & News (Hidden on mobile) */}
      <div 
        className="hidden lg:flex flex-1 relative flex-col justify-center items-center p-12 bg-cover bg-center"
        style={{ backgroundImage: `url('https://preskool.dreamstechnologies.com/html/assets/img/authentication/authentication-01.jpg')` }}
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
        <div className="w-full flex justify-center py-10 lg:py-16">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl overflow-hidden bg-white shadow-sm shrink-0">
              <img src="/logo.png" alt="Logo" className="w-full h-full object-contain p-1" />
            </div>
            <span className="text-[24px] font-bold text-slate-800 dark:text-slate-100 tracking-tight">Pre<span className="text-slate-600 dark:text-slate-300">Skool</span></span>
          </div>
        </div>

        {/* Main Form Container */}
        <div className="flex-1 flex flex-col justify-center items-center px-6 sm:px-12 lg:px-16 xl:px-24 pb-20">
          <div className="w-full max-w-[420px] bg-white dark:bg-slate-900 border border-border/60 dark:border-slate-800 rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8">
            
            <div className="mb-6">
              <h1 className="text-[24px] font-bold text-[#202c4b] dark:text-slate-100 mb-2">Register</h1>
              <p className="text-[13px] text-slate-500 dark:text-slate-400">Please enter your details to sign up</p>
            </div>

            {/* Social Logins */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              <button className="flex items-center justify-center py-2.5 rounded-lg bg-[#3B5998] hover:bg-[#314a7e] transition-colors shadow-sm">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M13.397 20.997v-8.196h2.765l.411-3.209h-3.176V7.548c0-.926.258-1.56 1.587-1.56h1.684V3.127A22.336 22.336 0 0014.201 3c-2.444 0-4.122 1.492-4.122 4.231v2.355H7.332v3.209h2.753v8.202h3.312z" />
                </svg>
              </button>
              <button className="flex items-center justify-center py-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors shadow-sm">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
              </button>
              <button className="flex items-center justify-center py-2.5 rounded-lg bg-[#202c4b] hover:bg-[#151d33] transition-colors shadow-sm">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
                </svg>
              </button>
            </div>

            <div className="relative flex items-center py-2 mb-6">
              <div className="flex-grow border-t border-slate-200 dark:border-slate-800"></div>
              <span className="flex-shrink-0 mx-4 text-[12px] text-slate-400 dark:text-slate-500 font-medium">Or</span>
              <div className="flex-grow border-t border-slate-200 dark:border-slate-800"></div>
            </div>

            <form onSubmit={handleRegister} className="space-y-4">
              
              <div className="space-y-1.5">
                <label className="text-[13px] font-bold text-[#202c4b] dark:text-slate-100">Name</label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-4 pr-10 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-[13px] outline-none focus:border-[#5D6BEE] transition-colors"
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
                    <User className="w-4 h-4" />
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[13px] font-bold text-[#202c4b] dark:text-slate-100">Email Address</label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-4 pr-10 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-[13px] outline-none focus:border-[#5D6BEE] transition-colors"
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
                    <Mail className="w-4 h-4" />
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[13px] font-bold text-[#202c4b] dark:text-slate-100">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-4 pr-10 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-[13px] outline-none focus:border-[#5D6BEE] transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:text-slate-300 transition-colors"
                  >
                    {showPassword ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[13px] font-bold text-[#202c4b] dark:text-slate-100">Confirm Password</label>
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

              <div className="flex items-center pt-1 pb-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="checkbox" 
                    required
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    className="rounded border-slate-300 text-[#5D6BEE] focus:ring-[#5D6BEE] w-3.5 h-3.5"
                  />
                  <span className="text-[12px] text-slate-500 dark:text-slate-400 font-medium">
                    I Agree to <Link href="#" className="text-[#5D6BEE] hover:underline">Terms & Privacy</Link>
                  </span>
                </label>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center py-2.5 bg-[#5D6BEE] hover:bg-[#4b58ce] text-white rounded-lg text-[13px] font-semibold transition-colors disabled:opacity-70 disabled:cursor-not-allowed shadow-sm"
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  "Sign Up"
                )}
              </button>
            </form>

            <p className="w-full text-center text-[13px] text-slate-600 dark:text-slate-300 font-medium mt-6">
              Already have an account?{" "}
              <Link href="/login" className="text-[#5D6BEE] hover:text-[#4b58ce] transition-colors">
                Sign In
              </Link>
            </p>
          </div>
          
          {/* Footer Copyright */}
          <div className="mt-8 text-center shrink-0">
            <p className="text-[12px] text-slate-500 dark:text-slate-400 font-medium mb-4">Copyright © 2024 - Preskool</p>
          </div>
        </div>
      </div>
    </div>
  );
}
