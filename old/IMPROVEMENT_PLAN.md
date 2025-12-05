# ScreenGenius Improvement Plan

This document outlines a comprehensive strategy to elevate ScreenGenius from a prototype to a production-grade SaaS product.

## 1. Core Experience & Quality

### 1.1 Visual Fidelity (Priority: High)
- **Problem**: Current backgrounds can sometimes look generic or distorted.
- **Solution**: 
    - [x] Implement "Studio Quality" AI prompts (Octane/Redshift render style).
    - [x] Generate 5 variations per project and distribute them across slides for variety.
    - [x] Fix background stretching; ensure `background-size: cover` is used for photography.
    - [ ] Add a "Regenerate This Slide Background" button to swap just one background without affecting others.
    - [ ] Implement "Smart Cropping" to center the most interesting part of the AI background.

### 1.2 Device Mockups (Priority: High)
- **Problem**: Current frames are CSS-based approximations.
- **Solution**:
    - Integrate real 3D-rendered PNG masks with transparent screen areas.
    - Add more device types: iPad Pro, Android (Pixel/Samsung), generic frames.
    - Support "floating" effects with realistic drop shadows (currently CSS shadows).

### 1.3 Typography & Layout
- **Problem**: Text can be hard to read on busy backgrounds; layouts are limited.
- **Solution**:
    - Implement "Smart Contrast" that analyzes the background brightness behind text areas and dynamically adjusts text color/shadow.
    - Add 10+ new layouts (e.g., "Split Screen", "Device Grid", "Feature List").
    - Allow users to manually drag/resize text and devices (Canvas interactivity).

## 2. AI & Intelligence

### 2.1 Context Awareness
- **Problem**: AI sometimes guesses the wrong category or vibe.
- **Solution**:
    - Allow users to manually select "Category" (Fitness, Finance, Social) to force specific prompt logic.
    - Analyze the *uploaded screenshots* using Vision API (Gemini Pro Vision) to extract actual UI colors and text, rather than guessing.

### 2.2 Copywriting
- **Problem**: Generated text can be generic.
- **Solution**:
    - Fine-tune the V3 "Copywriter" agent with specific ASO (App Store Optimization) rules.
    - Add a "Tone of Voice" selector (e.g., Professional, Playful, Urgent, Minimal).

## 3. User Workflow & Features

### 3.1 Editor Capabilities
- **Current**: Basic text editing.
- **Future**:
    - **Drag & Drop**: Move phones and text blocks freely.
    - **Layer Management**: Bring to front/send to back.
    - **Asset Library**: Upload custom logos, stickers, or badges.
    - **Background Picker**: Click a slide -> choose from the 5 generated variations instantly.

### 3.2 Project Management
- **Current**: Single active project (auto-saved).
- **Future**:
    - "My Projects" dashboard to manage multiple apps.
    - Duplicate project.
    - Export history.

### 3.3 Export & Delivery
- **Current**: ZIP/PDF download.
- **Future**:
    - **One-Click Resize**: Automatically generate 6.5", 5.5", and iPad sizes from the 6.7" master.
    - **Direct Publish**: Integration with App Store Connect API (ambitious).
    - **Social Media Pack**: Auto-generate Instagram Story / Twitter Post sizes from the same design.

## 4. Technical Architecture

### 4.1 Performance
- **Problem**: Generating 5 images takes time; UI freezes.
- **Solution**:
    - Move generation to a serverless queue (Vercel Functions / AWS Lambda) so the UI remains responsive.
    - Implement optimistic UI (show placeholders while generating).
    - Use web workers for image compression/export.

### 4.2 Codebase
- **Refactor**:
    - Split `geminiService.ts` into specialized agents (`LayoutAgent`, `CopyAgent`, `BackgroundAgent`).
    - Adopt a state management library (Zustand/Redux) instead of prop drilling.
    - Add unit tests for the critical "Prompt Builders" to ensure they don't regress.

## 5. Growth & Monetization

- **Freemium Model**: Free users get watermarked exports or limited credits.
- **Pro Features**: 8K export, team collaboration, unlimited AI generations.
- **SEO**: Create landing pages for "App Store Screenshot Generator for [Category]" to drive organic traffic.

---

## Immediate Next Steps (Action Items)

1.  **Fix AI Backgrounds**: Ensure they are stunning and relevant (Done).
2.  **Fix Scaling**: Stop stretching backgrounds (Done).
3.  **UI Polish**: Add a "Swap Background" button on each slide to cycle through the generated variations.
4.  **Export Sizes**: Ensure 6.5" and 5.5" exports map correctly without letterboxing.
