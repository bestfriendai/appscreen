/**
 * Fresh Templates - Complete ready-to-use screenshot designs
 * One-click professional App Store screenshots
 */

const FRESH_TEMPLATES = [
    // === MINIMAL & CLEAN ===
    {
        id: 'minimal-dark',
        name: 'Minimal Dark',
        category: 'minimal',
        preview: 'linear-gradient(180deg, #0a0a0a 0%, #1a1a1a 100%)',
        config: {
            background: {
                type: 'gradient',
                stops: [
                    { color: '#0a0a0a', position: 0 },
                    { color: '#1a1a1a', position: 100 }
                ],
                angle: 180
            },
            device: { scale: 65, x: 50, y: 72, rotation: 0 },
            text: {
                font: 'SF Pro Display',
                weight: '600',
                size: 72,
                color: '#ffffff',
                position: 'top',
                offsetY: 8
            },
            style: 'minimal'
        }
    },
    {
        id: 'minimal-light',
        name: 'Minimal Light',
        category: 'minimal',
        preview: 'linear-gradient(180deg, #ffffff 0%, #f5f5f7 100%)',
        config: {
            background: {
                type: 'gradient',
                stops: [
                    { color: '#ffffff', position: 0 },
                    { color: '#f5f5f7', position: 100 }
                ],
                angle: 180
            },
            device: { scale: 65, x: 50, y: 72, rotation: 0 },
            text: {
                font: 'SF Pro Display',
                weight: '600',
                size: 72,
                color: '#1d1d1f',
                position: 'top',
                offsetY: 8
            },
            style: 'minimal'
        }
    },

    // === GRADIENT DREAMS ===
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
            device: { scale: 68, x: 50, y: 70, rotation: 0 },
            text: {
                font: 'Poppins',
                weight: '700',
                size: 76,
                color: '#ffffff',
                position: 'top',
                offsetY: 7
            },
            style: 'vibrant'
        }
    },
    {
        id: 'ocean-breeze',
        name: 'Ocean Breeze',
        category: 'gradient',
        preview: 'linear-gradient(135deg, #0093E9 0%, #80D0C7 100%)',
        config: {
            background: {
                type: 'gradient',
                stops: [
                    { color: '#0093E9', position: 0 },
                    { color: '#80D0C7', position: 100 }
                ],
                angle: 135
            },
            device: { scale: 68, x: 50, y: 70, rotation: 0 },
            text: {
                font: 'Montserrat',
                weight: '700',
                size: 74,
                color: '#ffffff',
                position: 'top',
                offsetY: 7
            },
            style: 'fresh'
        }
    },
    {
        id: 'sunset-vibes',
        name: 'Sunset Vibes',
        category: 'gradient',
        preview: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
        config: {
            background: {
                type: 'gradient',
                stops: [
                    { color: '#f093fb', position: 0 },
                    { color: '#f5576c', position: 100 }
                ],
                angle: 135
            },
            device: { scale: 68, x: 50, y: 70, rotation: 0 },
            text: {
                font: 'Quicksand',
                weight: '700',
                size: 76,
                color: '#ffffff',
                position: 'top',
                offsetY: 7
            },
            style: 'warm'
        }
    },
    {
        id: 'midnight-city',
        name: 'Midnight City',
        category: 'gradient',
        preview: 'linear-gradient(135deg, #232526 0%, #414345 100%)',
        config: {
            background: {
                type: 'gradient',
                stops: [
                    { color: '#232526', position: 0 },
                    { color: '#414345', position: 100 }
                ],
                angle: 135
            },
            device: { scale: 68, x: 50, y: 70, rotation: 0 },
            text: {
                font: 'DM Sans',
                weight: '600',
                size: 74,
                color: '#ffffff',
                position: 'top',
                offsetY: 7
            },
            style: 'dark'
        }
    },
    {
        id: 'electric-violet',
        name: 'Electric Violet',
        category: 'gradient',
        preview: 'linear-gradient(135deg, #4776E6 0%, #8E54E9 100%)',
        config: {
            background: {
                type: 'gradient',
                stops: [
                    { color: '#4776E6', position: 0 },
                    { color: '#8E54E9', position: 100 }
                ],
                angle: 135
            },
            device: { scale: 68, x: 50, y: 70, rotation: 0 },
            text: {
                font: 'Space Grotesk',
                weight: '700',
                size: 74,
                color: '#ffffff',
                position: 'top',
                offsetY: 7
            },
            style: 'tech'
        }
    },

    // === DYNAMIC ANGLES ===
    {
        id: 'tilted-modern',
        name: 'Tilted Modern',
        category: 'dynamic',
        preview: 'linear-gradient(150deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
        config: {
            background: {
                type: 'gradient',
                stops: [
                    { color: '#1a1a2e', position: 0 },
                    { color: '#16213e', position: 50 },
                    { color: '#0f3460', position: 100 }
                ],
                angle: 150
            },
            device: { scale: 72, x: 55, y: 68, rotation: -8 },
            text: {
                font: 'Poppins',
                weight: '700',
                size: 70,
                color: '#ffffff',
                position: 'top',
                offsetY: 6
            },
            style: 'dynamic'
        }
    },
    {
        id: 'floating-card',
        name: 'Floating Card',
        category: 'dynamic',
        preview: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
        config: {
            background: {
                type: 'gradient',
                stops: [
                    { color: '#11998e', position: 0 },
                    { color: '#38ef7d', position: 100 }
                ],
                angle: 135
            },
            device: { scale: 65, x: 52, y: 72, rotation: 5 },
            text: {
                font: 'Montserrat',
                weight: '800',
                size: 68,
                color: '#ffffff',
                position: 'top',
                offsetY: 6
            },
            shadow: { blur: 60, opacity: 40, y: 20 },
            style: 'playful'
        }
    },

    // === NEON & CYBER ===
    {
        id: 'neon-nights',
        name: 'Neon Nights',
        category: 'neon',
        preview: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)',
        config: {
            background: {
                type: 'gradient',
                stops: [
                    { color: '#0f0c29', position: 0 },
                    { color: '#302b63', position: 50 },
                    { color: '#24243e', position: 100 }
                ],
                angle: 135
            },
            device: { scale: 68, x: 50, y: 70, rotation: 0 },
            text: {
                font: 'Space Grotesk',
                weight: '700',
                size: 72,
                color: '#f0f0f0',
                position: 'top',
                offsetY: 7
            },
            glow: { color: '#667eea', blur: 100, opacity: 30 },
            style: 'cyber'
        }
    },
    {
        id: 'cyber-punk',
        name: 'Cyber Punk',
        category: 'neon',
        preview: 'linear-gradient(135deg, #0D0D0D 0%, #1a1a2e 100%)',
        config: {
            background: {
                type: 'gradient',
                stops: [
                    { color: '#0D0D0D', position: 0 },
                    { color: '#1a1a2e', position: 100 }
                ],
                angle: 135
            },
            device: { scale: 70, x: 50, y: 68, rotation: -3 },
            text: {
                font: 'Orbitron',
                weight: '700',
                size: 64,
                color: '#00f5ff',
                position: 'top',
                offsetY: 6
            },
            style: 'cyber'
        }
    },

    // === SOFT & ELEGANT ===
    {
        id: 'soft-blush',
        name: 'Soft Blush',
        category: 'soft',
        preview: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
        config: {
            background: {
                type: 'gradient',
                stops: [
                    { color: '#ffecd2', position: 0 },
                    { color: '#fcb69f', position: 100 }
                ],
                angle: 135
            },
            device: { scale: 65, x: 50, y: 72, rotation: 0 },
            text: {
                font: 'Playfair Display',
                weight: '700',
                size: 70,
                color: '#2d2d2d',
                position: 'top',
                offsetY: 8
            },
            style: 'elegant'
        }
    },
    {
        id: 'lavender-dream',
        name: 'Lavender Dream',
        category: 'soft',
        preview: 'linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%)',
        config: {
            background: {
                type: 'gradient',
                stops: [
                    { color: '#e0c3fc', position: 0 },
                    { color: '#8ec5fc', position: 100 }
                ],
                angle: 135
            },
            device: { scale: 65, x: 50, y: 72, rotation: 0 },
            text: {
                font: 'Quicksand',
                weight: '700',
                size: 72,
                color: '#2d2d2d',
                position: 'top',
                offsetY: 8
            },
            style: 'soft'
        }
    },

    // === BOLD & STARTUP ===
    {
        id: 'startup-bold',
        name: 'Startup Bold',
        category: 'bold',
        preview: 'linear-gradient(135deg, #FF416C 0%, #FF4B2B 100%)',
        config: {
            background: {
                type: 'gradient',
                stops: [
                    { color: '#FF416C', position: 0 },
                    { color: '#FF4B2B', position: 100 }
                ],
                angle: 135
            },
            device: { scale: 70, x: 50, y: 68, rotation: 0 },
            text: {
                font: 'Montserrat',
                weight: '900',
                size: 68,
                color: '#ffffff',
                position: 'top',
                offsetY: 6
            },
            style: 'bold'
        }
    },
    {
        id: 'tech-blue',
        name: 'Tech Blue',
        category: 'bold',
        preview: 'linear-gradient(135deg, #0061ff 0%, #60efff 100%)',
        config: {
            background: {
                type: 'gradient',
                stops: [
                    { color: '#0061ff', position: 0 },
                    { color: '#60efff', position: 100 }
                ],
                angle: 135
            },
            device: { scale: 68, x: 50, y: 70, rotation: 0 },
            text: {
                font: 'Inter',
                weight: '700',
                size: 72,
                color: '#ffffff',
                position: 'top',
                offsetY: 7
            },
            style: 'tech'
        }
    },

    // === NATURE & ORGANIC ===
    {
        id: 'forest-green',
        name: 'Forest Green',
        category: 'nature',
        preview: 'linear-gradient(135deg, #134e5e 0%, #71b280 100%)',
        config: {
            background: {
                type: 'gradient',
                stops: [
                    { color: '#134e5e', position: 0 },
                    { color: '#71b280', position: 100 }
                ],
                angle: 135
            },
            device: { scale: 68, x: 50, y: 70, rotation: 0 },
            text: {
                font: 'DM Sans',
                weight: '600',
                size: 74,
                color: '#ffffff',
                position: 'top',
                offsetY: 7
            },
            style: 'organic'
        }
    },
    {
        id: 'golden-hour',
        name: 'Golden Hour',
        category: 'nature',
        preview: 'linear-gradient(135deg, #f12711 0%, #f5af19 100%)',
        config: {
            background: {
                type: 'gradient',
                stops: [
                    { color: '#f12711', position: 0 },
                    { color: '#f5af19', position: 100 }
                ],
                angle: 135
            },
            device: { scale: 68, x: 50, y: 70, rotation: 0 },
            text: {
                font: 'Poppins',
                weight: '700',
                size: 72,
                color: '#ffffff',
                position: 'top',
                offsetY: 7
            },
            style: 'warm'
        }
    },

    // === GLASSMORPHISM ===
    {
        id: 'glass-dark',
        name: 'Glass Dark',
        category: 'glass',
        preview: 'linear-gradient(135deg, rgba(30,30,30,0.9) 0%, rgba(60,60,60,0.7) 100%)',
        config: {
            background: {
                type: 'gradient',
                stops: [
                    { color: '#1a1a2e', position: 0 },
                    { color: '#16213e', position: 50 },
                    { color: '#0f3460', position: 100 }
                ],
                angle: 135
            },
            device: { scale: 65, x: 50, y: 72, rotation: 0 },
            text: {
                font: 'SF Pro Display',
                weight: '600',
                size: 70,
                color: '#ffffff',
                position: 'top',
                offsetY: 8
            },
            glass: {
                enabled: true,
                blur: 20,
                opacity: 0.15,
                border: 'rgba(255,255,255,0.2)',
                background: 'rgba(255,255,255,0.1)'
            },
            style: 'glass'
        }
    },
    {
        id: 'glass-aurora',
        name: 'Glass Aurora',
        category: 'glass',
        preview: 'linear-gradient(135deg, rgba(102,126,234,0.8) 0%, rgba(118,75,162,0.8) 100%)',
        config: {
            background: {
                type: 'gradient',
                stops: [
                    { color: '#667eea', position: 0 },
                    { color: '#764ba2', position: 50 },
                    { color: '#f093fb', position: 100 }
                ],
                angle: 135
            },
            device: { scale: 65, x: 50, y: 72, rotation: 0 },
            text: {
                font: 'Poppins',
                weight: '600',
                size: 72,
                color: '#ffffff',
                position: 'top',
                offsetY: 8
            },
            glass: {
                enabled: true,
                blur: 25,
                opacity: 0.2,
                border: 'rgba(255,255,255,0.3)',
                background: 'rgba(255,255,255,0.15)'
            },
            style: 'glass'
        }
    },
    {
        id: 'glass-ocean',
        name: 'Glass Ocean',
        category: 'glass',
        preview: 'linear-gradient(135deg, rgba(0,147,233,0.8) 0%, rgba(128,208,199,0.8) 100%)',
        config: {
            background: {
                type: 'gradient',
                stops: [
                    { color: '#0093E9', position: 0 },
                    { color: '#80D0C7', position: 100 }
                ],
                angle: 135
            },
            device: { scale: 65, x: 50, y: 72, rotation: 0 },
            text: {
                font: 'Inter',
                weight: '700',
                size: 72,
                color: '#ffffff',
                position: 'top',
                offsetY: 8
            },
            glass: {
                enabled: true,
                blur: 20,
                opacity: 0.2,
                border: 'rgba(255,255,255,0.25)',
                background: 'rgba(255,255,255,0.12)'
            },
            style: 'glass'
        }
    },
    {
        id: 'glass-frost',
        name: 'Glass Frost',
        category: 'glass',
        preview: 'linear-gradient(135deg, rgba(240,240,250,0.95) 0%, rgba(220,220,235,0.9) 100%)',
        config: {
            background: {
                type: 'gradient',
                stops: [
                    { color: '#e0e5ec', position: 0 },
                    { color: '#f0f0f3', position: 100 }
                ],
                angle: 135
            },
            device: { scale: 65, x: 50, y: 72, rotation: 0 },
            text: {
                font: 'SF Pro Display',
                weight: '600',
                size: 70,
                color: '#1d1d1f',
                position: 'top',
                offsetY: 8
            },
            glass: {
                enabled: true,
                blur: 15,
                opacity: 0.4,
                border: 'rgba(255,255,255,0.8)',
                background: 'rgba(255,255,255,0.5)'
            },
            style: 'glass'
        }
    },

    // === 3D DEPTH ===
    {
        id: 'depth-float',
        name: 'Depth Float',
        category: '3d',
        preview: 'linear-gradient(180deg, #1a1a2e 0%, #16213e 100%)',
        config: {
            background: {
                type: 'gradient',
                stops: [
                    { color: '#1a1a2e', position: 0 },
                    { color: '#16213e', position: 100 }
                ],
                angle: 180
            },
            device: { scale: 62, x: 50, y: 70, rotation: -5 },
            text: {
                font: 'Montserrat',
                weight: '700',
                size: 68,
                color: '#ffffff',
                position: 'top',
                offsetY: 6
            },
            shadow: {
                blur: 80,
                opacity: 60,
                y: 30,
                color: 'rgba(0,0,0,0.5)'
            },
            style: '3d'
        }
    },
    {
        id: 'depth-perspective',
        name: 'Perspective',
        category: '3d',
        preview: 'linear-gradient(135deg, #2d3436 0%, #000000 100%)',
        config: {
            background: {
                type: 'gradient',
                stops: [
                    { color: '#2d3436', position: 0 },
                    { color: '#000000', position: 100 }
                ],
                angle: 135
            },
            device: { scale: 70, x: 55, y: 68, rotation: -12 },
            text: {
                font: 'Space Grotesk',
                weight: '700',
                size: 66,
                color: '#ffffff',
                position: 'top',
                offsetY: 5
            },
            shadow: {
                blur: 100,
                opacity: 70,
                y: 40,
                color: 'rgba(0,0,0,0.6)'
            },
            style: '3d'
        }
    }
];

