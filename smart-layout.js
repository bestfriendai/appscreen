/**
 * Smart Layout Selection Engine
 * Analyzes screenshot content and app category to recommend optimal layouts
 * Based on 2025 ASO research and high-converting App Store templates
 */

/**
 * Category-to-Layout mapping based on what converts best
 */
const CATEGORY_LAYOUT_PREFERENCES = {
    finance: ['hero_large', 'classic', 'offset_right', 'duo_side_by_side', 'isometric_stack'],
    fitness: ['panoramic_right', 'tilted_dynamic', 'hero_large', 'zoom_top', 'duo_overlap'],
    food: ['panoramic_right', 'offset_right', 'magazine_cover', 'classic', 'bento_grid'],
    shopping: ['magazine_cover', 'panoramic_center_right', 'duo_overlap', 'hero_large', 'bento_grid'],
    social: ['offset_right', 'panoramic_right', 'classic', 'duo_overlap', 'magazine_cover'],
    productivity: ['classic', 'hero_large', 'zoom_top', 'isometric_stack', 'offset_right'],
    health: ['panoramic_right', 'classic', 'minimal_type', 'offset_right', 'hero_large'],
    entertainment: ['panoramic_center_right', 'tilted_dynamic', 'magazine_cover', 'hero_large', 'duo_overlap'],
    travel: ['panoramic_right', 'magazine_cover', 'hero_large', 'offset_right', 'classic'],
    education: ['classic', 'hero_large', 'zoom_top', 'offset_right', 'isometric_stack'],
    developer: ['minimal_type', 'classic', 'hero_large', 'zoom_top', 'offset_right'],
    gaming: ['tilted_dynamic', 'panoramic_right', 'hero_large', 'magazine_cover', 'duo_overlap'],
    generic: ['hero_large', 'classic', 'offset_right', 'panoramic_right', 'duo_overlap']
};

/**
 * Slide position preferences (what works best in each position)
 */
const POSITION_LAYOUT_WEIGHTS = {
    first: {
        'hero_large': 1.0,
        'panoramic_right': 0.95,
        'magazine_cover': 0.9,
        'minimal_type': 0.85,
        'offset_right': 0.8,
        'classic': 0.7,
        'panoramic_center_right': 0.75
    },
    middle: {
        'offset_right': 0.95,
        'offset_left': 0.9,
        'panoramic_left': 0.85,
        'zoom_top': 0.9,
        'zoom_bottom': 0.85,
        'tilted_dynamic': 0.8,
        'classic': 0.75,
        'bento_grid': 0.7,
        'duo_overlap': 0.8
    },
    last: {
        'duo_side_by_side': 0.95,
        'duo_overlap': 0.9,
        'isometric_stack': 0.85,
        'classic': 0.8,
        'poster_hero': 0.75,
        'minimal_type': 0.7,
        'hero_large': 0.7
    }
};

/**
 * Get the optimal layout for a specific slide
 */
function getSmartLayoutForSlide(category, slideIndex, totalSlides, usedLayouts = [], isPanoramic = false) {
    // Determine position type
    let position = 'middle';
    if (slideIndex === 0) position = 'first';
    else if (slideIndex === totalSlides - 1) position = 'last';

    // Get category preferences
    const categoryKey = category.toLowerCase();
    const categoryPrefs = CATEGORY_LAYOUT_PREFERENCES[categoryKey] || CATEGORY_LAYOUT_PREFERENCES.generic;

    // Get position weights
    const positionWeights = POSITION_LAYOUT_WEIGHTS[position];

    // Score each layout
    const layoutScores = [];

    for (const layout of categoryPrefs) {
        let score = 0.5; // Base score for being in category preferences
        let reason = `Recommended for ${category} apps`;

        // Add position weight
        if (positionWeights[layout]) {
            score += positionWeights[layout] * 0.3;
            reason = position === 'first' ? 'Strong opener' :
                position === 'last' ? 'Effective closer' :
                    'Great feature showcase';
        }

        // Penalty for already used layouts (variety is key)
        if (usedLayouts.includes(layout)) {
            score -= 0.4;
            reason += ' (but already used)';
        }

        // Boost panoramic layouts if panoramic mode is enabled
        if (isPanoramic && layout.startsWith('panoramic')) {
            score += 0.15;
            reason = 'Creates professional continuous flow effect';
        }

        // First slide boost for hero layouts
        if (position === 'first' && ['hero_large', 'magazine_cover', 'minimal_type'].includes(layout)) {
            score += 0.1;
            reason = 'Maximum visual impact for search results';
        }

        // Last slide boost for duo layouts
        if (position === 'last' && layout.startsWith('duo')) {
            score += 0.1;
            reason = 'Shows app depth as final impression';
        }

        // Alternate panoramic sides for visual flow
        if (isPanoramic && slideIndex > 0) {
            const prevLayout = usedLayouts[usedLayouts.length - 1];
            if (prevLayout === 'panoramic_right' && layout === 'panoramic_left') {
                score += 0.2;
                reason = 'Creates seamless panoramic continuation';
            }
        }

        layoutScores.push({ layout, score, reason });
    }

    // Add variety by considering layouts not in category preferences
    const allLayouts = [
        'classic', 'offset_right', 'offset_left', 'hero_large', 'minimal_type',
        'zoom_top', 'zoom_bottom', 'tilted_dynamic', 'bento_grid', 'magazine_cover',
        'duo_overlap', 'duo_side_by_side', 'isometric_stack',
        'panoramic_right', 'panoramic_left', 'panoramic_center_right'
    ];

    for (const layout of allLayouts) {
        if (!categoryPrefs.includes(layout) && !usedLayouts.includes(layout)) {
            let score = 0.3;
            let reason = 'Alternative option for variety';

            if (positionWeights[layout]) {
                score += positionWeights[layout] * 0.2;
            }

            if (!layoutScores.find(l => l.layout === layout)) {
                layoutScores.push({ layout, score, reason });
            }
        }
    }

    // Sort by score and return the best
    layoutScores.sort((a, b) => b.score - a.score);

    const best = layoutScores[0];
    return {
        layout: best.layout,
        confidence: Math.min(1, Math.max(0, best.score)),
        reason: best.reason
    };
}

