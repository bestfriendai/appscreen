// LLM Provider Configuration
// Gemini 3.0 - Google's latest AI model

const llmProviders = {
    google: {
        name: 'Google Gemini 3.0',
        keyPrefix: 'AIza',
        storageKey: 'googleApiKey',
        modelStorageKey: 'googleModel',
        models: [
            { id: 'gemini-3-pro-preview', name: 'Gemini 3.0 Pro (Recommended)' },
            { id: 'gemini-3-pro-image-preview', name: 'Gemini 3.0 Pro Image (For visuals)' }
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
    return localStorage.getItem(config.modelStorageKey) || config.defaultModel;
}

/**
 * Get the selected provider (always google)
 * @returns {string} - Provider key
 */
function getSelectedProvider() {
    return 'google';
}

/**
 * Get API key
 * @returns {string|null} - API key or null
 */
function getApiKey() {
    return localStorage.getItem(llmProviders.google.storageKey);
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
