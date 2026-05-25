import React, { useState, useEffect, useRef } from 'react';
import { 
  Feather, Sparkles, Network, Globe, Map, List, GitCommit, FileText, BookOpen, 
  Plus, Trash2, Edit3, Lock, Award, Upload, Download, Type, MapPin, Eye,
  BarChart2, Image as ImageIcon, ChevronRight, Check
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function PlanningView() {
  const { user, setIsAuthModalOpen } = useAuth();
  const [activeTab, setActiveTab] = useState('characters');

  // Shared States (persisted in local state to showcase interactive planning)
  const [characters, setCharacters] = useState([
    { id: '1', name: 'Dr. Lekhaa Vance', age: '32', gender: 'Female', species: 'Human', role: 'Protagonist', traits: 'Obsessive, brilliant, cautious', backstory: 'Discovered a submerged temple off the coast of Siren Island in 2024.', customFields: [] },
    { id: '2', name: 'The Siren', age: 'Unknown', gender: 'Female', species: 'Siren (Mystical)', role: 'Antagonist', traits: 'Alluring, deceptive, powerful', backstory: 'Ancient entity bound to the obsidian sculpture in the depths.', customFields: [] }
  ]);
  const [activeCharId, setActiveCharId] = useState('1');

  // New character inputs
  const [newChar, setNewChar] = useState({ name: '', age: '', gender: '', species: '', role: '', traits: '', backstory: '' });
  const [customFieldLabel, setCustomFieldLabel] = useState('');
  const [customFieldValue, setCustomFieldValue] = useState('');

  // 2. Relationship Whiteboard States
  const [connections, setConnections] = useState([
    { from: '1', to: '2', label: 'Obsessed With' }
  ]);
  const [nodePositions, setNodePositions] = useState({
    '1': { x: 100, y: 150 },
    '2': { x: 450, y: 150 }
  });
  const [draggingNodeId, setDraggingNodeId] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const whiteboardRef = useRef(null);
  const [newConn, setNewConn] = useState({ from: '', to: '', label: '' });

  // 3. World Building Lab States
  const [worldData, setWorldData] = useState({
    timePeriod: 'Neo-Maritime Victorian Era (Circa 1894)',
    geography: 'Siren Island Basin—a volatile archipelago of black sand and obsidian spires.',
    culture: 'Isolated deep-sea salvagers obsessed with salvaging ancient sunken technologies.',
    politics: 'Rule of the Salvage Syndicate; meritocracy based on deep-sea diving depths.',
    magicRules: 'Gravity distortions induced by sonic frequency modulations.',
    economy: 'Trade of glowing marine pearls and fossilized deep sea relics.',
    beliefs: 'Worship of the Siren of the Depths, believed to hum the original song of creation.'
  });

  // 4. Fantasy Map States
  const [mapLabels, setMapLabels] = useState([
    { id: 'l1', text: 'Obsidian Spire', x: 280, y: 120, fontSize: 18, isItalic: true },
    { id: 'l2', text: 'Whispering Cliffs', x: 80, y: 220, fontSize: 16, isItalic: false },
    { id: 'l3', text: 'Siren Island Basin', x: 420, y: 280, fontSize: 22, isItalic: true }
  ]);
  const [mapPins, setMapPins] = useState([
    { id: 'p1', x: 300, y: 150, title: 'Obsidian Ruins' },
    { id: 'p2', x: 120, y: 240, title: 'Wreckage of the Hesperus' }
  ]);
  const [newLabelText, setNewLabelText] = useState('');
  const [newPinTitle, setNewPinTitle] = useState('');
  const [draggingLabelId, setDraggingLabelId] = useState(null);
  const [draggingPinId, setDraggingPinId] = useState(null);
  const mapCanvasRef = useRef(null);

  // 5. Movable Plot Points States
  const [plots, setPlots] = useState([
    { id: 'p_1', stage: 'Introduction', title: 'The Archeological Dig', desc: 'Lekhaa uncovers the obsidian mask inside a submerged temple.' },
    { id: 'p_2', stage: 'Conflict', title: 'The Siren\'s Echo', desc: 'The mask begins to hum, causing sleep deprivation and visual auditory ghosts.' },
    { id: 'p_3', stage: 'Climax', title: 'The Descent into Obsidian', desc: 'Lekhaa dives alone into the deepest trench to place the mask back.' },
    { id: 'p_4', stage: 'Twist', title: 'The Siren is Vance', desc: 'Lekhaa realizes she is the re-incarnation of the entity that forged it.' },
    { id: 'p_5', stage: 'Resolution', title: 'The Eternal Hum', desc: 'The voice stops, but the ink in her journal permanently glows purple.' }
  ]);
  const [draggedPlotIndex, setDraggedPlotIndex] = useState(null);

  // 6. Conflict & Arcs
  const [conflictData, setConflictData] = useState({
    mainProblem: 'The obsidian siren statue is whispering forbidden secrets, slowly deteriorating Lekhaa\'s grip on reality.',
    stakes: 'Lekhaa\'s sanity and the lives of the ship\'s crew if she succumbs to the voice\'s commands.',
    externalConflict: 'The crew wants to auction the artifact, unaware that moving it from the basin triggers sonic gravity wells.',
    internalConflict: 'Lekhaa\'s deep scientific curiosity to decode the signal vs her instinctual terror of the sea\'s voice.',
    arcStart: 'Obsessive, purely scientific skeptic who trusts only physical empirical data.',
    arcTurningPoint: 'Hearing the siren song speak in her deceased mother\'s voice.',
    arcEnd: 'Accepts the supernatural truth, choosing to sink the salvage ship to protect the secret.'
  });

  // 7. Synopsis States
  const [synopsis, setSynopsis] = useState({
    title: 'The Obsidian Siren',
    premise: 'A deep-sea archaeologist uncovers an ancient obsidian mask that whispers stories of the future, drawing her crew into a localized gravitational vortex.',
    theme: 'The perilous boundary between scientific obsession and mystical revelation.'
  });
  const [aiSynopsis, setAiSynopsis] = useState('');
  const [generatingSynopsis, setGeneratingSynopsis] = useState(false);

  // 8. Writing Suite States
  const [chapters, setChapters] = useState([
    { id: 'ch1', title: 'Chapter 1: The Singing Deep', content: 'The sea was a restless inkwell tonight. Dr. Lekhaa Vance stared into the dark obsidian waters, listening to the soft humming that vibrated through the deck. It was the same pitch as the sculpture sitting inside her trunk, wrapped in heavy velvet. The ocean spray felt needle-sharp, yet she could not force herself to go below deck.' },
    { id: 'ch2', title: 'Chapter 2: The Whispered Ink', content: 'When the ink dried on the parchment, it formed symbols she had never learned. Yet, her calloused fingers continued to move across the mechanical keys, translating the deep-sea frequencies. "Return to the trench," the letters seemed to say, glowing with a faint purple bioluminescence in the dim cabin.' }
  ]);
  const [activeChapterId, setActiveChapterId] = useState('ch1');
  const [dailyGoal, setDailyGoal] = useState(500);
  const [chapterIllustrations, setChapterIllustrations] = useState({
    'ch1': 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=400&q=80',
    'ch2': ''
  });

  const activeChapter = chapters.find(c => c.id === activeChapterId) || chapters[0];

  const handleChapterContentChange = (val) => {
    setChapters(chapters.map(c => c.id === activeChapterId ? { ...c, content: val } : c));
  };

  const handleChapterTitleChange = (val) => {
    setChapters(chapters.map(c => c.id === activeChapterId ? { ...c, title: val } : c));
  };

  // Inline Illustration Upload simulator
  const handleIllustrationUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const mockURL = URL.createObjectURL(file);
      setChapterIllustrations({
        ...chapterIllustrations,
        [activeChapterId]: mockURL
      });
    }
  };

  // Reusable Auth Overlay Block
  const AuthOverlay = ({ message = "Sign in to start writing and save your progress." }) => (
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

  // Tab definitions
  const tabs = [
    { id: 'characters', label: 'Characters', icon: Feather },
    { id: 'relationships', label: 'Relationship Canvas', icon: Network },
    { id: 'world', label: 'World Building', icon: Globe },
    { id: 'map', label: 'Fantasy Map', icon: Map },
    { id: 'plots', label: 'Plot Points', icon: List },
    { id: 'arcs', label: 'Conflict & Arcs', icon: GitCommit },
    { id: 'synopsis', label: 'Synopsis', icon: FileText },
    { id: 'suite', label: 'Writing Suite', icon: BookOpen }
  ];

  // Drag and Drop Plot Reordering Logic
  const handleDragStart = (idx) => {
    if (!user) return;
    setDraggedPlotIndex(idx);
  };

  const handleDragOver = (e, idx) => {
    e.preventDefault();
    if (draggedPlotIndex === null || draggedPlotIndex === idx) return;
    const items = [...plots];
    const draggedItem = items[draggedPlotIndex];
    items.splice(draggedPlotIndex, 1);
    items.splice(idx, 0, draggedItem);
    setDraggedPlotIndex(idx);
    setPlots(items);
  };

  const handleDragEnd = () => {
    setDraggedPlotIndex(null);
  };

  // Whiteboard Canvas Mouse Drag Handlers
  const handleWhiteboardMouseDown = (e, nodeId) => {
    if (!user) return;
    setDraggingNodeId(nodeId);
    const rect = whiteboardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - nodePositions[nodeId].x;
    const y = e.clientY - rect.top - nodePositions[nodeId].y;
    setDragOffset({ x, y });
  };

  const handleWhiteboardMouseMove = (e) => {
    if (draggingNodeId === null) return;
    const rect = whiteboardRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(rect.width - 150, e.clientX - rect.left - dragOffset.x));
    const y = Math.max(0, Math.min(rect.height - 80, e.clientY - rect.top - dragOffset.y));
    setNodePositions({
      ...nodePositions,
      [draggingNodeId]: { x, y }
    });
  };

  const handleWhiteboardMouseUp = () => {
    setDraggingNodeId(null);
  };

  // Add character helper
  const addCharacter = (e) => {
    e.preventDefault();
    if (!newChar.name) return;
    const id = Date.now().toString();
    const added = { ...newChar, id, customFields: [] };
    setCharacters([...characters, added]);
    setNodePositions({ ...nodePositions, [id]: { x: Math.random() * 300 + 50, y: Math.random() * 200 + 50 } });
    setActiveCharId(id);
    setNewChar({ name: '', age: '', gender: '', species: '', role: '', traits: '', backstory: '' });
  };

  // Add custom character field
  const addCustomField = () => {
    if (!customFieldLabel || !customFieldValue) return;
    setCharacters(characters.map(c => {
      if (c.id === activeCharId) {
        return {
          ...c,
          customFields: [...(c.customFields || []), { label: customFieldLabel, value: customFieldValue }]
        };
      }
      return c;
    }));
    setCustomFieldLabel('');
    setCustomFieldValue('');
  };

  // Add whiteboard relationship helper
  const addConnection = (e) => {
    e.preventDefault();
    if (!newConn.from || !newConn.to || !newConn.label) return;
    setConnections([...connections, newConn]);
    setNewConn({ from: '', to: '', label: '' });
  };

  // Map Label Mouse Drag Handlers
  const handleMapLabelMouseDown = (e, labelId) => {
    if (!user) return;
    setDraggingLabelId(labelId);
    const rect = mapCanvasRef.current.getBoundingClientRect();
    const label = mapLabels.find(l => l.id === labelId);
    const offsetX = e.clientX - rect.left - label.x;
    const offsetY = e.clientY - rect.top - label.y;
    setDragOffset({ x: offsetX, y: offsetY });
  };

  const handleMapPinMouseDown = (e, pinId) => {
    if (!user) return;
    setDraggingPinId(pinId);
    const rect = mapCanvasRef.current.getBoundingClientRect();
    const pin = mapPins.find(p => p.id === pinId);
    const offsetX = e.clientX - rect.left - pin.x;
    const offsetY = e.clientY - rect.top - pin.y;
    setDragOffset({ x: offsetX, y: offsetY });
  };

  const handleMapCanvasMouseMove = (e) => {
    const rect = mapCanvasRef.current.getBoundingClientRect();
    if (draggingLabelId !== null) {
      const x = Math.max(0, Math.min(rect.width - 80, e.clientX - rect.left - dragOffset.x));
      const y = Math.max(0, Math.min(rect.height - 20, e.clientY - rect.top - dragOffset.y));
      setMapLabels(mapLabels.map(l => l.id === draggingLabelId ? { ...l, x, y } : l));
    }
    if (draggingPinId !== null) {
      const x = Math.max(0, Math.min(rect.width - 20, e.clientX - rect.left - dragOffset.x));
      const y = Math.max(0, Math.min(rect.height - 20, e.clientY - rect.top - dragOffset.y));
      setMapPins(mapPins.map(p => p.id === draggingPinId ? { ...p, x, y } : p));
    }
  };

  const handleMapCanvasMouseUp = () => {
    setDraggingLabelId(null);
    setDraggingPinId(null);
  };

  // Map Add Label
  const addMapLabel = (e) => {
    e.preventDefault();
    if (!newLabelText) return;
    setMapLabels([...mapLabels, { id: 'l_' + Date.now(), text: newLabelText, x: 100, y: 100, fontSize: 16, isItalic: false }]);
    setNewLabelText('');
  };

  // Map Add Pin
  const addMapPin = (e) => {
    e.preventDefault();
    if (!newPinTitle) return;
    setMapPins([...mapPins, { id: 'p_' + Date.now(), x: 150, y: 150, title: newPinTitle }]);
    setNewPinTitle('');
  };

  // Export Map Simulator
  const exportMap = () => {
    const printContent = `
      =========================================
               OBSIDIAN SIREN CARTOGRAPHY
      =========================================
      Map Layers Compiled:
      
      📌 pins:
      ${mapPins.map(p => `  - [Pin] ${p.title} (x: ${Math.round(p.x)}, y: ${Math.round(p.y)})`).join('\n')}
      
      ✍️ Labels:
      ${mapLabels.map(l => `  - [Label] "${l.text}" (x: ${Math.round(l.x)}, y: ${Math.round(l.y)})`).join('\n')}
      
      Map layout vector sequence finalized. Printable ready.
    `;
    const element = document.createElement("a");
    const file = new Blob([printContent], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `${synopsis.title.replace(/\s+/g, '_')}_fantasy_map.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  // AI Synopsis generator simulator
  const generatePremiseSynopsis = () => {
    setGeneratingSynopsis(true);
    setAiSynopsis('');
    setTimeout(() => {
      setGeneratingSynopsis(false);
      setAiSynopsis(
        `Against the black cliffs of Siren Island, archaeologist Dr. Lekhaa Vance uncovers an archaic obsidian mask buried within an unrecorded volcanic rift. As she pulls the mask from the deep sea ruins, a localized gravitational vibration captures her crew, warping gravity waves and making time run asynchronously across the salvage ship.\n\n` +
        `Driven by an escalating curiosity, Vance connects her writing apparatus to the frequency humming inside the obsidian mask. Soon, the machine types of its own accord, outputting warning vectors and mapping the tragic timeline of a cosmic siren that once inhabited the abyss. Yet her crew, maddened by the anomalous gravity wells, plans to dismantle the mask for international auction.\n\n` +
        `To salvage the minds of her crew and block a temporal crisis, Vance must navigate a high-stakes conspiracy, dive back into the singing trench alone, and decide whether to release the siren's complete frequency—even if it means sinking her own vessel and silencing her own history.`
      );
    }, 1800);
  };

  // Word & Character count metrics
  const wordCount = activeChapter.content ? activeChapter.content.split(/\s+/).filter(w => w.length > 0).length : 0;
  const charCount = activeChapter.content ? activeChapter.content.length : 0;
  const progressPercent = Math.min(100, Math.round((wordCount / dailyGoal) * 100));
  const activeChar = characters.find(c => c.id === activeCharId) || characters[0];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Title Header */}
      <div>
        <h3 className="text-xs font-mono tracking-[0.3em] text-purple-400 uppercase">Window I</h3>
        <h1 className="text-4xl font-serif text-white tracking-tight">Planning & Drafting</h1>
        <p className="text-slate-400 text-sm font-light mt-1">
          From deep character psyche mappings to whiteboard schemas, visual maps, and typewriter drafts—organize your complete creative vault.
        </p>
      </div>

      {/* Sub-Navigation Tabs */}
      <div className="flex gap-2 border-b border-slate-800/80 overflow-x-auto pb-px scrollbar-none">
        {tabs.map(tab => {
          const TabIcon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 border-b-2 text-sm font-mono tracking-wider uppercase transition-all whitespace-nowrap cursor-pointer ${
                activeTab === tab.id 
                  ? 'border-purple-500 text-purple-300 bg-purple-950/10' 
                  : 'border-transparent text-slate-500 hover:text-slate-300 hover:bg-slate-900/40'
              }`}
            >
              <TabIcon className="w-3.5 h-3.5" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Workspace Body */}
      <div className="bg-[#0b0c10]/40 border border-slate-800 rounded-2xl min-h-[500px] overflow-hidden relative">
        
        {/* ==========================================================================
            TAB: CHARACTERS
            ========================================================================== */}
        {activeTab === 'characters' && (
          <div className="grid md:grid-cols-3 min-h-[500px]">
            {/* Left Sidebar List */}
            <div className="border-r border-slate-800 p-4 space-y-4 bg-slate-950/40">
              <div className="flex justify-between items-center">
                <span className="text-sm font-mono uppercase text-purple-400 tracking-wider">Cast of Characters</span>
              </div>
              <div className="space-y-2">
                {characters.map(char => (
                  <button
                    key={char.id}
                    onClick={() => setActiveCharId(char.id)}
                    className={`w-full text-left p-3 rounded-xl border transition-all flex justify-between items-center group ${
                      activeCharId === char.id
                        ? 'bg-purple-950/40 border-purple-500/30 text-purple-200 shadow-md'
                        : 'border-slate-800/60 bg-slate-900/20 text-slate-400 hover:bg-slate-900/60'
                    }`}
                  >
                    <div>
                      <h4 className="font-serif font-medium">{char.name}</h4>
                      <p className="text-xs font-mono text-slate-500">{char.role} • {char.species}</p>
                    </div>
                    {characters.length > 1 && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setCharacters(characters.filter(c => c.id !== char.id));
                          if (activeCharId === char.id) setActiveCharId(characters.find(c => c.id !== char.id).id);
                        }}
                        className="text-slate-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all cursor-pointer p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </button>
                ))}
              </div>

              {/* Add Character Form */}
              <form onSubmit={addCharacter} className="space-y-3 pt-3 border-t border-slate-800 relative">
                {!user && <AuthOverlay message="Sign in to add and manage your custom characters." />}
                <h5 className="text-xs font-mono uppercase text-slate-500">Add Character Node</h5>
                <input 
                  type="text" 
                  placeholder="Full Name..." 
                  value={newChar.name}
                  onChange={e => setNewChar({...newChar, name: e.target.value})}
                  className="w-full bg-slate-950 text-sm border border-slate-800 p-2.5 rounded-lg focus:outline-none focus:border-purple-500/30 text-slate-200"
                />
                <div className="grid grid-cols-2 gap-2">
                  <input 
                    type="text" 
                    placeholder="Role (e.g. Protagonist)..." 
                    value={newChar.role}
                    onChange={e => setNewChar({...newChar, role: e.target.value})}
                    className="w-full bg-slate-950 text-xs border border-slate-800 p-2 rounded-lg focus:outline-none focus:border-purple-500/30 text-slate-200"
                  />
                  <input 
                    type="text" 
                    placeholder="Species (e.g. Human)..." 
                    value={newChar.species}
                    onChange={e => setNewChar({...newChar, species: e.target.value})}
                    className="w-full bg-slate-950 text-xs border border-slate-800 p-2 rounded-lg focus:outline-none focus:border-purple-500/30 text-slate-200"
                  />
                </div>
                <button type="submit" className="w-full py-2 rounded-lg bg-purple-900/20 hover:bg-purple-900/40 border border-purple-800/40 text-sm font-mono text-purple-300 transition-colors flex items-center justify-center gap-1 cursor-pointer">
                  <Plus className="w-3.5 h-3.5" /> Append Character
                </button>
              </form>
            </div>

            {/* Character Detail Panel */}
            <div className="col-span-2 p-6 space-y-6 relative overflow-y-auto max-h-[500px]">
              {!user && <AuthOverlay message="Sign in to edit character details and add custom properties." />}
              
              <div className="flex justify-between items-start border-b border-slate-800 pb-4">
                <div>
                  <h2 className="text-3xl font-serif text-white">{activeChar?.name || 'Character Workspace'}</h2>
                  <p className="text-xs text-purple-400 font-mono tracking-wider uppercase mt-1">Core Blueprint Identity</p>
                </div>
              </div>

              {/* Core Attributes */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-slate-900/40 border border-slate-800/50 p-3.5 rounded-xl space-y-1">
                  <span className="text-xs font-mono text-slate-500 uppercase">Age</span>
                  <input 
                    type="text" 
                    value={activeChar?.age || ''} 
                    onChange={e => setCharacters(characters.map(c => c.id === activeCharId ? { ...c, age: e.target.value } : c))}
                    className="bg-transparent font-serif text-slate-200 focus:outline-none w-full"
                  />
                </div>
                <div className="bg-slate-900/40 border border-slate-800/50 p-3.5 rounded-xl space-y-1">
                  <span className="text-xs font-mono text-slate-500 uppercase">Gender</span>
                  <input 
                    type="text" 
                    value={activeChar?.gender || ''} 
                    onChange={e => setCharacters(characters.map(c => c.id === activeCharId ? { ...c, gender: e.target.value } : c))}
                    className="bg-transparent font-serif text-slate-200 focus:outline-none w-full"
                  />
                </div>
                <div className="bg-slate-900/40 border border-slate-800/50 p-3.5 rounded-xl space-y-1">
                  <span className="text-xs font-mono text-slate-500 uppercase">Species</span>
                  <input 
                    type="text" 
                    value={activeChar?.species || ''} 
                    onChange={e => setCharacters(characters.map(c => c.id === activeCharId ? { ...c, species: e.target.value } : c))}
                    className="bg-transparent font-serif text-slate-200 focus:outline-none w-full"
                  />
                </div>
                <div className="bg-slate-900/40 border border-slate-800/50 p-3.5 rounded-xl space-y-1">
                  <span className="text-xs font-mono text-slate-500 uppercase">Role</span>
                  <input 
                    type="text" 
                    value={activeChar?.role || ''} 
                    onChange={e => setCharacters(characters.map(c => c.id === activeCharId ? { ...c, role: e.target.value } : c))}
                    className="bg-transparent font-serif text-slate-200 focus:outline-none w-full"
                  />
                </div>
              </div>

              {/* Psychology Description & Backstory */}
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-slate-500 uppercase tracking-wider">Personality & Key Psychology Traits</label>
                  <textarea 
                    value={activeChar?.traits || ''} 
                    onChange={e => setCharacters(characters.map(c => c.id === activeCharId ? { ...c, traits: e.target.value } : c))}
                    className="w-full bg-slate-900/40 border border-slate-800/80 p-3.5 rounded-xl text-sm text-slate-300 font-serif leading-relaxed focus:outline-none focus:border-purple-500/20 h-20 resize-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-slate-500 uppercase tracking-wider">Backstory & Key Life Events</label>
                  <textarea 
                    value={activeChar?.backstory || ''} 
                    onChange={e => setCharacters(characters.map(c => c.id === activeCharId ? { ...c, backstory: e.target.value } : c))}
                    className="w-full bg-slate-900/40 border border-slate-800/80 p-3.5 rounded-xl text-sm text-slate-300 font-serif leading-relaxed focus:outline-none focus:border-purple-500/20 h-24 resize-none"
                  />
                </div>
              </div>

              {/* Custom Character Fields */}
              <div className="space-y-3 pt-3 border-t border-slate-800/80">
                <label className="text-xs font-mono text-slate-500 uppercase tracking-wider">Custom Character Fields</label>
                
                {/* Existing custom fields */}
                <div className="grid sm:grid-cols-2 gap-4">
                  {activeChar?.customFields && activeChar.customFields.map((field, fIdx) => (
                    <div key={fIdx} className="bg-slate-900/30 border border-slate-800/60 p-3.5 rounded-xl flex justify-between items-start">
                      <div>
                        <span className="text-xs font-mono text-purple-400 uppercase tracking-wider block">{field.label}</span>
                        <p className="font-serif text-sm text-slate-200 mt-1">{field.value}</p>
                      </div>
                      <button 
                        onClick={() => {
                          setCharacters(characters.map(c => {
                            if (c.id === activeCharId) {
                              return {
                                ...c,
                                customFields: c.customFields.filter((_, idx) => idx !== fIdx)
                              };
                            }
                            return c;
                          }));
                        }}
                        className="text-slate-600 hover:text-red-400 cursor-pointer p-0.5"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Add Custom Field Inputs */}
                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <input 
                    type="text" 
                    placeholder="Field Label (e.g. Fears)..." 
                    value={customFieldLabel}
                    onChange={e => setCustomFieldLabel(e.target.value)}
                    className="bg-slate-950 text-sm border border-slate-800 p-2.5 rounded-lg focus:outline-none focus:border-purple-500/30 text-slate-200 flex-1"
                  />
                  <input 
                    type="text" 
                    placeholder="Field Value..." 
                    value={customFieldValue}
                    onChange={e => setCustomFieldValue(e.target.value)}
                    className="bg-slate-950 text-sm border border-slate-800 p-2.5 rounded-lg focus:outline-none focus:border-purple-500/30 text-slate-200 flex-1"
                  />
                  <button 
                    onClick={addCustomField}
                    className="px-4 py-2.5 rounded-lg bg-purple-900/20 hover:bg-purple-900/40 border border-purple-800/40 text-sm font-mono text-purple-300 transition-all flex items-center justify-center gap-1 cursor-pointer whitespace-nowrap"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Property
                  </button>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* ==========================================================================
            TAB: RELATIONSHIP CANVAS (WHITEBOARD CONSPIRACY)
            ========================================================================== */}
        {activeTab === 'relationships' && (
          <div className="p-6 space-y-6 relative min-h-[500px]">
            {!user && <AuthOverlay message="Sign in to drag character nodes and link relationships on the conspiracy whiteboard." />}
            
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h3 className="text-xl font-serif text-white flex items-center gap-2">
                  <Network className="w-5 h-5 text-purple-400" /> Character Relationship Canvas
                </h3>
                <p className="text-xs font-mono text-slate-400 tracking-wide mt-0.5">WHITEBOARD CONSPIRACY BOARD — DRAG NODES AND GRAPH CONNECTIONS</p>
              </div>

              {/* Add Connection Selector Panel */}
              <form onSubmit={addConnection} className="flex flex-wrap gap-2 items-center bg-slate-900/40 border border-slate-800 p-2 rounded-xl">
                <select
                  value={newConn.from}
                  onChange={e => setNewConn({...newConn, from: e.target.value})}
                  className="bg-slate-950 text-xs border border-slate-800 p-1.5 rounded focus:outline-none text-slate-300"
                >
                  <option value="">Source Node...</option>
                  {characters.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
                
                <span className="text-xs text-slate-600">→</span>
                
                <input 
                  type="text" 
                  placeholder="Rel. (e.g. Rival)..." 
                  value={newConn.label}
                  onChange={e => setNewConn({...newConn, label: e.target.value})}
                  className="bg-slate-950 text-xs border border-slate-800 p-1.5 rounded focus:outline-none text-slate-300 w-28"
                />

                <span className="text-xs text-slate-600">→</span>

                <select
                  value={newConn.to}
                  onChange={e => setNewConn({...newConn, to: e.target.value})}
                  className="bg-slate-950 text-xs border border-slate-800 p-1.5 rounded focus:outline-none text-slate-300"
                >
                  <option value="">Target Node...</option>
                  {characters.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>

                <button type="submit" className="p-1.5 rounded bg-purple-900/40 border border-purple-700/50 hover:bg-purple-900/60 text-purple-300 hover:text-white cursor-pointer transition-all">
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>

            {/* Whiteboard Interactive Zone */}
            <div 
              ref={whiteboardRef}
              onMouseMove={handleWhiteboardMouseMove}
              onMouseLeave={handleWhiteboardMouseUp}
              onMouseUp={handleWhiteboardMouseUp}
              className="relative h-[400px] w-full bg-[#08090d] border border-slate-800/80 rounded-2xl overflow-hidden cursor-crosshair shadow-inner"
              style={{
                backgroundImage: 'radial-gradient(rgba(139, 92, 246, 0.05) 1.5px, transparent 1.5px)',
                backgroundSize: '24px 24px'
              }}
            >
              {/* Render SVG connection arrows */}
              <svg className="absolute inset-0 pointer-events-none w-full h-full">
                <defs>
                  <marker id="arrow" viewBox="0 0 10 10" refX="15" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                    <path d="M0,0 L10,5 L0,10 z" fill="#a855f7" />
                  </marker>
                </defs>

                {connections.map((conn, idx) => {
                  const fromPos = nodePositions[conn.from];
                  const toPos = nodePositions[conn.to];
                  if (!fromPos || !toPos) return null;

                  // Center coordinates
                  const x1 = fromPos.x + 75;
                  const y1 = fromPos.y + 40;
                  const x2 = toPos.x + 75;
                  const y2 = toPos.y + 40;

                  // Text position (midpoint)
                  const midX = (x1 + x2) / 2;
                  const midY = (y1 + y2) / 2 - 10;

                  return (
                    <g key={idx}>
                      <line 
                        x1={x1} y1={y1} x2={x2} y2={y2} 
                        stroke="rgba(168, 85, 247, 0.4)" 
                        strokeWidth="1.5" 
                        strokeDasharray="4 4"
                        markerEnd="url(#arrow)" 
                      />
                      <rect x={midX - 45} y={midY - 8} width="90" height="16" fill="#0c0d12" rx="4" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
                      <text 
                        x={midX} y={midY + 3} 
                        fill="#c084fc" 
                        fontSize="11" 
                        fontFamily="monospace"
                        textAnchor="middle" 
                        className="uppercase tracking-wider font-semibold"
                      >
                        {conn.label}
                      </text>
                    </g>
                  );
                })}
              </svg>

              {/* Render draggable character nodes */}
              {characters.map(char => {
                const pos = nodePositions[char.id] || { x: 50, y: 50 };
                return (
                  <div
                    key={char.id}
                    onMouseDown={(e) => handleWhiteboardMouseDown(e, char.id)}
                    className={`absolute w-36 h-20 bg-slate-900/90 border border-slate-800/80 rounded-xl p-3 shadow-lg select-none cursor-grab flex flex-col justify-between transition-colors ${
                      draggingNodeId === char.id ? 'border-purple-500/50 cursor-grabbing bg-slate-900 shadow-2xl' : 'hover:border-slate-700/80'
                    }`}
                    style={{ left: pos.x, top: pos.y }}
                  >
                    <div>
                      <h4 className="font-serif text-slate-100 text-xs font-semibold truncate">{char.name}</h4>
                      <p className="text-xs font-mono text-purple-400 truncate uppercase mt-0.5">{char.role}</p>
                    </div>
                    <div className="flex justify-between items-center text-[10px] font-mono text-slate-500 border-t border-slate-800 pt-1">
                      <span>{char.species}</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ==========================================================================
            TAB: WORLD BUILDING LAB
            ========================================================================== */}
        {activeTab === 'world' && (
          <div className="p-6 space-y-6 relative max-h-[500px] overflow-y-auto">
            {!user && <AuthOverlay message="Sign in to save and modify world building blueprints." />}
            
            <div>
              <h3 className="text-xl font-serif text-white flex items-center gap-2">
                <Globe className="w-5 h-5 text-purple-400" /> World Building Lab
              </h3>
              <p className="text-xs font-mono text-slate-400 tracking-wide mt-0.5">CHRONICLING THE MATRIX, ARCHITECTURES, AND LAWS OF UNIVERSE</p>
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-slate-500 uppercase tracking-wider block">Time Period & Technology Stage</label>
                  <input 
                    type="text" 
                    value={worldData.timePeriod}
                    onChange={e => setWorldData({...worldData, timePeriod: e.target.value})}
                    className="w-full bg-slate-900/40 border border-slate-800 p-3 rounded-xl text-sm text-slate-300 font-serif focus:outline-none focus:border-purple-500/25"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-slate-500 uppercase tracking-wider block">Geography & Layout Boundaries</label>
                  <textarea 
                    value={worldData.geography}
                    onChange={e => setWorldData({...worldData, geography: e.target.value})}
                    className="w-full bg-slate-900/40 border border-slate-800 p-3 rounded-xl text-sm text-slate-300 font-serif leading-relaxed focus:outline-none focus:border-purple-500/25 h-20 resize-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-slate-500 uppercase tracking-wider block">Culture, Species & Society Habits</label>
                  <textarea 
                    value={worldData.culture}
                    onChange={e => setWorldData({...worldData, culture: e.target.value})}
                    className="w-full bg-slate-900/40 border border-slate-800 p-3 rounded-xl text-sm text-slate-300 font-serif leading-relaxed focus:outline-none focus:border-purple-500/25 h-20 resize-none"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-slate-500 uppercase tracking-wider block">Politics & Syndicate Power Structures</label>
                  <textarea 
                    value={worldData.politics}
                    onChange={e => setWorldData({...worldData, politics: e.target.value})}
                    className="w-full bg-[#0d0a15]/30 border border-slate-800 p-3 rounded-xl text-sm text-slate-300 font-serif leading-relaxed focus:outline-none focus:border-purple-500/25 h-20 resize-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-slate-500 uppercase tracking-wider block">Magic Rules or Sonic Technology Thresholds</label>
                  <input 
                    type="text" 
                    value={worldData.magicRules}
                    onChange={e => setWorldData({...worldData, magicRules: e.target.value})}
                    className="w-full bg-slate-900/40 border border-slate-800 p-3 rounded-xl text-sm text-slate-300 font-serif focus:outline-none focus:border-purple-500/25"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-slate-500 uppercase tracking-wider block">Cosmology Myths & Deep Lore Beliefs</label>
                  <textarea 
                    value={worldData.beliefs}
                    onChange={e => setWorldData({...worldData, beliefs: e.target.value})}
                    className="w-full bg-[#0d0a15]/30 border border-slate-800 p-3 rounded-xl text-sm text-slate-300 font-serif leading-relaxed focus:outline-none focus:border-purple-500/25 h-20 resize-none"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==========================================================================
            TAB: FANTASY MAP TOOL
            ========================================================================== */}
        {activeTab === 'map' && (
          <div className="p-6 space-y-6 relative min-h-[500px]">
            {!user && <AuthOverlay message="Sign in to custom label and place locations on your fantasy cartography map." />}

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h3 className="text-xl font-serif text-white flex items-center gap-2">
                  <Map className="w-5 h-5 text-purple-400" /> Interactive Cartography Canvas
                </h3>
                <p className="text-xs font-mono text-slate-400 tracking-wide mt-0.5">DRAG TEXT BOXES AND medieval MARKERS. EXPORT READY PRINTABLE VECTOR.</p>
              </div>

              <div className="flex flex-wrap gap-3">
                {/* Add Custom Label */}
                <form onSubmit={addMapLabel} className="flex gap-2">
                  <input 
                    type="text" 
                    placeholder="Location Label..." 
                    value={newLabelText}
                    onChange={e => setNewLabelText(e.target.value)}
                    className="bg-slate-950 text-xs border border-slate-800 p-1.5 rounded-lg focus:outline-none text-slate-300 w-32"
                  />
                  <button type="submit" className="px-3 py-1.5 bg-purple-900/40 border border-purple-800/40 rounded-lg text-purple-300 text-xs font-mono hover:bg-purple-900/60 cursor-pointer flex items-center gap-1 transition-all">
                    <Plus className="w-3.5 h-3.5" /> Label
                  </button>
                </form>

                {/* Add Custom Pin */}
                <form onSubmit={addMapPin} className="flex gap-2">
                  <input 
                    type="text" 
                    placeholder="Pin Name..." 
                    value={newPinTitle}
                    onChange={e => setNewPinTitle(e.target.value)}
                    className="bg-slate-950 text-xs border border-slate-800 p-1.5 rounded-lg focus:outline-none text-slate-300 w-28"
                  />
                  <button type="submit" className="px-3 py-1.5 bg-purple-900/40 border border-purple-800/40 rounded-lg text-purple-300 text-xs font-mono hover:bg-purple-900/60 cursor-pointer flex items-center gap-1 transition-all">
                    <MapPin className="w-3.5 h-3.5" /> Pin
                  </button>
                </form>

                <button 
                  onClick={exportMap}
                  className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-mono text-slate-300 rounded-lg flex items-center gap-1.5 cursor-pointer transition-all"
                >
                  <Download className="w-3.5 h-3.5" /> Export Layout
                </button>
              </div>
            </div>

            {/* Map Cartography Workspace */}
            <div 
              ref={mapCanvasRef}
              onMouseMove={handleMapCanvasMouseMove}
              onMouseLeave={handleMapCanvasMouseUp}
              onMouseUp={handleMapCanvasMouseUp}
              className="relative h-[380px] w-full bg-[#18120d] border border-amber-950/20 rounded-2xl overflow-hidden cursor-crosshair shadow-inner"
              style={{
                backgroundImage: 'radial-gradient(rgba(178, 122, 60, 0.04) 2px, transparent 2px)',
                backgroundSize: '32px 32px'
              }}
            >
              {/* Ambient visual map sketch layout (islands / seas mockup) */}
              <div className="absolute inset-0 opacity-10 pointer-events-none flex items-center justify-center select-none" style={{ filter: 'sepia(0.8)' }}>
                <svg viewBox="0 0 800 400" className="w-full h-full">
                  <path d="M 100,100 Q 250,50 350,150 T 600,100 T 700,300 Q 550,380 400,300 T 150,350 Z" fill="none" stroke="#fff" strokeWidth="2" strokeDasharray="5 5" />
                  <path d="M 250,180 Q 290,120 380,180 T 450,220 Q 350,280 250,180 Z" fill="none" stroke="#fff" strokeWidth="1" />
                  <circle cx="300" cy="150" r="80" fill="none" stroke="#fff" strokeWidth="1" opacity="0.5" />
                  <circle cx="300" cy="150" r="100" fill="none" stroke="#fff" strokeWidth="0.5" opacity="0.3" />
                  <text x="310" y="155" fill="#fff" fontSize="12" fontFamily="serif" letterSpacing="0.4em" opacity="0.4">OBSIDIAN DEEPS</text>
                </svg>
              </div>

              {/* Labels layer */}
              {mapLabels.map(label => (
                <div
                  key={label.id}
                  onMouseDown={(e) => handleMapLabelMouseDown(e, label.id)}
                  className={`absolute select-none cursor-grab text-[#e5c59e] ${
                    label.isItalic ? 'font-serif italic' : 'font-serif'
                  } group`}
                  style={{ 
                    left: label.x, 
                    top: label.y, 
                    fontSize: `${label.fontSize}px`,
                    textShadow: '0 2px 4px rgba(0,0,0,0.8)'
                  }}
                >
                  <span className="relative group-hover:text-amber-300 transition-colors">
                    {label.text}
                    
                    {/* Delete Label button inside group */}
                    <button 
                      onClick={() => setMapLabels(mapLabels.filter(l => l.id !== label.id))}
                      className="absolute -top-3 -right-4 bg-red-950 border border-red-900 rounded-full w-3.5 h-3.5 flex items-center justify-center text-red-400 text-[10px] opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                    >
                      &times;
                    </button>
                  </span>
                </div>
              ))}

              {/* Pins layer */}
              {mapPins.map(pin => (
                <div
                  key={pin.id}
                  onMouseDown={(e) => handleMapPinMouseDown(e, pin.id)}
                  className="absolute select-none cursor-grab flex items-center gap-1.5 group"
                  style={{ left: pin.x, top: pin.y }}
                >
                  <MapPin className="w-5 h-5 text-amber-500 fill-amber-950/40 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]" />
                  <span className="bg-[#120d09] border border-amber-950/40 px-1.5 py-0.5 rounded text-xs font-mono text-[#d4af37] shadow-lg whitespace-nowrap">
                    {pin.title}
                  </span>
                  
                  {/* Delete Pin button */}
                  <button 
                    onClick={() => setMapPins(mapPins.filter(p => p.id !== pin.id))}
                    className="absolute -top-2 -left-2 bg-red-950 border border-red-900 rounded-full w-3.5 h-3.5 flex items-center justify-center text-red-400 text-[10px] opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                  >
                    &times;
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ==========================================================================
            TAB: MOVABLE PLOT POINTS (STORYBOARD KANBAN)
            ========================================================================== */}
        {activeTab === 'plots' && (
          <div className="p-6 space-y-6 relative min-h-[500px]">
            {!user && <AuthOverlay message="Sign in to reorder plot cards and structure your story timeline." />}
            
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-xl font-serif text-white flex items-center gap-2">
                  <List className="w-5 h-5 text-purple-400" /> Draggable Plot Points
                </h3>
                <p className="text-xs font-mono text-slate-400 tracking-wide mt-0.5">DRAG AND DROP STORY ARCHITECTURE — DESIGN NARRATIVE MOMENTS IN VECTOR TIMELINES</p>
              </div>
            </div>

            {/* Draggable Plot Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 pt-4">
              {plots.map((plot, idx) => (
                <div
                  key={plot.id}
                  draggable={user ? "true" : "false"}
                  onDragStart={() => handleDragStart(idx)}
                  onDragOver={(e) => handleDragOver(e, idx)}
                  onDragEnd={handleDragEnd}
                  className={`bg-[#0d0a15]/80 border rounded-2xl p-4 min-h-[160px] flex flex-col justify-between cursor-grab active:cursor-grabbing transition-all ${
                    draggedPlotIndex === idx 
                      ? 'border-purple-500 bg-purple-950/30 scale-95 shadow-2xl opacity-50' 
                      : 'border-slate-800/80 hover:border-purple-500/30 hover:bg-[#120f1f]/50'
                  }`}
                >
                  <div className="space-y-2">
                    <span className="text-xs font-mono text-purple-400 font-bold uppercase tracking-wider block bg-purple-950/20 border border-purple-900/30 w-max px-2 py-0.5 rounded">
                      {plot.stage}
                    </span>
                    <h4 className="font-serif font-medium text-slate-100 text-sm">{plot.title}</h4>
                    <p className="text-xs text-slate-400 leading-normal font-light">{plot.desc}</p>
                  </div>
                  <div className="border-t border-slate-900 pt-2 flex justify-between items-center text-xs font-mono text-slate-500">
                    <span>Index 0{idx + 1}</span>
                    <span className="w-2 h-2 rounded-full bg-slate-800" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ==========================================================================
            TAB: CONFLICT & ARCS
            ========================================================================== */}
        {activeTab === 'arcs' && (
          <div className="p-6 space-y-6 relative max-h-[500px] overflow-y-auto">
            {!user && <AuthOverlay message="Sign in to save structural conflict parameters." />}
            
            <div>
              <h3 className="text-xl font-serif text-white flex items-center gap-2">
                <GitCommit className="w-5 h-5 text-purple-400" /> Conflict & Character Arcs
              </h3>
              <p className="text-xs font-mono text-slate-400 tracking-wide mt-0.5">COMPILING EXTERNAL GRAVITIES AND INTERNAL TRANSFORMATIONAL CRUCIBLES</p>
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              {/* Conflict Mapping */}
              <div className="space-y-4">
                <h4 className="text-xs font-mono uppercase text-purple-400 tracking-wider border-b border-slate-900 pb-2">Narrative Conflict</h4>
                
                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-slate-500 uppercase block">Main Problem / Incident</label>
                  <textarea 
                    value={conflictData.mainProblem}
                    onChange={e => setConflictData({...conflictData, mainProblem: e.target.value})}
                    className="w-full bg-slate-900/40 border border-slate-800 p-3 rounded-xl text-sm text-slate-300 font-serif leading-relaxed focus:outline-none focus:border-purple-500/25 h-16 resize-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-slate-500 uppercase block">The Stakes (What is lost?)</label>
                  <input 
                    type="text" 
                    value={conflictData.stakes}
                    onChange={e => setConflictData({...conflictData, stakes: e.target.value})}
                    className="w-full bg-slate-900/40 border border-slate-800 p-3 rounded-xl text-sm text-slate-300 font-serif focus:outline-none focus:border-purple-500/25"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-xs font-mono text-slate-500 uppercase block">External Conflict</label>
                    <textarea 
                      value={conflictData.externalConflict}
                      onChange={e => setConflictData({...conflictData, externalConflict: e.target.value})}
                      className="w-full bg-[#0d0a15]/30 border border-slate-800 p-3 rounded-xl text-sm text-slate-300 font-serif leading-relaxed focus:outline-none focus:border-purple-500/25 h-20 resize-none"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-mono text-slate-500 uppercase block">Internal Conflict</label>
                    <textarea 
                      value={conflictData.internalConflict}
                      onChange={e => setConflictData({...conflictData, internalConflict: e.target.value})}
                      className="w-full bg-[#0d0a15]/30 border border-slate-800 p-3 rounded-xl text-sm text-slate-300 font-serif leading-relaxed focus:outline-none focus:border-purple-500/25 h-20 resize-none"
                    />
                  </div>
                </div>
              </div>

              {/* Character Arcs Mapping */}
              <div className="space-y-4">
                <h4 className="text-xs font-mono uppercase text-purple-400 tracking-wider border-b border-slate-900 pb-2">Character Arc: {activeChar?.name}</h4>
                
                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-slate-500 uppercase block">Starting Status (Flaws & Shieldings)</label>
                  <textarea 
                    value={conflictData.arcStart}
                    onChange={e => setConflictData({...conflictData, arcStart: e.target.value})}
                    className="w-full bg-[#0d0a15]/30 border border-slate-800 p-3 rounded-xl text-sm text-slate-300 font-serif leading-relaxed focus:outline-none focus:border-purple-500/25 h-16 resize-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-slate-500 uppercase block">Key Turning Points / Crucible Moments</label>
                  <textarea 
                    value={conflictData.arcTurningPoint}
                    onChange={e => setConflictData({...conflictData, arcTurningPoint: e.target.value})}
                    className="w-full bg-slate-900/40 border border-slate-800 p-3 rounded-xl text-sm text-slate-300 font-serif leading-relaxed focus:outline-none focus:border-purple-500/25 h-16 resize-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-slate-500 uppercase block">Ending Status (Lessons & Revelations)</label>
                  <textarea 
                    value={conflictData.arcEnd}
                    onChange={e => setConflictData({...conflictData, arcEnd: e.target.value})}
                    className="w-full bg-slate-900/40 border border-slate-800 p-3 rounded-xl text-sm text-slate-300 font-serif leading-relaxed focus:outline-none focus:border-purple-500/25 h-16 resize-none"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==========================================================================
            TAB: SYNOPSIS
            ========================================================================== */}
        {activeTab === 'synopsis' && (
          <div className="p-6 space-y-6 relative max-h-[500px] overflow-y-auto">
            {!user && <AuthOverlay message="Sign in to save outlines and generate AI synopses." />}
            
            <div>
              <h3 className="text-xl font-serif text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-purple-400" /> Story Synopsis Builder
              </h3>
              <p className="text-xs font-mono text-slate-400 tracking-wide mt-0.5">UNFURLING CORE LOGLINES, DRAMATIC PREMISES, AND AI CONCEPTS</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Left Column Input */}
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-slate-500 uppercase block">Manuscript Project Title</label>
                  <input 
                    type="text" 
                    value={synopsis.title}
                    onChange={e => setSynopsis({...synopsis, title: e.target.value})}
                    className="w-full bg-slate-900/40 border border-slate-800 p-3 rounded-xl text-sm text-slate-300 font-serif focus:outline-none focus:border-purple-500/25"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-slate-500 uppercase block">Dramatic Core Premise</label>
                  <textarea 
                    value={synopsis.premise}
                    onChange={e => setSynopsis({...synopsis, premise: e.target.value})}
                    className="w-full bg-slate-900/40 border border-slate-800 p-3 rounded-xl text-sm text-slate-300 font-serif leading-relaxed focus:outline-none focus:border-purple-500/25 h-24 resize-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-slate-500 uppercase block">Thematic Exploration</label>
                  <input 
                    type="text" 
                    value={synopsis.theme}
                    onChange={e => setSynopsis({...synopsis, theme: e.target.value})}
                    className="w-full bg-slate-900/40 border border-slate-800 p-3 rounded-xl text-sm text-slate-300 font-serif focus:outline-none focus:border-purple-500/25"
                  />
                </div>

                <button 
                  onClick={generatePremiseSynopsis}
                  disabled={generatingSynopsis}
                  className="w-full py-2.5 rounded-xl bg-purple-900/40 hover:bg-purple-900/60 border border-purple-800/50 text-sm font-mono text-purple-300 hover:text-white transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  {generatingSynopsis ? 'Humming with the Siren...' : 'Unfurl AI Synopsis Draft'}
                </button>
              </div>

              {/* Right Column Output */}
              <div className="bg-[#0d0a15]/30 border border-slate-800 p-5 rounded-2xl flex flex-col justify-between min-h-[300px]">
                <div className="space-y-3">
                  <span className="text-xs font-mono text-purple-400 font-bold uppercase tracking-wider block bg-purple-950/20 border border-purple-900/30 w-max px-2 py-0.5 rounded">
                    Generated Synopsis Canvas
                  </span>
                  
                  {generatingSynopsis ? (
                    <div className="py-12 flex flex-col items-center justify-center space-y-4">
                      <div className="w-8 h-8 rounded-full border-t-2 border-purple-500 animate-spin" />
                      <p className="text-sm font-mono text-slate-500">Retrieving ancient deep-sea frequencies...</p>
                    </div>
                  ) : aiSynopsis ? (
                    <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                      {aiSynopsis.split('\n\n').map((paragraph, pIdx) => (
                        <p key={pIdx} className="font-serif text-slate-300 text-sm leading-relaxed text-justify first-letter:text-xl first-letter:font-bold first-letter:text-purple-400">
                          {paragraph}
                        </p>
                      ))}
                    </div>
                  ) : (
                    <div className="py-12 text-center text-slate-500 space-y-2">
                      <FileText className="w-8 h-8 mx-auto text-slate-700" />
                      <p className="text-sm font-mono">No AI synopsis generated yet.</p>
                      <p className="text-xs text-slate-600 max-w-[200px] mx-auto leading-normal">Use the generator on the left to map your story into a complete synopsis.</p>
                    </div>
                  )}
                </div>

                <div className="border-t border-slate-900 pt-3 mt-4 text-xs font-mono text-slate-600 flex justify-between items-center">
                  <span>Compilation Layer: v1.0.4</span>
                  <span className="flex items-center gap-1"><Award className="w-3.5 h-3.5 text-purple-500" /> Immersive Design</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==========================================================================
            TAB: WRITING SUITE
            ========================================================================== */}
        {activeTab === 'suite' && (
          <div className="grid md:grid-cols-4 min-h-[500px]">
            {/* Outline sidebar */}
            <div className="border-r border-slate-800 p-4 space-y-4 bg-slate-950/40">
              <span className="text-xs font-mono uppercase text-purple-400 tracking-wider block">Chapters & Outline</span>
              
              <div className="space-y-2">
                {chapters.map(ch => (
                  <button
                    key={ch.id}
                    onClick={() => setActiveChapterId(ch.id)}
                    className={`w-full text-left p-2.5 rounded-lg text-sm transition-all border ${
                      activeChapterId === ch.id
                        ? 'bg-purple-950/40 border-purple-500/20 text-purple-200'
                        : 'border-transparent text-slate-500 hover:bg-slate-900/40 hover:text-slate-300'
                    }`}
                  >
                    <span className="font-serif truncate block">{ch.title}</span>
                  </button>
                ))}
              </div>

              <button 
                onClick={() => {
                  const id = 'ch' + (chapters.length + 1);
                  setChapters([...chapters, { id, title: `Chapter ${chapters.length + 1}: Unnamed Chapter`, content: '' }]);
                  setActiveChapterId(id);
                }}
                className="w-full py-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-mono text-slate-400 hover:text-purple-300 cursor-pointer flex items-center justify-center gap-1 transition-all"
              >
                <Plus className="w-3.5 h-3.5" /> New Outline Chapter
              </button>
            </div>

            {/* Rich Editor Panel */}
            <div className="col-span-2 p-6 flex flex-col relative h-[500px]">
              {!user && <AuthOverlay />}

              <div className="mb-4">
                <input 
                  type="text" 
                  value={activeChapter.title}
                  onChange={e => handleChapterTitleChange(e.target.value)}
                  className="bg-transparent font-serif text-2xl text-slate-100 focus:outline-none border-b border-transparent focus:border-purple-500/30 pb-1 w-full"
                />
              </div>

              <textarea 
                value={activeChapter.content}
                onChange={e => handleChapterContentChange(e.target.value)}
                placeholder="Type your story prose here... Let the words flow into the obsidian void."
                className="w-full flex-1 bg-transparent text-slate-300 resize-none focus:outline-none font-serif text-base leading-relaxed"
              />

              <div className="border-t border-slate-800 pt-3 mt-4 flex justify-between items-center text-xs font-mono text-slate-500">
                <div className="flex gap-4">
                  <span>Words: {wordCount}</span>
                  <span>Characters: {charCount}</span>
                </div>
                <span>Typewriter Ink Mode</span>
              </div>
            </div>

            {/* Sidebar attachment column (illustrations) */}
            <div className="border-l border-slate-800 p-4 space-y-4 bg-slate-950/40">
              <span className="text-xs font-mono uppercase text-purple-400 tracking-wider block">Inline Illustrations</span>
              
              <div className="bg-[#0d0a15]/50 border border-slate-800 p-4 rounded-xl space-y-4">
                {chapterIllustrations[activeChapterId] ? (
                  <div className="space-y-3">
                    <div className="relative rounded-lg overflow-hidden border border-slate-800 aspect-video group">
                      <img 
                        src={chapterIllustrations[activeChapterId]} 
                        alt="Chapter illustration" 
                        className="w-full h-full object-cover" 
                      />
                      <button 
                        onClick={() => setChapterIllustrations({ ...chapterIllustrations, [activeChapterId]: '' })}
                        className="absolute top-2 right-2 bg-slate-950/80 hover:bg-slate-900 border border-slate-800 p-1.5 rounded-full text-red-400 opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <span className="text-xs font-mono text-slate-500 uppercase block tracking-wider text-center">Active Attachment</span>
                  </div>
                ) : (
                  <div className="border border-dashed border-slate-800 rounded-xl p-6 text-center text-slate-500 flex flex-col items-center justify-center space-y-2">
                    <ImageIcon className="w-6 h-6 text-slate-700" />
                    <p className="text-xs font-mono leading-normal">No attached cover / chapter art</p>
                    <p className="text-[10px] text-slate-600 leading-normal max-w-[130px]">Upload an illustration to render side-by-side with your draft.</p>
                  </div>
                )}

                <div className="relative">
                  <input 
                    type="file" 
                    accept="image/*" 
                    id="illustration-upload"
                    onChange={handleIllustrationUpload}
                    className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                  />
                  <button className="w-full py-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-mono text-slate-300 rounded-lg flex items-center justify-center gap-1 cursor-pointer transition-all">
                    <Upload className="w-3.5 h-3.5" /> Upload Cover Art
                  </button>
                </div>
              </div>

              {/* Progress Tracker Ring SVG */}
              <div className="bg-[#0d0a15]/50 border border-slate-800 p-4 rounded-xl space-y-3">
                <span className="text-xs font-mono uppercase text-slate-500 tracking-wider block">Daily Progress</span>
                
                <div className="flex items-center gap-4">
                  {/* SVG Circle progress */}
                  <div className="relative w-12 h-12">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle cx="24" cy="24" r="20" fill="transparent" stroke="rgba(255,255,255,0.03)" strokeWidth="3" />
                      <circle cx="24" cy="24" r="20" fill="transparent" stroke="#a855f7" strokeWidth="3" strokeDasharray={125} strokeDashoffset={125 - (125 * progressPercent) / 100} />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center text-xs font-mono font-bold text-slate-300">
                      {progressPercent}%
                    </div>
                  </div>

                  <div>
                    <span className="text-xs font-serif text-slate-200 font-medium block">Daily Word Goal</span>
                    <span className="text-xs font-mono text-slate-500">{wordCount} / {dailyGoal} words</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
