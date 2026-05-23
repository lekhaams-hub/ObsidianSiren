import React, { useState } from 'react';
import { GraduationCap, FileText, Database, ShieldAlert, ArrowLeft, CheckCircle, Plus, Trash2, LayoutGrid } from 'lucide-react';

export default function Sanctum({ onBack }) {
  const [citationStyle, setCitationStyle] = useState('APA 7th');
  
  // Clean Academic Structural Master Blueprints
  const paperTemplates = {
    imrad: [
      { section: '1. Abstract & Introduction', prompt: '[Write an overview of your research question, background hypothesis, and the significance of this structural thesis...]' },
      { section: '2. Methods & Materials', prompt: '[Outline your collection parameters, computational tools, and analytical conditions explicitly here...]' },
      { section: '3. Results & Empirical Analysis', prompt: '[Present your raw data tables, factual outputs, and statistically significant findings devoid of speculative interpretation...]' },
      { section: '4. Discussion & Comprehensive Conclusion', prompt: '[Synthesize how your data answers the initial thesis question, disclose any source limitations, and propose vectors for future study...]' }
    ],
    literatureReview: [
      { section: '1. Thematic Synthesis A', prompt: '[Compare contemporary literature regarding historical consensus on your target subject...]' },
      { section: '2. Identification of Research Gap', prompt: '[Highlight systemic conflicts or missing datasets across established research fields...]' }
    ]
  };

  const [activeTemplate, setActiveTemplate] = useState('imrad');
  const [activeSectionIdx, setActiveSectionIdx] = useState(0);
  const [currentSections, setCurrentSections] = useState(paperTemplates.imrad);

  // Clean Generic Bibliography Sources State
  const [sources, setSources] = useState([
    { id: 1, type: 'Journal Article', title: 'A Comprehensive Analysis of Algorithmic Processing Layouts', author: 'Smith, J.', year: '2025', publication: 'Computer Science Systems Quarterly' },
    { id: 2, type: 'Book', title: 'Methodologies in Academic Matrix Formats', author: 'Davis, L.', year: '2023', publication: 'University Press' }
  ]);

  const [author, setAuthor] = useState('');
  const [title, setTitle] = useState('');
  const [year, setYear] = useState('');
  const [pub, setPub] = useState('');
  const [type, setType] = useState('Journal Article');

  const handleTemplateChange = (typeKey) => {
    setActiveTemplate(typeKey);
    setCurrentSections(paperTemplates[typeKey]);
    setActiveSectionIdx(0);
  };

  const addSource = (e) => {
    e.preventDefault();
    if (!author || !title) return;
    setSources([...sources, { id: Date.now(), type, title, author, year, publication: pub }]);
    setAuthor('');
    setTitle('');
    setYear('');
    setPub('');
  };

  const renderFormat = (src) => {
    if (citationStyle === 'MLA 9th') return `${src.author}. "${src.title}." ${src.publication || 'N.p.'}, ${src.year || 'n.d.'}.`;
    if (citationStyle === 'Chicago Manual') return `${src.author}. ${src.title}. (${src.publication || 'Publisher'}, ${src.year || 'n.d.'}).`;
    return `${src.author} (${src.year || 'n.d.'}). ${src.title}. ${src.publication || ''}.`;
  };

  return (
    <div className="min-h-screen bg-[#0B0F19] text-slate-100 p-6 font-sans">
      {/* Header */}
      <div className="max-w-7xl mx-auto flex justify-between items-center mb-8 border-b border-slate-800 pb-4">
        <button onClick={onBack} className="flex items-center gap-2 text-sm text-emerald-400 hover:text-emerald-300 transition-colors cursor-pointer">
          <ArrowLeft className="w-4 h-4" /> Back to Paths
        </button>
        <div className="flex items-center gap-2">
          <GraduationCap className="w-5 h-5 text-emerald-400" />
          <span className="font-serif font-medium text-lg">The Scholar's Sanctum</span>
        </div>
        <div className="text-xs font-mono text-slate-500">Academic Structure Vault</div>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Citation Database Framework */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 flex flex-col justify-between h-[calc(100vh-160px)] overflow-y-auto">
          <div className="space-y-4">
            <h3 className="text-xs font-mono tracking-wider text-emerald-400 uppercase flex items-center gap-2 border-b border-slate-800/60 pb-2">
              <Database className="w-3.5 h-3.5" /> Source Citation Database ({sources.length})
            </h3>
            
            <div className="space-y-3 max-h-48 overflow-y-auto pr-1">
              {sources.map(src => (
                <div key={src.id} className="p-2.5 bg-slate-950/60 border border-slate-800 rounded-lg text-[11px] space-y-1 relative group">
                  <button onClick={() => setSources(sources.filter(s => s.id !== src.id))} className="absolute top-2 right-2 text-slate-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                  <span className="font-mono text-[9px] text-emerald-500 font-semibold uppercase">{src.type}</span>
                  <p className="text-slate-200 font-serif pr-4 leading-tight">{src.title}</p>
                  <p className="text-slate-500 font-mono text-[10px]">{src.author} ({src.year})</p>
                </div>
              ))}
            </div>

            {/* Input Loggers */}
            <form onSubmit={addSource} className="space-y-2 border-t border-slate-800/60 pt-3">
              <div className="grid grid-cols-2 gap-2">
                <select value={type} onChange={e => setType(e.target.value)} className="text-[11px] bg-slate-950 border border-slate-800 rounded p-1 text-slate-300 focus:outline-none">
                  <option>Journal Article</option>
                  <option>Book</option>
                  <option>Web Source</option>
                </select>
                <input type="text" placeholder="Year..." value={year} onChange={e => setYear(e.target.value)} className="bg-slate-950 text-[11px] border border-slate-800 p-1 rounded focus:outline-none text-slate-200" />
              </div>
              <input type="text" placeholder="Author Meta String..." value={author} onChange={e => setAuthor(e.target.value)} className="w-full bg-slate-950 text-[11px] border border-slate-800 p-1.5 rounded focus:outline-none text-slate-200" />
              <input type="text" placeholder="Source / Node Title..." value={title} onChange={e => setTitle(e.target.value)} className="w-full bg-slate-950 text-[11px] border border-slate-800 p-1.5 rounded focus:outline-none text-slate-200" />
              <input type="text" placeholder="Publisher / Venue..." value={pub} onChange={e => setPub(e.target.value)} className="w-full bg-slate-950 text-[11px] border border-slate-800 p-1.5 rounded focus:outline-none text-slate-200" />
              <button type="submit" className="w-full py-1.5 bg-emerald-600 hover:bg-emerald-500 text-[11px] font-medium rounded text-white flex items-center justify-center gap-1 cursor-pointer"><Plus className="w-3.5 h-3.5" /> Log Bibliography Data</button>
            </form>
          </div>
        </div>

        {/* Center & Right Column: Interactive Formatting Transformer */}
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-6 h-[calc(100vh-160px)]">
          
          {/* Central Writing Draft Engine */}
          <div className="md:col-span-2 bg-slate-900/40 border border-slate-800 rounded-xl p-5 flex flex-col">
            <div className="mb-3 flex items-center justify-between">
              <label className="text-[10px] font-mono uppercase text-slate-500 flex items-center gap-1">
                <LayoutGrid className="w-3 h-3 text-emerald-500" /> Framework Matrix
              </label>
              <select 
                onChange={(e) => handleTemplateChange(e.target.value)}
                className="text-[11px] bg-slate-950 border border-slate-800 text-slate-300 rounded p-1 focus:outline-none"
              >
                <option value="imrad">Scientific Thesis (IMRaD)</option>
                <option value="literatureReview">Humanities Literature Review</option>
              </select>
            </div>
            
            <div className="flex gap-1.5 mb-3 overflow-x-auto pb-1">
              {currentSections.map((sec, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveSectionIdx(idx)}
                  className={`text-[10px] font-mono px-2.5 py-1 rounded whitespace-nowrap transition-all ${activeSectionIdx === idx ? 'bg-emerald-950/50 border border-emerald-500/40 text-emerald-300' : 'bg-slate-950 border border-slate-800 text-slate-500'}`}
                >
                  Sec {idx + 1}
                </button>
              ))}
            </div>

            <div className="bg-slate-950/40 border border-slate-800/80 p-2 text-[11px] text-slate-400 font-mono mb-2 rounded">
              <span className="text-emerald-500 font-bold">Active Structure Layer:</span> {currentSections[activeSectionIdx]?.section}
            </div>

            <textarea 
              className="w-full flex-1 bg-transparent text-slate-300 resize-none focus:outline-none font-serif text-sm leading-relaxed"
              placeholder="Structural drafting prompt..."
              value={currentSections[activeSectionIdx]?.prompt || ''}
              onChange={(e) => {
                const updated = [...currentSections];
                updated[activeSectionIdx].prompt = e.target.value;
                setCurrentSections(updated);
              }}
            />
            
            <div className="border-t border-slate-800 pt-2 mt-2 text-xs text-slate-500 font-mono flex items-center gap-2">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-500" /> Structured Schema Engine Active
            </div>
          </div>

          {/* Right Layout Style Output Engine */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 flex flex-col justify-between overflow-y-auto">
            <div className="space-y-4">
              <h4 className="text-xs font-mono tracking-wider text-slate-400 uppercase flex items-center gap-2 border-b border-slate-800 pb-2">
                <FileText className="w-3.5 h-3.5 text-emerald-400" /> Transformation Engine
              </h4>
              
              <div>
                <label className="text-[10px] font-mono text-slate-500 block mb-1">Target End-Style</label>
                <select 
                  value={citationStyle}
                  onChange={(e) => setCitationStyle(e.target.value)}
                  className="w-full text-xs bg-slate-950 border border-slate-800 text-slate-300 rounded p-1.5 focus:outline-none cursor-pointer"
                >
                  <option value="APA 7th">APA 7th Edition</option>
                  <option value="MLA 9th">MLA 9th Edition</option>
                  <option value="Chicago Manual">Chicago Manual</option>
                </select>
              </div>

              <div className="space-y-2">
                <span className="font-mono text-[9px] block text-slate-500 tracking-wider uppercase">Live Bibliography Compiles:</span>
                <div className="p-2 bg-slate-950/40 rounded border border-slate-800/60 text-[10px] text-slate-400 space-y-3 max-h-48 overflow-y-auto font-mono">
                  {sources.map(src => (
                    <p key={src.id} className="pl-2 -indent-2 border-b border-slate-900 pb-1 last:border-none">
                      {renderFormat(src)}
                    </p>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-2 rounded bg-emerald-950/10 border border-emerald-900/40 text-[10px] text-emerald-400/80 flex items-start gap-1.5 font-mono mt-4">
              <ShieldAlert className="w-3.5 h-3.5 shrink-0 mt-0.5" />
              <span>Safe-box metadata compiling sequence verified.</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}