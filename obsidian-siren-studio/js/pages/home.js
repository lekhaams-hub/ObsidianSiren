/* 
   ==========================================================================
   OBSIDIAN SIREN STUDIO — ENTRANCE & AUTHENTICATION LANDING PAGE
   ==========================================================================
*/

import { Store, navigate, showToast } from '../app.js';

export function Home() {
    const user = Store.state.user;
    const container = document.createElement('div');
    container.className = 'landing-wrapper';
    
    // Check if the user is authenticated
    if (user) {
        // Render dual-path entrance choice dashboard
        container.innerHTML = `
            <div class="fade-in">
                <!-- Custom SVG styled Obsidian Logo -->
                <div style="margin: 0 auto 1.5rem; display: flex; align-items: center; justify-content: center; gap: 8px;">
                    <svg viewBox="0 0 100 100" style="width: 72px; height: 72px; filter: drop-shadow(0 0 15px rgba(155, 81, 224, 0.6));">
                        <defs>
                            <radialGradient id="siren-logo-grad" cx="50%" cy="50%" r="50%">
                                <stop offset="0%" stop-color="#bb6bd9" />
                                <stop offset="100%" stop-color="#6a2e9b" />
                            </radialGradient>
                        </defs>
                        <path d="M50 5 L90 28 L90 72 L50 95 L10 72 L10 28 Z" fill="url(#siren-logo-grad)" opacity="0.3" stroke="#bb6bd9" stroke-width="2"/>
                        <path d="M50 15 L80 32 L80 68 L50 85 L20 68 L20 32 Z" fill="none" stroke="#ffd700" stroke-width="1.5" stroke-dasharray="2 2"/>
                        <circle cx="50" cy="50" r="12" fill="#0b0b0d" stroke="#bb6bd9" stroke-width="2"/>
                        <path d="M45 42 L55 58 M55 42 L45 58" stroke="#ffd700" stroke-width="2" stroke-linecap="round"/>
                    </svg>
                </div>
                
                <p class="landing-kicker">Obsidian Siren Studio</p>
                <h1 class="landing-title">Where does your <span class="text-gradient-siren">journey</span> begin?</h1>
                <p class="landing-desc">Two paths. One studio. Choose your craft and step through.</p>
                
                <!-- Active User Session Badge -->
                <div style="margin: -1.5rem auto 2.5rem; max-width: 320px; display: flex; align-items: center; justify-content: center; gap: 12px; padding: 6px 16px; background: rgba(255,255,255,0.03); border: 1px solid var(--border); border-radius: 20px; font-size: 0.8rem; color: var(--silver);">
                    <span>Signed in as <strong style="color: var(--foreground);">${user.name || 'Artisan'}</strong></span>
                    <span style="opacity: 0.3;">|</span>
                    <button id="entrance-signout-btn" style="background: none; border: none; color: var(--muted-foreground); cursor: pointer; font-size: 0.8rem; transition: color 0.2s;" onmouseover="this.style.color='#eb5757'" onmouseout="this.style.color='var(--muted-foreground)'">Sign Out</button>
                </div>
                
                <!-- Dual Grid Selection Cards -->
                <div class="landing-cards">
                    <!-- The Weaver's Path (Fiction Mode) -->
                    <a href="#/planning" id="path-weaver-card" class="glass-panel path-card">
                        <div class="path-icon-container">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12.67 19a2 2 0 0 0 1.416-.588l6.154-6.172a6 6 0 0 0-8.49-8.49L5.586 9.914A2 2 0 0 0 5 11.328V18a1 1 0 0 0 1 1z"></path><path d="M16 8 2 22"></path><path d="M17.5 15H9"></path></svg>
                        </div>
                        <span class="path-kicker">Fiction · Fantasy · Memoir</span>
                        <h2 class="path-title">The Weaver's Path</h2>
                        <p class="path-desc">Conjure characters, chart worlds, draft chapters, and design the cover that calls readers in.</p>
                        <span class="path-link">
                            Enter Path
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                        </span>
                    </a>
                    
                    <!-- The Scholar's Sanctum (Academic Mode) -->
                    <a href="#/research/vault" id="path-scholar-card" class="glass-panel path-card">
                        <div class="path-icon-container">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z"></path><path d="M22 10v6"></path><path d="M6 12.5V16a6 3 0 0 0 12 0v-3.5"></path></svg>
                        </div>
                        <span class="path-kicker">Research · Thesis · Academic</span>
                        <h2 class="path-title">The Scholar's Sanctum</h2>
                        <p class="path-desc">A vault for your sources, a scriptorium for your prose, and citations rendered in any house style.</p>
                        <span class="path-link">
                            Enter Sanctum
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                        </span>
                    </a>
                </div>
                
                <p class="landing-footer">You can switch paths anytime from the studio sidebar.</p>
            </div>
        `;
    } else {
        // Render Login/Sign-up Entrance Box
        container.innerHTML = `
            <div class="fade-in" style="width: 100%;">
                <div style="margin: 0 auto 1.5rem; display: flex; align-items: center; justify-content: center; gap: 8px;">
                    <svg viewBox="0 0 100 100" style="width: 72px; height: 72px; filter: drop-shadow(0 0 20px rgba(155, 81, 224, 0.7));">
                        <defs>
                            <radialGradient id="siren-logo-grad-auth" cx="50%" cy="50%" r="50%">
                                <stop offset="0%" stop-color="#bb6bd9" />
                                <stop offset="100%" stop-color="#6a2e9b" />
                            </radialGradient>
                        </defs>
                        <path d="M50 5 L90 28 L90 72 L50 95 L10 72 L10 28 Z" fill="url(#siren-logo-grad-auth)" opacity="0.35" stroke="#bb6bd9" stroke-width="2"/>
                        <circle cx="50" cy="50" r="10" fill="#0b0b0d" stroke="#ffd700" stroke-width="2"/>
                    </svg>
                </div>
                
                <p class="landing-kicker">Obsidian Siren Studio</p>
                <h1 class="landing-title">Where stories find their <span class="text-gradient-siren">shine</span></h1>
                <p class="landing-desc" style="max-width: 440px; margin-bottom: 2rem;">The only friend you need to write and publish a book. Plan, format, design covers, and find expert services.</p>
                
                <!-- Authentication Container Box -->
                <div class="glass-panel auth-box" id="auth-panel-card">
                    <!-- Dynamic state content (Login / Register) is injected here -->
                </div>
                
                <p class="landing-footer" style="margin-top: 2rem;">Sign in is required to use the studio tools.</p>
            </div>
        `;
    }
    
    return container;
}

