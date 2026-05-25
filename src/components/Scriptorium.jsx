import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, BookOpen, Compass, Feather, FileText, Palette, 
  MessageSquare, Library, HelpCircle, Settings as SettingsIcon, LogOut, Lock,
  ChevronRight, Sparkles, Sidebar, Menu
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

// Import newly created Weaver Path modular views
import DashboardView from './weaver/DashboardView';
import PlanningView from './weaver/PlanningView';
import FormattingView from './weaver/FormattingView';
import CoverView from './weaver/CoverView';
import ConsultationView from './weaver/ConsultationView';
import AskObsidianView from './AskObsidianView';

export default function Scriptorium({ onBack }) {
  const { user, login, logout, setIsAuthModalOpen } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard', 'planning', 'formatting', 'studio', 'sanctuary'
  const [currency, setCurrency] = useState('USD'); // 'USD' or 'INR'
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Multi-book state tracking
  const [books, setBooks] = useState(() => {
    const saved = localStorage.getItem('oss_books');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.length > 0) return parsed;
      } catch (e) {
        console.error(e);
      }
    }
    return [
      { id: 'default_book', title: 'The Obsidian Siren', created: new Date().toLocaleDateString() }
    ];
  });

  const [activeBookId, setActiveBookId] = useState(() => {
    return localStorage.getItem('oss_active_book_id') || 'default_book';
  });

  const [isCreateBookModalOpen, setIsCreateBookModalOpen] = useState(false);
  const [newBookTitleInput, setNewBookTitleInput] = useState('');

  // Sync state to localStorage
  useEffect(() => {
    localStorage.setItem('oss_books', JSON.stringify(books));
  }, [books]);

  useEffect(() => {
    localStorage.setItem('oss_active_book_id', activeBookId);
  }, [activeBookId]);

  const submitCreateNewBook = (e) => {
    e.preventDefault();
    if (!newBookTitleInput.trim()) return;
    const newBook = {
      id: `book_${Date.now()}`,
      title: newBookTitleInput.trim(),
      created: new Date().toLocaleDateString()
    };
    setBooks([...books, newBook]);
    setActiveBookId(newBook.id);
    setNewBookTitleInput('');
    setIsCreateBookModalOpen(false);
  };

  // Standard static profile initials
  const initials = user && user.email ? user.email.slice(0, 2).toUpperCase() : 'W';

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 flex font-sans selection:bg-purple-500/30 selection:text-purple-200">
      
      {/* Sidebar background overlay for mobile drawer */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-30 md:hidden transition-opacity duration-300" 
          onClick={() => setIsSidebarOpen(false)} 
        />
      )}

      {/* 1. LEFT SIDEBAR NAVIGATION DRAWER */}
      <aside className={`
        fixed inset-y-0 left-0 z-40 w-64 bg-[#0B0F19] border-r border-slate-900 flex flex-col justify-between shrink-0 select-none
        transition-transform duration-300 ease-in-out md:relative md:translate-x-0 md:flex
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div>
          {/* Brand Header */}
          <div 
            onClick={() => { onBack(); setIsSidebarOpen(false); }}
            className="p-6 border-b border-slate-900 flex items-center gap-3.5 select-none cursor-pointer hover:opacity-85 transition-opacity"
            title="Back to Entrance"
          >
            <img src="/assets/OSS-navbar-logos.png" alt="Obsidian Siren Studio" className="h-9 w-9 object-contain shrink-0" />
            <div className="flex flex-col">
              <h1 className="font-serif font-bold text-lg text-white leading-tight">Obsidian</h1>
              <p className="text-[10px] font-mono text-purple-400 uppercase tracking-widest leading-none mt-0.5">Siren Studio</p>
            </div>
          </div>

          {/* Active Book Switcher */}
          <div className="p-4 border-b border-slate-900/60 space-y-2">
            <div className="flex justify-between items-center px-1">
              <span className="text-[11px] font-mono text-slate-500 uppercase tracking-widest">Active Project</span>
              {user && (
                <button 
                  onClick={() => setIsCreateBookModalOpen(true)}
                  className="text-[13px] font-mono text-purple-400 hover:text-purple-350 flex items-center gap-0.5 cursor-pointer font-bold border-none bg-transparent transition-colors"
                >
                  + New Book
                </button>
              )}
            </div>
            <select
              value={activeBookId}
              onChange={e => setActiveBookId(e.target.value)}
              className="w-full bg-slate-950 border border-slate-850 p-2 rounded-xl text-xs font-mono text-slate-350 focus:outline-none focus:border-purple-500/30 cursor-pointer"
            >
              {books.map(b => (
                <option key={b.id} value={b.id}>{b.title}</option>
              ))}
            </select>
          </div>

          {/* Mode Switcher */}
          <div className="p-4 border-b border-slate-900/60">
            <div className="bg-slate-950/60 border border-slate-900 p-2.5 rounded-xl flex justify-between items-center">
              <span className="text-sm font-mono text-slate-300 font-medium">Weaver Mode</span>
              <button 
                onClick={() => { onBack(); setIsSidebarOpen(false); }}
                className="text-sm font-mono text-purple-400 hover:text-purple-300 flex items-center gap-1 cursor-pointer"
                title="Switch craft modes"
              >
                Switch <ChevronRight className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Studio Navigation Links */}
          <nav className="p-4 space-y-1">
            <span className="text-xs font-mono text-slate-500 uppercase tracking-widest pl-3.5 mb-2 block">Studio Workspace</span>
            
            <button
              onClick={() => { setActiveTab('dashboard'); setIsSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-mono tracking-wide uppercase transition-all cursor-pointer ${
                activeTab === 'dashboard'
                  ? 'bg-purple-950/30 border border-purple-500/20 text-purple-200'
                  : 'border border-transparent text-slate-400 hover:bg-slate-900/40 hover:text-slate-200'
              }`}
            >
              <Sidebar className="w-4 h-4 shrink-0" />
              <span>Dashboard</span>
            </button>

            <button
              onClick={() => { setActiveTab('planning'); setIsSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-mono tracking-wide uppercase transition-all cursor-pointer ${
                activeTab === 'planning'
                  ? 'bg-purple-950/30 border border-purple-500/20 text-purple-200'
                  : 'border border-transparent text-slate-400 hover:bg-slate-900/40 hover:text-slate-200'
              }`}
            >
              <Feather className="w-4 h-4 shrink-0" />
              <span>Planning & Drafting</span>
            </button>

            <button
              onClick={() => { setActiveTab('formatting'); setIsSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-mono tracking-wide uppercase transition-all cursor-pointer ${
                activeTab === 'formatting'
                  ? 'bg-purple-950/30 border border-purple-500/20 text-purple-200'
                  : 'border border-transparent text-slate-400 hover:bg-slate-900/40 hover:text-slate-200'
              }`}
            >
              <FileText className="w-4 h-4 shrink-0" />
              <span>Book Formatting</span>
            </button>

            <button
              onClick={() => { setActiveTab('studio'); setIsSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-mono tracking-wide uppercase transition-all cursor-pointer ${
                activeTab === 'studio'
                  ? 'bg-purple-950/30 border border-purple-500/20 text-purple-200'
                  : 'border border-transparent text-slate-400 hover:bg-slate-900/40 hover:text-slate-200'
              }`}
            >
              <Palette className="w-4 h-4 shrink-0" />
              <span>Cover Studio</span>
            </button>

            <button
              onClick={() => { setActiveTab('sanctuary'); setIsSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-mono tracking-wide uppercase transition-all cursor-pointer ${
                activeTab === 'sanctuary'
                  ? 'bg-purple-950/30 border border-purple-500/20 text-purple-200'
                  : 'border border-transparent text-slate-400 hover:bg-slate-900/40 hover:text-slate-200'
              }`}
            >
              <MessageSquare className="w-4 h-4 shrink-0" />
              <span>Expert Consultation</span>
            </button>

            <span className="text-xs font-mono text-slate-500 uppercase tracking-widest pl-3.5 pt-4 pb-2 block">Utilities</span>
            
            <button 
              onClick={() => { setActiveTab('library'); setIsSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-mono tracking-wide uppercase transition-all cursor-pointer ${
                activeTab === 'library'
                  ? 'bg-purple-950/30 border border-purple-500/20 text-purple-200'
                  : 'border border-transparent text-slate-400 hover:bg-slate-900/40 hover:text-slate-200'
              }`}
            >
              <Library className="w-4 h-4 shrink-0" />
              <span>My Library</span>
            </button>

            <button 
              onClick={() => { setActiveTab('help'); setIsSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-mono tracking-wide uppercase transition-all cursor-pointer ${
                activeTab === 'help'
                  ? 'bg-purple-950/30 border border-purple-500/20 text-purple-200'
                  : 'border border-transparent text-slate-400 hover:bg-slate-900/40 hover:text-slate-200'
              }`}
            >
              <HelpCircle className="w-4 h-4 shrink-0" />
              <span>Ask Obsidian</span>
            </button>

            <button 
              onClick={() => { setActiveTab('settings'); setIsSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-mono tracking-wide uppercase transition-all cursor-pointer ${
                activeTab === 'settings'
                  ? 'bg-purple-950/30 border border-purple-500/20 text-purple-200'
                  : 'border border-transparent text-slate-400 hover:bg-slate-900/40 hover:text-slate-200'
              }`}
            >
              <SettingsIcon className="w-4 h-4 shrink-0" />
              <span>Settings</span>
            </button>
          </nav>
        </div>

        {/* Sidebar Footer Area */}
        <div className="flex flex-col border-t border-slate-900 bg-[#07090e]/40 divide-y divide-slate-900/60">
          {/* Back to Portal Switcher */}
          <button 
            onClick={() => { onBack(); setIsSidebarOpen(false); }}
            className="w-full flex items-center gap-2 px-6 py-3.5 text-xs font-mono uppercase tracking-widest text-slate-500 hover:text-purple-400 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Portal
          </button>

          {/* User Session Footer */}
          <div className="p-4 flex justify-between items-center">
            {user ? (
              <>
                <div className="flex items-center gap-2.5 max-w-[150px]">
                  <img src={user.photoURL || `https://ui-avatars.com/api/?name=${user.displayName || 'Artisan'}&background=random`} alt="Avatar" className="w-8 h-8 rounded-full border border-slate-800" />
                  <div className="truncate">
                    <h4 className="text-sm font-semibold text-slate-200 truncate leading-none">{user.displayName || 'User'}</h4>
                    <span className="text-xs font-mono text-slate-500 truncate block mt-0.5">{user.email}</span>
                  </div>
                </div>
                <button 
                  onClick={() => { logout(); setIsSidebarOpen(false); }}
                  className="p-2 rounded-lg bg-slate-900/40 border border-slate-850 text-red-400 hover:text-red-300 hover:border-slate-800 transition-colors cursor-pointer"
                  title="Sign out from the Atelier"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </>
            ) : (
              <button 
                onClick={() => { setIsAuthModalOpen(true); setIsSidebarOpen(false); }}
                className="w-full py-2 bg-purple-900/20 hover:bg-purple-900/40 border border-purple-800/40 rounded-xl text-sm font-mono text-purple-300 transition-colors cursor-pointer"
              >
                Sign In to Atelier
              </button>
            )}
          </div>
        </div>
      </aside>

      {/* 2. MAIN APPLICATION CONTENT VIEW */}
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        
        {/* Top Header Navbar */}
        <header className="px-4 sm:px-8 py-4 border-b border-slate-900 flex justify-between items-center bg-[#07090e]/60 backdrop-blur-md select-none z-10">
          
          {/* Dynamic Active Tab Header Title */}
          <div className="flex items-center gap-2.5">
            <button 
              onClick={() => setIsSidebarOpen(true)} 
              className="p-2 -ml-2 rounded-lg hover:bg-slate-900 text-slate-400 hover:text-slate-200 md:hidden cursor-pointer shrink-0"
              title="Open menu"
            >
              <Menu className="w-5 h-5" />
            </button>
            {activeTab === 'sanctuary' ? (
              <>
                <Sidebar className="w-4 h-4 text-slate-400" />
                <span className="font-serif font-medium text-base tracking-widest text-slate-200 uppercase">Expert Sanctuary</span>
              </>
            ) : activeTab === 'dashboard' ? (
              <>
                <BookOpen className="w-4 h-4 text-purple-400" />
                <span className="font-serif font-medium text-base tracking-wide text-white uppercase">Weaver Dashboard</span>
              </>
            ) : activeTab === 'planning' ? (
              <>
                <Feather className="w-4 h-4 text-purple-400" />
                <span className="font-serif font-medium text-base tracking-wide text-white uppercase">Planning & Drafting</span>
              </>
            ) : activeTab === 'formatting' ? (
              <>
                <FileText className="w-4 h-4 text-purple-400" />
                <span className="font-serif font-medium text-base tracking-wide text-white uppercase">Book Formatting</span>
              </>
            ) : activeTab === 'studio' ? (
              <>
                <Palette className="w-4 h-4 text-purple-400" />
                <span className="font-serif font-medium text-base tracking-wide text-white uppercase">Cover Studio</span>
              </>
            ) : activeTab === 'library' ? (
              <>
                <Library className="w-4 h-4 text-purple-400" />
                <span className="font-serif font-medium text-base tracking-wide text-white uppercase">My Library</span>
              </>
            ) : activeTab === 'help' ? (
              <>
                <HelpCircle className="w-4 h-4 text-purple-400" />
                <span className="font-serif font-medium text-base tracking-wide text-white uppercase">Ask Obsidian</span>
              </>
            ) : (
              <>
                <SettingsIcon className="w-4 h-4 text-purple-400" />
                <span className="font-serif font-medium text-base tracking-wide text-white uppercase">Settings</span>
              </>
            )}
          </div>

          {/* Segmented Currency Switcher ($ USD / ₹ INR) */}
          <div className="flex bg-slate-950 border border-slate-900 p-0.5 rounded-lg">
            <button
              onClick={() => setCurrency('USD')}
              className={`px-3 py-1 rounded text-sm font-mono font-bold tracking-wider transition-all cursor-pointer ${
                currency === 'USD'
                  ? 'bg-purple-950/40 text-purple-300 shadow-md'
                  : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              $ USD
            </button>
            <button
              onClick={() => setCurrency('INR')}
              className={`px-3 py-1 rounded text-sm font-mono font-bold tracking-wider transition-all cursor-pointer ${
                currency === 'INR'
                  ? 'bg-purple-950/40 text-purple-300 shadow-md'
                  : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              ₹ INR
            </button>
          </div>
        </header>

        {/* Dynamic Inner Page Loader */}
        <main className="flex-1 p-4 sm:p-6 md:p-8 overflow-y-auto max-h-[calc(100vh-68px)]">
          {activeTab === 'dashboard' && (
            <DashboardView onNavigate={(tab) => setActiveTab(tab)} />
          )}

          {activeTab === 'planning' && (
            <PlanningView key={activeBookId} bookId={activeBookId} />
          )}

          {activeTab === 'formatting' && (
            <FormattingView key={activeBookId} bookId={activeBookId} />
          )}

          {activeTab === 'studio' && (
            <CoverView key={activeBookId} bookId={activeBookId} />
          )}

          {activeTab === 'sanctuary' && (
            <ConsultationView currency={currency} />
          )}

          {/* Utility Placeholders for completeness */}
          {activeTab === 'library' && (
            <div className="space-y-4 animate-fade-in text-center py-20">
              <Library className="w-12 h-12 mx-auto text-slate-700" />
              <h2 className="text-2xl font-serif text-white">My Creative Library</h2>
              <p className="text-sm text-slate-400 max-w-sm mx-auto leading-relaxed">
                Unlock cloud storage to catalog manuscripts, visual cover specs, character canvases, and editorial blueprint quotes.
              </p>
            </div>
          )}

          {activeTab === 'help' && (
            <AskObsidianView />
          )}

          {activeTab === 'settings' && (
            <div className="space-y-4 animate-fade-in text-center py-20">
              <SettingsIcon className="w-12 h-12 mx-auto text-slate-700" />
              <h2 className="text-2xl font-serif text-white">Atelier Settings</h2>
              <p className="text-sm text-slate-400 max-w-sm mx-auto leading-relaxed">
                Manage cloud persistence layers, local backups, Firebase authentication scopes, and visual interface themes.
              </p>
            </div>
          )}
        </main>
      </div>

      {/* Glassmorphic Create New Book Modal */}
      {isCreateBookModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-md p-6 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="text-lg font-serif text-white font-medium">Start a New Book</h3>
              <button 
                onClick={() => setIsCreateBookModalOpen(false)}
                className="text-slate-400 hover:text-white transition-colors cursor-pointer text-xl border-none bg-transparent"
              >
                &times;
              </button>
            </div>

            <form onSubmit={submitCreateNewBook} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-mono text-slate-500 uppercase block">Book Title</label>
                <input 
                  type="text" 
                  placeholder="e.g. Echoes of the Abyss..." 
                  value={newBookTitleInput}
                  onChange={e => setNewBookTitleInput(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded-lg focus:outline-none focus:border-purple-500/30 text-slate-200 text-sm"
                  required
                  autoFocus
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-800/60">
                <button
                  type="button"
                  onClick={() => setIsCreateBookModalOpen(false)}
                  className="px-4 py-2 bg-slate-950 hover:bg-slate-900 border border-slate-850 text-slate-400 hover:text-slate-200 font-mono text-xs rounded-xl transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white font-mono text-xs font-bold rounded-xl transition-all cursor-pointer shadow-lg shadow-purple-900/10 border-none"
                >
                  Create Book
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}