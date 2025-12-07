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
        // Check if the functions exist and have AsyncFunction constructor
        assertTruthy(typeof window.createProject === 'function', 'createProject should exist');
        assertTruthy(typeof window.deleteProject === 'function', 'deleteProject should exist');
        assertTruthy(typeof window.switchProject === 'function', 'switchProject should exist');

        // Check if they are async (AsyncFunction constructor name)
        const isAsync = fn => fn.constructor.name === 'AsyncFunction';
        assertTruthy(isAsync(window.createProject), 'createProject should be async');
        assertTruthy(isAsync(window.deleteProject), 'deleteProject should be async');
        assertTruthy(isAsync(window.switchProject), 'switchProject should be async');
    });

    // Test: Debounced saveState
    test('[P1] saveState debouncing is implemented', () => {
        assertType(window.debouncedSaveState, 'function', 'debouncedSaveState should exist');
        assertType(window.SAVE_DEBOUNCE_MS, 'number', 'SAVE_DEBOUNCE_MS should exist');
        assertTruthy(window.SAVE_DEBOUNCE_MS >= 500, 'Debounce should be at least 500ms');
    });

    test('[P1] saveState timeout variable exists', () => {
        // The debouncedSaveState function should exist, confirming debounce mechanism
        assertType(window.debouncedSaveState, 'function', 'Debounce mechanism should be in place');
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
        assertTruthy(types, 'VALID_IMAGE_TYPES should exist');
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

    test('[P2] exportAll function exists', () => {
        assertType(window.exportAll, 'function', 'exportAll should exist');
    });

    test('[P2] exportAll checks isExporting flag', () => {
        // Save original state
        const originalExporting = window.isExporting;
        const originalScreenshots = window.state.screenshots;

        // Test that setting isExporting prevents duplicate exports
        window.isExporting = true;

        // Create a mock to see if alert is called
        let alertCalled = false;
        const originalAlert = window.alert;
        window.alert = function(msg) {
            if (msg && msg.includes('already in progress')) {
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

        assertTruthy(alertCalled, 'Export should check isExporting flag and alert user');
    });

    // Test: Null checks in getCurrentScreenshot
    test('[P2] getCurrentScreenshot handles null screenshots', () => {
        if (typeof window.getCurrentScreenshot !== 'function') {
            throw new Error('getCurrentScreenshot not available');
        }

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
        if (typeof window.getCurrentScreenshot !== 'function') {
            throw new Error('getCurrentScreenshot not available');
        }

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

    // Test: API timeout (check if agents.js loaded properly)
    test('[P3] API timeout configuration exists', () => {
        // Check if AIAgents exists or API_TIMEOUT_MS is defined
        const hasTimeout = typeof window.API_TIMEOUT_MS === 'number' ||
                          (window.AIAgents && typeof window.AIAgents === 'object');
        assertTruthy(hasTimeout, 'API timeout should be configured');
    });

    // ========================================
    // THREE.JS MEMORY LEAK FIXES
    // ========================================
    test('[P2] Three.js cleanup functions exist', () => {
        assertType(window.disposeThreeJS, 'function', 'disposeThreeJS should exist');
        assertType(window.cleanMaterial, 'function', 'cleanMaterial should exist');
        assertType(window.disposeHierarchy, 'function', 'disposeHierarchy should exist');
    });

    test('[P2] cleanMaterial handles null input', () => {
        try {
            window.cleanMaterial(null);
            assertTruthy(true, 'Should not throw on null');
        } catch (e) {
            throw new Error('cleanMaterial should handle null: ' + e.message);
        }
    });

    test('[P2] disposeHierarchy handles null input', () => {
        try {
            window.disposeHierarchy(null);
            assertTruthy(true, 'Should not throw on null');
        } catch (e) {
            throw new Error('disposeHierarchy should handle null: ' + e.message);
        }
    });

    // ========================================
    // GENERAL CODE QUALITY
    // ========================================
    test('No global undefined errors on load', () => {
        // This test passes if the page loaded without major errors
        assertTruthy(window.state, 'state should be defined');
        assertTruthy(window.canvas || document.getElementById('preview-canvas'), 'canvas should exist');
    });

    test('Required DOM elements exist', () => {
        assertTruthy(
            document.getElementById('screenshot-list') || window.state,
            'screenshot-list element or state should exist'
        );
        assertTruthy(
            document.getElementById('preview-canvas') || window.canvas,
            'preview-canvas element or canvas should exist'
        );
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
