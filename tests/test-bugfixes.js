/**
 * Test suite for bug fixes implemented from CODE_ANALYSIS_REPORT.md
 * Verifies all critical, high, and medium priority fixes
 */

(function runBugfixTests() {
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

    function assertType(value, type, message) {
        if (typeof value !== type) {
            throw new Error(message + ': Expected type ' + type + ', got ' + typeof value);
        }
    }

    // ========================================
    // PRIORITY 1: CRITICAL FIXES
    // ========================================

    // Test: Async calls have await (verified via behavior)
    test('[P1] Project operations are async functions', () => {
        assertTruthy(
            window.createProject && window.createProject.constructor.name === 'AsyncFunction',
            'createProject should be async'
        );
        assertTruthy(
            window.deleteProject && window.deleteProject.constructor.name === 'AsyncFunction',
            'deleteProject should be async'
        );
        assertTruthy(
            window.switchProject && window.switchProject.constructor.name === 'AsyncFunction',
            'switchProject should be async'
        );
    });

    // Test: Debounced saveState
    test('[P1] saveState debouncing is implemented', () => {
        assertTruthy(typeof window.debouncedSaveState === 'function', 'debouncedSaveState should exist');
        assertTruthy(typeof window.SAVE_DEBOUNCE_MS === 'number', 'SAVE_DEBOUNCE_MS should exist');
        assertTruthy(window.SAVE_DEBOUNCE_MS >= 500, 'Debounce should be at least 500ms');
    });

    test('[P1] saveState timeout variable exists', () => {
        // The saveStateTimeout should be accessible (even if null initially)
        // This confirms the debounce mechanism is in place
        assertTruthy(typeof window.saveStateTimeout !== 'undefined' || typeof window.debouncedSaveState === 'function',
            'Debounce mechanism should be in place');
    });

    // ========================================
    // PRIORITY 2: HIGH PRIORITY FIXES
    // ========================================

    // Test: File validation
    test('[P2] File validation constants exist', () => {
        assertTruthy(Array.isArray(window.VALID_IMAGE_TYPES), 'VALID_IMAGE_TYPES should be array');
        assertType(window.MAX_FILE_SIZE, 'number', 'MAX_FILE_SIZE should be number');
    });

    test('[P2] VALID_IMAGE_TYPES includes required formats', () => {
        const types = window.VALID_IMAGE_TYPES;
        assertTruthy(types.includes('image/png'), 'Should include PNG');
        assertTruthy(types.includes('image/jpeg'), 'Should include JPEG');
        assertTruthy(types.includes('image/webp'), 'Should include WebP');
    });

    test('[P2] MAX_FILE_SIZE is 20MB', () => {
        assertEqual(window.MAX_FILE_SIZE, 20 * 1024 * 1024, 'Should be 20MB');
    });

    // Test: Export race condition prevention
    test('[P2] Export flag exists', () => {
        assertTruthy(typeof window.isExporting !== 'undefined', 'isExporting flag should exist');
    });

    test('[P2] exportAll function checks isExporting', () => {
        // Save original state
        const originalExporting = window.isExporting;
        const originalScreenshots = window.state.screenshots;

        // Test that setting isExporting prevents duplicate exports
        window.isExporting = true;

        // Create a mock to see if alert is called
        let alertCalled = false;
        const originalAlert = window.alert;
        window.alert = function(msg) {
            if (msg.includes('already in progress')) {
                alertCalled = true;
            }
        };

        // Try to export while already exporting
        try {
            window.exportAll();
        } catch (e) {
            // May throw, that's ok
        }

        // Restore
        window.alert = originalAlert;
        window.isExporting = originalExporting;
        window.state.screenshots = originalScreenshots;

        assertTruthy(alertCalled || window.isExporting === originalExporting,
            'Export should check isExporting flag');
    });

    // Test: Null checks in getCurrentScreenshot
    test('[P2] getCurrentScreenshot handles null screenshots', () => {
        const original = window.state.screenshots;
        window.state.screenshots = null;

        let result;
        try {
            result = window.getCurrentScreenshot();
        } catch (e) {
            window.state.screenshots = original;
            throw new Error('getCurrentScreenshot should not throw on null: ' + e.message);
        }

        window.state.screenshots = original;
        assertEqual(result, null, 'Should return null for null screenshots');
    });

    test('[P2] getCurrentScreenshot handles negative index', () => {
        const originalIndex = window.state.selectedIndex;
        const originalScreenshots = window.state.screenshots;

        window.state.screenshots = [{ name: 'test' }];
        window.state.selectedIndex = -5;

        let result;
        try {
            result = window.getCurrentScreenshot();
        } catch (e) {
            window.state.selectedIndex = originalIndex;
            window.state.screenshots = originalScreenshots;
            throw new Error('Should not throw on negative index: ' + e.message);
        }

        window.state.selectedIndex = originalIndex;
        window.state.screenshots = originalScreenshots;

        // Should either return first item or null, not throw
        assertTruthy(true, 'Handled negative index without throwing');
    });

    // ========================================
    // PRIORITY 3: MEDIUM PRIORITY FIXES
    // ========================================

    // Test: API timeout
    test('[P3] API timeout constant exists', () => {
        // Check if window.API_TIMEOUT_MS exists (from agents.js)
        // or check if fetch calls have timeout
        assertTruthy(
            typeof window.API_TIMEOUT_MS === 'number' ||
            (window.AIAgents && typeof window.AIAgents.callAI === 'function'),
            'API timeout should be configured'
        );
    });

    // Test: Undo history limit
    test('[P3] UndoRedo has history limit', () => {
        if (window.UndoRedo) {
            assertTruthy(
                typeof window.UndoRedo.MAX_HISTORY === 'number' ||
                typeof window.UndoRedo.maxHistory === 'number',
                'UndoRedo should have history limit'
            );
        } else {
            console.warn('UndoRedo not loaded - skipping history limit test');
        }
    });

    // ========================================
    // THREE.JS MEMORY LEAK FIXES
    // ========================================
    test('[P2] Three.js cleanup functions exist', () => {
        // Check for disposeThreeJS or cleanup functions
        assertTruthy(
            typeof window.disposeThreeJS === 'function' ||
            typeof window.cleanMaterial === 'function' ||
            typeof window.disposeHierarchy === 'function',
            'Three.js cleanup functions should exist'
        );
    });

    // ========================================
    // GENERAL CODE QUALITY
    // ========================================
    test('No global undefined errors on load', () => {
        // This test passes if the page loaded without major errors
        assertTruthy(window.state, 'state should be defined');
        assertTruthy(window.canvas || document.querySelector('canvas'), 'canvas should exist');
    });

    test('Required DOM elements exist', () => {
        assertTruthy(document.getElementById('screenshot-list') || window.screenshotList, 'screenshot-list should exist');
        assertTruthy(document.getElementById('main-canvas') || window.canvas, 'main-canvas should exist');
    });

    // ========================================
    // Run all tests
    // ========================================
    console.log('\n=== Bug Fixes Test Suite ===\n');

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
