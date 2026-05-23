/* 
   ==========================================================================
   OBSIDIAN SIREN STUDIO — NAVIGATION SIDEBAR COMPONENT
   ==========================================================================
*/

import { Store, navigate, showToast } from './app.js';

// SVG Path definitions for Lucide Icons
const ICONS = {
    feather: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12.67 19a2 2 0 0 0 1.416-.588l6.154-6.172a6 6 0 0 0-8.49-8.49L5.586 9.914A2 2 0 0 0 5 11.328V18a1 1 0 0 0 1 1z"></path><path d="M16 8 2 22"></path><path d="M17.5 15H9"></path></svg>',
    bookOpen: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg>',
    fileText: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"></path><path d="M14 2v4a2 2 0 0 0 2 2h4"></path><path d="M10 9H8"></path><path d="M16 13H8"></path><path d="M16 17H8"></path></svg>',
    palette: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="13.5" cy="6.5" r=".5" fill="currentColor"></circle><circle cx="17.5" cy="10.5" r=".5" fill="currentColor"></circle><circle cx="8.5" cy="7.5" r=".5" fill="currentColor"></circle><circle cx="6.5" cy="12.5" r=".5" fill="currentColor"></circle><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.92 0 1.63-.77 1.63-1.7 0-.42-.15-.82-.41-1.16-.08-.1-.13-.23-.13-.36 0-.28.22-.5.5-.5h1.64c5.38 0 9.77-4.39 9.77-9.77C22 6.13 17.5 2 12 2Z"></path></svg>',
    compass: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polygon points="16.24 7.76 14.43 13.18 8.76 16.24 10.57 10.82 16.24 7.76"></polygon></svg>',
    database: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3"></ellipse><path d="M3 5V19A9 3 0 0 0 21 19V5"></path><path d="M3 12A9 3 0 0 0 21 12"></path></svg>',
    bookMarked: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 2v8l3-3 3 3V2"></path><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20"></path></svg>',
    copy: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"></rect><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"></path></svg>',
    library: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m16 6 4 14"></path><path d="M12 6v14"></path><path d="M8 8v12"></path><path d="M4 4v16"></path></svg>',
    help: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><path d="M12 17h.01"></path></svg>',
    settings: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.1a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path><circle cx="12" cy="12" r="3"></circle></svg>',
    logout: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" x2="9" y1="12" y2="12"></line></svg>',
    logoMark: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"></path></svg>'
};

