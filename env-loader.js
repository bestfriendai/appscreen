// Load .env.local file for local development
// This file reads .env.local and exposes values to window.ENV
(async function() {
    window.ENV = {};
    try {
        const response = await fetch('.env.local');
        if (response.ok) {
            const text = await response.text();
            text.split('\n').forEach(line => {
                const trimmed = line.trim();
                if (trimmed && !trimmed.startsWith('#')) {
                    const [key, ...valueParts] = trimmed.split('=');
                    if (key && valueParts.length > 0) {
                        window.ENV[key.trim()] = valueParts.join('=').trim();
                    }
                }
            });
        }
    } catch (e) {
        // .env.local not found - that's fine for production
    }
})();
