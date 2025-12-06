/**
 * Test suite for utils.js
 * Run in browser console or with Node.js (after loading utils.js)
 */

(function runTests() {
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

    function assertDeepEqual(actual, expected, message) {
        if (JSON.stringify(actual) !== JSON.stringify(expected)) {
            throw new Error(`${message}: Expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
        }
    }

    function assertTruthy(value, message) {
        if (!value) {
            throw new Error(`${message}: Expected truthy value, got ${value}`);
        }
    }

    // ========================================
    // Test: parseDataUrl
    // ========================================
    test('parseDataUrl - valid data URL', () => {
        const result = window.Utils.parseDataUrl('data:image/png;base64,iVBORw0KGgo=');
        assertEqual(result.mimeType, 'image/png', 'MIME type');
        assertEqual(result.base64, 'iVBORw0KGgo=', 'Base64 data');
    });

    test('parseDataUrl - invalid URL returns null', () => {
        const result = window.Utils.parseDataUrl('not-a-data-url');
        assertEqual(result, null, 'Should return null');
    });

    test('parseDataUrl - null input returns null', () => {
        const result = window.Utils.parseDataUrl(null);
        assertEqual(result, null, 'Should return null');
    });

    // ========================================
    // Test: parseJSONFromAIResponse
    // ========================================
    test('parseJSONFromAIResponse - clean JSON', () => {
        const result = window.Utils.parseJSONFromAIResponse('{"name": "test"}');
        assertDeepEqual(result, { name: 'test' }, 'Parsed JSON');
    });

    test('parseJSONFromAIResponse - markdown wrapped', () => {
        const result = window.Utils.parseJSONFromAIResponse('```json\n{"name": "test"}\n```');
        assertDeepEqual(result, { name: 'test' }, 'Parsed JSON from markdown');
    });

    test('parseJSONFromAIResponse - with surrounding text', () => {
        const result = window.Utils.parseJSONFromAIResponse('Here is the result: {"name": "test"} end');
        assertDeepEqual(result, { name: 'test' }, 'Extracted JSON from text');
    });

    // ========================================
    // Test: capitalizeFirst
    // ========================================
    test('capitalizeFirst - lowercase string', () => {
        assertEqual(window.Utils.capitalizeFirst('hello'), 'Hello', 'Capitalized');
    });

    test('capitalizeFirst - already capitalized', () => {
        assertEqual(window.Utils.capitalizeFirst('Hello'), 'Hello', 'Unchanged');
    });

    test('capitalizeFirst - empty string', () => {
        assertEqual(window.Utils.capitalizeFirst(''), '', 'Empty string');
    });

    // ========================================
    // Test: adjustColorBrightness
    // ========================================
    test('adjustColorBrightness - lighten', () => {
        const result = window.Utils.adjustColorBrightness('#000000', 50);
        // Should be lighter
        assertTruthy(result !== '#000000', 'Color changed');
    });

    test('adjustColorBrightness - darken', () => {
        const result = window.Utils.adjustColorBrightness('#ffffff', -50);
        // Should be darker
        assertTruthy(result !== '#ffffff', 'Color changed');
    });

    test('adjustColorBrightness - null input', () => {
        const result = window.Utils.adjustColorBrightness(null, 50);
        assertEqual(result, '#000000', 'Default black');
    });

    // ========================================
    // Test: hexToRgba
    // ========================================
    test('hexToRgba - basic conversion', () => {
        const result = window.Utils.hexToRgba('#ff0000', 1);
        assertEqual(result, 'rgba(255, 0, 0, 1)', 'Red color');
    });

    test('hexToRgba - with alpha', () => {
        const result = window.Utils.hexToRgba('#00ff00', 0.5);
        assertEqual(result, 'rgba(0, 255, 0, 0.5)', 'Green with alpha');
    });

    // ========================================
    // Test: convertLayoutToScreenshotPosition
    // ========================================
    test('convertLayoutToScreenshotPosition - basic conversion', () => {
        const layoutConfig = {
            device: { scale: 0.65, x: 10, y: 20, rotation: -5 }
        };
        const result = window.Utils.convertLayoutToScreenshotPosition(layoutConfig);
        assertEqual(result.scale, 65, 'Scale');
        assertEqual(result.x, 60, 'X position (50 + 10)');
        assertEqual(result.y, 70, 'Y position (50 + 20)');
        assertEqual(result.rotation, -5, 'Rotation');
    });

    test('convertLayoutToScreenshotPosition - null input', () => {
        const result = window.Utils.convertLayoutToScreenshotPosition(null);
        assertEqual(result.scale, 65, 'Default scale');
        assertEqual(result.x, 50, 'Default x');
        assertEqual(result.y, 70, 'Default y');
    });

    // ========================================
    // Test: calculateOptimalDeviceY
    // ========================================
    test('calculateOptimalDeviceY - basic calculation', () => {
        const dims = { width: 1290, height: 2796 };
        const text = {
            stackedText: true,
            headlines: { en: 'Hello World' },
            subheadlineEnabled: false,
            headlineSize: 72,
            lineHeight: 95,
            offsetY: 8
        };
        const result = window.Utils.calculateOptimalDeviceY(dims, text, 'en');
        assertTruthy(result >= 65 && result <= 85, `Y position in range: ${result}`);
    });

    test('calculateOptimalDeviceY - null input', () => {
        const result = window.Utils.calculateOptimalDeviceY(null, null, 'en');
        assertEqual(result, 72, 'Default value');
    });

    // ========================================
    // Test: clamp
    // ========================================
    test('clamp - value in range', () => {
        assertEqual(window.Utils.clamp(50, 0, 100), 50, 'In range');
    });

    test('clamp - below min', () => {
        assertEqual(window.Utils.clamp(-10, 0, 100), 0, 'Clamped to min');
    });

    test('clamp - above max', () => {
        assertEqual(window.Utils.clamp(150, 0, 100), 100, 'Clamped to max');
    });

    // ========================================
    // Test: deepClone
    // ========================================
    test('deepClone - object cloned', () => {
        const original = { a: 1, b: { c: 2 } };
        const cloned = window.Utils.deepClone(original);
        cloned.b.c = 999;
        assertEqual(original.b.c, 2, 'Original unchanged');
    });

    // ========================================
    // Run all tests
    // ========================================
    console.log('\\n=== Utils.js Test Suite ===\\n');

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
