import React from "react";

export function Highlights() {
  const highlights = [
    { value: "2500+", label: "Happy Students", icon: "🎓" },
    { value: "150+", label: "Expert Faculty", icon: "👨‍🏫" },
    { value: "100%", label: "CBSE Board Pass Rate", icon: "📈" },
    { value: "99.2%", label: "District Highest Score", icon: "🏆" }
  ];

  return (
    <section className="py-12 bg-white relative z-20 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 divide-y md:divide-y-0 md:divide-x divide-slate-200">
          {highlights.map((item, idx) => (
            <div key={idx} className={`flex flex-col items-center justify-center text-center ${idx !== 0 && idx !== 2 ? 'pt-8 md:pt-0' : ''}`}>
              <div className="text-3xl mb-3">{item.icon}</div>
              <h3 className="text-3xl lg:text-4xl font-black text-[#0F172A] tracking-tight mb-1">{item.value}</h3>
              <p className="font-bold text-[#F59E0B] uppercase tracking-wider text-[11px] md:text-[12px]">{item.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
