/**
 * Shared utility functions for App Store Screenshot Generator
 */

// Debug mode - set localStorage.debug = 'true' to enable
const DEBUG = localStorage.getItem('debug') === 'true';

function debugLog(...args) {
    if (DEBUG) {
        console.log(...args);
    }
}

/**
 * Parse a data URL into its components
 * @param {string} dataUrl - Data URL string
 * @returns {Object|null} - { mimeType, base64 } or null if invalid
 */
function parseDataUrl(dataUrl) {
    if (!dataUrl || typeof dataUrl !== 'string') return null;
    const match = dataUrl.match(/^data:([^;]+);base64,(.+)$/);
    if (!match) return null;
    return {
        mimeType: match[1],
        base64: match[2]
    };
}

/**
 * Parse JSON from AI response text (handles markdown code blocks)
 * @param {string} responseText - Raw response from AI
 * @returns {Object} - Parsed JSON object
 */
function parseJSONFromAIResponse(responseText) {
    if (!responseText) throw new Error('Empty response');

    let cleaned = responseText.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim();
    const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
        cleaned = jsonMatch[0];
    }
    return JSON.parse(cleaned);
}

/**
 * Capitalize first letter of a string
 * @param {string} str - Input string
 * @returns {string} - String with first letter capitalized
 */
function capitalizeFirst(str) {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Adjust color brightness
 * @param {string} hex - Hex color code
 * @param {number} percent - Percentage to adjust (-100 to 100)
 * @returns {string} - Adjusted hex color
 */
function adjustColorBrightness(hex, percent) {
    if (!hex) return '#000000';
    const num = parseInt(hex.replace('#', ''), 16);
    const amt = Math.round(2.55 * percent);
    const R = Math.min(255, Math.max(0, (num >> 16) + amt));
    const G = Math.min(255, Math.max(0, ((num >> 8) & 0x00FF) + amt));
    const B = Math.min(255, Math.max(0, (num & 0x0000FF) + amt));
    return '#' + (0x1000000 + R * 0x10000 + G * 0x100 + B).toString(16).slice(1);
}

/**
 * Convert hex color to rgba
 * @param {string} hex - Hex color code
 * @param {number} alpha - Alpha value (0-1)
 * @returns {string} - RGBA color string
 */
function hexToRgba(hex, alpha = 1) {
    if (!hex) return `rgba(0, 0, 0, ${alpha})`;
    const num = parseInt(hex.replace('#', ''), 16);
    const r = (num >> 16) & 255;
    const g = (num >> 8) & 255;
    const b = num & 255;
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

/**
 * Convert layout coordinates (offset from center) to screenshot coordinates (0-100%)
 * Layout uses: x: -40 to +40 (offset from center), y: offset value
 * Screenshot uses: x: 0-100 (50 = center), y: 0-100 (50 = center)
 * @param {Object} layoutConfig - Layout configuration from LayoutEngine
 * @returns {Object} - { scale, x, y, rotation }
 */
function convertLayoutToScreenshotPosition(layoutConfig) {
    if (!layoutConfig || !layoutConfig.device) {
        return { scale: 65, x: 50, y: 70, rotation: 0 };
    }

    return {
        scale: (layoutConfig.device.scale || 0.65) * 100,
        x: 50 + (layoutConfig.device.x || 0),
        y: 50 + (layoutConfig.device.y || 20),
        rotation: layoutConfig.device.rotation || 0
    };
}

/**
 * Calculate optimal device Y position based on text settings
 * @param {Object} dims - Canvas dimensions { width, height }
 * @param {Object} text - Text settings object
 * @param {string} currentLanguage - Current language code
 * @returns {number} - Optimal Y position (0-100)
 */
function calculateOptimalDeviceY(dims, text, currentLanguage) {
    if (!dims || !text) return 72;

    const headline = text.headlines?.[currentLanguage] || '';
    const headlineLines = text.stackedText
        ? headline.split(/\s+/).filter(w => w.length > 0).length
        : 1;

    const hasSubheadline = text.subheadlineEnabled && text.subheadlines?.[currentLanguage];
    const headlineSize = text.headlineSize || 72;
    const subheadlineSize = text.subheadlineSize || 28;
    const lineHeight = headlineSize * ((text.lineHeight || 95) / 100);

    const textHeight = (headlineLines * lineHeight)
        + (hasSubheadline ? subheadlineSize * 1.5 + 16 : 0);

    const textTopOffset = dims.height * ((text.offsetY || 8) / 100);
    const minGap = 50; // RULE 4: 50px minimum gap

    const contentBottom = textTopOffset + textHeight + minGap;
    const deviceTopPercent = (contentBottom / dims.height) * 100;

    // Device Y is center position, clamp between reasonable values
    return Math.min(85, Math.max(65, deviceTopPercent + 10));
}

/**
 * Clamp a number between min and max values
 * @param {number} value - Value to clamp
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {number} - Clamped value
 */
function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
}

/**
 * Deep clone an object (simple JSON-based clone)
 * @param {Object} obj - Object to clone
 * @returns {Object} - Cloned object
 */
function deepClone(obj) {
    if (obj === null || typeof obj !== 'object') return obj;
    return JSON.parse(JSON.stringify(obj));
}

// Export for use across files
window.Utils = {
    DEBUG,
    debugLog,
    parseDataUrl,
    parseJSONFromAIResponse,
    capitalizeFirst,
    adjustColorBrightness,
    hexToRgba,
    convertLayoutToScreenshotPosition,
    calculateOptimalDeviceY,
    clamp,
    deepClone
};
