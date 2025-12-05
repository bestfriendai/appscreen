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
    const { prompt, schema, images } = req.body;

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'Server configuration error' });
    }

    const client = new GoogleGenAI({ apiKey });

    const contents = {
      parts: [
        { text: prompt },
        ...(images || []).map((img: any) => ({
          inlineData: { mimeType: 'image/png', data: img.base64 }
        }))
      ]
    } as any;

    // NOTE: DO NOT CHANGE THIS MODEL. It is specifically chosen for its reasoning capabilities.
    const response = await client.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents,
      config: {
        responseMimeType: "application/json",
        responseSchema: schema
      }
    });

    const text = response.text;
    if (!text) {
      return res.status(500).json({ error: 'No content generated' });
    }

    return res.status(200).json(JSON.parse(text));

  } catch (error: any) {
    console.error('API Error:', error);
    return res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
}
