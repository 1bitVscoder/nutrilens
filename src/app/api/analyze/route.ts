import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

// Initialize GenAI client. It will automatically load GEMINI_API_KEY from environment.
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

const SYSTEM_PROMPT = `You are a nutrition analysis AI. Analyze the food in this image and return a JSON response with this exact structure:
{
  "items": [
    {
      "name": "Food item name",
      "quantity": 1,
      "unit": "serving/piece/cup/g",
      "nutrition": {
        "calories": 250,
        "protein": 12,
        "carbs": 30,
        "fat": 8,
        "fiber": 3,
        "sugar": 5
      },
      "confidence": 0.92
    }
  ],
  "suggestions": ["Tip 1", "Tip 2"],
  "overallConfidence": 0.89
}
Be precise with calorie and macronutrient estimates. Return ONLY valid JSON matching this exact structure.`;

export async function POST(req: NextRequest) {
  try {
    const { imageBase64 } = await req.json();

    if (!imageBase64) {
      return NextResponse.json(
        { error: 'No image provided' },
        { status: 400 }
      );
    }

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        {
          role: 'user',
          parts: [
            { text: SYSTEM_PROMPT },
            {
              inlineData: {
                mimeType: 'image/jpeg',
                data: imageBase64.replace(/^data:image\/\w+;base64,/, ''),
              },
            },
          ],
        },
      ],
      config: {
        responseMimeType: 'application/json',
      },
    });

    const text = response.text ?? '';
    if (!text) {
      throw new Error('Empty response from Gemini');
    }

    // Attempt to parse JSON response directly or fall back to regex extraction
    let analysis;
    try {
      analysis = JSON.parse(text);
    } catch (e) {
      console.warn('Direct JSON parsing failed, trying extraction regex', e);
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      analysis = JSON.parse(jsonMatch?.[0] || '{}');
    }

    return NextResponse.json(analysis);
  } catch (error) {
    console.error('Analysis error:', error);
    return NextResponse.json(
      { error: 'Failed to analyze image' },
      { status: 500 }
    );
  }
}