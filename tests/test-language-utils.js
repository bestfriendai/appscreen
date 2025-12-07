/**
 * Test suite for language-utils.js functionality
 * Tests language detection, localized images, and translation management
 */

(function runLanguageUtilsTests() {
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
    // Test: Language detection function
    // ========================================
    test('detectLanguageFromFilename function exists', () => {
        assertType(window.detectLanguageFromFilename, 'function', 'detectLanguageFromFilename should be function');
    });

    test('detectLanguageFromFilename detects _en suffix', () => {
        if (typeof window.detectLanguageFromFilename !== 'function') {
            throw new Error('detectLanguageFromFilename not available');
        }
        const result = window.detectLanguageFromFilename('screenshot_en.png');
        assertEqual(result, 'en', 'Should detect English');
    });

    test('detectLanguageFromFilename detects _de suffix', () => {
        if (typeof window.detectLanguageFromFilename !== 'function') {
            throw new Error('detectLanguageFromFilename not available');
        }
        const result = window.detectLanguageFromFilename('screenshot_de.png');
        assertEqual(result, 'de', 'Should detect German');
    });

    test('detectLanguageFromFilename detects -fr suffix', () => {
        if (typeof window.detectLanguageFromFilename !== 'function') {
            throw new Error('detectLanguageFromFilename not available');
        }
        const result = window.detectLanguageFromFilename('screenshot-fr.png');
        assertEqual(result, 'fr', 'Should detect French');
    });

    test('detectLanguageFromFilename detects _pt-br suffix', () => {
        if (typeof window.detectLanguageFromFilename !== 'function') {
            throw new Error('detectLanguageFromFilename not available');
        }
        const result = window.detectLanguageFromFilename('screenshot_pt-br.png');
        assertEqual(result, 'pt-br', 'Should detect Brazilian Portuguese');
    });

    test('detectLanguageFromFilename returns en for no suffix', () => {
        if (typeof window.detectLanguageFromFilename !== 'function') {
            throw new Error('detectLanguageFromFilename not available');
        }
        const result = window.detectLanguageFromFilename('screenshot.png');
        assertEqual(result, 'en', 'Should default to English');
    });

    test('detectLanguageFromFilename handles null', () => {
        if (typeof window.detectLanguageFromFilename !== 'function') {
            throw new Error('detectLanguageFromFilename not available');
        }
        const result = window.detectLanguageFromFilename(null);
        assertEqual(result, 'en', 'Should default to English for null');
    });

    test('detectLanguageFromFilename handles empty string', () => {
        if (typeof window.detectLanguageFromFilename !== 'function') {
            throw new Error('detectLanguageFromFilename not available');
        }
        const result = window.detectLanguageFromFilename('');
        assertEqual(result, 'en', 'Should default to English for empty');
    });

    // ========================================
    // Test: Base filename extraction
    // ========================================
    test('getBaseFilename function exists', () => {
        assertType(window.getBaseFilename, 'function', 'getBaseFilename should be function');
    });

    test('getBaseFilename strips language suffix', () => {
        if (typeof window.getBaseFilename !== 'function') {
            throw new Error('getBaseFilename not available');
        }
        const result = window.getBaseFilename('screenshot_en.png');
        assertEqual(result, 'screenshot', 'Should strip _en suffix');
    });

    test('getBaseFilename strips extension', () => {
        if (typeof window.getBaseFilename !== 'function') {
            throw new Error('getBaseFilename not available');
        }
        const result = window.getBaseFilename('screenshot.png');
        assertEqual(result, 'screenshot', 'Should strip extension');
    });

    test('getBaseFilename handles multiple dots', () => {
        if (typeof window.getBaseFilename !== 'function') {
            throw new Error('getBaseFilename not available');
        }
        const result = window.getBaseFilename('my.screenshot.file_de.png');
        assertEqual(result, 'my.screenshot.file', 'Should handle multiple dots');
    });

    // ========================================
    // Test: Screenshot image retrieval
    // ========================================
    test('getScreenshotImage function exists', () => {
        assertType(window.getScreenshotImage, 'function', 'getScreenshotImage should be function');
    });

    test('getScreenshotImage handles null screenshot', () => {
        if (typeof window.getScreenshotImage !== 'function') {
            throw new Error('getScreenshotImage not available');
        }
        const result = window.getScreenshotImage(null);
        assertEqual(result, null, 'Should return null for null screenshot');
    });

    test('getScreenshotImage returns localized image when available', () => {
        if (typeof window.getScreenshotImage !== 'function') {
            throw new Error('getScreenshotImage not available');
        }
        if (!window.state) {
            throw new Error('state not available');
        }

        const mockScreenshot = {
            localizedImages: {
                en: { image: { src: 'test_en.png' } },
                de: { image: { src: 'test_de.png' } }
            },
            image: { src: 'fallback.png' }
        };

        // Save and set current language
        const originalLang = window.state.currentLanguage;
        window.state.currentLanguage = 'de';

        const result = window.getScreenshotImage(mockScreenshot);

        window.state.currentLanguage = originalLang;

        assertTruthy(result, 'Should return an image');
    });

    test('getScreenshotImage falls back to legacy image', () => {
        if (typeof window.getScreenshotImage !== 'function') {
            throw new Error('getScreenshotImage not available');
        }

        const mockScreenshot = {
            image: { src: 'legacy.png' }
        };

        const result = window.getScreenshotImage(mockScreenshot);
        assertEqual(result, mockScreenshot.image, 'Should return legacy image');
    });

    // ========================================
    // Test: Available languages detection
    // ========================================
    test('getAvailableLanguagesForScreenshot function exists', () => {
        assertType(window.getAvailableLanguagesForScreenshot, 'function',
            'getAvailableLanguagesForScreenshot should be function');
    });

    test('getAvailableLanguagesForScreenshot returns array', () => {
        if (typeof window.getAvailableLanguagesForScreenshot !== 'function') {
            throw new Error('getAvailableLanguagesForScreenshot not available');
        }

        const mockScreenshot = {
            localizedImages: {
                en: { image: {} },
                de: { image: {} }
            }
        };

        const result = window.getAvailableLanguagesForScreenshot(mockScreenshot);
        assertTruthy(Array.isArray(result), 'Should return array');
    });

    test('getAvailableLanguagesForScreenshot detects all languages', () => {
        if (typeof window.getAvailableLanguagesForScreenshot !== 'function') {
            throw new Error('getAvailableLanguagesForScreenshot not available');
        }

        const mockScreenshot = {
            localizedImages: {
                en: { image: {} },
                de: { image: {} },
                fr: { image: {} }
            }
        };

        const result = window.getAvailableLanguagesForScreenshot(mockScreenshot);
        assertEqual(result.length, 3, 'Should detect 3 languages');
        assertTruthy(result.includes('en'), 'Should include en');
        assertTruthy(result.includes('de'), 'Should include de');
        assertTruthy(result.includes('fr'), 'Should include fr');
    });

    // ========================================
    // Test: Screenshot completion check
    // ========================================
    test('isScreenshotComplete function exists', () => {
        assertType(window.isScreenshotComplete, 'function', 'isScreenshotComplete should be function');
    });

    test('isScreenshotComplete returns true when all languages have images', () => {
        if (typeof window.isScreenshotComplete !== 'function') {
            throw new Error('isScreenshotComplete not available');
        }
        if (!window.state) {
            throw new Error('state not available');
        }

        const originalLangs = window.state.projectLanguages;
        window.state.projectLanguages = ['en', 'de'];

        const mockScreenshot = {
            localizedImages: {
                en: { image: {} },
                de: { image: {} }
            }
        };

        const result = window.isScreenshotComplete(mockScreenshot);
        window.state.projectLanguages = originalLangs;

        assertEqual(result, true, 'Should be complete');
    });

    test('isScreenshotComplete returns false when languages missing', () => {
        if (typeof window.isScreenshotComplete !== 'function') {
            throw new Error('isScreenshotComplete not available');
        }
        if (!window.state) {
            throw new Error('state not available');
        }

        const originalLangs = window.state.projectLanguages;
        window.state.projectLanguages = ['en', 'de', 'fr'];

        const mockScreenshot = {
            localizedImages: {
                en: { image: {} }
            }
        };

        const result = window.isScreenshotComplete(mockScreenshot);
        window.state.projectLanguages = originalLangs;

        assertEqual(result, false, 'Should be incomplete');
    });

    // ========================================
    // Test: Find screenshot by base filename
    // ========================================
    test('findScreenshotByBaseFilename function exists', () => {
        assertType(window.findScreenshotByBaseFilename, 'function',
            'findScreenshotByBaseFilename should be function');
    });

    test('findScreenshotByBaseFilename finds matching screenshot', () => {
        if (typeof window.findScreenshotByBaseFilename !== 'function') {
            throw new Error('findScreenshotByBaseFilename not available');
        }
        if (!window.state) {
            throw new Error('state not available');
        }

        const originalScreenshots = window.state.screenshots;

        window.state.screenshots = [
            { name: 'test_en.png', localizedImages: { en: { name: 'test_en.png' } } },
            { name: 'other_en.png', localizedImages: { en: { name: 'other_en.png' } } }
        ];

        const result = window.findScreenshotByBaseFilename('test_de.png');
        window.state.screenshots = originalScreenshots;

        assertEqual(result, 0, 'Should find at index 0');
    });

    test('findScreenshotByBaseFilename returns -1 for no match', () => {
        if (typeof window.findScreenshotByBaseFilename !== 'function') {
            throw new Error('findScreenshotByBaseFilename not available');
        }
        if (!window.state) {
            throw new Error('state not available');
        }

        const originalScreenshots = window.state.screenshots;
        window.state.screenshots = [];

        const result = window.findScreenshotByBaseFilename('nonexistent.png');
        window.state.screenshots = originalScreenshots;

        assertEqual(result, -1, 'Should return -1');
    });

    // ========================================
    // Test: Language flags and names
    // ========================================
    test('languageFlags object exists', () => {
        assertTruthy(window.languageFlags, 'languageFlags should exist');
    });

    test('languageNames object exists', () => {
        assertTruthy(window.languageNames, 'languageNames should exist');
    });

    test('languageFlags has common languages', () => {
        assertTruthy(window.languageFlags, 'languageFlags should exist');
        assertTruthy(window.languageFlags.en, 'Should have English flag');
        assertTruthy(window.languageFlags.de, 'Should have German flag');
        assertTruthy(window.languageFlags.fr, 'Should have French flag');
    });

    test('languageNames has common languages', () => {
        assertTruthy(window.languageNames, 'languageNames should exist');
        assertTruthy(window.languageNames.en, 'Should have English name');
        assertTruthy(window.languageNames.de, 'Should have German name');
        assertTruthy(window.languageNames.fr, 'Should have French name');
    });

    // ========================================
    // Test: Add localized image
    // ========================================
    test('addLocalizedImage function exists', () => {
        assertType(window.addLocalizedImage, 'function', 'addLocalizedImage should be function');
    });

    // ========================================
    // Run all tests
    // ========================================
    console.log('\n=== Language Utils Test Suite ===\n');

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
