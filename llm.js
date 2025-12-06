// LLM Provider Configuration
// Gemini 3 Pro - Most powerful model (Dec 2025)

const llmProviders = {
    google: {
        name: 'Google Gemini',
        keyPrefix: 'AIza',
        storageKey: 'googleApiKey',
        modelStorageKey: 'googleModel',
        models: [
            { id: 'gemini-3-pro-preview', name: 'Gemini 3 Pro' },
            { id: 'gemini-3-pro-image-preview', name: 'Gemini 3 Pro Image' }
        ],
        defaultModel: 'gemini-3-pro-preview'
    }
};

// Default provider is always Google
const DEFAULT_PROVIDER = 'google';

/**
 * Get the selected model
 * @returns {string} - Model ID
 */
function getSelectedModel() {
    const config = llmProviders.google;
    const storedModel = localStorage.getItem(config.modelStorageKey);

    // Validate stored model is in allowed list
    const validModelIds = config.models.map(m => m.id);
    if (storedModel && validModelIds.includes(storedModel)) {
        return storedModel;
    }

    // Invalid or missing - reset to default
    localStorage.setItem(config.modelStorageKey, config.defaultModel);
    return config.defaultModel;
}

/**
 * Get the selected provider (always google)
 * @returns {string} - Provider key
 */
function getSelectedProvider() {
    return 'google';
}

/**
 * Default Gemini 3 API key
 */
const DEFAULT_API_KEY = 'AIzaSyBFVCWZnc6wKlOeoCwBf_lbWiVKuyRurx0';

/**
 * Get API key
 * @returns {string} - API key (uses default if not set)
 */
function getApiKey() {
    return localStorage.getItem(llmProviders.google.storageKey) || DEFAULT_API_KEY;
}

/**
 * Validate API key format
 * @param {string} key - API key to validate
 * @returns {boolean} - Whether key format is valid
 */
function validateApiKeyFormat(key) {
    return key && key.startsWith(llmProviders.google.keyPrefix);
}

/**
 * Generate HTML options for model select dropdown
 * @param {string} selectedModel - Currently selected model ID (optional)
 * @returns {string} - HTML string of option elements
 */
function generateModelOptions(selectedModel = null) {
    const config = llmProviders.google;
    const selected = selectedModel || getSelectedModel();
    return config.models.map(model =>
        `<option value="${model.id}"${model.id === selected ? ' selected' : ''}>${model.name}</option>`
    ).join('\n');
}

// Export for use
window.llmProviders = llmProviders;
window.getSelectedModel = getSelectedModel;
window.getSelectedProvider = getSelectedProvider;
window.getApiKey = getApiKey;
window.validateApiKeyFormat = validateApiKeyFormat;
window.generateModelOptions = generateModelOptions;
