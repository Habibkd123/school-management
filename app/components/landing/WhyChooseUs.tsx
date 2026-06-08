import React from "react";
import { Monitor, Users, FlaskConical, Trophy, Laptop, ShieldCheck } from "lucide-react";

export function WhyChooseUs() {
  const reasons = [
    { icon: <Monitor className="w-8 h-8 text-[#0F172A]" />, title: "Smart Classrooms", desc: "Interactive digital boards and modern learning tools in every class.", color: "bg-blue-50" },
    { icon: <Users className="w-8 h-8 text-[#0F172A]" />, title: "Expert Faculty", desc: "Highly qualified educators dedicated to personalized student success.", color: "bg-blue-50" },
    { icon: <FlaskConical className="w-8 h-8 text-[#0F172A]" />, title: "Integrated Coaching", desc: "In-house foundation programs for IIT-JEE, NEET, and Olympiads.", color: "bg-blue-50" },
    { icon: <Trophy className="w-8 h-8 text-[#0F172A]" />, title: "Sports Excellence", desc: "World-class sports infrastructure and professional coaching.", color: "bg-blue-50" },
    { icon: <Laptop className="w-8 h-8 text-[#0F172A]" />, title: "Digital Learning", desc: "Comprehensive e-learning portal and digital library access.", color: "bg-blue-50" },
    { icon: <ShieldCheck className="w-8 h-8 text-[#0F172A]" />, title: "Safe Campus", desc: "24/7 CCTV surveillance and strict campus security measures.", color: "bg-blue-50" },
  ];

  return (
    <section className="py-24 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-[#F59E0B] font-bold tracking-widest uppercase text-[12px] mb-3">Core Features</h2>
          <h3 className="text-4xl md:text-5xl font-serif font-bold text-[#0F172A] mb-6 leading-tight">
            Why Parents Choose Us
          </h3>
          <p className="text-[15px] text-slate-600 leading-relaxed">
            We provide a comprehensive educational ecosystem that empowers students to discover their passions and reach their full potential.
          </p>
        </div>

        {/* Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {reasons.map((item, idx) => (
            <div key={idx} className="bg-white p-8 rounded-sm shadow-md border-t-4 border-transparent hover:border-[#F59E0B] hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 group">
              <div className={`w-16 h-16 rounded-sm bg-slate-100 flex items-center justify-center mb-6 group-hover:bg-[#F59E0B]/20 transition-colors duration-300`}>
                {item.icon}
              </div>
              <h4 className="text-xl font-bold text-[#0F172A] mb-3">{item.title}</h4>
              <p className="text-slate-600 leading-relaxed text-[14px]">{item.desc}</p>
            </div>
          ))}
        </div>
        
      </div>
    </section>
  );
}