// Template categories for filtering
const TEMPLATE_CATEGORIES = {
    all: 'All Templates',
    minimal: 'Minimal',
    gradient: 'Gradient',
    dynamic: 'Dynamic',
    neon: 'Neon & Cyber',
    soft: 'Soft & Elegant',
    bold: 'Bold',
    nature: 'Nature',
    glass: 'Glassmorphism',
    '3d': '3D Depth'
};

/**
 * Extract dominant colors from an image
 */
function extractColorsFromImage(imageData) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    return new Promise((resolve) => {
        img.onload = () => {
            canvas.width = 50; // Sample size
            canvas.height = 50;
            ctx.drawImage(img, 0, 0, 50, 50);

            const data = ctx.getImageData(0, 0, 50, 50).data;
            const colors = [];

            // Sample pixels
            for (let i = 0; i < data.length; i += 16) {
                const r = data[i];
                const g = data[i + 1];
                const b = data[i + 2];
                colors.push({ r, g, b });
            }

            // Find dominant colors using simple clustering
            const dominant = findDominantColors(colors, 3);
            resolve(dominant);
        };

        img.src = imageData;
    });
}

function findDominantColors(colors, numColors) {
    // Simple k-means-like clustering
    const buckets = {};

    colors.forEach(c => {
        // Quantize to reduce colors
        const key = `${Math.floor(c.r / 32) * 32}-${Math.floor(c.g / 32) * 32}-${Math.floor(c.b / 32) * 32}`;
        buckets[key] = (buckets[key] || 0) + 1;
    });

    // Sort by frequency
    const sorted = Object.entries(buckets)
        .sort((a, b) => b[1] - a[1])
        .slice(0, numColors)
        .map(([key]) => {
            const [r, g, b] = key.split('-').map(Number);
            return rgbToHex(r, g, b);
        });

    return sorted;
}

