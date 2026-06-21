import React from "react";

interface HighlightItem {
  value: string;
  label: string;
  icon: string;
}

interface LandingData {
  about?: {
    founded_year?: number;
  };
  highlights?: HighlightItem[];
}

export function Highlights({ data }: { data?: LandingData | null }) {
  const foundedYear = data?.about?.founded_year;
  const yearsLegacy = foundedYear ? `${new Date().getFullYear() - foundedYear}+` : "25+";

  const defaultHighlights = [
    { value: "2500+", label: "Happy Students", icon: "🎓" },
    { value: "150+", label: "Expert Faculty", icon: "👨‍🏫" },
    { value: "100%", label: "CBSE Board Pass Rate", icon: "📈" },
    { value: yearsLegacy, label: "Years of Legacy", icon: "🏆" },
  ];

  const highlights = data?.highlights && data.highlights.length > 0
    ? data.highlights
    : defaultHighlights;

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