// Store toggle state for login vs registration view
let isRegisterView = false;

function renderAuthForm(authCard) {
    if (!authCard) return;
    
    if (isRegisterView) {
        // HTML structure for Registration card
        authCard.innerHTML = `
            <h3 style="font-size: 1.1rem; color: var(--foreground); margin-bottom: 1.5rem; text-align: center;">CREATE AN ACCOUNT</h3>
            
            <div style="display: flex; flex-direction: column; gap: 12px; text-align: left;">
                <div>
                    <label class="label-text">Username</label>
                    <input type="text" id="auth-username" class="input-field" placeholder="Lekhaa Vance">
                </div>
                <div>
                    <label class="label-text">Email Address</label>
                    <input type="email" id="auth-email" class="input-field" placeholder="email@example.com">
                </div>
                <div>
                    <label class="label-text">Password</label>
                    <input type="password" id="auth-password" class="input-field" placeholder="Create password">
                </div>
                
                <button id="auth-submit-btn" class="btn btn-primary" style="width: 100%; margin-top: 8px;">Create Account</button>
                
                <div class="divider-text">already registered?</div>
                
                <button id="auth-toggle-view" class="btn btn-outline btn-sm" style="width: 100%;">Sign in to your Atelier →</button>
            </div>
        `;
    } else {
        // HTML structure for Login card
        authCard.innerHTML = `
            <button id="auth-google-btn" class="btn btn-outline" style="width: 100%; display: flex; align-items: center; justify-content: center; gap: 10px;">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.114-5.136 4.114A5.8 5.8 0 0 1 8 12.8a5.8 5.8 0 0 1 5.99-5.714c1.62 0 3.024.629 4.09 1.637l3.12-3.12C19.29 3.84 16.46 2.5 13.99 2.5 8.24 2.5 3.5 7.24 3.5 13s4.74 10.5 10.49 10.5c5.78 0 10.2-4.11 10.2-10.28 0-.582-.05-1.17-.16-1.715H12.24z"/></svg>
                Continue with Google
            </button>
            
            <div class="divider-text">or sign in with email</div>
            
            <div style="display: flex; flex-direction: column; gap: 12px; text-align: left;">
                <div>
                    <label class="label-text">Email Address</label>
                    <input type="email" id="auth-email" class="input-field" placeholder="email@example.com" value="lekhaa@obsidian.co">
                </div>
                <div>
                    <label class="label-text">Password</label>
                    <input type="password" id="auth-password" class="input-field" placeholder="Enter password" value="password123">
                </div>
                
                <button id="auth-submit-btn" class="btn btn-primary" style="width: 100%; margin-top: 8px;">Sign In to Atelier</button>
                
                <button id="auth-toggle-view" class="btn btn-ghost btn-sm" style="width: 100%; font-size: 0.75rem; letter-spacing: 0.1em; text-transform: uppercase; margin-top: 10px;">New here? Create an account →</button>
            </div>
        `;
    }
    
    // Attach authentication events
    attachAuthFormEvents(authCard);
}

