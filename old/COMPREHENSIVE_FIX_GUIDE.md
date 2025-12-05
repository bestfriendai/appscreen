# Comprehensive Guide to Fixing and Perfecting ScreenGenius

## Executive Summary

**ScreenGenius** is a sophisticated React application for generating App Store screenshots using Google's Gemini 2.5 AI models. The application demonstrates professional features like psychology-based color palettes and advanced typography.

However, a production-grade release requires significant architectural improvements to address security, performance, and maintainability.

This guide details exactly how to fix the critical issues, specifically focusing on **API Security**, **State Management**, **Export Stability**, and **Code Modularity**.

---

## 1. Deep Code Analysis & Critical Issues

### 1.1 🚨 SECURITY: API Key Exposure
**Severity: CRITICAL**
*   **Issue:** `vite.config.ts` explicitly defines `process.env.GEMINI_API_KEY` using `JSON.stringify(env.GEMINI_API_KEY)`. This embeds your private secret key directly into the client-side JavaScript bundle (`dist/assets/index-*.js`). Anyone can inspect the network traffic or source code and steal your quota.
*   **Fix:** You **MUST** move the API interaction to a backend proxy (e.g., Next.js API Routes, Vercel Functions, or Cloudflare Workers). The frontend should call your own backend, which then calls Gemini.

### 1.2 ⚠️ STABILITY: Export Fidelity
**Severity: HIGH**
*   **Issue:** `html2canvas` struggles with modern CSS features used heavily in this app (`backdrop-filter`, complex `mix-blend-mode`, advanced `box-shadow` layering, `transform-style: preserve-3d`). This results in exported images looking "flatter" or glitchy compared to the live preview.
*   **Fix:** Migrate to `html-to-image` for better support, or implementing a server-side "headless browser" capture (Puppeteer/Playwright) for 100% fidelity. For a client-side only fix, we will switch to `html-to-image`.

### 1.3 🏗️ ARCHITECTURE: Monolithic `App.tsx`
**Severity: MEDIUM**
*   **Issue:** `App.tsx` is ~1000 lines. It mixes UI presentation, business logic (AI generation orchestration), state logic, and event handling. This makes adding features like "Undo/Redo" or "Drag & Drop" exponentially harder.
*   **Fix:** Decompose into `Sidebar`, `Workspace`, `TopBar`, and `GenerationOverlay`. Move logic into custom hooks (`useGenerationPipeline`, `useProjectManagement`).

### 1.4 🐢 PERFORMANCE: Main Thread Blocking
**Severity: MEDIUM**
*   **Issue:** `jszip` and image conversion happen on the main thread. Exporting 4+ slides at high res (iPhone 16 Pro Max resolution) freezes the UI.
*   **Fix:** Move the ZIP creation and image encoding to a **Web Worker**.

---

## 2. API & Service Architecture (The Fixes)

### 2.1 Implementing the AI Service Layer

First, we abstract the direct dependency on `GoogleGenAI` so we can easily switch between a direct client (for dev) and a proxy (for prod).

**Create `services/ai/AIService.ts`:**

