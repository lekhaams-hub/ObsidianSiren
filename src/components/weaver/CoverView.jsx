import React, { useState, useEffect, useRef } from 'react';
import { Palette, Sparkles, Upload, Download, Type, RefreshCw, Layers, Sliders, Eraser, Lock, Trash2, Eye } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const MOCK_AI_IMAGES = [
  'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=500&q=80',
  'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=500&q=80',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=500&q=80',
  'https://images.unsplash.com/photo-1479162511910-a11a94d21e6e?w=500&q=80'
];

const getTodayKey = () => {
  const today = new Date();
  return `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
};

export default function CoverView() {
  const { user, setIsAuthModalOpen } = useAuth();

  // Tab state in Editor Panel: 'text' | 'brush' | 'background'
  const [editorTab, setEditorTab] = useState('text');

  // AI Prompt State
  const [aiPrompt, setAiPrompt] = useState(
    'An ancient stone mask submerged in the dark abyss, glowing with purple neon energy currents, oil painting style.'
  );
  const [generating, setGenerating] = useState(false);
  const [aiResult, setAiResult] = useState('');
  const [aiPromptsCount, setAiPromptsCount] = useState(() => {
    const savedData = localStorage.getItem('oss_cover_ai_prompt_data');
    if (!savedData) return 0;
    try {
      const parsed = JSON.parse(savedData);
      const todayKey = getTodayKey();
      if (parsed.date !== todayKey) {
        localStorage.setItem(
          'oss_cover_ai_prompt_data',
          JSON.stringify({ date: todayKey, count: 0 })
        );
        return 0;
      }
      return parsed.count || 0;
    } catch {
      return 0;
    }
  });

  // Cover Background State
  const [bgImage, setBgImage] = useState(
    'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=500&q=80'
  );

  // Book Title Specs
  const [title, setTitle] = useState('OBSIDIAN SIREN');
  const [titleFont, setTitleFont] = useState('Cormorant Garamond');
  const [titleColor, setTitleColor] = useState('#FCFBF8');
  const [titleSize, setTitleSize] = useState(24);
  const [titlePosition, setTitlePosition] = useState({ x: 50, y: 15 });

  // Book Author Specs
  const [author, setAuthor] = useState('DR. LEKHAA VANCE');
  const [authorFont, setAuthorFont] = useState('Inter');
  const [authorColor, setAuthorColor] = useState('#A855F7');
  const [authorSize, setAuthorSize] = useState(11);
  const [authorPosition, setAuthorPosition] = useState({ x: 50, y: 88 });

  // Drawing Canvas / Brush State
  const [isDrawing, setIsDrawing] = useState(false);
  const [brushColor, setBrushColor] = useState('#a855f7');
  const [brushSize, setBrushSize] = useState(5);
  const [isEraser, setIsEraser] = useState(false);

  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
    }
  }, []);

  // Painting Canvas mouse handlers
  const startDrawing = (e) => {
    if (!user) {
      setIsAuthModalOpen(true);
      return;
    }
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    
    ctx.beginPath();
    ctx.moveTo(
      e.clientX - rect.left,
      e.clientY - rect.top
    );
    setIsDrawing(true);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();

    ctx.strokeStyle = isEraser ? 'rgba(0,0,0,1)' : brushColor;
    ctx.lineWidth = brushSize;
    ctx.globalCompositeOperation = isEraser ? 'destination-out' : 'source-over';

    ctx.lineTo(
      e.clientX - rect.left,
      e.clientY - rect.top
    );
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearDrawLayer = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  // Generate AI cover simulator
  const generateAICover = (e) => {
    e.preventDefault();
    if (!user) {
      setIsAuthModalOpen(true);
      return;
    }
    if (aiPromptsCount >= 5) {
      alert('Daily limit reached. Only 5 AI prompts allowed per day.');
      return;
    }

    setGenerating(true);
    setAiResult('');

    setTimeout(() => {
      const randomImg = MOCK_AI_IMAGES[Math.floor(Math.random() * MOCK_AI_IMAGES.length)];
      setAiResult(randomImg);
      setBgImage(randomImg);

      setAiPromptsCount((prev) => {
        const next = prev + 1;
        localStorage.setItem(
          'oss_cover_ai_prompt_data',
          JSON.stringify({ date: getTodayKey(), count: next })
        );
        return next;
      });
      setGenerating(false);
    }, 1800);
  };

  // File Upload Cover image handler
  const handleBgUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setBgImage(URL.createObjectURL(file));
    }
  };

  // Export merged cover image
  const downloadCover = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 600;
    canvas.height = 900;
    const ctx = canvas.getContext('2d');

    const triggerDownload = (imgSource) => {
      // 1. Draw background cover
      if (imgSource) {
        ctx.drawImage(imgSource, 0, 0, 600, 900);
      } else {
        ctx.fillStyle = '#080A10';
        ctx.fillRect(0, 0, 600, 900);
      }

      // 2. Draw user hand-drawn brush canvas (scaled from 260x390 to 600x900)
      const drawingCanvas = canvasRef.current;
      if (drawingCanvas) {
        ctx.drawImage(drawingCanvas, 0, 0, 600, 900);
      }

      // 3. Render title text
      if (title.trim()) {
        ctx.fillStyle = titleColor;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        const scale = 600 / 260;
        const titleCanvasSize = Math.round(titleSize * scale);
        ctx.font = `bold ${titleCanvasSize}px "${titleFont}"`;
        const titleY = (titlePosition.y / 100) * 900;
        ctx.fillText(title.toUpperCase(), 300, titleY);
      }

      // 4. Render author text
      if (author.trim()) {
        ctx.fillStyle = authorColor;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        const scale = 600 / 260;
        const authorCanvasSize = Math.round(authorSize * scale);
        ctx.font = `500 ${authorCanvasSize}px "${authorFont}"`;
        const authorY = (authorPosition.y / 100) * 900;
        ctx.fillText(author.toUpperCase(), 300, authorY);
      }

      // 5. Fire download
      const dataURL = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `${title.replace(/\s+/g, '_')}_cover.png`;
      link.href = dataURL;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    };

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = bgImage;
    img.onload = () => triggerDownload(img);
    img.onerror = () => triggerDownload(null);
  };

  return (
    <div className="space-y-6 animate-fade-in pb-8 text-slate-100 max-w-7xl mx-auto">
      
      {/* Page Hero Header */}
      <div>
        <span className="text-xs font-mono font-bold tracking-[0.25em] text-purple-400 uppercase">Window III</span>
        <h1 className="text-4xl font-serif text-white tracking-tight mt-1.5">Cover Design Studio</h1>
        <p className="text-slate-400 text-sm font-light leading-relaxed mt-2 max-w-3xl">
          Combine high-res background templates, hand-drawn brush art, and detailed title typography grids.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* =========================================================
            1. LEFT SIDEBAR: AI COVER GENERATOR (spans 4 columns)
            ========================================================= */}
        <div className="lg:col-span-4 bg-[#0B0F19]/25 border border-slate-900/60 p-5 rounded-3xl space-y-5 relative overflow-hidden select-none min-h-[520px]">
          {!user && (
            <div className="absolute inset-0 z-10 backdrop-blur-[2.5px] bg-[#07090e]/60 flex items-center justify-center">
              <div className="bg-slate-950/95 border border-slate-900 p-6 rounded-2xl text-center max-w-xs shadow-2xl">
                <Lock className="w-10 h-10 text-purple-400 mx-auto mb-3" />
                <h4 className="text-slate-100 font-serif font-semibold text-base mb-1.5">AI Generator Locked</h4>
                <p className="text-[11px] text-slate-400 leading-normal mb-4 font-light">Sign in to Obsidian Atelier to unlock generative daily AI covers.</p>
                <button 
                  onClick={() => setIsAuthModalOpen(true)}
                  className="w-full py-2 bg-purple-650 hover:bg-purple-600 text-white text-xs font-mono font-bold tracking-wider uppercase transition-all rounded-xl cursor-pointer"
                >
                  Sign In
                </button>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between border-b border-slate-900/60 pb-3">
            <div className="flex items-center gap-1.5 text-purple-400">
              <Sparkles className="w-4 h-4" />
              <span className="text-xs font-mono font-bold tracking-widest uppercase">AI Cover Generator</span>
            </div>
            <span className="text-xs font-mono text-purple-300 font-bold bg-purple-950/30 border border-purple-900/20 px-2 py-0.5 rounded-full">
              {aiPromptsCount}/5 Today
            </span>
          </div>

          <form onSubmit={generateAICover} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[11px] font-mono text-slate-500 uppercase tracking-wider block pl-0.5">Cover Art Prompt</label>
              <textarea
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                placeholder="Describe the mood, items, and style of your cover art..."
                className="w-full bg-[#050608]/90 border border-slate-900 focus:border-purple-950/60 rounded-xl p-3.5 text-xs sm:text-sm text-slate-300 focus:outline-none placeholder-slate-700 h-28 resize-none font-sans leading-normal"
              />
            </div>

            <button
              type="submit"
              disabled={generating || aiPromptsCount >= 5}
              className="w-full py-3 bg-purple-650 hover:bg-purple-600 text-white text-xs font-mono font-bold tracking-widest uppercase rounded-xl transition-all shadow-[0_0_12px_rgba(168,85,247,0.15)] flex items-center justify-center gap-2 cursor-pointer"
            >
              {generating ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin text-white" />
                  Generating...
                </>
              ) : (
                <>
                  <RefreshCw className="w-3.5 h-3.5" />
                  Weave AI Artwork
                </>
              )}
            </button>
          </form>

          {/* AI Output preview card */}
          <div className="space-y-2.5 pt-4 border-t border-slate-900/60">
            <span className="text-[11px] font-mono text-slate-500 uppercase tracking-wider block pl-0.5">Latest AI Result</span>
            <div className="bg-slate-950/40 border border-slate-900 rounded-2xl p-4 min-h-[220px] flex flex-col items-center justify-center relative overflow-hidden aspect-[4/3]">
              {generating ? (
                <div className="text-center space-y-3.5 animate-pulse">
                  <div className="w-7 h-7 rounded-full border-2 border-t-purple-500 animate-spin mx-auto" />
                  <p className="text-xs font-mono text-slate-500">Retrieving artwork from studio matrices...</p>
                </div>
              ) : aiResult ? (
                <img
                  src={aiResult}
                  alt="AI Cover Output"
                  className="absolute inset-0 w-full h-full object-cover rounded-xl transition-transform hover:scale-105"
                />
              ) : (
                <div className="text-center text-slate-600 space-y-2">
                  <Palette className="w-8 h-8 mx-auto text-slate-800" />
                  <p className="text-xs font-mono font-medium">No generative template yet.</p>
                  <p className="text-[10px] leading-normal max-w-[170px] mx-auto text-slate-650">Provide prompt specifics and weave cover art templates above.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* =========================================================
            2. MIDDLE PANEL: PREMIUM COVER DESIGNER (spans 5 columns)
            ========================================================= */}
        <div className="lg:col-span-5 bg-[#0B0F19]/25 border border-slate-900/60 p-5 rounded-3xl space-y-5 select-none min-h-[520px]">
          
          {/* Segmented Editor tab controllers */}
          <div className="flex bg-[#07090e]/80 border border-slate-900/60 p-0.5 rounded-xl select-none w-full">
            <button
              onClick={() => setEditorTab('text')}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-[10px] font-mono font-bold tracking-wider uppercase transition-all cursor-pointer ${
                editorTab === 'text'
                  ? 'bg-purple-950/30 border border-purple-500/20 text-purple-300 shadow-md'
                  : 'text-slate-500 hover:text-slate-350'
              }`}
            >
              <Type className="w-3.5 h-3.5" /> Text Overlays
            </button>
            <button
              onClick={() => setEditorTab('brush')}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-[10px] font-mono font-bold tracking-wider uppercase transition-all cursor-pointer ${
                editorTab === 'brush'
                  ? 'bg-purple-950/30 border border-purple-500/20 text-purple-300 shadow-md'
                  : 'text-slate-500 hover:text-slate-350'
              }`}
            >
              <Palette className="w-3.5 h-3.5" /> Brush / Paint
            </button>
            <button
              onClick={() => setEditorTab('background')}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-[10px] font-mono font-bold tracking-wider uppercase transition-all cursor-pointer ${
                editorTab === 'background'
                  ? 'bg-purple-950/30 border border-purple-500/20 text-purple-300 shadow-md'
                  : 'text-slate-500 hover:text-slate-350'
              }`}
            >
              <Upload className="w-3.5 h-3.5" /> Upload Cover
            </button>
          </div>

          {/* TAB CONTENT A: TEXT OVERLAYS EDITOR */}
          {editorTab === 'text' && (
            <div className="space-y-5 animate-fade-in">
              {/* Title parameters */}
              <div className="bg-slate-950/15 border border-slate-900 rounded-2xl p-4 space-y-4">
                <span className="text-[10px] font-mono text-purple-400 font-bold uppercase tracking-wider block border-b border-slate-900 pb-1.5">Title Text Properties</span>
                <div className="space-y-3">
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block pl-0.5">Title Text</span>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g. OBSIDIAN SIREN..."
                      className="w-full bg-[#050608]/90 border border-slate-900/90 focus:border-purple-950/60 rounded-xl p-3 text-xs sm:text-sm text-slate-200 focus:outline-none font-serif"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3.5">
                    <div className="space-y-1">
                      <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block pl-0.5">Font Style</span>
                      <select
                        value={titleFont}
                        onChange={(e) => setTitleFont(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-900 p-2.5 rounded-xl text-xs font-mono text-slate-300 focus:outline-none cursor-pointer"
                      >
                        <option value="Cormorant Garamond">Cormorant Garamond (Serif)</option>
                        <option value="Inter">Inter (Sans-Serif)</option>
                        <option value="Cinzel">Cinzel (Classic Roman)</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block pl-0.5">Font Size</span>
                      <div className="flex items-center gap-2">
                        <input
                          type="range"
                          min="12"
                          max="40"
                          value={titleSize}
                          onChange={(e) => setTitleSize(parseInt(e.target.value))}
                          className="flex-1 accent-purple-600 h-1 rounded-full cursor-pointer bg-slate-900"
                        />
                        <span className="text-xs font-mono text-slate-400 w-8 text-right">{titleSize}px</span>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3.5">
                    <div className="space-y-1">
                      <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block pl-0.5">Color</span>
                      <div className="flex gap-2 items-center">
                        <input
                          type="color"
                          value={titleColor}
                          onChange={(e) => setTitleColor(e.target.value)}
                          className="w-7 h-7 rounded border border-slate-900 cursor-pointer bg-transparent"
                        />
                        <span className="text-xs font-mono text-slate-300">{titleColor.toUpperCase()}</span>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block pl-0.5">Vertical Position</span>
                      <div className="flex items-center gap-2">
                        <input
                          type="range"
                          min="5"
                          max="95"
                          value={titlePosition.y}
                          onChange={(e) => setTitlePosition({ ...titlePosition, y: parseInt(e.target.value) })}
                          className="flex-1 accent-purple-600 h-1 rounded-full cursor-pointer bg-slate-900"
                        />
                        <span className="text-xs font-mono text-slate-400 w-8 text-right">{titlePosition.y}%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Author parameters */}
              <div className="bg-slate-950/15 border border-slate-900 rounded-2xl p-4 space-y-4">
                <span className="text-[10px] font-mono text-purple-400 font-bold uppercase tracking-wider block border-b border-slate-900 pb-1.5">Author Text Properties</span>
                <div className="space-y-3">
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block pl-0.5">Author Text</span>
                    <input
                      type="text"
                      value={author}
                      onChange={(e) => setAuthor(e.target.value)}
                      placeholder="e.g. DR. LEKHAA VANCE..."
                      className="w-full bg-[#050608]/90 border border-slate-900/90 focus:border-purple-950/60 rounded-xl p-3 text-xs sm:text-sm text-slate-200 focus:outline-none font-serif"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3.5">
                    <div className="space-y-1">
                      <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block pl-0.5">Font Style</span>
                      <select
                        value={authorFont}
                        onChange={(e) => setAuthorFont(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-900 p-2.5 rounded-xl text-xs font-mono text-slate-300 focus:outline-none cursor-pointer"
                      >
                        <option value="Inter">Inter (Sans-Serif)</option>
                        <option value="Cormorant Garamond">Cormorant Garamond (Serif)</option>
                        <option value="Cinzel">Cinzel (Classic Roman)</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block pl-0.5">Font Size</span>
                      <div className="flex items-center gap-2">
                        <input
                          type="range"
                          min="8"
                          max="28"
                          value={authorSize}
                          onChange={(e) => setAuthorSize(parseInt(e.target.value))}
                          className="flex-1 accent-purple-600 h-1 rounded-full cursor-pointer bg-slate-900"
                        />
                        <span className="text-xs font-mono text-slate-400 w-8 text-right">{authorSize}px</span>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3.5">
                    <div className="space-y-1">
                      <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block pl-0.5">Color</span>
                      <div className="flex gap-2 items-center">
                        <input
                          type="color"
                          value={authorColor}
                          onChange={(e) => setAuthorColor(e.target.value)}
                          className="w-7 h-7 rounded border border-slate-900 cursor-pointer bg-transparent"
                        />
                        <span className="text-xs font-mono text-slate-300">{authorColor.toUpperCase()}</span>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block pl-0.5">Vertical Position</span>
                      <div className="flex items-center gap-2">
                        <input
                          type="range"
                          min="5"
                          max="95"
                          value={authorPosition.y}
                          onChange={(e) => setAuthorPosition({ ...authorPosition, y: parseInt(e.target.value) })}
                          className="flex-1 accent-purple-600 h-1 rounded-full cursor-pointer bg-slate-900"
                        />
                        <span className="text-xs font-mono text-slate-400 w-8 text-right">{authorPosition.y}%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB CONTENT B: BRUSH DRAWING / ERASER */}
          {editorTab === 'brush' && (
            <div className="space-y-5 animate-fade-in bg-slate-950/15 border border-slate-900 rounded-2xl p-4 relative">
              {!user && <div className="absolute inset-0 bg-[#07090e]/60 z-10 rounded-2xl" />}
              <span className="text-[10px] font-mono text-purple-400 font-bold uppercase tracking-wider block border-b border-slate-900 pb-1.5">Canvas Painting & Brushes</span>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center bg-slate-950/40 p-2.5 rounded-xl border border-slate-900">
                  <span className="text-xs text-slate-400 font-mono pl-1">Mode Selector</span>
                  <button
                    type="button"
                    onClick={() => setIsEraser(!isEraser)}
                    className={`px-3 py-1.5 rounded-lg text-[10px] font-mono font-bold tracking-widest uppercase transition-all cursor-pointer flex items-center gap-1 border ${
                      isEraser
                        ? 'bg-purple-950/40 border-purple-500/30 text-purple-300'
                        : 'border-slate-800 text-slate-500 hover:text-slate-300'
                    }`}
                  >
                    <Eraser className="w-3.5 h-3.5" /> {isEraser ? 'Eraser Active' : 'Brush Active'}
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block pl-0.5">Brush Color</span>
                    <div className="flex gap-2 items-center">
                      <input
                        type="color"
                        value={brushColor}
                        onChange={(e) => setBrushColor(e.target.value)}
                        disabled={isEraser}
                        className="w-7 h-7 rounded border border-slate-900 cursor-pointer bg-transparent disabled:opacity-30 disabled:cursor-not-allowed"
                      />
                      <span className={`text-xs font-mono ${isEraser ? 'text-slate-600 italic' : 'text-slate-300'}`}>
                        {isEraser ? 'Eraser Mode' : brushColor.toUpperCase()}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block pl-0.5">Brush Size</span>
                    <div className="flex items-center gap-2">
                      <input
                        type="range"
                        min="1"
                        max="24"
                        value={brushSize}
                        onChange={(e) => setBrushSize(parseInt(e.target.value))}
                        className="flex-1 accent-purple-600 h-1 rounded-full cursor-pointer bg-slate-900"
                      />
                      <span className="text-xs font-mono text-slate-400 w-8 text-right">{brushSize}px</span>
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={clearDrawLayer}
                    className="w-full py-2.5 bg-red-950/20 hover:bg-red-900/30 border border-red-900/30 hover:border-red-900/60 rounded-xl text-xs font-mono font-bold tracking-widest uppercase text-red-300 hover:text-red-200 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Wipe Brush strokes
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB CONTENT C: UPLOAD CUSTOM COVER BACKGROUND */}
          {editorTab === 'background' && (
            <div className="space-y-4 animate-fade-in bg-slate-950/15 border border-slate-900 rounded-2xl p-4">
              <span className="text-[10px] font-mono text-purple-400 font-bold uppercase tracking-wider block border-b border-slate-900 pb-1.5">Upload Background Cover</span>
              
              <div className="space-y-3.5">
                <p className="text-xs text-slate-500 leading-normal pl-0.5 font-light">
                  If you have a cover template or design file already, upload it below to overlay title and drawing art on top of it.
                </p>

                <div className="relative border-2 border-dashed border-slate-900 hover:border-purple-500/30 rounded-2xl p-6 text-center text-slate-500 flex flex-col items-center justify-center space-y-2 select-none min-h-[140px] cursor-pointer transition-all hover:bg-slate-950/10 group">
                  <Upload className="w-6 h-6 text-slate-800 group-hover:text-purple-400 transition-colors" />
                  <p className="text-xs font-mono font-medium tracking-wide">Choose custom cover file</p>
                  <p className="text-[10px] leading-normal text-slate-650 max-w-[180px] mx-auto">Supports JPG, PNG, or WEBP. File overlays instantly on preview.</p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleBgUpload}
                    className="absolute inset-0 opacity-0 w-full h-full cursor-pointer z-10"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* =========================================================
            3. RIGHT PANEL: IMMERSIVE COVER CANVAS FRAME (spans 3 columns)
            ========================================================= */}
        <div className="lg:col-span-3 bg-[#0B0F19]/25 border border-slate-900/60 p-5 rounded-3xl flex flex-col items-center justify-between min-h-[520px]">
          
          <div className="w-full text-center border-b border-slate-900/60 pb-3 mb-4 select-none">
            <span className="text-xs font-mono font-bold tracking-widest text-purple-400 uppercase">Live Composition Preview</span>
          </div>

          {/* Luxury Virtual Cover Frame aspect ratio 2:3 */}
          <div className="relative w-full max-w-[250px] aspect-[2/3] rounded-2xl overflow-hidden border border-slate-800/80 shadow-[0_12px_40px_rgba(0,0,0,0.8)] select-none group bg-slate-950">
            
            {/* 1. Styled Background Cover */}
            <div
              className="absolute inset-0 select-none pointer-events-none"
              style={{
                backgroundImage: `url(${bgImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            />

            {/* 2. Interactive Paint Canvas Overlay */}
            <canvas
              ref={canvasRef}
              width={250}
              height={375}
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              className="absolute inset-0 z-10 cursor-crosshair"
            />

            {/* 3. HTML Absolute text overlay positioned dynamically */}
            <div className="absolute inset-0 z-20 flex flex-col justify-between p-5 pointer-events-none">
              
              {/* Title overlay */}
              {title.trim() && (
                <h2
                  style={{
                    color: titleColor,
                    fontSize: `${titleSize}px`,
                    fontFamily: `"${titleFont}", serif`,
                    top: `${titlePosition.y}%`,
                  }}
                  className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 text-center font-bold uppercase tracking-wide leading-tight drop-shadow-[0_2px_4px_rgba(0,0,0,0.85)] w-[85%] select-none pointer-events-none"
                >
                  {title}
                </h2>
              )}

              {/* Author overlay */}
              {author.trim() && (
                <div
                  style={{
                    color: authorColor,
                    fontSize: `${authorSize}px`,
                    fontFamily: `"${authorFont}", sans-serif`,
                    top: `${authorPosition.y}%`,
                  }}
                  className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 text-center uppercase tracking-[0.2em] font-semibold drop-shadow-[0_2px_3px_rgba(0,0,0,0.85)] w-[90%] select-none pointer-events-none"
                >
                  {author}
                </div>
              )}
            </div>
          </div>

          {/* Actions & Exporter controls */}
          <div className="w-full pt-6 border-t border-slate-900/60 mt-4 select-none">
            <button
              type="button"
              onClick={downloadCover}
              className="w-full py-3 bg-purple-650 hover:bg-purple-600 text-white text-xs font-mono font-bold tracking-widest uppercase rounded-xl transition-all shadow-[0_4px_15px_rgba(168,85,247,0.25)] flex items-center justify-center gap-2 cursor-pointer"
            >
              <Download className="w-4 h-4" /> Export & Download Cover
            </button>
            <p className="text-[9px] text-center text-slate-500 font-mono tracking-wider mt-2.5">
              PNG format · 600 x 900 resolution
            </p>
          </div>
        </div>

      </div>

    </div>
  );
}