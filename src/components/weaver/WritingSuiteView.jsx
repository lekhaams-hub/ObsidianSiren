import React, { useState, useEffect, useRef } from 'react';
import { 
  Feather, BookOpen, Upload, Trash2, Plus, AlertCircle, 
  Heading1, Heading2, Bold, Italic, List, ListOrdered, Mic, MicOff, Lock, Image as ImageIcon
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function WritingSuiteView({ bookId = 'default_book' }) {
  const { user, setIsAuthModalOpen } = useAuth();

  // Tab State: 'freeflow' | 'architect'
  const [subTab, setSubTab] = useState('freeflow');

  // Shared Media Vault State
  const [mediaAssets, setMediaAssets] = useState(() => {
    const saved = localStorage.getItem('oss_media_assets');
    return saved ? JSON.parse(saved) : [];
  });

  // Free-Flow Draft State
  const [freeflowText, setFreeflowText] = useState(() => {
    return localStorage.getItem(`oss_freeflow_draft_${bookId}`) || '';
  });

  // Manuscript Chapters (Synchronized Outline) State
  const [chapters, setChapters] = useState(() => {
    const saved = localStorage.getItem(`oss_planning_chapters_${bookId}`);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.length > 0) return parsed;
      } catch (e) {}
    }
    return [
      { id: 'ch1', title: 'Chapter 1', type: 'chapter', content: 'Begin the chapter...' }
    ];
  });

  const [activeChapterId, setActiveChapterId] = useState(() => {
    return chapters[0]?.id || 'ch1';
  });

  const activeChapter = chapters.find(c => c.id === activeChapterId) || chapters[0] || { id: 'ch1', title: 'Chapter 1', type: 'chapter', content: '' };

  const [isDictating, setIsDictating] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  
  const recognitionRef = useRef(null);
  const freeflowTextareaRef = useRef(null);
  const architectTextareaRef = useRef(null);

  const activeChapterIdRef = useRef(activeChapterId);
  useEffect(() => {
    activeChapterIdRef.current = activeChapterId;
  }, [activeChapterId]);

  const activeSubTabRef = useRef(subTab);
  useEffect(() => {
    activeSubTabRef.current = subTab;
  }, [subTab]);

  // Sync states to local storage
  useEffect(() => {
    localStorage.setItem(`oss_freeflow_draft_${bookId}`, freeflowText);
  }, [freeflowText, bookId]);

  useEffect(() => {
    localStorage.setItem(`oss_planning_chapters_${bookId}`, JSON.stringify(chapters));
    localStorage.setItem('oss_chapters', JSON.stringify(chapters));
  }, [chapters, bookId]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage('');
    }, 3500);
  };

  // Initialize SpeechRecognition continuous dictation
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const rec = new SpeechRecognition();
      rec.continuous = true;
      rec.interimResults = false;
      rec.lang = 'en-US';

      rec.onresult = (event) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            transcript += event.results[i][0].transcript;
          }
        }
        if (transcript) {
          const currentTextarea = activeSubTabRef.current === 'freeflow' ? freeflowTextareaRef.current : architectTextareaRef.current;
          const textToInsert = (currentTextarea && currentTextarea.value && !currentTextarea.value.endsWith('\n') && !currentTextarea.value.endsWith(' ') ? ' ' : '') + transcript;
          insertTextAtCursor(textToInsert);
        }
      };

      rec.onerror = (e) => {
        console.error("Speech recognition error:", e);
        if (e.error === 'not-allowed') {
          showToast("Microphone permission denied.");
        } else {
          showToast(`Dictation error: ${e.error}`);
        }
        setIsDictating(false);
      };

      rec.onend = () => {
        setIsDictating(false);
      };

      recognitionRef.current = rec;
    }
  }, []);

  const toggleDictation = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      showToast("Speech Recognition is not supported in this browser.");
      return;
    }

    if (isDictating) {
      recognitionRef.current?.stop();
      setIsDictating(false);
    } else {
      if (!user) {
        setIsAuthModalOpen(true);
        return;
      }
      try {
        recognitionRef.current?.start();
        setIsDictating(true);
      } catch (err) {
        console.error(err);
        showToast("Already listening or audio issue.");
      }
    }
  };

  const insertTextAtCursor = (insertedText) => {
    const isFF = activeSubTabRef.current === 'freeflow';
    const textarea = isFF ? freeflowTextareaRef.current : architectTextareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const before = text.substring(0, start);
    const after = text.substring(end, text.length);

    const updatedText = before + insertedText + after;

    if (isFF) {
      setFreeflowText(updatedText);
    } else {
      setChapters(prev => prev.map(c => c.id === activeChapterIdRef.current ? { ...c, content: updatedText } : c));
    }

    setTimeout(() => {
      textarea.focus();
      const newCursorPos = start + insertedText.length;
      textarea.selectionStart = textarea.selectionEnd = newCursorPos;
    }, 0);
  };

  const applyFormatting = (type) => {
    const isFF = subTab === 'freeflow';
    const textarea = isFF ? freeflowTextareaRef.current : architectTextareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const selectedText = text.substring(start, end);
    let formattedText = '';

    switch (type) {
      case 'h1':
        formattedText = `\n# ${selectedText || 'Heading 1'}\n`;
        break;
      case 'h2':
        formattedText = `\n## ${selectedText || 'Heading 2'}\n`;
        break;
      case 'bold':
        formattedText = `**${selectedText || 'bold text'}**`;
        break;
      case 'italic':
        formattedText = `*${selectedText || 'italic text'}*`;
        break;
      case 'bullet':
        formattedText = `\n- ${selectedText || 'List item'}\n`;
        break;
      case 'number':
        formattedText = `\n1. ${selectedText || 'List item'}\n`;
        break;
      default:
        return;
    }

    const before = text.substring(0, start);
    const after = text.substring(end, text.length);
    const updatedText = before + formattedText + after;

    if (isFF) {
      setFreeflowText(updatedText);
    } else {
      setChapters(prev => prev.map(c => c.id === activeChapterIdRef.current ? { ...c, content: updatedText } : c));
    }

    setTimeout(() => {
      textarea.focus();
      if (selectedText) {
        textarea.selectionStart = start;
        textarea.selectionEnd = start + formattedText.length;
      } else {
        const offset = type === 'bold' ? 2 : type === 'italic' ? 1 : 0;
        textarea.selectionStart = textarea.selectionEnd = start + formattedText.length - offset;
      }
    }, 0);
  };

  // Shared Media Upload Handler
  const handleMediaUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const mockURL = URL.createObjectURL(file);
      const newAsset = { id: `media_${Date.now()}`, name: file.name, url: mockURL };
      const updated = [...mediaAssets, newAsset];
      setMediaAssets(updated);
      localStorage.setItem('oss_media_assets', JSON.stringify(updated));
    }
  };

  const handleInsertAsset = (asset) => {
    // Inserts image markdown at caret position
    insertTextAtCursor(`\n![${asset.name}](${asset.url})\n`);
  };

  const getFreeflowWordCount = () => {
    return freeflowText.split(/\s+/).filter(Boolean).length;
  };

  const handleChapterTitleChange = (id, newTitle) => {
    setChapters(prev => prev.map(c => c.id === id ? { ...c, title: newTitle } : c));
  };

  // Outline control buttons inside Manuscript Architect
  const addFrontMatterItem = () => {
    const id = `fm_${Date.now()}`;
    const newItem = { id, title: 'Front Matter', type: 'front_matter', content: 'Begin the introduction / front matter...' };
    const updated = [...chapters, newItem];
    setChapters(updated);
    setActiveChapterId(id);
  };

  const addChapterItem = () => {
    const count = chapters.filter(c => c.type === 'chapter').length + 1;
    const id = `ch_${Date.now()}`;
    const newItem = { id, title: `Chapter ${count}`, type: 'chapter', content: 'Begin the chapter...' };
    const updated = [...chapters, newItem];
    setChapters(updated);
    setActiveChapterId(id);
  };

  const addBackMatterItem = () => {
    const id = `bm_${Date.now()}`;
    const newItem = { id, title: 'Back Matter', type: 'back_matter', content: 'Begin the epilogue / back matter...' };
    const updated = [...chapters, newItem];
    setChapters(updated);
    setActiveChapterId(id);
  };

  const deleteOutlineItem = (id) => {
    if (chapters.length <= 1) {
      showToast("Cannot delete the only manuscript item.");
      return;
    }
    const filtered = chapters.filter(c => c.id !== id);
    setChapters(filtered);
    if (activeChapterId === id) {
      setActiveChapterId(filtered[0].id);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in text-slate-100 pb-12 relative max-w-7xl mx-auto">
      
      {/* Absolute Toast Status Display */}
      {toastMessage && (
        <div className="fixed top-8 right-8 z-50 flex items-center gap-2 bg-[#0B0F19] border border-purple-500/30 text-purple-200 text-xs px-5 py-3 rounded-xl shadow-2xl animate-fade-in font-mono">
          <AlertCircle className="w-4 h-4 text-purple-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 1. Header Hero Panel */}
      <div className="space-y-1">
        <span className="text-xs font-mono font-bold tracking-[0.2em] text-purple-405 uppercase">Planning & Drafting</span>
        <h1 className="text-5xl font-serif text-white tracking-tight">The Writing Suite</h1>
        <p className="text-sm font-light text-slate-400">
          Free-Flow when the muse strikes. Manuscript Architect when it's time to build the book.
        </p>
      </div>

      {/* 2. Sub-tab segmented pill buttons */}
      <div className="flex bg-[#07090e]/80 border border-slate-900/60 p-0.5 rounded-xl w-max select-none">
        <button
          onClick={() => {
            if (isDictating) toggleDictation();
            setSubTab('freeflow');
          }}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-mono font-bold tracking-widest uppercase transition-all cursor-pointer ${
            subTab === 'freeflow'
              ? 'bg-purple-950/30 border border-purple-500/20 text-purple-300 shadow-md'
              : 'text-slate-500 hover:text-slate-350'
          }`}
        >
          <Feather className="w-3.5 h-3.5" /> Free-Flow Canvas
        </button>
        <button
          onClick={() => {
            if (isDictating) toggleDictation();
            setSubTab('architect');
          }}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-mono font-bold tracking-widest uppercase transition-all cursor-pointer ${
            subTab === 'architect'
              ? 'bg-purple-950/30 border border-purple-500/20 text-purple-300 shadow-md'
              : 'text-slate-500 hover:text-slate-350'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" /> Manuscript Architect
        </button>
      </div>

      {/* 3. SUB-TAB VIEW PORT */}
      {subTab === 'freeflow' ? (
        
        // ==========================================
        // SUB-TAB A: FREE-FLOW CANVAS
        // ==========================================
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          
          {/* Main Freeflow Editor (spans 3 columns) */}
          <div className="lg:col-span-3 bg-[#0B0F19]/25 border border-slate-900/60 p-6 rounded-3xl flex flex-col justify-between min-h-[580px] relative overflow-hidden">
            {!user && (
              <div className="absolute inset-0 z-10 backdrop-blur-[2.5px] bg-[#07090e]/60 flex items-center justify-center select-none">
                <div className="bg-slate-950/95 border border-slate-900 p-6 rounded-2xl text-center max-w-xs shadow-2xl">
                  <div className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center mx-auto mb-4 text-purple-400">
                    <Lock className="w-5 h-5" />
                  </div>
                  <h4 className="text-slate-100 font-serif font-semibold text-lg mb-2">Workspace Locked</h4>
                  <p className="text-xs text-slate-400 leading-relaxed font-light">Sign in to Obsidian Atelier to begin free-flow drafting in your studio vault.</p>
                  <button 
                    onClick={() => setIsAuthModalOpen(true)}
                    className="mt-5 w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-mono font-bold tracking-wider uppercase transition-all cursor-pointer"
                  >
                    Sign In
                  </button>
                </div>
              </div>
            )}

            <div className="space-y-4 flex-1 flex flex-col justify-start">
              <div className="flex justify-between items-center pl-0.5">
                <span className="text-xs font-mono font-bold tracking-widest text-purple-400 uppercase">Free-Flow Canvas</span>
                <span className="text-xs font-mono text-slate-500">{getFreeflowWordCount()} words - autosaved</span>
              </div>
              
              <p className="text-xs font-sans text-slate-500 leading-relaxed mt-1">
                <span className="text-purple-400 font-semibold font-mono">WRAP:</span> Tip: click or drag an image from the Vault. Use the buttons above an image after inserting to re-wrap.
              </p>

              {/* Advanced dictation and formatting editor */}
              <div className="flex flex-col flex-1 border border-slate-900/80 rounded-2xl bg-slate-950/15 overflow-hidden min-h-[420px]">
                <div className="flex justify-between items-center bg-[#07090e]/60 border-b border-slate-900/80 px-4 py-2 gap-3 select-none">
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <button type="button" onClick={() => applyFormatting('h1')} className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-900 transition-colors text-xs font-mono font-bold cursor-pointer" title="Heading 1"><Heading1 className="w-4 h-4" /></button>
                    <button type="button" onClick={() => applyFormatting('h2')} className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-900 transition-colors text-xs font-mono font-bold cursor-pointer" title="Heading 2"><Heading2 className="w-4 h-4" /></button>
                    <div className="w-px h-4 bg-slate-800/80" />
                    <button type="button" onClick={() => applyFormatting('bold')} className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-900 transition-colors cursor-pointer" title="Bold"><Bold className="w-4 h-4" /></button>
                    <button type="button" onClick={() => applyFormatting('italic')} className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-900 transition-colors cursor-pointer" title="Italic"><Italic className="w-4 h-4" /></button>
                    <div className="w-px h-4 bg-slate-800/80" />
                    <button type="button" onClick={() => applyFormatting('bullet')} className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-900 transition-colors cursor-pointer" title="Bullet List"><List className="w-4 h-4" /></button>
                    <button type="button" onClick={() => applyFormatting('number')} className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-900 transition-colors cursor-pointer" title="Numbered List"><ListOrdered className="w-4 h-4" /></button>
                  </div>
                  <div>
                    <button
                      type="button"
                      onClick={toggleDictation}
                      className={`flex items-center gap-1.5 px-4.5 py-1.5 rounded-xl text-xs font-semibold font-mono tracking-wider transition-all select-none duration-300 ${
                        isDictating
                          ? 'bg-red-600/90 text-white animate-pulse shadow-[0_0_12px_rgba(239,68,68,0.4)] cursor-pointer'
                          : 'bg-purple-650 hover:bg-purple-600 text-white shadow-[0_0_10px_rgba(168,85,247,0.15)] cursor-pointer'
                      }`}
                    >
                      {isDictating ? (
                        <>
                          <MicOff className="w-3.5 h-3.5" />
                          Stop
                        </>
                      ) : (
                        <>
                          <Mic className="w-3.5 h-3.5" />
                          Dictate
                        </>
                      )}
                    </button>
                  </div>
                </div>
                
                <div className="p-4 flex-1 flex flex-col overflow-hidden">
                  <textarea
                    ref={freeflowTextareaRef}
                    value={freeflowText}
                    onChange={(e) => setFreeflowText(e.target.value)}
                    className="w-full flex-1 min-h-[360px] bg-transparent text-slate-200 resize-none outline-none font-serif text-lg leading-relaxed placeholder:text-slate-655 placeholder:italic"
                    placeholder="Begin freeflow writing..."
                  />
                </div>
              </div>
            </div>

            {/* Word count footer */}
            <div className="border-t border-slate-950 pt-4 mt-6 text-xs font-mono text-slate-500 tracking-wider uppercase font-bold">
              {getFreeflowWordCount()} words · autosaved to vault
            </div>
          </div>

          {/* Media Vault Sidebar Panel (spans 1 column) */}
          <div className="lg:col-span-1">
            <MediaVault mediaAssets={mediaAssets} onMediaUpload={handleMediaUpload} onInsert={handleInsertAsset} user={user} setIsAuthModalOpen={setIsAuthModalOpen} />
          </div>

        </div>

      ) : (

        // ==========================================
        // SUB-TAB B: MANUSCRIPT ARCHITECT
        // ==========================================
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 animate-fade-in">
          
          {/* 1. LEFT COLUMN: Structured Outline List Panel */}
          <div className="lg:col-span-1 bg-[#0B0F19]/25 border border-slate-900/60 p-4 sm:p-5 rounded-3xl flex flex-col justify-between min-h-[580px] relative select-none">
            {!user && <div className="absolute inset-0 bg-[#07090e]/60 z-10 backdrop-blur-[1px] rounded-3xl" />}

            <div className="space-y-4">
              <span className="text-xs font-mono font-bold tracking-widest text-purple-400 uppercase">Outline</span>
              
              <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
                {chapters.map(ch => (
                  <button
                    key={ch.id}
                    onClick={() => {
                      if (isDictating) toggleDictation();
                      setActiveChapterId(ch.id);
                    }}
                    className={`w-full text-left p-3 rounded-xl border text-sm transition-all flex flex-col gap-1 ${
                      activeChapterId === ch.id
                        ? 'bg-purple-950/20 border-purple-500/20 text-purple-200 shadow-md shadow-purple-950/5'
                        : 'border-transparent text-slate-400 hover:bg-slate-900/30 hover:text-slate-200'
                    }`}
                  >
                    <span className="font-serif truncate font-medium block">{ch.title}</span>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-slate-600">
                      {ch.type === 'front_matter' ? 'Front Matter' : ch.type === 'back_matter' ? 'Back Matter' : 'Chapter Draft'}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Structured action items addition group */}
            <div className="space-y-2.5 pt-4 border-t border-slate-900/60">
              <button 
                onClick={addFrontMatterItem}
                className="w-full py-2 bg-slate-900 hover:bg-slate-850 border border-slate-850 text-xs font-mono text-slate-400 hover:text-purple-300 cursor-pointer flex items-center justify-center gap-1.5 transition-all rounded-xl"
              >
                <Plus className="w-3.5 h-3.5" /> Front Matter
              </button>
              <button 
                onClick={addChapterItem}
                className="w-full py-2.5 bg-purple-950/20 hover:bg-purple-900/30 border border-purple-900/30 text-xs font-mono text-purple-300 hover:text-purple-200 cursor-pointer flex items-center justify-center gap-1.5 transition-all rounded-xl font-bold"
              >
                <Plus className="w-3.5 h-3.5" /> Add Chapter
              </button>
              <button 
                onClick={addBackMatterItem}
                className="w-full py-2 bg-slate-900 hover:bg-slate-850 border border-slate-850 text-xs font-mono text-slate-400 hover:text-purple-300 cursor-pointer flex items-center justify-center gap-1.5 transition-all rounded-xl"
              >
                <Plus className="w-3.5 h-3.5" /> Back Matter
              </button>
            </div>
          </div>

          {/* 2. MIDDLE COLUMN: Active Chapter Editor Pane */}
          <div className="lg:col-span-2 bg-[#0B0F19]/25 border border-slate-900/60 p-6 rounded-3xl flex flex-col justify-between min-h-[580px] relative overflow-hidden">
            {!user && (
              <div className="absolute inset-0 z-10 backdrop-blur-[2.5px] bg-[#07090e]/60 flex items-center justify-center select-none">
                <div className="bg-slate-950/95 border border-slate-900 p-6 rounded-2xl text-center max-w-xs shadow-2xl">
                  <div className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center mx-auto mb-4 text-purple-400">
                    <Lock className="w-5 h-5" />
                  </div>
                  <h4 className="text-slate-100 font-serif font-semibold text-lg mb-2">Atelier Locked</h4>
                  <p className="text-xs text-slate-400 leading-relaxed font-light">Sign in to Obsidian Atelier to begin building your manuscript architect outline.</p>
                  <button 
                    onClick={() => setIsAuthModalOpen(true)}
                    className="mt-5 w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-mono font-bold tracking-wider uppercase transition-all cursor-pointer"
                  >
                    Sign In
                  </button>
                </div>
              </div>
            )}

            <div className="space-y-4 flex-1 flex flex-col justify-start">
              
              {/* Dynamic Header with Trash Action */}
              <div className="flex justify-between items-center border-b border-slate-900/60 pb-3">
                <div className="flex-1 mr-4">
                  <input 
                    type="text" 
                    value={activeChapter.title}
                    onChange={(e) => handleChapterTitleChange(activeChapter.id, e.target.value)}
                    className="bg-transparent font-serif text-2xl font-medium text-slate-100 focus:outline-none border-b border-transparent focus:border-purple-500/20 pb-0.5 w-full"
                    placeholder="Enter item title..."
                  />
                </div>
                <button
                  onClick={() => deleteOutlineItem(activeChapter.id)}
                  className="p-2 rounded-lg bg-slate-950/60 border border-slate-850 hover:border-red-900 text-slate-500 hover:text-red-400 cursor-pointer transition-colors"
                  title="Remove outline item"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <p className="text-xs font-sans text-slate-500 leading-relaxed mt-1">
                <span className="text-purple-400 font-semibold font-mono">WRAP:</span> Tip: click or drag an image from the Vault. Use the buttons above an image after inserting to re-wrap.
              </p>

              {/* Markdown & continuous speech recognition active pane */}
              <div className="flex flex-col flex-1 border border-slate-900/80 rounded-2xl bg-slate-950/15 overflow-hidden min-h-[380px]">
                <div className="flex justify-between items-center bg-[#07090e]/60 border-b border-slate-900/80 px-4 py-2 gap-3 select-none">
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <button type="button" onClick={() => applyFormatting('h1')} className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-900 transition-colors text-xs font-mono font-bold cursor-pointer" title="Heading 1"><Heading1 className="w-4 h-4" /></button>
                    <button type="button" onClick={() => applyFormatting('h2')} className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-900 transition-colors text-xs font-mono font-bold cursor-pointer" title="Heading 2"><Heading2 className="w-4 h-4" /></button>
                    <div className="w-px h-4 bg-slate-800/80" />
                    <button type="button" onClick={() => applyFormatting('bold')} className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-900 transition-colors cursor-pointer" title="Bold"><Bold className="w-4 h-4" /></button>
                    <button type="button" onClick={() => applyFormatting('italic')} className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-900 transition-colors cursor-pointer" title="Italic"><Italic className="w-4 h-4" /></button>
                    <div className="w-px h-4 bg-slate-800/80" />
                    <button type="button" onClick={() => applyFormatting('bullet')} className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-900 transition-colors cursor-pointer" title="Bullet List"><List className="w-4 h-4" /></button>
                    <button type="button" onClick={() => applyFormatting('number')} className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-900 transition-colors cursor-pointer" title="Numbered List"><ListOrdered className="w-4 h-4" /></button>
                  </div>
                  <div>
                    <button
                      type="button"
                      onClick={toggleDictation}
                      className={`flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-semibold font-mono tracking-wider transition-all select-none duration-300 ${
                        isDictating
                          ? 'bg-red-600/90 text-white animate-pulse shadow-[0_0_12px_rgba(239,68,68,0.4)] cursor-pointer'
                          : 'bg-purple-650 hover:bg-purple-600 text-white shadow-[0_0_10px_rgba(168,85,247,0.15)] cursor-pointer'
                      }`}
                    >
                      {isDictating ? (
                        <>
                          <MicOff className="w-3.5 h-3.5" />
                          Stop
                        </>
                      ) : (
                        <>
                          <Mic className="w-3.5 h-3.5" />
                          Dictate
                        </>
                      )}
                    </button>
                  </div>
                </div>

                <div className="p-4 flex-1 flex flex-col overflow-hidden">
                  <textarea
                    ref={architectTextareaRef}
                    value={activeChapter.content}
                    onChange={(e) => {
                      const val = e.target.value;
                      setChapters(prev => prev.map(c => c.id === activeChapter.id ? { ...c, content: val } : c));
                    }}
                    className="w-full flex-1 min-h-[300px] bg-transparent text-slate-200 resize-none outline-none font-serif text-lg leading-relaxed placeholder:text-slate-655"
                    placeholder="Begin the chapter..."
                  />
                </div>
              </div>
            </div>

            {/* Chapter specs footer */}
            <div className="border-t border-slate-950 pt-4 mt-6 text-xs font-mono text-slate-500 tracking-wider uppercase font-bold flex justify-between">
              <span>Words: {activeChapter.content.split(/\s+/).filter(Boolean).length}</span>
              <span>Manuscript Compiler v1.2</span>
            </div>
          </div>

          {/* 3. RIGHT COLUMN: Shared Media Vault sidebar */}
          <div className="lg:col-span-1">
            <MediaVault mediaAssets={mediaAssets} onMediaUpload={handleMediaUpload} onInsert={handleInsertAsset} user={user} setIsAuthModalOpen={setIsAuthModalOpen} />
          </div>

        </div>
      )}

    </div>
  );
}

// Sub-component: Shared Media Vault Sidebar Panel
function MediaVault({ mediaAssets = [], onMediaUpload, onInsert, user, setIsAuthModalOpen }) {
  return (
    <div className="bg-[#0B0F19]/25 border border-slate-900/60 p-4 sm:p-5 rounded-3xl flex flex-col justify-start min-h-[580px] relative">
      {!user && <div className="absolute inset-0 bg-[#07090e]/60 z-10 backdrop-blur-[1.5px] rounded-3xl" />}

      {/* Header with Upload button */}
      <div className="flex justify-between items-center border-b border-slate-900/60 pb-3 mb-4 select-none">
        <div className="flex items-center gap-1.5 text-purple-400">
          <ImageIcon className="w-4 h-4" />
          <span className="text-xs font-mono font-bold tracking-widest uppercase">Media Vault</span>
        </div>
        <div className="relative">
          <input 
            type="file" 
            accept="image/*" 
            onChange={onMediaUpload} 
            className="absolute inset-0 opacity-0 w-full h-full cursor-pointer z-10" 
          />
          <button className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-lg text-xs font-mono text-slate-300 hover:text-white transition-all flex items-center gap-1 cursor-pointer">
            <Upload className="w-3.5 h-3.5" /> Upload
          </button>
        </div>
      </div>

      <div className="space-y-4 flex-1 flex flex-col justify-start">
        <p className="text-xs font-sans text-slate-500 leading-normal select-none">
          Drag onto the page, or click to insert.
        </p>

        {mediaAssets.length > 0 ? (
          <div className="grid grid-cols-2 gap-3 max-h-[440px] overflow-y-auto pr-1">
            {mediaAssets.map((asset) => (
              <div 
                key={asset.id} 
                onClick={() => onInsert(asset)}
                className="group border border-slate-900 hover:border-purple-500/30 rounded-xl overflow-hidden aspect-square bg-slate-950/40 relative cursor-pointer shadow-md select-none"
                title="Click to insert at cursor"
              >
                <img src={asset.url} alt={asset.name} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center p-2 text-center transition-opacity">
                  <span className="text-[10px] font-mono text-purple-250 font-bold uppercase tracking-wider">Insert Art</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="border border-dashed border-slate-850 rounded-2xl p-6 text-center text-slate-600 flex flex-col items-center justify-center space-y-2 select-none flex-1">
            <ImageIcon className="w-7 h-7 text-slate-800" />
            <p className="text-xs font-mono font-medium tracking-wide">No illustrations yet.</p>
            <p className="text-[10px] leading-normal max-w-[130px] mx-auto text-slate-650">Use the Upload button above to populate your chapter assets vault.</p>
          </div>
        )}
      </div>
    </div>
  );
}