```typescript
import { GoogleGenAI, GenerativeModel } from "@google/genai";
import { logger } from "../../utils/logger";

export interface AIResponse<T> {
  data: T | null;
  error?: string;
}

export abstract class AIService {
  abstract generateJson<T>(prompt: string, schema: any, images?: string[]): Promise<T>;
  abstract generateImage(prompt: string, negativePrompt?: string): Promise<string>;
}

// Client-side implementation (Dev only)
export class ClientSideGeminiService extends AIService {
  private client: GoogleGenAI;
  private flashModel: any; // Type as needed
  private imageModel: any;

  constructor(apiKey: string) {
    super();
    this.client = new GoogleGenAI({ apiKey });
  }

  async generateJson<T>(prompt: string, schema: any, images: string[] = []): Promise<T> {
    // ... implementation using this.client.models.generateContent ...
    // See services/geminiService.ts for the logic to port here
    return {} as T;
  }

  async generateImage(prompt: string, negativePrompt: string = ""): Promise<string> {
    // ... implementation using gemini-2.5-flash-image ...
    return "";
  }
}

// Proxy implementation (Production)
export class ProxyAIService extends AIService {
  private endpoint: string;

  constructor(endpoint: string) {
    super();
    this.endpoint = endpoint;
  }

  async generateJson<T>(prompt: string, schema: any, images: string[] = []): Promise<T> {
    const res = await fetch(`${this.endpoint}/generate-json`, {
      method: 'POST',
      body: JSON.stringify({ prompt, schema, images }),
      headers: { 'Content-Type': 'application/json' }
    });
    if (!res.ok) throw new Error("Proxy Error");
    return await res.json();
  }

  async generateImage(prompt: string, negativePrompt: string): Promise<string> {
    const res = await fetch(`${this.endpoint}/generate-image`, {
      method: 'POST',
      body: JSON.stringify({ prompt, negativePrompt }),
      headers: { 'Content-Type': 'application/json' }
    });
    if (!res.ok) throw new Error("Proxy Error");
    const data = await res.json();
    return data.imageUrl;
  }
}

// Factory
export const getAIService = (): AIService => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY; // Rename env var in vite.config.ts
  const apiUrl = import.meta.env.VITE_API_URL;

  if (apiUrl) {
    return new ProxyAIService(apiUrl);
  } else if (apiKey) {
    console.warn("Using client-side API key. NOT SECURE for production.");
    return new ClientSideGeminiService(apiKey);
  }
  throw new Error("No API configuration found.");
};
```

### 2.2 Secure Backend Proxy (Vercel Function Example)

If deploying to Vercel, create `api/generate-image.ts`:

```typescript
// api/generate-image.ts (Server-side)
import { GoogleGenAI } from "@google/genai";

export default async function handler(request, response) {
  // Validate request...
  const { prompt, negativePrompt } = JSON.parse(request.body);

  // Initialize client SERVER-SIDE only
  const client = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

  // Generate...
  try {
     const result = await client.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: { parts: [{ text: prompt }] },
        // ...
     });
     // Return base64 or URL
     response.status(200).json({ imageUrl: "..." });
  } catch (e) {
     response.status(500).json({ error: e.message });
  }
}
```

---

## 3. Component Refactoring & Modularity

We must break `App.tsx` into logical chunks.

**New Folder Structure:**
```
src/
  features/
    editor/
      components/
        Sidebar/
          Sidebar.tsx
          ThemeControls.tsx
          Inputs.tsx
        Workspace/
          Workspace.tsx
          CanvasWrapper.tsx
        TopBar/
          TopBar.tsx
          ExportMenu.tsx
      hooks/
        useEditorState.ts
        useGenerationPipeline.ts
```

### 3.1 Refactoring `App.tsx`

**`App.tsx` (Simplified):**

```tsx
import React from 'react';
import { Sidebar } from './features/editor/components/Sidebar/Sidebar';
import { Workspace } from './features/editor/components/Workspace/Workspace';
import { TopBar } from './features/editor/components/TopBar/TopBar';
import { ExportModal } from './components/ExportModal';
import { GenerationProgress } from './components/GenerationProgress';
import { useStore } from './store/useStore';

function App() {
  const showExportModal = useStore((s) => s.showExportModal);
  const showGenerationProgress = useStore((s) => s.showGenerationProgress);

  return (
    <div className="flex h-screen bg-[#020202] text-gray-100 font-sans overflow-hidden">
      <Sidebar />
      <main className="flex-1 flex flex-col bg-[#050505] relative overflow-hidden">
        <TopBar />
        <Workspace />
      </main>

      {/* Global Modals */}
      {showExportModal && <ExportModal />}
      {showGenerationProgress && <GenerationProgress />}
    </div>
  );
}
export default App;
```

### 3.2 State Management Improvements (`zustand` + `immer`)

The store is already good, but we should add **Undo/Redo** support easily.

