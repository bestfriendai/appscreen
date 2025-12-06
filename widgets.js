/**
 * Floating Elements & Widgets System
 * Adds badges, ratings, notifications, and decorative elements to screenshots
 */

const WIDGET_TYPES = {
    rating: {
        id: 'rating',
        name: 'Rating Badge',
        icon: '⭐',
        defaultText: '4.9 ★ • 50K reviews',
        style: {
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            textColor: '#1D1D1F',
            borderRadius: 20,
            padding: { x: 16, y: 10 },
            shadow: true
        }
    },
    award: {
        id: 'award',
        name: 'Award Badge',
        icon: '🏆',
        defaultText: "Editor's Choice",
        style: {
            backgroundColor: '#007AFF',
            textColor: '#FFFFFF',
            borderRadius: 16,
            padding: { x: 14, y: 8 },
            shadow: true
        }
    },
    download: {
        id: 'download',
        name: 'Download Count',
        icon: '📥',
        defaultText: '10M+ Downloads',
        style: {
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            textColor: '#FFFFFF',
            borderRadius: 18,
            padding: { x: 14, y: 8 },
            shadow: false
        }
    },
    security: {
        id: 'security',
        name: 'Security Badge',
        icon: '🔒',
        defaultText: 'Bank-level Security',
        style: {
            backgroundColor: '#34C759',
            textColor: '#FFFFFF',
            borderRadius: 16,
            padding: { x: 14, y: 8 },
            shadow: true
        }
    },
    speed: {
        id: 'speed',
        name: 'Speed Badge',
        icon: '⚡',
        defaultText: 'Lightning Fast',
        style: {
            backgroundColor: '#FF9500',
            textColor: '#FFFFFF',
            borderRadius: 16,
            padding: { x: 14, y: 8 },
            shadow: true
        }
    },
    custom: {
        id: 'custom',
        name: 'Custom Badge',
        icon: '✨',
        defaultText: 'Custom Text',
        style: {
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            textColor: '#1D1D1F',
            borderRadius: 16,
            padding: { x: 14, y: 8 },
            shadow: true
        }
    }
};

const FLOATING_ELEMENT_TYPES = {
    pill: {
        id: 'pill',
        name: 'Pill',
        description: 'Rounded pill shape for short text',
        style: {
            borderRadius: 100,
            padding: { x: 16, y: 8 },
            fontSize: 14
        }
    },
    card: {
        id: 'card',
        name: 'Card',
        description: 'Rounded card for longer content',
        style: {
            borderRadius: 16,
            padding: { x: 20, y: 14 },
            fontSize: 14,
            maxWidth: 200
        }
    },
    notification: {
        id: 'notification',
        name: 'Notification',
        description: 'iOS-style notification',
        style: {
            borderRadius: 20,
            padding: { x: 16, y: 12 },
            fontSize: 13,
            hasIcon: true,
            blur: true
        }
    },
    icon_bubble: {
        id: 'icon_bubble',
        name: 'Icon Bubble',
        description: 'Circular icon container',
        style: {
            borderRadius: 50,
            padding: { x: 12, y: 12 },
            fontSize: 20,
            isCircle: true
        }
    },
    review: {
        id: 'review',
        name: 'Review Card',
        description: 'User review snippet',
        style: {
            borderRadius: 16,
            padding: { x: 16, y: 14 },
            fontSize: 13,
            hasAvatar: true,
            maxWidth: 220
        }
    }
};

