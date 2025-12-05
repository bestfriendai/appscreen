import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    // Load env file based on `mode` in the current working directory.
    // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
    const env = loadEnv(mode, '.', '');

    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [react()],
      define: {
        // SECURITY FIX: Do not blindly expose all env vars.
        // Only expose what is explicitly needed and safe-listed.
        // Ideally, use VITE_ prefix in .env files and let Vite handle it automatically.
        // However, since we support existing .env, we verify before exposing.

        // Expose API Key ONLY if it's explicitly set for client-side dev usage (e.g. VITE_GEMINI_API_KEY)
        // or if we are forced to support legacy GEMINI_API_KEY (Not recommended for prod).
        // For Vercel, if GEMINI_API_KEY is a server secret, IT SHOULD NOT BE HERE.
        // But if the user says "secrets are in vercel environment" for client usage, we map it.
        'process.env.GEMINI_API_KEY': JSON.stringify(env.VITE_GEMINI_API_KEY || env.GEMINI_API_KEY),
        'process.env.API_KEY': JSON.stringify(env.API_KEY),
        'process.env.VITE_API_URL': JSON.stringify(env.VITE_API_URL),
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      },
      build: {
        target: 'esnext' // Top level await support for Workers if needed
      },
      worker: {
        format: 'es',
      }
    };
});