**Update `store/useStore.ts`:**

```typescript
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { temporal } from 'zundo'; // Install: npm install zundo

export const useStore = create<AppState>()(
  temporal(
    immer((set) => ({
      // ... existing state ...
    })),
    {
      limit: 50, // History limit
      partialize: (state) => {
        // Only track changes to slides and visual settings
        const { slidesV1, slidesV2, slidesV3, themeMode, frameStyle, /*...*/ } = state;
        return { slidesV1, slidesV2, slidesV3, themeMode, frameStyle, /*...*/ };
      },
      onSave: (pastState, currentState) => {
         // Optional: Auto-save to IndexedDB on every history push
      }
    }
  )
);
```

---

## 4. Export Stability & Web Workers

### 4.1 Switch to `html-to-image`

`html2canvas` is older. `html-to-image` is more robust for modern CSS.

**Install:** `npm install html-to-image`

**Update `utils/exportUtils.ts`:**

```typescript
import { toBlob } from 'html-to-image';

export async function captureElement(element: HTMLElement, options: ExportOptions): Promise<Blob | null> {
  // Wait for fonts to load
  await document.fonts.ready;

  return await toBlob(element, {
    cacheBust: true,
    pixelRatio: options.scale || 2,
    filter: (node) => {
      // Exclude UI controls from screenshot if any exist inside the element
      return !node.classList?.contains('exclude-from-export');
    },
    style: {
      // Force consistent rendering
      textRendering: 'geometricPrecision',
    }
  });
}
```

### 4.2 Web Worker for ZIP Compression

**Create `workers/export.worker.ts`:**

```typescript
// workers/export.worker.ts
import JSZip from 'jszip';

self.onmessage = async (e) => {
  const { files } = e.data; // Array of { name: string, blob: Blob }

  const zip = new JSZip();

  files.forEach((f) => {
    zip.file(f.name, f.blob);
  });

  const content = await zip.generateAsync({ type: "blob" });
  self.postMessage(content);
};
```

**Usage in Main Thread:**
```typescript
const worker = new Worker(new URL('../workers/export.worker.ts', import.meta.url), { type: 'module' });

worker.onmessage = (e) => {
  const zipBlob = e.data;
  saveAs(zipBlob, 'screenshots.zip');
};

worker.postMessage({ files: capturedBlobs });
```

---

## 5. Feature Implementation Code (Drag & Drop)

**Install:** `npm install @dnd-kit/core @dnd-kit/modifiers`

**Update `components/CanvasPreview.tsx`:**

```tsx
import { DndContext, useDraggable } from '@dnd-kit/core';
import { restrictToParentElement } from '@dnd-kit/modifiers';

// Draggable Wrapper Component
function Draggable({ id, children, initialPos }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({ id });

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined;

  return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes}>
      {children}
    </div>
  );
}

// In CanvasPreview
export const CanvasPreview = (props) => {
  // ...
  return (
    <DndContext onDragEnd={handleDragEnd} modifiers={[restrictToParentElement]}>
       {/* Background */}

       <Draggable id="text-layer">
          {renderTypography()}
       </Draggable>

       <Draggable id="phone-layer">
          {renderContent()}
       </Draggable>
    </DndContext>
  );
};
```

---

## 6. Summary of Action Items

1.  **Security**: Rename `GEMINI_API_KEY` to `VITE_GEMINI_API_KEY` in `vite.config.ts` and ensure it is NOT committed to git in `.env.local`. Plan backend migration.
2.  **Modularity**: Execute the folder structure refactor. Create `Sidebar`, `Workspace`, `TopBar` folders.
3.  **Stability**: Replace `html2canvas` with `html-to-image` in `utils/exportUtils.ts`.
4.  **Performance**: Implement the `export.worker.ts` to handle ZIP generation off the main thread.
5.  **Undo/Redo**: Add `zundo` middleware to `useStore.ts`.

This expanded guide covers the "how-to" for every single architectural fix needed to make ScreenGenius production-ready.