const SOCIAL_PROOF_BADGES = {
    fitness: [
        { type: 'rating', text: '4.9 ★ Health & Fitness' },
        { type: 'award', text: '#1 Fitness App' },
        { type: 'download', text: '5M+ Active Users' }
    ],
    finance: [
        { type: 'security', text: 'Bank-level Security' },
        { type: 'rating', text: '4.8 ★ Finance' },
        { type: 'award', text: 'Best Finance App 2025' }
    ],
    food: [
        { type: 'rating', text: '4.7 ★ Food & Drink' },
        { type: 'download', text: '10M+ Orders' },
        { type: 'speed', text: '30 min Delivery' }
    ],
    productivity: [
        { type: 'rating', text: '4.8 ★ Productivity' },
        { type: 'award', text: "Editor's Choice" },
        { type: 'download', text: '2M+ Teams' }
    ],
    social: [
        { type: 'download', text: '50M+ Users' },
        { type: 'rating', text: '4.6 ★ Social' },
        { type: 'award', text: 'App of the Day' }
    ],
    generic: [
        { type: 'rating', text: '4.8 ★ • 100K+ Reviews' },
        { type: 'award', text: 'Featured App' },
        { type: 'download', text: '1M+ Downloads' }
    ]
};

/**
 * Create a new widget
 */
function createWidget(type, text, position = { x: 50, y: 10 }) {
    const widgetType = WIDGET_TYPES[type] || WIDGET_TYPES.custom;
    return {
        id: 'widget_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
        type: type,
        text: text || widgetType.defaultText,
        position: {
            x: position.x,
            y: position.y,
            rotate: 0,
            scale: 1
        },
        style: { ...widgetType.style }
    };
}

/**
 * Create a floating element
 */
function createFloatingElement(type, text, subtext = '', position = { x: 20, y: 20 }) {
    const elementType = FLOATING_ELEMENT_TYPES[type] || FLOATING_ELEMENT_TYPES.pill;
    return {
        id: 'float_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
        type: type,
        text: text,
        subtext: subtext,
        icon: '',
        position: {
            x: position.x,
            y: position.y,
            rotate: Math.random() * 10 - 5, // Slight random rotation
            scale: 1
        },
        style: { ...elementType.style }
    };
}

/**
 * Get social proof badges for category
 */
function getSocialProofForCategory(category) {
    const lowerCategory = category.toLowerCase();
    for (const [cat, badges] of Object.entries(SOCIAL_PROOF_BADGES)) {
        if (lowerCategory.includes(cat)) {
            return badges;
        }
    }
    return SOCIAL_PROOF_BADGES.generic;
}

/**
 * Render widget to canvas
 */
function renderWidget(ctx, widget, canvasWidth, canvasHeight) {
    const widgetType = WIDGET_TYPES[widget.type] || WIDGET_TYPES.custom;
    const style = widget.style || widgetType.style;

    // Calculate position
    const x = (widget.position.x / 100) * canvasWidth;
    const y = (widget.position.y / 100) * canvasHeight;

    ctx.save();
    ctx.translate(x, y);
    ctx.rotate((widget.position.rotate || 0) * Math.PI / 180);
    ctx.scale(widget.position.scale || 1, widget.position.scale || 1);

    // Measure text
    ctx.font = `600 ${Math.round(canvasWidth * 0.022)}px Inter, -apple-system, sans-serif`;
    const textMetrics = ctx.measureText(widget.text);
    const textWidth = textMetrics.width;
    const textHeight = canvasWidth * 0.022;

    const padding = {
        x: style.padding?.x || 16,
        y: style.padding?.y || 10
    };
    const scaledPadding = {
        x: padding.x * (canvasWidth / 1290),
        y: padding.y * (canvasWidth / 1290)
    };

    const boxWidth = textWidth + scaledPadding.x * 2;
    const boxHeight = textHeight + scaledPadding.y * 2;
    const borderRadius = (style.borderRadius || 20) * (canvasWidth / 1290);

    // Draw shadow
    if (style.shadow) {
        ctx.shadowColor = 'rgba(0, 0, 0, 0.15)';
        ctx.shadowBlur = 20 * (canvasWidth / 1290);
        ctx.shadowOffsetY = 8 * (canvasWidth / 1290);
    }

    // Draw background
    ctx.fillStyle = style.backgroundColor || 'rgba(255, 255, 255, 0.95)';
    ctx.beginPath();
    ctx.roundRect(-boxWidth / 2, -boxHeight / 2, boxWidth, boxHeight, borderRadius);
    ctx.fill();

    // Reset shadow
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
    ctx.shadowOffsetY = 0;

    // Draw text
    ctx.fillStyle = style.textColor || '#1D1D1F';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(widget.text, 0, 0);

    ctx.restore();
}

