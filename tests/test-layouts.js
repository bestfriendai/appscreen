/**
 * Test suite for Layout Engine functionality
 * Run in browser console after loading the app
 */

(function runLayoutTests() {
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

    // ========================================
    // Test: LayoutEngine availability
    // ========================================
    test('LayoutEngine is defined', () => {
        if (typeof window.LayoutEngine === 'undefined') {
            throw new Error('LayoutEngine not defined on window');
        }
    });

    test('LayoutEngine has required methods', () => {
        const required = ['getLayoutConfig', 'getAllLayouts', 'getLayoutsForPosition', 'applyLayout'];
        required.forEach(method => {
            if (typeof window.LayoutEngine?.[method] !== 'function') {
                throw new Error(`LayoutEngine missing method: ${method}`);
            }
        });
    });

    // ========================================
    // Test: getLayoutConfig
    // ========================================
    test('getLayoutConfig - classic layout', () => {
        const config = window.LayoutEngine.getLayoutConfig('classic');
        assertTruthy(config, 'Config returned');
        assertTruthy(config.device, 'Has device settings');
        assertTruthy(typeof config.device.scale === 'number', 'Scale is number');
        assertTruthy(typeof config.device.x === 'number', 'X is number');
        assertTruthy(typeof config.device.y === 'number', 'Y is number');
    });

    test('getLayoutConfig - hero_large layout', () => {
        const config = window.LayoutEngine.getLayoutConfig('hero_large');
        assertTruthy(config, 'Config returned');
        assertInRange(config.device.scale, 0.5, 1.5, 'Scale in valid range');
    });

    test('getLayoutConfig - unknown layout returns null', () => {
        const config = window.LayoutEngine.getLayoutConfig('nonexistent_layout_xyz');
        assertEqual(config, null, 'Should return null for unknown');
    });

    // ========================================
    // Test: getAllLayouts
    // ========================================
    test('getAllLayouts returns array', () => {
        const layouts = window.LayoutEngine.getAllLayouts();
        assertTruthy(Array.isArray(layouts), 'Returns array');
        assertTruthy(layouts.length > 0, 'Has layouts');
    });

    test('getAllLayouts - layouts have required fields', () => {
        const layouts = window.LayoutEngine.getAllLayouts();
        layouts.forEach(layout => {
            if (!layout.id) throw new Error(`Layout missing id`);
            if (!layout.device) throw new Error(`Layout ${layout.id} missing device`);
        });
    });

    // ========================================
    // Test: getLayoutsForPosition
    // ========================================
    test('getLayoutsForPosition - first position', () => {
        const layouts = window.LayoutEngine.getLayoutsForPosition('first');
        assertTruthy(Array.isArray(layouts), 'Returns array');
    });

    test('getLayoutsForPosition - middle position', () => {
        const layouts = window.LayoutEngine.getLayoutsForPosition('middle');
        assertTruthy(Array.isArray(layouts), 'Returns array');
    });

    test('getLayoutsForPosition - last position', () => {
        const layouts = window.LayoutEngine.getLayoutsForPosition('last');
        assertTruthy(Array.isArray(layouts), 'Returns array');
    });

    // ========================================
    // Test: applyLayout coordinate conversion
    // ========================================
    test('applyLayout converts coordinates correctly', () => {
        // Create mock state
        const mockState = {
            selectedIndex: 0,
            screenshots: [{ screenshot: {} }]
        };

        const result = window.LayoutEngine.applyLayout('offset_right', mockState);

        // The applyLayout function should convert layout offset coordinates
        // to screenshot percentage coordinates
        const ss = result.screenshots[0].screenshot;

        // offset_right has x: 12 in layout, should become 62 (50 + 12) in screenshot
        assertTruthy(ss.x > 50, `X should be > 50 for right offset, got ${ss.x}`);

        // Y should be in valid range (50 + offset)
        assertInRange(ss.y, 50, 100, 'Y position');

        // Scale should be percentage (not decimal)
        assertInRange(ss.scale, 50, 150, 'Scale as percentage');
    });

    test('applyLayout initializes screenshot object if missing', () => {
        const mockState = {
            selectedIndex: 0,
            screenshots: [{}] // No screenshot property
        };

        const result = window.LayoutEngine.applyLayout('classic', mockState);
        assertTruthy(result.screenshots[0].screenshot, 'Screenshot object created');
    });

    // ========================================
    // Test: Layout variety
    // ========================================
    test('Different layouts produce different positions', () => {
        const classic = window.LayoutEngine.getLayoutConfig('classic');
        const offsetRight = window.LayoutEngine.getLayoutConfig('offset_right');
        const offsetLeft = window.LayoutEngine.getLayoutConfig('offset_left');

        // Classic should be centered (x close to 0)
        assertInRange(classic.device.x, -5, 5, 'Classic X near center');

        // Offset right should have positive X
        assertTruthy(offsetRight.device.x > 5, 'Offset right has positive X');

        // Offset left should have negative X
        assertTruthy(offsetLeft.device.x < -5, 'Offset left has negative X');
    });

    // ========================================
    // Test: Position conversion utility
    // ========================================
    test('Utils.convertLayoutToScreenshotPosition works', () => {
        if (!window.Utils?.convertLayoutToScreenshotPosition) {
            console.warn('Utils.convertLayoutToScreenshotPosition not available');
            return;
        }

        const layout = { device: { scale: 0.65, x: 0, y: 20, rotation: 0 } };
        const pos = window.Utils.convertLayoutToScreenshotPosition(layout);

        assertEqual(pos.x, 50, 'Centered X');
        assertEqual(pos.y, 70, 'Y at 70% (50 + 20)');
        assertEqual(pos.scale, 65, 'Scale as percentage');
    });

    test('Utils.convertLayoutToScreenshotPosition handles offsets', () => {
        if (!window.Utils?.convertLayoutToScreenshotPosition) return;

        const layout = { device: { scale: 0.68, x: 12, y: 20, rotation: -5 } };
        const pos = window.Utils.convertLayoutToScreenshotPosition(layout);

        assertEqual(pos.x, 62, 'X with +12 offset');
        assertEqual(pos.rotation, -5, 'Rotation preserved');
    });

    // ========================================
    // Test: Layout categories
    // ========================================
    test('Layouts have descriptive categories', () => {
        const layouts = window.LayoutEngine.getAllLayouts();
        const categories = new Set(layouts.map(l => l.category).filter(Boolean));

        // Should have some categorization
        assertTruthy(categories.size > 0 || layouts.every(l => l.recommendedFor),
            'Layouts should have categories or recommendedFor');
    });

    // ========================================
    // Run all tests
    // ========================================
    console.log('\\n=== Layout Engine Test Suite ===\\n');

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
