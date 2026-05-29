import React, { useState } from 'react';
import { Sparkles, RefreshCw, Feather, FileText, Palette, MessageSquare } from 'lucide-react';

const UNIVERSAL_PROMPTS = [
  {
    theme: 'Memories',
    prompt: '"The sound of rain against the window always brought back the memory of the letter she never sent..."',
    helper: 'Write a scene focusing on an object that triggers a flood of unresolved history.'
  },
  {
    theme: 'Relationships',
    prompt: '"They stood in the crowded station, two strangers who once knew the exact pitch of each other\'s laughter..."',
    helper: 'Explore the tension of an unspoken reunion in a chaotic public space.'
  },
  {
    theme: 'Mystery',
    prompt: '"A locked desk drawer, a key found in a silver teapot, and a single word written on the back of an envelope..."',
    helper: 'Draft the opening paragraph of a mystery, focusing on a discovery that raises three questions.'
  },
  {
    theme: 'Dreams',
    prompt: '"In the dream, the city was made entirely of glass, and every step she took echoed with a truth she had forgotten..."',
    helper: 'Capture the surreal texture of a dream that reveals a hidden motivation.'
  },
  {
    theme: 'Cities',
    prompt: '"Below the streets of the copper city, a network of steam pipes vibrated with a rhythm that felt like a pulse..."',
    helper: 'Focus on world-building through sensory details—sound, heat, and vibration.'
  },
  {
    theme: 'Silence',
    prompt: '"The library was silent, save for the scratching of a pen that seemed to write its own history..."',
    helper: 'Write about a moment of profound quiet that is suddenly broken by something impossible.'
  },
  {
    theme: 'Ambition',
    prompt: '"He would climb to the highest spire of the glass cathedral, even if the cold wind tore his lungs apart..."',
    helper: 'Portray a character whose drive borders on self-destruction.'
  },
  {
    theme: 'Regret',
    prompt: '"Looking at the blank canvas, she realized the greatest tragedies are not the things we do, but the things we leave unwritten..."',
    helper: 'Write a monologue of a character contemplating a turning point in their past.'
  },
  {
    theme: 'Identity',
    prompt: '"He wore a mask of clockwork gears, but behind the ticking brass, his eyes searched for a name he had lost long ago..."',
    helper: 'Explore the concept of a dual identity and the struggle to remember one\'s true self.'
  },
  {
    theme: 'Hope',
    prompt: '"A single, glowing seed planted in the ash of the forgotten forest, waiting for the first touch of dawn..."',
    helper: 'End a scene on a note of fragile, hard-won optimism.'
  }
];

