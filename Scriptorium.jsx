import React, { useState } from 'react';
import { BookOpen, Sparkles, Sidebar, PenTool, Image, ArrowLeft } from 'lucide-react';

export default function Scriptorium({ onBack }) {
  const [chapters, setChapters] = useState(['Chapter 1: The Call of the Siren', 'Chapter 2: Into the Obsidian']);
  const [activeChapter, setActiveChapter] = useState(0);

  return (
    <div className="min-h-screen bg-[#0B0F19] text-slate-100 p-6 font-sans">
      {/* Navigation Header */}
      <div className="max-w-7xl mx-auto flex justify-between items-center mb-8 border-b border-slate-800 pb-4">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-sm text-purple-400 hover:text-purple-300 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Paths
        </button>
        <div className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-purple-400" />
          <span className="font-serif font-medium text-lg">The Scriptorium</span>
        </div>
        <div className="text-xs font-mono text-slate-500">Fiction Workspace Mode</div>
      </div>

      {/* Main Studio Layout */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Left Column: Chapters & Outline */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 h-[calc(100vh-160px)] flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-mono tracking-wider text-purple-400 uppercase mb-4 flex items-center gap-2">
              <Sidebar className="w-3.5 h-3.5" /> Manuscript Outline
            </h3>
            <div className="space-y-2">
              {chapters.map((chap, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveChapter(idx)}
                  className={`w-full text-left p-2.5 rounded-lg text-sm transition-all ${
                    activeChapter === idx 
                      ? 'bg-purple-950/40 border border-purple-500/30 text-purple-200' 
                      : 'hover:bg-slate-800/50 text-slate-400'
                  }`}
                >
                  {chap}
                </button>
              ))}
            </div>
          </div>
          <button className="w-full py-2 bg-purple-900/20 hover:bg-purple-900/40 border border-purple-800/50 rounded-lg text-xs text-purple-300 transition-colors">
            + Add New Chapter
          </button>
        </div>

        {/* Center Columns: Rich Prose Editor Canvas */}
        <div className="lg:col-span-2 bg-slate-900/40 border border-slate-800 rounded-xl p-6 flex flex-col h-[calc(100vh-160px)]">
          <div className="flex justify-between items-center mb-4">
            <input 
              type="text" 
              defaultValue={chapters[activeChapter]} 
              className="bg-transparent font-serif text-xl font-medium text-slate-100 focus:outline-none border-b border-transparent focus:border-purple-500/30 pb-1 w-full"
            />
          </div>
          <textarea 
            className="w-full flex-1 bg-transparent text-slate-300 resize-none focus:outline-none font-serif text-base leading-relaxed"
            placeholder="Type your story prose here... Let the words flow into the obsidian void."
            defaultValue="The fog rolled thick off the obsidian cliffs, whispering secrets only the sirens understood..."
          />
          <div className="border-t border-slate-800 pt-3 mt-4 flex justify-between items-center text-xs text-slate-500 font-mono">
            <span>Words: 184</span>
            <span className="flex items-center gap-1"><PenTool className="w-3 h-3" /> Auto-saved to Cloud</span>
          </div>
        </div>

        {/* Right Column: Creative Tool Modules */}
        <div className="space-y-6 h-[calc(100vh-160px)] overflow-y-auto">
          {/* World-building Module */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
            <h4 className="text-xs font-mono tracking-wider text-slate-400 uppercase mb-3 flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-purple-400" /> Lore & Characters
            </h4>
            <div className="space-y-2 text-xs text-slate-400">
              <div className="p-2 bg-slate-950/40 border border-slate-800/60 rounded-lg">
                <strong className="text-slate-200">The Siren:</strong> Immortal, voice distorts gravity.
              </div>
              <div className="p-2 bg-slate-950/40 border border-slate-800/60 rounded-lg">
                <strong className="text-slate-200">The Scriptorium:</strong> Ancient tower forged of deep sea stone.
              </div>
            </div>
          </div>

          {/* Cover Designer Placeholder Module */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 flex flex-col items-center justify-center border-dashed h-48 text-center text-slate-500">
            <Image className="w-8 h-8 mb-2 text-slate-600" />
            <span className="text-xs font-medium">Cover Art Preview Canvas</span>
            <p className="text-[10px] text-slate-600 max-w-[150px] mt-1">Design tool integration layer placeholder</p>
          </div>
        </div>

      </div>
    </div>
  );
}