export function renderSidebar(asideElement) {
    if (!asideElement) return;
    
    const user = Store.state.user || {};
    const mode = Store.state.mode || 'fiction';
    const activeHash = window.location.hash || '#/';
    
    // Split user initials for avatar
    const initials = user.email 
        ? user.email.slice(0, 2).toUpperCase()
        : 'S';
    
    // Generate Sidebar Content
    asideElement.innerHTML = `
        <!-- Sidebar Brand Header -->
        <div class="sidebar-header">
            <div class="sidebar-brand">
                <span class="sidebar-title">Obsidian Siren</span>
                <span class="sidebar-subtitle">Siren Studio</span>
            </div>
        </div>
        
        <!-- Mode Switcher Section -->
        <div class="sidebar-mode-section">
            <div class="sidebar-mode-toggle">
                <div class="mode-toggle-label">
                    <span>${mode === 'fiction' ? 'Weaver Mode' : 'Scholar Mode'}</span>
                </div>
                <label class="switch" title="Toggle Weaver / Scholar craft modes">
                    <input type="checkbox" id="sidebar-craft-mode-cb" ${mode === 'academic' ? 'checked' : ''}>
                    <span class="switch-slider"></span>
                </label>
            </div>
        </div>
        
        <!-- Navigation Menu Links -->
        <nav class="sidebar-menu-list">
            <!-- Dynamic Path Category -->
            <div class="sidebar-menu-category">${mode === 'fiction' ? 'Fiction Studio' : 'Academic Sanctum'}</div>
            
            ${mode === 'fiction' ? `
                <!-- Fiction: The Weaver's Path -->
                <a href="#/planning" class="sidebar-menu-item ${activeHash === '#/planning' ? 'active' : ''}">
                    ${ICONS.feather}
                    <span>Planning & Drafting</span>
                </a>
                <a href="#/writing" class="sidebar-menu-item ${activeHash === '#/writing' ? 'active' : ''}">
                    ${ICONS.bookOpen}
                    <span>Writing Suite</span>
                </a>
                <a href="#/formatting" class="sidebar-menu-item ${activeHash === '#/formatting' ? 'active' : ''}">
                    ${ICONS.fileText}
                    <span>Book Formatting</span>
                </a>
                <a href="#/studio" class="sidebar-menu-item ${activeHash === '#/studio' ? 'active' : ''}">
                    ${ICONS.palette}
                    <span>Cover Studio</span>
                </a>
                <a href="#/sanctuary" class="sidebar-menu-item ${activeHash === '#/sanctuary' ? 'active' : ''}">
                    ${ICONS.compass}
                    <span>Expert Consultation</span>
                </a>
            ` : `
                <!-- Academic: The Scholar's Sanctum -->
                <a href="#/research/vault" class="sidebar-menu-item ${activeHash === '#/research/vault' ? 'active' : ''}">
                    ${ICONS.database}
                    <span>Research Vault</span>
                </a>
                <a href="#/research/scriptorium" class="sidebar-menu-item ${activeHash === '#/research/scriptorium' ? 'active' : ''}">
                    ${ICONS.bookMarked}
                    <span>Scriptorium (Writing)</span>
                </a>
                <a href="#/research/citations" class="sidebar-menu-item ${activeHash === '#/research/citations' ? 'active' : ''}">
                    ${ICONS.copy}
                    <span>Citations Forge</span>
                </a>
                <a href="#/sanctuary" class="sidebar-menu-item ${activeHash === '#/sanctuary' ? 'active' : ''}">
                    ${ICONS.compass}
                    <span>Expert Consultation</span>
                </a>
            `}
            
            <!-- Global Utilities Category -->
            <div class="sidebar-menu-category">Atelier Utilities</div>
            <a href="#/library" class="sidebar-menu-item ${activeHash === '#/library' ? 'active' : ''}">
                ${ICONS.library}
                <span>My Library</span>
            </a>
            <a href="#/help" class="sidebar-menu-item ${activeHash === '#/help' ? 'active' : ''}">
                ${ICONS.help}
                <span>Ask Obsidian</span>
            </a>
            <a href="#/settings" class="sidebar-menu-item ${activeHash === '#/settings' ? 'active' : ''}">
                ${ICONS.settings}
                <span>Atelier Settings</span>
            </a>
        </nav>
        
        <!-- User Profile Panel & Signout -->
        <div class="sidebar-footer">
            <div class="sidebar-profile" title="${user.email || 'signed-in user'}">
                <div class="profile-avatar">${initials}</div>
                <div class="sidebar-brand" style="max-width: 140px;">
                    <span style="font-size: 0.75rem; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; color: var(--foreground);">
                        ${user.name || 'Artisan'}
                    </span>
                    <span style="font-size: 0.6rem; color: var(--muted-foreground); white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                        ${user.email || 'artisan@obsidian.co'}
                    </span>
                </div>
            </div>
            <button id="sidebar-signout-btn" class="btn-signout" title="Sign out from the Atelier">
                ${ICONS.logout}
            </button>
        </div>
    `;
    
    // Attach Sidebar DOM event listeners
    attachSidebarListeners(asideElement);
}

function attachSidebarListeners(asideElement) {
    // 1. Craft Mode Toggled checkbox
    const modeCb = asideElement.querySelector('#sidebar-craft-mode-cb');
    if (modeCb) {
        modeCb.addEventListener('change', (e) => {
            const isAcademic = e.target.checked;
            const newMode = isAcademic ? 'academic' : 'fiction';
            
            Store.save('mode', newMode);
            showToast(`Switched to ${isAcademic ? "Scholar's Sanctum" : "The Weaver's Path"} mode.`, 'success');
            
            // Re-render sidebar to update menu items
            renderSidebar(asideElement);
            
            // Navigate dynamically to the corresponding entrance page
            if (newMode === 'academic') {
                navigate('#/research/vault');
            } else {
                navigate('#/planning');
            }
        });
    }
    
    // 2. Signout Button Trigger
    const signoutBtn = asideElement.querySelector('#sidebar-signout-btn');
    if (signoutBtn) {
        signoutBtn.addEventListener('click', () => {
            Store.save('user', null);
            showToast('Signed out of the Obsidian Siren Studio.', 'success');
            navigate('#/');
        });
    }
}
