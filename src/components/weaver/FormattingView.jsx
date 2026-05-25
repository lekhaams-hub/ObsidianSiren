import React, { useState } from 'react';
import { FileText, Eye, Upload, Sparkles, X, ChevronRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const PRESETS = [
  {
    id: 'novel',
    name: 'Novel Format',
    font: 'Cormorant Garamond',
    margins: '1.0 in (Standard Gutter)',
    spacing: '1.5 lines',
    titleStyle: 'Centred, Letter-spaced, Small-Caps',
    desc: 'Clean, elegant publishing layout optimal for long fiction, historical dramas, and complex fantasy sagas.',
    previewText: 'The sea was a restless inkwell tonight. Dr. Lekhaa Vance stood on the obsidian shores, watching the tide surge against the black sand spires. The air was thick with the scent of brine and decaying kelp, carrying the echo of a song she had spent half her life trying to forget...'
  },
  {
    id: 'poetry',
    name: 'Poetry Format',
    font: 'EB Garamond (Italic)',
    margins: '1.5 in (Wide Sides)',
    spacing: '1.15 lines',
    titleStyle: 'Left-aligned, Light-italic, Minimal',
    desc: 'Centered stanzas and delicate, spacious typography. Designed to let every word breathe in the silence of the page.',
    previewText: 'A hum beneath the obsidian silt,\nA song constructed in water and salt.\nThe statue waits,\nbound in velvet and rust,\ntranslating the tide into silence and dust.'
  },
  {
    id: 'ebook',
    name: 'Kindle/eBook Format',
    font: 'Inter (Slab)',
    margins: '0.5 in (Compact)',
    spacing: '1.25 lines',
    titleStyle: 'Bold, Left-aligned, Modern Sans',
    desc: 'Reflowable screens, optimized line widths, and high-readability fonts. Tailored for seamless digital consumption.',
    previewText: 'Dr. Lekhaa Vance adjusted her brass-rimmed spectacles and peered into the diving logs. In 2024, she had pulled a heavy wooden chest from the sunken ruins of the Hesperus. Now, three hundred miles north, the wood had dried, but the mask inside remained cold.'
  },
  {
    id: 'paperback',
    name: 'Paperback Format',
    font: 'Georgia',
    margins: '0.75 in (0.125 in Gutter)',
    spacing: '1.35 lines',
    titleStyle: 'Centred serif, Bold, Medium-Caps',
    desc: 'Classical book layout featuring optimized industry margins, gutter allowances, and perfect readability for physical printing.',
    previewText: 'Before the ink had dried on the diving log, the crew began to gather at the bulkhead. "The frequency is shifting again, Doctor," the first mate whispered, his eyes bloodshot from lack of sleep. Lekhaa did not answer. She merely nodded.'
  },
  {
    id: 'minimal',
    name: 'Minimal Literary Format',
    font: 'EB Garamond',
    margins: '1.25 in (Spacious)',
    spacing: '1.5 lines',
    titleStyle: 'Centred serif, Minimalist, Light',
    desc: 'High-end indie publishing aesthetic. Captures the prestigious, quiet authority of independent presses and academic journals.',
    previewText: 'Let it be noted that the mask was not forged of natural stone. The mineral analysis Vance performed off Siren Island revealed a lattice of microscopic copper channels, pulsing with a charge that should have dissolved in seawater.'
  },
  {
    id: 'children',
    name: 'Children\'s Picture Book',
    font: 'Outfit / Sans',
    margins: '0.5 in (Full bleeding bleed)',
    spacing: '2.0 lines',
    titleStyle: 'Large Sans-serif, Playful, Heavy',
    desc: 'Generous layout margins designed specifically to sit side-by-side with full-bleed illustrations and colored backgrounds.',
    previewText: 'Once upon a midnight wave,\nThe siren sang a tune so brave!\nAnd every little fish in bed\nNodded their sleepy, scales-bright head.'
  }
];

export default function FormattingView() {
  const { user, setIsAuthModalOpen } = useAuth();
  const [activePresetId, setActivePresetId] = useState('novel');
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Assisted Request states
  const [assistedRequest, setAssistedRequest] = useState({
    genre: '',
    style: 'novel',
    trimSize: '6" x 9"',
    notes: '',
    email: user ? user.email : '',
    fileAttached: false
  });
  const [requestStatus, setRequestStatus] = useState(''); // 'sending', 'success'

  const activePreset = PRESETS.find(p => p.id === activePresetId) || PRESETS[0];

  const handleRequestSubmit = (e) => {
    e.preventDefault();
    if (!user) {
      setIsAuthModalOpen(true);
      return;
    }
    setRequestStatus('sending');
    setTimeout(() => {
      setRequestStatus('success');
      setAssistedRequest({ genre: '', style: 'novel', trimSize: '6" x 9"', notes: '', email: user.email, fileAttached: false });
    }, 1500);
  };

  return (
    <div className="space-y-6 animate-fade-in relative">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="text-xs font-mono tracking-[0.3em] text-purple-400 uppercase">Window II</h3>
          <h1 className="text-4xl font-serif text-white tracking-tight">Book Formatting</h1>
          <p className="text-slate-400 text-sm font-light mt-1">
            Sculpt your manuscript. Choose presets to preview page designs or submit for manual publisher formatting.
          </p>
        </div>
        <button 
          onClick={() => {
            if (!user) setIsAuthModalOpen(true);
            else setIsModalOpen(true);
          }}
          className="px-5 py-2.5 bg-purple-600 hover:bg-purple-500 font-mono text-white text-sm font-semibold rounded-xl flex items-center gap-1.5 transition-all shadow-lg shadow-purple-900/10 cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5" />
          Request Assisted Formatting
        </button>
      </div>

      {/* Main Dual Columns layout */}
      <div className="grid md:grid-cols-3 gap-6">
        
        {/* Left Column: Preset Template Cards */}
        <div className="md:col-span-2 space-y-4 max-h-[500px] overflow-y-auto pr-1">
          <span className="text-xs font-mono uppercase text-slate-500 tracking-wider block">Visual Template Presets</span>
          
          <div className="grid sm:grid-cols-2 gap-4">
            {PRESETS.map(preset => (
              <div
                key={preset.id}
                onClick={() => setActivePresetId(preset.id)}
                className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between h-[180px] ${
                  activePresetId === preset.id
                    ? 'bg-purple-950/20 border-purple-500/40 shadow-xl'
                    : 'bg-[#0d0a15]/40 border-slate-800/80 hover:border-slate-700/80 hover:bg-[#0d0a15]/80'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex justify-between items-start">
                    <h3 className="font-serif text-lg font-medium text-slate-100">{preset.name}</h3>
                    {activePresetId === preset.id && (
                      <span className="w-2 h-2 rounded-full bg-purple-500" />
                    )}
                  </div>
                  <p className="text-xs text-slate-400 font-light leading-normal line-clamp-3">
                    {preset.desc}
                  </p>
                </div>

                <div className="flex justify-between items-center text-xs font-mono text-slate-500 border-t border-slate-800/60 pt-2 mt-2">
                  <span>Font: {preset.font}</span>
                  <span>Margins: {preset.margins.split(' ')[0]}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Live Mockup Page Preview */}
        <div className="space-y-4">
          <span className="text-xs font-mono uppercase text-slate-500 tracking-wider block">Interactive Print Preview</span>

          <div className="bg-[#120d18]/40 border border-slate-800/80 rounded-2xl p-6 flex flex-col justify-between min-h-[440px] shadow-inner relative overflow-hidden">
            {/* Page mockup border */}
            <div className="bg-[#FCFBF8] border border-amber-950/15 rounded-md p-6 min-h-[340px] flex flex-col justify-between text-slate-850 shadow-2xl relative select-none">
              
              {/* Layout details */}
              <div className="text-[10px] font-mono text-slate-400 border-b border-slate-100 pb-1 flex justify-between tracking-wider">
                <span>Page 01</span>
                <span>{activePreset.name.toUpperCase()} PREVIEW</span>
              </div>

              {/* Page title styling based on preset */}
              <div className="text-center py-4">
                <h4 
                  style={{
                    fontFamily: activePreset.id === 'children' || activePreset.id === 'ebook' ? 'Inter' : 'Cormorant Garamond',
                    fontWeight: activePreset.id === 'ebook' || activePreset.id === 'children' ? '700' : '400',
                    fontSize: activePreset.id === 'children' ? '20px' : '16px',
                    letterSpacing: activePreset.id === 'novel' ? '0.2em' : '0.05em',
                    textTransform: activePreset.id === 'novel' || activePreset.id === 'minimal' ? 'uppercase' : 'none'
                  }}
                  className="text-[#07090e]"
                >
                  Chapter I: The Abyss
                </h4>
                <div className="w-4 h-px bg-slate-200 mx-auto mt-1" />
              </div>

              {/* Sample draft preview */}
              <p 
                style={{
                  fontFamily: activePreset.id === 'children' || activePreset.id === 'ebook' ? 'sans-serif' : 'Cormorant Garamond',
                  lineHeight: activePreset.id === 'children' ? '2.0' : activePreset.id === 'novel' || activePreset.id === 'minimal' ? '1.6' : '1.3',
                  fontSize: activePreset.id === 'children' ? '14px' : '13px',
                  textAlign: activePreset.id === 'poetry' ? 'center' : 'justify'
                }}
                className="text-slate-800 font-light flex-1 pt-2 leading-relaxed"
              >
                {activePreset.previewText}
              </p>

              {/* Footer */}
              <div className="text-center text-[9px] font-mono text-slate-400 border-t border-slate-100 pt-1 tracking-widest mt-4">
                OBSIDIAN SIREN STUDIO
              </div>
            </div>

            {/* Print details spec */}
            <div className="bg-slate-950/40 border border-slate-800/80 rounded-xl p-3.5 space-y-2 mt-4">
              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                <div>
                  <span className="text-slate-500 uppercase block text-[10px]">Typography</span>
                  <span className="text-purple-300 font-semibold">{activePreset.font}</span>
                </div>
                <div>
                  <span className="text-slate-500 uppercase block text-[10px]">Margins</span>
                  <span className="text-purple-300 font-semibold">{activePreset.margins}</span>
                </div>
                <div>
                  <span className="text-slate-500 uppercase block text-[10px]">Line Spacing</span>
                  <span className="text-purple-300 font-semibold">{activePreset.spacing}</span>
                </div>
                <div>
                  <span className="text-slate-500 uppercase block text-[10px]">Title Style</span>
                  <span className="text-purple-300 font-semibold">{activePreset.titleStyle}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* ASSISTED FORMATTING REQUEST MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="relative w-full max-w-lg p-8 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl">
            <button 
              onClick={() => {
                setIsModalOpen(false);
                setRequestStatus('');
              }}
              className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-indigo-900 flex items-center justify-center shadow-lg shadow-purple-900/20 text-purple-200">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-2xl font-serif text-white">Assisted Publishing Formatting</h2>
                <p className="text-xs text-slate-400">Let our formatting specialists manually sculpt your custom manuscript.</p>
              </div>
            </div>

            {requestStatus === 'success' ? (
              <div className="text-center py-8 space-y-4">
                <div className="w-12 h-12 rounded-full bg-purple-950/50 border border-purple-500/20 flex items-center justify-center mx-auto text-purple-400">
                  <Sparkles className="w-5 h-5 animate-pulse" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-serif text-white">Request Transmitted</h3>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
                    Your manuscript and formatting specs have been securely transmitted to the Obsidian Siren Atelier. We will email you your invoice and blueprint outlines shortly.
                  </p>
                </div>
                <button 
                  onClick={() => {
                    setIsModalOpen(false);
                    setRequestStatus('');
                  }}
                  className="px-6 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-mono text-slate-300 cursor-pointer"
                >
                  Return to Studio
                </button>
              </div>
            ) : (
              <form onSubmit={handleRequestSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-mono text-slate-500 uppercase block">Manuscript Genre</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Dark Fantasy..." 
                      value={assistedRequest.genre}
                      onChange={e => setAssistedRequest({...assistedRequest, genre: e.target.value})}
                      className="w-full bg-slate-950 text-sm border border-slate-800 p-2.5 rounded-lg focus:outline-none focus:border-purple-500/25 text-slate-200"
                      required
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-mono text-slate-500 uppercase block">Target Trim Size</label>
                    <select 
                      value={assistedRequest.trimSize}
                      onChange={e => setAssistedRequest({...assistedRequest, trimSize: e.target.value})}
                      className="w-full bg-slate-950 text-sm border border-slate-800 p-2.5 rounded-lg focus:outline-none focus:border-purple-500/25 text-slate-300"
                    >
                      <option>5" x 8" (Pocket Fiction)</option>
                      <option>6" x 9" (Standard Paperback)</option>
                      <option>8" x 10" (Illustrated Album)</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-slate-500 uppercase block">Special Formatting Notes / House Styles</label>
                  <textarea 
                    placeholder="Describe specific spacing preferences, headers, fonts, drop-cap wishes, or margin specifications..." 
                    value={assistedRequest.notes}
                    onChange={e => setAssistedRequest({...assistedRequest, notes: e.target.value})}
                    className="w-full bg-slate-950 text-sm border border-slate-800 p-2.5 rounded-lg focus:outline-none focus:border-purple-500/25 text-slate-200 h-20 resize-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-slate-500 uppercase block">Manuscript Upload (.docx / .pdf / .rtf)</label>
                  <div className="border border-dashed border-slate-800 bg-slate-950 rounded-xl p-4 text-center cursor-pointer relative hover:border-purple-500/20 transition-colors">
                    <input 
                      type="file" 
                      accept=".docx,.pdf,.rtf"
                      onChange={() => setAssistedRequest({...assistedRequest, fileAttached: true})}
                      className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                    />
                    <div className="flex flex-col items-center justify-center space-y-1 text-slate-500">
                      <Upload className="w-5 h-5 text-slate-700" />
                      <span className="text-xs font-mono">
                        {assistedRequest.fileAttached ? 'Manuscript Attached ✅' : 'Choose manuscript file...'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-slate-500 uppercase block">Contact Email Address</label>
                  <input 
                    type="email" 
                    placeholder="email@example.com..." 
                    value={assistedRequest.email}
                    onChange={e => setAssistedRequest({...assistedRequest, email: e.target.value})}
                    className="w-full bg-slate-950 text-sm border border-slate-800 p-2.5 rounded-lg focus:outline-none focus:border-purple-500/25 text-slate-200"
                    required
                  />
                </div>

                <button 
                  type="submit" 
                  disabled={requestStatus === 'sending'}
                  className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-sm font-semibold font-mono tracking-wider uppercase transition-colors cursor-pointer"
                >
                  {requestStatus === 'sending' ? 'Transmitting...' : 'Submit Assisted Request'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
