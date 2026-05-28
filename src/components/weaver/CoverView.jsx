import React, { useState, useEffect, useRef } from 'react';
import { Palette, Sparkles, Upload, Download, Type, RefreshCw, Layers, Sliders, Eraser, Lock } from 'lucide-react';
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

  const [aiPrompt, setAiPrompt] = useState(
    'An ancient stone mask submerged in the dark abyss, glowing with purple neon energy currents, oil painting style.'
  );

  const [generating, setGenerating] = useState(false);
  const [aiResult, setAiResult] = useState('');

  const [aiPromptsCount, setAiPromptsCount] = useState(() => {
    const savedData = localStorage.getItem('oss_cover_ai_prompt_data');

    if (!savedData) {
      return 0;
    }

    try {
      const parsed = JSON.parse(savedData);
      const todayKey = getTodayKey();

      if (parsed.date !== todayKey) {
        localStorage.setItem(
          'oss_cover_ai_prompt_data',
          JSON.stringify({
            date: todayKey,
            count: 0,
          })
        );

        return 0;
      }

      return parsed.count || 0;
    } catch {
      return 0;
    }
  });

  const [bgImage, setBgImage] = useState(
    'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=500&q=80'
  );

  const [bgScale, setBgScale] = useState(1.0);
  const [bgPosition, setBgPosition] = useState({ x: 0, y: 0 });

  const [title, setTitle] = useState('OBSIDIAN SIREN');
  const [titleFont, setTitleFont] = useState('Cormorant Garamond');
  const [titleColor, setTitleColor] = useState('#FCFBF8');
  const [titleSize, setTitleSize] = useState(24);
  const [titlePosition, setTitlePosition] = useState({ x: 50, y: 15 });

  const [author, setAuthor] = useState('DR. LEKHAA VANCE');

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
    ctx.globalCompositeOperation = isEraser
      ? 'destination-out'
      : 'source-over';

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
      const randomImg =
        MOCK_AI_IMAGES[
          Math.floor(Math.random() * MOCK_AI_IMAGES.length)
        ];

      setAiResult(randomImg);
      setBgImage(randomImg);

      setAiPromptsCount((prev) => {
        const next = prev + 1;

        localStorage.setItem(
          'oss_cover_ai_prompt_data',
          JSON.stringify({
            date: getTodayKey(),
            count: next,
          })
        );

        return next;
      });

      setGenerating(false);
    }, 1800);
  };

  const handleBgUpload = (e) => {
    const file = e.target.files[0];

    if (file) {
      setBgImage(URL.createObjectURL(file));
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">

      <div>
        <h1 className="text-4xl font-serif text-white tracking-tight">
          Cover Studio
        </h1>

        <p className="text-slate-400 text-sm mt-1">
          AI powered cover generation with daily prompt limits.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">

        <div className="bg-[#0b0c10]/40 border border-slate-800 rounded-2xl p-6 space-y-4">

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-400" />

              <span className="text-sm text-purple-400 uppercase">
                AI Cover Generator
              </span>
            </div>

            <span className="text-xs text-purple-300">
              {aiPromptsCount}/5 Today
            </span>
          </div>

          <form onSubmit={generateAICover} className="space-y-4">

            <textarea
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 p-3 rounded-xl text-sm text-slate-300 h-28 resize-none"
            />

            <button
              type="submit"
              disabled={generating}
              className="w-full py-3 rounded-xl bg-purple-700 hover:bg-purple-600 text-white flex items-center justify-center gap-2"
            >
              <RefreshCw
                className={`w-4 h-4 ${
                  generating ? 'animate-spin' : ''
                }`}
              />

              {generating
                ? 'Generating...'
                : 'Generate AI Cover'}
            </button>

          </form>

          {aiPromptsCount >= 5 && (
            <div className="bg-red-950/20 border border-red-800 rounded-xl p-3 text-red-300 text-sm">
              Daily AI prompt limit reached.
            </div>
          )}

          <div className="bg-slate-950 rounded-xl p-4 min-h-[180px] flex items-center justify-center">

            {generating ? (
              <div className="text-slate-400">
                Generating AI cover...
              </div>
            ) : aiResult ? (
              <img
                src={aiResult}
                alt="AI Cover"
                className="rounded-lg object-cover"
              />
            ) : (
              <div className="text-slate-500 text-sm">
                No AI image generated yet.
              </div>
            )}

          </div>

        </div>

        <div className="lg:col-span-2 bg-[#0b0c10]/40 border border-slate-800 rounded-2xl p-6">

          <div className="space-y-4">

            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Book Title"
              className="w-full bg-slate-950 border border-slate-800 p-3 rounded-xl text-white"
            />

            <input
              type="text"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="Author Name"
              className="w-full bg-slate-950 border border-slate-800 p-3 rounded-xl text-white"
            />

            <input
              type="file"
              accept="image/*"
              onChange={handleBgUpload}
              className="text-slate-300"
            />

            <div className="relative w-full max-w-[260px] aspect-[2/3] rounded-xl overflow-hidden border border-slate-700 mx-auto">

              <div
                className="absolute inset-0"
                style={{
                  backgroundImage: `url(${bgImage})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              />

              <canvas
                ref={canvasRef}
                width={260}
                height={390}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                className="absolute inset-0"
              />

              <div className="absolute inset-0 flex flex-col justify-between p-4">

                <h2
                  style={{
                    color: titleColor,
                    fontSize: `${titleSize}px`,
                  }}
                  className="text-center font-bold uppercase"
                >
                  {title}
                </h2>

                <div className="text-center text-white text-xs uppercase tracking-widest">
                  {author}
                </div>

              </div>

            </div>

            <button
              onClick={clearDrawLayer}
              className="px-4 py-2 bg-red-700 hover:bg-red-600 rounded-lg text-white"
            >
              Clear Drawing
            </button>

          </div>

        </div>

      </div>

    </div>
  );
}