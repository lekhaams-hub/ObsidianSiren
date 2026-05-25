import React, { useState, useRef } from 'react';
import { Eye, BookOpen, Compass, Upload, Sparkles, CheckCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const SERVICES = [
  {
    id: 'proof',
    name: 'Proofreading & Editing',
    desc: 'Focused on clarity, flow, and grammar.',
    rateUSD: 0.005,
    rateINR: 0.1,
    type: 'per-word',
    icon: Eye,
  },
  {
    id: 'dev',
    name: 'Rewriting & Sentence Structure Changes',
    desc: 'Deep-dive expert advice on clarity and syntactic improvements.',
    rateUSD: 0.01,
    rateINR: 0.2,
    type: 'per-word',
    icon: BookOpen,
  },
  {
    id: 'publish',
    name: 'Publishing Consultation',
    desc: '1-on-1 session to navigate the industry.',
    rateUSD: 50,
    rateINR: 1000,
    type: 'flat',
    icon: Compass,
  }
];

export default function ExpertConsultationView({ currency = 'USD' }) {
  const { user, setIsAuthModalOpen } = useAuth();
  
  // Interactive state
  const [selectedService, setSelectedService] = useState('proof');
  const [wordCount, setWordCount] = useState('50000');
  const [notes, setNotes] = useState('');
  const [fileName, setFileName] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [bookingStatus, setBookingStatus] = useState(''); // '', 'sending', 'success'
  
  const fileInputRef = useRef(null);

  // Sync state between card selection and calculator
  const activeService = SERVICES.find(s => s.id === selectedService) || SERVICES[0];

  // Drag and drop event handlers
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
      const file = e.dataTransfer.files[0];
      const ext = file.name.split('.').pop().toLowerCase();
      if (['doc', 'docx', 'pdf'].includes(ext)) {
        setFileName(file.name);
      }
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFileName(e.target.files[0].name);
    }
  };

  // Submit booking
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!user) {
      setIsAuthModalOpen(true);
      return;
    }
    setBookingStatus('sending');
    setTimeout(() => {
      setBookingStatus('success');
    }, 1200);
  };

  // Compute reactive price estimations
  const calculateTotal = () => {
    if (activeService.type === 'flat') {
      return activeService[currency === 'USD' ? 'rateUSD' : 'rateINR'];
    }
    const count = parseInt(wordCount) || 0;
    const rate = activeService[currency === 'USD' ? 'rateUSD' : 'rateINR'];
    return count * rate;
  };

  const formatCurrency = (val) => {
    return new Intl.NumberFormat(currency === 'USD' ? 'en-US' : 'en-IN', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(val);
  };

  return (
    <div className="space-y-10 animate-fade-in pb-12 text-slate-100 max-w-7xl mx-auto">
      
      {/* Top 3-Column Services Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {SERVICES.map((srv) => {
          const IconComponent = srv.icon;
          const isActive = selectedService === srv.id;
          
          return (
            <div
              key={srv.id}
              onClick={() => setSelectedService(srv.id)}
              className={`relative overflow-hidden group rounded-3xl p-7 transition-all duration-300 cursor-pointer select-none border ${
                isActive
                  ? 'border-purple-500/40 bg-[#0d0b17]/60 shadow-[4px_4px_25px_rgba(168,85,247,0.22),_0_0_8px_rgba(168,85,247,0.12)]'
                  : 'border-slate-900 bg-[#0B0F19]/40 hover:border-slate-800 hover:bg-[#0E1321]/50 shadow-[2px_2px_12px_rgba(0,0,0,0.3)]'
              }`}
            >
              {/* Subtle bottom-right inner gradient light spill */}
              {isActive && (
                <div className="absolute -bottom-8 -right-8 w-24 h-24 bg-purple-500/10 blur-xl rounded-full pointer-events-none" />
              )}
              
              {/* Service Icon inside purple container */}
              <div className="w-11 h-11 rounded-xl bg-purple-950/40 border border-purple-500/20 flex items-center justify-center text-purple-400 shadow-md">
                <IconComponent className="w-5.5 h-5.5" />
              </div>

              {/* Title & Description */}
              <h3 className="font-serif font-semibold text-xl text-slate-100 mt-5 leading-snug">
                {srv.name}
              </h3>
              
              <p className="text-slate-400 font-light text-base leading-relaxed mt-2.5">
                {srv.desc}
              </p>

              {/* Rate Line */}
              <span className="text-base font-mono text-purple-300 font-medium mt-4 block">
                {srv.type === 'flat' 
                  ? currency === 'USD'
                    ? `$${srv.rateUSD} flat`
                    : `₹${srv.rateINR.toLocaleString()} flat`
                  : currency === 'USD'
                    ? `$${srv.rateUSD} per word`
                    : `₹${srv.rateINR} per word`
                }
              </span>
            </div>
          );
        })}
      </div>

      {/* Dynamic Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Left Column: Price Calculator */}
        <div className="flex flex-col justify-between h-full bg-[#0B0F19]/25 border border-slate-900/60 p-8 rounded-3xl">
          <div>
            <h2 className="font-serif font-semibold text-3xl text-white">Price Calculator</h2>
            <p className="text-slate-400 font-light text-base mt-1.5">
              Estimates update as you type.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-8">
              
              {/* Service Dropdown */}
              <div className="space-y-2">
                <label className="text-xs font-mono font-bold tracking-widest text-slate-500 uppercase block">
                  Service
                </label>
                <select
                  value={selectedService}
                  onChange={(e) => setSelectedService(e.target.value)}
                  className="w-full bg-[#07090e]/60 border border-slate-900 focus:border-purple-500/40 rounded-xl p-3.5 text-slate-200 outline-none text-base transition-colors appearance-none cursor-pointer"
                  style={{
                    backgroundImage: `url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%236B7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3E%3C/svg%3E")`,
                    backgroundPosition: 'right 0.85rem center',
                    backgroundSize: '1.25rem',
                    backgroundRepeat: 'no-repeat',
                    paddingRight: '2.5rem'
                  }}
                >
                  {SERVICES.map((srv) => (
                    <option key={srv.id} value={srv.id} className="bg-slate-950 text-slate-200">
                      {srv.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Total Word Count */}
              <div className="space-y-2">
                <label className="text-xs font-mono font-bold tracking-widest text-slate-500 uppercase block">
                  Total Word Count
                </label>
                <input
                  type="text"
                  pattern="[0-9]*"
                  value={wordCount}
                  onChange={(e) => {
                    const val = e.target.value.replace(/[^0-9]/g, '');
                    setWordCount(val);
                  }}
                  disabled={activeService.type === 'flat'}
                  className={`w-full bg-[#07090e]/60 border border-slate-900 focus:border-purple-500/40 rounded-xl p-3.5 text-slate-200 outline-none text-base transition-colors ${
                    activeService.type === 'flat' ? 'opacity-40 cursor-not-allowed' : ''
                  }`}
                  placeholder={activeService.type === 'flat' ? 'N/A' : 'e.g. 50000'}
                />
              </div>

            </div>
          </div>

          {/* Large Estimated Total Card Box */}
          <div className="mt-8 bg-[#04060A]/85 border border-slate-900/60 p-6.5 rounded-2xl flex flex-col justify-center">
            <span className="text-xs font-mono font-bold text-slate-500 uppercase tracking-widest block">
              Estimated Total
            </span>
            <span className="font-serif font-medium text-4xl sm:text-5xl text-white mt-2 block tracking-wide">
              {formatCurrency(calculateTotal())}
            </span>
            <span className="text-slate-400 font-light text-base mt-2 block">
              {activeService.type === 'flat'
                ? `${activeService.name} · Flat Session`
                : `${activeService.name} · ${(parseInt(wordCount) || 0).toLocaleString()} words`}
            </span>
          </div>
        </div>

        {/* Right Column: Secure Upload Portal & Directives */}
        <div className="bg-[#0B0F19]/25 border border-slate-900/60 p-8 rounded-3xl min-h-[460px]">
          
          {bookingStatus === 'success' ? (
            <div className="bg-[#0B0F19]/30 border border-purple-950/20 p-8 rounded-3xl text-center space-y-6 animate-fade-in flex flex-col justify-center items-center h-full min-h-[400px]">
              <div className="w-16 h-16 rounded-full bg-purple-950/40 border border-purple-500/30 flex items-center justify-center text-purple-400 shadow-lg shadow-purple-900/10">
                <Sparkles className="w-7 h-7 animate-pulse" />
              </div>
              <div className="space-y-3">
                <h3 className="text-2xl font-serif text-white font-medium">Submitted to the Sanctuary</h3>
                <p className="text-slate-400 text-base leading-relaxed max-w-md mx-auto font-light">
                  Your manuscript and specifications have been secure-channeled to our vetted experts. 
                  A final editorial proposal and booking calendar will be delivered to your inbox at <span className="font-mono text-purple-300 font-medium">{user?.email || 'your account email'}</span> within 24 hours.
                </p>
              </div>
              <button 
                onClick={() => {
                  setBookingStatus('');
                  setFileName('');
                  setNotes('');
                }}
                className="px-6 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono text-slate-300 hover:text-white hover:border-purple-500/20 transition-all cursor-pointer"
              >
                Consult Another Project
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col justify-between h-full space-y-6">
              
              <div>
                <h2 className="font-serif font-semibold text-3xl text-white">Secure Upload Portal</h2>
                <p className="text-slate-400 font-light text-base mt-1.5">
                  Hand your manuscript to a vetted expert.
                </p>

                {/* HTML5 Drag & Drop File Upload Zone */}
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`group mt-6 border-2 border-dashed rounded-2xl p-7 text-center cursor-pointer transition-all duration-300 select-none flex flex-col items-center justify-center gap-3 bg-[#07090e]/30 ${
                    isDragging
                      ? 'border-purple-500/60 bg-purple-950/20'
                      : fileName
                        ? 'border-emerald-500/40 bg-emerald-950/10'
                        : 'border-slate-800/90 hover:border-purple-500/40 hover:bg-[#0E1321]/20'
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".doc,.docx,.pdf"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${
                    fileName 
                      ? 'bg-emerald-950/50 border border-emerald-500/30 text-emerald-400' 
                      : 'bg-slate-900/60 border border-slate-800 text-slate-400 group-hover:text-purple-400 group-hover:border-purple-500/20'
                  }`}>
                    <Upload className="w-5 h-5" />
                  </div>

                  {fileName ? (
                    <div className="space-y-1">
                      <p className="text-emerald-400 font-medium text-base truncate max-w-[280px] mx-auto">
                        {fileName}
                      </p>
                      <p className="text-slate-500 text-xs font-mono">
                        Click or drag new file to swap
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <p className="text-slate-300 font-medium text-base">
                        Drop manuscript here
                      </p>
                      <p className="text-slate-500 font-mono text-xs">
                        .doc · .docx · .pdf
                      </p>
                    </div>
                  )}
                </div>

                {/* Notes For Your Expert */}
                <div className="mt-6 space-y-2">
                  <label className="text-xs font-mono font-bold tracking-widest text-slate-500 uppercase block">
                    Notes For Your Expert
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Genre, target audience, deadline, areas of concern..."
                    className="w-full bg-[#07090e]/60 border border-slate-900 focus:border-purple-500/40 rounded-xl p-4 text-slate-200 outline-none text-base transition-colors h-24 resize-none placeholder:text-slate-650"
                  />
                </div>
              </div>

              {/* Full Width Submit Button */}
              <button
                type="submit"
                disabled={bookingStatus === 'sending'}
                className="w-full py-4.5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-mono tracking-widest uppercase font-bold text-sm transition-all duration-300 shadow-[0_4px_20px_rgba(168,85,247,0.18)] cursor-pointer flex items-center justify-center gap-2 hover:shadow-[0_4px_25px_rgba(168,85,247,0.25)] active:scale-[0.99] disabled:opacity-50"
              >
                <Sparkles className="w-4 h-4 shrink-0" />
                {bookingStatus === 'sending' ? 'Connecting to Sanctuary...' : 'Submit to the Sanctuary'}
              </button>

            </form>
          )}

        </div>

      </div>
    </div>
  );
}
