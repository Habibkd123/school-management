import React from "react";
import { Calendar, ChevronRight } from "lucide-react";

export function LatestNews() {
  const news = [
    { tag: "Circular", date: "Oct 15, 2024", title: "CBSE Class X & XII Pre-Board Examination Schedule Released", img: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=600&auto=format&fit=crop", color: "bg-blue-500" },
    { tag: "Event", date: "Oct 20, 2024", title: "Annual Inter-School Cultural Fest 'Tarang 2024' Registration Open", img: "https://images.unsplash.com/photo-1511629091441-ee46146481b6?q=80&w=600&auto=format&fit=crop", color: "bg-[#F59E0B]" },
    { tag: "Holiday", date: "Oct 31, 2024", title: "School Closed on Account of Diwali Festival", img: "https://images.unsplash.com/photo-1513151233558-d860c5398176?q=80&w=600&auto=format&fit=crop", color: "bg-emerald-500" },
  ];

  return (
    <section className="py-24 bg-slate-50 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <div className="max-w-2xl">
            <h2 className="text-[#F59E0B] font-bold tracking-widest uppercase text-[12px] mb-3">Notice Board</h2>
            <h3 className="text-4xl md:text-5xl font-serif font-bold text-[#0F172A] leading-tight">
              Latest News & Circulars
            </h3>
          </div>
          <button className="hidden md:flex items-center gap-2 font-bold text-[#0F172A] hover:text-[#F59E0B] transition-colors uppercase tracking-wider text-[13px]">
            View All Updates <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {news.map((item, idx) => (
            <div key={idx} className="bg-white rounded-sm shadow-md border border-slate-200 overflow-hidden group hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
              <div className="h-56 overflow-hidden relative">
                <img 
                  src={item.img} 
                  alt={item.title} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                />
                <div className={`absolute top-4 left-4 ${item.color} text-white px-3 py-1 text-[11px] font-bold uppercase tracking-widest rounded-sm`}>
                  {item.tag}
                </div>
              </div>
              <div className="p-8">
                <div className="flex items-center gap-2 text-slate-500 text-[12px] font-bold mb-3 uppercase tracking-wider">
                  <Calendar className="w-4 h-4" />
                  {item.date}
                </div>
                <h4 className="text-[17px] font-bold text-[#0F172A] mb-4 leading-snug group-hover:text-[#F59E0B] transition-colors line-clamp-2">
                  {item.title}
                </h4>
                <a href="#" className="inline-flex items-center gap-1 text-[13px] font-bold text-[#F59E0B] hover:text-[#D97706] uppercase tracking-wider">
                  Read Full Notice <ChevronRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          ))}
        </div>
        
      </div>
    </section>
  );
}
