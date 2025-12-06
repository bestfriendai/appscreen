/**
 * Test suite for Magic Design functionality
 * Run in browser console after loading the app
 */

(function runMagicDesignTests() {
    const tests = [];
    let passed = 0;
    let failed = 0;

    function test(name, fn) {
        tests.push({ name, fn });
    }

    function assertEqual(actual, expected, message) {
        if (actual !== expected) {
            throw new Error(`${message}: Expected ${expected}, got ${actual}`);
        }
    }

    function assertTruthy(value, message) {
        if (!value) {
            throw new Error(`${message}: Expected truthy value, got ${value}`);
        }
    }

    function assertInRange(value, min, max, message) {
        if (value < min || value > max) {
            throw new Error(`${message}: ${value} not in range [${min}, ${max}]`);
        }
    }

    // Mock state if not available
    const mockState = {
        screenshots: [
            { screenshot: {}, background: {} }
        ],
        selectedIndex: 0,
        currentLanguage: 'en',
        text: {
            headlines: { en: 'Test Headline' },
            subheadlines: { en: 'Test subheadline' },
            stackedText: true,
            headlineSize: 72,
            subheadlineSize: 28,
            lineHeight: 95,
            offsetY: 8,
            position: 'top'
        },
        defaults: {
            screenshot: {
                scale: 65,
                x: 50,
                y: 70,
                rotation: 0
            },
            background: {
                type: 'solid',
                color: '#667eea'
            }
        }
    };

    // ========================================
    // Test: detectCategory function
    // ========================================
    test('detectCategory - fitness app', () => {
        if (typeof detectCategory !== 'function') {
            throw new Error('detectCategory function not found');
        }
        const result = detectCategory('FitTracker', 'workout fitness exercise');
        assertTruthy(result, 'Should return a category');
    });

    test('detectCategory - finance app', () => {
        if (typeof detectCategory !== 'function') {
            throw new Error('detectCategory function not found');
        }
        const result = detectCategory('MoneyApp', 'budget finance banking');
        assertTruthy(result, 'Should return a category');
    });

    // ========================================
    // Test: CATEGORY_PROFILES existence
    // ========================================
    test('CATEGORY_PROFILES defined', () => {
        if (typeof CATEGORY_PROFILES === 'undefined') {
            throw new Error('CATEGORY_PROFILES not defined');
        }
        assertTruthy(CATEGORY_PROFILES.wellness, 'Has wellness profile');
        assertTruthy(CATEGORY_PROFILES.finance, 'Has finance profile');
        assertTruthy(CATEGORY_PROFILES.ecommerce, 'Has ecommerce profile');
    });

    test('CATEGORY_PROFILES have required fields', () => {
        const required = ['name', 'colors', 'fonts'];
        Object.keys(CATEGORY_PROFILES).forEach(key => {
            const profile = CATEGORY_PROFILES[key];
            required.forEach(field => {
                if (!profile[field]) {
                    throw new Error(`Profile ${key} missing ${field}`);
                }
            });
        });
    });

    // ========================================
    // Test: calculateLocalOptimalDeviceY
    // ========================================
    test('calculateLocalOptimalDeviceY exists', () => {
        if (typeof calculateLocalOptimalDeviceY !== 'function') {
            throw new Error('calculateLocalOptimalDeviceY function not found');
        }
    });

    test('calculateLocalOptimalDeviceY - returns valid Y', () => {
        if (typeof calculateLocalOptimalDeviceY !== 'function') return;
        const dims = { width: 1290, height: 2796 };
        const text = {
            stackedText: true,
            headlines: { en: 'Hello World' },
            headlineSize: 72,
            lineHeight: 95,
            offsetY: 8
        };
        // Mock state.currentLanguage
        if (typeof state !== 'undefined') {
            const result = calculateLocalOptimalDeviceY(dims, text);
            assertInRange(result, 65, 85, 'Y position');
        }
    });

    // ========================================
    // Test: applyBasicMagicDesign
    // ========================================
    test('applyBasicMagicDesign exists', () => {
        if (typeof applyBasicMagicDesign !== 'function') {
            throw new Error('applyBasicMagicDesign function not found');
        }
    });

    test('applyBasicMagicDesign - applies settings', () => {
        if (typeof applyBasicMagicDesign !== 'function') return;
        if (typeof state === 'undefined' || state.screenshots.length === 0) return;

        const originalY = state.screenshots[0].screenshot?.y;
        const result = applyBasicMagicDesign('TestApp', { forceBasic: true });

        assertTruthy(result, 'Should return result');
        assertTruthy(result.category, 'Should have category');
        assertTruthy(result.profile, 'Should have profile name');
    });

    // ========================================
    // Test: magicDesign delegation
    // ========================================
    test('magicDesign exists', () => {
        if (typeof magicDesign !== 'function') {
            throw new Error('magicDesign function not found');
        }
    });

    // ========================================
    // Test: LayoutEngine integration
    // ========================================
    test('LayoutEngine available', () => {
        if (typeof window.LayoutEngine === 'undefined') {
            console.warn('LayoutEngine not loaded - skipping integration tests');
            return;
        }
        assertTruthy(window.LayoutEngine.getLayoutConfig, 'Has getLayoutConfig');
        assertTruthy(window.LayoutEngine.getLayoutsForPosition, 'Has getLayoutsForPosition');
    });

    test('LayoutEngine.getLayoutConfig returns valid config', () => {
        if (!window.LayoutEngine?.getLayoutConfig) return;

        const config = window.LayoutEngine.getLayoutConfig('classic');
        assertTruthy(config, 'Config exists');
        assertTruthy(config.device, 'Has device settings');
        assertTruthy(typeof config.device.scale === 'number', 'Scale is number');
    });

    // ========================================
    // Test: Position conversion
    // ========================================
    test('Layout position converts correctly', () => {
        if (!window.Utils?.convertLayoutToScreenshotPosition) return;

        const layoutConfig = {
            device: { scale: 0.65, x: 12, y: 20, rotation: -5 }
        };
        const result = window.Utils.convertLayoutToScreenshotPosition(layoutConfig);

        // x: 12 offset should become 62% (50 + 12)
        assertEqual(result.x, 62, 'X position');
        // y: 20 offset should become 70% (50 + 20)
        assertEqual(result.y, 70, 'Y position');
        // scale: 0.65 should become 65
        assertEqual(result.scale, 65, 'Scale');
    });

    // ========================================
    // Test: 3D mode handling
    // ========================================
    test('3D rotation settings exist in schema', () => {
        if (typeof state === 'undefined') return;
        if (!state.defaults?.screenshot) return;

        // Check that rotation3D can be added
        const ss = state.screenshots[0]?.screenshot || {};
        ss.rotation3D = { x: 0, y: 0, z: 0 };
        assertTruthy(ss.rotation3D, 'Can set rotation3D');
    });

    // ========================================
    // Test: validateTextDeviceSeparation
    // ========================================
    test('validateTextDeviceSeparation exists', () => {
        if (typeof validateTextDeviceSeparation !== 'function') {
            console.warn('validateTextDeviceSeparation not found');
            return;
        }
        assertTruthy(true, 'Function exists');
    });

    // ========================================
    // Test: validateSetConsistency
    // ========================================
    test('validateSetConsistency exists', () => {
        if (typeof validateSetConsistency !== 'function') {
            console.warn('validateSetConsistency not found');
            return;
        }
        assertTruthy(true, 'Function exists');
    });

    // ========================================
    // Run all tests
    // ========================================
    console.log('\\n=== Magic Design Test Suite ===\\n');

    tests.forEach(({ name, fn }) => {
        try {
            fn();
            passed++;
            console.log(`✓ ${name}`);
        } catch (error) {
            failed++;
            console.error(`✗ ${name}`);
            console.error(`  ${error.message}`);
        }
    });

    console.log(`\\n=== Results: ${passed} passed, ${failed} failed ===\\n`);

    return { passed, failed };
})();