/**
 * Render floating element to canvas
 */
function renderFloatingElement(ctx, element, canvasWidth, canvasHeight) {
    const elementType = FLOATING_ELEMENT_TYPES[element.type] || FLOATING_ELEMENT_TYPES.pill;
    const style = element.style || elementType.style;

    // Calculate position
    const x = (element.position.x / 100) * canvasWidth;
    const y = (element.position.y / 100) * canvasHeight;

    ctx.save();
    ctx.translate(x, y);
    ctx.rotate((element.position.rotate || 0) * Math.PI / 180);
    ctx.scale(element.position.scale || 1, element.position.scale || 1);

    const fontSize = (style.fontSize || 14) * (canvasWidth / 1290);
    ctx.font = `500 ${fontSize}px Inter, -apple-system, sans-serif`;

    const textMetrics = ctx.measureText(element.text || '');
    const textWidth = Math.min(textMetrics.width, (style.maxWidth || 300) * (canvasWidth / 1290));
    const textHeight = fontSize * 1.2;

    const padding = {
        x: (style.padding?.x || 16) * (canvasWidth / 1290),
        y: (style.padding?.y || 10) * (canvasWidth / 1290)
    };

    let boxWidth = textWidth + padding.x * 2;
    let boxHeight = textHeight + padding.y * 2;

    if (element.subtext) {
        boxHeight += fontSize * 0.9;
    }

    if (style.isCircle) {
        boxWidth = boxHeight = Math.max(boxWidth, boxHeight);
    }

    const borderRadius = style.isCircle ? boxWidth / 2 : (style.borderRadius || 16) * (canvasWidth / 1290);

    // Draw shadow
    ctx.shadowColor = 'rgba(0, 0, 0, 0.12)';
    ctx.shadowBlur = 16 * (canvasWidth / 1290);
    ctx.shadowOffsetY = 6 * (canvasWidth / 1290);

    // Draw background with blur effect
    if (style.blur) {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
    } else {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
    }

    ctx.beginPath();
    ctx.roundRect(-boxWidth / 2, -boxHeight / 2, boxWidth, boxHeight, borderRadius);
    ctx.fill();

    // Reset shadow
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
    ctx.shadowOffsetY = 0;

    // Draw text
    ctx.fillStyle = '#1D1D1F';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    if (element.subtext) {
        ctx.fillText(element.text, 0, -fontSize * 0.3);
        ctx.font = `400 ${fontSize * 0.85}px Inter, -apple-system, sans-serif`;
        ctx.fillStyle = '#6C757D';
        ctx.fillText(element.subtext, 0, fontSize * 0.5);
    } else {
        ctx.fillText(element.text, 0, 0);
    }

    ctx.restore();
}

/**
 * Add widget to screenshot
 */
function addWidgetToScreenshot(screenshot, widget) {
    if (!screenshot.widgets) {
        screenshot.widgets = [];
    }
    screenshot.widgets.push(widget);
    return screenshot;
}

/**
 * Add floating element to screenshot
 */
function addFloatingElementToScreenshot(screenshot, element) {
    if (!screenshot.floatingElements) {
        screenshot.floatingElements = [];
    }
    screenshot.floatingElements.push(element);
    return screenshot;
}

/**
 * Remove widget from screenshot
 */
function removeWidgetFromScreenshot(screenshot, widgetId) {
    if (screenshot.widgets) {
        screenshot.widgets = screenshot.widgets.filter(w => w.id !== widgetId);
    }
    return screenshot;
}

/**
 * Remove floating element from screenshot
 */
