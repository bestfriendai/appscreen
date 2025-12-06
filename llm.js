// LLM Provider Configuration
// Gemini 2.0 Flash - Google's latest GA AI model

const llmProviders = {
    google: {
        name: 'Google Gemini',
        keyPrefix: 'AIza',
        storageKey: 'googleApiKey',
        modelStorageKey: 'googleModel',
        models: [
            { id: 'gemini-2.0-flash', name: 'Gemini 2.0 Flash (Recommended)' },
            { id: 'gemini-2.5-flash', name: 'Gemini 2.5 Flash (Latest)' },
            { id: 'gemini-1.5-pro', name: 'Gemini 1.5 Pro (Legacy)' }
        ],
        defaultModel: 'gemini-2.0-flash'
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
