import React from "react";
import { ArrowRight, Play } from "lucide-react";

interface HeroData {
  about?: {
    hero_tagline?: string;
    hero_description?: string;
    hero_image_url?: string;
    hero_side_image_url?: string;
    hero_video_url?: string;
    founded_year?: number;
  };
  admissions?: {
    admission_open?: boolean;
    apply_url?: string;
  };
}

export function Hero({ data }: { data?: HeroData | null }) {
  const tagline = data?.about?.hero_tagline || "Excellence in Education & Character";
  const description = data?.about?.hero_description || "A premium CBSE institution fostering holistic development, academic rigor, and cultural values to shape the global leaders of tomorrow.";
  const foundedYear = data?.about?.founded_year;
  const sinceLabel = foundedYear
    ? `Empowering Minds Since ${foundedYear}`
    : "Empowering Minds Since 1999";
  const applyUrl = data?.admissions?.apply_url || "#admissions";
  const admissionOpen = data?.admissions?.admission_open ?? true;

  return (
    <section id="home" className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-[#0F172A]">
      {/* Background Decor */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-r from-[#0F172A] via-[#0F172A]/90 to-transparent z-10" />
        <img 
          src={data?.about?.hero_image_url || "https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?q=80&w=1920&auto=format&fit=crop"} 
          alt="Majestic School Campus" 
          className="w-full h-full object-cover opacity-50"
        />
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-20 grid lg:grid-cols-2 gap-16 items-center">
        
        {/* Left Content */}
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-sm bg-[#F59E0B]/20 text-[#FDBA74] font-bold text-[13px] mb-8 border border-[#F59E0B]/30 uppercase tracking-widest">
            <span className="w-2 h-2 rounded-full bg-[#F59E0B] animate-pulse"></span>
            {sinceLabel}
          </div>
          
          <h1 className="text-5xl lg:text-7xl font-serif font-bold text-white leading-[1.15] mb-6">
            {tagline.includes("&") || tagline.includes(" ") ? (
              <>
                {tagline.split(" ").slice(0, Math.ceil(tagline.split(" ").length / 2)).join(" ")} <br/>
                <span className="text-[#F59E0B]">
                  {tagline.split(" ").slice(Math.ceil(tagline.split(" ").length / 2)).join(" ")}
                </span>
              </>
            ) : (
              <span className="text-[#F59E0B]">{tagline}</span>
            )}
          </h1>
          
          <p className="text-lg text-slate-300 mb-10 leading-relaxed font-medium max-w-lg border-l-4 border-[#F59E0B] pl-4">
            {description}
          </p>
          
          <div className="flex flex-col sm:flex-row items-center gap-4">
            {admissionOpen ? (
              <a
                href={applyUrl}
                className="w-full sm:w-auto px-8 py-4 rounded-sm bg-[#F59E0B] text-white font-bold text-[15px] hover:bg-[#D97706] shadow-xl shadow-[#F59E0B]/20 transition-all duration-300 flex items-center justify-center gap-2 uppercase tracking-wide"
              >
                Apply For Admission <ArrowRight className="w-5 h-5" />
              </a>
            ) : (
              <span className="w-full sm:w-auto px-8 py-4 rounded-sm bg-slate-700 text-slate-400 font-bold text-[15px] flex items-center justify-center gap-2 uppercase tracking-wide cursor-not-allowed">
                Admissions Closed
              </span>
            )}
            <a
              href={data?.about?.hero_video_url || "/gallery/videos"}
              target={data?.about?.hero_video_url ? "_blank" : undefined}
              rel={data?.about?.hero_video_url ? "noopener noreferrer" : undefined}
              className="w-full sm:w-auto px-8 py-4 rounded-sm bg-white/10 text-white font-bold text-[15px] border border-white/20 hover:bg-white/20 backdrop-blur-md transition-all duration-300 flex items-center justify-center gap-2 uppercase tracking-wide"
            >
              <Play className="w-5 h-5 text-[#F59E0B]" fill="currentColor" /> Virtual Tour
            </a>
          </div>
        </div>
        
        {/* Right Image/Badge Overlay */}
        <div className="relative hidden lg:block">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[#F59E0B] rounded-full blur-[100px] opacity-30" />
          <div className="relative border-8 border-white/10 rounded-sm overflow-hidden transform rotate-2 hover:rotate-0 transition-transform duration-500 shadow-2xl">
            <img 
              src={data?.about?.hero_side_image_url || "https://images.unsplash.com/photo-1577896851231-70ef18881754?q=80&w=1200&auto=format&fit=crop"} 
              alt="Indian students studying" 
              className="w-full h-[500px] object-cover"
            />
          </div>
        </div>
        
      </div>
    </section>
  );
}