function removeFloatingElementFromScreenshot(screenshot, elementId) {
    if (screenshot.floatingElements) {
        screenshot.floatingElements = screenshot.floatingElements.filter(e => e.id !== elementId);
    }
    return screenshot;
}

/**
 * Update widget content
 */
function updateWidget(screenshot, widgetId, updates) {
    if (!screenshot.widgets) return screenshot;

    const widget = screenshot.widgets.find(w => w.id === widgetId);
    if (widget) {
        Object.assign(widget, updates);
    }
    return screenshot;
}

/**
 * Clear all widgets from screenshot
 */
function clearWidgetsFromScreenshot(screenshot) {
    screenshot.widgets = [];
    screenshot.floatingElements = [];
    return screenshot;
}

/**
 * Get suggested widget positions
 */
function getSuggestedPositions(layout) {
    const positions = {
        'hero_large': [
            { name: 'Top Left', x: 12, y: 6 },
            { name: 'Top Right', x: 88, y: 6 },
            { name: 'Bottom Center', x: 50, y: 94 }
        ],
        'offset_right': [
            { name: 'Top Left', x: 15, y: 6 },
            { name: 'Bottom Left', x: 15, y: 90 }
        ],
        'offset_left': [
            { name: 'Top Right', x: 85, y: 6 },
            { name: 'Bottom Right', x: 85, y: 90 }
        ],
        'panoramic_right': [
            { name: 'Top Left', x: 15, y: 6 },
            { name: 'Center Left', x: 15, y: 50 }
        ],
        'panoramic_left': [
            { name: 'Top Right', x: 85, y: 6 },
            { name: 'Center Right', x: 85, y: 50 }
        ],
        'default': [
            { name: 'Top Center', x: 50, y: 6 },
            { name: 'Bottom Center', x: 50, y: 94 }
        ]
    };

    return positions[layout] || positions['default'];
}

/**
 * Generate AI-suggested widgets for a screenshot
 */
function generateAISuggestedWidgets(appAnalysis, screenshotIndex, totalScreenshots) {
    const widgets = [];
    const category = appAnalysis.app.category;
    const socialProof = getSocialProofForCategory(category);

    // First screenshot gets rating/award
    if (screenshotIndex === 0 && socialProof.length > 0) {
        const badge = socialProof[0];
        widgets.push(createWidget(badge.type, badge.text, { x: 15, y: 8 }));
    }

    // Last screenshot gets download count or CTA
    if (screenshotIndex === totalScreenshots - 1 && socialProof.length > 1) {
        const badge = socialProof[socialProof.length - 1];
        widgets.push(createWidget(badge.type, badge.text, { x: 85, y: 8 }));
    }

    return widgets;
}

/**
 * Render all widgets and floating elements for a screenshot
 */
function renderAllElements(ctx, screenshot, canvasWidth, canvasHeight) {
    // Render widgets
    if (screenshot.widgets && screenshot.widgets.length > 0) {
        for (const widget of screenshot.widgets) {
            renderWidget(ctx, widget, canvasWidth, canvasHeight);
        }
    }

    // Render floating elements
    if (screenshot.floatingElements && screenshot.floatingElements.length > 0) {
        for (const element of screenshot.floatingElements) {
            renderFloatingElement(ctx, element, canvasWidth, canvasHeight);
        }
    }
}

// Export for use in app.js
window.WidgetEngine = {
    WIDGET_TYPES,
    FLOATING_ELEMENT_TYPES,
    SOCIAL_PROOF_BADGES,
    createWidget,
    createFloatingElement,
    getSocialProofForCategory,
    getSuggestedPositions,
    generateAISuggestedWidgets,
    renderWidget,
    renderFloatingElement,
    renderAllElements,
    addWidgetToScreenshot,
    addFloatingElementToScreenshot,
    removeWidgetFromScreenshot,
    removeFloatingElementFromScreenshot,
    updateWidget,
    clearWidgetsFromScreenshot
};
