import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenAI } from "@google/genai";

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { prompt, negativePrompt } = req.body;

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'Server configuration error' });
    }

    const client = new GoogleGenAI({ apiKey });

    // NOTE: DO NOT CHANGE THIS MODEL. It is specifically chosen for high-fidelity image generation.
    const response = await client.models.generateContent({
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
          const imageUrl = `data:image/png;base64,${part.inlineData.data}`;
          return res.status(200).json({ imageUrl });
        }
      }
    }

    return res.status(500).json({ error: 'No image generated' });

  } catch (error: any) {
    console.error('API Error:', error);
    return res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
}
