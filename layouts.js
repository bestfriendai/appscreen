/**
 * Professional Layout Engine for App Store Screenshots
 * Ported from old React version - 26+ layout types
 * Based on 2025 ASO best practices and high-converting template designs
 */

// Layout type definitions
const LAYOUT_TYPES = [
    'classic', 'minimal_float', 'zoom_top', 'zoom_bottom', 'tilted_dynamic',
    'isometric_stack', 'off_axis_left', 'double_phones', 'bento_grid', 'magazine_cover',
    'spiral_stack', 'overlapping_cards', 'diagonal_flow', 'perspective_spread',
    'split_screen', 'device_grid', 'feature_list', 'floating_hero', 'duo_overlap',
    'tri_stack_angle', 'quad_grid', 'landscape_float', 'card_focus', 'minimal_type',
    'poster_hero', 'panoramic_right', 'panoramic_left', 'panoramic_center_right',
    'offset_right', 'offset_left', 'hero_large', 'duo_side_by_side'
];

/**
 * Professional layout configurations
 * These are based on analysis of top-performing App Store screenshots
 */
const LAYOUT_CONFIGS = {
    // === HERO LAYOUTS (Best for first screenshot) ===

    'hero_large': {
        id: 'hero_large',
        name: 'Hero Large',
        description: 'Large centered device with maximum impact',
        category: ['all'],
        device: {
            scale: 0.72,
            x: 0,
            y: 25,
            rotation: 0
        },
        text: {
            position: 'top',
            align: 'center',
            maxWidth: '90%',
            offsetY: 8
        },
        isPanoramic: false,
        showSecondaryDevice: false,
        recommendedFor: ['first_slide', 'brand_statement']
    },

    'classic': {
        id: 'classic',
        name: 'Classic Centered',
        description: 'Classic centered device with headline above',
        category: ['all'],
        device: {
            scale: 0.65,
            x: 0,
            y: 22,
            rotation: 0
        },
        text: {
            position: 'top',
            align: 'center',
            maxWidth: '90%',
            offsetY: 6
        },
        isPanoramic: false,
        showSecondaryDevice: false,
        recommendedFor: ['feature_highlight', 'any']
    },

    'offset_right': {
        id: 'offset_right',
        name: 'Offset Right',
        description: 'Device positioned to the right with slight rotation',
        category: ['all'],
        device: {
            scale: 0.68,
            x: 12,
            y: 20,
            rotation: -5
        },
        text: {
            position: 'top',
            align: 'left',
            maxWidth: '60%',
            offsetY: 8
        },
        isPanoramic: false,
        showSecondaryDevice: false,
        recommendedFor: ['first_slide', 'storytelling']
    },

    'offset_left': {
        id: 'offset_left',
        name: 'Offset Left',
        description: 'Device positioned to the left with slight rotation',
        category: ['all'],
        device: {
            scale: 0.68,
            x: -12,
            y: 20,
            rotation: 5
        },
        text: {
            position: 'top',
            align: 'right',
            maxWidth: '60%',
            offsetY: 8
        },
        isPanoramic: false,
        showSecondaryDevice: false,
        recommendedFor: ['feature_highlight']
    },

    // === PANORAMIC LAYOUTS (Device spans between frames) ===

    'panoramic_right': {
        id: 'panoramic_right',
        name: 'Panoramic Right',
        description: 'Device at right edge, continues into next frame',
        category: ['all'],
        device: {
            scale: 0.82,
            x: 35,
            y: 8,
            rotation: -3
        },
        text: {
            position: 'top',
            align: 'left',
            maxWidth: '55%'
        },
        isPanoramic: true,
        panoramicOffset: 70,
        showSecondaryDevice: false,
        recommendedFor: ['storytelling', 'feature_sequence']
    },

    'panoramic_left': {
        id: 'panoramic_left',
        name: 'Panoramic Left',
        description: 'Device at left edge, continues from previous frame',
        category: ['all'],
        device: {
            scale: 0.82,
            x: -35,
            y: 8,
            rotation: 3
        },
        text: {
            position: 'top',
            align: 'right',
            maxWidth: '55%'
        },
        isPanoramic: true,
        panoramicOffset: 30,
        showSecondaryDevice: false,
        recommendedFor: ['storytelling', 'feature_sequence']
    },

    'panoramic_center_right': {
        id: 'panoramic_center_right',
        name: 'Panoramic Center Split',
        description: 'Device centered at frame edge, split between frames',
        category: ['all'],
        device: {
            scale: 0.85,
            x: 40,
            y: 5,
            rotation: 0
        },
        text: {
            position: 'top',
            align: 'left',
            maxWidth: '50%'
        },
        isPanoramic: true,
        panoramicOffset: 50,
        showSecondaryDevice: false,
        recommendedFor: ['first_slide', 'feature_highlight']
    },

    // === DUAL DEVICE LAYOUTS ===

    'duo_overlap': {
        id: 'duo_overlap',
        name: 'Duo Overlap',
        description: 'Two devices overlapping, showing multiple features',
        category: ['all'],
        device: {
            scale: 0.65,
            x: -12,
            y: 18,
            rotation: -8
        },
        secondaryDevice: {
            scale: 0.68,
            x: 12,
            y: 22,
            rotation: 6
        },
        text: {
            position: 'top',
            align: 'center',
            maxWidth: '90%'
        },
        isPanoramic: false,
        showSecondaryDevice: true,
        recommendedFor: ['feature_comparison', 'before_after']
    },

    'duo_side_by_side': {
        id: 'duo_side_by_side',
        name: 'Duo Side by Side',
        description: 'Two devices side by side for comparisons',
        category: ['all'],
        device: {
            scale: 0.55,
            x: -18,
            y: 15,
            rotation: 0
        },
        secondaryDevice: {
            scale: 0.55,
            x: 18,
            y: 15,
            rotation: 0
        },
        text: {
            position: 'top',
            align: 'center',
            maxWidth: '95%'
        },
        isPanoramic: false,
        showSecondaryDevice: true,
        recommendedFor: ['feature_comparison']
    },

    'double_phones': {
        id: 'double_phones',
        name: 'Double Phones',
        description: 'Two phones with dynamic angles',
        category: ['all'],
        device: {
            scale: 0.6,
            x: -15,
            y: 20,
            rotation: -10
        },
        secondaryDevice: {
            scale: 0.65,
            x: 15,
            y: 18,
            rotation: 8
        },
        text: {
            position: 'top',
            align: 'center',
            maxWidth: '90%'
        },
        isPanoramic: false,
        showSecondaryDevice: true,
        recommendedFor: ['feature_comparison']
    },

    // === ZOOM LAYOUTS (Show app detail) ===

    'zoom_top': {
        id: 'zoom_top',
        name: 'Zoom Top',
        description: 'Zoomed device showing top of screen',
        category: ['all'],
        device: {
            scale: 1.1,
            x: 0,
            y: 45,
            rotation: 0
        },
        text: {
            position: 'top',
            align: 'center',
            maxWidth: '90%'
        },
        isPanoramic: false,
        showSecondaryDevice: false,
        recommendedFor: ['feature_detail', 'ui_showcase']
    },

    'zoom_bottom': {
        id: 'zoom_bottom',
        name: 'Zoom Bottom',
        description: 'Zoomed device showing bottom of screen',
        category: ['all'],
        device: {
            scale: 1.1,
            x: 0,
            y: -25,
            rotation: 0
        },
        text: {
            position: 'top',
            align: 'center',
            maxWidth: '90%'
        },
        isPanoramic: false,
        showSecondaryDevice: false,
        recommendedFor: ['feature_detail', 'navigation_showcase']
    },

    // === 3D/PERSPECTIVE LAYOUTS ===

    'tilted_dynamic': {
        id: 'tilted_dynamic',
        name: 'Tilted Dynamic',
        description: '3D tilted perspective for dramatic effect',
        category: ['entertainment', 'gaming', 'fitness'],
        device: {
            scale: 0.78,
            x: 0,
            y: 12,
            rotation: -12,
            perspective: true
        },
        text: {
            position: 'top',
            align: 'center',
            maxWidth: '85%'
        },
        isPanoramic: false,
        showSecondaryDevice: false,
        recommendedFor: ['feature_highlight', 'premium_apps']
    },

    'isometric_stack': {
        id: 'isometric_stack',
        name: 'Isometric Stack',
        description: 'Stacked 3D devices showing depth',
        category: ['productivity', 'finance'],
        device: {
            scale: 0.7,
            x: 0,
            y: 15,
            rotation: -10,
            perspective: true
        },
        text: {
            position: 'top',
            align: 'center',
            maxWidth: '90%'
        },
        isPanoramic: false,
        showSecondaryDevice: false,
        recommendedFor: ['feature_stack', 'premium_apps']
    },

    // === MINIMAL/TEXT-FOCUSED LAYOUTS ===

    'minimal_type': {
        id: 'minimal_type',
        name: 'Minimal Type',
        description: 'Large text with small device - high impact',
        category: ['all'],
        device: {
            scale: 0.5,
            x: 0,
            y: 35,
            rotation: 0
        },
        text: {
            position: 'top',
            align: 'center',
            maxWidth: '95%',
            large: true
        },
        isPanoramic: false,
        showSecondaryDevice: false,
        recommendedFor: ['first_slide', 'brand_statement']
    },

    'magazine_cover': {
        id: 'magazine_cover',
        name: 'Magazine Cover',
        description: 'Magazine-style with large typography overlapping device',
        category: ['lifestyle', 'social', 'fashion'],
        device: {
            scale: 0.8,
            x: 0,
            y: 20,
            rotation: 0
        },
        text: {
            position: 'overlay',
            align: 'center',
            maxWidth: '100%',
            large: true
        },
        isPanoramic: false,
        showSecondaryDevice: false,
        recommendedFor: ['first_slide', 'lifestyle_apps']
    },

    'poster_hero': {
        id: 'poster_hero',
        name: 'Poster Hero',
        description: 'Bold poster-style layout',
        category: ['all'],
        device: {
            scale: 0.72,
            x: 0,
            y: 18,
            rotation: 0
        },
        text: {
            position: 'top',
            align: 'center',
            maxWidth: '90%',
            large: true
        },
        isPanoramic: false,
        showSecondaryDevice: false,
        recommendedFor: ['last_slide', 'cta']
    },

    // === ADDITIONAL LAYOUTS ===

    'minimal_float': {
        id: 'minimal_float',
        name: 'Minimal Float',
        description: 'Floating device with minimal design',
        category: ['all'],
        device: {
            scale: 0.7,
            x: 5,
            y: 8,
            rotation: -3
        },
        text: {
            position: 'top',
            align: 'left',
            maxWidth: '80%'
        },
        isPanoramic: false,
        showSecondaryDevice: false,
        recommendedFor: ['feature_highlight']
    },

    'bento_grid': {
        id: 'bento_grid',
        name: 'Bento Grid',
        description: 'Grid-style layout inspired by Apple',
        category: ['productivity', 'tech'],
        device: {
            scale: 0.65,
            x: 0,
            y: 20,
            rotation: 0
        },
        text: {
            position: 'top',
            align: 'center',
            maxWidth: '90%'
        },
        isPanoramic: false,
        showSecondaryDevice: false,
        recommendedFor: ['feature_list']
    },

    'off_axis_left': {
        id: 'off_axis_left',
        name: 'Off Axis Left',
        description: 'Device angled off-center to the left',
        category: ['all'],
        device: {
            scale: 0.75,
            x: -20,
            y: 12,
            rotation: 8
        },
        text: {
            position: 'top',
            align: 'right',
            maxWidth: '65%'
        },
        isPanoramic: false,
        showSecondaryDevice: false,
        recommendedFor: ['feature_highlight']
    },

    'floating_hero': {
        id: 'floating_hero',
        name: 'Floating Hero',
        description: 'Floating device with shadow emphasis',
        category: ['all'],
        device: {
            scale: 0.8,
            x: 0,
            y: 10,
            rotation: 0,
            floatingShadow: true
        },
        text: {
            position: 'top',
            align: 'center',
            maxWidth: '90%'
        },
        isPanoramic: false,
        showSecondaryDevice: false,
        recommendedFor: ['first_slide', 'premium_apps']
    },

    'card_focus': {
        id: 'card_focus',
        name: 'Card Focus',
        description: 'Device in card-style container',
        category: ['all'],
        device: {
            scale: 0.68,
            x: 0,
            y: 15,
            rotation: 0
        },
        text: {
            position: 'top',
            align: 'center',
            maxWidth: '85%'
        },
        isPanoramic: false,
        showSecondaryDevice: false,
        recommendedFor: ['feature_highlight']
    }
};

