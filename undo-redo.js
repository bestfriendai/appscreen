/**
 * Undo/Redo System
 * Tracks state changes and allows reverting actions
 */

const UndoRedo = (function() {
    const MAX_HISTORY = 50;
    let undoStack = [];
    let redoStack = [];
    let isUndoingOrRedoing = false;
    let lastSavedState = null;

    /**
     * Deep clone an object
     */
    function deepClone(obj) {
        if (obj === null || typeof obj !== 'object') return obj;
        if (obj instanceof Date) return new Date(obj);
        if (Array.isArray(obj)) return obj.map(item => deepClone(item));

        const cloned = {};
        for (const key in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, key)) {
                // Skip image objects to save memory
                if (key === 'image' && obj[key] instanceof HTMLImageElement) {
                    cloned[key] = obj[key]; // Keep reference
                } else {
                    cloned[key] = deepClone(obj[key]);
                }
            }
        }
        return cloned;
    }

    /**
     * Check if two states are equal (shallow comparison of key properties)
     */
    function statesEqual(a, b) {
        if (!a || !b) return false;

        // Compare stringified versions for deep comparison
        // But exclude frequently changing properties
        const cleanState = (state) => {
            const clone = deepClone(state);
            // Remove properties that change too frequently
            delete clone.generationProgress;
            return JSON.stringify(clone);
        };

        return cleanState(a) === cleanState(b);
    }

    /**
     * Save current state to history
     */
    function saveState(state, actionName = '') {
        if (isUndoingOrRedoing) return;

        const stateClone = deepClone(state);
        stateClone._actionName = actionName;
        stateClone._timestamp = Date.now();

        // Don't save if state hasn't changed
        if (undoStack.length > 0 && statesEqual(undoStack[undoStack.length - 1], stateClone)) {
            return;
        }

        undoStack.push(stateClone);

        // Limit stack size
        if (undoStack.length > MAX_HISTORY) {
            undoStack.shift();
        }

        // Clear redo stack when new action is taken
        redoStack = [];

        updateUI();
    }

    /**
     * Undo last action
     */
    function undo() {
        if (undoStack.length <= 1) return null; // Keep at least one state

        isUndoingOrRedoing = true;

        // Move current state to redo stack
        const currentState = undoStack.pop();
        redoStack.push(currentState);

        // Get previous state
        const previousState = undoStack[undoStack.length - 1];

        isUndoingOrRedoing = false;
        updateUI();

        return deepClone(previousState);
    }

    /**
     * Redo last undone action
     */
    function redo() {
        if (redoStack.length === 0) return null;

        isUndoingOrRedoing = true;

        // Move state from redo to undo stack
        const nextState = redoStack.pop();
        undoStack.push(nextState);

        isUndoingOrRedoing = false;
        updateUI();

        return deepClone(nextState);
    }

    /**
     * Check if undo is available
     */
    function canUndo() {
        return undoStack.length > 1;
    }

    /**
     * Check if redo is available
     */
    function canRedo() {
        return redoStack.length > 0;
    }

    /**
     * Get undo action name
     */
    function getUndoActionName() {
        if (undoStack.length > 1) {
            return undoStack[undoStack.length - 1]._actionName || 'Last action';
        }
        return '';
    }

    /**
     * Get redo action name
     */
    function getRedoActionName() {
        if (redoStack.length > 0) {
            return redoStack[redoStack.length - 1]._actionName || 'Last action';
        }
        return '';
    }

    /**
     * Clear history
     */
    function clearHistory() {
        undoStack = [];
        redoStack = [];
        updateUI();
    }

    /**
     * Initialize with starting state
     */
    function initialize(state) {
        clearHistory();
        saveState(state, 'Initial state');
    }

    /**
     * Update UI elements
     */
    function updateUI() {
        const undoBtn = document.getElementById('undo-btn');
        const redoBtn = document.getElementById('redo-btn');

        if (undoBtn) {
            undoBtn.disabled = !canUndo();
            undoBtn.title = canUndo() ? `Undo: ${getUndoActionName()}` : 'Nothing to undo';
        }

        if (redoBtn) {
            redoBtn.disabled = !canRedo();
            redoBtn.title = canRedo() ? `Redo: ${getRedoActionName()}` : 'Nothing to redo';
        }
    }

    /**
     * Get history info
     */
    function getHistoryInfo() {
        return {
            undoCount: undoStack.length - 1,
            redoCount: redoStack.length,
            canUndo: canUndo(),
            canRedo: canRedo()
        };
    }

    /**
     * Setup keyboard shortcuts
     */
    function setupKeyboardShortcuts(applyStateCallback) {
        document.addEventListener('keydown', (e) => {
            // Ctrl/Cmd + Z for Undo
            if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
                e.preventDefault();
                const previousState = undo();
                if (previousState && applyStateCallback) {
                    applyStateCallback(previousState);
                }
            }

            // Ctrl/Cmd + Shift + Z or Ctrl/Cmd + Y for Redo
            if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) {
                e.preventDefault();
                const nextState = redo();
                if (nextState && applyStateCallback) {
                    applyStateCallback(nextState);
                }
            }
        });
    }

    return {
        saveState,
        undo,
        redo,
        canUndo,
        canRedo,
        getUndoActionName,
        getRedoActionName,
        clearHistory,
        initialize,
        getHistoryInfo,
        setupKeyboardShortcuts,
        updateUI
    };
})();

// Export for use in app.js
window.UndoRedo = UndoRedo;