function rgbToHex(r, g, b) {
    return '#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('');
}

/**
 * Generate a complementary template based on extracted colors
 */
function generateSmartTemplate(dominantColors, isDark = true) {
    const primary = dominantColors[0] || '#667eea';
    const secondary = dominantColors[1] || adjustColor(primary, 30);
    const accent = dominantColors[2] || adjustColor(primary, -30);

    return {
        id: 'smart-generated',
        name: 'Smart Match',
        category: 'smart',
        config: {
            background: {
                type: 'gradient',
                stops: [
                    { color: isDark ? darkenColor(primary, 60) : lightenColor(primary, 40), position: 0 },
                    { color: isDark ? darkenColor(secondary, 40) : lightenColor(secondary, 20), position: 100 }
                ],
                angle: 135
            },
            device: { scale: 68, x: 50, y: 70, rotation: 0 },
            text: {
                font: 'Poppins',
                weight: '700',
                size: 74,
                color: isDark ? '#ffffff' : '#1a1a1a',
                position: 'top',
                offsetY: 7
            },
            accentColor: accent,
            style: 'smart'
        }
    };
}

function adjustColor(hex, amount) {
    const num = parseInt(hex.slice(1), 16);
    const r = Math.min(255, Math.max(0, (num >> 16) + amount));
    const g = Math.min(255, Math.max(0, ((num >> 8) & 0x00FF) + amount));
    const b = Math.min(255, Math.max(0, (num & 0x0000FF) + amount));
    return `#${(1 << 24 | r << 16 | g << 8 | b).toString(16).slice(1)}`;
}

