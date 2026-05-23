import React, { useState } from 'react';
import { BookOpen, GraduationCap, ArrowRight, Sparkles, Compass } from 'lucide-react';

export default function LandingPage({onSelectWeaver, onSelectScholar}) {
  const [hoveredPath, setHoveredPath] = useState(null);

  return (
    <div className="min-h-screen bg-[#0B0F19] text-slate-100 flex flex-col justify-between overflow-hidden relative selection:bg-purple-500/30 selection:text-purple-200">
      
      {/* Dynamic Background Glow Effects */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div 
          className={`absolute -top-[40%] -left-[20%] w-[80vw] h-[80vw] rounded-full bg-indigo-900/10 blur-[120px] transition-all duration-1000 ease-in-out ${
            hoveredPath === 'weaver' ? 'bg-purple-600/15 scale-110' : ''
          }`} 
        />
        <div 
          className={`absolute -bottom-[40%] -right-[20%] w-[80vw] h-[80vw] rounded-full bg-slate-900/20 blur-[120px] transition-all duration-1000 ease-in-out ${
            hoveredPath === 'scholar' ? 'bg-emerald-600/10 scale-110' : ''
          }`} 
        />
      </div>

      {/* Header / Navbar */}
      <header className="w-full max-w-7xl mx-auto px-6 py-6 flex justify-between items-center z-10">
        <div className="flex items-center gap-3 group cursor-pointer">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-purple-600 to-indigo-900 flex items-center justify-center shadow-lg shadow-purple-900/20 group-hover:scale-105 transition-transform">
            <Compass className="h-5 w-5 text-purple-200 animate-pulse" />
          </div>
          <span className="font-serif text-xl tracking-wide bg-gradient-to-r from-slate-100 via-slate-200 to-slate-400 bg-clip-text text-transparent font-medium">
            Obsidian Siren Studio
          </span>
        </div>
        
        <button className="px-5 py-2 rounded-lg bg-slate-900/60 border border-slate-800 text-sm font-medium hover:bg-slate-800 hover:border-slate-700 transition-all duration-300 shadow-sm backdrop-blur-md">
          Sign In
        </button>
      </header>

      {/* Hero Intro */}
      <main className="flex-1 flex flex-col items-center justify-center max-w-5xl mx-auto px-6 py-12 z-10 w-full">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-950/40 border border-purple-800/30 text-xs text-purple-300 font-medium tracking-wide mb-2 uppercase">
            <Sparkles className="w-3 h-3" /> Where stories find their shine
          </div>
          <h1 className="text-4xl sm:text-5xl font-serif font-medium tracking-tight bg-gradient-to-b from-white to-slate-400 bg-clip-text text-transparent">
            Where does your journey begin?
          </h1>
          <p className="text-slate-400 text-base sm:text-lg max-w-lg mx-auto font-light leading-relaxed">
            Two paths. One studio. Choose your craft and step through to begin your work.
          </p>
        </div>

        {/* Dual Path Interactive Grid */}
        <div className="grid md:grid-cols-2 gap-8 w-full max-w-4xl transition-all duration-500">
          
          {/* Path 1: The Weaver's Path */}
          <div 
            onMouseEnter={() => setHoveredPath('weaver')}
            onMouseLeave={() => hoveredPath === 'weaver' && setHoveredPath(null)}
            onClick={onSelectWeaver}
            className={`group relative rounded-2xl bg-gradient-to-b from-slate-900/80 to-slate-950/90 border p-8 flex flex-col justify-between h-[340px] cursor-pointer transition-all duration-500 backdrop-blur-md overflow-hidden ${
              hoveredPath === 'weaver' 
                ? 'border-purple-500/50 shadow-2xl shadow-purple-950/30 -translate-y-1' 
                : hoveredPath === 'scholar' 
                  ? 'border-slate-900 opacity-40 scale-[0.98]' 
                  : 'border-slate-800/80'
            }`}
          >
            {/* Ambient inner glow for Weaver */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 via-indigo-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="p-3 rounded-xl bg-purple-950/50 border border-purple-500/20 text-purple-400 group-hover:bg-purple-500 group-hover:text-white transition-all duration-500">
                  <BookOpen className="w-6 h-6" />
                </div>
                <span className="text-xs font-mono tracking-widest text-slate-500 uppercase group-hover:text-purple-400 transition-colors">
                  Fiction • Fantasy • Memoir
                </span>
              </div>
              
              <h2 className="text-2xl font-serif font-medium mb-3 text-slate-200 group-hover:text-white transition-colors">
                The Weaver's Path
              </h2>
              <p className="text-sm text-slate-400 leading-relaxed font-light group-hover:text-slate-300 transition-colors">
                Conjure characters, chart expansive worlds, draft your chapters, and design the cover that calls readers in from the dark.
              </p>
            </div>

            <div className="flex items-center gap-2 font-medium text-sm text-purple-400 group-hover:text-purple-300 pt-4 mt-auto">
              <span>Enter Scriptorium</span>
              <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1.5 transition-transform duration-300" />
            </div>
          </div>

          {/* Path 2: The Scholar's Sanctum */}
          <div 
            onMouseEnter={() => setHoveredPath('scholar')}
            onMouseLeave={() => hoveredPath === 'scholar' && setHoveredPath(null)}
            onClick={onSelectScholar}
            className={`group relative rounded-2xl bg-gradient-to-b from-slate-900/80 to-slate-950/90 border p-8 flex flex-col justify-between h-[340px] cursor-pointer transition-all duration-500 backdrop-blur-md overflow-hidden ${
              hoveredPath === 'scholar' 
                ? 'border-emerald-500/50 shadow-2xl shadow-emerald-950/20 -translate-y-1' 
                : hoveredPath === 'weaver' 
                  ? 'border-slate-900 opacity-40 scale-[0.98]' 
                  : 'border-slate-800/80'
            }`}
          >
            {/* Ambient inner glow for Scholar */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="p-3 rounded-xl bg-emerald-950/50 border border-emerald-500/20 text-emerald-400 group-hover:bg-emerald-500 group-hover:text-white transition-all duration-500">
                  <GraduationCap className="w-6 h-6" />
                </div>
                <span className="text-xs font-mono tracking-widest text-slate-500 uppercase group-hover:text-emerald-400 transition-colors">
                  Research • Thesis • Academic
                </span>
              </div>
              
              <h2 className="text-2xl font-serif font-medium mb-3 text-slate-200 group-hover:text-white transition-colors">
                The Scholar's Sanctum
              </h2>
              <p className="text-sm text-slate-400 leading-relaxed font-light group-hover:text-slate-300 transition-colors">
                A secure vault for your academic sources, a focused workspace for your prose, and layout engines to render citations in any style.
              </p>
            </div>

            <div className="flex items-center gap-2 font-medium text-sm text-emerald-400 group-hover:text-emerald-300 pt-4 mt-auto">
              <span>Enter Sanctum</span>
              <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1.5 transition-transform duration-300" />
            </div>
          </div>

        </div>
      </main>

      {/* Footer Note */}
      <footer className="w-full text-center py-8 z-10">
        <p className="text-xs text-slate-600 font-mono tracking-wide">
          Sign in is required to unlock full studio tools and cloud storage features.
        </p>
      </footer>
    </div>
  );
}