function attachAuthFormEvents(authCard) {
    // 1. Toggle view links
    const toggleBtn = authCard.querySelector('#auth-toggle-view');
    if (toggleBtn) {
        toggleBtn.addEventListener('click', () => {
            isRegisterView = !isRegisterView;
            renderAuthForm(authCard);
        });
    }
    
    // 2. Google OAuth trigger
    const googleBtn = authCard.querySelector('#auth-google-btn');
    if (googleBtn) {
        googleBtn.addEventListener('click', () => {
            showToast('Simulating secure Google verification...');
            setTimeout(() => {
                const sessionUser = { name: 'Lekhaa Vance', email: 'lekhaa@obsidian.co' };
                Store.save('user', sessionUser);
                showToast('Welcome back, Lekhaa. Access granted to Atelier.');
                navigate('#/'); // Reload route to render dashboard choices
            }, 800);
        });
    }
    
    // 3. Email Submission
    const submitBtn = authCard.querySelector('#auth-submit-btn');
    if (submitBtn) {
        submitBtn.addEventListener('click', () => {
            const emailInput = authCard.querySelector('#auth-email').value.trim();
            const passwordInput = authCard.querySelector('#auth-password').value;
            
            if (!emailInput || !passwordInput) {
                showToast('Please provide both email and password.', 'error');
                return;
            }
            
            let name = 'Artisan';
            if (isRegisterView) {
                const usernameInput = authCard.querySelector('#auth-username').value.trim();
                name = usernameInput || 'Artisan';
                showToast('Registering secure account...');
            } else {
                name = emailInput.split('@')[0];
                name = name.charAt(0).toUpperCase() + name.slice(1);
                showToast('Authenticating with the Siren...');
            }
            
            setTimeout(() => {
                const sessionUser = { name, email: emailInput };
                Store.save('user', sessionUser);
                showToast(`Welcome ${isRegisterView ? 'to the Studio' : 'back'}, ${name}.`);
                navigate('#/');
            }, 800);
        });
    }
}

// Page execution hooks
Home.init = function() {
    const authCard = document.getElementById('auth-panel-card');
    if (authCard) {
        renderAuthForm(authCard);
    }
    
    // weaver / scholar card navigators
    const weaverCard = document.getElementById('path-weaver-card');
    if (weaverCard) {
        weaverCard.addEventListener('click', () => {
            Store.save('mode', 'fiction');
        });
    }
    
    const scholarCard = document.getElementById('path-scholar-card');
    if (scholarCard) {
        scholarCard.addEventListener('click', () => {
            Store.save('mode', 'academic');
        });
    }
    
    // handle home signout button
    const signoutBtn = document.getElementById('entrance-signout-btn');
    if (signoutBtn) {
        signoutBtn.addEventListener('click', () => {
            Store.save('user', null);
            showToast('Signed out of the Obsidian Siren Studio.', 'success');
            navigate('#/');
        });
    }
};