function darkenColor(hex, percent) {
    const num = parseInt(hex.slice(1), 16);
    const amt = Math.round(2.55 * percent);
    const r = Math.max(0, (num >> 16) - amt);
    const g = Math.max(0, ((num >> 8) & 0x00FF) - amt);
    const b = Math.max(0, (num & 0x0000FF) - amt);
    return `#${(1 << 24 | r << 16 | g << 8 | b).toString(16).slice(1)}`;
}

function lightenColor(hex, percent) {
    const num = parseInt(hex.slice(1), 16);
    const amt = Math.round(2.55 * percent);
    const r = Math.min(255, (num >> 16) + amt);
    const g = Math.min(255, ((num >> 8) & 0x00FF) + amt);
    const b = Math.min(255, (num & 0x0000FF) + amt);
    return `#${(1 << 24 | r << 16 | g << 8 | b).toString(16).slice(1)}`;
}

/**
 * Apply template to screenshot
 */
function applyTemplate(template, screenshot) {
    const config = template.config;

    // Apply background
    screenshot.background = {
        type: config.background.type,
        gradient: `linear-gradient(${config.background.angle}deg, ${config.background.stops.map(s => `${s.color} ${s.position}%`).join(', ')})`,
        stops: config.background.stops,
        angle: config.background.angle
    };

    // Apply device positioning
    screenshot.screenshot = screenshot.screenshot || {};
    screenshot.screenshot.scale = config.device.scale;
    screenshot.screenshot.x = config.device.x;
    screenshot.screenshot.y = config.device.y;
    screenshot.screenshot.rotation = config.device.rotation;

    // Apply shadow if defined
    if (config.shadow) {
        screenshot.screenshot.shadow = {
            blur: config.shadow.blur,
            opacity: config.shadow.opacity,
            y: config.shadow.y,
            color: config.shadow.color || '#000000'
        };
    } else {
        // Default subtle shadow
        screenshot.screenshot.shadow = {
            blur: 40,
            opacity: 30,
            y: 15,
            color: '#000000'
        };
    }

    // Apply glassmorphism settings if defined
    if (config.glass) {
        screenshot.glass = {
            enabled: config.glass.enabled,
            blur: config.glass.blur,
            opacity: config.glass.opacity,
            border: config.glass.border,
            background: config.glass.background
        };
    } else {
        screenshot.glass = { enabled: false };
    }

    // Apply text settings
    screenshot.text = screenshot.text || {};
    screenshot.text.headlineFont = config.text.font;
    screenshot.text.headlineWeight = config.text.weight;
    screenshot.text.headlineSize = config.text.size;
    screenshot.text.headlineColor = config.text.color;
    screenshot.text.position = config.text.position;
    screenshot.text.offsetY = config.text.offsetY;

    return screenshot;
}

/**
 * Apply template to all screenshots with variations
 */
function applyTemplateToAll(template, screenshots) {
    screenshots.forEach((screenshot, index) => {
        applyTemplate(template, screenshot);

        // Add slight variations for visual interest
        if (index > 0) {
            const variation = (index % 3) - 1; // -1, 0, or 1
            screenshot.screenshot.rotation = (template.config.device.rotation || 0) + variation * 2;
        }
    });
}

// Export for use
window.FreshTemplates = {
    FRESH_TEMPLATES,
    TEMPLATE_CATEGORIES,
    extractColorsFromImage,
    generateSmartTemplate,
    applyTemplate,
    applyTemplateToAll,
    getTemplatesByCategory: (category) => {
        if (category === 'all') return FRESH_TEMPLATES;
        return FRESH_TEMPLATES.filter(t => t.category === category);
    },
    getTemplateById: (id) => FRESH_TEMPLATES.find(t => t.id === id)
};
