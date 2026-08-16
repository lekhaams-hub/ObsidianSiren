import React, { useState } from 'react';
import { Sparkles, Send, HelpCircle, Search, ChevronDown, ChevronRight, MessageSquare, BookOpen, Layers, DollarSign } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { queryAskObsidianAssistant } from '../services/ai';

const FAQ_DATA = [
  {
    id: 'faq1',
    category: 'Book Formatting Basics',
    q: 'What is the difference between Trade 6x9" and Pocket 5x8" trim sizes?',
    a: 'Trade (6" x 9") is the industry standard for general novels, memoirs, and non-fiction, providing generous margins and classical legibility. Pocket (5" x 8") is a compact paperback format designed for light fiction or travel editions. Selecting Trade automatically optimizes your margins for high-volume text blocks.'
  },
  {
    id: 'faq2',
    category: 'Book Formatting Basics',
    q: 'How does Gutter Safety prevent text from disappearing in print?',
    a: 'Gutter is the inner page margin that aligns along the physical binding edge of a book. Obsidian Siren Studio automatically increases your gutter margin allowance to 18px for standard trim sizes. This prevents text near the inner crease from being swallowed by the book spine after printing and gluing.'
  },
  {
    id: 'faq3',
    category: 'Academic Guidelines',
    q: 'What are the main layout requirements for MLA Format?',
    a: 'MLA (Modern Language Association) format requires double-spaced lines, 1-inch margins, Times New Roman style font, an identification title block (Student, Instructor, Course, Date) on the first page, a centered paper title, and a running header showing your Last Name and Page Number at the top-right of every sheet.'
  },
  {
    id: 'faq4',
    category: 'Academic Guidelines',
    q: 'Can I toggle between the APA Title Page and the main body pages?',
    a: 'Yes! In the Scholar Citation Formatting workspace, when APA 7th Edition style is selected, a dedicated toggle segment ("Title Page" vs "Main Paper") renders in the sidebar. This allows you to preview the formal institutional cover sheet or inspect the main research body independently.'
  },
  {
    id: 'faq5',
    category: 'Expert Consultations',
    q: 'What are the rates for manual proofreading and developmental editing?',
    a: 'Our expert rates are fully synchronized by currency selection: Proofreading is $5 (₹100) per 1000 words. Weaver developmental editing (or Scholar sentence structural rewriting) is $10 (₹200) per 1000 words. Dedicated publishing consultations are flat $50 (₹1000) per book.'
  },
  {
    id: 'faq6',
    category: 'Expert Consultations',
    q: 'How do I synchronize my Scriptorium drafts with the formatting views?',
    a: 'Your creative drafts are saved in the browser cache in real-time. In Weaver Book Formatting tab, click "Import from Writing Suite" to populate active chapters. In Scholar Citations tab, click "Sync Scriptorium" to instantly pull your thesis drafting lines into the active MLA/APA/Chicago paper mockups.'
  }
];

