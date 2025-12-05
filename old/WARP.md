# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

This is a **React + TypeScript** application built with **Vite** and styled with **Tailwind CSS**. It is an AI-powered tool ("ScreenGenius") for generating App Store screenshots using Google's Gemini API.

### Key Technologies
- **Framework**: React 19
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Language**: TypeScript
- **AI Integration**: Google Gemini (`@google/genai`)
- **Icons**: Lucide React
- **State Persistence**: IndexedDB (via `idb`)

## Development Commands

- **Install Dependencies**: `npm install`
- **Start Development Server**: `npm run dev` (Runs on port 3000)
- **Build for Production**: `npm run build`
- **Preview Production Build**: `npm run preview`

> **Note**: There are currently no configured scripts for testing or linting in `package.json`.

## Architecture & Structure

### Directory Structure
- **`components/`**: UI components. `CanvasPreview.tsx` is the core component for rendering slides. `GenerationProgress.tsx` handles the AI generation workflow UI.
- **`services/`**: External integrations. `geminiService.ts` handles all AI logic (copywriting, background generation).
- **`utils/`**: Core logic and helpers.
    - `typographyEngine.ts`: Advanced text sizing and contrast calculations.
    - `professionalColors.ts`: Color psychology and palette management.
    - `studioBackgrounds.ts`: Logic for generating professional backgrounds.
    - `indexedDBStorage.ts`: Handles persistence (replacing localStorage to avoid quota limits).
- **`hooks/`**: Custom React hooks (e.g., `useAutoSave`).
- **`constants/`**: Configuration constants.

### Core Concepts

1.  **Generation Pipeline**: The app follows a 3-phase generation process:
    - **V1 (The Architect)**: Concept & initial style.
    - **V2 (The Art Director)**: Visual refinement and layout adjustments.
    - **V3 (The Copywriter)**: Final polish and ASO optimization.

2.  **Design Intelligence**:
    - The app uses a "Professional Design System" to enforce design quality.
    - Typography is dynamically sized and checked for contrast (WCAG compliance).
    - Backgrounds and colors are selected based on app category (detected via AI).

3.  **Data Persistence**:
    - Large assets (images) and project state are stored in **IndexedDB** to bypass localStorage limits.
    - `useAutoSave` hook handles automatic saving of the project state.

## Environment Variables

The application requires a Gemini API key to function.
- Create a `.env.local` file.
- Add `GEMINI_API_KEY=your_key_here`.
- `vite.config.ts` maps this to `process.env.GEMINI_API_KEY`.

## Coding Guidelines

- **Icons**: Use `lucide-react` for all UI icons.
- **Styling**: Use Tailwind CSS utility classes. Avoid custom CSS files unless necessary (`index.css` handles globals).
- **Components**: Prefer functional components with TypeScript interfaces for props.
- **Async Operations**: Use `async/await` for all AI and storage operations. Handle errors gracefully using `react-hot-toast` for user feedback.
