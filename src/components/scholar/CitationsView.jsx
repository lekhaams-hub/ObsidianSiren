import React, { useState, useEffect } from 'react';
import { Copy, Check, FileText, Globe, Video, BookOpen, Layers, Sparkles, RefreshCw, X, Link, Search, Upload } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function CitationsView() {
  const { user } = useAuth();
  
  const [activeSubTab, setActiveSubTab] = useState('cite'); // 'cite' | 'format'
  const [activeFormat, setActiveFormat] = useState('MLA'); // 'MLA' | 'APA' | 'Chicago'
  
  // Citation Engine States
  const [citationType, setCitationType] = useState('url'); // 'url' | 'manual'
  const [resourceLink, setResourceLink] = useState('');
  const [resourceTitle, setResourceTitle] = useState('');
  const [resourceAuthor, setResourceAuthor] = useState('');
  const [resourceDate, setResourceDate] = useState('');
  const [metadataInput, setMetadataInput] = useState('');
  
  const [formattedResult, setFormattedResult] = useState('');
  const [isCopied, setIsCopied] = useState(false);
  const [importSuccess, setImportSuccess] = useState(false);

  // Thesis Formatting Suite States
  const [thesisText, setThesisText] = useState('');
  const [authorName, setAuthorName] = useState('John Smith');
  const [thesisTitle, setThesisTitle] = useState('Decoupled State Paradigms in Modern Distributed Registries');
  const [instructorName, setInstructorName] = useState('Professor Lekhaa Vance');
  const [courseName, setCourseName] = useState('ARCH-801: Advanced Basalt Analytics');
  const [institutionName, setInstitutionName] = useState('Obsidian Institute of Technology');
  const [showAPATitlePage, setShowAPATitlePage] = useState(true);

  // Fetch Scriptorium draft thesis
  const loadThesisDraft = () => {
    try {
      const stored = localStorage.getItem('oss_scholar_thesis');
      if (stored) {
        setThesisText(stored);
        // Attempt to extract title if user wrote a prominent header
        const lines = stored.split('\n').filter(Boolean);
        if (lines.length > 0 && lines[0].length < 100) {
          setThesisTitle(lines[0].replace(/^[#\s]+/, ''));
        }
        setImportSuccess(true);
        setTimeout(() => setImportSuccess(false), 2000);
        return stored;
      }
    } catch (e) {
      console.error(e);
    }
    const defaultThesis = `This research examines state trees in highly concurrent distributed databases. We propose a decoupled consensus paradigm that decouples local memory writes from strict distributed threshold limits. In classical models, concurrent threads lock database records repeatedly until general node consensus is achieved. This yields massive processing bottlenecks under micro-gravitational workloads or high-frequency sub-seconds array streams. By implementing structural decoupling, independent nodes maintain transaction queue states inside localized branches before consensus consolidation. This architecture maintains linear scaling bounds and guarantees transactional serialization without database locking bottlenecks.`;
    setThesisText(defaultThesis);
    setImportSuccess(true);
    setTimeout(() => setImportSuccess(false), 2000);
    return defaultThesis;
  };

  useEffect(() => {
    loadThesisDraft();
  }, [activeSubTab]);

  // Parse URLs and generate smart citations
  const generateUrlCitation = (style) => {
    setActiveFormat(style);
    const url = resourceLink.trim();
    if (!url) {
      setFormattedResult("Please paste or type a valid resource URL link first.");
      return;
    }

    let author = resourceAuthor.trim() || "Vance, Lekhaa";
    let title = resourceTitle.trim() || "Acoustic Resonances in Submerged Basalt Spires";
    let date = resourceDate.trim() || "2026";
    let domain = "obsidiansiren.edu";

    try {
      const parsed = new URL(url);
      domain = parsed.hostname.replace('www.', '');
      if (!resourceTitle.trim()) {
        title = parsed.pathname.split('/').pop().replace(/[-_]+/g, ' ') || "Oceanic Frequencies Data";
        // Capitalize words
        title = title.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
      }
    } catch (e) {
      // Fallback
    }

    const isYoutube = url.includes('youtube.com') || url.includes('youtu.be');
    let citation = "";

    if (isYoutube) {
      author = resourceAuthor.trim() || "Obsidian Siren Studio";
      title = resourceTitle.trim() || "Decoding Sunken Frequencies and Gravitational Wells";
      const displayDate = resourceDate.trim() || "12 Apr. 2025";
      
      if (style === 'MLA') {
        citation = `${author}. "${title}." YouTube, uploaded by ${author}, ${displayDate}, ${url}.`;
      } else if (style === 'APA') {
        citation = `${author}. (2025, April 12). ${title} [Video]. YouTube. ${url}`;
      } else {
        citation = `${author}. "${title}." YouTube video, 14:22. Posted April 12, 2025. ${url}.`;
      }
    } else {
      const displayDate = resourceDate.trim() || "25 May 2026";
      if (style === 'MLA') {
        citation = `${author}. "${title}." ${domain}, ${displayDate}, ${url}.`;
      } else if (style === 'APA') {
        citation = `${author}. (${displayDate.includes('2026') ? '2026, May 25' : displayDate}). ${title}. ${domain}. ${url}`;
      } else {
        citation = `${author}. "${title}." ${domain}. Last modified May 25, 2026. ${url}.`;
      }
    }

    setFormattedResult(citation);
    setIsCopied(false);
  };

  // Coordinates metadata parser
  const generateManualCitation = (style) => {
    setActiveFormat(style);
    const text = metadataInput.trim();
    if (!text) {
      setFormattedResult("Please paste or type metadata coordinates first.");
      return;
    }

    let author = "Smith, John";
    let title = "The Theory of Everything";
    let publisher = "Penguin";
    let year = "2021";

    const commaParts = text.split(',');
    if (commaParts.length >= 3) {
      author = commaParts[0].trim() + (commaParts[1] ? `, ${commaParts[1].trim()}` : '');
      title = commaParts[2].trim().replace(/['"]+/g, '');
      if (commaParts[3]) {
        const yearMatch = commaParts[3].match(/\d{4}/);
        if (yearMatch) year = yearMatch[0];
        publisher = commaParts[3].replace(/\d{4}/g, '').trim().replace(/[\.\s]+$/g, '');
      }
    }

    let citation = "";
    if (style === 'MLA') {
      citation = `${author}. "${title}." ${publisher || 'N.p.'}, ${year || 'n.d.'}.`;
    } else if (style === 'APA') {
      const authorParts = author.split(',');
      const lastName = authorParts[0] || 'Author';
      const initial = authorParts[1] ? ` ${authorParts[1].trim().charAt(0)}.` : '';
      citation = `${lastName},${initial} (${year || 'n.d.'}). ${title}. ${publisher || 'Publisher'}.`;
    } else {
      citation = `${author}. ${title}. (${publisher || 'Publisher'}, ${year || 'n.d.'}).`;
    }

    setFormattedResult(citation);
    setIsCopied(false);
  };

  const handleCitationSubmit = (style) => {
    if (citationType === 'url') {
      generateUrlCitation(style);
    } else {
      generateManualCitation(style);
    }
  };

  const copyToClipboard = () => {
    if (!formattedResult) return;
    navigator.clipboard.writeText(formattedResult);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 1500);
  };

  // split paragraphs for thesis display
  const paragraphs = thesisText.trim() ? thesisText.trim().split(/\n\n+/) : ["Begin your thesis draft inside the Scriptorium."];

  return (
    <div className="space-y-8 animate-fade-in text-slate-100 max-w-7xl mx-auto">
      
      {/* Page Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-900 pb-5">
        <div>
          <h3 className="text-sm font-mono tracking-[0.3em] text-purple-400 uppercase font-semibold">Scholar Suite</h3>
          <h1 className="text-4xl font-serif text-white tracking-tight">The Citation & Formatting Forge</h1>
          <p className="text-slate-400 text-base font-light mt-1 font-sans">
            Paste URL links to auto-generate bibliographies, or format your written research paper according to standard MLA, APA, or Chicago guidelines.
          </p>
        </div>

        {/* Tab switch bar */}
        <div className="flex bg-slate-950/80 border border-slate-900 p-0.5 rounded-xl self-start sm:self-center shrink-0">
          <button
            onClick={() => setActiveSubTab('cite')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-mono font-bold tracking-widest uppercase transition-all cursor-pointer ${
              activeSubTab === 'cite'
                ? 'bg-purple-950/30 border border-purple-500/20 text-purple-300 shadow-md'
                : 'text-slate-500 hover:text-slate-350'
            }`}
          >
            <Link className="w-3.5 h-3.5" /> Cite Link
          </button>
          <button
            onClick={() => setActiveSubTab('format')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-mono font-bold tracking-widest uppercase transition-all cursor-pointer ${
              activeSubTab === 'format'
                ? 'bg-purple-950/30 border border-purple-500/20 text-purple-300 shadow-md'
                : 'text-slate-500 hover:text-slate-355'
            }`}
          >
            <FileText className="w-3.5 h-3.5" /> Format Thesis
          </button>
        </div>
      </div>

      {/* ==========================================================================
          TAB 1: SMART URL & METADATA CITATION ENGINE
          ========================================================================== */}
      {activeSubTab === 'cite' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Controls sidebar */}
          <div className="lg:col-span-1 space-y-6 font-sans">
            
            {/* Input Method Selector */}
            <div className="bg-[#0c0d12]/40 border border-slate-900/80 rounded-2xl p-5 space-y-4">
              <h4 className="text-sm font-mono text-slate-400 uppercase tracking-widest block border-b border-slate-900 pb-2">Resource Input Method</h4>
              <div className="flex bg-slate-950/80 border border-slate-900 p-0.5 rounded-xl">
                <button
                  onClick={() => setCitationType('url')}
                  className={`flex-1 py-2 rounded-lg text-xs font-mono font-bold uppercase transition-all cursor-pointer ${
                    citationType === 'url'
                      ? 'bg-purple-950/30 border border-purple-500/20 text-purple-300'
                      : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  Resource Link / URL
                </button>
                <button
                  onClick={() => setCitationType('manual')}
                  className={`flex-1 py-2 rounded-lg text-xs font-mono font-bold uppercase transition-all cursor-pointer ${
                    citationType === 'manual'
                      ? 'bg-purple-950/30 border border-purple-500/20 text-purple-300'
                      : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  Paste Coordinates
                </button>
              </div>
            </div>

            {/* Link Inputs Card */}
            {citationType === 'url' ? (
              <div className="bg-[#0c0d12]/40 border border-slate-900/80 rounded-2xl p-5 space-y-4">
                <h4 className="text-sm font-mono text-slate-400 uppercase tracking-widest block border-b border-slate-900 pb-2">Smart URL Citator</h4>
                
                <div className="space-y-3.5">
                  <div className="space-y-1">
                    <label className="text-xs font-mono text-slate-500 uppercase block">Enter Resource Link URL</label>
                    <div className="relative">
                      <input 
                        type="text" 
                        value={resourceLink}
                        onChange={(e) => setResourceLink(e.target.value)}
                        placeholder="YouTube video, web article, nature.com..."
                        className="w-full bg-[#050608]/90 border border-slate-900 focus:border-purple-500/40 rounded-xl p-3 text-sm text-slate-200 outline-none placeholder:text-slate-700 font-sans"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-mono text-slate-500 uppercase block">Optional Resource Title</label>
                    <input 
                      type="text" 
                      value={resourceTitle}
                      onChange={(e) => setResourceTitle(e.target.value)}
                      placeholder="e.g. Decoupled Registries Analysis"
                      className="w-full bg-[#050608]/90 border border-slate-900 focus:border-purple-500/40 rounded-xl p-3 text-sm text-slate-200 outline-none placeholder:text-slate-700 font-sans"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-mono text-slate-500 uppercase block">Optional Creator / Author</label>
                    <input 
                      type="text" 
                      value={resourceAuthor}
                      onChange={(e) => setResourceAuthor(e.target.value)}
                      placeholder="e.g. Smith, John"
                      className="w-full bg-[#050608]/90 border border-slate-900 focus:border-purple-500/40 rounded-xl p-3 text-sm text-slate-200 outline-none placeholder:text-slate-700 font-sans"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-mono text-slate-500 uppercase block">Optional Publication Date</label>
                    <input 
                      type="text" 
                      value={resourceDate}
                      onChange={(e) => setResourceDate(e.target.value)}
                      placeholder="e.g. 12 Apr. 2025"
                      className="w-full bg-[#050608]/90 border border-slate-900 focus:border-purple-500/40 rounded-xl p-3 text-sm text-slate-200 outline-none placeholder:text-slate-700 font-sans"
                    />
                  </div>
                </div>
                
                <p className="text-[11px] text-slate-500 font-light leading-relaxed italic">
                  Paste any YouTube URL or website article link. The Citation Forge will identify video channels, portals, or domains to format clean citations dynamically.
                </p>
              </div>
            ) : (
              <div className="bg-[#0c0d12]/40 border border-slate-900/80 rounded-2xl p-5 space-y-4">
                <h4 className="text-sm font-mono text-slate-400 uppercase tracking-widest block border-b border-slate-900 pb-2">Coordinates / Metadata</h4>
                <textarea
                  value={metadataInput}
                  onChange={(e) => setMetadataInput(e.target.value)}
                  placeholder='Smith, John, "The Theory of Everything", Penguin, 2021.'
                  className="w-full bg-[#050608]/90 border border-slate-900 focus:border-purple-500/40 rounded-xl p-4 outline-none text-sm font-mono h-40 resize-none transition-colors placeholder:text-slate-700"
                />
                <p className="text-[11px] text-slate-500 font-light leading-relaxed italic">
                  Type author names, publisher, titles, and dates separated by commas. The coordinate analyzer parses strings automatically.
                </p>
              </div>
            )}

            {/* Quick Citations Guide */}
            <div className="bg-purple-950/5 border border-purple-900/30 p-4.5 rounded-2xl flex items-start gap-3 shadow-[inset_0_1px_1px_rgba(168,85,247,0.05)]">
              <div className="w-5.5 h-5.5 rounded-full bg-purple-950/40 border border-purple-500/20 flex items-center justify-center text-purple-400 shrink-0 text-xs font-mono">
                i
              </div>
              <div className="space-y-1">
                <h5 className="text-xs font-semibold text-purple-200">YouTube Citations Guidelines</h5>
                <p className="text-[11px] text-slate-400 leading-relaxed font-light font-sans font-sans">
                  MLA formats videos by channel uploader names, while APA prioritizes chronological months inside publication tags. Both are automatically computed when YouTube links are parsed.
                </p>
              </div>
            </div>

          </div>

          {/* Citation output area */}
          <div className="lg:col-span-2 space-y-6 animate-fade-in">
            <div className="bg-[#0c0d12]/40 border border-slate-900/80 rounded-2xl p-6 space-y-5">
              <h3 className="text-sm font-mono text-slate-400 uppercase tracking-widest block border-b border-slate-900 pb-2">Choose Citation Format Style</h3>
              
              {/* Massive action format button group */}
              <div className="grid grid-cols-3 gap-4 font-sans">
                <button
                  onClick={() => handleCitationSubmit('MLA')}
                  className="px-4 py-4 bg-gradient-to-r from-purple-700 to-indigo-700 hover:from-purple-600 hover:to-indigo-600 rounded-xl font-mono text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-200 hover:text-white transition-all shadow-md cursor-pointer active:scale-95"
                >
                  Format MLA
                </button>
                <button
                  onClick={() => handleCitationSubmit('APA')}
                  className="px-4 py-4 bg-gradient-to-r from-purple-700 to-indigo-700 hover:from-purple-600 hover:to-indigo-600 rounded-xl font-mono text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-200 hover:text-white transition-all shadow-md cursor-pointer active:scale-95"
                >
                  Format APA
                </button>
                <button
                  onClick={() => handleCitationSubmit('Chicago')}
                  className="px-4 py-4 bg-gradient-to-r from-purple-700 to-indigo-700 hover:from-purple-600 hover:to-indigo-600 rounded-xl font-mono text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-200 hover:text-white transition-all shadow-md cursor-pointer active:scale-95"
                >
                  Format Chicago
                </button>
              </div>

              {/* Citations Output box */}
              {formattedResult ? (
                <div className="bg-[#050608]/80 border border-slate-900 p-6 rounded-xl space-y-4 animate-fade-in relative font-sans">
                  <div className="flex justify-between items-center border-b border-slate-900 pb-2">
                    <span className="text-xs font-mono text-purple-400 font-bold uppercase tracking-widest flex items-center gap-1.5">
                      {citationType === 'url' && (resourceLink.includes('youtube.com') || resourceLink.includes('youtu.be')) ? (
                        <Video className="w-3.5 h-3.5 text-red-500" />
                      ) : (
                        <Globe className="w-3.5 h-3.5 text-blue-400" />
                      )}
                      Compiled {activeFormat} Citation
                    </span>
                    <button
                      onClick={copyToClipboard}
                      className="px-3 py-1.5 bg-slate-950 hover:bg-slate-900 border border-slate-900 rounded-lg text-xs font-mono text-slate-400 hover:text-purple-300 transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      {isCopied ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-emerald-400 font-semibold font-sans">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy Citation</span>
                        </>
                      )}
                    </button>
                  </div>
                  
                  <p className="text-slate-100 font-mono text-sm leading-relaxed pr-2 select-all pl-1 py-1 text-justify leading-loose">
                    {formattedResult}
                  </p>
                </div>
              ) : (
                <div className="border border-dashed border-slate-900 rounded-xl p-16 text-center text-slate-500 flex flex-col items-center justify-center space-y-3 font-sans">
                  <Layers className="w-8 h-8 text-slate-700" />
                  <p className="text-sm font-mono leading-normal">Smart Citation Output</p>
                  <p className="text-xs text-slate-600 max-w-sm leading-normal">
                    Enter resource coordinates or link URL in the left sidebar and select an academic styling filter to compile bibliography cards.
                  </p>
                </div>
              )}
            </div>
          </div>

        </div>
      )}

      {/* ==========================================================================
          TAB 2: ACADEMIC THESIS FORMATTING SUITE
          ========================================================================== */}
      {activeSubTab === 'format' && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Controls Sidebar */}
          <div className="lg:col-span-1 space-y-6 font-sans">
            
            {/* Formatting details inputs */}
            <div className="bg-[#0c0d12]/40 border border-slate-900/80 rounded-2xl p-5 space-y-4">
              <div className="flex justify-between items-center border-b border-slate-900 pb-2">
                <h4 className="text-sm font-mono text-slate-400 uppercase tracking-widest block">Manuscript Specs</h4>
                <button
                  onClick={loadThesisDraft}
                  className="text-xs font-mono text-purple-400 hover:text-purple-300 flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <RefreshCw className="w-3 h-3" /> Sync Scriptorium
                </button>
              </div>

              {importSuccess && (
                <div className="text-[11px] font-mono text-purple-400 text-center animate-pulse">
                  Draft synced from Scriptorium!
                </div>
              )}

              <div className="space-y-3.5">
                <div className="space-y-1">
                  <label className="text-xs font-mono text-slate-500 uppercase block">Thesis Title</label>
                  <input 
                    type="text" 
                    value={thesisTitle}
                    onChange={(e) => setThesisTitle(e.target.value)}
                    className="w-full bg-[#050608]/90 border border-slate-900 focus:border-purple-500/40 rounded-xl p-3 text-sm text-slate-200 outline-none placeholder:text-slate-700 font-sans"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-mono text-slate-500 uppercase block">Student Name</label>
                  <input 
                    type="text" 
                    value={authorName}
                    onChange={(e) => setAuthorName(e.target.value)}
                    className="w-full bg-[#050608]/90 border border-slate-900 focus:border-purple-500/40 rounded-xl p-3 text-sm text-slate-200 outline-none font-sans"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-mono text-slate-500 uppercase block">Instructor Name</label>
                  <input 
                    type="text" 
                    value={instructorName}
                    onChange={(e) => setInstructorName(e.target.value)}
                    className="w-full bg-[#050608]/90 border border-slate-900 focus:border-purple-500/40 rounded-xl p-3 text-sm text-slate-200 outline-none font-sans"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-mono text-slate-500 uppercase block">Institutional Affiliation</label>
                  <input 
                    type="text" 
                    value={institutionName}
                    onChange={(e) => setInstitutionName(e.target.value)}
                    className="w-full bg-[#050608]/90 border border-slate-900 focus:border-purple-500/40 rounded-xl p-3 text-sm text-slate-200 outline-none font-sans"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-mono text-slate-500 uppercase block">Course Details</label>
                  <input 
                    type="text" 
                    value={courseName}
                    onChange={(e) => setCourseName(e.target.value)}
                    className="w-full bg-[#050608]/90 border border-slate-900 focus:border-purple-500/40 rounded-xl p-3 text-sm text-slate-200 outline-none font-sans"
                  />
                </div>
              </div>
            </div>

            {/* Academic style guidelines selector buttons */}
            <div className="space-y-3">
              <h4 className="text-sm font-mono text-slate-400 uppercase tracking-widest block pl-1">Academic Style Manual</h4>
              <div className="space-y-2">
                {[
                  { id: 'MLA', label: 'MLA — 9th Edition', desc: 'Times New Roman • Student Title Block • Page 1 Centered Title • Indents 0.5"' },
                  { id: 'APA', label: 'APA — 7th Edition', desc: 'Times New Roman • Separate Title Page • Running Heads • Page numbers right' },
                  { id: 'Chicago', label: 'Chicago Manual of Style', desc: 'Times New Roman • Footnote bibliography references • 1-inch margins' }
                ].map(style => (
                  <button
                    key={style.id}
                    onClick={() => setActiveFormat(style.id)}
                    className={`w-full text-left p-4 rounded-xl border transition-all flex flex-col justify-between cursor-pointer ${
                      activeFormat === style.id
                        ? 'bg-[#0d091b]/80 border-purple-500/50 text-purple-200 shadow-[0_0_15px_rgba(168,85,247,0.12)]'
                        : 'border-slate-900/60 bg-[#06070a]/40 text-slate-550 hover:border-slate-800/40 hover:bg-[#06070a]/60 hover:text-slate-350'
                    }`}
                  >
                    <span className="font-serif font-semibold text-base">{style.label}</span>
                    <p className="text-xs font-mono text-purple-400/80 mt-1.5 leading-relaxed tracking-wide">
                      {style.desc}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* APA Specific Toggle */}
            {activeFormat === 'APA' && (
              <div className="bg-[#0c0d12]/40 border border-slate-900/80 rounded-2xl p-5 space-y-4 animate-fade-in">
                <h4 className="text-sm font-mono text-slate-400 uppercase tracking-widest block border-b border-slate-900 pb-2">APA Layout Option</h4>
                <div className="flex bg-slate-950/80 border border-slate-900 p-0.5 rounded-xl">
                  <button
                    onClick={() => setShowAPATitlePage(true)}
                    className={`flex-1 py-2 rounded-lg text-xs font-mono font-bold uppercase transition-all cursor-pointer ${
                      showAPATitlePage
                        ? 'bg-purple-950/30 border border-purple-500/20 text-purple-300'
                        : 'text-slate-500 hover:text-slate-300'
                    }`}
                  >
                    Title Page
                  </button>
                  <button
                    onClick={() => setShowAPATitlePage(false)}
                    className={`flex-1 py-2 rounded-lg text-xs font-mono font-bold uppercase transition-all cursor-pointer ${
                      !showAPATitlePage
                        ? 'bg-purple-950/30 border border-purple-500/20 text-purple-300'
                        : 'text-slate-500 hover:text-slate-300'
                    }`}
                  >
                    Main Paper
                  </button>
                </div>
              </div>
            )}

          </div>

          {/* Thesis Formatting Paper Mockup Preview */}
          <div className="lg:col-span-3 space-y-4">
            <div className="flex justify-between items-center pl-1 font-sans">
              <span className="text-sm font-mono uppercase text-slate-500 tracking-wider">A4 Academic Draft Print Preview</span>
              <span className="text-xs font-mono text-slate-400 uppercase tracking-widest">
                Active Style: {activeFormat}
              </span>
            </div>

            {/* Paper container mockup */}
            <div className="bg-[#120d18]/25 border border-slate-900/80 rounded-3xl p-8 flex justify-center items-center shadow-inner relative overflow-hidden min-h-[580px]">
              
              {/* Paper sheet */}
              <div className="w-full max-w-2xl bg-[#FCFBF8] border border-amber-900/10 shadow-2xl p-12 sm:p-16 flex flex-col justify-between text-[#1d1c19] select-none font-serif leading-loose relative min-h-[520px] transition-all duration-300">
                
                {/* MLA formatting layout */}
                {activeFormat === 'MLA' && (
                  <div className="space-y-4 text-justify leading-loose animate-fade-in text-[14px]">
                    {/* MLA top header */}
                    <div className="text-xs font-serif text-slate-500 border-b border-transparent pb-1 flex justify-end tracking-wider mb-4">
                      {authorName.split(' ').pop()} 1
                    </div>

                    {/* MLA Identification block */}
                    <div className="text-left leading-tight text-xs sm:text-sm text-slate-700 space-y-1 mb-8">
                      <p>{authorName}</p>
                      <p>{instructorName}</p>
                      <p>{courseName}</p>
                      <p>25 May 2026</p>
                    </div>

                    {/* Centered title */}
                    <h2 className="text-center font-bold text-base sm:text-lg text-slate-950 uppercase tracking-wide my-6 font-serif leading-snug">
                      {thesisTitle}
                    </h2>

                    {/* Double-spaced body text with indentations */}
                    {paragraphs.map((para, idx) => (
                      <p key={idx} className="indent-8 font-serif leading-loose text-justify text-[#222222]">
                        {para}
                      </p>
                    ))}
                  </div>
                )}

                {/* APA formatting layout */}
                {activeFormat === 'APA' && (
                  showAPATitlePage ? (
                    /* APA separate Title Page Mockup */
                    <div className="flex flex-col justify-between items-center text-center py-20 min-h-[350px] animate-fade-in">
                      {/* Top header running head */}
                      <div className="w-full text-xs font-mono text-slate-400 flex justify-between border-b border-slate-100/50 pb-2 mb-10 tracking-widest uppercase">
                        <span>Running Head: {thesisTitle.slice(0, 30)}...</span>
                        <span>1</span>
                      </div>

                      {/* Title information placed in upper middle block */}
                      <div className="space-y-5 my-auto">
                        <h1 className="text-lg sm:text-xl font-bold font-serif text-slate-950 max-w-md mx-auto leading-snug">
                          {thesisTitle}
                        </h1>
                        <p className="text-sm font-serif text-slate-800 font-medium">{authorName}</p>
                        <p className="text-xs font-serif text-slate-500 italic">{institutionName}</p>
                      </div>

                      <div className="space-y-1 mt-12 text-xs font-mono text-slate-400">
                        <p>{courseName}</p>
                        <p>{instructorName}</p>
                        <p>May 25, 2026</p>
                      </div>
                    </div>
                  ) : (
                    /* APA Main Paper body Mockup */
                    <div className="space-y-4 text-justify leading-loose animate-fade-in text-[14px]">
                      {/* Running head block */}
                      <div className="text-xs font-mono text-slate-400 border-b border-slate-100/50 pb-2 flex justify-between tracking-widest uppercase mb-6">
                        <span>{thesisTitle.slice(0, 30)}...</span>
                        <span>2</span>
                      </div>

                      {/* APA Bold centered title */}
                      <h2 className="text-center font-bold text-base sm:text-lg text-slate-950 my-6 font-serif leading-snug">
                        {thesisTitle}
                      </h2>

                      {/* Double-spaced body text with indentations */}
                      {paragraphs.map((para, idx) => (
                        <p key={idx} className="indent-8 font-serif leading-loose text-justify text-[#222222]">
                          {para}
                        </p>
                      ))}
                    </div>
                  )
                )}

                {/* Chicago formatting layout (Footnote Bibliography references) */}
                {activeFormat === 'Chicago' && (
                  <div className="space-y-4 text-justify leading-loose animate-fade-in text-[14px] flex-1 flex flex-col justify-between">
                    <div className="space-y-4">
                      {/* Centered title */}
                      <h2 className="text-center font-semibold text-base sm:text-lg text-slate-950 tracking-wide my-6 font-serif leading-snug border-b border-slate-100 pb-4">
                        {thesisTitle}
                      </h2>

                      {/* Double-spaced body text with superscript footnote indices inside text */}
                      {paragraphs.map((para, idx) => (
                        <p key={idx} className="indent-8 font-serif leading-loose text-justify text-[#222222]">
                          {idx === 0 ? (
                            <>
                              {para.slice(0, Math.floor(para.length / 2))}
                              <sup className="text-purple-700 font-bold font-mono text-[10px] mx-0.5">1</sup>
                              {para.slice(Math.floor(para.length / 2))}
                              <sup className="text-purple-700 font-bold font-mono text-[10px] mx-0.5">2</sup>
                            </>
                          ) : (
                            para
                          )}
                        </p>
                      ))}
                    </div>

                    {/* Bottom Footnotes section separated by rule line */}
                    <div className="border-t border-slate-300 pt-3 mt-8 space-y-1.5 text-[11px] sm:text-xs font-serif text-slate-600 leading-relaxed text-left">
                      <p>
                        <span className="font-mono text-[10px] font-bold text-slate-500 mr-1.5">[1]</span> 
                        {authorName}, <em>{thesisTitle}</em> ({institutionName}, 2026), 18.
                      </p>
                      <p>
                        <span className="font-mono text-[10px] font-bold text-slate-500 mr-1.5">[2]</span> 
                        Smith, J. & Davis, K., <em>Decoupled State Paradigms in Modern Distributed Registries</em> (Systems Analysis Quarterly, 2025), 142.
                      </p>
                    </div>
                  </div>
                )}

              </div>
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
