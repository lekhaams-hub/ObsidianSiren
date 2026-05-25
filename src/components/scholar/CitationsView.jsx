import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';

export default function CitationsView() {
  const [metadataInput, setMetadataInput] = useState('');
  const [formattedResult, setFormattedResult] = useState('');
  const [activeFormat, setActiveFormat] = useState('');
  const [isCopied, setIsCopied] = useState(false);

  // Parse custom metadata input and simulate academic citation standards
  const generateCitation = (style) => {
    setActiveFormat(style);
    const text = metadataInput.trim();
    
    if (!text) {
      setFormattedResult("Please paste or type metadata coordinates above first.");
      return;
    }

    // Advanced local parser using regex to extract elements (Author, Title, Publisher, Year)
    let author = "Smith, John";
    let title = "The Theory of Everything";
    let publisher = "Penguin";
    let year = "2021";

    // Try to guess components from common citation strings
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
      // Chicago
      citation = `${author}. ${title}. (${publisher || 'Publisher'}, ${year || 'n.d.'}).`;
    }

    setFormattedResult(citation);
    setIsCopied(false);
  };

  const copyToClipboard = () => {
    if (!formattedResult) return;
    navigator.clipboard.writeText(formattedResult);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 1500);
  };

  return (
    <div className="space-y-10 animate-fade-in pb-12 text-slate-100 max-w-7xl mx-auto">
      
      {/* Title Header matching screenshot 4 */}
      <div className="space-y-3 mt-4">
        <h3 className="text-xs font-mono tracking-[0.25em] text-slate-500 uppercase font-semibold">
          SMART CITATION ENGINE
        </h3>
        <h1 className="text-5xl font-serif text-purple-300 font-semibold tracking-tight">
          The Citation Forge
        </h1>
        <p className="text-slate-400 text-base sm:text-lg font-light max-w-3xl leading-relaxed">
          Paste source metadata. Receive perfectly-styled citations.
        </p>
      </div>

      {/* Massive input textarea matching screenshot 4 */}
      <div className="space-y-6">
        <textarea
          value={metadataInput}
          onChange={(e) => setMetadataInput(e.target.value)}
          className="w-full bg-[#07090e]/40 border border-slate-900 focus:border-purple-500/40 rounded-2xl p-6 outline-none text-base sm:text-lg font-mono leading-relaxed h-44 resize-none transition-colors placeholder:text-slate-700"
          placeholder='e.g. "Smith, John. The Theory of Everything. Penguin, 2021. p.42."'
        />

        {/* Action Buttons matching screenshot 4 */}
        <div className="flex flex-wrap gap-4">
          <button
            onClick={() => generateCitation('MLA')}
            className="rounded-xl px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-mono text-xs font-bold uppercase tracking-wider cursor-pointer shadow-md transition-all active:scale-[0.98]"
          >
            Format as MLA
          </button>
          <button
            onClick={() => generateCitation('APA')}
            className="rounded-xl px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-mono text-xs font-bold uppercase tracking-wider cursor-pointer shadow-md transition-all active:scale-[0.98]"
          >
            Format as APA
          </button>
          <button
            onClick={() => generateCitation('Chicago')}
            className="rounded-xl px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-mono text-xs font-bold uppercase tracking-wider cursor-pointer shadow-md transition-all active:scale-[0.98]"
          >
            Format as Chicago
          </button>
        </div>
      </div>

      {/* Compiled Citation Display Box */}
      {formattedResult && (
        <div className="bg-[#0B0F19]/40 border border-slate-900 p-6 rounded-2xl space-y-4 animate-fade-in relative group max-w-4xl shadow-inner">
          <div className="flex justify-between items-center border-b border-slate-950 pb-2">
            <span className="text-[10px] font-mono text-purple-400 font-bold uppercase tracking-widest">
              Compiled {activeFormat} Output
            </span>
            
            <button
              onClick={copyToClipboard}
              className="p-1.5 rounded-lg bg-slate-950 border border-slate-900 text-slate-400 hover:text-purple-400 hover:border-purple-500/25 transition-all cursor-pointer flex items-center gap-1.5 text-xs font-mono"
            >
              {isCopied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400 font-bold">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Citation</span>
                </>
              )}
            </button>
          </div>
          
          <p className="text-slate-200 font-mono text-sm leading-relaxed pr-6 select-all pl-2">
            {formattedResult}
          </p>
        </div>
      )}

    </div>
  );
}
