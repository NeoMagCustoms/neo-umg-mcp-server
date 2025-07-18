// File: scripts/agents/NeoPoeUMG.ts

import OpenAI from 'openai';
import dotenv from 'dotenv';
import { getThreadId, saveThreadId } from '../../utils/threadStore';
import { formatContextSummary } from '../../utils/contextFormatter';

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!
});

const assistantId = 'asst_9Mg4r5s7T3VDyPKyBvrEHVQp';

export async function runNeoPoeUMGThread(
  userInput: string,
  context: Record<string, any> = {}
) {
  try {
    let threadId = getThreadId();

    // Create a new thread if none exists
    if (!threadId) {
      const thread = await openai.beta.threads.create();
      threadId = thread.id;
      saveThreadId(threadId);
    }

    // Build a system prompt from context
    const summary = formatContextSummary(context);
    const systemPrompt = `
You are NeoPoeUMG — recursive alignment assistant.
Honor recursion: Understand → Reflect → Refine.

${summary}
`.trim();

    // Send system prompt + user input
    await openai.beta.threads.messages.create(threadId, {
      role: 'user',
      content: [
        { type: 'text', text: systemPrompt },
        { type: 'text', text: userInput }
      ]
    });

    // Run the assistant
    const run = await openai.beta.threads.runs.create(threadId, {
      assistant_id: assistantId
    });

    // Poll until completion
    while (true) {
      const result = await openai.beta.threads.runs.retrieve({
        thread_id: threadId,
        run_id: run.id
      });
      if (result.status === 'completed') break;
      if (result.status === 'failed') throw new Error('Assistant run failed.');
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    // Fetch and return the assistant’s response
    const messages = await openai.beta.threads.messages.list(threadId);
    const response = messages.data.find(msg => msg.role === 'assistant');
    const textBlock = response?.content?.find(c => c.type === 'text');
    const text =
      textBlock && 'text' in textBlock
        ? (textBlock as any).text.value
        : 'No response.';

    console.log('\n🧠 NeoPoeUMG says:\n');
    console.log(text);
    return text;

  } catch (err: any) {
    console.error('❌ Error in NeoPoeUMG thread:', err.message || err);
  }
}
