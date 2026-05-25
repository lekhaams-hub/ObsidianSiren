import React, { useState, useRef } from 'react';
import { Upload, Search, FileText, Trash2, Edit2, Eye, X, BookOpen, Calendar, HardDrive, Check } from 'lucide-react';

export default function InquiryVault({ documents = [], setDocuments }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [viewingDoc, setViewingDoc] = useState(null);
  const [renamingDocId, setRenamingDocId] = useState(null);
  const [newName, setNewName] = useState('');
  
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      Array.from(e.dataTransfer.files).forEach(file => {
        addMockFile(file);
      });
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files) {
      Array.from(e.target.files).forEach(file => {
        addMockFile(file);
      });
    }
  };

  const addMockFile = (file) => {
    const ext = file.name.split('.').pop().toLowerCase();
    if (!['pdf', 'doc', 'docx', 'txt'].includes(ext)) return;

    const title = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
    const sizeStr = (file.size / (1024 * 1024)).toFixed(2) + ' MB';
    
    let profile = {
      abstract: "This research paper explores the systemic frameworks and behavioral matrices under modern computational conditions. Through empirical validation and quantitative modeling, we examine the integration pathways and identify architectural thresholds.",
      methodology: "We utilized double-blind random trial evaluations across three distinct simulation settings. Analytical matrices were logged at 25ms intervals and computed using a localized gradient descent modeling setup.",
      findings: "Initial evaluations show a 14.8% increase in system compliance and structural balance when utilizing decoupled state components. Latency variances were successfully mitigated under extreme parameters.",
      arguments: "Decoupled states offer superior resilience compared to monolithic state trees. Furthermore, academic formatting schemas significantly improve human readability indexes across distributed research teams.",
      author: "Artisan, A.",
      publication: "Journal of Advanced Systems Analysis"
    };

    if (title.toLowerCase().includes('neural') || title.toLowerCase().includes('ai') || title.toLowerCase().includes('comput')) {
      profile = {
        abstract: "An exploration into specialized neural layouts and multi-agent consensus networks. This study reviews cognitive latency under massive parametric processing and proposes a dynamic model for optimized distributed weights.",
        methodology: "Constructed on a PyTorch framework, agents were deployed in a simulated high-concurrency partition. Latency profiles were processed through an active attention-weighted pipeline across 10,000 iterations.",
        findings: "Parametric optimization reduced training bounds by 22% while securing a baseline 94.6% classification accuracy across complex visual sets.",
        arguments: "Distributed attention models mitigate cognitive bottlenecks. Our dynamic architecture achieves competitive scales without massive server clusters.",
        author: "Tech, R. & Code, M.",
        publication: "IEEE Transactions on Neural Architectures"
      };
    } else if (title.toLowerCase().includes('bio') || title.toLowerCase().includes('cell') || title.toLowerCase().includes('health')) {
      profile = {
        abstract: "This paper catalogs biochemical transcription pathways under simulated zero-gravity factors. We document cellular expansion rates and analyze protein synthesis dynamics within organic matrices.",
        methodology: "Cultures were suspended in an active bioreactor with microfluidic monitoring grids. Fluorescent markers mapped cell migrations over a continuous 168-hour timeline.",
        findings: "Cell division speed accelerated by 31% under micro-gravitational fields, accompanied by a major transcription adaptation in gene-cluster markers.",
        arguments: "Micro-gravitational environments trigger cellular stress responses that simulate rapid organic evolution, representing significant implications for long-term orbital survival.",
        author: "Bio, S. & Gene, H.",
        publication: "Nature Biotechnology Horizons"
      };
    }

    const newDoc = {
      id: Date.now() + Math.random().toString(36).substr(2, 9),
      name: file.name,
      title: title,
      author: profile.author,
      year: new Date().getFullYear().toString(),
      publication: profile.publication,
      size: sizeStr,
      uploadDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      type: ext.toUpperCase() === 'PDF' ? 'PDF' : 'Document',
      abstract: profile.abstract,
      methodology: profile.methodology,
      findings: profile.findings,
      arguments: profile.arguments
    };

    setDocuments(prev => [...prev, newDoc]);
  };

  const removeDoc = (id) => {
    setDocuments(prev => prev.filter(d => d.id !== id));
  };

  const startRename = (doc) => {
    setRenamingDocId(doc.id);
    setNewName(doc.title);
  };

  const saveRename = (id) => {
    setDocuments(prev => prev.map(d => {
      if (d.id === id) {
        return { 
          ...d, 
          title: newName,
          name: newName + '.' + d.name.split('.').pop()
        };
      }
      return d;
    }));
    setRenamingDocId(null);
  };

  const filteredDocs = documents.filter(doc => 
    doc.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    doc.author.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-10 animate-fade-in max-w-7xl mx-auto pb-12 text-slate-100">
      
      {/* Title Header */}
      <div className="space-y-3 mt-4">
        <h3 className="text-xs font-mono tracking-[0.25em] text-slate-500 uppercase font-semibold">
          RESEARCH VAULT
        </h3>
        <h1 className="text-5xl font-serif text-purple-300 font-semibold tracking-tight">
          The Source Vault
        </h1>
        <p className="text-slate-400 text-base sm:text-lg font-light max-w-3xl leading-relaxed">
          Private storage for research PDFs. Drop them in; the Research Assistant will use them.
        </p>
      </div>

      {/* Upload Zone matching screenshot 2 */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`w-full border-2 border-dashed rounded-3xl p-12 text-center cursor-pointer transition-all duration-300 select-none flex flex-col items-center justify-center gap-4 bg-[#0B0F19]/20 min-h-[220px] ${
          isDragging
            ? 'border-purple-500 bg-purple-950/10'
            : 'border-slate-800/80 hover:border-purple-500/40 hover:bg-[#0d0b17]/10'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept=".pdf,.doc,.docx,.txt"
          onChange={handleFileChange}
          className="hidden"
        />
        <div className="text-purple-400">
          <Upload className="w-9 h-9" />
        </div>
        <div className="space-y-1">
          <p className="text-slate-200 font-medium text-lg tracking-wide">
            Drop a research PDF here
          </p>
          <p className="text-slate-500 text-xs font-mono tracking-widest font-bold uppercase mt-1">
            OR CLICK TO BROWSE
          </p>
        </div>
      </div>

      {/* Document Library Section */}
      <div className="space-y-6">
        
        {/* Search library */}
        {documents.length > 0 && (
          <div className="relative max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-500" />
            <input
              type="text"
              placeholder="Search reference papers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-950 border border-slate-900 pl-11 pr-4 py-2.5 rounded-xl text-sm text-slate-200 outline-none focus:border-purple-500/35 transition-colors placeholder:text-slate-650"
            />
          </div>
        )}

        {filteredDocs.length === 0 ? (
          <div className="text-center py-10 text-slate-500 font-serif text-base font-light">
            No sources yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredDocs.map((doc) => (
              <div
                key={doc.id}
                className="bg-[#0B0F19]/40 border border-slate-900 p-6 rounded-2xl flex flex-col justify-between gap-4 transition-all hover:border-purple-500/20 hover:bg-slate-900/10 shadow-sm relative group"
              >
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 shadow-md bg-purple-950/30 border border-purple-500/25 text-purple-400">
                    <FileText className="w-5.5 h-5.5" />
                  </div>
                  
                  <div className="space-y-1.5 flex-1 min-w-0 pr-6">
                    {renamingDocId === doc.id ? (
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <input
                          type="text"
                          value={newName}
                          onChange={(e) => setNewName(e.target.value)}
                          className="bg-slate-950 text-slate-200 border border-purple-500/40 rounded px-2.5 py-1 text-sm font-medium w-full focus:outline-none"
                          autoFocus
                        />
                        <button 
                          onClick={() => saveRename(doc.id)}
                          className="p-1 rounded bg-purple-950/50 border border-purple-500/20 text-purple-400 hover:bg-purple-900/40 cursor-pointer"
                        >
                          <Check className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <h4 className="font-serif font-semibold text-lg text-slate-100 truncate mt-0.5">
                        {doc.title}
                      </h4>
                    )}
                    <p className="text-xs font-mono text-slate-400 truncate">
                      {doc.author} ({doc.year}) · {doc.publication}
                    </p>
                  </div>
                </div>

                <div className="flex justify-between items-center border-t border-slate-950 pt-3.5">
                  <div className="flex gap-4 text-xs font-mono text-slate-500">
                    <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5 text-purple-500/50" /> {doc.uploadDate}</span>
                    <span>{doc.size}</span>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => startRename(doc)}
                      className="p-2 rounded-lg bg-slate-950 border border-slate-900 text-slate-400 hover:text-purple-400 hover:border-purple-500/25 transition-all cursor-pointer"
                      title="Rename metadata"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setViewingDoc(doc)}
                      className="p-2 rounded-lg bg-slate-950 border border-slate-900 text-slate-400 hover:text-purple-400 hover:border-purple-500/25 transition-all cursor-pointer"
                      title="View Document"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => removeDoc(doc.id)}
                      className="p-2 rounded-lg bg-slate-950 border border-slate-900 text-slate-400 hover:text-red-400 hover:border-red-500/25 transition-all cursor-pointer"
                      title="Remove source"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Simulated Document Viewer Modal */}
      {viewingDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 animate-fade-in">
          <div className="relative w-full max-w-4xl bg-[#090b11] border border-slate-800 rounded-3xl shadow-2xl flex flex-col max-h-[85vh]">
            <div className="p-6 sm:p-7 border-b border-slate-900 flex justify-between items-start gap-4">
              <div className="space-y-2">
                <span className="text-xs font-mono uppercase tracking-widest text-purple-400 font-bold px-2.5 py-1 bg-purple-950/40 border border-purple-500/20 rounded">
                  {viewingDoc.type} DOCUMENT METRICS
                </span>
                <h2 className="font-serif font-bold text-2xl sm:text-3xl text-white mt-1 pr-6 leading-snug">
                  {viewingDoc.title}
                </h2>
                <p className="text-slate-400 text-sm font-mono leading-none">
                  {viewingDoc.author} ({viewingDoc.year}) · {viewingDoc.publication}
                </p>
              </div>
              <button
                onClick={() => setViewingDoc(null)}
                className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5.5 h-5.5" />
              </button>
            </div>

            <div className="p-8 overflow-y-auto space-y-7 text-slate-300 font-serif text-base sm:text-lg leading-relaxed max-h-[calc(85vh-170px)]">
              <div className="space-y-2 border-l-2 border-purple-500/40 pl-4 py-2 bg-[#0B0F19]/20 rounded-r-lg">
                <span className="font-mono text-xs font-bold uppercase tracking-wider text-purple-400 block">Abstract Outline</span>
                <p className="italic text-slate-350">{viewingDoc.abstract}</p>
              </div>
              <div className="space-y-3">
                <h4 className="font-serif font-bold text-xl text-slate-100">1. Methodology & Data Modeling</h4>
                <p className="font-light text-slate-400 text-base sm:text-lg">{viewingDoc.methodology}</p>
              </div>
              <div className="space-y-3">
                <h4 className="font-serif font-bold text-xl text-slate-100">2. Empirical Findings</h4>
                <p className="font-light text-slate-400 text-base sm:text-lg">{viewingDoc.findings}</p>
              </div>
              <div className="space-y-3">
                <h4 className="font-serif font-bold text-xl text-slate-100">3. Critical Discussion & Framework Arguments</h4>
                <p className="font-light text-slate-400 text-base sm:text-lg">{viewingDoc.arguments}</p>
              </div>
            </div>

            <div className="p-5 border-t border-slate-900 text-right bg-slate-950/20 rounded-b-3xl">
              <button
                onClick={() => setViewingDoc(null)}
                className="px-6 py-3 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono text-slate-400 hover:text-white cursor-pointer"
              >
                Close Sheet
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