/**
 * Get layout configuration by ID
 */
function getLayoutConfig(layoutId) {
    return LAYOUT_CONFIGS[layoutId] || LAYOUT_CONFIGS['classic'];
}

/**
 * Get all available layouts
 */
function getAllLayouts() {
    return Object.values(LAYOUT_CONFIGS);
}

/**
 * Get layouts for a specific category
 */
function getLayoutsForCategory(category) {
    const lowerCategory = category.toLowerCase();
    return Object.values(LAYOUT_CONFIGS).filter(layout =>
        layout.category.includes('all') ||
        layout.category.some(cat => lowerCategory.includes(cat) || cat.includes(lowerCategory))
    );
}

/**
 * Get recommended layouts for a slide position
 */
function getLayoutsForPosition(position) {
    const recommendations = {
        first: ['first_slide', 'brand_statement', 'hero'],
        middle: ['feature_highlight', 'feature_detail', 'storytelling'],
        last: ['feature_stack', 'premium_apps', 'storytelling', 'cta']
    };

    return Object.values(LAYOUT_CONFIGS).filter(layout =>
        layout.recommendedFor.some(rec => recommendations[position]?.includes(rec))
    );
}

/**
 * Apply layout to current screenshot state
 */
function applyLayout(layoutId, currentState) {
    const layout = getLayoutConfig(layoutId);
    if (!layout) return currentState;

    const screenshot = currentState.screenshots[currentState.currentScreenshot];
    if (!screenshot) return currentState;

    // Apply device positioning
    screenshot.scale = layout.device.scale * 100;
    screenshot.x = layout.device.x;
    screenshot.y = layout.device.y;
    screenshot.rotation = layout.device.rotation;

    // Store layout info
    screenshot.layout = layoutId;
    screenshot.layoutConfig = layout;

    return currentState;
}

/**
 * Get layout thumbnail preview data
 */
function getLayoutThumbnail(layoutId) {
    const layout = getLayoutConfig(layoutId);
    return {
        id: layoutId,
        name: layout.name,
        description: layout.description,
        device: layout.device,
        showSecondary: layout.showSecondaryDevice,
        isPanoramic: layout.isPanoramic
    };
}

// Export for use in app.js
window.LayoutEngine = {
    LAYOUT_TYPES,
    LAYOUT_CONFIGS,
    getLayoutConfig,
    getAllLayouts,
    getLayoutsForCategory,
    getLayoutsForPosition,
    applyLayout,
    getLayoutThumbnail
};
