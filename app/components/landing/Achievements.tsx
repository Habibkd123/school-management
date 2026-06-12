import React from "react";
import { Award, Medal, Star, Shield } from "lucide-react";

export function Achievements() {
  const achievements = [
    { number: "Top 1%", label: "CBSE National Rankers", color: "text-[#F59E0B]" },
    { number: "50+", label: "IIT-JEE / NEET Selections", color: "text-[#0F172A]" },
    { number: "120+", label: "State Level Sports Medals", color: "text-[#F59E0B]" },
    { number: "No. 1", label: "Ranked School in District", color: "text-[#0F172A]" }
  ];

  return (
    <section className="py-24 bg-white border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-[#F59E0B] font-bold tracking-widest uppercase text-[12px] mb-3">Our Pride</h2>
          <h3 className="text-4xl md:text-5xl font-serif font-bold text-[#0F172A] mb-6 leading-tight">
            Milestones & Achievements
          </h3>
          <p className="text-[15px] text-slate-600 leading-relaxed">
            Consistently producing academic toppers and sports champions at the state and national levels.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {achievements.map((item, idx) => (
            <div key={idx} className="flex flex-col items-center justify-center text-center p-8 bg-slate-50 rounded-sm border border-slate-200 hover:border-[#F59E0B] hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="w-24 h-24 rounded-full bg-white shadow-md flex items-center justify-center mb-6 border-4 border-slate-100">
                <Star className={`w-8 h-8 ${item.color}`} fill="currentColor" />
              </div>
              <h4 className={`text-3xl font-black ${item.color} mb-2`}>{item.number}</h4>
              <p className="text-slate-700 font-bold text-[13px] uppercase tracking-wide">{item.label}</p>
            </div>
          ))}
        </div>
        
      </div>
    </section>
  );
}
