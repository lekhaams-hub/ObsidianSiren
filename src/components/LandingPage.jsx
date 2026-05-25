import React, { useState } from 'react';
import { GraduationCap, ArrowRight, Sparkles, Compass, LogOut, Feather } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function LandingPage({ onSelectWeaver, onSelectScholar }) {
  const [hoveredPath, setHoveredPath] = useState(null);
  const { user, login, logout, checkAuthAndExecute } = useAuth();

  return (
    <div className="min-h-screen bg-[#040207] text-slate-100 flex flex-col justify-between overflow-hidden relative selection:bg-purple-500/30 selection:text-purple-200">

      {/* Dynamic Background Glow Effects */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute -top-[40%] -left-[20%] w-[80vw] h-[80vw] rounded-full bg-indigo-900/10 blur-[120px]"
        />
        <div
          className={`absolute -bottom-[40%] -right-[20%] w-[80vw] h-[80vw] rounded-full bg-slate-900/20 blur-[120px] transition-all duration-1000 ease-in-out ${hoveredPath === 'scholar' ? 'bg-purple-600/15 scale-110' : ''
            }`}
        />
      </div>

      {/* Header / Navbar */}
      {/* Commented out Navbar for now as requested
      <header className="w-full max-w-7xl mx-auto px-6 py-6 flex justify-between items-center z-10">
        <div 
          onClick={() => window.location.reload()}
          className="flex items-center gap-3.5 group cursor-pointer hover:opacity-90 transition-opacity"
          title="Obsidian Siren Studio"
        >
          <img src="/assets/OSS-navbar-logos.png" alt="Obsidian Siren Studio" className="h-10 w-10 object-contain shrink-0" />
          <div className="flex flex-col">
            <span className="font-serif text-lg sm:text-xl font-bold text-white leading-tight">Obsidian</span>
            <span className="text-[10px] font-mono text-purple-400 uppercase tracking-widest leading-none mt-0.5">Siren Studio</span>
          </div>
        </div>
        
        {user ? (
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <img src={user.photoURL || `https://ui-avatars.com/api/?name=${user.displayName || 'User'}&background=random`} alt="Avatar" className="w-8 h-8 rounded-full border border-slate-700" />
              <span className="text-sm font-medium text-slate-300 hidden sm:block">{user.displayName || 'User'}</span>
            </div>
            <button 
              onClick={logout}
              className="px-4 py-2 rounded-lg bg-slate-900/60 border border-slate-800 text-sm font-medium text-red-400 hover:bg-slate-800 hover:text-red-300 hover:border-slate-700 transition-all duration-300 shadow-sm backdrop-blur-md flex items-center gap-2 cursor-pointer"
            >
              <LogOut className="w-4 h-4" /> Sign Out
            </button>
          </div>
        ) : (
          <button 
            onClick={login}
            className="px-5 py-2 rounded-lg bg-slate-900/60 border border-slate-800 text-sm font-medium hover:bg-slate-800 hover:border-slate-700 transition-all duration-300 shadow-sm backdrop-blur-md cursor-pointer"
          >
            Sign In
          </button>
        )}
      </header>
      */}

      {/* Hero Intro */}
      <main className="flex-1 flex flex-col items-center justify-center max-w-5xl mx-auto px-6 py-12 z-10 w-full">
        <div className="text-center max-w-5xl mx-auto mb-16 flex flex-col items-center w-full">
          {/* Logo with Purple Glow Effect */}
          <div className="mb-4 relative flex items-center justify-center">
            {/* 1. Large, extremely diffuse ambient back-glow (large horizontal ellipse, very subtle) */}
            <div className="absolute w-[700px] h-[350px] sm:w-[850px] sm:h-[420px] rounded-[50%] bg-purple-900/10 blur-[130px] pointer-events-none mix-blend-screen" />
            <div className="absolute w-[450px] h-[220px] sm:w-[580px] sm:h-[280px] rounded-[50%] bg-purple-800/12 blur-[90px] pointer-events-none mix-blend-screen" />

            {/* 2. Natural silhouette glows using blurred, color-boosted duplicates of the actual logo */}
            {/* Inner intense glow - scaled slightly */}
            <img
              src="/assets/OSS-main-logos.png"
              alt=""
              className="absolute h-44 sm:h-64 md:h-80 lg:h-96 object-contain blur-2xl opacity-65 scale-[1.06] pointer-events-none select-none brightness-125 saturate-[1.8] mix-blend-screen"
              onError={(e) => e.target.style.display = 'none'}
            />
            {/* Middle wide glow - scaled further */}
            <img
              src="/assets/OSS-main-logos.png"
              alt=""
              className="absolute h-44 sm:h-64 md:h-80 lg:h-96 object-contain blur-[40px] opacity-45 scale-[1.15] pointer-events-none select-none brightness-110 saturate-[1.6] mix-blend-screen"
              onError={(e) => e.target.style.display = 'none'}
            />
            {/* Outer soft ambient glow - scaled significantly */}
            <img
              src="/assets/OSS-main-logos.png"
              alt=""
              className="absolute h-44 sm:h-64 md:h-80 lg:h-96 object-contain blur-[72px] opacity-25 scale-[1.3] pointer-events-none select-none brightness-100 saturate-[1.4] mix-blend-screen"
              onError={(e) => e.target.style.display = 'none'}
            />

            {/* 3. The main crisp logo on top */}
            <img
              src="/assets/OSS-main-logos.png"
              alt="Obsidian Siren Logo"
              className="h-44 sm:h-64 md:h-80 lg:h-96 object-contain relative z-10 filter drop-shadow-[0_0_15px_rgba(168,85,247,0.35)]"
              onError={(e) => e.target.style.display = 'none'}
            />
          </div>

          <h3 className="text-xs font-sans font-medium tracking-[0.3em] text-slate-350 uppercase mb-8">
            Obsidian Siren Studio
          </h3>

          <h1 className="text-3xl sm:text-5xl md:text-7xl lg:text-[88px] font-serif font-medium tracking-tight text-white mb-6 leading-[1.1] w-full">
            Where does your journey begin?
          </h1>

          <p className="text-slate-300 text-base sm:text-lg md:text-xl font-light mb-10 w-full max-w-4xl leading-relaxed">
            Two paths. One studio. Choose your craft and step through.
          </p>

          {/* User Sign In Pill */}
          {user && (
            <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full border border-slate-800/80 bg-slate-900/40 backdrop-blur-sm text-sm text-slate-400">
              <span>Signed in as {user.email}</span>
              <button onClick={logout} className="flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer ml-2 text-slate-500 hover:text-slate-300">
                <LogOut className="w-3.5 h-3.5" /> Sign out
              </button>
            </div>
          )}
        </div>

        {/* Dual Path Interactive Grid */}
        <div className="grid md:grid-cols-2 gap-8 w-full max-w-5xl transition-all duration-500">

          {/* Path 1: The Weaver's Path */}
          <div
            onMouseEnter={() => setHoveredPath('weaver')}
            onMouseLeave={() => hoveredPath === 'weaver' && setHoveredPath(null)}
            onClick={onSelectWeaver}
            className={`group relative rounded-3xl bg-[#0d0a15]/80 border border-slate-800/80 p-6 sm:p-8 md:p-10 flex flex-col justify-between h-auto min-h-[350px] md:h-[400px] cursor-pointer transition-all duration-500 backdrop-blur-md overflow-hidden ${hoveredPath === 'weaver' ? 'border-purple-500/70 shadow-[0_0_20px_rgba(168,85,247,0.3),20px_20px_40px_-10px_rgba(168,85,247,0.6)] scale-[1.03]' : 'hover:border-slate-700/80'
              }`}
          >
            <div>
              <div className="mb-8">
                <div className="w-14 h-14 rounded-2xl bg-slate-800/40 flex items-center justify-center text-slate-300 group-hover:text-purple-300 group-hover:bg-purple-900/30 transition-all duration-500">
                  <Feather className="w-6 h-6" />
                </div>
              </div>

              <div className="text-sm font-sans tracking-[0.2em] text-slate-400 uppercase mb-4 font-semibold">
                Fiction • Fantasy • Memoir
              </div>

              <h2 className="text-3xl sm:text-4xl font-serif font-medium mb-4 text-white">
                The Weaver's Path
              </h2>
              <p className="text-base sm:text-lg text-slate-400 leading-relaxed font-light">
                Conjure characters, chart worlds, draft chapters, and design the cover that calls readers in.
              </p>
            </div>

            <div className="flex items-center gap-2 font-medium text-base text-purple-500 group-hover:text-purple-400 mt-auto">
              <span>Enter</span>
              <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300" />
            </div>
          </div>

          {/* Path 2: The Scholar's Sanctum */}
          <div
            onMouseEnter={() => setHoveredPath('scholar')}
            onMouseLeave={() => hoveredPath === 'scholar' && setHoveredPath(null)}
            onClick={onSelectScholar}
            className={`group relative rounded-3xl bg-[#0d0a15]/80 border border-slate-800/80 p-6 sm:p-8 md:p-10 flex flex-col justify-between h-auto min-h-[350px] md:h-[400px] cursor-pointer transition-all duration-500 backdrop-blur-md overflow-hidden ${hoveredPath === 'scholar' ? 'border-purple-500/70 shadow-[0_0_20px_rgba(168,85,247,0.3),20px_20px_40px_-10px_rgba(168,85,247,0.6)] scale-[1.03]' : 'hover:border-slate-700/80'
              }`}
          >
            <div>
              <div className="mb-8">
                <div className="w-14 h-14 rounded-2xl bg-slate-800/40 flex items-center justify-center text-slate-300 group-hover:text-purple-300 group-hover:bg-purple-900/30 transition-all duration-500">
                  <GraduationCap className="w-6 h-6" />
                </div>
              </div>

              <div className="text-sm font-sans tracking-[0.2em] text-slate-400 uppercase mb-4 font-semibold">
                Research • Thesis • Academic
              </div>

              <h2 className="text-4xl font-serif font-medium mb-4 text-white">
                The Scholar's Sanctum
              </h2>
              <p className="text-lg text-slate-400 leading-relaxed font-light">
                A vault for your sources, a scriptorium for your prose, and citations rendered in any house style.
              </p>
            </div>

            <div className="flex items-center gap-2 font-medium text-base text-purple-500 group-hover:text-purple-400 mt-auto">
              <span>Enter</span>
              <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300" />
            </div>
          </div>

        </div>
      </main>

      {/* Footer Note */}
      <footer className="w-full text-center py-8 z-10">
        <p className="text-base font-semibold text-slate-400 font-sans tracking-[0.15em] uppercase sm:text-lg">
          You can switch paths anytime from the studio sidebar.
        </p>
      </footer>
    </div>
  );
}