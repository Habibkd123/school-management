import React from "react";
import { FileText, CheckSquare, Users, GraduationCap } from "lucide-react";

export function AdmissionProcess() {
  const steps = [
    { title: "Online Enquiry", desc: "Submit the admission enquiry form for the academic session 2024-25." },
    { title: "Campus Interaction", desc: "Interactive session with the Principal and campus tour." },
    { title: "Document Submission", desc: "Submit birth certificate, previous school records, and Aadhar." },
    { title: "Fee Payment", desc: "Confirm admission by paying the first quarter fees online." },
  ];

  return (
    <section id="admissions" className="py-24 bg-[#0F172A] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-[#F59E0B] font-bold tracking-widest uppercase text-[12px] mb-3">Join Our Legacy</h2>
          <h3 className="text-4xl md:text-5xl font-serif font-bold text-white leading-tight">
            Admission Process
          </h3>
        </div>

        <div className="relative">
          <div className="hidden md:block absolute top-1/2 left-0 right-0 h-1 bg-white/10 -translate-y-1/2" />

          <div className="grid md:grid-cols-4 gap-8">
            {steps.map((step, idx) => (
              <div key={idx} className="relative flex flex-col items-center text-center group">
                <div className="w-16 h-16 bg-[#0F172A] border-4 border-[#F59E0B] text-[#F59E0B] rounded-full flex items-center justify-center text-xl font-black mb-6 relative z-10 shadow-[0_0_20px_rgba(245,158,11,0.3)] group-hover:scale-110 group-hover:bg-[#F59E0B] group-hover:text-[#0F172A] transition-all duration-300">
                  {idx + 1}
                </div>
                <h4 className="text-[16px] font-bold text-white mb-3">{step.title}</h4>
                <p className="text-slate-400 text-[14px] leading-relaxed max-w-full sm:w-[200px]">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* <div className="mt-16 text-center">
          <button className="px-8 py-3.5 rounded-sm bg-[#F59E0B] text-white font-bold text-[14px] hover:bg-[#D97706] shadow-xl shadow-[#F59E0B]/20 hover:-translate-y-1 transition-all duration-300 uppercase tracking-wide">
            Apply Now
          </button>
        </div> */}

      </div>
    </section>
  );
}
