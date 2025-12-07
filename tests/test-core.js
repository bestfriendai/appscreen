/**
 * Test suite for core app.js functionality
 * Tests state management, screenshot operations, and project management
 */

(function runCoreTests() {
    const tests = [];
    let passed = 0;
    let failed = 0;

    function test(name, fn) {
        tests.push({ name, fn });
    }

    function assertEqual(actual, expected, message) {
        if (actual !== expected) {
            throw new Error(message + ': Expected ' + expected + ', got ' + actual);
        }
    }

    function assertTruthy(value, message) {
        if (!value) {
            throw new Error(message + ': Expected truthy value, got ' + value);
        }
    }

    function assertFalsy(value, message) {
        if (value) {
            throw new Error(message + ': Expected falsy value, got ' + value);
        }
    }

    function assertType(value, type, message) {
        if (typeof value !== type) {
            throw new Error(message + ': Expected type ' + type + ', got ' + typeof value);
        }
    }

    // ========================================
    // Test: State object structure
    // ========================================
    test('state object exists', () => {
        assertTruthy(window.state, 'state should exist on window');
    });

    test('state has screenshots array', () => {
        assertTruthy(window.state, 'state should exist');
        assertTruthy(Array.isArray(window.state.screenshots), 'screenshots should be array');
    });

    test('state has selectedIndex', () => {
        assertTruthy(window.state, 'state should exist');
        assertType(window.state.selectedIndex, 'number', 'selectedIndex should be number');
    });

    test('state has defaults object', () => {
        assertTruthy(window.state, 'state should exist');
        assertTruthy(window.state.defaults, 'defaults should exist');
        assertTruthy(window.state.defaults.background, 'defaults.background should exist');
        assertTruthy(window.state.defaults.screenshot, 'defaults.screenshot should exist');
        assertTruthy(window.state.defaults.text, 'defaults.text should exist');
    });

    test('state has projectLanguages array', () => {
        assertTruthy(window.state, 'state should exist');
        assertTruthy(Array.isArray(window.state.projectLanguages), 'projectLanguages should be array');
    });

    test('state has currentLanguage', () => {
        assertTruthy(window.state, 'state should exist');
        assertType(window.state.currentLanguage, 'string', 'currentLanguage should be string');
    });

    // ========================================
    // Test: getCurrentScreenshot function
    // ========================================
    test('getCurrentScreenshot is defined', () => {
        assertType(window.getCurrentScreenshot, 'function', 'getCurrentScreenshot should be function');
    });

    test('getCurrentScreenshot returns null for empty screenshots', () => {
        if (typeof window.getCurrentScreenshot !== 'function') {
            throw new Error('getCurrentScreenshot not available');
        }

        const originalScreenshots = window.state.screenshots;
        const originalIndex = window.state.selectedIndex;

        window.state.screenshots = [];
        window.state.selectedIndex = 0;

        const result = window.getCurrentScreenshot();
        assertEqual(result, null, 'Should return null');

        // Restore
        window.state.screenshots = originalScreenshots;
        window.state.selectedIndex = originalIndex;
    });

    test('getCurrentScreenshot handles out-of-bounds index', () => {
        if (typeof window.getCurrentScreenshot !== 'function') {
            throw new Error('getCurrentScreenshot not available');
        }

        const originalScreenshots = window.state.screenshots;
        const originalIndex = window.state.selectedIndex;

        // Create test screenshot
        window.state.screenshots = [{ name: 'test' }];
        window.state.selectedIndex = 999; // Out of bounds

        const result = window.getCurrentScreenshot();
        // Should clamp to valid index and return screenshot
        assertTruthy(result !== null || window.state.screenshots.length === 0, 'Should handle out-of-bounds');

        // Restore
        window.state.screenshots = originalScreenshots;
        window.state.selectedIndex = originalIndex;
    });

    // ========================================
    // Test: getBackground function
    // ========================================
    test('getBackground is defined', () => {
        assertType(window.getBackground, 'function', 'getBackground should be function');
    });

    test('getBackground returns defaults when no screenshot', () => {
        if (typeof window.getBackground !== 'function') {
            throw new Error('getBackground not available');
        }

        const originalScreenshots = window.state.screenshots;
        window.state.screenshots = [];

        const result = window.getBackground();
        assertTruthy(result, 'Should return default background');
        assertTruthy(result.type, 'Background should have type');

        window.state.screenshots = originalScreenshots;
    });

    // ========================================
    // Test: getScreenshotSettings function
    // ========================================
    test('getScreenshotSettings is defined', () => {
        assertType(window.getScreenshotSettings, 'function', 'getScreenshotSettings should be function');
    });

    test('getScreenshotSettings returns object with required properties', () => {
        if (typeof window.getScreenshotSettings !== 'function') {
            throw new Error('getScreenshotSettings not available');
        }

        const result = window.getScreenshotSettings();
        assertTruthy(result, 'Should return settings');
        assertType(result.scale, 'number', 'Should have scale');
        assertType(result.x, 'number', 'Should have x');
        assertType(result.y, 'number', 'Should have y');
    });

    // ========================================
    // Test: getTextSettings function
    // ========================================
    test('getTextSettings is defined', () => {
        assertType(window.getTextSettings, 'function', 'getTextSettings should be function');
    });

    test('getTextSettings returns object with required properties', () => {
        if (typeof window.getTextSettings !== 'function') {
            throw new Error('getTextSettings not available');
        }

        const result = window.getTextSettings();
        assertTruthy(result, 'Should return settings');
        assertTruthy(result.headlines !== undefined, 'Should have headlines');
    });

    // ========================================
    // Test: formatValue function
    // ========================================
    test('formatValue is defined', () => {
        assertType(window.formatValue, 'function', 'formatValue should be function');
    });

    test('formatValue formats integers correctly', () => {
        if (typeof window.formatValue !== 'function') {
            throw new Error('formatValue not available');
        }

        assertEqual(window.formatValue(5), '5', 'Integer should not have decimal');
        assertEqual(window.formatValue(100), '100', 'Integer should not have decimal');
    });

    test('formatValue rounds to 1 decimal place', () => {
        if (typeof window.formatValue !== 'function') {
            throw new Error('formatValue not available');
        }

        assertEqual(window.formatValue(5.55), '5.6', 'Should round to 1 decimal');
        assertEqual(window.formatValue(5.54), '5.5', 'Should round to 1 decimal');
    });

    // ========================================
    // Test: Canvas dimensions
    // ========================================
    test('getCanvasDimensions is defined', () => {
        assertType(window.getCanvasDimensions, 'function', 'getCanvasDimensions should be function');
    });

    test('getCanvasDimensions returns valid dimensions', () => {
        if (typeof window.getCanvasDimensions !== 'function') {
            throw new Error('getCanvasDimensions not available');
        }

        const dims = window.getCanvasDimensions();
        assertTruthy(dims, 'Should return dimensions');
        assertTruthy(dims.width > 0, 'Width should be positive');
        assertTruthy(dims.height > 0, 'Height should be positive');
    });

    // ========================================
    // Test: updateCanvas function
    // ========================================
    test('updateCanvas is defined', () => {
        assertType(window.updateCanvas, 'function', 'updateCanvas should be function');
    });

    test('updateCanvas runs without error', () => {
        if (typeof window.updateCanvas !== 'function') {
            throw new Error('updateCanvas not available');
        }

        try {
            window.updateCanvas();
            assertTruthy(true, 'updateCanvas ran successfully');
        } catch (e) {
            throw new Error('updateCanvas threw: ' + e.message);
        }
    });

    // ========================================
    // Test: syncUIWithState function
    // ========================================
    test('syncUIWithState is defined', () => {
        assertType(window.syncUIWithState, 'function', 'syncUIWithState should be function');
    });

    // ========================================
    // Test: File validation constants
    // ========================================
    test('VALID_IMAGE_TYPES is defined', () => {
        assertTruthy(Array.isArray(window.VALID_IMAGE_TYPES), 'VALID_IMAGE_TYPES should be array');
        assertTruthy(window.VALID_IMAGE_TYPES.includes('image/png'), 'Should include PNG');
        assertTruthy(window.VALID_IMAGE_TYPES.includes('image/jpeg'), 'Should include JPEG');
    });

    test('MAX_FILE_SIZE is defined', () => {
        assertType(window.MAX_FILE_SIZE, 'number', 'MAX_FILE_SIZE should be number');
        assertEqual(window.MAX_FILE_SIZE, 20 * 1024 * 1024, 'Should be 20MB');
    });

    // ========================================
    // Test: Export flag
    // ========================================
    test('isExporting flag exists', () => {
        assertTruthy(typeof window.isExporting !== 'undefined', 'isExporting should exist');
    });

    // ========================================
    // Test: Debounced save
    // ========================================
    test('debouncedSaveState is defined', () => {
        assertType(window.debouncedSaveState, 'function', 'debouncedSaveState should be function');
    });

    test('SAVE_DEBOUNCE_MS is defined', () => {
        assertType(window.SAVE_DEBOUNCE_MS, 'number', 'SAVE_DEBOUNCE_MS should be number');
        assertTruthy(window.SAVE_DEBOUNCE_MS >= 500, 'Should be at least 500ms');
    });

    // ========================================
    // Run all tests
    // ========================================
    console.log('\n=== Core App Test Suite ===\n');

    tests.forEach(function(t) {
        try {
            t.fn();
            passed++;
            console.log('✓ ' + t.name);
        } catch (error) {
            failed++;
            console.error('✗ ' + t.name);
            console.error('  ' + error.message);
        }
    });

    console.log('\n=== Results: ' + passed + ' passed, ' + failed + ' failed ===\n');

    return { passed: passed, failed: failed };
})();
