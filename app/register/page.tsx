"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAppState } from "../context/store";
import { GraduationCap, Mail, Lock, User, Eye, EyeOff } from "lucide-react";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const { setRole } = useAppState();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
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
    <div className="min-h-screen w-full flex bg-background font-sans">
      {/* Left side - Form Area */}
      <div className="flex-1 flex flex-col justify-center items-center bg-card p-8 sm:p-12 relative border-r border-border overflow-y-auto">
        <div className="w-full max-w-[400px] flex flex-col items-center sm:items-start my-auto py-8">
          
          <div className="flex items-center gap-2 mb-10">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <span className="text-[22px] font-bold text-foreground tracking-tight">EduPortal</span>
          </div>

          <div className="w-full mb-8 text-center sm:text-left">
            <h1 className="text-[22px] font-bold text-foreground mb-2">Create an account</h1>
            <p className="text-[14px] text-gray-500 font-normal">
              Enter your details below to get started.
            </p>
          </div>

          <form onSubmit={handleRegister} className="w-full space-y-5">
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[14px] font-semibold text-foreground" htmlFor="name">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <User className="h-[18px] w-[18px]" />
                  </div>
                  <input
                    id="name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2.5 border border-border rounded-lg bg-white text-[14px] text-foreground placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all shadow-sm"
                    placeholder="John Doe"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[14px] font-semibold text-foreground" htmlFor="email">
                  Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <Mail className="h-[18px] w-[18px]" />
                  </div>
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2.5 border border-border rounded-lg bg-white text-[14px] text-foreground placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all shadow-sm"
                    placeholder="name@school.edu"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[14px] font-semibold text-foreground" htmlFor="password">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <Lock className="h-[18px] w-[18px]" />
                  </div>
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full pl-10 pr-10 py-2.5 border border-border rounded-lg bg-white text-[14px] text-foreground placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all shadow-sm"
                    placeholder="Create a strong password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-[18px] w-[18px]" /> : <Eye className="h-[18px] w-[18px]" />}
                  </button>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-white py-2.5 px-4 rounded-lg text-[14px] font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed shadow-md mt-6"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                "Sign Up"
              )}
            </button>
          </form>

          <p className="w-full text-center text-[14px] text-gray-500 font-normal mt-8">
            Already have an account?{" "}
            <Link href="/login" className="font-semibold text-primary hover:text-primary/80 transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>

      {/* Right side - Image / Branding Area */}
      <div className="hidden lg:flex flex-1 flex-col justify-center items-center bg-background p-12 relative overflow-hidden">
        {/* Subtle decorative background shapes */}
        <div className="absolute top-[-10%] right-[-5%] w-[400px] h-[400px] bg-primary/10 rounded-full blur-[80px]" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[300px] h-[300px] bg-success/10 rounded-full blur-[80px]" />
        
        <div className="relative z-10 max-w-[500px] text-center">
          <div className="mb-10 mx-auto w-[360px] h-[360px] bg-white rounded-2xl shadow-xl shadow-primary/5 flex items-center justify-center border border-border p-8 overflow-hidden relative">
            <svg viewBox="0 0 400 300" className="w-full h-full text-primary" fill="currentColor" opacity="0.1">
              <rect x="50" y="50" width="300" height="200" rx="10" />
              <circle cx="100" cy="100" r="20" />
              <rect x="140" y="85" width="160" height="10" rx="5" />
              <rect x="140" y="105" width="100" height="10" rx="5" />
              <rect x="100" y="150" width="200" height="60" rx="5" />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-tr from-primary/10 to-transparent">
              <User className="w-24 h-24 text-primary mb-4" />
              <h3 className="text-[18px] font-semibold text-foreground">Join the community.</h3>
            </div>
          </div>
          
          <h2 className="text-[22px] font-semibold text-foreground tracking-tight mb-4">
            Unlock your institution's potential.
          </h2>
          <p className="text-[14px] text-gray-500 font-normal leading-relaxed max-w-[400px] mx-auto">
            Get instant access to attendance, grading, and powerful scheduling tools.
          </p>
        </div>
      </div>
    </div>
  );
}
