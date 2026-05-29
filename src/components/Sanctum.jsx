import React, { useState } from 'react';
import { 
  ArrowLeft, BookOpen, Compass, Feather, FileText, Layers, 
  MessageSquare, Library, HelpCircle, Settings as SettingsIcon, LogOut, Lock,
  ChevronRight, Sparkles, Sidebar, GraduationCap, HardDrive, Database, Award,
  Folder, Edit3, Menu
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

// Import modular Scholar views
import DashboardView from './scholar/DashboardView';
import InquiryVault from './scholar/InquiryVault';
import AcademicScriptorium from './scholar/AcademicScriptorium';
import CitationsView from './scholar/CitationsView';
import ExpertConsultationView from './scholar/ExpertConsultationView';
import AskObsidianView from './AskObsidianView';

export default function Sanctum({ onBack }) {
  const { user, logout, setIsAuthModalOpen } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard', 'vault', 'scriptorium', 'citations', 'consultation'
  const [currency, setCurrency] = useState('USD'); // 'USD' or 'INR'
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Central Shared Academic Reference Document State
  const [documents, setDocuments] = useState([
    {
      id: 'doc-1',
      name: 'Algorithmic_State_Decoupling.pdf',
      title: 'Decoupled State Paradigms in Modern Distributed Registries',
      author: 'Smith, J. & Davis, K.',
      year: '2025',
      publication: 'Systems Analysis Quarterly',
      size: '1.42 MB',
      uploadDate: 'May 12, 2026',
      type: 'PDF',
      abstract: 'This research examines state trees in highly concurrent environments. We propose a decoupled paradigm that decouples local writes from distributed consensus thresholds, yielding major performance gains under latency limits.',
      methodology: 'Simulations were executed across a 50-node local cluster running on optimized PyTorch containers, logging consensus locks at 10ms frequencies.',
      findings: 'Decoupled trees achieved a 28% throughput gains under high concurrency parameters, maintaining transactional integrity.',
      arguments: 'Decoupling distributed validation scales linearly, while monolithic state structures yield structural bottlenecks.'
    },
    {
      id: 'doc-2',
      name: 'Zero-Gravity_Microfluidics.docx',
      title: 'Protein Synthesis Dynamics in suspensions under Micro-Gravitational stress factors',
      author: 'Bio, A. & Gene, H.',
      year: '2026',
      publication: 'Nature Biotechnology Horizons',
      size: '840 KB',
      uploadDate: 'May 20, 2026',
      type: 'Document',
      abstract: 'An investigation into cellular divide timelines in zero-gravity suspended microfluidic chambers. We map protein synthesis indicators to analyze rapid evolution patterns.',
      methodology: 'Cultures were suspension-divided in automated bioreactors inside microfluidic chips under continuous microgravity exposure over a 168-hour timeline.',
      findings: 'Divide cycles speed accelerated by 31%, accompanied by transcription changes in stress response markers.',
      arguments: 'Zero-gravity cellular stress drives rapid evolutionary adaptation pathways, presenting significant bio-horizons for space habitats.'
    }
  ]);

  return (
    <div className="h-screen overflow-hidden bg-[#07090e] text-slate-100 flex font-sans selection:bg-purple-500/30 selection:text-purple-200">
      
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
        <div className="flex-1 overflow-y-auto scrollbar-thin">
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

          {/* Mode Switcher */}
          <div className="p-4 border-b border-slate-900/60">
            <div className="bg-slate-950/60 border border-slate-900 p-2.5 rounded-xl flex justify-between items-center">
              <span className="text-sm font-mono text-slate-350 font-medium">Scholar Mode</span>
              <button 
                onClick={() => { onBack(); setIsSidebarOpen(false); }}
                className="text-sm font-mono text-purple-400 hover:text-purple-300 flex items-center gap-0.5 cursor-pointer"
                title="Switch craft modes"
              >
                Switch <ChevronRight className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Studio Navigation Links matching screenshot 1 */}
          <nav className="p-4 space-y-1">
            <span className="text-xs font-mono text-slate-500 uppercase tracking-widest pl-3.5 mb-2.5 block">Studio Workspace</span>
            
            <button
              onClick={() => { setActiveTab('dashboard'); setIsSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-mono tracking-wide uppercase transition-all border cursor-pointer ${
                activeTab === 'dashboard'
                  ? 'bg-purple-950/30 border-purple-500/20 text-purple-200'
                  : 'border-transparent text-slate-400 hover:bg-slate-900/40 hover:text-slate-200'
              }`}
            >
              <Sidebar className="w-4 h-4 shrink-0" />
              <span>Dashboard</span>
            </button>

            <button
              onClick={() => { setActiveTab('vault'); setIsSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-mono tracking-wide uppercase transition-all border cursor-pointer ${
                activeTab === 'vault'
                  ? 'bg-purple-950/30 border-purple-500/20 text-purple-200'
                  : 'border-transparent text-slate-400 hover:bg-slate-900/40 hover:text-slate-200'
              }`}
            >
              <Folder className="w-4 h-4 shrink-0" />
              <span>Research Vault</span>
            </button>

            <button
              onClick={() => { setActiveTab('scriptorium'); setIsSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-mono tracking-wide uppercase transition-all border cursor-pointer ${
                activeTab === 'scriptorium'
                  ? 'bg-purple-950/30 border-purple-500/20 text-purple-200'
                  : 'border-transparent text-slate-400 hover:bg-slate-900/40 hover:text-slate-200'
              }`}
            >
              <Edit3 className="w-4 h-4 shrink-0" />
              <span>Scriptorium</span>
            </button>

            <button
              onClick={() => { setActiveTab('citations'); setIsSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-mono tracking-wide uppercase transition-all border cursor-pointer ${
                activeTab === 'citations'
                  ? 'bg-purple-950/30 border-purple-500/20 text-purple-200'
                  : 'border-transparent text-slate-400 hover:bg-slate-900/40 hover:text-slate-200'
              }`}
            >
              <Layers className="w-4 h-4 shrink-0" />
              <span>Citations</span>
            </button>

            <button
              onClick={() => { setActiveTab('consultation'); setIsSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-mono tracking-wide uppercase transition-all border cursor-pointer ${
                activeTab === 'consultation'
                  ? 'bg-purple-950/30 border-purple-500/20 text-purple-200'
                  : 'border-transparent text-slate-400 hover:bg-slate-900/40 hover:text-slate-200'
              }`}
            >
              <Award className="w-4 h-4 shrink-0" />
              <span>Expert Consultation</span>
            </button>

            <span className="text-xs font-mono text-slate-500 uppercase tracking-widest pl-3.5 pt-4 pb-2 block">Utilities</span>
            
            <button 
              onClick={() => { setActiveTab('library'); setIsSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-mono tracking-wide uppercase transition-all border cursor-pointer ${
                activeTab === 'library'
                  ? 'bg-purple-950/30 border-purple-500/20 text-purple-200'
                  : 'border-transparent text-slate-400 hover:bg-slate-900/40 hover:text-slate-200'
              }`}
            >
              <Library className="w-4 h-4 shrink-0" />
              <span>My Library</span>
            </button>

            <button 
              onClick={() => { setActiveTab('help'); setIsSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-mono tracking-wide uppercase transition-all border cursor-pointer ${
                activeTab === 'help'
                  ? 'bg-purple-950/30 border-purple-500/20 text-purple-200'
                  : 'border-transparent text-slate-400 hover:bg-slate-900/40 hover:text-slate-200'
              }`}
            >
              <HelpCircle className="w-4 h-4 shrink-0" />
              <span>Ask Obsidian</span>
            </button>

            <button 
              onClick={() => { setActiveTab('settings'); setIsSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-mono tracking-wide uppercase transition-all border cursor-pointer ${
                activeTab === 'settings'
                  ? 'bg-purple-950/30 border-purple-500/20 text-purple-200'
                  : 'border-transparent text-slate-400 hover:bg-slate-900/40 hover:text-slate-200'
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
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        
        {/* Top Header Navbar */}
        <header className="px-4 sm:px-8 py-4 border-b border-slate-900 flex justify-between items-center bg-[#07090e]/60 backdrop-blur-md select-none z-10">
          
          {/* Dynamic Active Tab Header Title matching screenshots */}
          <div className="flex items-center gap-2.5">
            <button 
              onClick={() => setIsSidebarOpen(true)} 
              className="p-2 -ml-2 rounded-lg hover:bg-slate-900 text-slate-400 hover:text-slate-200 md:hidden cursor-pointer shrink-0"
              title="Open menu"
            >
              <Menu className="w-5 h-5" />
            </button>
            {activeTab === 'dashboard' ? (
              <>
                <Sidebar className="w-4 h-4 text-slate-400" />
                <span className="font-serif font-medium text-base tracking-widest text-slate-200 uppercase">SCHOLAR DASHBOARD</span>
              </>
            ) : activeTab === 'vault' ? (
              <>
                <Sidebar className="w-4 h-4 text-slate-400" />
                <span className="font-serif font-medium text-base tracking-widest text-slate-200 uppercase">SOURCE VAULT</span>
              </>
            ) : activeTab === 'scriptorium' ? (
              <>
                <Sidebar className="w-4 h-4 text-slate-400" />
                <span className="font-serif font-medium text-base tracking-widest text-slate-200 uppercase">SCRIPTORIUM</span>
              </>
            ) : activeTab === 'citations' ? (
              <>
                <Sidebar className="w-4 h-4 text-slate-400" />
                <span className="font-serif font-medium text-base tracking-widest text-slate-200 uppercase">CITATIONS</span>
              </>
            ) : activeTab === 'consultation' ? (
              <>
                <Sidebar className="w-4 h-4 text-slate-400" />
                <span className="font-serif font-medium text-base tracking-widest text-slate-200 uppercase">EXPERT SANCTUARY</span>
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
            <DashboardView 
              onNavigate={(tab) => setActiveTab(tab)} 
            />
          )}

          {activeTab === 'vault' && (
            <InquiryVault 
              documents={documents} 
              setDocuments={setDocuments} 
            />
          )}

          {activeTab === 'scriptorium' && (
            <AcademicScriptorium 
              documents={documents} 
            />
          )}

          {activeTab === 'citations' && (
            <CitationsView 
            />
          )}

          {activeTab === 'consultation' && (
            <ExpertConsultationView 
              currency={currency} 
            />
          )}

          {/* Utility Placeholders */}
          {activeTab === 'library' && (
            <div className="space-y-4 animate-fade-in text-center py-20">
              <Library className="w-12 h-12 mx-auto text-slate-700" />
              <h2 className="text-2xl font-serif text-white">My Creative Library</h2>
              <p className="text-base text-slate-400 max-w-sm mx-auto leading-relaxed">
                Unlock cloud storage to catalog reference files, visual cover assets, and bibliographic citation collections.
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
              <p className="text-base text-slate-400 max-w-sm mx-auto leading-relaxed">
                Manage cloud credentials, institutional configurations, visual theme layers, and local cache backups.
              </p>
            </div>
          )}
        </main>
      </div>

    </div>
  );
}