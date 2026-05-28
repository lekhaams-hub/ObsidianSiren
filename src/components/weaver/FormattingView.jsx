import React, { useState, useEffect } from 'react';
import { 
  FileText, Eye, Upload, Sparkles, X, ChevronRight, ChevronDown, 
  Search, BookOpen, Layers, Type, Columns, Check, RefreshCw, Download
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const GENRE_PRESETS = [
  {
    id: 'novel',
    name: 'Epic Fantasy',
    subtitle: 'The Tome',
    font: 'Playfair Display',
    fontFamily: '"Cormorant Garamond", ui-serif, Georgia, serif',
    bgColor: 'bg-[#FCFBF8]',
    textColor: 'text-[#1c1a17]',
    spacing: 'leading-relaxed',
    desc: 'Playfair Display • Parchment • Drop-cap • Flourish',
    safetyMargin: '18px',
    details: 'Centred serif, Flourish caps, 1.35 lines',
    accentColor: 'text-[#5b21b6]',
    borderStyle: 'border-amber-900/10'
  },
  {
    id: 'thriller',
    name: 'Modern Thriller',
    subtitle: 'The Dossier',
    font: 'Montserrat',
    fontFamily: '"Montserrat", sans-serif',
    bgColor: 'bg-[#ffffff]',
    textColor: 'text-[#0f172a]',
    spacing: 'leading-snug',
    desc: 'Montserrat • Clean white • All-caps • Tight 1.2',
    safetyMargin: '12px',
    details: 'Sans-serif all-caps headers, tight tracking, bright print',
    accentColor: 'text-[#6b21a8]',
    borderStyle: 'border-slate-200'
  },
  {
    id: 'poetry',
    name: 'Classic Poetry',
    subtitle: 'The Muse',
    font: 'Libre Baskerville',
    fontFamily: 'ui-serif, Georgia, serif',
    bgColor: 'bg-[#ffffff]',
    textColor: 'text-[#222222]',
    spacing: 'leading-loose',
    desc: 'Libre Baskerville • Centered • Wide margins',
    safetyMargin: '24px',
    details: 'Left-aligned stanzas, delicate light italics',
    accentColor: 'text-purple-950',
    borderStyle: 'border-slate-200'
  },
  {
    id: 'litfiction',
    name: 'Literary Fiction',
    subtitle: 'The Minimalist',
    font: 'EB Garamond',
    fontFamily: '"Cormorant Garamond", ui-serif, Georgia, serif',
    bgColor: 'bg-[#fafafa]',
    textColor: 'text-[#1e1e1e]',
    spacing: 'leading-relaxed',
    desc: 'EB Garamond • Small-caps • 1.5 line',
    safetyMargin: '16px',
    details: 'Classical margins, perfect legibility',
    accentColor: 'text-slate-800',
    borderStyle: 'border-slate-200'
  },
  {
    id: 'romance',
    name: 'Dark Romance',
    subtitle: 'The Nocturne',
    font: 'Crimson Text',
    fontFamily: 'ui-serif, Georgia, serif',
    bgColor: 'bg-[#FFFBFB]',
    textColor: 'text-[#2e151b]',
    spacing: 'leading-relaxed',
    desc: 'Crimson Text • Warm cream • Script titles • 1.6 line',
    safetyMargin: '18px',
    details: 'Soft rose tint, script headers, romantic spacing',
    accentColor: 'text-[#be185d]',
    borderStyle: 'border-[#fce7f3]'
  },
  {
    id: 'academic',
    name: 'Academic / Non-Fiction',
    subtitle: 'The Authority',
    font: 'Lora',
    fontFamily: 'ui-serif, Georgia, serif',
    bgColor: 'bg-[#ffffff]',
    textColor: 'text-[#111111]',
    spacing: 'leading-normal',
    desc: 'Lora • Numbered headers • Justified • Sidebar',
    safetyMargin: '14px',
    details: 'Clean margins, fully justified paragraphs',
    accentColor: 'text-slate-900',
    borderStyle: 'border-slate-300'
  }
];

const GLOSSARY_DATA = [
  { id: 'bleed', term: 'Bleed', def: 'Extending illustrations or background colors beyond the physical trim edge to ensure no white borders remain after the book pages are binded and cut.' },
  { id: 'trim', term: 'Trim Size', def: 'The final physical dimensions of the printed book page (e.g., Trade 6" x 9" or Pocket 5" x 8") after cutting.' },
  { id: 'gutter', term: 'Gutter', def: 'The extra inner margin allowance added to the binding edge of book pages to prevent important text from being swallowed by the book spine.' },
  { id: 'leading', term: 'Leading (rhymes with wedding)', def: 'The vertical distance between the baselines of consecutive lines of text, controlling line spacing and readability.' },
  { id: 'dropcap', term: 'Drop Cap', def: 'A giant initial letter at the beginning of a chapter or paragraph, descending into the lines of text below for a classical premium aesthetic.' },
  { id: 'recto', term: 'Recto & Verso', def: 'Recto refers to the right-hand page of an open book (always odd numbered), while Verso refers to the left-hand page (always even numbered).' },
  { id: 'widows', term: 'Widows & Orphans', def: 'An orphan is a single line left behind at the bottom of a page. A widow is a single line pushed to the top of a new page alone.' },
  { id: 'justification', term: 'Justification', def: 'Aligning text evenly along both the left and right margins, commonly utilized in standard professional novels.' },
  { id: 'head', term: 'Running Head', def: 'The header text printed at the top of book pages, typically showing the author name on left pages and book title on right pages.' },
  { id: 'folio', term: 'Folio', def: 'The technical term for page numbers printed at either the top or bottom of pages.' }
];

const getFormattingStateKey = (bookId) => `oss_formatting_state_${bookId}`;

const getSavedFormattingState = (bookId) => {
  try {
    const raw = localStorage.getItem(getFormattingStateKey(bookId));
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch (error) {
    console.error('Failed to load formatting state:', error);
    return {};
  }
};

export default function FormattingView({ bookId = 'default_book' }) {
  const { user, setIsAuthModalOpen } = useAuth();
  const savedState = getSavedFormattingState(bookId);

  // Custom states
  const [trimSize, setTrimSize] = useState(savedState.trimSize || 'Trade — 6 x 9"');
  const [bookTitle, setBookTitle] = useState(savedState.bookTitle || 'Your Book');
  const [authorName, setAuthorName] = useState(savedState.authorName || 'Your Name');
  const [activePresetId, setActivePresetId] = useState(savedState.activePresetId || 'novel');
  const [manuscriptText, setManuscriptText] = useState(
    savedState.manuscriptText ||
    `Chapter One\n\nThe Whisper of the Tide\n\nThe harbor was silent that morning. Mira pressed her palm to the cold stone, and the sea answered her with a hush that was not wind. Somewhere beneath the obsidian water, the siren was singing a name she had not heard in twenty years.`
  );

  const [manuscriptSourceTab, setManuscriptSourceTab] = useState(savedState.manuscriptSourceTab || 'import'); // 'import' | 'upload'
  const [importSuccess, setImportSuccess] = useState(false);
  const [isManualModalOpen, setIsManualModalOpen] = useState(false);
  const [assistedFileZoneAttached, setAssistedFileZoneAttached] = useState(savedState.assistedFileZoneAttached || false);
  const [manualRequestStatus, setManualRequestStatus] = useState(''); // 'sending', 'success'
  const [uploadedFileName, setUploadedFileName] = useState(savedState.uploadedFileName || '');

  // Chapter lists states for pick list
  const [writingChapters, setWritingChapters] = useState([]);
  const [uploadedChapters, setUploadedChapters] = useState(Array.isArray(savedState.uploadedChapters) ? savedState.uploadedChapters : []);
  const [selectedChapterId, setSelectedChapterId] = useState(savedState.selectedChapterId || '');

  // Glossary Search
  const [searchQuery, setSearchQuery] = useState(savedState.searchQuery || '');
  const [expandedGlossaryItems, setExpandedGlossaryItems] = useState(savedState.expandedGlossaryItems || {
    'bleed': true // Open first item by default
  });

  const activePreset = GENRE_PRESETS.find(p => p.id === activePresetId) || GENRE_PRESETS[0];

  useEffect(() => {
    const payload = {
      trimSize,
      bookTitle,
      authorName,
      activePresetId,
      manuscriptText,
      manuscriptSourceTab,
      assistedFileZoneAttached,
      uploadedFileName,
      uploadedChapters,
      selectedChapterId,
      searchQuery,
      expandedGlossaryItems,
    };

    try {
      localStorage.setItem(getFormattingStateKey(bookId), JSON.stringify(payload));
    } catch (error) {
      console.error('Failed to save formatting state:', error);
    }
  }, [
    bookId,
    trimSize,
    bookTitle,
    authorName,
    activePresetId,
    manuscriptText,
    manuscriptSourceTab,
    assistedFileZoneAttached,
    uploadedFileName,
    uploadedChapters,
    selectedChapterId,
    searchQuery,
    expandedGlossaryItems,
  ]);
  // Helper to load Scriptorium chapters from local storage
  const loadWritingSuiteChapters = () => {
    try {
      const stored = localStorage.getItem(`oss_planning_chapters_${bookId}`) || localStorage.getItem('oss_chapters');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && parsed.length > 0) {
          setWritingChapters(parsed);
          return parsed;
        }
      }
    } catch (e) {
      console.error(e);
    }
    const defaultChapters = [
      { id: 'ch1', title: 'Chapter 1: The Singing Deep', content: 'The sea was a restless inkwell tonight. Dr. Lekhaa Vance stared into the dark obsidian waters, listening to the soft humming that vibrated through the deck. It was the same pitch as the sculpture sitting inside her trunk, wrapped in heavy velvet. The ocean spray felt needle-sharp, yet she could not force herself to go below deck.' },
      { id: 'ch2', title: 'Chapter 2: The Whispered Ink', content: 'When the ink dried on the parchment, it formed symbols she had never learned. Yet, her calloused fingers continued to move across the mechanical keys, translating the deep-sea frequencies. "Return to the trench," the letters seemed to say, glowing with a faint purple bioluminescence in the dim cabin.' }
    ];
    setWritingChapters(defaultChapters);
    return defaultChapters;
  };

  // Sync chapters on mount
  useEffect(() => {
  const chapters = loadWritingSuiteChapters();

  const preferredChapterId =
    savedState.selectedChapterId || chapters[0]?.id || '';

  if (preferredChapterId) {
    setSelectedChapterId(preferredChapterId);
  }

  // Prevent overwrite of saved manuscript after refresh
  const existingSavedState = localStorage.getItem(
    getFormattingStateKey(bookId)
  );

  if (!existingSavedState && chapters.length > 0) {
    const found =
      chapters.find(c => c.id === preferredChapterId) || chapters[0];

    setManuscriptText(`${found.title}\n\n${found.content}`);
  }
}, [bookId]);

  // Load from Scriptorium
  const handleImportFromWritingSuite = () => {
    const chapters = loadWritingSuiteChapters();
    if (chapters.length > 0) {
      const found = chapters.find(c => c.id === selectedChapterId) || chapters[0];
      setSelectedChapterId(found.id);
      setManuscriptSourceTab('import');
      setManuscriptText(`${found.title}\n\n${found.content}`);
      setImportSuccess(true);
      setTimeout(() => setImportSuccess(false), 2000);
    }
  };

  // Selection handlers
  const handleSelectWritingChapter = (chapterId) => {
    setSelectedChapterId(chapterId);
    const found = writingChapters.find(c => c.id === chapterId);
    if (found) {
      setManuscriptText(`${found.title}\n\n${found.content}`);
    }
  };

  const handleSelectUploadedChapter = (chapterId) => {
    setSelectedChapterId(chapterId);
    const found = uploadedChapters.find(c => c.id === chapterId);
    if (found) {
      setManuscriptText(`${found.title}\n\n${found.content}`);
    }
  };

  // Simulated & Actual File Upload
  const handleDocxOrTxtUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setManuscriptSourceTab('upload');
    setUploadedFileName(file.name);
    setAssistedFileZoneAttached(true);

    if (file.name.endsWith('.txt')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target.result;
        const txtChapters = [
          { id: 'txt_ch1', title: file.name, content: text }
        ];
        setUploadedChapters(txtChapters);
        setSelectedChapterId('txt_ch1');
        setManuscriptText(`${file.name}\n\n${text}`);
        setImportSuccess(true);
        setTimeout(() => setImportSuccess(false), 2000);
      };
      reader.readAsText(file);
    } else {
      // It's a docx or other document. Simulate extracting a few chapters.
      const docxChapters = [
        {
          id: 'docx_ch1',
          title: `Chapter I: The Siren's Call (${file.name})`,
          content: `The salvage crew had anchored three miles off Siren Island. Vance pulled her volumetric goggles down, watching the purple sonar readouts hum inside the dark cabin. Beneath them, something ancient was waiting to speak.`
        },
        {
          id: 'docx_ch2',
          title: `Chapter II: Sonic Gravity Wells (${file.name})`,
          content: `Vortex alerts flashed red across the digital telemetry system. The sea rose in towering, glassy spires, defying the wind's direction. Lekhaa felt the metal handle of the vault vibrate, answering the chime of the ocean.`
        },
        {
          id: 'docx_ch3',
          title: `Chapter III: Echoes of the Abyss (${file.name})`,
          content: `Inside the airlock, the water pressure dropped to zero. Vance removed her helmet, stepping onto the dry basalt floor of a temple that should have been flooded for millions of years. A single obsidian sculpture sat in the center of the dais, glowing with a soft, pulsed violet light.`
        }
      ];
      setUploadedChapters(docxChapters);
      setSelectedChapterId('docx_ch1');
      setManuscriptText(`${docxChapters[0].title}\n\n${docxChapters[0].content}`);
      setImportSuccess(true);
      setTimeout(() => setImportSuccess(false), 2000);
    }
  };

  // Toggle Glossary Definition
  const toggleGlossary = (id) => {
    setExpandedGlossaryItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Submit manual formatting request
  const handleManualRequestSubmit = (e) => {
    e.preventDefault();
    if (!user) {
      setIsAuthModalOpen(true);
      return;
    }
    setManualRequestStatus('sending');
    setTimeout(() => {
      setManualRequestStatus('success');
      setAssistedFileZoneAttached(false);
      setTimeout(() => {
        setIsManualModalOpen(false);
        setManualRequestStatus('');
      }, 2500);
    }, 1500);
  };

  // Filter glossary based on search
  const filteredGlossary = GLOSSARY_DATA.filter(item => 
    item.term.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.def.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Split paragraphs for preview styling
  const paragraphs = manuscriptText.trim().split(/\n\n+/);
  const firstParagraph = paragraphs[0] || '';
  const otherParagraphs = paragraphs.slice(1);
  const firstLetter = firstParagraph.charAt(0);
  const remainingFirstParagraph = firstParagraph.slice(1);

  // Return dynamic trim margins helper description
  const getTrimDescription = () => {
    switch (trimSize) {
      case 'Trade — 6 x 9"':
        return 'The most popular choice for novels and non-fiction.';
      case 'Pocket Book — 5 x 8"':
        return 'Perfect for pocket paperbacks and classic pulp fiction.';
      case 'Hardcover — 8 x 10"':
        return 'Optimal choice for art books, photography, or children\'s illustrated editions.';
      case 'Digest — 5.5 x 8.5"':
        return 'Comfortable and standard format for general literature.';
      default:
        return 'Standard paperback trim size.';
    }
  };

  const downloadFormattedManuscript = () => {
    if (!manuscriptText.trim()) return;
    
    const compiledText = `=====================================================
BOOK TITLE: ${bookTitle.toUpperCase()}
AUTHOR: ${authorName.toUpperCase()}
TRIM SIZE: ${trimSize}
GENRE PRESET STYLE: ${activePreset.name} (${activePreset.subtitle})
=====================================================

${manuscriptText}
`;
    
    const element = document.createElement("a");
    const file = new Blob([compiledText], { type: 'text/plain;charset=utf-8' });
    element.href = URL.createObjectURL(file);
    element.download = `${bookTitle.replace(/\s+/g, '_')}_formatted_manuscript.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="space-y-8 animate-fade-in text-slate-100 font-serif">
      {/* Title Header */}
      <div>
        <h3 className="text-sm font-mono tracking-[0.3em] text-purple-400 uppercase">Window II</h3>
        <h1 className="text-4xl font-serif text-white tracking-tight">The Pro-Formatting Suite</h1>
        <p className="text-slate-400 text-base font-light mt-1 font-sans">
          Industry-standard trim sizes, six genre presets, automatic gutter safety, and a 3-way style comparison — your manuscript, transformed in real time.
        </p>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* ==========================================
            LEFT SIDEBAR: FORMATTING CONTROLS
            ========================================== */}
        <div className="lg:col-span-1 space-y-6 font-sans">
          
          {/* Choose Trim Card */}
          <div className="bg-[#0c0d12]/40 border border-slate-900/80 rounded-2xl p-5 space-y-4">
            <h4 className="text-sm font-mono text-slate-400 uppercase tracking-widest block border-b border-slate-900 pb-2">Choose your trim size</h4>
            <div className="relative">
              <select 
                value={trimSize}
                onChange={e => setTrimSize(e.target.value)}
                className="w-full bg-[#050608]/90 border border-slate-900 focus:border-purple-950/60 rounded-xl p-3.5 text-base text-slate-200 focus:outline-none font-serif cursor-pointer"
              >
                <option>Trade — 6 x 9"</option>
                <option>Pocket Book — 5 x 8"</option>
                <option>Hardcover — 8 x 10"</option>
                <option>Digest — 5.5 x 8.5"</option>
              </select>
            </div>
            <p className="text-sm text-slate-500 font-light leading-relaxed italic">
              {getTrimDescription()}
            </p>
          </div>

          {/* Book & Author Card */}
          <div className="bg-[#0c0d12]/40 border border-slate-900/80 rounded-2xl p-5 space-y-4">
            <h4 className="text-sm font-mono text-slate-400 uppercase tracking-widest block border-b border-slate-900 pb-2">Book & Author</h4>
            <div className="space-y-3">
              <input 
                type="text" 
                value={bookTitle}
                onChange={e => setBookTitle(e.target.value)}
                placeholder="Your Book"
                className="w-full bg-[#050608]/90 border border-slate-900 focus:border-purple-950/60 rounded-xl p-3 text-base text-slate-200 focus:outline-none placeholder-slate-700 font-serif"
              />
              <input 
                type="text" 
                value={authorName}
                onChange={e => setAuthorName(e.target.value)}
                placeholder="Your Name"
                className="w-full bg-[#050608]/90 border border-slate-900/90 focus:border-purple-950/60 rounded-xl p-3 text-base text-slate-200 focus:outline-none placeholder-slate-700 font-serif"
              />
            </div>
            <p className="text-xs text-slate-500 font-mono leading-normal">
              Auto-header: <span className="text-purple-300 font-semibold">{authorName}</span> on left pages • <span className="text-purple-300 font-semibold">{bookTitle}</span> on right pages.
            </p>
          </div>

          {/* Gutter Safety Alert Box */}
          <div className="bg-purple-950/5 border border-purple-900/30 p-4.5 rounded-2xl flex items-start gap-3 shadow-[inset_0_1px_1px_rgba(168,85,247,0.05)]">
            <div className="w-5.5 h-5.5 rounded-full bg-purple-950/40 border border-purple-500/20 flex items-center justify-center text-purple-400 shrink-0 text-xs font-mono">
              i
            </div>
            <div className="space-y-1">
              <h5 className="text-sm font-semibold text-purple-200">Gutter Safety (auto)</h5>
              <p className="text-xs text-slate-405 leading-relaxed font-light">
                The inside margin is automatically increased to <span className="text-purple-300 font-mono font-bold">18px</span> for this trim — preventing your text from disappearing into the book spine.
              </p>
            </div>
          </div>

          {/* Genre Presets Sidebar Card */}
          <div className="space-y-3">
            <h4 className="text-sm font-mono text-slate-400 uppercase tracking-widest block pl-1">Genre Presets</h4>
            <div className="space-y-2">
              {GENRE_PRESETS.map(preset => (
                <button
                  key={preset.id}
                  onClick={() => setActivePresetId(preset.id)}
                  className={`w-full text-left p-4 rounded-xl border transition-all flex flex-col justify-between cursor-pointer ${
                    activePresetId === preset.id
                      ? 'bg-[#0d091b]/80 border-purple-500/50 text-purple-200 shadow-[0_0_15px_rgba(168,85,247,0.12)]'
                      : 'border-slate-900/60 bg-[#06070a]/40 text-slate-550 hover:border-slate-800/40 hover:bg-[#06070a]/60 hover:text-slate-300'
                  }`}
                >
                  <div className="flex justify-between items-start w-full">
                    <h5 className="font-serif font-semibold text-base">{preset.name}</h5>
                    <span className="text-xs font-mono text-slate-500 uppercase tracking-wider">{preset.subtitle}</span>
                  </div>
                  <p className="text-xs font-mono text-purple-400/80 mt-1.5 leading-relaxed tracking-wide">
                    {preset.desc}
                  </p>
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* ==========================================
            RIGHT COLUMN: MANUSCRIPT EDITOR & PREVIEW
            ========================================== */}
        <div className="lg:col-span-3 space-y-6">
          
          {/* Source Tabs & Textarea */}
          <div className="bg-[#0c0d12]/40 border border-slate-900/80 rounded-2xl p-5 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-900 pb-3">
              {/* Import/Upload Toggles */}
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setManuscriptSourceTab('import');
                    handleImportFromWritingSuite();
                  }}
                  className={`px-4 py-2 rounded-xl text-sm font-mono tracking-wider transition-all cursor-pointer ${
                    manuscriptSourceTab === 'import'
                      ? 'bg-purple-950/40 text-purple-300 border border-purple-500/20 shadow-md'
                      : 'text-slate-500 hover:text-slate-355 bg-transparent border border-transparent'
                  }`}
                >
                  Import from Writing Suite
                </button>
                <div className="relative">
                  <input 
                    type="file" 
                    id="docx_upload_btn"
                    accept=".docx,.txt"
                    onChange={handleDocxOrTxtUpload}
                    className="absolute inset-0 opacity-0 w-full h-full cursor-pointer cursor-pointer"
                  />
                  <button
                    onClick={() => setManuscriptSourceTab('upload')}
                    className={`px-4 py-2 rounded-xl text-sm font-mono tracking-wider transition-all cursor-pointer ${
                      manuscriptSourceTab === 'upload'
                        ? 'bg-purple-950/40 text-purple-300 border border-purple-500/20 shadow-md'
                        : 'text-slate-500 hover:text-slate-355 bg-transparent border border-transparent'
                    }`}
                  >
                    Upload Document (.docx / .txt)
                  </button>
                </div>
              </div>

              {/* Status indicators */}
              {importSuccess && (
                <span className="text-sm font-mono text-purple-400 animate-pulse flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> Manuscript Loaded
                </span>
              )}
            </div>

            {/* Pick which chapter they want */}
            {manuscriptSourceTab === 'import' && writingChapters.length > 0 && (
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-[#050608]/40 border border-slate-900/60 rounded-xl p-3.5 animate-fade-in">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-purple-400 shrink-0" />
                  <span className="text-sm font-mono text-slate-350">Pick chapter from first window:</span>
                </div>
                <select
                  value={selectedChapterId}
                  onChange={(e) => handleSelectWritingChapter(e.target.value)}
                  className="w-full sm:w-64 bg-[#090b0f] border border-slate-800 rounded-lg p-2 text-sm font-serif text-slate-200 focus:outline-none focus:border-purple-500/30 cursor-pointer"
                >
                  {writingChapters.map((ch) => (
                    <option key={ch.id} value={ch.id}>
                      {ch.title}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {manuscriptSourceTab === 'upload' && (
              uploadedChapters.length > 0 ? (
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-[#050608]/40 border border-slate-900/60 rounded-xl p-3.5 animate-fade-in">
                  <div className="flex items-center gap-2">
                    <Upload className="w-4 h-4 text-purple-400 shrink-0" />
                    <span className="text-sm font-mono text-slate-350">Pick uploaded chapter to see formatted:</span>
                  </div>
                  <select
                    value={selectedChapterId}
                    onChange={(e) => handleSelectUploadedChapter(e.target.value)}
                    className="w-full sm:w-64 bg-[#090b0f] border border-slate-800 rounded-lg p-2 text-sm font-serif text-slate-200 focus:outline-none focus:border-purple-500/30 cursor-pointer"
                  >
                    {uploadedChapters.map((ch) => (
                      <option key={ch.id} value={ch.id}>
                        {ch.title}
                      </option>
                    ))}
                  </select>
                </div>
              ) : (
                <div className="bg-[#050608]/20 border border-slate-900/60 rounded-xl p-4 text-center">
                  <p className="text-sm font-mono text-slate-500">
                    No document uploaded yet. Click <span className="text-purple-450 font-bold">"Upload Document"</span> to select a file!
                  </p>
                </div>
              )
            )}

            {/* Manuscript Editor Area */}
            <div className="relative group">
              <textarea 
                value={manuscriptText}
                onChange={e => setManuscriptText(e.target.value)}
                placeholder="Type or paste your manuscript content..."
                className="w-full bg-[#050608]/90 border border-slate-900/90 focus:border-purple-950/60 rounded-xl p-5 text-base text-slate-200 focus:outline-none placeholder-slate-700 min-h-[160px] max-h-[300px] font-sans scrollbar-thin resize-none"
              />
              
              {/* Compare Styles Action */}
              <div className="absolute bottom-3 right-3">
                <button
                  onClick={() => {
                    // Triggers a beautiful preset rotation simulator
                    const presetsKeys = GENRE_PRESETS.map(p => p.id);
                    const currIndex = presetsKeys.indexOf(activePresetId);
                    const nextIndex = (currIndex + 1) % presetsKeys.length;
                    setActivePresetId(presetsKeys[nextIndex]);
                  }}
                  className="px-4 py-2 rounded-xl bg-[#090b0f] border border-slate-800 hover:border-purple-500/40 text-sm font-mono text-slate-300 hover:text-purple-300 transition-all flex items-center gap-1.5 cursor-pointer shadow-lg"
                >
                  <Columns className="w-3.5 h-3.5 text-purple-400" /> Compare Styles
                </button>
              </div>
            </div>
          </div>

          {/* ==========================================
              3D BOOK MOCKUP PRINT PREVIEW
              ========================================== */}
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pl-1 pb-1 select-none">
              <div className="space-y-0.5">
                <span className="text-sm font-mono uppercase text-slate-500 tracking-wider">3D Flip-Book Preview</span>
                <p className="text-[10px] font-mono text-slate-400 uppercase tracking-widest leading-none mt-0.5">
                  Style: {activePreset.name} — {activePreset.subtitle} ({trimSize})
                </p>
              </div>

              <button
                onClick={downloadFormattedManuscript}
                className="px-4 py-2.5 bg-purple-650 hover:bg-purple-600 text-xs font-mono font-bold text-white uppercase rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-md shadow-purple-900/10 border-none"
              >
                <Download className="w-3.5 h-3.5" /> Download Formatted Manuscript
              </button>
            </div>

            {/* Physical Open Book mockup */}
            <div className="bg-[#120d18]/20 border border-slate-900/80 rounded-3xl p-8 flex justify-center items-center shadow-inner relative overflow-hidden min-h-[480px]">
              
              {/* Spine shadow depth simulation */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-950/5 to-transparent pointer-events-none z-10" />

              {/* Physical paper open pages container */}
              <div className={`w-full max-w-2xl ${activePreset.bgColor} border ${activePreset.borderStyle} rounded-2xl p-8 flex flex-col justify-between text-slate-900 shadow-2xl relative select-none min-h-[380px] transition-all duration-500`}>
                
                {/* Book header (Running Head) */}
                <div className="text-xs font-mono text-slate-400 border-b border-slate-100/80 pb-2 flex justify-between tracking-wider">
                  <span className="uppercase">{authorName || 'Your Name'}</span>
                  <span className="uppercase">{bookTitle || 'Your Book'}</span>
                </div>

                {/* Page Title element inside page based on preset */}
                <div className="text-center py-6">
                  <h4 
                    style={{
                      fontFamily: activePreset.fontFamily
                    }}
                    className={`text-xl sm:text-2xl ${activePreset.textColor} font-serif tracking-wide transition-all duration-300 uppercase`}
                  >
                    {bookTitle || 'Your Book'}
                  </h4>
                  <p className="text-xs font-mono text-slate-400 tracking-widest mt-1.5 uppercase font-light">
                    {authorName || 'Your Name'}
                  </p>
                  <div className="w-6 h-px bg-slate-200 mx-auto mt-2" />
                </div>

                {/* Body paragraph content showing formatted text with Drop Cap */}
                <div className="flex-1 py-4 font-serif">
                  {manuscriptText.trim() ? (
                    <div className={`${activePreset.textColor} ${activePreset.spacing} text-[15px] sm:text-base text-justify leading-relaxed transition-all duration-300`}>
                      {/* Formatted first paragraph with big Drop Cap */}
                      <p className="mb-4">
                        <span className="float-left text-5xl font-bold font-serif mr-3 mt-1.5 text-purple-600/90 leading-[0.75]">
                          {firstLetter}
                        </span>
                        {remainingFirstParagraph}
                      </p>

                      {/* Other paragraphs */}
                      {otherParagraphs.map((para, idx) => (
                        <p key={idx} className="mb-4 text-justify font-serif">
                          {para}
                        </p>
                      ))}
                    </div>
                  ) : (
                    <p className="text-slate-400 italic text-center font-sans py-12 text-sm">No manuscript text written yet. Use the import toggle above to fetch chapters!</p>
                  )}
                </div>

                {/* Book Footer (Folio/Page Number) */}
                <div className="text-center text-xs font-mono text-slate-400 border-t border-slate-100/80 pt-2 tracking-widest mt-6 flex justify-between items-center uppercase">
                  <span>{activePreset.name}</span>
                  <span className="font-bold text-slate-600">01</span>
                  <span>{activePreset.subtitle}</span>
                </div>

              </div>
            </div>
          </div>

          {/* ==========================================
              EXPERT ASSISTED FORMATTING ZONE
              ========================================== */}
          <div className="bg-[#0c0d12]/40 border border-slate-900/80 rounded-2xl p-6 space-y-5">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-purple-950/30 border border-purple-500/20 flex items-center justify-center text-purple-400 shrink-0">
                <FileText className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h4 className="text-lg font-serif text-white font-semibold">Expert Assisted Formatting</h4>
                <p className="text-sm text-slate-400 leading-relaxed font-sans">
                  Hand your manuscript to a human typographer. We'll match your selected trim (<span className="text-purple-300 font-semibold">{trimSize}</span>) and <span className="text-purple-300 font-semibold">{activePreset.name} — {activePreset.subtitle}</span> style.
                </p>
              </div>
            </div>

            {/* Dotted Upload Dropzone inside card */}
            <div className="relative border border-dashed border-slate-900 bg-[#050608]/80 hover:border-purple-500/30 rounded-xl p-8 text-center cursor-pointer transition-all">
              <input
                type="file"
                accept=".docx,.pdf,.rtf,.txt"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    setAssistedFileZoneAttached(true);
                    setUploadedFileName(file.name);
                  }
                }}
                className="absolute inset-0 opacity-0 w-full h-full cursor-pointer z-10"
              />
              <div className="flex flex-col items-center justify-center space-y-2">
                <Upload className="w-5 h-5 text-purple-400" />
                <span className="text-sm font-mono text-slate-400">
                  {assistedFileZoneAttached ? `Attached: ${uploadedFileName || 'manuscript'} ✅` : 'Upload manuscript for assisted formatting'}
                </span>
              </div>
            </div>

            {/* Request button positioned at bottom-left */}
            <div className="flex justify-start">
              <button
                onClick={() => {
                  if (!user) {
                    setIsAuthModalOpen(true);
                  } else {
                    setIsManualModalOpen(true);
                  }
                }}
                className="px-5 py-3 bg-gradient-to-r from-purple-700 to-indigo-700 hover:from-purple-600 hover:to-indigo-600 text-sm font-semibold font-mono tracking-wider text-white uppercase rounded-xl transition-all shadow-[0_0_15px_rgba(147,51,234,0.25)] cursor-pointer"
              >
                Request Manual Formatting
              </button>
            </div>
          </div>

          {/* ==========================================
              GLOSSARY SECTION
              ========================================== */}
          <div className="bg-[#0b0c10]/40 border border-slate-900/80 rounded-2xl p-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-900 pb-4">
              <div>
                <span className="text-sm font-mono uppercase text-purple-400 tracking-wider">Reference</span>
                <h4 className="text-xl font-serif text-white font-semibold mt-0.5">Formatting Glossary</h4>
                <p className="text-sm font-sans text-slate-400 mt-0.5">Speak the language of professional book design.</p>
              </div>
              
              {/* Search Bar */}
              <div className="relative w-full sm:w-64">
                <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input 
                  type="text"
                  placeholder="Search terms..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full bg-[#050608]/90 border border-[#11131c] focus:border-purple-950/60 rounded-xl pl-9 pr-4 py-2.5 text-sm font-sans text-slate-350 focus:outline-none placeholder-slate-700"
                />
              </div>
            </div>

            {/* Collapsible Definitions list */}
            <div className="space-y-2">
              {filteredGlossary.length > 0 ? (
                filteredGlossary.map(item => {
                  const isExpanded = expandedGlossaryItems[item.id];
                  return (
                    <div 
                      key={item.id} 
                      className="border border-slate-900/60 rounded-xl bg-slate-950/10 overflow-hidden"
                    >
                      <button
                        type="button"
                        onClick={() => toggleGlossary(item.id)}
                        className="w-full flex justify-between items-center p-4 hover:bg-slate-900/20 transition-colors text-left cursor-pointer"
                      >
                        <span className="font-serif text-base font-semibold text-purple-300/90">{item.term}</span>
                        {isExpanded ? (
                          <ChevronDown className="w-4 h-4 text-slate-500" />
                        ) : (
                          <ChevronRight className="w-4 h-4 text-slate-500" />
                        )}
                      </button>
                      
                      {/* Collapsible Content */}
                      {isExpanded && (
                        <div className="p-4 pt-0 border-t border-slate-900/30 text-sm font-sans text-slate-400 leading-relaxed bg-[#050608]/20">
                          {item.def}
                        </div>
                      )}
                    </div>
                  );
                })
              ) : (
                <p className="text-sm text-slate-600 font-mono italic text-center py-6">No matching glossary terms found.</p>
              )}
            </div>

            {/* Confused Banner */}
            <div className="bg-[#0d091b]/20 border border-slate-900/90 rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4 mt-6">
              <div className="flex items-center gap-3 text-slate-300">
                <Sparkles className="w-4 h-4 text-purple-400 shrink-0" />
                <p className="text-sm font-sans font-light">
                  Still confused by the jargon? <span className="text-purple-300 font-medium italic">Let the Siren handle it.</span>
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  if (!user) setIsAuthModalOpen(true);
                  else setIsManualModalOpen(true);
                }}
                className="px-4 py-2 border border-slate-800 hover:border-purple-500/40 text-sm font-mono text-slate-200 hover:text-purple-300 bg-transparent rounded-lg transition-all cursor-pointer"
              >
                Request Assisted Formatting
              </button>
            </div>

          </div>

        </div>

      </div>

      {/* ==========================================
          MODAL: MANUAL MANUSCRIPT UPLOAD & REQUEST
          ========================================== */}
      {isManualModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="relative w-full max-w-lg p-8 bg-[#0c0c11] border border-slate-900 rounded-2xl shadow-2xl space-y-6">
            <button 
              onClick={() => {
                setIsManualModalOpen(false);
                setManualRequestStatus('');
              }}
              className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors cursor-pointer p-1 rounded-md hover:bg-slate-900"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3 border-b border-slate-900 pb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-indigo-900 flex items-center justify-center text-purple-200 shadow-lg shrink-0">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xl font-serif text-white font-semibold">Assisted Publishing Formatting</h3>
                <p className="text-xs font-sans text-slate-400">Let our formatting specialists manually sculpt your custom manuscript.</p>
              </div>
            </div>

            {manualRequestStatus === 'success' ? (
              <div className="text-center py-8 space-y-4">
                <div className="w-12 h-12 rounded-full bg-purple-950/50 border border-purple-500/20 flex items-center justify-center mx-auto text-purple-400">
                  <Check className="w-5 h-5 animate-pulse" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-serif text-white">Request Transmitted</h3>
                  <p className="text-sm font-sans text-slate-400 max-w-sm mx-auto leading-relaxed">
                    Your manuscript and formatting specs have been securely transmitted to the Obsidian Siren Atelier. We will email you your invoice and blueprint outlines shortly.
                  </p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleManualRequestSubmit} className="space-y-4 font-sans text-slate-300">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <span className="text-xs font-mono text-slate-500 uppercase block">Selected Style</span>
                    <input 
                      type="text" 
                      value={`${activePreset.name} — ${activePreset.subtitle}`}
                      disabled 
                      className="w-full bg-[#050608]/90 border border-slate-900 p-2.5 rounded-lg text-sm text-slate-400 font-serif"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <span className="text-xs font-mono text-slate-500 uppercase block">Selected Trim</span>
                    <input 
                      type="text" 
                      value={trimSize}
                      disabled 
                      className="w-full bg-[#050608]/90 border border-slate-900 p-2.5 rounded-lg text-sm text-slate-400 font-serif"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <span className="text-xs font-mono text-slate-500 uppercase block">Upload manuscript (.docx / .pdf / .rtf)</span>
                  <div className="border border-dashed border-slate-900 bg-[#050608]/80 rounded-xl p-6 text-center cursor-pointer relative hover:border-purple-500/20 transition-all">
                    <input 
                      type="file" 
                      accept=".docx,.pdf,.rtf"
                      onChange={() => setAssistedFileZoneAttached(true)}
                      className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                    />
                    <div className="flex flex-col items-center justify-center space-y-2 text-slate-500">
                      <Upload className="w-5 h-5 text-purple-400" />
                      <span className="text-sm font-mono">
                        {assistedFileZoneAttached ? 'Manuscript Attached ✅' : 'Upload manuscript for assisted formatting'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <span className="text-xs font-mono text-slate-500 uppercase block">Special Formatting Notes / Instructions</span>
                  <textarea 
                    placeholder="Describe specific spacing preferences, headers, fonts, drop-cap wishes, or margin specifications..." 
                    className="w-full bg-[#050608]/90 border border-slate-900 p-3 rounded-lg focus:outline-none focus:border-purple-500/25 text-sm text-slate-200 h-20 resize-none font-serif"
                  />
                </div>

                <button 
                  type="submit"
                  disabled={manualRequestStatus === 'sending'}
                  className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-sm font-bold font-mono tracking-wider uppercase transition-colors cursor-pointer"
                >
                  {manualRequestStatus === 'sending' ? 'Transmitting...' : 'Request Manual Formatting'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
