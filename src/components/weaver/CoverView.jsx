import React, { useState, useEffect, useRef } from 'react';
import { Palette, Sparkles, Upload, Download, Type, RefreshCw, Layers, Sliders, Eraser, Lock } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const MOCK_AI_IMAGES = [
  'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=500&q=80', // ocean depth
  'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=500&q=80', // night sky / purple nebula
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=500&q=80', // dark mystical face
  'https://images.unsplash.com/photo-1479162511910-a11a94d21e6e?w=500&q=80'  // volcanic rock / magma
];

export default function CoverView() {
  const { user, setIsAuthModalOpen } = useAuth();
  
  // AI Generator States
  const [aiPrompt, setAiPrompt] = useState('An ancient stone mask submerged in the dark abyss, glowing with purple neon energy currents, oil painting style.');
  const [generating, setGenerating] = useState(false);
  const [aiResult, setAiResult] = useState('');

  // Prompt limit state
  const [aiPromptsCount, setAiPromptsCount] = useState(() => {
    const saved = localStorage.getItem('oss_cover_ai_prompts_count');
    return saved ? parseInt(saved, 10) : 0;
  });

  // Canva-Lite Digital Studio Canvas States
  const [bgImage, setBgImage] = useState('https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=500&q=80');
  const [bgScale, setBgScale] = useState(1.0);
  const [bgPosition, setBgPosition] = useState({ x: 0, y: 0 });
  const [title, setTitle] = useState('OBSIDIAN SIREN');
  const [titleFont, setTitleFont] = useState('Cormorant Garamond');
  const [titleColor, setTitleColor] = useState('#FCFBF8');
  const [titleSize, setTitleSize] = useState(24);
  const [titlePosition, setTitlePosition] = useState({ x: 50, y: 15 }); // values in percentage
  const [author, setAuthor] = useState('DR. LEKHAA VANCE');
  
  // Brush Layer Canvas Drawing
  const [isDrawing, setIsDrawing] = useState(false);
  const [brushColor, setBrushColor] = useState('#a855f7');
  const [brushSize, setBrushSize] = useState(5);
  const [isEraser, setIsEraser] = useState(false);
  const canvasRef = useRef(null);
  const canvasContainerRef = useRef(null);

  useEffect(() => {
    // Clear / Initialize Draw Canvas Layer
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
    }
  }, []);

  // Draw handlers
  const startDrawing = (e) => {
    if (!user) {
      setIsAuthModalOpen(true);
      return;
    }
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.strokeStyle = isEraser ? 'rgba(0,0,0,1)' : brushColor;
    ctx.lineWidth = brushSize;
    // Eraser mode combines destination-out to clear pixels
    ctx.globalCompositeOperation = isEraser ? 'destination-out' : 'source-over';
    
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearDrawLayer = () => {
    if (!user) {
      setIsAuthModalOpen(true);
      return;
    }
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  // AI Generation simulation
  const generateAICover = (e) => {
    e.preventDefault();
    if (!user) {
      setIsAuthModalOpen(true);
      return;
    }
    if (aiPromptsCount >= 5) {
      return;
    }
    setGenerating(true);
    setAiResult('');
    setTimeout(() => {
      setGenerating(false);
      // Select a random image from the mockup list
      const randomImg = MOCK_AI_IMAGES[Math.floor(Math.random() * MOCK_AI_IMAGES.length)];
      setAiResult(randomImg);
      // Immediately push to background canvas of digital workspace
      setBgImage(randomImg);
      // Increment prompt counter
      setAiPromptsCount(prev => {
        const next = prev + 1;
        localStorage.setItem('oss_cover_ai_prompts_count', next);
        return next;
      });
    }, 1800);
  };

  // Upload custom background
  const handleBgUpload = (e) => {
    if (!user) {
      setIsAuthModalOpen(true);
      return;
    }
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setBgImage(url);
    }
  };

  // Export Design compilation (Simulated canvas export)
  const exportDesign = () => {
    if (!user) {
      setIsAuthModalOpen(true);
      return;
    }
    // We create a temporary canvas to merge background image, HTML5 drawings, and typography into a downloadable blob
    const canvas = document.createElement('canvas');
    canvas.width = 400;
    canvas.height = 600;
    const ctx = canvas.getContext('2d');

    // Load background image
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = bgImage;
    img.onload = () => {
      // 1. Draw Background scaled
      const sWidth = canvas.width * bgScale;
      const sHeight = canvas.height * bgScale;
      const sX = (canvas.width - sWidth) / 2 + bgPosition.x;
      const sY = (canvas.height - sHeight) / 2 + bgPosition.y;
      ctx.drawImage(img, sX, sY, sWidth, sHeight);

      // 2. Draw brush stroke canvas overlay
      const drawCanvas = canvasRef.current;
      if (drawCanvas) {
        ctx.drawImage(drawCanvas, 0, 0, canvas.width, canvas.height);
      }

      // 3. Draw Typography Title Layer
      ctx.fillStyle = titleColor;
      ctx.textAlign = 'center';
      ctx.font = `${titleFont === 'Cormorant Garamond' ? 'italic' : ''} ${titleSize * 1.5}px ${titleFont === 'Cormorant Garamond' ? 'Cormorant Garamond' : 'sans-serif'}`;
      ctx.shadowColor = "rgba(0,0,0,0.8)";
      ctx.shadowBlur = 8;
      
      const textX = canvas.width * (titlePosition.x / 100);
      const textY = canvas.height * (titlePosition.y / 100);
      ctx.fillText(title, textX, textY);

      // 4. Draw Typography Author Layer
      ctx.fillStyle = titleColor === '#FCFBF8' ? 'rgba(252,251,248,0.85)' : titleColor;
      ctx.textAlign = 'center';
      ctx.font = `bold 14px sans-serif`;
      ctx.shadowBlur = 4;
      ctx.fillText(author.toUpperCase(), canvas.width / 2, canvas.height - 40);

      // Trigger download
      const element = document.createElement("a");
      element.href = canvas.toDataURL("image/png");
      element.download = `${title.replace(/\s+/g, '_')}_book_cover.png`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    };
  };

  // Reusable Auth Overlay Block
  const AuthOverlay = ({ message = "Sign in to compile covers, design canvases, and save cover artworks." }) => (
    <div className="absolute inset-0 bg-[#07090e]/85 backdrop-blur-[3px] z-20 flex flex-col items-center justify-center p-6 text-center select-none">
      <div className="max-w-xs bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-2xl space-y-4">
        <div className="w-11 h-11 rounded-full bg-purple-950/50 border border-purple-500/20 flex items-center justify-center mx-auto text-purple-400">
          <Lock className="w-4 h-4" />
        </div>
        <div className="space-y-1">
          <h4 className="text-slate-200 font-serif font-medium text-base">Authentication Required</h4>
          <p className="text-[11px] text-slate-400 leading-relaxed">{message}</p>
        </div>
        <button 
          onClick={() => setIsAuthModalOpen(true)}
          className="w-full py-2 bg-purple-600 hover:bg-purple-500 text-white font-medium text-xs rounded-lg transition-colors cursor-pointer"
        >
          Sign In to Studio
        </button>
      </div>
    </div>
  );

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Title Header */}
      <div>
        <h3 className="text-xs font-mono tracking-[0.3em] text-purple-400 uppercase">Window III</h3>
        <h1 className="text-4xl font-serif text-white tracking-tight">Cover Studio</h1>
        <p className="text-slate-400 text-sm font-light mt-1">
          Bring the cover of your manuscript to life. Co-create cinematic visual concepts with AI, or compose layout layers in our design studio.
        </p>
      </div>

      {/* Main Grid Panel Layout */}
      <div className="grid lg:grid-cols-3 gap-6">
        
        {/* Left Column: AI Cover Generator */}
        <div className="bg-[#0b0c10]/40 border border-slate-800 rounded-2xl p-6 space-y-4 h-max relative">
          {!user && <AuthOverlay message="Sign in to interact with prompt generation pipelines." />}
          
          <div className="flex items-center justify-between gap-2 border-b border-slate-900 pb-2">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span className="text-sm font-mono uppercase text-purple-400 tracking-wider">AI Cover Generator</span>
            </div>
            <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${
              aiPromptsCount >= 5 
                ? 'bg-red-950/40 border-red-800/30 text-red-400' 
                : 'bg-purple-950/40 border-purple-800/30 text-purple-400'
            }`}>
              {aiPromptsCount}/5 Free
            </span>
          </div>
          
          {aiPromptsCount >= 5 ? (
            <div className="bg-[#120b1e]/40 border border-purple-500/10 rounded-xl p-4 space-y-3.5 relative overflow-hidden">
              <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-purple-500/5 rounded-full blur-xl pointer-events-none" />
              <div className="flex items-start gap-3">
                <div className="p-2 bg-purple-950/60 border border-purple-500/20 rounded-lg text-purple-400 mt-0.5 shrink-0">
                  <Lock className="w-4 h-4 animate-pulse" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-xs font-mono uppercase text-purple-300 tracking-wider">Free Limit Reached</h4>
                  <p className="text-xs text-slate-400 font-light leading-relaxed">
                    You have utilized all 5 free AI concept generation prompts. Upgrade to **Atelier Pro** to unlock unlimited high-fidelity prompt outputs.
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => alert("Upgrade to Atelier Pro is currently simulated. Unlimited prompts unlocked!")}
                  className="py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-mono text-[11px] font-bold rounded-lg transition-all cursor-pointer shadow-lg shadow-purple-900/20 text-center"
                >
                  Upgrade Now
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setAiPromptsCount(0);
                    localStorage.setItem('oss_cover_ai_prompts_count', '0');
                  }}
                  className="py-2 bg-slate-900 hover:bg-slate-850 border border-slate-800 text-slate-400 hover:text-slate-200 font-mono text-[11px] rounded-lg transition-all cursor-pointer text-center"
                >
                  Reset Demo (0/5)
                </button>
              </div>
              
              <p className="text-[10px] font-mono text-slate-500 leading-normal text-center italic border-t border-slate-900 pt-2.5">
                Note: Custom background uploads and manual canvas layers remain fully free & functional below.
              </p>
            </div>
          ) : (
            <form onSubmit={generateAICover} className="space-y-4">
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-mono text-slate-500 uppercase block">Interactive AI Prompt</label>
                  <span className="text-[10px] font-mono text-slate-500">Prompts: {aiPromptsCount}/5</span>
                </div>
                <textarea 
                  value={aiPrompt}
                  onChange={e => setAiPrompt(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 p-3 rounded-xl text-sm text-slate-300 font-serif leading-normal focus:outline-none focus:border-purple-500/25 h-28 resize-none"
                />
              </div>

              <button 
                type="submit" 
                disabled={generating}
                className="w-full py-2.5 rounded-xl bg-purple-900/40 hover:bg-purple-900/60 border border-purple-800/50 text-sm font-mono text-purple-300 hover:text-white transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${generating ? 'animate-spin' : ''}`} />
                {generating ? 'Summoning Art vectors...' : 'Compile Cover Concept'}
              </button>
            </form>
          )}

          {/* AI Cover Preview Result */}
          <div className="bg-slate-950/40 border border-slate-850 rounded-xl p-4 flex flex-col items-center justify-center min-h-[160px] relative">
            {generating ? (
              <div className="flex flex-col items-center gap-2">
                <div className="w-6 h-6 border-2 border-t-transparent border-purple-500 rounded-full animate-spin" />
                <span className="text-xs font-mono text-slate-500">Decrypting prompt canvas...</span>
              </div>
            ) : aiResult ? (
              <div className="space-y-3 w-full">
                <div className="aspect-video relative rounded-lg overflow-hidden border border-slate-800 shadow-lg">
                  <img src={aiResult} alt="AI Generated book cover" className="w-full h-full object-cover" />
                  <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-purple-950/80 border border-purple-800/40 text-[8px] font-mono text-purple-300 uppercase tracking-widest">SUCCESS</span>
                </div>
                <p className="text-xs font-mono text-slate-500 leading-normal text-center">Co-generated image auto-pushed to the Digital Canvas Workspace.</p>
              </div>
            ) : (
              <div className="text-center text-slate-500 space-y-1.5">
                <Palette className="w-6 h-6 mx-auto text-slate-700" />
                <p className="text-xs font-mono">No concepts generated yet.</p>
              </div>
            )}
          </div>
        </div>

        {/* Center & Right Column: Digital Art Canvas Workspace */}
        <div className="lg:col-span-2 bg-[#0b0c10]/40 border border-slate-800 rounded-2xl p-6 grid md:grid-cols-2 gap-6 relative min-h-[500px]">
          {!user && <AuthOverlay message="Sign in to crop backgrounds, add custom layer typography, and draw covers." />}

          {/* Left panel controllers */}
          <div className="space-y-5 overflow-y-auto max-h-[460px] pr-1">
            <div className="flex justify-between items-center border-b border-slate-900 pb-2">
              <span className="text-sm font-mono uppercase text-purple-400 tracking-wider">Digital Workspace Layers</span>
              <button 
                onClick={exportDesign}
                className="px-3.5 py-1.5 bg-purple-600 hover:bg-purple-500 border-none font-mono text-white text-xs font-bold rounded-lg flex items-center gap-1 cursor-pointer transition-all shadow-md shadow-purple-900/10"
              >
                <Download className="w-3.5 h-3.5" /> Export Artwork
              </button>
            </div>

            {/* Typography layer controller */}
            <div className="space-y-3 bg-[#0d0a15]/30 border border-slate-850 p-4 rounded-xl">
              <div className="flex items-center gap-2 text-slate-400 text-xs">
                <Type className="w-4 h-4 text-purple-400" />
                <span className="font-mono text-xs uppercase font-bold">Typography Cover Layer</span>
              </div>
              <div className="space-y-2">
                <input 
                  type="text" 
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className="w-full bg-slate-950 text-sm border border-slate-800 p-2 rounded-lg focus:outline-none focus:border-purple-500/25 text-slate-200 font-serif"
                  placeholder="Cover Book Title..."
                />
                
                <input 
                  type="text" 
                  value={author}
                  onChange={e => setAuthor(e.target.value)}
                  className="w-full bg-slate-950 text-sm border border-slate-800 p-2 rounded-lg focus:outline-none focus:border-purple-500/25 text-slate-200 font-mono text-xs uppercase"
                  placeholder="Cover Author Name..."
                />
                
                <div className="grid grid-cols-2 gap-2">
                  <select
                    value={titleFont}
                    onChange={e => setTitleFont(e.target.value)}
                    className="bg-slate-950 text-xs border border-slate-800 p-1.5 rounded focus:outline-none text-slate-300"
                  >
                    <option>Cormorant Garamond</option>
                    <option>Inter</option>
                    <option>Georgia</option>
                  </select>
                  <select
                    value={titleColor}
                    onChange={e => setTitleColor(e.target.value)}
                    className="bg-slate-950 text-xs border border-slate-800 p-1.5 rounded focus:outline-none text-slate-300"
                  >
                    <option value="#FCFBF8">Parchment White</option>
                    <option value="#a855f7">Mystical Purple</option>
                    <option value="#d4af37">Medieval Gold</option>
                    <option value="#e2e8f0">Slate Silver</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] font-mono text-slate-500 uppercase">
                    <span>Title font size: {titleSize}px</span>
                  </div>
                  <input 
                    type="range" min="14" max="42" value={titleSize}
                    onChange={e => setTitleSize(Number(e.target.value))}
                    className="w-full h-1 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-purple-500"
                  />
                </div>

                {/* Typography position Y */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] font-mono text-slate-500 uppercase">
                    <span>Title Height Y: {titlePosition.y}%</span>
                  </div>
                  <input 
                    type="range" min="5" max="95" value={titlePosition.y}
                    onChange={e => setTitlePosition({...titlePosition, y: Number(e.target.value)})}
                    className="w-full h-1 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-purple-500"
                  />
                </div>
              </div>
            </div>

            {/* Background Layer controls */}
            <div className="space-y-3 bg-[#0d0a15]/30 border border-slate-850 p-4 rounded-xl">
              <div className="flex items-center gap-2 text-slate-400 text-xs">
                <Layers className="w-4 h-4 text-purple-400" />
                <span className="font-mono text-xs uppercase font-bold">Image Background Layer</span>
              </div>
              <div className="space-y-2">
                <div className="relative">
                  <input 
                    type="file" accept="image/*" 
                    onChange={handleBgUpload}
                    className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                  />
                  <button className="w-full py-2 bg-slate-950 hover:bg-slate-900 border border-slate-800 text-xs font-mono text-slate-400 hover:text-purple-300 rounded-lg flex items-center justify-center gap-1 transition-all cursor-pointer">
                    <Upload className="w-3.5 h-3.5" /> Upload Custom Background
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                  <div className="space-y-1">
                    <span className="text-slate-500 uppercase block text-[10px]">Scale: {bgScale.toFixed(2)}x</span>
                    <input 
                      type="range" min="0.5" max="2.0" step="0.05" value={bgScale}
                      onChange={e => setBgScale(parseFloat(e.target.value))}
                      className="w-full h-1 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-purple-500"
                    />
                  </div>
                  <div className="space-y-1">
                    <span className="text-slate-500 uppercase block text-[10px]">Shift X: {bgPosition.x}px</span>
                    <input 
                      type="range" min="-100" max="100" value={bgPosition.x}
                      onChange={e => setBgPosition({...bgPosition, x: Number(e.target.value)})}
                      className="w-full h-1 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-purple-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Brush layer paint drawer */}
            <div className="space-y-3 bg-[#0d0a15]/30 border border-slate-850 p-4 rounded-xl">
              <div className="flex justify-between items-center text-slate-400 text-xs">
                <div className="flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-purple-400" />
                  <span className="font-mono text-xs uppercase font-bold">Interactive Brush Layer</span>
                </div>
                <button 
                  onClick={clearDrawLayer}
                  className="text-xs font-mono text-red-400 hover:text-red-300 bg-red-950/20 border border-red-900/30 px-2 py-0.5 rounded cursor-pointer"
                >
                  Clear Draw
                </button>
              </div>
              <div className="grid grid-cols-2 gap-3 items-center">
                <div className="space-y-1">
                  <span className="text-[10px] font-mono text-slate-500 uppercase block">Brush Color</span>
                  <div className="flex gap-1.5">
                    {['#a855f7', '#10b981', '#fbbf24', '#f43f5e', '#ffffff'].map(col => (
                      <button
                        key={col}
                        onClick={() => {
                          setBrushColor(col);
                          setIsEraser(false);
                        }}
                        style={{ backgroundColor: col }}
                        className={`w-4 h-4 rounded-full border cursor-pointer transition-all ${
                          brushColor === col && !isEraser ? 'scale-125 border-slate-200' : 'border-slate-800'
                        }`}
                      />
                    ))}
                    <button 
                      onClick={() => setIsEraser(true)}
                      className={`p-0.5 rounded border border-slate-800 cursor-pointer ${isEraser ? 'bg-purple-950 text-purple-300' : 'text-slate-500'}`}
                      title="Eraser"
                    >
                      <Eraser className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] font-mono text-slate-500 uppercase block">Brush Size: {brushSize}px</span>
                  <input 
                    type="range" min="1" max="15" value={brushSize}
                    onChange={e => setBrushSize(Number(e.target.value))}
                    className="w-full h-1 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-purple-500"
                  />
                </div>
              </div>
            </div>

          </div>

          {/* Right panel interactive cover canvas preview */}
          <div className="flex flex-col items-center justify-center p-4 bg-slate-950/50 border border-slate-850 rounded-2xl h-[440px]">
            {/* The Book mockup canvas */}
            <div 
              ref={canvasContainerRef}
              className="relative w-full max-w-[240px] aspect-[2/3] rounded-xl overflow-hidden shadow-2xl border border-slate-800/80 bg-slate-900 flex flex-col justify-between"
            >
              {/* 1. Background image styled layers */}
              <div 
                className="absolute inset-0 pointer-events-none select-none transition-all duration-300"
                style={{
                  backgroundImage: `url(${bgImage})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  transform: `scale(${bgScale}) translate(${bgPosition.x}px, ${bgPosition.y}px)`
                }}
              />

              {/* 2. HTML5 Canvas Paint Brush overlay layer */}
              <canvas
                ref={canvasRef}
                width={240}
                height={360}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                className="absolute inset-0 z-10 w-full h-full cursor-pencil"
              />

              {/* 3. Book Typography Overlay */}
              <div className="absolute inset-x-0 inset-y-8 z-10 pointer-events-none flex flex-col justify-between select-none">
                <div 
                  className="w-full text-center px-4"
                  style={{
                    transform: `translateY(${titlePosition.y - 15}px)`
                  }}
                >
                  <h2 
                    style={{ 
                      fontFamily: titleFont === 'Cormorant Garamond' ? 'Cormorant Garamond' : 'sans-serif',
                      color: titleColor,
                      fontSize: `${titleSize}px`,
                      textShadow: '0 2px 10px rgba(0, 0, 0, 0.9)',
                      letterSpacing: '0.15em'
                    }}
                    className="font-medium text-center uppercase"
                  >
                    {title}
                  </h2>
                  <span className="w-6 h-px bg-white/40 mx-auto mt-1 block" />
                </div>

                {/* Author Name overlay in visual preview */}
                <div className="w-full text-center px-4 mb-4">
                  <span 
                    style={{
                      color: titleColor === '#FCFBF8' ? 'rgba(252,251,248,0.85)' : titleColor,
                      textShadow: '0 1px 4px rgba(0,0,0,0.8)',
                      letterSpacing: '0.2em'
                    }}
                    className="text-[9px] font-mono font-bold uppercase"
                  >
                    {author}
                  </span>
                </div>
              </div>

              {/* Spine/Edge preview element */}
              <div className="absolute left-0 top-0 bottom-0 w-3 bg-gradient-to-r from-black/80 to-transparent z-10" />
            </div>

            <p className="text-xs font-mono text-slate-500 mt-4 uppercase tracking-widest text-center">CANVAS DESIGNER CANNY EDITOR LAYER</p>
          </div>

        </div>

      </div>
    </div>
  );
}
