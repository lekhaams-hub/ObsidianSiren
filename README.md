# Obsidian Siren Studio

> **An immersive, high-fidelity dark-themed digital workspace designed for authors, fantasy worldbuilders, and academic researchers.**

Obsidian Siren Studio unifies the creative drafting process with structured, premium research environments. Built around a luxurious and responsive dark aesthetic, the platform splits into two distinct, specialized operational paths: **The Weaver's Path** for creative fiction writers, and **The Scholar's Sanctum** for premium academic research.

---

## 🌌 The Dual-Path Experience

### 🎭 1. The Weaver's Path (Creative Fiction & Fantasy)
A workspace tailored for authors mapping complex, character-driven fiction, fantasy matrices, and speculative mythologies.

*   **Planning & Drafting Workspace (Conspiracy Board & Blueprints)**:
    *   **Cast of Characters**: Maintain complete, deep character blueprints detailing role, age, species, traits, psychological outlines, and custom attributes.
    *   **Plot Conspiracy Board**: Drag-and-drop interactive whiteboard interface to connect, sequence, and cluster narrative nodes, events, and major reveals.
    *   **Worldbuilding Chronicle**: A dedicated matrix to record world rules, history epochs, geographical boundaries, cultural habits, and magic/tech thresholds.
    *   **Scriptorium Draft Editor**: Premium distraction-free text drafting tool with integrated daily word goals, automatic word counts, and progress tracking.
*   **Book Formatting Engine**:
    *   One-click styling presets (Classic Novel, Modern Memoir, Epic Fantasy, Cyberpunk Gothic) for assisted publishing, exporting manuscripts in uniform, gorgeous layouts.
*   **Cover Studio (AI & Canvas Design)**:
    *   **AI Concept Co-creation**: Prompt-driven AI book cover generator featuring premium thematic vector mocks.
    *   **Canva-Lite Layout Canvas**: Custom layers for background scales, canvas sizes, draw-brush layers, and typographic custom overlays in **Cormorant Garamond**.

### 🏛️ 2. The Scholar's Sanctum (Academic & Research)
A structured, research-centric productivity workspace tailored for academic writing, documentation, and archival mapping.

*   **Inquiry Vault**:
    *   Archival knowledge hub where research files, logs, and evidence cards are organized with customizable obsidian tags and categories.
*   **Academic Scriptorium**:
    *   A high-end manuscript composition editor supporting markdown and rich bibliographic citation lookups.
*   **Citations & Bibliography**:
    *   Bibliographic database manager with native citation exports to Zotero-compatible BibTeX structures.
*   **Expert Consultation Hub**:
    *   Direct interactive channels and advisory booking systems connected to simulated subject-matter faculty, historians, and research advisors.

---

## 🛠️ Technology Stack

*   **Core framework**: React 18 (Vite-powered, SPA architecture)
*   **Styling**: Tailwind CSS v4 (using `@theme` definitions in standard modern layers)
*   **Icons**: Lucide Icons
*   **Database & Authentication**: Firebase Core API integrations
*   **Typography**: 
    *   *Sans-Serif (Global UI)*: **Inter**
    *   *Serif (Display & Graceful Headings)*: **Cormorant Garamond** (Google Fonts imported)

---

## 🚀 Getting Started

### Prerequisites
*   [Node.js](https://nodejs.org/) (v18.0.0 or higher recommended)
*   npm (v9.0.0 or higher)

### Installation

1.  **Clone the Repository**:
    ```bash
    git clone https://github.com/lekhaams-hub/ObsidianSiren.git
    cd ObsidianSiren
    ```

2.  **Install Dependencies**:
    ```bash
    npm install
    ```

3.  **Configure Environment Variables**:
    Create a `.env` file in the root directory and supply your Firebase client configuration keys:
    ```env
    VITE_FIREBASE_API_KEY=your_api_key
    VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
    VITE_FIREBASE_PROJECT_ID=your_project_id
    VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
    VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
    VITE_FIREBASE_APP_ID=your_app_id
    VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
    ```

4.  **Launch the Development Server**:
    ```bash
    npm run dev
    ```
    Open `http://localhost:5173` in your browser.

5.  **Build the Production Bundle**:
    ```bash
    npm run build
    ```
    The compiled build assets will be written to the `/dist` directory.

---
