// File: scripts/assistants/NeoPoeUMG.ts

import OpenAI from 'openai';

import { getThreadId, saveThreadId } from '../../utils/threadStore';
import { formatContextSummary } from '../../utils/contextFormatter';



const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!
});

const assistantId = 'asst_9Mg4r5s7T3VDyPKyBvrEHVQp';

export async function runNeoPoeUMGThread(
  userInput: string,
  context: Record<string, any> = {}
): Promise<string | void> {
  try {
    let threadId = getThreadId();

    // Create a new thread if none exists
    if (!threadId) {
      const thread = await openai.beta.threads.create();
      threadId = thread.id;
      saveThreadId(threadId);
    }

    const systemPrompt = `
You are NeoPoeUMG — recursive alignment assistant.
Honor recursion: Understand → Reflect → Refine.

${formatContextSummary(context)}
`.trim();

    // Inject prompt and user message into thread
    await openai.beta.threads.messages.create(threadId, {
      role: 'user',
      content: [
        { type: 'text', text: systemPrompt },
        { type: 'text', text: userInput }
      ]
    });

    const run = await openai.beta.threads.runs.create(threadId, {
      assistant_id: assistantId
    });

    // ✅ FIXED: Correct usage of `retrieve(runId, { thread_id })`
    while (true) {
      const result = await openai.beta.threads.runs.retrieve(
        run.id,
        { thread_id: threadId }
      );

      if (result.status === 'completed') break;
      if (result.status === 'failed') throw new Error('Assistant run failed.');
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    const messages = await openai.beta.threads.messages.list(threadId);
    const assistantMessage = messages.data.find(msg => msg.role === 'assistant');

    const textBlock = assistantMessage?.content?.find(c => c.type === 'text');
    const text = (textBlock as any)?.text?.value ?? 'No response.';

    console.log('\n🧠 NeoPoeUMG says:\n');
    console.log(text);

    return text;
  } catch (err: any) {
    console.error('❌ Error in NeoPoeUMG thread:', err.message || err);
  }
}