export default function DashboardView({ onNavigate }) {
  const [promptIndex, setPromptIndex] = useState(0);
  const [animating, setAnimating] = useState(false);

  const rotatePrompt = () => {
    setAnimating(true);
    setTimeout(() => {
      setPromptIndex((prev) => (prev + 1) % UNIVERSAL_PROMPTS.length);
      setAnimating(false);
    }, 300);
  };

  const activePrompt = UNIVERSAL_PROMPTS[promptIndex];

  return (
    <div className="space-y-10 animate-fade-in">
      {/* Hero Welcome */}
      <div>
        <span className="text-xs font-mono font-bold tracking-[0.25em] text-purple-400 uppercase">Creative Studio</span>
        <h1 className="text-4xl font-serif text-white tracking-tight mt-1.5">The Weaver's Path</h1>
        <p className="text-slate-400 text-sm font-light leading-relaxed mt-2 max-w-3xl">
          Enter at any stage. The Siren keeps the threads of your journey, guiding your story from a faint spark to a brilliant shine.
        </p>
      </div>

      {/* Daily Muse Prompt Card */}
      <div className="relative group rounded-2xl bg-gradient-to-br from-[#0e0c1b] to-[#07090e] border border-purple-500/10 p-8 shadow-xl overflow-hidden transition-all duration-300 hover:border-purple-500/25">
        <div className="absolute top-0 right-0 w-80 h-80 bg-purple-500/5 rounded-full blur-[80px] -z-10 group-hover:bg-purple-500/10 transition-all duration-500" />
        
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-purple-950/40 border border-purple-500/20 flex items-center justify-center text-purple-400">
              <Sparkles className="w-4 h-4" />
            </div>
            <span className="text-sm font-mono tracking-wider text-purple-300 uppercase">
              Daily Muse • {activePrompt.theme}
            </span>
          </div>
          <button 
            onClick={rotatePrompt}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900/60 border border-slate-800 text-sm text-slate-400 hover:text-purple-300 hover:border-purple-500/30 hover:bg-slate-900 transition-all cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${animating ? 'animate-spin' : ''}`} />
            New Prompt
          </button>
        </div>

        <div className={`transition-all duration-300 ${animating ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
          <blockquote className="text-2xl sm:text-3xl font-serif font-light text-slate-100 leading-relaxed mb-4">
            {activePrompt.prompt}
          </blockquote>
          <p className="text-sm font-mono text-purple-400 italic tracking-wide">
            — {activePrompt.helper}
          </p>
        </div>
      </div>

      {/* Quick Start Workspace Grid */}
      <div className="space-y-6">
        <h2 className="text-sm font-mono tracking-[0.2em] text-slate-500 uppercase">Quick Start Workspaces</h2>
        
        <div className="grid sm:grid-cols-2 gap-6">
          {/* Card 1: Planning & Drafting */}
          <div 
            onClick={() => onNavigate('planning')}
            className="group relative rounded-2xl bg-[#0d0a15]/60 border border-slate-800/80 p-6 flex items-start gap-5 cursor-pointer transition-all duration-300 hover:border-purple-500/40 hover:shadow-[10px_10px_30px_-10px_rgba(168,85,247,0.2)] hover:scale-[1.01]"
          >
            <div className="w-12 h-12 rounded-xl bg-purple-950/20 border border-purple-500/20 flex items-center justify-center text-purple-400 group-hover:bg-purple-950/40 group-hover:text-purple-300 transition-colors shrink-0">
              <Feather className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-mono text-slate-400 uppercase tracking-wider">Planning & Drafting</h3>
              <h4 className="text-xl font-serif font-medium text-white group-hover:text-purple-300 transition-colors">The Spark</h4>
              <p className="text-sm text-slate-400 leading-relaxed font-light">
                Map out character profiles, trace whiteboards, explore worldbuilding rules, arrange movable plot points, and draft inside the suite.
              </p>
            </div>
          </div>

          {/* Card 2: Book Formatting */}
          <div 
            onClick={() => onNavigate('formatting')}
            className="group relative rounded-2xl bg-[#0d0a15]/60 border border-slate-800/80 p-6 flex items-start gap-5 cursor-pointer transition-all duration-300 hover:border-purple-500/40 hover:shadow-[10px_10px_30px_-10px_rgba(168,85,247,0.2)] hover:scale-[1.01]"
          >
            <div className="w-12 h-12 rounded-xl bg-purple-950/20 border border-purple-500/20 flex items-center justify-center text-purple-400 group-hover:bg-purple-950/40 group-hover:text-purple-300 transition-colors shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-mono text-slate-400 uppercase tracking-wider">Book Formatting</h3>
              <h4 className="text-xl font-serif font-medium text-white group-hover:text-purple-300 transition-colors">The Sculpture</h4>
              <p className="text-sm text-slate-400 leading-relaxed font-light">
                Select visual presets (Poetry, Novel, eBook, Paperback) to automatically apply margins, layouts, and typography. Request expert assistance.
              </p>
            </div>
          </div>

          {/* Card 3: Cover Studio */}
          <div 
            onClick={() => onNavigate('studio')}
            className="group relative rounded-2xl bg-[#0d0a15]/60 border border-slate-800/80 p-6 flex items-start gap-5 cursor-pointer transition-all duration-300 hover:border-purple-500/40 hover:shadow-[10px_10px_30px_-10px_rgba(168,85,247,0.2)] hover:scale-[1.01]"
          >
            <div className="w-12 h-12 rounded-xl bg-purple-950/20 border border-purple-500/20 flex items-center justify-center text-purple-400 group-hover:bg-purple-950/40 group-hover:text-purple-300 transition-colors shrink-0">
              <Palette className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-mono text-slate-400 uppercase tracking-wider">Cover Studio</h3>
              <h4 className="text-xl font-serif font-medium text-white group-hover:text-purple-300 transition-colors">The Vision</h4>
              <p className="text-sm text-slate-400 leading-relaxed font-light">
                Generate cinematic book cover concepts using dynamic AI prompts, or compose text, images, and crops in the Canva-lite editor.
              </p>
            </div>
          </div>

          {/* Card 4: Expert Services */}
          <div 
            onClick={() => onNavigate('sanctuary')}
            className="group relative rounded-2xl bg-[#0d0a15]/60 border border-slate-800/80 p-6 flex items-start gap-5 cursor-pointer transition-all duration-300 hover:border-purple-500/40 hover:shadow-[10px_10px_30px_-10px_rgba(168,85,247,0.2)] hover:scale-[1.01]"
          >
            <div className="w-12 h-12 rounded-xl bg-purple-950/20 border border-purple-500/20 flex items-center justify-center text-purple-400 group-hover:bg-purple-950/40 group-hover:text-purple-300 transition-colors shrink-0">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-mono text-slate-400 uppercase tracking-wider">Expert Services</h3>
              <h4 className="text-xl font-serif font-medium text-white group-hover:text-purple-300 transition-colors">The Final Polish</h4>
              <p className="text-sm text-slate-400 leading-relaxed font-light">
                Receive proofreading, editing, and publishing feedback. View dynamic price estimators in both USD and INR.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