export default function AskObsidianView() {
  const { user } = useAuth();
  
  // Chat States
  const [chatMessages, setChatMessages] = useState([
    {
      sender: 'ai',
      text: "Greetings, author. I am Obsidian Siren Studio's AI publishing assistant. Ask me only about book formatting, print layout, citation styling, gutter safety, manuscript workflow, or consultation rates."
    }
  ]);
  const [userInput, setUserInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  
  // FAQ Accordion States
  const [faqSearchQuery, setFaqSearchQuery] = useState('');
  const [expandedFaqId, setExpandedFaqId] = useState('faq1'); // Open first item by default

  const handleChatSubmit = (e) => {
    e.preventDefault();
    if (!userInput.trim()) return;
    sendMessageToAI(userInput.trim());
  };

  const handleQuickPrompt = (prompt) => {
    sendMessageToAI(prompt);
  };

  const sendMessageToAI = async (text) => {
    setChatMessages(prev => [...prev, { sender: 'user', text }]);
    setUserInput('');
    setIsTyping(true);

    try {
      const reply = await queryAskObsidianAssistant(text);
      setChatMessages(prev => [...prev, { sender: 'ai', text: reply }]);
    } catch (error) {
      console.error('Ask Obsidian error:', error);
      setChatMessages(prev => [...prev, {
        sender: 'ai',
        text: 'Sorry, I could not generate an answer right now. Please ask a publishing-related question about Obsidian Siren Studio and try again.'
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const filteredFaqs = FAQ_DATA.filter(faq => 
    faq.q.toLowerCase().includes(faqSearchQuery.toLowerCase()) ||
    faq.a.toLowerCase().includes(faqSearchQuery.toLowerCase()) ||
    faq.category.toLowerCase().includes(faqSearchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-fade-in text-slate-100 max-w-7xl mx-auto pb-12">
      {/* Title Header */}
      <div>
        <span className="text-xs font-mono font-bold tracking-[0.25em] text-purple-400 uppercase">Obsidian Oracle</span>
        <h1 className="text-4xl font-serif text-white tracking-tight mt-1.5">Ask Obsidian</h1>
        <p className="text-slate-400 text-sm font-light leading-relaxed mt-2 max-w-3xl">
          Ask our virtual publishing oracle about print trim sizes, gutter margins, APA/MLA citation formatting, or manual editing rates.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      
      {/* LEFT COLUMN: INTERACTIVE AI PUBLISHING CHATBOT */}
      <div className="lg:col-span-2 bg-[#0C0D12]/40 border border-slate-900/80 p-4 sm:p-6 md:p-8 rounded-3xl flex flex-col justify-between h-[580px] shadow-sm relative">
        
        <div className="space-y-4 flex flex-col h-full justify-between">
          {/* Header */}
          <div className="flex items-center gap-2.5 text-purple-400 border-b border-slate-900 pb-3">
            <Sparkles className="w-5 h-5 shrink-0" />
            <div className="flex flex-col">
              <span className="font-mono text-xs tracking-[0.25em] font-bold uppercase">Obsidian Assistant</span>
              <span className="font-serif text-base font-medium text-slate-350">Virtual Publishing Oracle</span>
            </div>
          </div>

          {/* Chat Logs Window */}
          <div className="flex-1 border border-slate-900/40 bg-slate-950/20 rounded-2xl p-4 overflow-y-auto space-y-4 shadow-inner min-h-[220px]">
            {chatMessages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}>
                <div className={`max-w-[85%] rounded-2xl p-3.5 text-[15px] sm:text-base leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-purple-950/30 border border-purple-500/20 text-purple-200 font-light'
                    : 'bg-[#0B0F19]/60 border border-slate-900/50 text-slate-300 font-serif'
                }`}>
                  <div className="whitespace-pre-line leading-relaxed">{msg.text}</div>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start animate-fade-in">
                <div className="bg-[#0B0F19]/60 border border-slate-900/50 rounded-2xl px-4 py-3 flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}
          </div>

          {/* Quick prompt helper pills */}
          <div className="flex flex-wrap gap-2 py-1 select-none">
            {[
              { label: 'Trim Sizes 📐', query: 'Which trim size should I choose for a novel?' },
              { label: 'Gutter Safety 📚', query: 'Explain gutter safety margin' },
              { label: 'Citations Guide 🎓', query: 'Tell me about MLA and APA format guidelines' },
              { label: 'Expert Costs 💸', query: 'What are the expert consultation rates?' }
            ].map((pill, idx) => (
              <button
                key={idx}
                onClick={() => handleQuickPrompt(pill.query)}
                className="px-3.5 py-2 bg-[#090b0f] hover:bg-purple-950/20 border border-slate-800 hover:border-purple-500/30 rounded-xl text-sm font-mono text-slate-400 hover:text-purple-300 transition-all cursor-pointer shadow-md"
              >
                {pill.label}
              </button>
            ))}
          </div>

          {/* User chat input form */}
          <form onSubmit={handleChatSubmit} className="flex gap-2 shrink-0">
            <input 
              type="text" 
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder="Ask the Obsidian oracle about publishing specs..."
              className="flex-1 bg-slate-950 border border-slate-900 rounded-xl px-4 py-3.5 text-base text-slate-200 outline-none focus:border-purple-500/35 transition-colors placeholder:text-slate-700 font-sans"
            />
            <button
              type="submit"
              disabled={!userInput.trim() || isTyping}
              className="px-4.5 bg-gradient-to-r from-purple-700 to-indigo-700 hover:from-purple-600 hover:to-indigo-600 text-white rounded-xl shadow-md transition-all flex items-center justify-center cursor-pointer disabled:opacity-40"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>

      </div>

      {/* RIGHT COLUMN: SEARCHABLE FAQ ACCORDIONS */}
      <div className="lg:col-span-1 bg-[#0C0D12]/40 border border-slate-900/80 p-4 sm:p-6 md:p-8 rounded-3xl flex flex-col justify-start h-[580px] space-y-5 text-sans">
        
        {/* Header and Search */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-purple-400 border-b border-slate-900 pb-3">
            <HelpCircle className="w-5 h-5 shrink-0" />
            <span className="font-mono text-xs tracking-[0.25em] font-bold uppercase">Frequently Asked Questions</span>
          </div>

          <div className="relative w-full">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input 
              type="text"
              placeholder="Search terms or categories..."
              value={faqSearchQuery}
              onChange={(e) => setFaqSearchQuery(e.target.value)}
              className="w-full bg-[#050608]/90 border border-slate-900 focus:border-purple-500/40 rounded-xl pl-9 pr-4 py-2.5 text-sm font-sans text-slate-355 focus:outline-none placeholder-slate-700"
            />
          </div>
        </div>

        {/* Collapsible FAQ list container */}
        <div className="flex-1 overflow-y-auto pr-1 space-y-2.5 scrollbar-thin">
          {filteredFaqs.length > 0 ? (
            filteredFaqs.map(faq => {
              const isExpanded = expandedFaqId === faq.id;
              return (
                <div 
                  key={faq.id}
                  className="border border-slate-900/60 rounded-xl bg-slate-950/10 overflow-hidden"
                >
                  <button
                    type="button"
                    onClick={() => setExpandedFaqId(isExpanded ? '' : faq.id)}
                    className="w-full flex justify-between items-start p-4 hover:bg-slate-900/20 transition-colors text-left cursor-pointer gap-2"
                  >
                    <div className="flex flex-col space-y-1">
                      <span className="text-xs font-mono text-purple-400/80 uppercase tracking-widest">{faq.category}</span>
                      <span className="font-serif text-[15px] font-semibold text-slate-200 leading-snug">{faq.q}</span>
                    </div>
                    <div className="pt-3">
                      {isExpanded ? (
                        <ChevronDown className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                      ) : (
                        <ChevronRight className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                      )}
                    </div>
                  </button>

                  {/* expanded content */}
                  {isExpanded && (
                    <div className="p-4 pt-0 border-t border-slate-900/30 text-sm font-sans text-slate-400 leading-relaxed bg-[#050608]/20">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <p className="text-sm text-slate-650 font-mono italic text-center py-10">No matching questions found.</p>
          )}
        </div>

      </div>

      </div>
    </div>
  );
}
