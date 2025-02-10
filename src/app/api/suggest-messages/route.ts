import { NextResponse } from 'next/server';
import { google } from '@ai-sdk/google';
import { streamText } from 'ai';

export const runtime = 'edge';

const model = google('gemini-2.0-flash-exp');

export async function POST() {
  try {
    const prompt = "Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured like this: 'What’s a hobby you’ve recently started?||If you could have dinner with any historical figure, who would it be?||What’s a simple thing that makes you happy?'. Ensure the questions are intriguing, foster curiosity, contribute to a positive and welcoming conversational environment and especially don't add things which are haram in Islam like music etc.";

    // @ts-ignore
    const stream = streamText({
      model,
      messages: [
        { role: 'system', content: 'You are a helpful AI assistant.' },
        { role: 'user', content: prompt },
      ],
      temperature: 1,
      topP: 0.95,
      topK: 40,
      // maxTokens: 8192,
      maxTokens: 200,
    });

    // // Convert the stream to a ReadableStream without re-encoding the chunks
    // const readableStream = new ReadableStream({
    //   async start(controller) {
    //     for await (const chunk of stream.textStream) {
    //       // Directly enqueue the chunk (assuming it's a string)
    //       controller.enqueue(chunk);
    //     }
    //     controller.close();
    //   },
    // });

    // return new NextResponse(readableStream, {
    //   headers: { 'Content-Type': 'text/plain' },
    // });

    return stream.toDataStreamResponse();

  } catch (error) {
    console.error('Error generating text:', error);
    return NextResponse.json({ error: 'Failed to generate text' }, { status: 500 });
  }
}