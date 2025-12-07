# Comprehensive Code Analysis: App Store Screenshot Generator

**Analysis Date:** December 6, 2025  
**Purpose:** Full code and feature analysis to create upload-ready App Store screenshots using Gemini 3.0

---

## AI Models Used (FINAL)

> **This application uses ONLY these two Gemini 3 models:**
>
> | Model | Model ID | Use Case |
> |-------|----------|----------|
> | Gemini 3 Pro | `gemini-3-pro-preview` | Vision analysis, text generation, design strategy |
> | Gemini 3 Pro Image | `gemini-3-pro-image-preview` | Background image generation (up to 4096px) |
>
> These are the **latest and correct** model IDs as of December 2025. Do not change them.

---

## Executive Summary

This codebase is a sophisticated App Store Screenshot Generator. The goal is to make Magic Design **fully functional** so it produces **upload-ready screenshots** that rival AppLaunchpad - with a single click, users should get professional screenshots ready for App Store Connect.

### AI Provider: Gemini 3.0 Only

This app uses **exclusively Google Gemini 3.0** models:

| Model | Purpose | Model ID |
|-------|---------|----------|
| **Gemini 3 Pro** | Screenshot analysis, headline generation, design strategy | `gemini-3-pro-preview` |
| **Gemini 3 Pro Image** | Background image generation, visual editing | `gemini-3-pro-image-preview` |

### Current Status vs Goal

| Feature | Current State | Target State |
|---------|--------------|--------------|
| Screenshot Analysis | Working | Working |
| Headline Generation | Working | Working |
| Background Generation | **STUB - Returns null** | Generate professional backgrounds |
| Layout Application | Working | Working |
| Story Flows | **Hidden - No UI** | Exposed with dropdown |
| One-Click Ready | **No** | **Yes - Upload ready** |

---

## Table of Contents