/**
 * Generate an optimal layout sequence for all screenshots
 */
function generateSmartLayoutSequence(category, screenshotCount, isPanoramic = false) {
    const sequence = [];
    const usedLayouts = [];

    for (let i = 0; i < screenshotCount; i++) {
        const recommendation = getSmartLayoutForSlide(
            category,
            i,
            screenshotCount,
            usedLayouts,
            isPanoramic
        );

        sequence.push(recommendation);
        usedLayouts.push(recommendation.layout);
    }

    return sequence;
}

/**
 * Check if layout shows full device or crops it
 */
function isFullDeviceLayout(layout) {
    const cropLayouts = ['zoom_top', 'zoom_bottom', 'magazine_cover'];
    return !cropLayouts.includes(layout);
}

/**
 * Check if layout requires a secondary screenshot
 */
function needsSecondaryScreenshot(layout) {
    const dualLayouts = ['duo_overlap', 'duo_side_by_side', 'double_phones', 'isometric_stack'];
    return dualLayouts.includes(layout);
}

/**
 * Get complementary layout for panoramic sequences
 */
function getComplementaryLayout(currentLayout) {
    const complements = {
        'panoramic_right': 'panoramic_left',
        'panoramic_center_right': 'offset_left',
        'offset_right': 'offset_left'
    };

    return complements[currentLayout] || null;
}

/**
 * Ensure layout variety across all screenshots
 */
function ensureLayoutVariety(layoutSequence) {
    const counts = {};
    const issues = [];

    for (let i = 0; i < layoutSequence.length; i++) {
        const layout = layoutSequence[i].layout;
        counts[layout] = (counts[layout] || 0) + 1;

        // Check for consecutive repeats
        if (i > 0 && layoutSequence[i - 1].layout === layout) {
            issues.push({
                index: i,
                type: 'consecutive_repeat',
                message: `Layout "${layout}" repeated consecutively at positions ${i} and ${i + 1}`
            });
        }
    }

    // Check for overuse
    for (const [layout, count] of Object.entries(counts)) {
        if (count > 2) {
            issues.push({
                type: 'overuse',
                layout,
                count,
                message: `Layout "${layout}" used ${count} times (max recommended: 2)`
            });
        }
    }

    return {
        isValid: issues.length === 0,
        issues,
        varietyScore: Object.keys(counts).length / layoutSequence.length
    };
}

/**
 * Auto-apply smart layouts to all screenshots
 */
function autoApplySmartLayouts(state, category = null) {
    const detectedCategory = category ||
        (window.CategoryDetection ? window.CategoryDetection.detectAppCategory(state.appDescription || '') : 'generic');

    const screenshotCount = state.screenshots.length;
    const isPanoramic = screenshotCount >= 4;

    const sequence = generateSmartLayoutSequence(detectedCategory, screenshotCount, isPanoramic);

    // Apply layouts to each screenshot
    sequence.forEach((recommendation, index) => {
        if (state.screenshots[index]) {
            const layoutConfig = window.LayoutEngine ?
                window.LayoutEngine.getLayoutConfig(recommendation.layout) :
                null;

            if (layoutConfig) {
                state.screenshots[index].scale = layoutConfig.device.scale * 100;
                state.screenshots[index].x = layoutConfig.device.x;
                state.screenshots[index].y = layoutConfig.device.y;
                state.screenshots[index].rotation = layoutConfig.device.rotation;
                state.screenshots[index].layout = recommendation.layout;
                state.screenshots[index].layoutReason = recommendation.reason;
            }
        }
    });

    return state;
}

// Export for use in app.js
window.SmartLayout = {
    CATEGORY_LAYOUT_PREFERENCES,
    POSITION_LAYOUT_WEIGHTS,
    getSmartLayoutForSlide,
    generateSmartLayoutSequence,
    isFullDeviceLayout,
    needsSecondaryScreenshot,
    getComplementaryLayout,
    ensureLayoutVariety,
    autoApplySmartLayouts
};
