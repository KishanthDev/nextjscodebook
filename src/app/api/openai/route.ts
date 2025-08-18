import { openai } from '@ai-sdk/openai';
import { convertToModelMessages, streamText, UIMessage } from 'ai';
import { initialData } from '@/lib/data';

export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  // Combine initial documentation with new chat messages
  const fullMessages: UIMessage[] = [...initialData, ...messages];

  const result = streamText({
    model: openai('gpt-4o-mini'),
    system: 'You are a helpful assistant.',
    messages: convertToModelMessages(fullMessages),
  });

  return result.toUIMessageStreamResponse();
}
