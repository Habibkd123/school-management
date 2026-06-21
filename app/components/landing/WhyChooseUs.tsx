import React from "react";
import * as LucideIcons from "lucide-react";

interface FeatureItem {
  icon: string;
  title: string;
  desc: string;
}

interface WhyChooseUsProps {
  data?: {
    why_choose_us?: FeatureItem[];
  } | null;
}

export function WhyChooseUs({ data }: WhyChooseUsProps) {
  const defaultReasons = [
    { icon: "Monitor", title: "Smart Classrooms", desc: "Interactive digital boards and modern learning tools in every class." },
    { icon: "Users", title: "Expert Faculty", desc: "Highly qualified educators dedicated to personalized student success." },
    { icon: "FlaskConical", title: "Integrated Coaching", desc: "In-house foundation programs for IIT-JEE, NEET, and Olympiads." },
    { icon: "Trophy", title: "Sports Excellence", desc: "World-class sports infrastructure and professional coaching." },
    { icon: "Laptop", title: "Digital Learning", desc: "Comprehensive e-learning portal and digital library access." },
    { icon: "ShieldCheck", title: "Safe Campus", desc: "24/7 CCTV surveillance and strict campus security measures." },
  ];

  const reasons = data?.why_choose_us && data.why_choose_us.length > 0
    ? data.why_choose_us
    : defaultReasons;

  const renderIcon = (iconName: string) => {
    const IconComponent = (LucideIcons as any)[iconName];
    if (IconComponent) {
      return <IconComponent className="w-8 h-8 text-[#0F172A]" />;
    }
    return <LucideIcons.Sparkles className="w-8 h-8 text-[#0F172A]" />;
  };

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
                {renderIcon(item.icon)}
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
