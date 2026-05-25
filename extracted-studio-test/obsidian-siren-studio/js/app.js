/* 
   ==========================================================================
   OBSIDIAN SIREN STUDIO — MAIN ROUTER & GLOBAL STORE
   ==========================================================================
*/

import { renderSidebar } from './sidebar.js';
import { Home } from './pages/home.js';
import { Planning } from './pages/planning.js';
import { WritingSuite } from './pages/writing.js';
import { BookFormatting } from './pages/formatting.js';
import { CoverStudio } from './pages/cover.js';
import { ResearchVault } from './pages/vault.js';
import { Scriptorium } from './pages/scriptorium.js';
import { Citations } from './pages/citations.js';
import { ExpertSanctuary } from './pages/sanctuary.js';
import { MyLibrary } from './pages/library.js';
import { AskObsidian } from './pages/help.js';
import { Settings } from './pages/settings.js';

// Namespace for LocalStorage Persistence
const PERSIST_KEY_PREFIX = 'obsidian.persist.';

class StudioStore {
    constructor() {
        this.state = {
            user: this.load('user', null),
            mode: this.load('mode', 'fiction'), // 'fiction' (Weaver) or 'academic' (Scholar)
            theme: this.load('theme', 'dark'), // 'dark' or 'light'
            
            // Weaver Path (Fiction) Data Store
            synopsis: this.load('synopsis', {
                title: 'The Obsidian Siren',
                premise: 'A deep-sea archaeologist uncovers an obsidian statue that whispers ancient stories to anyone who formats it.',
                theme: 'Ambition, mystery, and the weight of forgotten histories.'
            }),
            characters: this.load('characters', [
                {
                    id: '1',
                    name: 'Dr. Lekhaa Vance',
                    gender: 'Female',
                    species: 'Human',
                    role: 'Protagonist',
                    fields: {
                        'Personality & Psychology': {
                            'Traits': 'Obsessive, brilliant, cautious',
                            'Fears': 'Losing her sanity to the deep sea',
                            'Motivations': 'Exposing the truth behind the obsidian ruins'
                        },
                        'Physical Description': {
                            'Appearance': 'Wind-swept dark curls, calloused hands, silver-rimmed spectacles',
                            'Clothing Style': 'Durable utility coats, dive gear, heavy leather boots'
                        },
                        'Backstory': {
                            'Key Life Events': 'Discovered a submerged temple off the coast of Siren Island in 2024'
                        }
                    }
                }
            ]),
            manuscript: this.load('manuscript', {
                freeflow: 'The sea was a restless inkwell tonight. Lekhaa stared into the obsidian waters, listening to the soft humming that vibrated through the deck. It was the same pitch as the sculpture sitting inside her trunk, wrapped in heavy velvet...',
                chapters: [
                    { id: 'c1', title: 'Chapter 1: The Singing Deep', content: 'Lekhaa stood at the helm of the ship. Rain lashed at her face, cold and needle-sharp. Inside the wooden chest lay the siren statue, humming a tune that only she could hear.' },
                    { id: 'c2', title: 'Chapter 2: The Whispered Ink', content: 'When the ink dried on the parchment, it formed symbols that she had never learned. Yet, her fingers moved across the keys, translating the siren\'s song in real-time.' }
                ],
                activeChapterId: 'c1'
            }),
            media: this.load('media', [
                { id: 'm1', name: 'Dr Lekhaa Sketch', url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&q=80' },
                { id: 'm2', name: 'Obsidian Temple', url: 'https://images.unsplash.com/photo-1479162511910-a11a94d21e6e?w=300&q=80' }
            ]),
            coverSettings: this.load('coverSettings', {
                genre: 'Dark Fantasy',
                subject: 'A mysterious obsidian statue glowing underwater',
                environment: 'Deep sea depths with faint shafts of moonlight',
                extra: 'Vibrant purple currents wrapped around the statue',
                aiPrompt: '',
                aiImage: '',
                canvasData: null,
                title: 'OBSIDIAN SIREN',
                titleX: 160,
                titleY: 100,
                brushColor: '#9b51e0',
                brushSize: 5
            }),
            
            // Scholar Path (Academic) Data Store
            sources: this.load('sources', [
                { id: 's1', name: 'vance_siren_temples_2025.pdf', size: '2.4 MB', status: 'indexed', date: 'May 10, 2026' },
                { id: 's2', name: 'deep_sea_archeology_manual.pdf', size: '8.1 MB', status: 'indexed', date: 'May 18, 2026' }
            ]),
            citations: this.load('citations', {
                author: 'Vance, Lekhaa',
                title: 'The Submerged Temples of the Obsidian Basin',
                journal: 'Journal of Maritime Cryptography',
                year: '2025',
                pages: '112-145',
                publisher: 'Siren Island Press'
            }),
            thesisDraft: this.load('thesisDraft', 'This research outlines the stratigraphical evidence uncovered at the primary site of the Obsidian Basin. According to the preliminary samples analyzed in Vance (2025), the mineral composition of the temple blocks indicates an advanced metallurgical technique previously undocumented. Further investigation in manual archives support the thesis that these structures predate the Late Bronze Age collapse [verify].'),
            chatHistory: this.load('chatHistory', [
                { role: 'assistant', content: 'Welcome, Scholar. I have indexed the 2 research papers in your Source Vault. Ask me anything to draft and synthesize grounded arguments.' }
            ]),
            
            // Sanctuary (Editorial) Uploads
            editorialUploads: this.load('editorialUploads', [])
        };
    }

    // Load data safely from localStorage
    load(key, defaultValue) {
        try {
            const data = localStorage.getItem(PERSIST_KEY_PREFIX + key);
            return data ? JSON.parse(data) : defaultValue;
        } catch (e) {
            console.error('Error loading persist key:', key, e);
            return defaultValue;
        }
    }

    // Save data safely to localStorage
    save(key, value) {
        try {
            this.state[key] = value;
            localStorage.setItem(PERSIST_KEY_PREFIX + key, JSON.stringify(value));
            
            // Trigger state change events
            const event = new CustomEvent('obsidian-state-changed', { detail: { key, value } });
            window.dispatchEvent(event);
        } catch (e) {
            console.error('Error saving persist key:', key, e);
        }
    }
}

export const Store = new StudioStore();

// ==========================================================================
// SPA ROUTER IMPLEMENTATION
// ==========================================================================

const ROUTES = {
    '#': Home,
    '#/': Home,
    '#/auth': Home, // Home handles auth states organically
    '#/planning': Planning,
    '#/writing': WritingSuite,
    '#/formatting': BookFormatting,
    '#/studio': CoverStudio,
    '#/research/vault': ResearchVault,
    '#/research/scriptorium': Scriptorium,
    '#/research/citations': Citations,
    '#/sanctuary': ExpertSanctuary,
    '#/library': MyLibrary,
    '#/help': AskObsidian,
    '#/settings': Settings
};

export function navigate(hashPath) {
    window.location.hash = hashPath;
}

function router() {
    let hash = window.location.hash || '#/';
    
    // Normalize path (handle root case or direct paths)
    if (hash === '') hash = '#/';
    
    const pageContainer = document.getElementById('app-content');
    const sidebarElement = document.getElementById('app-sidebar');
    
    // If not signed in, lock the pages except landing page
    if (!Store.state.user && hash !== '#/' && hash !== '#') {
        showToast('Please sign in to access the studio tools.', 'error');
        window.location.hash = '#/';
        return;
    }
    
    // Select Page component
    const PageComponent = ROUTES[hash] || Home;
    
    // Manage Sidebar visibility based on routing
    if (!Store.state.user || hash === '#/' || hash === '#') {
        sidebarElement.classList.add('hidden');
    } else {
        sidebarElement.classList.remove('hidden');
        renderSidebar(sidebarElement);
    }
    
    // Render the page
    if (pageContainer) {
        pageContainer.innerHTML = '';
        pageContainer.classList.add('fade-in');
        
        // Render current page content
        const renderedPage = PageComponent();
        if (typeof renderedPage === 'string') {
            pageContainer.innerHTML = renderedPage;
        } else if (renderedPage instanceof HTMLElement) {
            pageContainer.appendChild(renderedPage);
        }
        
        // Execute dynamic scripts if provided by page components
        if (PageComponent.init) {
            // Delay slightly to ensure elements are fully painted in DOM
            setTimeout(() => PageComponent.init(), 50);
        }
    }
}

// ==========================================================================
// TOAST & DIALOG BOX UTILITIES
// ==========================================================================

export function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    if (!toast) return;
    
