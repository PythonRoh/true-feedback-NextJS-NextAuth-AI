// app/api/generate/route.ts
import { NextResponse } from "next/server";
import { streamText } from "ai";
import { createOpenAI } from "@ai-sdk/openai";

export const runtime = "edge";

// Initialize OpenAI via AI SDK (pointing to OpenRouter)
const openai = createOpenAI({
    apiKey: process.env.OPENROUTER_API_KEY,
    baseURL: "https://openrouter.ai/api/v1",
});

export async function POST(req: Request) {
    try {
        const prompt =
            "Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured like this: 'What’s a hobby you’ve recently started?||If you could have dinner with any historical figure, who would it be?||What’s a simple thing that makes you happy?'. Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment.";

        // Generate text with streaming
        const response = await streamText({
            model: openai("openai/gpt-3.5-turbo-instruct"),
            prompt,
        });

        // ✅ Correct method in ai@5.x
        return response.toTextStreamResponse();
    } catch (error) {
        console.error("OpenRouter API error:", error);
        return NextResponse.json({ error: String(error) }, { status: 500 });
    }
}
