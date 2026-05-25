import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, Send, Folder, Globe, Lock, HelpCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function AcademicScriptorium({ documents = [] }) {
  const { user, setIsAuthModalOpen } = useAuth();
  
  // Editor States
  const [editorText, setEditorText] = useState('');
  
  // Chat States
  const [assistantTab, setAssistantTab] = useState('vault'); // 'vault', 'general'
  const [chatMessages, setChatMessages] = useState([
    { sender: 'ai', text: "Greetings, scholar. Anchored directly to your Source Vault. Query anything about your references or thesis scope below." }
  ]);
  const [userInput, setUserInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  // Sync selected document context
  const activeDoc = documents[0];

  const handleChatSubmit = (e) => {
    e.preventDefault();
    if (!userInput.trim()) return;

    const userMsg = userInput.trim();
    setChatMessages(prev => [...prev, { sender: 'user', text: userMsg }]);
    setUserInput('');
    setIsTyping(true);

    setTimeout(() => {
      let responseText = "";

      if (assistantTab === 'vault') {
        if (!activeDoc) {
          responseText = "I cannot detect any source files in your Source Vault. Please upload a reference paper in your Research Vault tab first.";
        } else {
          const lower = userMsg.toLowerCase();
          if (lower.includes('summar') || lower.includes('overview') || lower.includes('brief')) {
            responseText = `### Source Analysis for "${activeDoc.title}":\n\n1. **Core Outline**: ${activeDoc.abstract}\n\n2. **Empirical Results**: ${activeDoc.findings}\n\n*The methodology aligns with advanced systems analysis.*`;
          } else if (lower.includes('smith') || lower.includes('method') || lower.includes('how')) {
            responseText = `### Methodology in "${activeDoc.title}" (by ${activeDoc.author}):\n\nAccording to experimental sections, the authors implemented:\n- **Pathways**: ${activeDoc.methodology}\n- **Hypothesis**: Decoupling algorithms from consecutive queue frameworks.\n\n*This approach resolves classical bottleneck latency issues.*`;
          } else {
            responseText = `Regarding **"${activeDoc.title}"**, here is the analytical summary from your sources:\n\n- **Theoretical Base**: ${activeDoc.findings}\n- **Core Thesis**: ${activeDoc.arguments}\n\n*Let me know if you would like me to compile citations or methodology reports.*`;
          }
        }
      } else {
        // General AI Q&A Mode
        responseText = "Based on general academic guidelines, research papers should maintain a rigorous passive-voice register, outline clear empirical hypotheses in section 2, and review limitations in section 4. Ensure your citations conform to standard bibliographic manuals.";
      }

      setChatMessages(prev => [...prev, { sender: 'ai', text: responseText }]);
      setIsTyping(false);
    }, 1000);
  };

  const getWordCount = () => {
    return editorText.split(/\s+/).filter(Boolean).length;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in pb-12 text-slate-100 max-w-7xl mx-auto">
      
      {/* LEFT COLUMN: Thesis Writing Suite (Spans 2 columns) */}
      <div className="lg:col-span-2 bg-[#0B0F19]/25 border border-slate-900/60 p-4 sm:p-6 md:p-8 rounded-3xl flex flex-col justify-between min-h-[580px] relative overflow-hidden">
        
        {/* Auth Shield Blur */}
        {!user && (
          <div className="absolute inset-0 z-10 backdrop-blur-[2.5px] bg-[#07090e]/60 flex items-center justify-center">
            <div className="bg-slate-950/95 border border-slate-900 p-6 sm:p-8 rounded-2xl text-center max-w-xs shadow-2xl">
              <div className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center mx-auto mb-4 text-purple-400">
                <Lock className="w-5 h-5" />
              </div>
              <h4 className="text-slate-100 font-serif font-semibold text-lg mb-2">Workspace Locked</h4>
              <p className="text-sm text-slate-400 leading-relaxed font-light">
                Sign in to Obsidian Atelier to begin drafting your research papers and saving drafts to your library.
              </p>
              <button 
                onClick={() => setIsAuthModalOpen(true)}
                className="mt-5 w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-mono font-bold tracking-wider uppercase transition-all cursor-pointer"
              >
                Sign In
              </button>
            </div>
          </div>
        )}

        {/* Text draft space */}
        <div className="space-y-6 flex-1 flex flex-col justify-start">
          <h1 className="text-4xl font-serif text-purple-300 font-semibold tracking-tight">
            The Scriptorium
          </h1>
          
          <textarea
            value={editorText}
            onChange={(e) => setEditorText(e.target.value)}
            className="w-full flex-1 min-h-[440px] bg-transparent text-slate-200 resize-none outline-none font-serif text-lg leading-relaxed placeholder:text-slate-655 placeholder:italic"
            placeholder="Begin your thesis here..."
          />
        </div>

        {/* Dynamic word count line matching screenshot 3 */}
        <div className="border-t border-slate-950 pt-4 mt-6 text-xs font-mono text-slate-500 tracking-widest font-bold uppercase">
          {getWordCount()} WORDS · AUTOSAVED
        </div>

      </div>

      {/* RIGHT COLUMN: NotebookLM-style Q&A Panel */}
      <div className="lg:col-span-1 bg-[#0B0F19]/25 border border-slate-900/60 p-4 sm:p-6 md:p-8 rounded-3xl flex flex-col justify-between min-h-[580px] shadow-sm">
        
        <div className="space-y-5">
          {/* Accent Header */}
          <div className="flex items-center gap-2 text-purple-400 border-b border-slate-950 pb-4">
            <Sparkles className="w-5 h-5" />
            <span className="font-mono text-xs tracking-[0.2em] font-bold uppercase">
              RESEARCH ASSISTANT
            </span>
          </div>

          {/* Toggle pill buttons matching screenshot 3 */}
          <div className="flex bg-slate-950/80 border border-slate-900 p-0.5 rounded-xl">
            <button
              onClick={() => setAssistantTab('vault')}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-mono font-bold tracking-widest uppercase transition-all cursor-pointer ${
                assistantTab === 'vault'
                  ? 'bg-purple-950/30 border border-purple-500/20 text-purple-300 shadow-md'
                  : 'text-slate-500 hover:text-slate-350'
              }`}
            >
              <Folder className="w-3.5 h-3.5" /> VAULT
            </button>
            <button
              onClick={() => setAssistantTab('general')}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-mono font-bold tracking-widest uppercase transition-all cursor-pointer ${
                assistantTab === 'general'
                  ? 'bg-purple-950/30 border border-purple-500/20 text-purple-300 shadow-md'
                  : 'text-slate-500 hover:text-slate-350'
              }`}
            >
              <Globe className="w-3.5 h-3.5" /> GENERAL
            </button>
          </div>

          {/* Grounding metadata notice */}
          <div className="space-y-0.5 pl-0.5">
            <p className="text-sm font-light text-slate-300">
              Grounded in your <span className="text-purple-400 underline font-medium cursor-pointer">Source Vault</span>.
            </p>
            <p className="text-slate-500 text-xs font-mono">
              Ask anything about your sources.
            </p>
          </div>

          {/* Chat log body */}
          <div className="h-64 sm:h-[280px] border border-slate-950 bg-slate-950/20 rounded-2xl p-4 overflow-y-auto space-y-4 shadow-inner">
            {chatMessages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}>
                <div className={`max-w-[85%] rounded-2xl p-3.5 text-sm sm:text-base leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-purple-950/30 border border-purple-500/20 text-purple-200 font-light'
                    : 'bg-[#0B0F19]/60 border border-slate-900 text-slate-350 font-serif'
                }`}>
                  <div className="whitespace-pre-line leading-relaxed">{msg.text}</div>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start animate-fade-in">
                <div className="bg-[#0B0F19]/60 border border-slate-900 rounded-2xl px-4 py-3 flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Input prompt form matching screenshot 3 */}
        <form onSubmit={handleChatSubmit} className="mt-5 space-y-3.5">
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="What does Smith argue about...?"
            className="w-full bg-slate-950 border border-slate-900 rounded-xl px-4.5 py-3 text-base text-slate-200 outline-none focus:border-purple-500/35 transition-colors placeholder:text-slate-655"
          />
          <button
            type="submit"
            disabled={!userInput.trim() || isTyping}
            className="w-full py-3.5 rounded-xl bg-purple-650 hover:bg-purple-600 text-white font-mono tracking-widest uppercase font-bold text-xs transition-colors shadow-md disabled:opacity-40"
          >
            Ask
          </button>
        </form>

      </div>

    </div>
  );
}