    toast.textContent = message;
    toast.className = `toast show ${type === 'error' ? 'error' : ''}`;
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

export function showDialog(htmlContent, onInit = null) {
    const overlay = document.getElementById('dialog-root');
    const body = document.getElementById('dialog-body');
    if (!overlay || !body) return;
    
    body.innerHTML = htmlContent;
    overlay.classList.add('show');
    
    if (onInit) {
        onInit(body);
    }
}

function closeDialog() {
    const overlay = document.getElementById('dialog-root');
    if (overlay) {
        overlay.classList.remove('show');
    }
}

// ==========================================================================
// APP INITIALIZATION
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
    // Synchronize Theme Stylesheet
    if (Store.state.theme === 'light') {
        document.body.classList.add('light-mode');
    } else {
        document.body.classList.remove('light-mode');
    }
    
    // Set up global router event listeners
    window.addEventListener('hashchange', router);
    
    // Set up dialog dismiss click event
    const closeBtn = document.getElementById('dialog-close-btn');
    if (closeBtn) {
        closeBtn.addEventListener('click', closeDialog);
    }
    
    const dialogRoot = document.getElementById('dialog-root');
    if (dialogRoot) {
        dialogRoot.addEventListener('click', (e) => {
            if (e.target === dialogRoot) closeDialog();
        });
    }
    
    // Initial Route trigger
    router();
});
