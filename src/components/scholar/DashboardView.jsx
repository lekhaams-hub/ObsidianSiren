import React from 'react';
import { Folder, Edit3, MessageSquare, Award } from 'lucide-react';

export default function DashboardView({ onNavigate }) {
  const cards = [
    {
      tab: 'vault',
      tag: 'RESEARCH VAULT',
      title: 'The Inquiry',
      desc: 'Upload PDFs and source papers — your private library.',
      icon: Folder
    },
    {
      tab: 'scriptorium',
      tag: 'SCRIPTORIUM',
      title: 'The Thesis',
      desc: 'Draft your manuscript with a Research Assistant by your side.',
      icon: Edit3
    },
    {
      tab: 'citations',
      tag: 'CITATION ENGINE',
      title: 'The Citation',
      desc: 'MLA, APA, Chicago — perfectly formatted, instantly.',
      icon: MessageSquare
    },
    {
      tab: 'consultation',
      tag: 'EXPERT REVIEW',
      title: 'The Defense',
      desc: "Get a scholar's eye on your manuscript before submission.",
      icon: Award
    }
  ];

  return (
    <div className="space-y-12 animate-fade-in max-w-7xl mx-auto pb-12 text-slate-100">
      
      {/* Title Header */}
      <div className="space-y-3.5 mt-4">
        <h3 className="text-xs font-mono tracking-[0.3em] text-purple-400 uppercase font-semibold">
          RESEARCH STUDIO
        </h3>
        <h1 className="text-5xl font-serif text-purple-300 font-semibold tracking-tight leading-tight">
          The Scholar's Sanctum
        </h1>
        <p className="text-slate-400 text-base sm:text-lg font-light leading-relaxed max-w-3xl">
          Enter at any stage. Sources stay private; the assistant only knows what you teach it.
        </p>
      </div>

      {/* Quick Start Section */}
      <div className="space-y-6">
        <h3 className="text-xs font-mono tracking-[0.25em] text-slate-500 uppercase font-semibold block pl-1">
          QUICK START
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {cards.map((c) => {
            const IconComponent = c.icon;
            return (
              <div
                key={c.tab}
                onClick={() => onNavigate(c.tab)}
                className="group bg-[#0B0F19]/40 border border-slate-900 rounded-3xl p-7 flex gap-5 items-start cursor-pointer select-none transition-all duration-300 hover:border-purple-500/30 hover:bg-[#0d0b17]/40 hover:shadow-[4px_4px_20px_rgba(168,85,247,0.08)]"
              >
                {/* Icon box */}
                <div className="w-12 h-12 rounded-2xl bg-purple-950/40 border border-purple-500/20 flex items-center justify-center text-purple-450 shrink-0 shadow-md group-hover:border-purple-500/40 group-hover:text-purple-400 transition-colors">
                  <IconComponent className="w-5.5 h-5.5" />
                </div>

                {/* Content */}
                <div className="space-y-1.5 flex-1 pr-4">
                  <span className="text-[10px] font-mono tracking-widest text-slate-500 uppercase font-bold">
                    {c.tag}
                  </span>
                  <h3 className="font-serif font-bold text-xl text-slate-100 group-hover:text-purple-300 transition-colors">
                    {c.title}
                  </h3>
                  <p className="text-slate-400 text-sm font-light leading-relaxed">
                    {c.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
