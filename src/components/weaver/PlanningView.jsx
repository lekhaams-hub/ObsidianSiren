import React, { useState, useEffect, useRef } from 'react';
import { 
  Feather, Sparkles, Network, Globe, Map, List, GitCommit, FileText, BookOpen, 
  Plus, Trash2, Edit3, Lock, Award, Upload, Download, Type, MapPin, Eye,
  BarChart2, Image as ImageIcon, ChevronRight, Check,
  Heading1, Heading2, Bold, Italic, ListOrdered, Mic, MicOff, AlertCircle
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import WritingSuiteView from './WritingSuiteView';

export default function PlanningView({ bookId = 'default_book' }) {
  const { user, setIsAuthModalOpen } = useAuth();
  const [activeTab, setActiveTab] = useState('characters');

  // 1. Characters State
  const [characters, setCharacters] = useState(() => {
    const saved = localStorage.getItem(`oss_planning_characters_${bookId}`);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.length > 0) return parsed;
      } catch (e) {}
    }
    return [
      { id: '1', name: 'Protagonist', age: '32', gender: 'Female', species: 'Human', role: 'Protagonist', traits: 'Obsessive, brilliant, cautious', backstory: 'Discovered a submerged temple off the coast of Siren Island in 2024.', customFields: [] },
      { id: '2', name: 'Antagonist', age: 'Unknown', gender: 'Female', species: 'Siren (Mystical)', role: 'Antagonist', traits: 'Alluring, deceptive, powerful', backstory: 'Ancient entity bound to the obsidian sculpture in the depths.', customFields: [] },
      { id: '3', name: 'Mentor', age: '60', gender: 'Male', species: 'Human', role: 'Mentor', traits: 'Wise, cryptic, protective', backstory: 'Retired captain who knows the siren lore.', customFields: [] }
    ];
  });
  const [activeCharId, setActiveCharId] = useState('1');

  // New character inputs
  const [newChar, setNewChar] = useState({ name: '', age: '', gender: '', species: '', role: '', traits: '', backstory: '' });
  const [customFieldLabel, setCustomFieldLabel] = useState('');
  const [customFieldValue, setCustomFieldValue] = useState('');

  // 2. Relationship Whiteboard States
  const [connections, setConnections] = useState(() => {
    const saved = localStorage.getItem(`oss_planning_connections_${bookId}`);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return [
      { from: '1', to: '3', fromAnchor: 'bottom', toAnchor: 'top', label: 'Trainee' }
    ];
  });

  const [nodePositions, setNodePositions] = useState(() => {
    const saved = localStorage.getItem(`oss_planning_nodepos_${bookId}`);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return {
      '1': { x: 360, y: 150 },
      '2': { x: 530, y: 150 },
      '3': { x: 450, y: 250 }
    };
  });

  const [draggingNodeId, setDraggingNodeId] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const whiteboardRef = useRef(null);

  // Drawing Connection temporary state
  const [drawingFromNodeId, setDrawingFromNodeId] = useState(null);
  const [drawingFromAnchor, setDrawingFromAnchor] = useState('');
  const [currentMousePos, setCurrentMousePos] = useState({ x: 0, y: 0 });

  // Renaming Node state
  const [renamingCharId, setRenamingCharId] = useState(null);
  const [renamingNameVal, setRenamingNameVal] = useState('');

  useEffect(() => {
    localStorage.setItem(`oss_planning_nodepos_${bookId}`, JSON.stringify(nodePositions));
  }, [nodePositions, bookId]);

  useEffect(() => {
    localStorage.setItem(`oss_planning_connections_${bookId}`, JSON.stringify(connections));
  }, [connections, bookId]);

  // 3. World Building Lab States
  const [worldCategories, setWorldCategories] = useState(() => {
    const saved = localStorage.getItem(`oss_planning_world_${bookId}`);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.length > 0) return parsed;
      } catch (e) {}
    }
    return [
      { id: 'timePeriod', title: 'Time Period', placeholder: 'Describe the time period of your world...', value: 'Neo-Maritime Victorian Era (Circa 1894)' },
      { id: 'geography', title: 'Geography', placeholder: 'Describe the geography of your world...', value: 'Siren Island Basin—a volatile archipelago of black sand and obsidian spires.' },
      { id: 'culture', title: 'Culture & Society', placeholder: 'Describe the culture & society of your world...', value: 'Isolated deep-sea salvagers obsessed with salvaging ancient sunken technologies.' },
      { id: 'politics', title: 'Politics & Power System', placeholder: 'Describe the politics & power system of your world...', value: 'Rule of the Salvage Syndicate; meritocracy based on deep-sea diving depths.' },
      { id: 'magicRules', title: 'Magic or Technology Rules', placeholder: 'Describe the magic or technology rules of your world...', value: 'Gravity distortions induced by sonic frequency modulations.' },
      { id: 'economy', title: 'Economy', placeholder: 'Describe the economy of your world...', value: 'Trade of glowing marine pearls and fossilized deep sea relics.' },
      { id: 'beliefs', title: 'Beliefs', placeholder: 'Describe the beliefs of your world...', value: 'Worship of the Siren of the Depths, believed to hum the original song of creation.' },
      { id: 'unique', title: 'What makes this world unique', placeholder: 'Describe what makes this world unique of your world...', value: 'A deep localized gravity well that bends light and sound frequencies.' },
      { id: 'species', title: 'What are the people like — what species', placeholder: 'Describe what are the people like — what species of your world...', value: 'Mainly human salvagers, with legend of sirens lingering.' }
    ];
  });
  const [newWorldCategoryName, setNewWorldCategoryName] = useState('');

  useEffect(() => {
    localStorage.setItem(`oss_planning_world_${bookId}`, JSON.stringify(worldCategories));
  }, [worldCategories, bookId]);

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
  const [plots, setPlots] = useState(() => {
    const saved = localStorage.getItem(`oss_planning_plots_${bookId}`);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.length > 0) return parsed;
      } catch (e) {}
    }
    return [
      { id: 'p_1', stage: 'Introduction', title: 'The Archeological Dig', desc: 'Lekhaa uncovers the obsidian mask inside a submerged temple.' },
      { id: 'p_2', stage: 'Conflict', title: 'The Siren\'s Echo', desc: 'The mask begins to hum, causing sleep deprivation and visual auditory ghosts.' },
      { id: 'p_3', stage: 'Climax', title: 'The Descent into Obsidian', desc: 'Lekhaa dives alone into the deepest trench to place the mask back.' },
      { id: 'p_4', stage: 'Twist', title: 'The Siren is Vance', desc: 'Lekhaa realizes she is the re-incarnation of the entity that forged it.' },
      { id: 'p_5', stage: 'Resolution', title: 'The Eternal Hum', desc: 'The voice stops, but the ink in her journal permanently glows purple.' }
    ];
  });
  const [draggedPlotIndex, setDraggedPlotIndex] = useState(null);

  // Add Plot States
  const [isAddPlotOpen, setIsAddPlotOpen] = useState(false);
  const [newPlot, setNewPlot] = useState({ stage: 'Conflict', title: '', desc: '' });

  // Edit Plot States
  const [editingPlotId, setEditingPlotId] = useState(null);
  const [editingPlotData, setEditingPlotData] = useState({ stage: 'Conflict', title: '', desc: '' });

  // Custom Character Categories State
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newFieldLabels, setNewFieldLabels] = useState({});

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
  const [chapters, setChapters] = useState(() => {
    const saved = localStorage.getItem(`oss_planning_chapters_${bookId}`);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.length > 0) return parsed;
      } catch (e) {}
    }
    return [
      { id: 'ch1', title: 'Chapter 1: The Singing Deep', content: 'The sea was a restless inkwell tonight. Dr. Lekhaa Vance stared into the dark obsidian waters, listening to the soft humming that vibrated through the deck. It was the same pitch as the sculpture sitting inside her trunk, wrapped in heavy velvet. The ocean spray felt needle-sharp, yet she could not force herself to go below deck.' },
      { id: 'ch2', title: 'Chapter 2: The Whispered Ink', content: 'When the ink dried on the parchment, it formed symbols she had never learned. Yet, her calloused fingers continued to move across the mechanical keys, translating the deep-sea frequencies. "Return to the trench," the letters seemed to say, glowing with a faint purple bioluminescence in the dim cabin.' }
    ];
  });
  const [activeChapterId, setActiveChapterId] = useState('ch1');
  const [dailyGoal, setDailyGoal] = useState(500);
  const [chapterIllustrations, setChapterIllustrations] = useState({
    'ch1': 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=400&q=80',
    'ch2': ''
  });

  const activeChapter = chapters.find(c => c.id === activeChapterId) || chapters[0];

  const activeChapterIdRef = useRef(activeChapterId);
  useEffect(() => {
    activeChapterIdRef.current = activeChapterId;
  }, [activeChapterId]);

  const [isDictating, setIsDictating] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const recognitionRef = useRef(null);
  const textareaRef = useRef(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage('');
    }, 3500);
  };

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
          const textToInsert = (textareaRef.current && textareaRef.current.value && !textareaRef.current.value.endsWith('\n') && !textareaRef.current.value.endsWith(' ') ? ' ' : '') + transcript;
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
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const before = text.substring(0, start);
    const after = text.substring(end, text.length);

    const updatedText = before + insertedText + after;
    setChapters(prev => prev.map(c => c.id === activeChapterIdRef.current ? { ...c, content: updatedText } : c));

    setTimeout(() => {
      textarea.focus();
      const newCursorPos = start + insertedText.length;
      textarea.selectionStart = textarea.selectionEnd = newCursorPos;
    }, 0);
  };

  const applyFormatting = (type) => {
    const textarea = textareaRef.current;
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

    setChapters(prev => prev.map(c => c.id === activeChapterIdRef.current ? { ...c, content: updatedText } : c));

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

  useEffect(() => {
    localStorage.setItem(`oss_planning_characters_${bookId}`, JSON.stringify(characters));
  }, [characters, bookId]);

  useEffect(() => {
    localStorage.setItem(`oss_planning_plots_${bookId}`, JSON.stringify(plots));
  }, [plots, bookId]);

  useEffect(() => {
    localStorage.setItem(`oss_planning_chapters_${bookId}`, JSON.stringify(chapters));
    localStorage.setItem('oss_chapters', JSON.stringify(chapters));
  }, [chapters, bookId]);

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

  // Node layout dimensions
  const nodeW = 110;
  const nodeH = 36;

  const getAnchorCoords = (nodeId, anchorName) => {
    const pos = nodePositions[nodeId] || { x: 50, y: 50 };
    switch (anchorName) {
      case 'top':
        return { x: pos.x + nodeW / 2, y: pos.y };
      case 'bottom':
        return { x: pos.x + nodeW / 2, y: pos.y + nodeH };
      case 'left':
        return { x: pos.x, y: pos.y + nodeH / 2 };
      case 'right':
        return { x: pos.x + nodeW, y: pos.y + nodeH / 2 };
      default:
        return { x: pos.x + nodeW / 2, y: pos.y + nodeH / 2 };
    }
  };

  const getBezierPath = (p1, p2, anchor1, anchor2) => {
    const dx = Math.abs(p1.x - p2.x) * 0.4;
    const dy = Math.abs(p1.y - p2.y) * 0.4;
    
    let cp1x = p1.x;
    let cp1y = p1.y;
    let cp2x = p2.x;
    let cp2y = p2.y;
    
    if (anchor1 === 'bottom') cp1y += dy;
    else if (anchor1 === 'top') cp1y -= dy;
    else if (anchor1 === 'left') cp1x -= dx;
    else if (anchor1 === 'right') cp1x += dx;
    
    if (anchor2 === 'bottom') cp2y += dy;
    else if (anchor2 === 'top') cp2y -= dy;
    else if (anchor2 === 'left') cp2x -= dx;
    else if (anchor2 === 'right') cp2x += dx;
    
    return `M ${p1.x} ${p1.y} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
  };

  // Whiteboard Canvas Mouse Drag Handlers
  const handleWhiteboardMouseDown = (e, nodeId) => {
    if (!user) return;
    setDraggingNodeId(nodeId);
    const rect = whiteboardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - (nodePositions[nodeId]?.x || 0);
    const y = e.clientY - rect.top - (nodePositions[nodeId]?.y || 0);
    setDragOffset({ x, y });
  };

  const handleWhiteboardMouseMove = (e) => {
    const rect = whiteboardRef.current.getBoundingClientRect();
    
    // Draw Connection line in real-time
    if (drawingFromNodeId !== null) {
      setCurrentMousePos({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
      return;
    }

    if (draggingNodeId === null) return;
    const x = Math.max(0, Math.min(rect.width - nodeW, e.clientX - rect.left - dragOffset.x));
    const y = Math.max(0, Math.min(rect.height - nodeH, e.clientY - rect.top - dragOffset.y));
    setNodePositions({
      ...nodePositions,
      [draggingNodeId]: { x, y }
    });
  };

  const handleWhiteboardMouseUp = () => {
    setDraggingNodeId(null);
    setDrawingFromNodeId(null);
    setDrawingFromAnchor('');
  };

  const startDrawingConnection = (e, charId, anchor) => {
    e.stopPropagation();
    if (!user) return;
    setDrawingFromNodeId(charId);
    setDrawingFromAnchor(anchor);
    const rect = whiteboardRef.current.getBoundingClientRect();
    setCurrentMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  const handleAnchorMouseUp = (e, targetCharId, targetAnchor) => {
    e.stopPropagation();
    if (drawingFromNodeId && drawingFromNodeId !== targetCharId) {
      const label = window.prompt("Enter relationship label (e.g. Mentor, Rival, Friend):", "Connected");
      if (label !== null) {
        setConnections([
          ...connections,
          {
            from: drawingFromNodeId,
            to: targetCharId,
            fromAnchor: drawingFromAnchor,
            toAnchor: targetAnchor,
            label: label.trim() || 'Connected'
          }
        ]);
      }
    }
    setDrawingFromNodeId(null);
    setDrawingFromAnchor('');
  };

  const handleNodeMouseUp = (targetCharId) => {
    if (drawingFromNodeId && drawingFromNodeId !== targetCharId) {
      const label = window.prompt("Enter relationship label (e.g. Mentor, Rival, Friend):", "Connected");
      if (label !== null) {
        setConnections([
          ...connections,
          {
            from: drawingFromNodeId,
            to: targetCharId,
            fromAnchor: drawingFromAnchor,
            toAnchor: 'top',
            label: label.trim() || 'Connected'
          }
        ]);
      }
    }
    setDraggingNodeId(null);
    setDrawingFromNodeId(null);
    setDrawingFromAnchor('');
  };

  const saveRename = (charId) => {
    if (renamingNameVal.trim()) {
      setCharacters(characters.map(c => c.id === charId ? { ...c, name: renamingNameVal.trim() } : c));
    }
    setRenamingCharId(null);
  };

  const handleWhiteboardAddCharacter = () => {
    if (!user) {
      setIsAuthModalOpen(true);
      return;
    }
    const name = window.prompt("Enter character node name:", "New Character");
    if (!name) return;
    const id = Date.now().toString();
    const newCharObj = {
      id,
      name: name.trim(),
      role: 'Supporting',
      species: 'Human',
      backstory: '',
      traits: '',
      customFields: []
    };
    setCharacters([...characters, newCharObj]);
    setNodePositions({
      ...nodePositions,
      [id]: { x: 300 + Math.random() * 50, y: 150 + Math.random() * 50 }
    });
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

  // Add custom character field for a specific section category
  const addCustomFieldForCategory = (category, label, value = '') => {
    if (!label) return;
    setCharacters(characters.map(c => {
      if (c.id === activeCharId) {
        const id = 'cf_' + Date.now() + Math.random().toString(36).substr(2, 4);
        return {
          ...c,
          customFields: [...(c.customFields || []), { id, label, value, category }]
        };
      }
      return c;
    }));
  };

  const addNewCharacterNode = () => {
    const id = Date.now().toString();
    const newName = `Character ${characters.length + 1}`;
    const added = { 
      id, 
      name: newName, 
      age: '', 
      gender: '', 
      species: '', 
      role: '', 
      traits: '', 
      backstory: '', 
      customFields: [],
      customCategories: []
    };
    setCharacters([...characters, added]);
    setNodePositions({ ...nodePositions, [id]: { x: Math.random() * 300 + 50, y: Math.random() * 200 + 50 } });
    setActiveCharId(id);
  };

  const removeCustomField = (fieldId) => {
    setCharacters(characters.map(c => {
      if (c.id === activeCharId) {
        return {
          ...c,
          customFields: (c.customFields || []).filter(f => f.id !== fieldId)
        };
      }
      return c;
    }));
  };

  const addCustomCategory = (e) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;
    setCharacters(characters.map(c => {
      if (c.id === activeCharId) {
        const categories = c.customCategories || [];
        if (categories.includes(newCategoryName.trim())) return c;
        return {
          ...c,
          customCategories: [...categories, newCategoryName.trim()]
        };
      }
      return c;
    }));
    setNewCategoryName('');
  };

  // Add whiteboard relationship helper
  const addConnection = (e) => {
    e.preventDefault();
    if (!newConn.from || !newConn.to || !newConn.label) return;
    setConnections([...connections, newConn]);
    setNewConn({ from: '', to: '', label: '' });
  };

  // Add plot point helper
  const addPlotPoint = (e) => {
    e.preventDefault();
    if (!newPlot.title || !newPlot.desc) return;
    const added = {
      id: 'p_' + Date.now(),
      stage: newPlot.stage,
      title: newPlot.title,
      desc: newPlot.desc
    };
    setPlots([...plots, added]);
    setNewPlot({ stage: 'Conflict', title: '', desc: '' });
    setIsAddPlotOpen(false);
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
      <div className="flex gap-2 border-b border-slate-800/80 overflow-x-auto pb-2 scrollbar-thin">
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
        {activeTab === 'characters' && (() => {
          const activeChar = characters.find(c => c.id === activeCharId) || characters[0];
          const updateCharField = (field, value) => {
            setCharacters(characters.map(c => c.id === activeCharId ? { ...c, [field]: value } : c));
          };

          return (
            <div className="grid grid-cols-1 lg:grid-cols-4 min-h-[600px] divide-y lg:divide-y-0 lg:divide-x divide-slate-900/60 animate-fade-in">
              {/* Left Sidebar List */}
              <div className="lg:col-span-1 p-4 flex flex-col justify-between bg-slate-950/20 space-y-4">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-mono uppercase text-purple-400 tracking-wider">Cast of Characters</span>
                  </div>
                  <div className="space-y-2">
                    {characters.map(char => (
                      <div key={char.id} className="relative group flex items-center w-full">
                        <button
                          type="button"
                          onClick={() => setActiveCharId(char.id)}
                          className={`w-full text-left p-4 rounded-xl border transition-all font-serif ${
                            activeCharId === char.id
                              ? 'bg-[#0d091b]/80 border-purple-500/50 text-purple-200 shadow-[0_0_15px_rgba(168,85,247,0.12)] font-semibold'
                              : 'border-slate-900/60 bg-[#06070a]/40 text-slate-500 hover:border-slate-800/40 hover:text-slate-300'
                          }`}
                        >
                          <h4 className="text-base font-semibold truncate">{char.name || 'Unnamed Character'}</h4>
                          <p className="text-xs font-mono text-slate-500 mt-1.5 uppercase tracking-wider">
                            {char.role || 'No Role'} • {char.species || 'No Species'}
                          </p>
                        </button>
                        
                        {characters.length > 1 && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setCharacters(characters.filter(c => c.id !== char.id));
                              setConnections(connections.filter(conn => conn.from !== char.id && conn.to !== char.id));
                              if (activeCharId === char.id) {
                                const remaining = characters.filter(c => c.id !== char.id);
                                setActiveCharId(remaining[0].id);
                              }
                            }}
                            className="absolute right-3.5 text-slate-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer p-1 bg-slate-950/80 rounded-md border border-slate-900"
                            title="Delete Character"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Add Character Button */}
                <div className="pt-4 border-t border-slate-900/60">
                  {!user && <AuthOverlay message="Sign in to add and manage your custom characters." />}
                  <button 
                    type="button"
                    onClick={addNewCharacterNode}
                    className="w-full py-3 rounded-xl bg-transparent border border-slate-800 hover:border-purple-500/30 text-sm font-mono text-slate-300 hover:text-purple-300 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" /> Add Character
                  </button>
                </div>
              </div>

              {/* Character Detail Panel */}
              <div className="lg:col-span-3 p-6 space-y-6 relative overflow-y-auto max-h-[85vh] pr-3 scrollbar-thin">
                {!user && <AuthOverlay message="Sign in to edit character details and add custom properties." />}
                
                {/* 1. Core Identity Card */}
                <div className="bg-[#0c0d12]/40 border border-slate-900/80 rounded-2xl p-6 space-y-5">
                  <h3 className="text-xl font-serif text-white font-semibold">Core Identity</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <span className="text-[12px] font-mono text-slate-400 uppercase tracking-widest block">Name</span>
                      <input 
                        type="text" 
                        value={activeChar?.name || ''} 
                        onChange={e => updateCharField('name', e.target.value)}
                        className="w-full bg-[#050608]/90 border border-slate-900/90 focus:border-purple-950/60 rounded-xl p-3.5 text-base text-slate-200 focus:outline-none placeholder-slate-700 font-serif"
                      />
                    </div>
                    
                    <div className="space-y-1.5">
                      <span className="text-[12px] font-mono text-slate-400 uppercase tracking-widest block">Age</span>
                      <input 
                        type="text" 
                        value={activeChar?.age || ''} 
                        onChange={e => updateCharField('age', e.target.value)}
                        className="w-full bg-[#050608]/90 border border-slate-900/90 focus:border-purple-950/60 rounded-xl p-3.5 text-base text-slate-200 focus:outline-none placeholder-slate-700 font-serif"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <span className="text-[12px] font-mono text-slate-400 uppercase tracking-widest block">Gender</span>
                      <input 
                        type="text" 
                        value={activeChar?.gender || ''} 
                        onChange={e => updateCharField('gender', e.target.value)}
                        className="w-full bg-[#050608]/90 border border-slate-900/90 focus:border-purple-950/60 rounded-xl p-3.5 text-base text-slate-200 focus:outline-none placeholder-slate-700 font-serif"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <span className="text-[12px] font-mono text-slate-400 uppercase tracking-widest block">Species</span>
                      <input 
                        type="text" 
                        value={activeChar?.species || ''} 
                        onChange={e => updateCharField('species', e.target.value)}
                        className="w-full bg-[#050608]/90 border border-slate-900/90 focus:border-purple-950/60 rounded-xl p-3.5 text-base text-slate-200 focus:outline-none placeholder-slate-700 font-serif"
                      />
                    </div>

                    <div className="space-y-1.5 md:col-span-2">
                      <span className="text-[12px] font-mono text-slate-400 uppercase tracking-widest block">Role</span>
                      <input 
                        type="text" 
                        value={activeChar?.role || ''} 
                        onChange={e => updateCharField('role', e.target.value)}
                        className="w-full bg-[#050608]/90 border border-slate-900/90 focus:border-purple-950/60 rounded-xl p-3.5 text-base text-slate-200 focus:outline-none placeholder-slate-700 font-serif"
                      />
                    </div>
                  </div>

                  {/* Custom Fields */}
                  {activeChar?.customFields && activeChar.customFields.filter(f => f.category === 'core').length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 pt-4 border-t border-slate-900/40">
                      {activeChar.customFields.filter(f => f.category === 'core').map(field => (
                        <div key={field.id} className="space-y-1.5 relative group/field">
                          <div className="flex justify-between items-center">
                            <span className="text-[12px] font-mono text-purple-400/80 uppercase tracking-widest block">{field.label}</span>
                            <button 
                              type="button"
                              onClick={() => removeCustomField(field.id)}
                              className="text-slate-600 hover:text-red-400 opacity-0 group-hover/field:opacity-100 transition-opacity cursor-pointer p-0.5"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          <input 
                            type="text" 
                            value={field.value} 
                            onChange={e => {
                              setCharacters(characters.map(c => {
                                if (c.id === activeCharId) {
                                  return {
                                    ...c,
                                    customFields: c.customFields.map(f => f.id === field.id ? { ...f, value: e.target.value } : f)
                                  };
                                }
                                return c;
                              }));
                            }}
                            className="w-full bg-[#050608]/90 border border-slate-900/90 focus:border-purple-950/60 rounded-xl p-3.5 text-base text-slate-200 focus:outline-none placeholder-slate-700 font-serif"
                          />
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Add Custom Field Form */}
                  <div className="flex gap-2 items-center pt-4 border-t border-slate-900/40 mt-4">
                    <input 
                      type="text" 
                      placeholder="Add custom field..."
                      value={newFieldLabels['core'] || ''}
                      onChange={e => setNewFieldLabels({ ...newFieldLabels, core: e.target.value })}
                      className="bg-[#050608]/90 border border-slate-900/90 focus:border-purple-950/60 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none placeholder-slate-700 flex-1 font-serif"
                    />
                    <button 
                      type="button"
                      onClick={() => {
                        const label = newFieldLabels['core'] || '';
                        if (!label.trim()) return;
                        addCustomFieldForCategory('core', label.trim(), '');
                        setNewFieldLabels({ ...newFieldLabels, core: '' });
                      }}
                      className="px-4 py-2.5 rounded-xl bg-transparent border border-slate-855 hover:border-purple-500/30 text-sm font-mono text-slate-300 hover:text-purple-300 transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
                    >
                      <Plus className="w-4 h-4" /> Field
                    </button>
                  </div>
                </div>

                {/* 2. Personality & Psychology Card */}
                <div className="bg-[#0c0d12]/40 border border-slate-900/80 rounded-2xl p-6 space-y-5">
                  <h3 className="text-xl font-serif text-white font-semibold">Personality & Psychology</h3>
                  
                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <span className="text-[12px] font-mono text-slate-400 uppercase tracking-widest block">Traits</span>
                      <input 
                        type="text" 
                        value={activeChar?.traits || ''} 
                        onChange={e => updateCharField('traits', e.target.value)}
                        className="w-full bg-[#050608]/90 border border-slate-900/90 focus:border-purple-950/60 rounded-xl p-3.5 text-base text-slate-200 focus:outline-none placeholder-slate-700 font-serif"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <span className="text-[12px] font-mono text-slate-400 uppercase tracking-widest block">Likes & Dislikes</span>
                      <textarea 
                        value={activeChar?.likesDislikes || ''} 
                        onChange={e => updateCharField('likesDislikes', e.target.value)}
                        className="w-full bg-[#050608]/90 border border-slate-900/90 focus:border-purple-950/60 rounded-xl p-3.5 text-base text-slate-200 focus:outline-none placeholder-slate-700 min-h-[110px] resize-none font-serif"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <span className="text-[12px] font-mono text-slate-400 uppercase tracking-widest block">Fears</span>
                        <input 
                          type="text" 
                          value={activeChar?.fears || ''} 
                          onChange={e => updateCharField('fears', e.target.value)}
                          className="w-full bg-[#050608]/90 border border-slate-900/90 focus:border-purple-950/60 rounded-xl p-3.5 text-base text-slate-200 focus:outline-none placeholder-slate-700 font-serif"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <span className="text-[12px] font-mono text-slate-400 uppercase tracking-widest block">Desires</span>
                        <input 
                          type="text" 
                          value={activeChar?.desires || ''} 
                          onChange={e => updateCharField('desires', e.target.value)}
                          className="w-full bg-[#050608]/90 border border-slate-900/90 focus:border-purple-950/60 rounded-xl p-3.5 text-base text-slate-200 focus:outline-none placeholder-slate-700 font-serif"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <span className="text-[12px] font-mono text-slate-400 uppercase tracking-widest block">Motivations</span>
                        <input 
                          type="text" 
                          value={activeChar?.motivations || ''} 
                          onChange={e => updateCharField('motivations', e.target.value)}
                          className="w-full bg-[#050608]/90 border border-slate-900/90 focus:border-purple-950/60 rounded-xl p-3.5 text-base text-slate-200 focus:outline-none placeholder-slate-700 font-serif"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <span className="text-[12px] font-mono text-slate-400 uppercase tracking-widest block">Fatal Flaws</span>
                        <input 
                          type="text" 
                          value={activeChar?.fatalFlaws || ''} 
                          onChange={e => updateCharField('fatalFlaws', e.target.value)}
                          className="w-full bg-[#050608]/90 border border-slate-900/90 focus:border-purple-950/60 rounded-xl p-3.5 text-base text-slate-200 focus:outline-none placeholder-slate-700 font-serif"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <span className="text-[12px] font-mono text-slate-400 uppercase tracking-widest block">Weaknesses</span>
                      <input 
                        type="text" 
                        value={activeChar?.weaknesses || ''} 
                        onChange={e => updateCharField('weaknesses', e.target.value)}
                        className="w-full bg-[#050608]/90 border border-slate-900/90 focus:border-purple-950/60 rounded-xl p-3.5 text-base text-slate-200 focus:outline-none placeholder-slate-700 font-serif"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <span className="text-[12px] font-mono text-slate-400 uppercase tracking-widest block">Internal Conflict</span>
                      <textarea 
                        value={activeChar?.internalConflict || ''} 
                        onChange={e => updateCharField('internalConflict', e.target.value)}
                        className="w-full bg-[#050608]/90 border border-slate-900/90 focus:border-purple-950/60 rounded-xl p-3.5 text-base text-slate-200 focus:outline-none placeholder-slate-700 min-h-[110px] resize-none font-serif"
                      />
                    </div>
                  </div>

                  {/* Custom Fields */}
                  {activeChar?.customFields && activeChar.customFields.filter(f => f.category === 'psychology').length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 pt-4 border-t border-slate-900/40">
                      {activeChar.customFields.filter(f => f.category === 'psychology').map(field => (
                        <div key={field.id} className="space-y-1.5 relative group/field">
                          <div className="flex justify-between items-center">
                            <span className="text-[12px] font-mono text-purple-400/80 uppercase tracking-widest block">{field.label}</span>
                            <button 
                              type="button"
                              onClick={() => removeCustomField(field.id)}
                              className="text-slate-600 hover:text-red-400 opacity-0 group-hover/field:opacity-100 transition-opacity cursor-pointer p-0.5"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          <input 
                            type="text" 
                            value={field.value} 
                            onChange={e => {
                              setCharacters(characters.map(c => {
                                if (c.id === activeCharId) {
                                  return {
                                    ...c,
                                    customFields: c.customFields.map(f => f.id === field.id ? { ...f, value: e.target.value } : f)
                                  };
                                }
                                return c;
                              }));
                            }}
                            className="w-full bg-[#050608]/90 border border-slate-900/90 focus:border-purple-950/60 rounded-xl p-3.5 text-base text-slate-200 focus:outline-none placeholder-slate-700 font-serif"
                          />
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Add Custom Field Form */}
                  <div className="flex gap-2 items-center pt-4 border-t border-slate-900/40 mt-4">
                    <input 
                      type="text" 
                      placeholder="Add custom field..."
                      value={newFieldLabels['psychology'] || ''}
                      onChange={e => setNewFieldLabels({ ...newFieldLabels, psychology: e.target.value })}
                      className="bg-[#050608]/90 border border-slate-900/90 focus:border-purple-950/60 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none placeholder-slate-700 flex-1 font-serif"
                    />
                    <button 
                      type="button"
                      onClick={() => {
                        const label = newFieldLabels['psychology'] || '';
                        if (!label.trim()) return;
                        addCustomFieldForCategory('psychology', label.trim(), '');
                        setNewFieldLabels({ ...newFieldLabels, psychology: '' });
                      }}
                      className="px-4 py-2.5 rounded-xl bg-transparent border border-slate-855 hover:border-purple-500/30 text-sm font-mono text-slate-300 hover:text-purple-300 transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
                    >
                      <Plus className="w-4 h-4" /> Field
                    </button>
                  </div>
                </div>

                {/* 3. Physical Description Card */}
                <div className="bg-[#0c0d12]/40 border border-slate-900/80 rounded-2xl p-6 space-y-5">
                  <h3 className="text-xl font-serif text-white font-semibold">Physical Description</h3>
                  
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <span className="text-[12px] font-mono text-slate-400 uppercase tracking-widest block">Appearance</span>
                        <input 
                          type="text" 
                          value={activeChar?.appearance || ''} 
                          onChange={e => updateCharField('appearance', e.target.value)}
                          className="w-full bg-[#050608]/90 border border-slate-900/90 focus:border-purple-950/60 rounded-xl p-3.5 text-base text-slate-200 focus:outline-none placeholder-slate-700 font-serif"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <span className="text-[12px] font-mono text-slate-400 uppercase tracking-widest block">Clothing Style</span>
                        <input 
                          type="text" 
                          value={activeChar?.clothingStyle || ''} 
                          onChange={e => updateCharField('clothingStyle', e.target.value)}
                          className="w-full bg-[#050608]/90 border border-slate-900/90 focus:border-purple-950/60 rounded-xl p-3.5 text-base text-slate-200 focus:outline-none placeholder-slate-700 font-serif"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <span className="text-[12px] font-mono text-slate-400 uppercase tracking-widest block">Distinguishing Features</span>
                      <textarea 
                        value={activeChar?.distinguishingFeatures || ''} 
                        onChange={e => updateCharField('distinguishingFeatures', e.target.value)}
                        className="w-full bg-[#050608]/90 border border-slate-900/90 focus:border-purple-950/60 rounded-xl p-3.5 text-base text-slate-200 focus:outline-none placeholder-slate-700 min-h-[110px] resize-none font-serif"
                      />
                    </div>
                  </div>

                  {/* Custom Fields */}
                  {activeChar?.customFields && activeChar.customFields.filter(f => f.category === 'physical').length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 pt-4 border-t border-slate-900/40">
                      {activeChar.customFields.filter(f => f.category === 'physical').map(field => (
                        <div key={field.id} className="space-y-1.5 relative group/field">
                          <div className="flex justify-between items-center">
                            <span className="text-[12px] font-mono text-purple-400/80 uppercase tracking-widest block">{field.label}</span>
                            <button 
                              type="button"
                              onClick={() => removeCustomField(field.id)}
                              className="text-slate-600 hover:text-red-400 opacity-0 group-hover/field:opacity-100 transition-opacity cursor-pointer p-0.5"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          <input 
                            type="text" 
                            value={field.value} 
                            onChange={e => {
                              setCharacters(characters.map(c => {
                                if (c.id === activeCharId) {
                                  return {
                                    ...c,
                                    customFields: c.customFields.map(f => f.id === field.id ? { ...f, value: e.target.value } : f)
                                  };
                                }
                                return c;
                              }));
                            }}
                            className="w-full bg-[#050608]/90 border border-slate-900/90 focus:border-purple-950/60 rounded-xl p-3.5 text-base text-slate-200 focus:outline-none placeholder-slate-700 font-serif"
                          />
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Add Custom Field Form */}
                  <div className="flex gap-2 items-center pt-4 border-t border-slate-900/40 mt-4">
                    <input 
                      type="text" 
                      placeholder="Add custom field..."
                      value={newFieldLabels['physical'] || ''}
                      onChange={e => setNewFieldLabels({ ...newFieldLabels, physical: e.target.value })}
                      className="bg-[#050608]/90 border border-slate-900/90 focus:border-purple-950/60 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none placeholder-slate-700 flex-1 font-serif"
                    />
                    <button 
                      type="button"
                      onClick={() => {
                        const label = newFieldLabels['physical'] || '';
                        if (!label.trim()) return;
                        addCustomFieldForCategory('physical', label.trim(), '');
                        setNewFieldLabels({ ...newFieldLabels, physical: '' });
                      }}
                      className="px-4 py-2.5 rounded-xl bg-transparent border border-slate-855 hover:border-purple-500/30 text-sm font-mono text-slate-300 hover:text-purple-300 transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
                    >
                      <Plus className="w-4 h-4" /> Field
                    </button>
                  </div>
                </div>

                {/* 4. Backstory Card */}
                <div className="bg-[#0c0d12]/40 border border-slate-900/80 rounded-2xl p-6 space-y-5">
                  <h3 className="text-xl font-serif text-white font-semibold">Backstory</h3>
                  
                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <span className="text-[12px] font-mono text-slate-400 uppercase tracking-widest block">Childhood Events</span>
                      <textarea 
                        value={activeChar?.childhoodEvents || ''} 
                        onChange={e => updateCharField('childhoodEvents', e.target.value)}
                        className="w-full bg-[#050608]/90 border border-slate-900/90 focus:border-purple-950/60 rounded-xl p-3.5 text-base text-slate-200 focus:outline-none placeholder-slate-700 min-h-[110px] resize-none font-serif"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <span className="text-[12px] font-mono text-slate-400 uppercase tracking-widest block">Key Life Events</span>
                      <textarea 
                        value={activeChar?.keyLifeEvents || activeChar?.backstory || ''} 
                        onChange={e => {
                          updateCharField('keyLifeEvents', e.target.value);
                          updateCharField('backstory', e.target.value);
                        }}
                        className="w-full bg-[#050608]/90 border border-slate-900/90 focus:border-purple-950/60 rounded-xl p-3.5 text-base text-slate-200 focus:outline-none placeholder-slate-700 min-h-[110px] resize-none font-serif"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <span className="text-[12px] font-mono text-slate-400 uppercase tracking-widest block">Family Background or Trauma</span>
                      <textarea 
                        value={activeChar?.familyBackground || ''} 
                        onChange={e => updateCharField('familyBackground', e.target.value)}
                        className="w-full bg-[#050608]/90 border border-slate-900/90 focus:border-purple-950/60 rounded-xl p-3.5 text-base text-slate-200 focus:outline-none placeholder-slate-700 min-h-[110px] resize-none font-serif"
                      />
                    </div>
                  </div>

                  {/* Custom Fields */}
                  {activeChar?.customFields && activeChar.customFields.filter(f => f.category === 'backstory').length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 pt-4 border-t border-slate-900/40">
                      {activeChar.customFields.filter(f => f.category === 'backstory').map(field => (
                        <div key={field.id} className="space-y-1.5 relative group/field">
                          <div className="flex justify-between items-center">
                            <span className="text-[12px] font-mono text-purple-400/80 uppercase tracking-widest block">{field.label}</span>
                            <button 
                              type="button"
                              onClick={() => removeCustomField(field.id)}
                              className="text-slate-600 hover:text-red-400 opacity-0 group-hover/field:opacity-100 transition-opacity cursor-pointer p-0.5"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          <input 
                            type="text" 
                            value={field.value} 
                            onChange={e => {
                              setCharacters(characters.map(c => {
                                if (c.id === activeCharId) {
                                  return {
                                    ...c,
                                    customFields: c.customFields.map(f => f.id === field.id ? { ...f, value: e.target.value } : f)
                                  };
                                }
                                return c;
                              }));
                            }}
                            className="w-full bg-[#050608]/90 border border-slate-900/90 focus:border-purple-950/60 rounded-xl p-3.5 text-base text-slate-200 focus:outline-none placeholder-slate-700 font-serif"
                          />
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Add Custom Field Form */}
                  <div className="flex gap-2 items-center pt-4 border-t border-slate-900/40 mt-4">
                    <input 
                      type="text" 
                      placeholder="Add custom field..."
                      value={newFieldLabels['backstory'] || ''}
                      onChange={e => setNewFieldLabels({ ...newFieldLabels, backstory: e.target.value })}
                      className="bg-[#050608]/90 border border-slate-900/90 focus:border-purple-950/60 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none placeholder-slate-700 flex-1 font-serif"
                    />
                    <button 
                      type="button"
                      onClick={() => {
                        const label = newFieldLabels['backstory'] || '';
                        if (!label.trim()) return;
                        addCustomFieldForCategory('backstory', label.trim(), '');
                        setNewFieldLabels({ ...newFieldLabels, backstory: '' });
                      }}
                      className="px-4 py-2.5 rounded-xl bg-transparent border border-slate-855 hover:border-purple-500/30 text-sm font-mono text-slate-300 hover:text-purple-300 transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
                    >
                      <Plus className="w-4 h-4" /> Field
                    </button>
                  </div>
                </div>

                {/* 5. Behaviour Card */}
                <div className="bg-[#0c0d12]/40 border border-slate-900/80 rounded-2xl p-6 space-y-5">
                  <h3 className="text-xl font-serif text-white font-semibold">Behaviour</h3>
                  
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <span className="text-[12px] font-mono text-slate-400 uppercase tracking-widest block">Speech Style</span>
                        <input 
                          type="text" 
                          value={activeChar?.speechStyle || ''} 
                          onChange={e => updateCharField('speechStyle', e.target.value)}
                          className="w-full bg-[#050608]/90 border border-slate-900/90 focus:border-purple-950/60 rounded-xl p-3.5 text-base text-slate-200 focus:outline-none placeholder-slate-700 font-serif"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <span className="text-[12px] font-mono text-slate-400 uppercase tracking-widest block">Mannerisms</span>
                        <input 
                          type="text" 
                          value={activeChar?.mannerisms || ''} 
                          onChange={e => updateCharField('mannerisms', e.target.value)}
                          className="w-full bg-[#050608]/90 border border-slate-900/90 focus:border-purple-950/60 rounded-xl p-3.5 text-base text-slate-200 focus:outline-none placeholder-slate-700 font-serif"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5 md:w-1/2">
                      <span className="text-[12px] font-mono text-slate-400 uppercase tracking-widest block">Quirks</span>
                      <input 
                        type="text" 
                        value={activeChar?.quirks || ''} 
                        onChange={e => updateCharField('quirks', e.target.value)}
                        className="w-full bg-[#050608]/90 border border-slate-900/90 focus:border-purple-950/60 rounded-xl p-3.5 text-base text-slate-200 focus:outline-none placeholder-slate-700 font-serif"
                      />
                    </div>
                  </div>

                  {/* Custom Fields */}
                  {activeChar?.customFields && activeChar.customFields.filter(f => f.category === 'behaviour').length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 pt-4 border-t border-slate-900/40">
                      {activeChar.customFields.filter(f => f.category === 'behaviour').map(field => (
                        <div key={field.id} className="space-y-1.5 relative group/field">
                          <div className="flex justify-between items-center">
                            <span className="text-[12px] font-mono text-purple-400/80 uppercase tracking-widest block">{field.label}</span>
                            <button 
                              type="button"
                              onClick={() => removeCustomField(field.id)}
                              className="text-slate-600 hover:text-red-400 opacity-0 group-hover/field:opacity-100 transition-opacity cursor-pointer p-0.5"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          <input 
                            type="text" 
                            value={field.value} 
                            onChange={e => {
                              setCharacters(characters.map(c => {
                                if (c.id === activeCharId) {
                                  return {
                                    ...c,
                                    customFields: c.customFields.map(f => f.id === field.id ? { ...f, value: e.target.value } : f)
                                  };
                                }
                                return c;
                              }));
                            }}
                            className="w-full bg-[#050608]/90 border border-slate-900/90 focus:border-purple-950/60 rounded-xl p-3.5 text-base text-slate-200 focus:outline-none placeholder-slate-700 font-serif"
                          />
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Add Custom Field Form */}
                  <div className="flex gap-2 items-center pt-4 border-t border-slate-900/40 mt-4">
                    <input 
                      type="text" 
                      placeholder="Add custom field..."
                      value={newFieldLabels['behaviour'] || ''}
                      onChange={e => setNewFieldLabels({ ...newFieldLabels, behaviour: e.target.value })}
                      className="bg-[#050608]/90 border border-slate-900/90 focus:border-purple-950/60 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none placeholder-slate-700 flex-1 font-serif"
                    />
                    <button 
                      type="button"
                      onClick={() => {
                        const label = newFieldLabels['behaviour'] || '';
                        if (!label.trim()) return;
                        addCustomFieldForCategory('behaviour', label.trim(), '');
                        setNewFieldLabels({ ...newFieldLabels, behaviour: '' });
                      }}
                      className="px-4 py-2.5 rounded-xl bg-transparent border border-slate-855 hover:border-purple-500/30 text-sm font-mono text-slate-300 hover:text-purple-300 transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
                    >
                      <Plus className="w-4 h-4" /> Field
                    </button>
                  </div>
                </div>

                {/* 6. What Makes Them Tick / Break Card */}
                <div className="bg-[#0c0d12]/40 border border-slate-900/80 rounded-2xl p-6 space-y-5">
                  <h3 className="text-xl font-serif text-white font-semibold">What Makes Them Tick / Break</h3>
                  
                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <span className="text-[12px] font-mono text-slate-400 uppercase tracking-widest block">What Makes Them Tick</span>
                      <textarea 
                        value={activeChar?.whatMakesThemTick || ''} 
                        onChange={e => updateCharField('whatMakesThemTick', e.target.value)}
                        className="w-full bg-[#050608]/90 border border-slate-900/90 focus:border-purple-950/60 rounded-xl p-3.5 text-base text-slate-200 focus:outline-none placeholder-slate-700 min-h-[110px] resize-none font-serif"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <span className="text-[12px] font-mono text-slate-400 uppercase tracking-widest block">What Breaks Them</span>
                      <textarea 
                        value={activeChar?.whatBreaksThem || ''} 
                        onChange={e => updateCharField('whatBreaksThem', e.target.value)}
                        className="w-full bg-[#050608]/90 border border-slate-900/90 focus:border-purple-950/60 rounded-xl p-3.5 text-base text-slate-200 focus:outline-none placeholder-slate-700 min-h-[110px] resize-none font-serif"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <span className="text-[12px] font-mono text-slate-400 uppercase tracking-widest block">What They Want and Need (Motivation)</span>
                      <textarea 
                        value={activeChar?.whatTheyWantAndNeed || ''} 
                        onChange={e => updateCharField('whatTheyWantAndNeed', e.target.value)}
                        className="w-full bg-[#050608]/90 border border-slate-900/90 focus:border-purple-950/60 rounded-xl p-3.5 text-base text-slate-200 focus:outline-none placeholder-slate-700 min-h-[110px] resize-none font-serif"
                      />
                    </div>
                  </div>

                  {/* Custom Fields */}
                  {activeChar?.customFields && activeChar.customFields.filter(f => f.category === 'tickbreak').length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 pt-4 border-t border-slate-900/40">
                      {activeChar.customFields.filter(f => f.category === 'tickbreak').map(field => (
                        <div key={field.id} className="space-y-1.5 relative group/field">
                          <div className="flex justify-between items-center">
                            <span className="text-[12px] font-mono text-purple-400/80 uppercase tracking-widest block">{field.label}</span>
                            <button 
                              type="button"
                              onClick={() => removeCustomField(field.id)}
                              className="text-slate-600 hover:text-red-400 opacity-0 group-hover/field:opacity-100 transition-opacity cursor-pointer p-0.5"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          <input 
                            type="text" 
                            value={field.value} 
                            onChange={e => {
                              setCharacters(characters.map(c => {
                                if (c.id === activeCharId) {
                                  return {
                                    ...c,
                                    customFields: c.customFields.map(f => f.id === field.id ? { ...f, value: e.target.value } : f)
                                  };
                                }
                                return c;
                              }));
                            }}
                            className="w-full bg-[#050608]/90 border border-slate-900/90 focus:border-purple-950/60 rounded-xl p-3.5 text-base text-slate-200 focus:outline-none placeholder-slate-700 font-serif"
                          />
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Add Custom Field Form */}
                  <div className="flex gap-2 items-center pt-4 border-t border-slate-900/40 mt-4">
                    <input 
                      type="text" 
                      placeholder="Add custom field..."
                      value={newFieldLabels['tickbreak'] || ''}
                      onChange={e => setNewFieldLabels({ ...newFieldLabels, tickbreak: e.target.value })}
                      className="bg-[#050608]/90 border border-slate-900/90 focus:border-purple-950/60 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none placeholder-slate-700 flex-1 font-serif"
                    />
                    <button 
                      type="button"
                      onClick={() => {
                        const label = newFieldLabels['tickbreak'] || '';
                        if (!label.trim()) return;
                        addCustomFieldForCategory('tickbreak', label.trim(), '');
                        setNewFieldLabels({ ...newFieldLabels, tickbreak: '' });
                      }}
                      className="px-4 py-2.5 rounded-xl bg-transparent border border-slate-855 hover:border-purple-500/30 text-sm font-mono text-slate-300 hover:text-purple-300 transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
                    >
                      <Plus className="w-4 h-4" /> Field
                    </button>
                  </div>
                </div>

                {/* 7. Dynamic User Custom Categories */}
                {activeChar?.customCategories && activeChar.customCategories.map((categoryName) => (
                  <div key={categoryName} className="bg-[#0c0d12]/40 border border-slate-900/80 rounded-2xl p-6 space-y-5">
                    <div className="flex justify-between items-center border-b border-slate-900/60 pb-3">
                      <h3 className="text-xl font-serif text-white font-semibold">{categoryName}</h3>
                      <button 
                        type="button"
                        onClick={() => {
                          setCharacters(characters.map(c => {
                            if (c.id === activeCharId) {
                              return {
                                ...c,
                                customCategories: (c.customCategories || []).filter(cat => cat !== categoryName),
                                customFields: (c.customFields || []).filter(f => f.category !== categoryName)
                              };
                            }
                            return c;
                          }));
                        }}
                        className="text-slate-500 hover:text-red-400 transition-colors cursor-pointer p-1 bg-slate-950/60 rounded-md border border-slate-900"
                        title="Remove category"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Custom Fields in this category */}
                    {activeChar?.customFields && activeChar.customFields.filter(f => f.category === categoryName).length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {activeChar.customFields.filter(f => f.category === categoryName).map(field => (
                          <div key={field.id} className="space-y-1.5 relative group/field">
                            <div className="flex justify-between items-center">
                              <span className="text-[12px] font-mono text-purple-400/80 uppercase tracking-widest block">{field.label}</span>
                              <button 
                                type="button"
                                onClick={() => removeCustomField(field.id)}
                                className="text-slate-600 hover:text-red-400 opacity-0 group-hover/field:opacity-100 transition-opacity cursor-pointer p-0.5"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                            <input 
                              type="text" 
                              value={field.value} 
                              onChange={e => {
                                setCharacters(characters.map(c => {
                                  if (c.id === activeCharId) {
                                    return {
                                      ...c,
                                      customFields: c.customFields.map(f => f.id === field.id ? { ...f, value: e.target.value } : f)
                                    };
                                  }
                                  return c;
                                }));
                              }}
                              className="w-full bg-[#050608]/90 border border-slate-900/90 focus:border-purple-950/60 rounded-xl p-3.5 text-base text-slate-200 focus:outline-none placeholder-slate-700 font-serif"
                            />
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-slate-600 font-mono italic">No custom fields in this category yet.</p>
                    )}

                    {/* Add Custom Field Form */}
                    <div className="flex gap-2 items-center pt-4 border-t border-slate-900/40 mt-4">
                      <input 
                        type="text" 
                        placeholder="Add custom field..."
                        value={newFieldLabels[categoryName] || ''}
                        onChange={e => setNewFieldLabels({ ...newFieldLabels, [categoryName]: e.target.value })}
                        className="bg-[#050608]/90 border border-slate-900/90 focus:border-purple-950/60 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none placeholder-slate-700 flex-1 font-serif"
                      />
                      <button 
                        type="button"
                        onClick={() => {
                          const label = newFieldLabels[categoryName] || '';
                          if (!label.trim()) return;
                          addCustomFieldForCategory(categoryName, label.trim(), '');
                          setNewFieldLabels({ ...newFieldLabels, [categoryName]: '' });
                        }}
                        className="px-4 py-2.5 rounded-xl bg-transparent border border-slate-855 hover:border-purple-500/30 text-sm font-mono text-slate-300 hover:text-purple-300 transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
                      >
                        <Plus className="w-4 h-4" /> Field
                      </button>
                    </div>
                  </div>
                ))}

                {/* 8. Add Custom Category Card */}
                <div className="border border-dashed border-purple-900/45 bg-[#0d091b]/15 p-6 rounded-2xl space-y-4">
                  <h3 className="text-base font-serif text-white font-semibold flex items-center gap-1.5">
                    <Plus className="w-4 h-4 text-purple-400" /> Add Custom Category
                  </h3>
                  
                  <div className="flex gap-3">
                    <input 
                      type="text" 
                      placeholder="e.g. Powers & Abilities"
                      value={newCategoryName}
                      onChange={e => setNewCategoryName(e.target.value)}
                      className="bg-[#050608]/90 border border-slate-900/90 focus:border-purple-950/60 rounded-xl px-4 py-3 text-base text-slate-200 focus:outline-none placeholder-slate-700 flex-1 font-serif"
                    />
                    <button 
                      type="button"
                      onClick={addCustomCategory}
                      className="px-5 py-3 rounded-xl bg-gradient-to-r from-purple-700 to-indigo-700 hover:from-purple-600 hover:to-indigo-600 text-sm font-medium text-white transition-all flex items-center justify-center gap-1.5 shadow-[0_0_15px_rgba(147,51,234,0.25)] cursor-pointer whitespace-nowrap"
                    >
                      <Plus className="w-4 h-4" /> Add Category
                    </button>
                  </div>
                </div>

              </div>
            </div>
          );
        })()}

        {/* ==========================================================================
            TAB: RELATIONSHIP CANVAS (WHITEBOARD CONSPIRACY)
            ========================================================================== */}
        {activeTab === 'relationships' && (
          <div className="p-6 space-y-6 relative min-h-[500px]">
            {!user && <AuthOverlay message="Sign in to drag character nodes and link relationships on the conspiracy whiteboard." />}
            
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <p className="text-sm text-slate-400 font-light leading-relaxed">
                  Drag handles to draw relationships. Double-click a node label to rename.
                </p>
              </div>

              {/* Action Toolbar buttons */}
              <div className="flex gap-2 shrink-0">
                <button
                  type="button"
                  onClick={handleWhiteboardAddCharacter}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-855 border border-slate-800 rounded-xl text-xs font-mono text-slate-350 hover:text-white transition-all cursor-pointer flex items-center gap-1.5 font-bold"
                >
                  <Plus className="w-3.5 h-3.5" /> Character
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (window.confirm("Are you sure you want to clear the whiteboard canvas?")) {
                      setConnections([]);
                    }
                  }}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-855 border border-slate-800 rounded-xl text-xs font-mono text-slate-355 hover:text-white transition-all cursor-pointer flex items-center gap-1.5 font-bold"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Clear
                </button>
              </div>
            </div>

            {/* Whiteboard Interactive Zone */}
            <div 
              ref={whiteboardRef}
              onMouseMove={handleWhiteboardMouseMove}
              onMouseLeave={handleWhiteboardMouseUp}
              onMouseUp={handleWhiteboardMouseUp}
              className="relative h-[400px] w-full bg-[#08090d] border border-slate-800/80 rounded-2xl overflow-hidden shadow-inner"
              style={{
                backgroundImage: 'radial-gradient(rgba(139, 92, 246, 0.05) 1.5px, transparent 1.5px)',
                backgroundSize: '24px 24px'
              }}
            >
              {/* Render SVG connection arrows */}
              <svg className="absolute inset-0 pointer-events-none w-full h-full">
                <defs>
                  <marker id="arrow" viewBox="0 0 10 10" refX="12" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                    <path d="M0,0 L10,5 L0,10 z" fill="#a855f7" />
                  </marker>
                </defs>

                {connections.map((conn, idx) => {
                  const fromCharExists = characters.some(c => c.id === conn.from);
                  const toCharExists = characters.some(c => c.id === conn.to);
                  if (!fromCharExists || !toCharExists) return null;

                  const fromPos = nodePositions[conn.from];
                  const toPos = nodePositions[conn.to];
                  if (!fromPos || !toPos) return null;

                  // Anchor coordinates
                  const p1 = conn.fromAnchor 
                    ? getAnchorCoords(conn.from, conn.fromAnchor) 
                    : { x: fromPos.x + 55, y: fromPos.y + 18 };
                  const p2 = conn.toAnchor 
                    ? getAnchorCoords(conn.to, conn.toAnchor) 
                    : { x: toPos.x + 55, y: toPos.y + 18 };

                  // Bezier curve path string
                  const pathStr = getBezierPath(p1, p2, conn.fromAnchor || 'bottom', conn.toAnchor || 'top');

                  // Text label coordinates at mid-curve
                  const midX = (p1.x + p2.x) / 2;
                  const midY = (p1.y + p2.y) / 2;

                  const labelText = conn.label || 'Connected';
                  const charCount = labelText.length;
                  const badgeWidth = Math.max(75, charCount * 6.5 + 24);
                  const badgeHeight = 18;
                  const rx = badgeHeight / 2;

                  const rectX = midX - badgeWidth / 2;
                  const rectY = midY - badgeHeight / 2;
                  const deleteCenterX = rectX + badgeWidth - 10;
                  const deleteCenterY = rectY + badgeHeight / 2;

                  return (
                    <g key={idx}>
                      <path 
                        d={pathStr} 
                        stroke="rgba(168, 85, 247, 0.6)" 
                        strokeWidth="1.5" 
                        strokeDasharray="4 4"
                        fill="none"
                        markerEnd="url(#arrow)" 
                      />
                      
                      {/* Pill backdrop */}
                      <rect 
                        x={rectX} 
                        y={rectY} 
                        width={badgeWidth} 
                        height={badgeHeight} 
                        rx={rx} 
                        fill="#08090d" 
                        stroke="rgba(168, 85, 247, 0.4)" 
                        strokeWidth="1" 
                        className="shadow-md"
                      />

                      {/* Interactive Rename Zone */}
                      <g 
                        className="pointer-events-auto cursor-pointer group/rename"
                        onClick={(e) => {
                          e.stopPropagation();
                          const newLabel = window.prompt("Edit relationship label:", labelText);
                          if (newLabel !== null) {
                            setConnections(connections.map((c, i) => i === idx ? { ...c, label: newLabel.trim() || 'Connected' } : c));
                          }
                        }}
                      >
                        <rect 
                          x={rectX} 
                          y={rectY} 
                          width={badgeWidth - 18} 
                          height={badgeHeight} 
                          rx={rx} 
                          fill="transparent" 
                        />
                        <text 
                          x={rectX + (badgeWidth - 18) / 2 + 1} 
                          y={rectY + badgeHeight / 2 + 3} 
                          fill="#c084fc" 
                          fontSize="8" 
                          fontFamily="monospace"
                          textAnchor="middle" 
                          className="uppercase tracking-wider font-semibold select-none group-hover/rename:fill-purple-300 transition-colors"
                        >
                          {labelText}
                        </text>
                      </g>

                      {/* Interactive Delete Zone */}
                      <g 
                        className="pointer-events-auto cursor-pointer group/del"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (window.confirm(`Delete the relationship "${labelText}"?`)) {
                            setConnections(connections.filter((_, i) => i !== idx));
                          }
                        }}
                      >
                        <rect 
                          x={rectX + badgeWidth - 18} 
                          y={rectY} 
                          width={18} 
                          height={badgeHeight} 
                          rx={rx} 
                          fill="transparent" 
                        />
                        <circle 
                          cx={deleteCenterX} 
                          cy={deleteCenterY} 
                          r="5.5" 
                          fill="rgba(239, 68, 68, 0.15)" 
                          stroke="rgba(239, 68, 68, 0.3)" 
                          strokeWidth="0.5" 
                          className="group-hover/del:fill-red-500 group-hover/del:stroke-red-400 transition-all" 
                        />
                        <text 
                          x={deleteCenterX} 
                          y={deleteCenterY + 2.5} 
                          fill="#ef4444" 
                          fontSize="8" 
                          textAnchor="middle" 
                          className="font-bold select-none group-hover/del:fill-white transition-colors"
                        >
                          ×
                        </text>
                      </g>
                    </g>
                  );
                })}

                {/* Render active dragging line in real-time */}
                {drawingFromNodeId && (() => {
                  const p1 = getAnchorCoords(drawingFromNodeId, drawingFromAnchor);
                  const p2 = currentMousePos;
                  const pathStr = getBezierPath(p1, p2, drawingFromAnchor, 'top');
                  return (
                    <path 
                      d={pathStr}
                      stroke="rgba(168, 85, 247, 0.8)" 
                      strokeWidth="1.5" 
                      strokeDasharray="4 4"
                      fill="none"
                    />
                  );
                })()}
              </svg>

              {/* Render draggable rounded-full character nodes exactly matching mockups */}
              {characters.map(char => {
                const pos = nodePositions[char.id] || { x: 50, y: 50 };
                const isDragging = draggingNodeId === char.id;
                return (
                  <div
                    key={char.id}
                    onMouseDown={(e) => handleWhiteboardMouseDown(e, char.id)}
                    onMouseUp={() => handleNodeMouseUp(char.id)}
                    onDoubleClick={() => {
                      setRenamingCharId(char.id);
                      setRenamingNameVal(char.name);
                    }}
                    className={`absolute rounded-full border bg-[#0d0a15]/95 px-5 py-2 flex items-center justify-center min-w-[110px] h-[36px] shadow-lg select-none transition-colors ${
                      isDragging 
                        ? 'border-purple-500 shadow-purple-500/10 cursor-grabbing' 
                        : 'border-slate-800 hover:border-purple-500/40 hover:bg-[#120f24]/80 cursor-grab'
                    }`}
                    style={{ left: pos.x, top: pos.y }}
                  >
                    {renamingCharId === char.id ? (
                      <input
                        type="text"
                        value={renamingNameVal}
                        onChange={e => setRenamingNameVal(e.target.value)}
                        onBlur={() => saveRename(char.id)}
                        onKeyDown={e => {
                          if (e.key === 'Enter') saveRename(char.id);
                          if (e.key === 'Escape') setRenamingCharId(null);
                        }}
                        className="bg-transparent text-slate-100 text-xs font-sans font-semibold text-center focus:outline-none w-20 border-b border-purple-500"
                        autoFocus
                        onMouseDown={e => e.stopPropagation()}
                      />
                    ) : (
                      <span className="text-slate-200 font-sans text-xs font-medium tracking-wide">
                        {char.name}
                      </span>
                    )}

                    {/* Drag anchors handles (top, right, bottom, left) */}
                    <div 
                      onMouseDown={(e) => startDrawingConnection(e, char.id, 'top')}
                      onMouseUp={(e) => handleAnchorMouseUp(e, char.id, 'top')}
                      className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-purple-500/70 hover:bg-purple-400 hover:scale-125 cursor-crosshair transition-all" 
                      title="Drag to connect"
                    />
                    <div 
                      onMouseDown={(e) => startDrawingConnection(e, char.id, 'right')}
                      onMouseUp={(e) => handleAnchorMouseUp(e, char.id, 'right')}
                      className="absolute right-0 top-1/2 translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-purple-500/70 hover:bg-purple-400 hover:scale-125 cursor-crosshair transition-all" 
                      title="Drag to connect"
                    />
                    <div 
                      onMouseDown={(e) => startDrawingConnection(e, char.id, 'bottom')}
                      onMouseUp={(e) => handleAnchorMouseUp(e, char.id, 'bottom')}
                      className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-1.5 h-1.5 rounded-full bg-purple-500/70 hover:bg-purple-400 hover:scale-125 cursor-crosshair transition-all" 
                      title="Drag to connect"
                    />
                    <div 
                      onMouseDown={(e) => startDrawingConnection(e, char.id, 'left')}
                      onMouseUp={(e) => handleAnchorMouseUp(e, char.id, 'left')}
                      className="absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-purple-500/70 hover:bg-purple-400 hover:scale-125 cursor-crosshair transition-all" 
                      title="Drag to connect"
                    />
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
          <div className="p-6 space-y-8 relative max-h-[500px] overflow-y-auto pr-2">
            {!user && <AuthOverlay message="Sign in to save and modify world building blueprints." />}
            
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h3 className="text-xl font-serif text-white flex items-center gap-2">
                  <Globe className="w-5 h-5 text-purple-400" /> World Building Lab
                </h3>
                <p className="text-xs font-mono text-slate-400 tracking-wide mt-0.5 uppercase">CHRONICLING THE MATRIX, ARCHITECTURES, AND LAWS OF YOUR UNIVERSE</p>
              </div>
            </div>

            {/* Dynamic Category Card Grid matching the mockups exactly */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {worldCategories.map((category) => {
                const isCustom = category.id.startsWith('custom_');
                return (
                  <div key={category.id} className="bg-[#0b0c10]/40 border border-slate-800 rounded-2xl p-5 space-y-3.5 relative">
                    <div className="flex justify-between items-center">
                      <h4 className="text-lg font-serif font-medium text-slate-100">{category.title}</h4>
                      {isCustom && user && (
                        <button
                          type="button"
                          onClick={() => {
                            setWorldCategories(worldCategories.filter(c => c.id !== category.id));
                          }}
                          className="text-slate-650 hover:text-red-400 cursor-pointer p-1 transition-colors border-none bg-transparent"
                          title="Remove custom category"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                    <textarea 
                      value={category.value}
                      placeholder={category.placeholder}
                      disabled={!user}
                      onChange={e => {
                        setWorldCategories(worldCategories.map(c => c.id === category.id ? { ...c, value: e.target.value } : c));
                      }}
                      className="w-full bg-[#050608]/90 border border-[#0f121d] focus:border-purple-950/60 rounded-xl p-3.5 text-xs sm:text-sm text-slate-300 focus:outline-none placeholder-slate-650 h-28 resize-none font-sans leading-relaxed"
                    />
                  </div>
                );
              })}
            </div>

            {/* Add Custom Category Form Bar at the very bottom */}
            {user && (
              <div className="bg-[#0d091b]/10 border border-dashed border-purple-900/40 p-5 rounded-2xl space-y-4">
                <div className="flex flex-col sm:flex-row gap-3 items-center">
                  <input 
                    type="text" 
                    placeholder="Custom category name..."
                    value={newWorldCategoryName}
                    onChange={e => setNewWorldCategoryName(e.target.value)}
                    className="w-full sm:w-80 bg-slate-950 border border-slate-850 focus:border-purple-500/30 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none placeholder-slate-600 font-mono"
                  />
                  <button 
                    type="button"
                    onClick={() => {
                      if (!newWorldCategoryName.trim()) return;
                      const title = newWorldCategoryName.trim();
                      const newCat = {
                        id: `custom_${Date.now()}`,
                        title,
                        placeholder: `Describe the ${title.toLowerCase()} of your world...`,
                        value: ''
                      };
                      setWorldCategories([...worldCategories, newCat]);
                      setNewWorldCategoryName('');
                    }}
                    className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-800 text-xs font-mono font-bold text-slate-300 hover:text-white transition-all flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap"
                  >
                    <Plus className="w-4 h-4" /> Add Custom Category
                  </button>
                </div>
              </div>
            )}
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
            
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h3 className="text-xl font-serif text-white flex items-center gap-2">
                  <List className="w-5 h-5 text-purple-400" /> Draggable Plot Points
                </h3>
                <p className="text-xs font-mono text-slate-400 tracking-wide mt-0.5">DRAG AND DROP STORY ARCHITECTURE — DESIGN NARRATIVE MOMENTS IN VECTOR TIMELINES</p>
              </div>

              {user && (
                <button 
                  onClick={() => setIsAddPlotOpen(true)}
                  className="px-4 py-2 bg-purple-900/20 hover:bg-purple-900/40 border border-purple-800/40 rounded-xl text-sm font-mono text-purple-300 transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
                >
                  <Plus className="w-4 h-4" /> Add Plot Point
                </button>
              )}
            </div>

            {/* Draggable Plot Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 pt-4">
              {plots.map((plot, idx) => {
                const isEditing = editingPlotId === plot.id;
                return (
                  <div
                    key={plot.id}
                    draggable={isEditing ? "false" : (user ? "true" : "false")}
                    onDragStart={isEditing ? undefined : () => handleDragStart(idx)}
                    onDragOver={isEditing ? undefined : (e) => handleDragOver(e, idx)}
                    onDragEnd={isEditing ? undefined : handleDragEnd}
                    className={`bg-[#0d0a15]/80 border rounded-2xl p-4 min-h-[180px] flex flex-col justify-between transition-all ${
                      isEditing
                        ? 'border-purple-500 bg-[#120f1f]'
                        : draggedPlotIndex === idx 
                        ? 'border-purple-500 bg-purple-950/30 scale-95 shadow-2xl opacity-50' 
                        : 'border-slate-800/80 hover:border-purple-500/30 hover:bg-[#120f1f]/50'
                    } ${!isEditing && user ? 'cursor-grab active:cursor-grabbing' : ''}`}
                  >
                    {isEditing ? (
                      <div className="space-y-2.5 w-full flex-1 flex flex-col justify-between">
                        <div className="space-y-2">
                          <select
                            value={editingPlotData.stage}
                            onChange={e => setEditingPlotData({ ...editingPlotData, stage: e.target.value })}
                            className="w-full bg-slate-950 border border-slate-800 p-1.5 rounded-lg text-[10px] font-mono font-bold text-purple-400 uppercase focus:outline-none focus:border-purple-500 cursor-pointer"
                          >
                            <option>Introduction</option>
                            <option>Conflict</option>
                            <option>Climax</option>
                            <option>Twist</option>
                            <option>Resolution</option>
                          </select>
                          <input
                            type="text"
                            value={editingPlotData.title}
                            onChange={e => setEditingPlotData({ ...editingPlotData, title: e.target.value })}
                            className="w-full bg-slate-950 border border-slate-800 px-2 py-1 rounded-lg text-xs font-serif text-slate-100 focus:outline-none focus:border-purple-500"
                            placeholder="Plot Title"
                          />
                          <textarea
                            value={editingPlotData.desc}
                            onChange={e => setEditingPlotData({ ...editingPlotData, desc: e.target.value })}
                            className="w-full bg-slate-950 border border-slate-800 px-2 py-1 rounded-lg text-xs font-light text-slate-350 focus:outline-none focus:border-purple-500 h-20 resize-none font-sans leading-normal"
                            placeholder="Plot Description"
                          />
                        </div>
                        <div className="border-t border-slate-900/60 pt-2 flex justify-end gap-1.5 text-[10px] font-mono">
                          <button
                            type="button"
                            onClick={() => setEditingPlotId(null)}
                            className="px-2 py-1 bg-slate-900 hover:bg-slate-855 text-slate-400 rounded-md cursor-pointer transition-colors border-none"
                          >
                            Cancel
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setPlots(plots.map(p => p.id === plot.id ? { ...p, ...editingPlotData } : p));
                              setEditingPlotId(null);
                            }}
                            className="px-2 py-1 bg-purple-600 hover:bg-purple-500 text-white rounded-md cursor-pointer transition-colors font-bold border-none"
                          >
                            Save
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="space-y-2">
                          <span className="text-xs font-mono text-purple-400 font-bold uppercase tracking-wider block bg-purple-950/20 border border-purple-900/30 w-max px-2 py-0.5 rounded">
                            {plot.stage}
                          </span>
                          <h4 className="font-serif font-medium text-slate-100 text-sm">{plot.title}</h4>
                          <p className="text-xs text-slate-400 leading-normal font-light">{plot.desc}</p>
                        </div>
                        <div className="border-t border-slate-900/60 pt-2 flex justify-between items-center text-xs font-mono text-slate-500">
                          <span>Index 0{idx + 1}</span>
                          <div className="flex items-center gap-1.5">
                            {user && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setEditingPlotId(plot.id);
                                  setEditingPlotData({ stage: plot.stage, title: plot.title, desc: plot.desc });
                                }}
                                className="text-slate-600 hover:text-purple-400 cursor-pointer p-0.5 transition-colors border-none bg-transparent"
                                title="Edit plot point"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>
                            )}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setPlots(plots.filter(p => p.id !== plot.id));
                              }}
                              className="text-slate-600 hover:text-red-400 cursor-pointer p-0.5 transition-colors border-none bg-transparent"
                              title="Delete plot point"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                );
              })}

              {/* Add Plot Point Card as last grid item */}
              {user && (
                <button
                  onClick={() => setIsAddPlotOpen(true)}
                  className="border-2 border-dashed border-slate-800/80 hover:border-purple-500/40 bg-slate-950/10 hover:bg-[#120f1f]/20 rounded-2xl p-4 min-h-[160px] flex flex-col items-center justify-center gap-2 transition-all cursor-pointer group"
                >
                  <Plus className="w-6 h-6 text-slate-650 group-hover:text-purple-400 transition-colors animate-pulse" />
                  <span className="text-xs font-mono text-slate-500 group-hover:text-purple-300 transition-colors font-bold uppercase tracking-wider">Add Plot Card</span>
                </button>
              )}
            </div>

            {/* Add Plot Point Modal */}
            {isAddPlotOpen && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
                <div className="relative w-full max-w-md p-6 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl space-y-4">
                  <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                    <h3 className="text-lg font-serif text-white font-medium">Create New Plot Card</h3>
                    <button 
                      onClick={() => setIsAddPlotOpen(false)}
                      className="text-slate-400 hover:text-white transition-colors cursor-pointer text-xl"
                    >
                      &times;
                    </button>
                  </div>

                  <form onSubmit={addPlotPoint} className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-mono text-slate-500 uppercase block">Narrative Stage</label>
                      <select
                        value={newPlot.stage}
                        onChange={e => setNewPlot({...newPlot, stage: e.target.value})}
                        className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded-lg focus:outline-none focus:border-purple-500/30 text-slate-300 text-sm"
                      >
                        <option>Introduction</option>
                        <option>Conflict</option>
                        <option>Climax</option>
                        <option>Twist</option>
                        <option>Resolution</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-mono text-slate-500 uppercase block">Plot Title</label>
                      <input 
                        type="text" 
                        placeholder="e.g. The Discovery..." 
                        value={newPlot.title}
                        onChange={e => setNewPlot({...newPlot, title: e.target.value})}
                        className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded-lg focus:outline-none focus:border-purple-500/30 text-slate-200 text-sm"
                        required
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-mono text-slate-500 uppercase block">Plot Description / Core Event</label>
                      <textarea 
                        placeholder="Describe what occurs during this narrative milestone..." 
                        value={newPlot.desc}
                        onChange={e => setNewPlot({...newPlot, desc: e.target.value})}
                        className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded-lg focus:outline-none focus:border-purple-500/30 text-slate-200 text-sm h-24 resize-none"
                        required
                      />
                    </div>

                    <button 
                      type="submit" 
                      className="w-full py-2.5 rounded-xl bg-purple-650 hover:bg-purple-600 text-white font-medium text-sm transition-colors cursor-pointer font-mono uppercase tracking-wider text-xs"
                    >
                      Append Plot Card
                    </button>
                  </form>
                </div>
              </div>
            )}
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
          <WritingSuiteView key={bookId} bookId={bookId} />
        )}
      </div>
    </div>
  );
}
