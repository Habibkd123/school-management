import React from "react";
import { ArrowRight, Play } from "lucide-react";

export function Hero() {
  return (
    <section id="home" className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-[#0F172A]">
      {/* Background Decor */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-r from-[#0F172A] via-[#0F172A]/90 to-transparent z-10" />
        <img 
          src="https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?q=80&w=1920&auto=format&fit=crop" 
          alt="Majestic School Campus" 
          className="w-full h-full object-cover opacity-50"
        />
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-20 grid lg:grid-cols-2 gap-16 items-center">
        
        {/* Left Content */}
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-sm bg-[#F59E0B]/20 text-[#FDBA74] font-bold text-[13px] mb-8 border border-[#F59E0B]/30 uppercase tracking-widest">
            <span className="w-2 h-2 rounded-full bg-[#F59E0B] animate-pulse"></span>
            Empowering Minds Since 1999
          </div>
          
          <h1 className="text-5xl lg:text-7xl font-serif font-bold text-white leading-[1.15] mb-6">
            Excellence in <br/>
            <span className="text-[#F59E0B]">Education & Character</span>
          </h1>
          
          <p className="text-lg text-slate-300 mb-10 leading-relaxed font-medium max-w-lg border-l-4 border-[#F59E0B] pl-4">
            A premium CBSE institution fostering holistic development, academic rigor, and cultural values to shape the global leaders of tomorrow.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <button className="w-full sm:w-auto px-8 py-4 rounded-sm bg-[#F59E0B] text-white font-bold text-[15px] hover:bg-[#D97706] shadow-xl shadow-[#F59E0B]/20 transition-all duration-300 flex items-center justify-center gap-2 uppercase tracking-wide">
              Apply For Admission <ArrowRight className="w-5 h-5" />
            </button>
            <button className="w-full sm:w-auto px-8 py-4 rounded-sm bg-white/10 text-white font-bold text-[15px] border border-white/20 hover:bg-white/20 backdrop-blur-md transition-all duration-300 flex items-center justify-center gap-2 uppercase tracking-wide">
              <Play className="w-5 h-5 text-[#F59E0B]" fill="currentColor" /> Virtual Tour
            </button>
          </div>
        </div>
        
        {/* Right Image/Badge Overlay */}
        <div className="relative hidden lg:block">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[#F59E0B] rounded-full blur-[100px] opacity-30" />
          <div className="relative border-8 border-white/10 rounded-sm overflow-hidden transform rotate-2 hover:rotate-0 transition-transform duration-500 shadow-2xl">
            <img 
              src="https://images.unsplash.com/photo-1577896851231-70ef18881754?q=80&w=1200&auto=format&fit=crop" 
              alt="Indian students studying" 
              className="w-full h-[500px] object-cover"
            />
          </div>
        </div>
        
      </div>
    </section>
  );
}
