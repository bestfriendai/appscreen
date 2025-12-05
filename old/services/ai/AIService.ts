import { GoogleGenAI } from "@google/genai";
import { logger } from "../../utils/logger";

export interface AIResponse<T> {
  data: T | null;
  error?: string;
}

export abstract class AIService {
  abstract generateJson<T>(prompt: string, schema: any, images?: { id: string, base64: string }[]): Promise<T>;
  abstract generateImage(prompt: string, negativePrompt?: string): Promise<string>;
}

// Client-side implementation (Direct API Call)
export class ClientSideGeminiService extends AIService {
  private client: GoogleGenAI;

  constructor(apiKey: string) {
    super();
    this.client = new GoogleGenAI({ apiKey });
  }

  async generateJson<T>(prompt: string, schema: any, images: { id: string, base64: string }[] = []): Promise<T> {
    try {
      const contents = {
        parts: [
          { text: prompt },
          ...images.map(img => ({
            inlineData: { mimeType: 'image/png', data: img.base64 }
          }))
        ]
      } as any;

      // UPGRADE: Using Gemini 3.0 Pro Preview for maximum reasoning capability
      // NOTE: DO NOT CHANGE THIS MODEL. It is specifically chosen for its reasoning capabilities.
      const response = await this.client.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents,
        config: {
          responseMimeType: "application/json",
          responseSchema: schema
        }
      });

      const text = response.text;
      if (!text) throw new Error("No response text");
      return JSON.parse(text) as T;

    } catch (error) {
      logger.error("AI JSON Generation failed:", error);
      throw error;
    }
  }

  async generateImage(prompt: string, negativePrompt: string = ""): Promise<string> {
    try {
      // UPGRADE: Using Gemini 3 Pro Image Preview for high-fidelity image generation
      // NOTE: DO NOT CHANGE THIS MODEL. It is specifically chosen for high-fidelity image generation.
      const response = await this.client.models.generateContent({
        model: 'gemini-3-pro-image-preview',
        contents: { parts: [{ text: prompt }] },
        config: {
          // @ts-ignore - SDK types might be slightly different
          responseModalities: ["IMAGE"],
          temperature: 0.85,
          topK: 40,
          topP: 0.95
        }
      });

      if (response.candidates?.[0]?.content?.parts) {
        for (const part of response.candidates[0].content.parts) {
          if (part.inlineData && part.inlineData.data) {
            return `data:image/png;base64,${part.inlineData.data}`;
          }
        }
      }
      throw new Error("No image data returned");

    } catch (error) {
      logger.error("AI Image Generation failed:", error);
      throw error;
    }
  }
}

// Proxy implementation (For Production Backend)
export class ProxyAIService extends AIService {
  private endpoint: string;

  constructor(endpoint: string) {
    super();
    this.endpoint = endpoint;
  }

  async generateJson<T>(prompt: string, schema: any, images: { id: string, base64: string }[] = []): Promise<T> {
    const res = await fetch(`${this.endpoint}/generate-json`, {
      method: 'POST',
      body: JSON.stringify({ prompt, schema, images }),
      headers: { 'Content-Type': 'application/json' }
    });

    const contentType = res.headers.get("content-type");
    if (contentType && contentType.indexOf("application/json") === -1) {
      const text = await res.text();
      // If HTML (likely Vercel error page), throw readable error
      if (text.includes("<!DOCTYPE html>")) {
        throw new Error(`Server Error (${res.status}): The AI model took too long to respond. Please try again.`);
      }
      throw new Error(`Server Error (${res.status}): ${text.substring(0, 100)}...`);
    }

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "Proxy JSON Error");
    }
    return await res.json();
  }

  async generateImage(prompt: string, negativePrompt: string): Promise<string> {
    const res = await fetch(`${this.endpoint}/generate-image`, {
      method: 'POST',
      body: JSON.stringify({ prompt, negativePrompt }),
      headers: { 'Content-Type': 'application/json' }
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "Proxy Image Error");
    }
    const data = await res.json();
    return data.imageUrl;
  }
}

// Factory
let aiServiceInstance: AIService | null = null;

export const getAIService = (): AIService => {
  if (aiServiceInstance) return aiServiceInstance;

  // Check for proxy URL first
  const apiUrl = import.meta.env.VITE_API_URL;
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY || (import.meta.env as any).GEMINI_API_KEY || (window as any).process?.env?.GEMINI_API_KEY;

  if (apiUrl) {
    logger.info("Using Proxy AI Service");
    aiServiceInstance = new ProxyAIService(apiUrl);
  } else if (apiKey) {
    logger.info("Using Client-Side AI Service");
    aiServiceInstance = new ClientSideGeminiService(apiKey);
  } else {
    // Fallback or Error
    // For development without env var, we might return a mock or throw
    logger.warn("No API Key found. AI features will fail.");
    // Temporarily throw to alert dev
    throw new Error("Missing VITE_GEMINI_API_KEY or VITE_API_URL");
  }

  return aiServiceInstance;
};
