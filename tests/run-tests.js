#!/usr/bin/env node
/**
 * CLI Test Runner for App Store Screenshot Generator
 * Run with: node tests/run-tests.js
 *
 * This runs basic syntax and structure tests that don't require a browser
 */

const fs = require('fs');
const path = require('path');

// Colors for output
const colors = {
    reset: '\x1b[0m',
    green: '\x1b[32m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    dim: '\x1b[2m'
};

let totalPassed = 0;
let totalFailed = 0;

function log(msg, color) {
    color = color || colors.reset;
    console.log(color + msg + colors.reset);
}

function pass(name) {
    totalPassed++;
    log('  ✓ ' + name, colors.green);
}

function fail(name, error) {
    totalFailed++;
    log('  ✗ ' + name, colors.red);
    if (error) {
        log('    ' + error, colors.dim);
    }
}

function section(name) {
    log('\n' + name, colors.blue);
    log('='.repeat(name.length), colors.dim);
}

// ========================================
// Test: File existence
// ========================================
section('File Existence Tests');

const requiredFiles = [
    'app.js',
    'index.html',
    'styles.css',
    'three-renderer.js',
    'language-utils.js',
    'utils.js',
    'layouts.js',
    'agents.js',
    'ai-engine.js',
    'llm.js',
    'undo-redo.js',
    'package.json',
    '.eslintrc.json'
];

requiredFiles.forEach(function(file) {
    const filePath = path.join(__dirname, '..', file);
    if (fs.existsSync(filePath)) {
        pass(file + ' exists');
    } else {
        fail(file + ' exists', 'File not found: ' + filePath);
    }
});

// ========================================
// Test: JavaScript syntax
// ========================================
section('JavaScript Syntax Tests');

const jsFiles = [
    'app.js',
    'three-renderer.js',
    'language-utils.js',
    'utils.js',
    'layouts.js',
    'agents.js',
    'ai-engine.js',
    'llm.js',
    'undo-redo.js'
];

jsFiles.forEach(function(file) {
    const filePath = path.join(__dirname, '..', file);
    try {
        const code = fs.readFileSync(filePath, 'utf8');
        // Try to parse as a function (basic syntax check)
        new Function(code);
        pass(file + ' has valid syntax');
    } catch (e) {
        fail(file + ' has valid syntax', e.message);
    }
});

// ========================================
// Test: Critical patterns in app.js
// ========================================
section('Critical Pattern Tests (app.js)');

const appJs = fs.readFileSync(path.join(__dirname, '..', 'app.js'), 'utf8');

// Check for debounced save
if (appJs.includes('debouncedSaveState')) {
    pass('debouncedSaveState is defined');
} else {
    fail('debouncedSaveState is defined');
}

if (appJs.includes('SAVE_DEBOUNCE_MS')) {
    pass('SAVE_DEBOUNCE_MS constant exists');
} else {
    fail('SAVE_DEBOUNCE_MS constant exists');
}

// Check for file validation
if (appJs.includes('VALID_IMAGE_TYPES')) {
    pass('VALID_IMAGE_TYPES constant exists');
} else {
    fail('VALID_IMAGE_TYPES constant exists');
}

if (appJs.includes('MAX_FILE_SIZE')) {
    pass('MAX_FILE_SIZE constant exists');
} else {
    fail('MAX_FILE_SIZE constant exists');
}

// Check for export flag
if (appJs.includes('isExporting')) {
    pass('isExporting flag exists');
} else {
    fail('isExporting flag exists');
}

// Check for error handlers
if (appJs.includes('img.onerror')) {
    pass('Image error handlers exist');
} else {
    fail('Image error handlers exist');
}

if (appJs.includes('reader.onerror')) {
    pass('FileReader error handlers exist');
} else {
    fail('FileReader error handlers exist');
}

// Check for async/await usage in project operations
if (appJs.includes('async (e)') || appJs.includes('async ()') || appJs.includes('async function')) {
    pass('Async functions are used');
} else {
    fail('Async functions are used');
}

// Check for null checks
if (appJs.includes('state.selectedIndex < 0') || appJs.includes('selectedIndex >= state.screenshots.length')) {
    pass('Bounds checking for selectedIndex');
} else {
    fail('Bounds checking for selectedIndex');
}

// ========================================
// Test: Critical patterns in three-renderer.js
// ========================================
section('Critical Pattern Tests (three-renderer.js)');

const threeJs = fs.readFileSync(path.join(__dirname, '..', 'three-renderer.js'), 'utf8');

if (threeJs.includes('cleanMaterial')) {
    pass('cleanMaterial function exists');
} else {
    fail('cleanMaterial function exists');
}

if (threeJs.includes('disposeHierarchy')) {
    pass('disposeHierarchy function exists');
} else {
    fail('disposeHierarchy function exists');
}

if (threeJs.includes('disposeThreeJS')) {
    pass('disposeThreeJS function exists');
} else {
    fail('disposeThreeJS function exists');
}

// ========================================
// Test: Critical patterns in agents.js
// ========================================
section('Critical Pattern Tests (agents.js)');

const agentsJs = fs.readFileSync(path.join(__dirname, '..', 'agents.js'), 'utf8');

if (agentsJs.includes('API_TIMEOUT_MS')) {
    pass('API_TIMEOUT_MS constant exists');
} else {
    fail('API_TIMEOUT_MS constant exists');
}

if (agentsJs.includes('AbortController')) {
    pass('AbortController for timeout exists');
} else {
    fail('AbortController for timeout exists');
}

if (agentsJs.includes('clearTimeout(timeoutId)')) {
    pass('Timeout cleanup exists');
} else {
    fail('Timeout cleanup exists');
}

// ========================================
// Test: Critical patterns in electron/main.js
// ========================================
section('Critical Pattern Tests (electron/main.js)');

const electronPath = path.join(__dirname, '..', 'electron', 'main.js');
if (fs.existsSync(electronPath)) {
    const electronJs = fs.readFileSync(electronPath, 'utf8');

    if (electronJs.includes('sanitize')) {
        pass('Input sanitization exists');
    } else {
        fail('Input sanitization exists');
    }
} else {
    log('  - electron/main.js not found (skipped)', colors.yellow);
}

// ========================================
// Test: Critical patterns in undo-redo.js
// ========================================
section('Critical Pattern Tests (undo-redo.js)');

const undoJs = fs.readFileSync(path.join(__dirname, '..', 'undo-redo.js'), 'utf8');

if (undoJs.includes('Object.prototype.hasOwnProperty.call')) {
    pass('Safe hasOwnProperty usage');
} else {
    fail('Safe hasOwnProperty usage');
}

// ========================================
// Test: ESLint configuration
// ========================================
section('ESLint Configuration Tests');

try {
    const eslintConfig = JSON.parse(fs.readFileSync(path.join(__dirname, '..', '.eslintrc.json'), 'utf8'));

    if (eslintConfig.env && eslintConfig.env.browser) {
        pass('Browser environment enabled');
    } else {
        fail('Browser environment enabled');
    }

    if (eslintConfig.globals) {
        pass('Global variables defined');
        const requiredGlobals = ['state', 'canvas', 'THREE', 'JSZip'];
        requiredGlobals.forEach(function(g) {
            if (eslintConfig.globals[g]) {
                pass('Global: ' + g + ' defined');
            } else {
                fail('Global: ' + g + ' defined');
            }
        });
    } else {
        fail('Global variables defined');
    }
} catch (e) {
    fail('ESLint config is valid JSON', e.message);
}

// ========================================
// Test: Package.json
// ========================================
section('Package.json Tests');

try {
    const pkg = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'package.json'), 'utf8'));

    if (pkg.name) {
        pass('Package has name: ' + pkg.name);
    } else {
        fail('Package has name');
    }

    if (pkg.scripts && pkg.scripts.lint) {
        pass('Lint script exists');
    } else {
        fail('Lint script exists');
    }

    if (pkg.devDependencies && pkg.devDependencies.eslint) {
        pass('ESLint dependency exists');
    } else {
        fail('ESLint dependency exists');
    }
} catch (e) {
    fail('Package.json is valid', e.message);
}

// ========================================
// Summary
// ========================================
log('\n' + '='.repeat(50), colors.dim);
log('Test Summary', colors.blue);
log('='.repeat(50), colors.dim);
log('Passed: ' + totalPassed, colors.green);
log('Failed: ' + totalFailed, totalFailed > 0 ? colors.red : colors.green);
log('Total:  ' + (totalPassed + totalFailed), colors.reset);

if (totalFailed === 0) {
    log('\n✓ All tests passed!', colors.green);
    process.exit(0);
} else {
    log('\n✗ Some tests failed!', colors.red);
    process.exit(1);
}
