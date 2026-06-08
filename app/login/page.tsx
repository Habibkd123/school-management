"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAppState } from "../context/store";
import { GraduationCap, Mail, Lock, Eye, EyeOff } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const { setRole } = useAppState();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      // Mock login logic based on email
      if (email.includes("admin")) {
        setRole("admin");
      } else if (email.includes("teacher")) {
        setRole("teacher");
      } else {
        setRole("student");
      }
      
      router.push("/dashboard");
    }, 1500);
  };

  return (
    <div className="min-h-screen w-full flex bg-background font-sans">
      {/* Left side - Form Area */}
      <div className="flex-1 flex flex-col justify-center items-center bg-card p-8 sm:p-12 relative border-r border-border">
        <div className="w-full max-w-[400px] flex flex-col items-center sm:items-start">
          
          <div className="flex items-center gap-2 mb-10">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <span className="text-[22px] font-bold text-foreground tracking-tight">EduPortal</span>
          </div>

          <div className="w-full mb-8 text-center sm:text-left">
            <h1 className="text-[22px] font-bold text-foreground mb-2">Welcome Back!</h1>
            <p className="text-[14px] text-gray-500 font-normal">
              Please enter your details to sign in.
            </p>
          </div>

          <form onSubmit={handleLogin} className="w-full space-y-5">
            <div className="space-y-4">
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
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-[14px] font-semibold text-foreground" htmlFor="password">
                    Password
                  </label>
                  <a href="/reset-password" className="text-[12px] font-semibold text-primary hover:text-primary/80 transition-colors">
                    Forgot password?
                  </a>
                </div>
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
                    placeholder="Enter your password"
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
              className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-white py-2.5 px-4 rounded-lg text-[14px] font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed shadow-md"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          <div className="relative flex items-center py-6 w-full">
            <div className="flex-grow border-t border-border"></div>
            <span className="flex-shrink-0 mx-4 text-[12px] text-gray-500 font-normal">Or continue with</span>
            <div className="flex-grow border-t border-border"></div>
          </div>

          <div className="grid grid-cols-2 gap-4 w-full">
            <button className="flex items-center justify-center gap-2 py-2.5 px-4 border border-border rounded-lg hover:bg-gray-50 transition-colors text-foreground font-semibold text-[14px] bg-white shadow-sm">
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Google
            </button>
            <button className="flex items-center justify-center gap-2 py-2.5 px-4 border border-border rounded-lg hover:bg-gray-50 transition-colors text-foreground font-semibold text-[14px] bg-white shadow-sm">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
              </svg>
              GitHub
            </button>
          </div>

          <p className="w-full text-center text-[14px] text-gray-500 font-normal mt-8">
            Don't have an account?{" "}
            <Link href="/register" className="font-semibold text-primary hover:text-primary/80 transition-colors">
              Sign up
            </Link>
          </p>
        </div>
      </div>

      {/* Right side - Image / Branding Area */}
      <div className="hidden lg:flex flex-1 flex-col justify-center items-center bg-background p-12 relative overflow-hidden">
        {/* Subtle decorative background shapes */}
        <div className="absolute top-[-10%] right-[-5%] w-[400px] h-[400px] bg-primary/10 rounded-full blur-[80px]" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[300px] h-[300px] bg-info/10 rounded-full blur-[80px]" />
        
        <div className="relative z-10 max-w-[500px] text-center">
          <div className="mb-10 mx-auto w-[360px] h-[360px] bg-white rounded-2xl shadow-xl shadow-primary/5 flex items-center justify-center border border-border p-8 overflow-hidden relative">
            <svg viewBox="0 0 400 300" className="w-full h-full text-primary" fill="currentColor" opacity="0.1">
              <rect x="50" y="50" width="300" height="200" rx="10" />
              <circle cx="100" cy="100" r="20" />
              <rect x="140" y="85" width="160" height="10" rx="5" />
              <rect x="140" y="105" width="100" height="10" rx="5" />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-tr from-primary/10 to-transparent">
              <GraduationCap className="w-24 h-24 text-primary mb-4" />
              <h3 className="text-[18px] font-semibold text-foreground">Manage everything.</h3>
            </div>
          </div>
          
          <h2 className="text-[22px] font-semibold text-foreground tracking-tight mb-4">
            The complete management platform.
          </h2>
          <p className="text-[14px] text-gray-500 font-normal leading-relaxed max-w-[400px] mx-auto">
            Experience a seamless workflow with our powerful tools designed specifically for modern educational institutions.
          </p>
        </div>
      </div>
    </div>
  );
}
