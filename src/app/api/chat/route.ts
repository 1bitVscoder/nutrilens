import { NextRequest } from 'next/server';
import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

const SYSTEM_PROMPT = `You are NutriLens AI, a friendly and knowledgeable nutritionist assistant. 
You have access to the user's daily nutrition data provided in each message.
Give concise, actionable advice. Use emoji occasionally. Keep responses under 150 words.
Focus on practical suggestions, not medical advice.`;

export async function POST(req: NextRequest) {
  try {
    const { message, context } = await req.json();

    const contextPrompt = `User's today stats: ${context.calories}/${context.calorieTarget} kcal, 
Protein: ${context.protein}/${context.proteinTarget}g, 
Carbs: ${context.carbs}g, Fat: ${context.fat}g, 
Meals logged: ${context.mealCount}, Goal: ${context.goal}`;

    // Call generateContentStream on the new SDK
    const responseStream = await ai.models.generateContentStream({
      model: 'gemini-2.5-flash',
      contents: [
        { role: 'user', parts: [{ text: contextPrompt + '\n\nUser: ' + message }] },
      ],
      config: {
        systemInstruction: SYSTEM_PROMPT,
      },
    });

    // Stream as Server-Sent Events
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of responseStream) {
            const text = chunk.text ?? '';
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ token: text })}\n\n`));
          }
          controller.enqueue(encoder.encode('data: [DONE]\n\n'));
        } catch (err) {
          console.error('Error during streaming:', err);
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ error: 'Stream interrupted' })}\n\n`));
        } finally {
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    });
  } catch (error) {
    console.error('Chat API error:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}