1. [Gemini 3.0 API Configuration](#1-gemini-30-api-configuration)
2. [Magic Design Complete Pipeline](#2-magic-design-complete-pipeline)
3. [Critical Fixes Required](#3-critical-fixes-required)
4. [Rendering & Performance Issues](#4-rendering--performance-issues)
5. [State Management Issues](#5-state-management-issues)
6. [Complete Code Solutions](#6-complete-code-solutions)

---

## 1. Gemini 3.0 API Configuration

### 1.1 Current Configuration - CORRECT

**Location:** `llm.js:1-88`

The current code correctly uses the latest Gemini 3 model IDs:

```javascript
// CURRENT (CORRECT - These are the latest models)
models: [
    { id: 'gemini-3-pro-preview', name: 'Gemini 3 Pro' },
    { id: 'gemini-3-pro-image-preview', name: 'Gemini 3 Pro Image' }
]
```

These are the **official latest Gemini 3 models** as of December 2025.

### 1.2 Complete Gemini 3.0 Configuration

**Recommended `llm.js` configuration:**

```javascript
// LLM Provider Configuration - Gemini 3.0 Only
// December 2025 - Latest Gemini 3 Models

const llmProviders = {
    google: {
        name: 'Google Gemini 3',
        keyPrefix: 'AIza',
        storageKey: 'googleApiKey',
        modelStorageKey: 'googleModel',
        models: [
            { 
                id: 'gemini-3-pro-preview', 
                name: 'Gemini 3 Pro',
                description: 'Advanced reasoning, 1M context window',
                capabilities: ['text', 'vision', 'code', 'audio']
            },
            { 
                id: 'gemini-3-pro-image-preview', 
                name: 'Gemini 3 Pro Image',
                description: 'Image generation up to 4096px',
                capabilities: ['text', 'vision', 'image-generation']
            }
        ],
        defaultModel: 'gemini-3-pro-preview',
        imageModel: 'gemini-3-pro-image-preview',
        // API endpoints
        textEndpoint: 'https://generativelanguage.googleapis.com/v1beta/models',
        imageEndpoint: 'https://generativelanguage.googleapis.com/v1beta/models'
    }
};

// Always use Gemini
function getSelectedProvider() {
    return 'google';
}

// Get text generation model
function getSelectedModel() {
    const config = llmProviders.google;
    const storedModel = localStorage.getItem(config.modelStorageKey);
    
    const validModelIds = config.models.map(m => m.id);
    if (storedModel && validModelIds.includes(storedModel)) {
        return storedModel;
    }
    
    return config.defaultModel;
}

// Get image generation model
function getImageModel() {
    return llmProviders.google.imageModel;
}

// Get API key
function getApiKey() {
    return localStorage.getItem(llmProviders.google.storageKey)
        || window.ENV?.GOOGLE_API_KEY
        || null;
}

// Validate API key format (Gemini keys start with AIza)
function validateApiKeyFormat(key) {
    return key && key.startsWith(llmProviders.google.keyPrefix);
}

// Generate model options for settings UI
function generateModelOptions(selectedModel = null) {
    const config = llmProviders.google;
    const selected = selectedModel || getSelectedModel();
    return config.models.map(model =>
        `<option value="${model.id}"${model.id === selected ? ' selected' : ''}>${model.name}</option>`
    ).join('\n');
}

// Export for use
window.llmProviders = llmProviders;
window.getSelectedModel = getSelectedModel;
window.getImageModel = getImageModel;
window.getSelectedProvider = getSelectedProvider;
window.getApiKey = getApiKey;
window.validateApiKeyFormat = validateApiKeyFormat;
window.generateModelOptions = generateModelOptions;
```

### 1.3 Gemini 3 Pro API Specifications

From official Google documentation (December 2025):

| Specification | Value |
|--------------|-------|
| Model ID | `gemini-3-pro-preview` |
| Max Input Tokens | 1,048,576 (1M) |
| Max Output Tokens | 65,536 |
| Supported Inputs | Text, Code, Images, Audio, Video, PDF |
| Supported Outputs | Text |
| Temperature Range | 0.0 - 2.0 (default 1.0) |
| Region | `global` |

### 1.4 Gemini 3 Pro Image API Specifications

| Specification | Value |
|--------------|-------|
| Model ID | `gemini-3-pro-image-preview` |
| Max Output Resolution | 4096px |
| Supported Aspect Ratios | `1:1`, `3:2`, `2:3`, `3:4`, `4:3`, `4:5`, `5:4`, `9:16`, `16:9`, `21:9` |
| Response Modalities | `TEXT`, `IMAGE` |
| Best Languages | EN, es-MX, ja-JP, zh-CN, hi-IN, de-DE, fr-FR, ko-KR, pt-BR, ru-RU |

---

## 2. Magic Design Complete Pipeline

### 2.1 Current Pipeline (6 Stages)

```
Magic Design Click
    |
    v
Stage 1: Analyze Screenshots (Gemini 3 Pro - Vision)
    |
    v
Stage 2: Plan Design Strategy
    |
    v
Stage 3: Generate Backgrounds (BROKEN - Returns null)
    |
    v
Stage 4: Apply Layouts
    |
    v
Stage 5: Generate Headlines (Gemini 3 Pro)
    |
    v
Stage 6: Final Polish
    |
    v
Result: Upload-Ready Screenshots
```

### 2.2 What "Upload-Ready" Means

For screenshots to be **upload-ready** for App Store Connect:

1. **Correct Dimensions**: 1290x2796 (iPhone 6.7"), 1320x2868 (iPhone 6.9")
2. **Professional Backgrounds**: AI-generated or premium gradients
3. **Compelling Headlines**: 2-4 words, benefit-focused
4. **Proper Text Contrast**: Readable on any background
5. **Device Positioning**: Proper scale (58-72%), shadow, no edge cropping
6. **Visual Consistency**: Cohesive color palette across all screenshots
7. **No Placeholder Content**: Everything is finalized

### 2.3 Magic Design Options

The Magic Design modal should offer:

```javascript
const MAGIC_DESIGN_OPTIONS = {
    // App category (auto-detected or manual)
    category: 'auto', // or 'fitness', 'finance', 'productivity', etc.
    
    // Design theme
    theme: 'auto', // or 'modern_minimal', 'neon_cyber', 'soft_luxury', etc.
    
    // Headline style
    headlineStyle: 'short_punchy', // or 'benefit_focused', 'question', 'command'
    
    // Story flow (NEW - currently hidden)
    storyFlow: 'auto', // or 'journey', 'problem-solution', 'feature-showcase', etc.
    
    // Background generation (NEW - currently broken)
    generateBackgroundImages: true, // Use Gemini 3 Pro Image
    
    // Export settings
    outputDevice: 'iphone-6.9', // Target device size
    exportFormat: 'png',
    exportQuality: 100
};
```

---

## 3. Critical Fixes Required

### 3.1 CRITICAL: Implement Background Image Generation

**Problem:** `generateBackgroundImage()` returns `null` - the entire feature is a stub.

**Location:** `ai-engine.js:421-433`

**Current Code (Broken):**
```javascript
async function generateBackgroundImage(analysis, strategy) {
    // This would integrate with image generation APIs
    // For now, return null to use gradient fallback
    return null;  // <-- ALWAYS RETURNS NULL
}
```

**Fixed Code - Using Gemini 3 Pro Image:**

```javascript
/**
 * Generate AI background image using Gemini 3 Pro Image
 * @param {Object} analysis - App analysis from Stage 1
 * @param {Object} strategy - Design strategy from Stage 2
 * @returns {string|null} - Base64 data URL of generated image or null
 */
async function generateBackgroundImage(analysis, strategy) {
    const apiKey = getApiKey();
    if (!apiKey) {
        console.warn('[Background Gen] No API key available');
        return null;
    }

    const prompt = buildBackgroundImagePrompt(analysis, strategy);
    const model = 'gemini-3-pro-image-preview';
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

    updateAIProgress('Generating AI background image...');

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{
                    parts: [{ text: prompt }]
                }],
                generationConfig: {
                    responseModalities: ['IMAGE', 'TEXT'],
                    temperature: 0.8,
                    // App Store screenshot aspect ratio (iPhone)
                    imageConfig: {
                        aspectRatio: '9:19.5'
                    }
                },
                safetySettings: [
                    {
                        category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
                        threshold: 'BLOCK_MEDIUM_AND_ABOVE'
                    }
                ]
            })
        });

        if (!response.ok) {
            const error = await response.json();
            console.error('[Background Gen] API error:', error);
            return null;
        }

        const data = await response.json();
        
        // Extract image from response
        const parts = data.candidates?.[0]?.content?.parts || [];
        for (const part of parts) {
            if (part.inlineData?.data) {
                const mimeType = part.inlineData.mimeType || 'image/png';
                return `data:${mimeType};base64,${part.inlineData.data}`;
            }
        }

        console.warn('[Background Gen] No image in response');
        return null;

    } catch (error) {
        console.error('[Background Gen] Failed:', error);
        return null;
    }
}

/**
 * Build optimized prompt for background generation
 */
function buildBackgroundImagePrompt(analysis, strategy) {
    const category = analysis.app?.category || 'productivity';
    const vibe = analysis.app?.vibe || 'professional';
    const colors = strategy.colorPalette || {};
    const backgroundTone = strategy.backgroundTone || 'dark';

    return `Create a premium App Store screenshot background image.

REQUIREMENTS:
- Style: Abstract, modern, professional ${vibe} aesthetic
- Category feel: ${category} app
- Color palette: Primary ${colors.primary || '#6366F1'}, Secondary ${colors.secondary || '#8B5CF6'}, Accent ${colors.accent || '#EC4899'}
- Tone: ${backgroundTone} background
- NO text, NO logos, NO objects, NO devices
- Smooth gradients, soft glows, subtle depth
- Clean and uncluttered - this is a BACKGROUND for overlay content
- Resolution: High quality, sharp details
- Style: Similar to Apple's App Store featured app backgrounds

Create a visually stunning abstract background with flowing shapes, subtle gradients, and professional polish. The background should enhance readability of white or light text overlaid on top.`;
}
```

### 3.2 CRITICAL: Expose Story Flows in UI

**Problem:** Story Flows feature is fully implemented but has no UI button.

**Location:** `ai-engine.js:1203-1518` (implementation exists)

**Fix - Add to index.html (inside magic-design-input-modal):**

```html
<!-- Story Flow Selector - Add after theme selector -->
<div class="form-group">
    <label for="story-flow-select">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
            <polyline points="14 2 14 8 20 8"/>
            <line x1="16" y1="13" x2="8" y2="13"/>
            <line x1="16" y1="17" x2="8" y2="17"/>
        </svg>
        Narrative Flow
    </label>
    <select id="story-flow-select" class="form-select">
        <option value="auto">Let AI Decide</option>
        <option value="journey">User Journey - Step by step experience</option>
        <option value="problem-solution">Problem to Solution - Show the transformation</option>
        <option value="feature-showcase">Feature Showcase - Highlight key features</option>
        <option value="transformation">Before/After - Show the change</option>
        <option value="emotional">Emotional Appeal - Connect with users</option>
    </select>
    <small class="form-hint">How your screenshots tell a story across the carousel</small>
</div>

<!-- Background Generation Toggle -->
<div class="form-group">
    <label class="checkbox-label">
        <input type="checkbox" id="generate-bg-images" checked>
        <span>Generate AI Backgrounds</span>
    </label>
    <small class="form-hint">Use Gemini 3 Pro Image for professional backgrounds</small>
</div>
```

**Fix - Update Magic Design button handler in app.js:**

```javascript
// In the Magic Design button click handler
document.getElementById('magic-design-btn')?.addEventListener('click', async () => {
    // ... existing validation ...

    // Get all options from modal
    const categorySelect = document.getElementById('category-select');
    const themeSelect = document.getElementById('theme-select');
    const headlineStyleSelect = document.getElementById('headline-style-select');
    const storyFlowSelect = document.getElementById('story-flow-select');
    const generateBgCheckbox = document.getElementById('generate-bg-images');

    const options = {
        category: categorySelect?.value || 'auto',
        theme: themeSelect?.value || 'auto',
        headlineStyle: headlineStyleSelect?.value || 'short_punchy',
        storyFlow: storyFlowSelect?.value || 'auto',
        generateBackgroundImages: generateBgCheckbox?.checked ?? true
    };

    // Close modal and run Magic Design
    closeModal('magic-design-input-modal');
    
    await window.AIEngine.magicDesign(options);
});
```

### 3.3 HIGH: Update Gemini API Calls

**Problem:** API calls use inconsistent patterns and outdated syntax.

**Location:** `agents.js:93-194`

**Fix - Standardized Gemini 3 API Call Function:**

```javascript
/**
 * Unified Gemini 3 API call function
 * @param {string} prompt - Text prompt
 * @param {Object} options - Configuration options
 * @returns {string|Object} - Response text or parsed JSON
 */
async function callGemini3(prompt, options = {}) {
    const apiKey = getApiKey();
    if (!apiKey) {
        throw new Error('No Gemini API key configured. Please add your API key in Settings.');
    }

    const model = options.useImageModel 
        ? 'gemini-3-pro-image-preview' 
        : 'gemini-3-pro-preview';
    
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

    // Build request parts
    const parts = [{ text: prompt }];
    
    // Add images if provided (for vision tasks)
    if (options.images && options.images.length > 0) {
        for (const img of options.images) {
            if (img.base64) {
                parts.push({
                    inline_data: {
                        mime_type: img.mimeType || 'image/jpeg',
                        data: img.base64.replace(/^data:image\/\w+;base64,/, '')
                    }
                });
            }
        }
    }

    const requestBody = {
        contents: [{ parts }],
        generationConfig: {
            temperature: options.temperature || 0.7,
            maxOutputTokens: options.maxTokens || 8192,
            // For image generation
            ...(options.generateImage && {
                responseModalities: ['TEXT', 'IMAGE']
            })
        }
    };

    // Create timeout controller
    const controller = new AbortController();
    const timeout = options.timeout || 30000;
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestBody),
            signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error?.message || `Gemini API error: ${response.status}`);
        }

        const data = await response.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';

        if (!text && !options.generateImage) {
            throw new Error('Empty response from Gemini API');
        }

        // Parse JSON if requested
        if (options.json) {
            return parseJSONFromResponse(text);
        }

        // Return full data for image generation
        if (options.generateImage) {
            return data;
        }

        return text;

    } catch (error) {
        clearTimeout(timeoutId);
        
        if (error.name === 'AbortError') {
            throw new Error('API request timed out. Please try again.');
        }
        throw error;
    }
}

/**
 * Parse JSON from AI response (handles markdown code blocks)
 */
function parseJSONFromResponse(text) {
    let cleaned = text;
    
    // Remove markdown code blocks
    const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
    if (jsonMatch) {
        cleaned = jsonMatch[1];
    } else {
        // Try to find raw JSON
        const startIdx = text.indexOf('{');
        const endIdx = text.lastIndexOf('}');
        if (startIdx !== -1 && endIdx !== -1) {
            cleaned = text.substring(startIdx, endIdx + 1);
        }
    }
    
    return JSON.parse(cleaned);
}

// Export
window.callGemini3 = callGemini3;
```

---

## 4. Rendering & Performance Issues

### 4.1 CRITICAL: Noise Generation Performance

**Problem:** Processes 15+ million pixels synchronously, blocking UI.

**Location:** `app.js:7019-7033`

**Fix:** Cache noise texture (see Section 6.1)

### 4.2 HIGH: Side Preview Re-render Spam

**Problem:** 4 extra canvases rendered on every state change.

**Location:** `app.js:5709-5710`

**Fix:** Debounce side preview updates:

```javascript
let sidePreviewTimeout = null;

function updateCanvas() {
    // ... existing drawing code ...
    
    // Debounce side previews
    clearTimeout(sidePreviewTimeout);
    sidePreviewTimeout = setTimeout(() => {
        requestAnimationFrame(updateSidePreviews);
    }, 100);
}
```

### 4.3 HIGH: 3D Texture Memory Leaks

**Problem:** Textures created/destroyed on every side preview render.

**Location:** `three-renderer.js:847-861`

**Fix:** Pool and reuse textures (see Section 6.2)

---

## 5. State Management Issues

### 5.1 CRITICAL: Undo Stack Memory

**Problem:** Stores base64 images in every undo state.

**Location:** `app.js:1151-1175`

**Impact:** Can reach 5GB+ memory usage

**Fix:** Store image references only, not base64 data:

```javascript
function trackUndoState(actionName = 'Change') {
    if (window.UndoRedo) {
        const undoState = {
            screenshots: state.screenshots.map(s => ({
                // Store metadata only, NOT base64 src
                localizedImages: s.localizedImages 
                    ? Object.keys(s.localizedImages).reduce((acc, lang) => {
                        acc[lang] = { 
                            name: s.localizedImages[lang]?.name
                            // REMOVED: src (base64 data)
                        };
                        return acc;
                    }, {}) 
                    : {},
                background: s.background,
                screenshot: s.screenshot,
                text: s.text,
                layout: s.layout
            })),
            selectedIndex: state.selectedIndex,
            // ... other state ...
        };
        window.UndoRedo.saveState(undoState, actionName);
    }
}
```

### 5.2 HIGH: Race Condition in Image Loading

**Problem:** Async image loading can complete out of order.

**Location:** `app.js:1227-1292`

**Fix:** Use Promise.all for ordered loading (see Section 6.3)

### 5.3 HIGH: Database Silent Failures

**Problem:** IndexedDB errors resolve silently - users may lose work.

**Location:** `app.js:864-908`

**Fix:** Surface errors to user:

```javascript
request.onerror = (event) => {
    console.error('IndexedDB error:', event.target.error);
    showAppAlert(
        'Database error. Your changes may not be saved. Try refreshing the page.',
        'error'
    );
    resolve(null);
};
```

---

## 6. Complete Code Solutions

### 6.1 Noise Performance Fix

```javascript
// Add to top of app.js
let noiseCanvas = null;
let noiseCacheKey = '';

function drawNoise() {
    const bg = getBackground();
    if (!bg.noise) return;
    
    const dims = getCanvasDimensions();
    const cacheKey = `${dims.width}x${dims.height}@${bg.noiseIntensity}`;
    
    // Only regenerate if parameters changed
    if (cacheKey !== noiseCacheKey) {
        noiseCanvas = document.createElement('canvas');
        noiseCanvas.width = dims.width;
        noiseCanvas.height = dims.height;
        const noiseCtx = noiseCanvas.getContext('2d');
        
        const imageData = noiseCtx.createImageData(dims.width, dims.height);
        const data = imageData.data;
        const intensity = bg.noiseIntensity * 2.55;
        
        for (let i = 0; i < data.length; i += 4) {
            const noise = (Math.random() - 0.5) * intensity;
            data[i] = data[i + 1] = data[i + 2] = 128 + noise;
            data[i + 3] = 255;
        }
        
        noiseCtx.putImageData(imageData, 0, 0);
        noiseCacheKey = cacheKey;
    }
    
    // Fast composite
    ctx.save();
    ctx.globalCompositeOperation = 'overlay';
    ctx.globalAlpha = bg.noiseIntensity / 100;
    ctx.drawImage(noiseCanvas, 0, 0);
    ctx.restore();
}
```

### 6.2 Texture Pool for 3D

```javascript
// Add to three-renderer.js
const texturePool = new Map();
const materialPool = new Map();

function getPooledTexture(imageId, imageElement, cornerRadius) {
    const key = `${imageId}-${cornerRadius}`;
    
    if (texturePool.has(key)) {
        return texturePool.get(key);
    }
    
    const roundedImage = createRoundedScreenImage(imageElement, cornerRadius);
    const texture = new THREE.Texture(roundedImage);
    texture.needsUpdate = true;
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    
    // Limit pool size
    if (texturePool.size > 20) {
        const oldestKey = texturePool.keys().next().value;
        texturePool.get(oldestKey)?.dispose();
        texturePool.delete(oldestKey);
    }
    
    texturePool.set(key, texture);
    return texture;
}

function clearTexturePool() {
    for (const texture of texturePool.values()) {
        texture.dispose();
    }
    texturePool.clear();
    
    for (const material of materialPool.values()) {
        material.dispose();
    }
    materialPool.clear();
}
```

### 6.3 Fixed Image Loading with Promise.all

```javascript
async function loadScreenshotWithLocalizedImages(savedScreenshot, index) {
    const langKeys = Object.keys(savedScreenshot.localizedImages || {});
    
    if (langKeys.length === 0) {
        return {
            index,
            localizedImages: {},
            ...savedScreenshot
        };
    }
    
    const results = await Promise.allSettled(
        langKeys.map(async (lang) => {
            const savedLang = savedScreenshot.localizedImages[lang];
            if (!savedLang?.src) return { lang, image: null };
            
            return new Promise((resolve) => {
                const img = new Image();
                img.onload = () => resolve({ lang, image: img, name: savedLang.name });
                img.onerror = () => resolve({ lang, image: null });
                img.src = savedLang.src;
            });
        })
    );
    
    const localizedImages = {};
    for (const result of results) {
        if (result.status === 'fulfilled' && result.value.image) {
            const { lang, image, name } = result.value;
            localizedImages[lang] = { image, name };
        }
    }
    
    return { 
        index, 
        localizedImages,
        background: savedScreenshot.background,
        screenshot: savedScreenshot.screenshot,
        text: savedScreenshot.text,
        layout: savedScreenshot.layout
    };
}
```

### 6.4 Complete Magic Design Function

```javascript
/**
 * Magic Design - Complete Pipeline for Upload-Ready Screenshots
 * Uses Gemini 3 Pro for analysis/text and Gemini 3 Pro Image for backgrounds
 */
async function magicDesign(options = {}) {
    if (aiEngineState.isProcessing) {
        showAppAlert('AI is already processing. Please wait.', 'info');
        return;
    }

    if (!state.screenshots || state.screenshots.length === 0) {
        showAppAlert('Please add some screenshots first.', 'info');
        return;
    }

    const apiKey = getApiKey();
    if (!apiKey) {
        showAppAlert('Please configure your Gemini API key in Settings first.', 'error');
        return;
    }

    aiEngineState.isProcessing = true;
    resetAIStages();
    showAIProgressModal();

    try {
        // Stage 1: Analyze Screenshots with Gemini 3 Pro Vision
        updateAIStage('analyze', 'processing');
        updateAIProgress('Analyzing your screenshots with Gemini 3 Pro...');
        const analysis = await analyzeAppScreenshots(options.category);
        aiEngineState.lastAnalysis = analysis;
        updateAIStage('analyze', 'complete');

        // Stage 2: Plan Design Strategy
        updateAIStage('strategy', 'processing');
        updateAIProgress('Planning professional design strategy...');
        const strategy = await planDesignStrategy(analysis, options);
        aiEngineState.lastStrategy = strategy;
        updateAIStage('strategy', 'complete');

        // Stage 3: Generate/Apply Backgrounds
        updateAIStage('backgrounds', 'processing');
        if (options.generateBackgroundImages) {
            updateAIProgress('Generating AI backgrounds with Gemini 3 Pro Image...');
            await applyAIBackgrounds(analysis, strategy);
        } else {
            updateAIProgress('Applying professional gradient backgrounds...');
            await applySmartBackgrounds(analysis, strategy, false);
        }
        updateAIStage('backgrounds', 'complete');

        // Stage 4: Apply Layouts
        updateAIStage('layouts', 'processing');
        updateAIProgress('Optimizing screenshot layouts for App Store...');
        
        // Apply story flow if specified
        if (options.storyFlow && options.storyFlow !== 'auto') {
            await applyStoryFlowLayouts(options.storyFlow, analysis);
        } else {
            await applySmartLayouts(analysis, strategy);
        }
        updateAIStage('layouts', 'complete');

        // Stage 5: Generate Headlines
        updateAIStage('headlines', 'processing');
        updateAIProgress('Writing compelling marketing headlines...');
        await generateSmartHeadlines(analysis, strategy, options.headlineStyle);
        updateAIStage('headlines', 'complete');

        // Stage 6: Final Polish
        updateAIStage('polish', 'processing');
        updateAIProgress('Adding final professional polish...');
        await applyFinalPolish(analysis, strategy);
        
        // Ensure text contrast
        await ensureTextContrast();
        
        // Validate all screenshots
        const validation = validateAllScreenshots();
        if (validation.issues.length > 0) {
            console.warn('[Magic Design] Validation issues:', validation.issues);
        }
        
        updateAIStage('polish', 'complete');

        // Update UI
        syncUIWithState();
        updateCanvas();
        saveState();

        // Show success report
        setTimeout(() => {
            hideAIProgressModal();
            showStrategyReport(analysis, strategy);
            showAppAlert(
                `Magic Design complete! ${state.screenshots.length} upload-ready screenshots created.`,
                'success'
            );
        }, 500);

    } catch (error) {
        console.error('Magic Design error:', error);
        hideAIProgressModal();
        showAppAlert(`Magic Design failed: ${error.message}`, 'error');
    } finally {
        aiEngineState.isProcessing = false;
    }
}

/**
 * Apply AI-generated backgrounds to all screenshots
 */
async function applyAIBackgrounds(analysis, strategy) {
    const screenshots = state.screenshots;
    
    // Generate one background per unique "section" of screenshots
    // to maintain visual consistency while having variety
    const sectionsCount = Math.min(3, Math.ceil(screenshots.length / 2));
    const generatedBackgrounds = [];
    
    for (let i = 0; i < sectionsCount; i++) {
        updateAIProgress(`Generating background ${i + 1}/${sectionsCount}...`);
        
        // Vary the prompt slightly for each section
        const sectionAnalysis = {
            ...analysis,
            app: {
                ...analysis.app,
                vibe: i === 0 ? analysis.app.vibe : 
                      i === 1 ? 'energetic' : 'calm'
            }
        };
        
        const bgImage = await generateBackgroundImage(sectionAnalysis, strategy);
        generatedBackgrounds.push(bgImage);
    }
    
    // Apply backgrounds to screenshots
    for (let i = 0; i < screenshots.length; i++) {
        const screenshot = screenshots[i];
        const bgIndex = Math.floor(i / Math.ceil(screenshots.length / sectionsCount));
        const bgImage = generatedBackgrounds[bgIndex];
        
        screenshot.background = screenshot.background || {};
        
        if (bgImage) {
            // Use AI-generated background
            screenshot.background.type = 'image';
            screenshot.background.image = bgImage;
            screenshot.background.imageFit = 'cover';
            screenshot.background.imageBlur = 0;
            screenshot.background.overlayColor = '#000000';
            screenshot.background.overlayOpacity = 10; // Slight overlay for text contrast
        } else {
            // Fallback to gradient
            await applySmartBackgrounds(
                { ...analysis, screenshots: [analysis.screenshots?.[i]] },
                strategy,
                false
            );
        }
    }
}

/**
 * Ensure text has proper contrast on backgrounds
 */
async function ensureTextContrast() {
    for (const screenshot of state.screenshots) {
        if (!screenshot.text || !screenshot.background) continue;
        
        // For dark backgrounds, use white text
        // For light backgrounds, use dark text
        const isDarkBg = screenshot.background.type === 'gradient' 
            ? isGradientDark(screenshot.background.gradient)
            : (screenshot.background.type === 'image' || 
               isColorDark(screenshot.background.solid || '#000000'));
        
        if (isDarkBg) {
            screenshot.text.headlineColor = '#FFFFFF';
            screenshot.text.subheadlineColor = '#CCCCCC';
        } else {
            screenshot.text.headlineColor = '#1A1A1A';
            screenshot.text.subheadlineColor = '#4A4A4A';
        }
        
        // Enable subtle text shadow for readability
        screenshot.text.headlineShadow = {
            enabled: true,
            color: isDarkBg ? '#000000' : '#FFFFFF',
            blur: 20,
            offsetX: 0,
            offsetY: 4,
            opacity: isDarkBg ? 30 : 20
        };
    }
}

/**
 * Validate all screenshots for App Store readiness
 */
function validateAllScreenshots() {
    const issues = [];
    
    for (let i = 0; i < state.screenshots.length; i++) {
        const screenshot = state.screenshots[i];
        const lang = state.currentLanguage || 'en';
        
        // Check headline
        const headline = screenshot.text?.headlines?.[lang];
        if (!headline || headline.trim() === '') {
            issues.push({
                index: i,
                type: 'missing_headline',
                message: `Screenshot ${i + 1} is missing a headline`
            });
        } else if (headline.split(' ').length > 6) {
            issues.push({
                index: i,
                type: 'long_headline',
                message: `Screenshot ${i + 1} headline may be too long`
            });
        }
        
        // Check background
        if (!screenshot.background || 
            (screenshot.background.type === 'solid' && 
             screenshot.background.solid === '#1a1a2e')) {
            issues.push({
                index: i,
                type: 'default_background',
                message: `Screenshot ${i + 1} has default background`
            });
        }
        
        // Check device positioning
        const settings = screenshot.screenshot;
        if (settings) {
            if (settings.scale < 50 || settings.scale > 85) {
                issues.push({
                    index: i,
                    type: 'device_scale',
                    message: `Screenshot ${i + 1} device scale may be too ${settings.scale < 50 ? 'small' : 'large'}`
                });
            }
        }
    }
    
    return { valid: issues.length === 0, issues };
}
```

---

## 7. Priority Implementation Order

### Phase 1: Critical (Do First)

1. **Update `llm.js`** with correct Gemini 3.0 configuration
2. **Implement `generateBackgroundImage()`** using Gemini 3 Pro Image API
3. **Add Story Flows UI** to Magic Design modal

### Phase 2: High Priority

4. **Fix noise performance** with caching
5. **Fix undo memory leak** by removing base64 storage
6. **Add text contrast validation**

### Phase 3: Polish

7. **Add texture pooling** for 3D mode
8. **Fix image loading race conditions**
9. **Add export validation** before download

---

## 8. Testing Checklist

After implementing fixes, verify:

- [ ] Magic Design completes all 6 stages without errors
- [ ] AI backgrounds are generated (not null)
- [ ] Story Flows dropdown appears and works
- [ ] Headlines are generated for all screenshots
- [ ] Text has proper contrast on all backgrounds
- [ ] Export produces correct dimensions (1320x2868 for iPhone 6.9")
- [ ] No console errors during Magic Design
- [ ] Memory stays stable (no growth during repeated Magic Design runs)
- [ ] Noise effect doesn't block UI
- [ ] 3D mode works without texture errors

---

## Conclusion

With these fixes implemented, Magic Design will:

1. **Analyze screenshots** using Gemini 3 Pro's vision capabilities
2. **Generate professional backgrounds** using Gemini 3 Pro Image
3. **Apply smart layouts** optimized for App Store carousel
4. **Write compelling headlines** that convert
5. **Ensure visual consistency** across all screenshots
6. **Output upload-ready files** for App Store Connect

The result: **One-click professional screenshots** that rival AppLaunchpad.

---

## 9. Professional Template System

> **GOAL:** Provide ready-to-use templates similar to AppLaunchpad and AppScreens that users can instantly apply and customize.

### 9.1 Template Categories (Based on Examples Analysis)

The following template categories were identified from analyzing AppLaunchpad/AppScreens examples:

| Category | Description | Example Templates |
|----------|-------------|-------------------|
| **Minimal** | Clean, simple backgrounds | Minimal Dark, Minimal Light |
| **Gradient** | Smooth color transitions | Purple Haze, Ocean Breeze, Sunset Vibes |
| **Dynamic** | Tilted/rotated device placement | Tilted Modern, Floating Card |
| **Neon/Cyber** | Dark with neon accents | Neon Nights, Cyber Punk |
| **Soft/Elegant** | Muted, premium feel | Soft Blush, Lavender Dream |
| **Bold** | High contrast, startup style | Startup Bold, Tech Blue |
| **Nature** | Earth tones, organic | Forest Green, Golden Hour |
| **Glass** | Glassmorphism effects | Glass Dark, Glass Aurora, Glass Frost |
| **3D Depth** | Strong shadows, perspective | Depth Float, Perspective |

### 9.2 Complete Template Data Structure

**Location:** `fresh-templates.js`

```javascript
const FRESH_TEMPLATES = [
    {
        id: 'purple-haze',
        name: 'Purple Haze',
        category: 'gradient',
        preview: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        config: {
            background: {
                type: 'gradient',
                stops: [
                    { color: '#667eea', position: 0 },
                    { color: '#764ba2', position: 100 }
                ],
                angle: 135
            },
            device: { 
                scale: 68, 
                x: 50, 
                y: 70, 
                rotation: 0 
            },
            text: {
                font: 'Poppins',
                weight: '700',
                size: 76,
                color: '#ffffff',
                position: 'top',
                offsetY: 7
            },
            shadow: {
                blur: 40,
                opacity: 30,
                y: 15
            },
            style: 'vibrant'
        }
    },
    // ... 24 more templates
];
```

### 9.3 Template Picker UI Implementation

**Add to `index.html`:**

```html
<!-- Template Gallery Modal -->
<div id="template-gallery-modal" class="modal">
    <div class="modal-content modal-large">
        <div class="modal-header">
            <h3>Choose Template</h3>
            <button class="close-modal" onclick="closeModal('template-gallery-modal')">&times;</button>
        </div>
        
        <!-- Category Filter -->
        <div class="template-categories">
            <button class="category-btn active" data-category="all">All</button>
            <button class="category-btn" data-category="minimal">Minimal</button>
            <button class="category-btn" data-category="gradient">Gradient</button>
            <button class="category-btn" data-category="dynamic">Dynamic</button>
            <button class="category-btn" data-category="neon">Neon</button>
            <button class="category-btn" data-category="soft">Soft</button>
            <button class="category-btn" data-category="glass">Glass</button>
            <button class="category-btn" data-category="3d">3D</button>
        </div>
        
        <!-- Template Grid -->
        <div class="template-grid" id="template-grid">
            <!-- Populated dynamically -->
        </div>
        
        <!-- Actions -->
        <div class="modal-footer">
            <label class="checkbox-inline">
                <input type="checkbox" id="apply-to-all-checkbox" checked>
                Apply to all screenshots
            </label>
            <button class="btn btn-secondary" onclick="closeModal('template-gallery-modal')">Cancel</button>
        </div>
    </div>
</div>
```

**Add to `styles.css`:**

```css
/* Template Gallery Styles */
.template-categories {
    display: flex;
    gap: 8px;
    padding: 16px;
    border-bottom: 1px solid var(--border-color);
    flex-wrap: wrap;
}

.category-btn {
    padding: 8px 16px;
    border-radius: 20px;
    border: 1px solid var(--border-color);
    background: transparent;
    color: var(--text-secondary);
    cursor: pointer;
    transition: all 0.2s;
    font-size: 13px;
}

.category-btn:hover {
    border-color: var(--accent);
    color: var(--accent);
}

.category-btn.active {
    background: var(--accent);
    border-color: var(--accent);
    color: white;
}

.template-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
    gap: 16px;
    padding: 16px;
    max-height: 60vh;
    overflow-y: auto;
}

.template-card {
    position: relative;
    border-radius: 12px;
    overflow: hidden;
    cursor: pointer;
    transition: transform 0.2s, box-shadow 0.2s;
    aspect-ratio: 9/16;
    border: 2px solid transparent;
}

.template-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(0,0,0,0.3);
}

.template-card.selected {
    border-color: var(--accent);
    box-shadow: 0 0 0 2px var(--accent);
}

.template-preview {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
}

.template-preview-device {
    width: 50%;
    height: 70%;
    background: #333;
    border-radius: 20px;
    box-shadow: 0 10px 30px rgba(0,0,0,0.3);
}

.template-name {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 12px;
    background: linear-gradient(transparent, rgba(0,0,0,0.8));
    color: white;
    font-size: 13px;
    font-weight: 500;
}
```

### 9.4 Template Application Functions

**Add to `app.js`:**

```javascript
// Template Gallery State
let selectedTemplateId = null;

// Open template gallery
function openTemplateGallery() {
    renderTemplateGrid('all');
    showModal('template-gallery-modal');
}

// Render template grid
function renderTemplateGrid(category) {
    const grid = document.getElementById('template-grid');
    const templates = category === 'all' 
        ? window.FreshTemplates.FRESH_TEMPLATES 
        : window.FreshTemplates.getTemplatesByCategory(category);
    
    grid.innerHTML = templates.map(template => `
        <div class="template-card ${selectedTemplateId === template.id ? 'selected' : ''}" 
             data-template-id="${template.id}"
             onclick="selectTemplate('${template.id}')">
            <div class="template-preview" style="background: ${template.preview}">
                <div class="template-preview-device"></div>
            </div>
            <div class="template-name">${template.name}</div>
        </div>
    `).join('');
}

// Select and apply template
function selectTemplate(templateId) {
    const template = window.FreshTemplates.getTemplateById(templateId);
    if (!template) return;
    
    const applyToAll = document.getElementById('apply-to-all-checkbox')?.checked;
    
    if (applyToAll) {
        window.FreshTemplates.applyTemplateToAll(template, state.screenshots);
    } else {
        const currentScreenshot = state.screenshots[state.selectedIndex];
        if (currentScreenshot) {
            window.FreshTemplates.applyTemplate(template, currentScreenshot);
        }
    }
    
    // Update UI
    syncUIWithState();
    updateCanvas();
    saveState();
    
    // Close modal
    closeModal('template-gallery-modal');
    
    showAppAlert(`Applied "${template.name}" template`, 'success');
}

// Category filter handler
document.querySelectorAll('.category-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        document.querySelectorAll('.category-btn').forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        renderTemplateGrid(e.target.dataset.category);
    });
});
```

### 9.5 Smart Template Generation

Generate templates that match the user's app colors:

```javascript
/**
 * Generate a smart template based on screenshot colors
 */
async function generateSmartTemplate() {
    const screenshot = state.screenshots[state.selectedIndex];
    if (!screenshot) return;
    
    const imageData = getScreenshotImage(screenshot);
    if (!imageData?.src) return;
    
    // Extract colors
    const dominantColors = await window.FreshTemplates.extractColorsFromImage(imageData.src);
    
    // Determine if dark or light mode based on app
    const isDark = state.background?.type === 'gradient' 
        ? isGradientDark(state.background.gradient)
        : true;
    
    // Generate matching template
    const smartTemplate = window.FreshTemplates.generateSmartTemplate(dominantColors, isDark);
    
    // Apply to current or all
    const applyToAll = document.getElementById('apply-to-all-checkbox')?.checked;
    
    if (applyToAll) {
        window.FreshTemplates.applyTemplateToAll(smartTemplate, state.screenshots);
    } else {
        window.FreshTemplates.applyTemplate(smartTemplate, screenshot);
    }
    
    syncUIWithState();
    updateCanvas();
    saveState();
    
    showAppAlert('Generated template matching your app colors', 'success');
}
```

---

## 10. AI-Powered Magic Design System

> **GOAL:** Use Gemini 3 Pro and Gemini 3 Pro Image to automatically create professional screenshots matching AppLaunchpad/AppScreens quality.

### 10.1 Complete AI Pipeline

**Location:** `magic-design-spec.js`

```
User Clicks "Magic Design"
         |
         v
+------------------+
| Stage 1: Analyze |  <-- Gemini 3 Pro Vision
+------------------+
| - App category   |
| - Color palette  |
| - Features       |
| - Target users   |
+--------+---------+
         |
         v
+------------------+
| Stage 2: Strategy|  <-- Gemini 3 Pro Text
+------------------+
| - Theme choice   |
| - Layout flow    |
| - Typography     |
| - Headline style |
+--------+---------+
         |
         v
+------------------+
| Stage 3: Generate|  <-- Gemini 3 Pro Image
+------------------+
| - AI backgrounds |
| - OR gradients   |
+--------+---------+
         |
         v
+------------------+
| Stage 4: Layouts |  <-- Smart Layout Engine
+------------------+
| - Per-screenshot |
| - Story flow     |
| - Positions      |
+--------+---------+
         |
         v
+------------------+
| Stage 5: Headlines| <-- Gemini 3 Pro Text
+------------------+
| - Marketing copy |
| - Per-screenshot |
+--------+---------+
         |
         v
+------------------+
| Stage 6: Polish  |
+------------------+
| - Contrast check |
| - Shadow adjust  |
| - Final validate |
+--------+---------+
         |
         v
   UPLOAD-READY
   SCREENSHOTS
```

### 10.2 Vision Analysis Prompt

**Critical for accurate results:**

```javascript
const APP_ANALYSIS_PROMPT = `You are an expert App Store designer and ASO specialist. Analyze these app screenshots comprehensively.

ANALYZE AND RETURN:

1. APP IDENTITY
   - primaryFunction: What does this app do? (one clear sentence)
   - category: Main category from: fitness, finance, productivity, social, food, travel, education, entertainment, health, shopping, developer, gaming, weather, news, photo, video, utilities, lifestyle, kids, sports, navigation, business, music, medical
   - subcategory: More specific type (e.g., "teleprompter" for productivity)
   - targetAudience: Primary user demographic
   - vibe: Overall personality - one of: professional, playful, premium, minimal, energetic, calm, bold, elegant, techy, friendly
   - valueProp: Core value proposition in 5-10 words

2. PER-SCREENSHOT ANALYSIS (0-indexed array)
   For each screenshot provide:
   - feature: What specific feature/screen is shown
   - keyElements: Notable UI elements visible (array of 3-5 items)
   - userBenefit: What benefit does this screen demonstrate
   - visualWeight: Where content is concentrated - top, center, bottom
   - suggestedHeadline: A punchy 2-4 word marketing headline
   - suggestedSubheadline: A 4-8 word benefit statement

3. COLOR ANALYSIS
   - dominantColors: Array of 3-5 hex colors from the app UI
   - suggestedPrimary: Best primary brand color (hex)
   - suggestedSecondary: Complementary secondary color (hex)
   - suggestedAccent: Accent color for highlights (hex)
   - backgroundTone: "dark" or "light" recommendation

4. DESIGN RECOMMENDATIONS
   - backgroundStyle: gradient, solid, mesh, abstract, or minimal
   - useNoise: Should subtle noise texture be added? (boolean)
   - shadowStyle: soft, dramatic, minimal, or glow
   - suggestedTheme: MODERN_MINIMAL, SWISS_BRUTALISM, NEON_CYBER, SOFT_LUXURY, GLASS_MORPHISM, or CLEAN_PRO

Return ONLY valid JSON.`;
```

### 10.3 Background Image Generation

**Using Gemini 3 Pro Image API:**

```javascript
/**
 * Generate AI background using Gemini 3 Pro Image
 */
async function generateAIBackground(analysis, strategy, index) {
    const apiKey = getApiKey();
    const model = 'gemini-3-pro-image-preview';
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
    
    const category = analysis.app?.category || 'generic';
    const colors = strategy.colorPalette;
    
    // Category-specific prompts
    const categoryPrompts = {
        fitness: `Abstract flowing energy ribbons in dynamic motion, ${colors.primary}, ${colors.secondary}, motion blur streaks, matte black void background, high contrast, intense energy`,
        finance: `Ascending crystalline geometric planes, ${colors.primary}, ${colors.secondary}, precision-cut glass prisms, corporate sophistication, metallic accents`,
        social: `Soft organic gradient blobs, ${colors.primary}, ${colors.secondary}, flowing silk ribbon connections, warm diffused lighting, friendly approachable`,
        productivity: `Clean geometric grid systems, ${colors.primary}, ${colors.secondary}, organized minimal layers, sharp precision, architectural clarity`,
        health: `Soft healing gradients, ${colors.primary}, ${colors.secondary}, organic calming waves, wellness-inspired curves, gentle diffused light`,
        generic: `Abstract modern gradient, ${colors.primary}, ${colors.secondary}, smooth professional transitions, versatile design`
    };
    
    const prompt = `Create a premium App Store screenshot background.

${categoryPrompts[category] || categoryPrompts.generic}

CRITICAL REQUIREMENTS:
- Vertical format optimized for mobile (9:19.5 aspect ratio)
- NO text, NO logos, NO device mockups, NO UI elements
- Professional App Store quality
- Leave center-bottom relatively simple for device overlay
- Colors should enhance text readability

Create a visually stunning abstract background ready for App Store screenshots.`;

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }],
                generationConfig: {
                    responseModalities: ['IMAGE'],
                    temperature: 0.8
                }
            })
        });

        if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
        }

        const data = await response.json();
        const imagePart = data.candidates?.[0]?.content?.parts?.find(p => p.inline_data);
        
        if (imagePart) {
            return `data:${imagePart.inline_data.mime_type};base64,${imagePart.inline_data.data}`;
        }
        
        return null;
    } catch (error) {
        console.error('[Background Gen] Failed:', error);
        return null;
    }
}
```

### 10.4 Smart Layout Selection

**Match layouts to app category and screenshot content:**

```javascript
const LAYOUT_PRESETS = {
    hero_large: { scale: 72, x: 50, y: 75, rotation: 0 },
    classic: { scale: 65, x: 50, y: 72, rotation: 0 },
    offset_right: { scale: 68, x: 62, y: 70, rotation: -5 },
    offset_left: { scale: 68, x: 38, y: 70, rotation: 5 },
    panoramic_right: { scale: 82, x: 85, y: 58, rotation: -3 },
    panoramic_left: { scale: 82, x: 15, y: 58, rotation: 3 },
    tilted_dynamic: { scale: 78, x: 50, y: 62, rotation: -12 },
    minimal_type: { scale: 50, x: 50, y: 85, rotation: 0 },
    zoom_top: { scale: 110, x: 50, y: 95, rotation: 0 }
};

const CATEGORY_LAYOUT_MAP = {
    fitness: ['panoramic_right', 'tilted_dynamic', 'hero_large', 'zoom_top'],
    finance: ['hero_large', 'classic', 'offset_right', 'minimal_type'],
    social: ['offset_right', 'panoramic_right', 'classic', 'tilted_dynamic'],
    productivity: ['classic', 'hero_large', 'zoom_top', 'offset_right'],
    health: ['panoramic_right', 'classic', 'minimal_type', 'offset_right'],
    gaming: ['tilted_dynamic', 'panoramic_right', 'hero_large', 'zoom_top'],
    generic: ['hero_large', 'classic', 'offset_right', 'panoramic_right']
};

function selectLayoutsForScreenshots(analysis, count) {
    const category = analysis.app?.category || 'generic';
    const preferredLayouts = CATEGORY_LAYOUT_MAP[category] || CATEGORY_LAYOUT_MAP.generic;
    
    const layouts = [];
    const used = [];
    
    for (let i = 0; i < count; i++) {
        // First screenshot always hero
        if (i === 0) {
            layouts.push({ id: 'hero_large', ...LAYOUT_PRESETS.hero_large });
            used.push('hero_large');
            continue;
        }
        
        // Select best unused layout
        for (const layoutId of preferredLayouts) {
            if (!used.includes(layoutId)) {
                layouts.push({ id: layoutId, ...LAYOUT_PRESETS[layoutId] });
                used.push(layoutId);
                break;
            }
        }
        
        // Fallback to classic if all used
        if (layouts.length <= i) {
            layouts.push({ id: 'classic', ...LAYOUT_PRESETS.classic });
        }
    }
    
    return layouts;
}
```

### 10.5 Headline Generation

```javascript
const HEADLINE_STYLES = {
    short_punchy: {
        rules: 'headline: 2-4 words. subheadline: 4-8 words.',
        examples: ['Track. Thrive.', 'Money Moves', 'Push Further']
    },
    benefit_focused: {
        rules: 'headline: 3-5 words focusing on benefit. subheadline: 5-10 words explaining value.',
        examples: ['Sleep Better Tonight', 'Save Hours Daily', 'Earn More']
    },
    question: {
        rules: 'headline: 3-6 words as question. subheadline: 4-8 words answering it.',
        examples: ['Ready to Grow?', 'Why Wait?', 'What If...?']
    },
    command: {
        rules: 'headline: 2-4 words as command. subheadline: 4-8 words supporting action.',
        examples: ['Start Today', 'Take Control', 'Build More']
    }
};

async function generateHeadlines(apiKey, analysis, style = 'short_punchy') {
    const styleConfig = HEADLINE_STYLES[style];
    
    const prompt = `You are an elite App Store copywriter. Generate compelling headlines.

APP CONTEXT:
- Category: ${analysis.app.category}
- Function: ${analysis.app.primaryFunction}
- Value Prop: ${analysis.app.valueProp}
- Target: ${analysis.app.targetAudience}
- Vibe: ${analysis.app.vibe}

STYLE: ${styleConfig.rules}
EXAMPLES: ${styleConfig.examples.join(', ')}

CRITICAL RULES:
1. Screenshot 0 headline MUST focus on MAIN VALUE PROPOSITION
2. Each headline MUST be UNIQUE - no repetition
3. Each highlights a DIFFERENT feature/benefit
4. NO generic phrases like "Get Started" or "Learn More"

Return ONLY valid JSON:
{
    "0": { "headline": "...", "subheadline": "..." },
    "1": { "headline": "...", "subheadline": "..." }
}`;

    // Call Gemini 3 Pro
    const response = await callGemini3(prompt, { json: true });
    return response;
}
```

### 10.6 Story Flows

**Pre-defined narrative sequences:**

```javascript
const STORY_FLOWS = {
    'hero-features': {
        name: 'Hero + Features',
        description: 'Strong opening with feature showcase',
        sequence: ['hero_large', 'offset_right', 'offset_left', 'classic', 'minimal_type'],
        headlinePattern: ['value_prop', 'feature', 'feature', 'feature', 'cta']
    },
    'journey': {
        name: 'User Journey',
        description: 'Step-by-step app experience',
        sequence: ['hero_large', 'classic', 'zoom_top', 'offset_right', 'classic'],
        headlinePattern: ['welcome', 'step1', 'step2', 'step3', 'result']
    },
    'problem-solution': {
        name: 'Problem → Solution',
        description: 'Show problem then solution',
        sequence: ['minimal_type', 'classic', 'hero_large', 'offset_right', 'panoramic_right'],
        headlinePattern: ['problem', 'frustration', 'solution', 'benefit', 'proof']
    },
    'panoramic': {
        name: 'Panoramic Flow',
        description: 'Devices span between frames',
        sequence: ['panoramic_right', 'panoramic_left', 'panoramic_right', 'panoramic_left', 'classic'],
        headlinePattern: ['feature', 'feature', 'feature', 'feature', 'cta']
    },
    'feature-blitz': {
        name: 'Feature Blitz',
        description: 'Rapid feature showcase',
        sequence: ['hero_large', 'tilted_dynamic', 'zoom_top', 'offset_right', 'minimal_type'],
        headlinePattern: ['main', 'feature', 'detail', 'overview', 'cta']
    }
};
```

### 10.7 Updated Magic Design Modal UI

**Add to `index.html` inside magic-design-input-modal:**

```html
<!-- Category Selection -->
<div class="form-group">
    <label for="category-select">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="3" y="3" width="7" height="7"></rect>
            <rect x="14" y="3" width="7" height="7"></rect>
            <rect x="14" y="14" width="7" height="7"></rect>
            <rect x="3" y="14" width="7" height="7"></rect>
        </svg>
        App Category
    </label>
    <select id="category-select" class="form-select">
        <option value="auto">Auto-detect</option>
        <option value="fitness">Fitness & Health</option>
        <option value="finance">Finance & Business</option>
        <option value="productivity">Productivity</option>
        <option value="social">Social & Communication</option>
        <option value="entertainment">Entertainment & Media</option>
        <option value="shopping">Shopping</option>
        <option value="food">Food & Drink</option>
        <option value="travel">Travel</option>
        <option value="education">Education</option>
        <option value="developer">Developer Tools</option>
        <option value="gaming">Games</option>
    </select>
</div>

<!-- Theme Selection -->
<div class="form-group">
    <label for="theme-select">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="5"></circle>
            <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"></path>
        </svg>
        Design Theme
    </label>
    <select id="theme-select" class="form-select">
        <option value="auto">Let AI Decide</option>
        <option value="MODERN_MINIMAL">Modern Minimal</option>
        <option value="SWISS_BRUTALISM">Bold Swiss</option>
        <option value="NEON_CYBER">Neon Cyber</option>
        <option value="SOFT_LUXURY">Soft Luxury</option>
        <option value="GLASS_MORPHISM">Glassmorphism</option>
        <option value="CLEAN_PRO">Clean Pro</option>
    </select>
</div>

<!-- Story Flow Selection -->
<div class="form-group">
    <label for="story-flow-select">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
            <polyline points="14 2 14 8 20 8"/>
            <line x1="16" y1="13" x2="8" y2="13"/>
            <line x1="16" y1="17" x2="8" y2="17"/>
        </svg>
        Narrative Flow
    </label>
    <select id="story-flow-select" class="form-select">
        <option value="auto">Let AI Decide</option>
        <option value="hero-features">Hero + Features - Strong opening</option>
        <option value="journey">User Journey - Step by step</option>
        <option value="problem-solution">Problem → Solution</option>
        <option value="panoramic">Panoramic Flow - Spanning devices</option>
        <option value="feature-blitz">Feature Blitz - Rapid showcase</option>
    </select>
    <small class="form-hint">How your screenshots tell a story</small>
</div>

<!-- Headline Style -->
<div class="form-group">
    <label for="headline-style-select">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M4 7V4h16v3M9 20h6M12 4v16"/>
        </svg>
        Headline Style
    </label>
    <select id="headline-style-select" class="form-select">
        <option value="short_punchy">Short & Punchy (2-4 words)</option>
        <option value="benefit_focused">Benefit-Focused</option>
        <option value="question">Engaging Questions</option>
        <option value="command">Action Commands</option>
    </select>
</div>

<!-- Background Generation Toggle -->
<div class="form-group">
    <label class="checkbox-label">
        <input type="checkbox" id="generate-bg-images" checked>
        <span>Generate AI Backgrounds</span>
    </label>
    <small class="form-hint">Use Gemini 3 Pro Image for professional backgrounds (takes longer)</small>
</div>
```

---

## 11. Implementation Checklist

### Phase 1: Template System (Day 1)

- [ ] Ensure `fresh-templates.js` is loaded in `index.html`
- [ ] Add Template Gallery button to toolbar
- [ ] Implement Template Gallery modal HTML
- [ ] Add CSS styles for template grid
- [ ] Implement `renderTemplateGrid()` function
- [ ] Implement `selectTemplate()` function
- [ ] Implement `applyTemplate()` function
- [ ] Test template application to single/all screenshots

### Phase 2: Magic Design AI (Day 2-3)

- [ ] Ensure `magic-design-spec.js` is loaded
- [ ] Update Magic Design modal with new options
- [ ] Wire up category/theme/story-flow selectors
- [ ] Implement `generateAIBackground()` with Gemini 3 Pro Image
- [ ] Implement `selectLayoutsForScreenshots()`
- [ ] Implement `generateHeadlines()`
- [ ] Implement `ensureTextContrast()`
- [ ] Test complete Magic Design flow

### Phase 3: Polish (Day 4)

- [ ] Add progress indicators for AI generation
- [ ] Implement error handling with fallbacks
- [ ] Add template previews with device mockups
- [ ] Implement "Smart Match" template generation
- [ ] Add before/after comparison view
- [ ] Performance optimization (caching, debouncing)

### Phase 4: Testing (Day 5)

- [ ] Test with various app categories
- [ ] Test AI background generation success rate
- [ ] Test headline quality and uniqueness
- [ ] Test layout variety and appropriateness
- [ ] Test text contrast on generated backgrounds
- [ ] Test export dimensions and quality
- [ ] Memory usage testing
- [ ] Cross-browser testing

---

## 12. Files Reference

| File | Purpose | Key Exports |
|------|---------|-------------|
| `fresh-templates.js` | 25 premade templates | `FRESH_TEMPLATES`, `applyTemplate()`, `applyTemplateToAll()` |
| `magic-design-spec.js` | AI pipeline specification | `magicDesign()`, `AI_ANALYSIS_PIPELINE`, `BACKGROUND_GENERATION` |
| `ai-engine.js` | Current AI engine (to update) | `AIEngine.magicDesign()` |
| `app.js` | Main application | State management, UI, rendering |
| `llm.js` | Gemini API configuration | `getApiKey()`, `getSelectedModel()` |

---

## Conclusion

This comprehensive implementation guide provides everything needed to:

1. **Premade Templates** - 25 ready-to-use professional templates matching AppLaunchpad/AppScreens quality
2. **Template Picker UI** - Visual gallery with category filtering
3. **AI Magic Design** - Complete 6-stage pipeline using Gemini 3 Pro
4. **Smart Layouts** - Category-aware layout selection with story flows
5. **AI Backgrounds** - Gemini 3 Pro Image generation with fallbacks
6. **Marketing Headlines** - AI-generated compelling copy

The result: **One-click professional screenshots** that match or exceed AppLaunchpad quality, with both manual template selection and fully automated AI-powered design.

---

## 13. UI/UX Redesign: Easy to Use Yet Robust

> **GOAL:** Create a clean, intuitive interface that puts everything in its place while remaining powerful for advanced users.

### 13.1 Current UI Issues

| Issue | Location | Impact |
|-------|----------|--------|
| **Cluttered Left Sidebar** | Left panel | Too many controls compete for attention |
| **Hidden Features** | Story flows, templates | Users don't discover key features |
| **Inconsistent Spacing** | Throughout | Creates visual noise |
| **No Clear Hierarchy** | Controls | Everything looks equally important |
| **Modal Overload** | Settings, exports | Too many popup dialogs |
| **Missing Onboarding** | First visit | New users don't know where to start |
| **No Quick Actions** | Canvas area | Common actions require sidebar navigation |

### 13.2 Proposed Layout Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│ TOOLBAR (Fixed Top Bar)                                                 │
│ ┌──────┐ ┌─────────────────┐ ┌────────────────┐ ┌─────────────────────┐ │
│ │ Logo │ │ Project: MyApp ▼│ │ Magic Design ★ │ │ Templates │ Export │ │
│ └──────┘ └─────────────────┘ └────────────────┘ └─────────────────────┘ │
├─────────┬─────────────────────────────────────────────────┬─────────────┤
│         │                                                 │             │
│ SCREENS │                                                 │  INSPECTOR  │
│         │              CANVAS PREVIEW                     │             │
│ ┌─────┐ │         ┌─────────────────────┐                 │ ┌─────────┐ │
│ │  1  │ │    ◀    │                     │    ▶            │ │ [Tabs]  │ │
│ └─────┘ │         │                     │                 │ │ BG|Dev| │ │
│ ┌─────┐ │         │      [Preview]      │                 │ │   Text  │ │
│ │  2  │ │         │                     │                 │ └─────────┘ │
│ └─────┘ │         │                     │                 │             │
│ ┌─────┐ │         └─────────────────────┘                 │ [Controls] │
│ │  3  │ │                                                 │             │
│ └─────┘ │    ┌────────────────────────────┐              │             │
│ ┌─────┐ │    │  ● ● ● Slide Indicators   │              │             │
│ │ + + │ │    └────────────────────────────┘              │             │
│ └─────┘ │                                                 │             │
│         │                                                 │             │
├─────────┴─────────────────────────────────────────────────┴─────────────┤
│ STATUS BAR: "iPhone 6.9" | "1320×2868" | "Saved" | Lang: EN ▼           │
└─────────────────────────────────────────────────────────────────────────┘
```

### 13.3 Component-by-Component Redesign

#### 13.3.1 Top Toolbar (NEW)

**Purpose:** Quick access to primary actions, project management, and global settings.

```html
<!-- New Top Toolbar -->
<header class="app-toolbar">
    <!-- Logo & App Name -->
    <div class="toolbar-brand">
        <div class="logo">
            <svg><!-- App icon --></svg>
        </div>
        <span class="app-name">Screenshot Studio</span>
    </div>
    
    <!-- Project Selector (Compact) -->
    <div class="toolbar-project">
        <button class="project-selector" id="project-selector">
            <span class="project-name">My App</span>
            <span class="project-count">4 screens</span>
            <svg class="chevron">▼</svg>
        </button>
    </div>
    
    <!-- Primary Actions (Center) -->
    <div class="toolbar-actions">
        <button class="action-btn action-primary" id="magic-design-trigger">
            <svg><!-- Magic wand icon --></svg>
            <span>Magic Design</span>
        </button>
        
        <button class="action-btn" id="templates-trigger">
            <svg><!-- Grid icon --></svg>
            <span>Templates</span>
        </button>
        
        <div class="action-divider"></div>
        
        <button class="action-btn" id="undo-btn" title="Undo (⌘Z)">
            <svg><!-- Undo icon --></svg>
        </button>
        <button class="action-btn" id="redo-btn" title="Redo (⌘⇧Z)">
            <svg><!-- Redo icon --></svg>
        </button>
    </div>
    
    <!-- Secondary Actions (Right) -->
    <div class="toolbar-secondary">
        <button class="action-btn" id="language-btn" title="Language">
            <span class="flag">🇺🇸</span>
            <span>EN</span>
        </button>
        
        <div class="action-divider"></div>
        
        <button class="action-btn export-btn" id="export-current">
            <svg><!-- Download icon --></svg>
            <span>Export</span>
        </button>
        
        <button class="action-btn export-all-btn" id="export-all">
            <svg><!-- Folder download icon --></svg>
            <span>Export All</span>
        </button>
        
        <button class="action-btn icon-only" id="settings-btn" title="Settings">
            <svg><!-- Gear icon --></svg>
        </button>
    </div>
</header>
```

**CSS:**

```css
.app-toolbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 56px;
    padding: 0 16px;
    background: var(--surface-elevated);
    border-bottom: 1px solid var(--border-color);
    gap: 24px;
    -webkit-app-region: drag; /* For Electron */
}

.toolbar-brand {
    display: flex;
    align-items: center;
    gap: 12px;
    min-width: 180px;
}

.toolbar-brand .logo {
    width: 32px;
    height: 32px;
    border-radius: 8px;
    background: var(--accent-gradient);
    display: flex;
    align-items: center;
    justify-content: center;
}

.toolbar-actions {
    display: flex;
    align-items: center;
    gap: 8px;
    flex: 1;
    justify-content: center;
}

.action-btn {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 8px 12px;
    border-radius: 8px;
    border: none;
    background: transparent;
    color: var(--text-secondary);
    font-size: 13px;
    cursor: pointer;
    transition: all 0.15s;
    -webkit-app-region: no-drag;
}

.action-btn:hover {
    background: var(--surface-hover);
    color: var(--text-primary);
}

.action-btn.action-primary {
    background: var(--accent-gradient);
    color: white;
    padding: 8px 16px;
    font-weight: 500;
}

.action-btn.action-primary:hover {
    filter: brightness(1.1);
}

.action-divider {
    width: 1px;
    height: 24px;
    background: var(--border-color);
    margin: 0 4px;
}
```

#### 13.3.2 Left Panel: Screenshot Strip (Simplified)

**Purpose:** Visual filmstrip of all screenshots with drag-to-reorder.

```html
<aside class="screenshot-strip">
    <div class="strip-header">
        <span class="strip-title">Screens</span>
        <span class="strip-count">4/10</span>
    </div>
    
    <div class="strip-list" id="screenshot-strip">
        <!-- Screenshot Thumbnails -->
        <div class="strip-item active" data-index="0" draggable="true">
            <div class="strip-thumb">
                <canvas class="thumb-canvas"></canvas>
            </div>
            <div class="strip-number">1</div>
            <button class="strip-menu-btn">⋮</button>
        </div>
        <!-- More items... -->
        
        <!-- Upload Zone -->
        <div class="strip-upload" id="upload-zone">
            <svg><!-- Plus icon --></svg>
            <span>Add</span>
        </div>
    </div>
    
    <div class="strip-footer">
        <button class="strip-action" id="reorder-mode">
            <svg><!-- Reorder icon --></svg>
            Reorder
        </button>
    </div>
</aside>
```

**CSS:**

```css
.screenshot-strip {
    width: 100px;
    background: var(--surface);
    border-right: 1px solid var(--border-color);
    display: flex;
    flex-direction: column;
    height: 100%;
}

.strip-header {
    padding: 12px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid var(--border-color);
}

.strip-title {
    font-size: 11px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    color: var(--text-tertiary);
}

.strip-count {
    font-size: 11px;
    color: var(--text-tertiary);
}

.strip-list {
    flex: 1;
    overflow-y: auto;
    padding: 8px;
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.strip-item {
    position: relative;
    aspect-ratio: 9/16;
    border-radius: 8px;
    overflow: hidden;
    cursor: pointer;
    border: 2px solid transparent;
    transition: all 0.15s;
}

.strip-item:hover {
    border-color: var(--border-color);
}

.strip-item.active {
    border-color: var(--accent);
    box-shadow: 0 0 0 2px var(--accent-alpha);
}

.strip-thumb {
    width: 100%;
    height: 100%;
    background: var(--surface-dim);
}

.strip-number {
    position: absolute;
    top: 4px;
    left: 4px;
    width: 18px;
    height: 18px;
    border-radius: 4px;
    background: rgba(0,0,0,0.6);
    color: white;
    font-size: 10px;
    font-weight: 600;
    display: flex;
    align-items: center;
    justify-content: center;
}

.strip-upload {
    aspect-ratio: 9/16;
    border: 2px dashed var(--border-color);
    border-radius: 8px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 4px;
    color: var(--text-tertiary);
    cursor: pointer;
    transition: all 0.15s;
}

.strip-upload:hover {
    border-color: var(--accent);
    color: var(--accent);
    background: var(--accent-alpha);
}
```

#### 13.3.3 Right Panel: Inspector (Tabbed & Organized)

**Purpose:** All editing controls organized by category with collapsible sections.

```html
<aside class="inspector-panel">
    <!-- Tab Bar -->
    <div class="inspector-tabs">
        <button class="tab active" data-tab="background">
            <svg><!-- Background icon --></svg>
            <span>Background</span>
        </button>
        <button class="tab" data-tab="device">
            <svg><!-- Phone icon --></svg>
            <span>Device</span>
        </button>
        <button class="tab" data-tab="text">
            <svg><!-- Text icon --></svg>
            <span>Text</span>
        </button>
        <button class="tab" data-tab="effects">
            <svg><!-- Effects icon --></svg>
            <span>Effects</span>
        </button>
    </div>
    
    <!-- Tab Content -->
    <div class="inspector-content">
        <!-- Background Tab -->
        <div class="tab-panel active" id="panel-background">
            <!-- Quick Actions -->
            <div class="quick-actions">
                <button class="quick-btn" id="quick-template">
                    <svg><!-- Grid icon --></svg>
                    Template
                </button>
                <button class="quick-btn" id="quick-ai-bg">
                    <svg><!-- Wand icon --></svg>
                    AI Generate
                </button>
            </div>
            
            <!-- Section: Type -->
            <div class="inspector-section">
                <div class="section-header">
                    <span>Background Type</span>
                </div>
                <div class="type-selector">
                    <button class="type-btn active" data-type="gradient">Gradient</button>
                    <button class="type-btn" data-type="solid">Solid</button>
                    <button class="type-btn" data-type="image">Image</button>
                </div>
            </div>
            
            <!-- Section: Gradient Colors -->
            <div class="inspector-section" id="gradient-section">
                <div class="section-header collapsible" data-target="gradient-content">
                    <span>Gradient Colors</span>
                    <svg class="chevron">▼</svg>
                </div>
                <div class="section-content" id="gradient-content">
                    <!-- Gradient Editor -->
                    <div class="gradient-preview" id="gradient-preview"></div>
                    <div class="gradient-stops" id="gradient-stops">
                        <!-- Color stops -->
                    </div>
                    <div class="control-row">
                        <label>Angle</label>
                        <input type="range" id="gradient-angle" min="0" max="360" value="135">
                        <span class="value">135°</span>
                    </div>
                </div>
            </div>
            
            <!-- Section: Presets -->
            <div class="inspector-section">
                <div class="section-header collapsible" data-target="presets-content">
                    <span>Presets</span>
                    <svg class="chevron">▼</svg>
                </div>
                <div class="section-content" id="presets-content">
                    <div class="preset-grid" id="gradient-presets">
                        <!-- Preset swatches -->
                    </div>
                </div>
            </div>
            
            <!-- Section: Noise (Collapsed by default) -->
            <div class="inspector-section collapsed">
                <div class="section-header collapsible" data-target="noise-content">
                    <span>Noise Texture</span>
                    <div class="section-toggle" id="noise-toggle"></div>
                </div>
                <div class="section-content hidden" id="noise-content">
                    <div class="control-row">
                        <label>Intensity</label>
                        <input type="range" id="noise-intensity" min="0" max="100" value="10">
                        <span class="value">10%</span>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- Device Tab -->
        <div class="tab-panel" id="panel-device">
            <!-- Quick Actions -->
            <div class="quick-actions">
                <button class="quick-btn" id="quick-center">Center</button>
                <button class="quick-btn" id="quick-bleed">Bleed</button>
                <button class="quick-btn" id="quick-tilt">Tilt</button>
            </div>
            
            <!-- Layout Presets -->
            <div class="inspector-section">
                <div class="section-header">
                    <span>Layout Presets</span>
                </div>
                <div class="layout-grid" id="layout-presets">
                    <!-- Layout thumbnails -->
                </div>
            </div>
            
            <!-- Position Controls -->
            <div class="inspector-section">
                <div class="section-header">
                    <span>Position & Scale</span>
                </div>
                <div class="position-grid">
                    <div class="control-row">
                        <label>Scale</label>
                        <input type="range" id="device-scale" min="30" max="120" value="70">
                        <span class="value">70%</span>
                    </div>
                    <div class="control-row">
                        <label>X Position</label>
                        <input type="range" id="device-x" min="-30" max="130" value="50">
                        <span class="value">50%</span>
                    </div>
                    <div class="control-row">
                        <label>Y Position</label>
                        <input type="range" id="device-y" min="-30" max="130" value="55">
                        <span class="value">55%</span>
                    </div>
                    <div class="control-row">
                        <label>Rotation</label>
                        <input type="range" id="device-rotation" min="-45" max="45" value="0">
                        <span class="value">0°</span>
                    </div>
                </div>
            </div>
            
            <!-- Device Frame -->
            <div class="inspector-section collapsed">
                <div class="section-header collapsible">
                    <span>Device Frame</span>
                    <div class="section-toggle" id="frame-toggle"></div>
                </div>
                <div class="section-content hidden">
                    <!-- Frame controls -->
                </div>
            </div>
            
            <!-- Shadow -->
            <div class="inspector-section">
                <div class="section-header collapsible">
                    <span>Shadow</span>
                    <div class="section-toggle active" id="shadow-toggle"></div>
                </div>
                <div class="section-content">
                    <!-- Shadow controls -->
                </div>
            </div>
        </div>
        
        <!-- Text Tab -->
        <div class="tab-panel" id="panel-text">
            <!-- Similar structure... -->
        </div>
        
        <!-- Effects Tab (NEW) -->
        <div class="tab-panel" id="panel-effects">
            <div class="inspector-section">
                <div class="section-header">
                    <span>Widgets & Badges</span>
                </div>
                <div class="widget-grid">
                    <!-- Widget options -->
                </div>
            </div>
            
            <div class="inspector-section">
                <div class="section-header">
                    <span>Decorative Elements</span>
                </div>
                <!-- Blur orbs, shapes, etc. -->
            </div>
        </div>
    </div>
    
    <!-- Apply to All Button (Sticky Footer) -->
    <div class="inspector-footer">
        <button class="apply-all-btn" id="apply-to-all">
            <svg><!-- Copy icon --></svg>
            Apply to All Screenshots
        </button>
    </div>
</aside>
```

**CSS:**

```css
.inspector-panel {
    width: 320px;
    background: var(--surface);
    border-left: 1px solid var(--border-color);
    display: flex;
    flex-direction: column;
    height: 100%;
}

.inspector-tabs {
    display: flex;
    border-bottom: 1px solid var(--border-color);
    padding: 0 4px;
}

.inspector-tabs .tab {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    padding: 12px 8px;
    border: none;
    background: none;
    color: var(--text-tertiary);
    font-size: 11px;
    cursor: pointer;
    border-bottom: 2px solid transparent;
    margin-bottom: -1px;
    transition: all 0.15s;
}

.inspector-tabs .tab:hover {
    color: var(--text-secondary);
}

.inspector-tabs .tab.active {
    color: var(--accent);
    border-bottom-color: var(--accent);
}

.inspector-content {
    flex: 1;
    overflow-y: auto;
    padding: 0;
}

.inspector-section {
    border-bottom: 1px solid var(--border-color);
}

.section-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 16px;
    font-size: 12px;
    font-weight: 600;
    color: var(--text-secondary);
    cursor: pointer;
    user-select: none;
}

.section-header.collapsible:hover {
    background: var(--surface-hover);
}

.section-content {
    padding: 0 16px 16px;
}

.section-content.hidden {
    display: none;
}

.section-toggle {
    width: 36px;
    height: 20px;
    border-radius: 10px;
    background: var(--surface-dim);
    position: relative;
    cursor: pointer;
}

.section-toggle::after {
    content: '';
    position: absolute;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: white;
    top: 2px;
    left: 2px;
    transition: transform 0.15s;
}

.section-toggle.active {
    background: var(--accent);
}

.section-toggle.active::after {
    transform: translateX(16px);
}

.control-row {
    display: grid;
    grid-template-columns: 80px 1fr 50px;
    align-items: center;
    gap: 12px;
    margin-bottom: 12px;
}

.control-row label {
    font-size: 12px;
    color: var(--text-secondary);
}

.control-row .value {
    font-size: 12px;
    color: var(--text-tertiary);
    text-align: right;
    font-variant-numeric: tabular-nums;
}

.quick-actions {
    display: flex;
    gap: 8px;
    padding: 12px 16px;
    border-bottom: 1px solid var(--border-color);
}

.quick-btn {
    flex: 1;
    padding: 8px 12px;
    border-radius: 6px;
    border: 1px solid var(--border-color);
    background: var(--surface);
    color: var(--text-secondary);
    font-size: 12px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    transition: all 0.15s;
}

.quick-btn:hover {
    border-color: var(--accent);
    color: var(--accent);
}

.inspector-footer {
    padding: 12px 16px;
    border-top: 1px solid var(--border-color);
}

.apply-all-btn {
    width: 100%;
    padding: 10px;
    border-radius: 8px;
    border: none;
    background: var(--surface-hover);
    color: var(--text-secondary);
    font-size: 13px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    transition: all 0.15s;
}

.apply-all-btn:hover {
    background: var(--accent);
    color: white;
}
```

#### 13.3.4 Status Bar (NEW - Bottom)

**Purpose:** Show current state, quick settings, and export info.

```html
<footer class="status-bar">
    <!-- Left: Device & Size Info -->
    <div class="status-left">
        <button class="status-item" id="device-selector">
            <svg><!-- Phone icon --></svg>
            <span>iPhone 6.9"</span>
        </button>
        <span class="status-divider">|</span>
        <span class="status-item">1320 × 2868</span>
    </div>
    
    <!-- Center: Save Status -->
    <div class="status-center">
        <span class="status-saved" id="save-status">
            <svg><!-- Check icon --></svg>
            All changes saved
        </span>
    </div>
    
    <!-- Right: Language & Zoom -->
    <div class="status-right">
        <button class="status-item" id="language-selector">
            <span class="flag">🇺🇸</span>
            <span>English</span>
            <svg>▼</svg>
        </button>
        <span class="status-divider">|</span>
        <div class="zoom-control">
            <button id="zoom-out">−</button>
            <span id="zoom-level">100%</span>
            <button id="zoom-in">+</button>
        </div>
    </div>
</footer>
```

### 13.4 Feature Discovery: Contextual Hints

**Purpose:** Help users discover features without cluttering the UI.

```javascript
const FEATURE_HINTS = {
    'magic-design': {
        target: '#magic-design-trigger',
        title: 'Magic Design',
        description: 'AI analyzes your screenshots and creates a complete design in seconds.',
        showOn: 'first-upload'
    },
    'templates': {
        target: '#templates-trigger',
        title: 'Quick Templates',
        description: 'Choose from 25+ professional templates. Click to apply instantly.',
        showOn: 'after-magic-design'
    },
    'smart-match': {
        target: '#smart-match-btn',
        title: 'Smart Color Match',
        description: 'Extracts colors from your app and creates a matching template.',
        showOn: 'template-open'
    },
    'story-flow': {
        target: '#story-flow-select',
        title: 'Story Flows',
        description: 'Create a narrative across your screenshots for better conversion.',
        showOn: 'third-screenshot'
    }
};

function showFeatureHint(hintId) {
    const hint = FEATURE_HINTS[hintId];
    if (!hint || localStorage.getItem(`hint_${hintId}_seen`)) return;
    
    const target = document.querySelector(hint.target);
    if (!target) return;
    
    const tooltip = document.createElement('div');
    tooltip.className = 'feature-hint';
    tooltip.innerHTML = `
        <div class="hint-arrow"></div>
        <div class="hint-content">
            <h4>${hint.title}</h4>
            <p>${hint.description}</p>
            <button class="hint-dismiss">Got it</button>
        </div>
    `;
    
    // Position near target
    const rect = target.getBoundingClientRect();
    tooltip.style.top = `${rect.bottom + 10}px`;
    tooltip.style.left = `${rect.left}px`;
    
    document.body.appendChild(tooltip);
    
    tooltip.querySelector('.hint-dismiss').addEventListener('click', () => {
        tooltip.remove();
        localStorage.setItem(`hint_${hintId}_seen`, 'true');
    });
}
```

### 13.5 Keyboard Shortcuts

**Purpose:** Power user productivity.

```javascript
const KEYBOARD_SHORTCUTS = {
    // Navigation
    'ArrowLeft': { action: 'previousScreenshot', description: 'Previous screenshot' },
    'ArrowRight': { action: 'nextScreenshot', description: 'Next screenshot' },
    '1-9': { action: 'goToScreenshot', description: 'Jump to screenshot 1-9' },
    
    // Editing
    'Meta+z': { action: 'undo', description: 'Undo' },
    'Meta+Shift+z': { action: 'redo', description: 'Redo' },
    'Meta+c': { action: 'copyStyle', description: 'Copy style' },
    'Meta+v': { action: 'pasteStyle', description: 'Paste style' },
    'Meta+Shift+v': { action: 'pasteStyleToAll', description: 'Paste style to all' },
    
    // Actions
    'Meta+m': { action: 'magicDesign', description: 'Magic Design' },
    't': { action: 'openTemplates', description: 'Open templates' },
    'Meta+e': { action: 'exportCurrent', description: 'Export current' },
    'Meta+Shift+e': { action: 'exportAll', description: 'Export all' },
    
    // View
    '+': { action: 'zoomIn', description: 'Zoom in' },
    '-': { action: 'zoomOut', description: 'Zoom out' },
    '0': { action: 'zoomFit', description: 'Fit to screen' },
    'Space': { action: 'togglePreview', description: 'Toggle fullscreen preview' },
    
    // Panels
    '1': { action: 'showBackgroundTab', description: 'Background tab' },
    '2': { action: 'showDeviceTab', description: 'Device tab' },
    '3': { action: 'showTextTab', description: 'Text tab' },
    '4': { action: 'showEffectsTab', description: 'Effects tab' }
};

function handleKeyboardShortcut(e) {
    const key = `${e.metaKey ? 'Meta+' : ''}${e.shiftKey ? 'Shift+' : ''}${e.key}`;
    const shortcut = KEYBOARD_SHORTCUTS[key];
    
    if (shortcut && !isInputFocused()) {
        e.preventDefault();
        executeAction(shortcut.action);
    }
}

function showShortcutsModal() {
    const modal = document.createElement('div');
    modal.className = 'shortcuts-modal';
    modal.innerHTML = `
        <h2>Keyboard Shortcuts</h2>
        <div class="shortcuts-grid">
            ${Object.entries(KEYBOARD_SHORTCUTS).map(([key, { description }]) => `
                <div class="shortcut-row">
                    <kbd>${key.replace('Meta', '⌘')}</kbd>
                    <span>${description}</span>
                </div>
            `).join('')}
        </div>
        <button onclick="this.parentElement.remove()">Close</button>
    `;
    document.body.appendChild(modal);
}
```

### 13.6 Command Palette (Power User Feature)

**Purpose:** Quick access to any action via keyboard.

```html
<!-- Command Palette (Hidden until ⌘K) -->
<div class="command-palette" id="command-palette" style="display: none;">
    <div class="command-input-wrapper">
        <svg><!-- Search icon --></svg>
        <input type="text" id="command-input" placeholder="Type a command...">
    </div>
    <div class="command-results" id="command-results">
        <!-- Results populated dynamically -->
    </div>
</div>
```

```javascript
const COMMANDS = [
    { id: 'magic-design', label: 'Magic Design', category: 'AI', action: () => triggerMagicDesign() },
    { id: 'apply-template', label: 'Apply Template...', category: 'Design', action: () => openTemplateGallery() },
    { id: 'smart-match', label: 'Smart Color Match', category: 'Design', action: () => generateSmartTemplate() },
    { id: 'generate-headlines', label: 'Generate Headlines', category: 'AI', action: () => generateMagicalTitles() },
    { id: 'export-current', label: 'Export Current Screenshot', category: 'Export', action: () => exportCurrent() },
    { id: 'export-all', label: 'Export All Screenshots', category: 'Export', action: () => exportAll() },
    { id: 'export-all-sizes', label: 'Export All Device Sizes', category: 'Export', action: () => exportAllSizes() },
    { id: 'add-language', label: 'Add Language...', category: 'Languages', action: () => openLanguagesModal() },
    { id: 'translate-all', label: 'Translate All Headlines', category: 'Languages', action: () => translateAllHeadlines() },
    { id: 'new-project', label: 'New Project', category: 'Project', action: () => createNewProject() },
    { id: 'switch-project', label: 'Switch Project...', category: 'Project', action: () => openProjectSelector() },
    { id: 'settings', label: 'Settings', category: 'App', action: () => openSettings() },
    { id: 'shortcuts', label: 'Keyboard Shortcuts', category: 'Help', action: () => showShortcutsModal() }
];

function openCommandPalette() {
    const palette = document.getElementById('command-palette');
    const input = document.getElementById('command-input');
    
    palette.style.display = 'block';
    input.value = '';
    input.focus();
    renderCommandResults(COMMANDS);
}

function filterCommands(query) {
    if (!query) return COMMANDS;
    
    const lower = query.toLowerCase();
    return COMMANDS.filter(cmd => 
        cmd.label.toLowerCase().includes(lower) ||
        cmd.category.toLowerCase().includes(lower)
    );
}

function renderCommandResults(commands) {
    const results = document.getElementById('command-results');
    
    // Group by category
    const grouped = commands.reduce((acc, cmd) => {
        acc[cmd.category] = acc[cmd.category] || [];
        acc[cmd.category].push(cmd);
        return acc;
    }, {});
    
    results.innerHTML = Object.entries(grouped).map(([category, cmds]) => `
        <div class="command-category">${category}</div>
        ${cmds.map((cmd, i) => `
            <div class="command-item ${i === 0 ? 'selected' : ''}" data-command="${cmd.id}">
                <span class="command-label">${cmd.label}</span>
            </div>
        `).join('')}
    `).join('');
}

// Trigger with ⌘K
document.addEventListener('keydown', (e) => {
    if (e.metaKey && e.key === 'k') {
        e.preventDefault();
        openCommandPalette();
    }
});
```

### 13.7 Responsive Layout (Tablet/Mobile)

**Purpose:** Work on smaller screens.

```css
/* Tablet Layout */
@media (max-width: 1200px) {
    .screenshot-strip {
        width: 80px;
    }
    
    .inspector-panel {
        width: 280px;
    }
    
    .strip-item {
        aspect-ratio: 1/1; /* Square thumbnails */
    }
}

/* Mobile Layout (Portrait) */
@media (max-width: 768px) {
    .app-container {
        flex-direction: column;
    }
    
    .app-toolbar {
        flex-wrap: wrap;
        height: auto;
        padding: 8px;
    }
    
    .toolbar-actions {
        order: 3;
        width: 100%;
        justify-content: space-around;
        padding: 8px 0;
        border-top: 1px solid var(--border-color);
        margin-top: 8px;
    }
    
    .screenshot-strip {
        width: 100%;
        height: 100px;
        flex-direction: row;
        border-right: none;
        border-bottom: 1px solid var(--border-color);
    }
    
    .strip-list {
        flex-direction: row;
        overflow-x: auto;
        overflow-y: hidden;
    }
    
    .strip-item {
        width: 60px;
        flex-shrink: 0;
    }
    
    .canvas-area {
        flex: 1;
        min-height: 300px;
    }
    
    .inspector-panel {
        width: 100%;
        max-height: 50vh;
        border-left: none;
        border-top: 1px solid var(--border-color);
    }
    
    .status-bar {
        display: none; /* Hide on mobile, info in toolbar */
    }
}
```

### 13.8 Design Tokens (CSS Variables)

**Purpose:** Consistent theming across the app.

```css
:root {
    /* Colors */
    --accent: #0A84FF;
    --accent-hover: #0070E0;
    --accent-alpha: rgba(10, 132, 255, 0.15);
    --accent-gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    
    --success: #30D158;
    --warning: #FF9F0A;
    --error: #FF453A;
    
    /* Surfaces (Dark Mode) */
    --background: #000000;
    --surface: #1C1C1E;
    --surface-elevated: #2C2C2E;
    --surface-hover: #3A3A3C;
    --surface-dim: #141414;
    
    /* Text */
    --text-primary: #FFFFFF;
    --text-secondary: #EBEBF5;
    --text-tertiary: #8E8E93;
    
    /* Borders */
    --border-color: #38383A;
    --border-subtle: #2C2C2E;
    
    /* Shadows */
    --shadow-sm: 0 1px 2px rgba(0,0,0,0.3);
    --shadow-md: 0 4px 12px rgba(0,0,0,0.4);
    --shadow-lg: 0 8px 24px rgba(0,0,0,0.5);
    
    /* Spacing */
    --space-xs: 4px;
    --space-sm: 8px;
    --space-md: 16px;
    --space-lg: 24px;
    --space-xl: 32px;
    
    /* Radii */
    --radius-sm: 4px;
    --radius-md: 8px;
    --radius-lg: 12px;
    --radius-xl: 16px;
    
    /* Transitions */
    --transition-fast: 0.1s ease;
    --transition-normal: 0.2s ease;
    --transition-slow: 0.3s ease;
    
    /* Typography */
    --font-sans: -apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
    --font-mono: 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', monospace;
    
    --text-xs: 10px;
    --text-sm: 12px;
    --text-base: 14px;
    --text-lg: 16px;
    --text-xl: 20px;
}

/* Light Mode */
@media (prefers-color-scheme: light) {
    :root {
        --background: #F2F2F7;
        --surface: #FFFFFF;
        --surface-elevated: #FFFFFF;
        --surface-hover: #E5E5EA;
        --surface-dim: #E5E5EA;
        
        --text-primary: #000000;
        --text-secondary: #3C3C43;
        --text-tertiary: #8E8E93;
        
        --border-color: #D1D1D6;
        --border-subtle: #E5E5EA;
    }
}
```

### 13.9 Implementation Checklist

#### Phase 1: Layout Foundation
- [ ] Create new HTML structure with top toolbar
- [ ] Implement slim left screenshot strip
- [ ] Update right inspector with tabs
- [ ] Add status bar
- [ ] Set up CSS variables/tokens
- [ ] Responsive breakpoints

#### Phase 2: Interactions
- [ ] Keyboard shortcuts system
- [ ] Command palette (⌘K)
- [ ] Drag-to-reorder screenshots
- [ ] Collapsible inspector sections
- [ ] Quick action buttons

#### Phase 3: Polish
- [ ] Feature hints/onboarding
- [ ] Smooth animations
- [ ] Loading states
- [ ] Error states
- [ ] Empty states

#### Phase 4: Testing
- [ ] Test all screen sizes
- [ ] Test keyboard navigation
- [ ] Test with screen reader
- [ ] Performance audit
- [ ] Cross-browser testing

---

## 14. Summary: Complete Transformation

This document provides everything needed to transform the App Store Screenshot Generator into a professional-grade tool that rivals AppLaunchpad and AppScreens:

| Component | Current | Target |
|-----------|---------|--------|
| **Templates** | None | 25+ premade, smart-match |
| **AI Design** | Stub | Full 6-stage pipeline |
| **Background Gen** | Returns null | Gemini 3 Image |
| **Layouts** | Manual only | Smart category-aware |
| **Headlines** | Manual only | AI-generated |
| **UI** | Cluttered | Clean, organized |
| **UX** | Hidden features | Discoverable, shortcuts |
| **Export** | Basic | Multi-language, all sizes |

**Files to create/update:**
1. `fresh-templates.js` - Template definitions
2. `magic-design-spec.js` - AI pipeline
3. `app.js` - UI event handlers
4. `index.html` - New layout structure
5. `styles.css` - Complete redesign

**Result:** A one-click professional screenshot generator that's both easy to use for beginners and powerful for experts.
