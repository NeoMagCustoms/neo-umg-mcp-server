// scripts/forgeAgent.ts
import fs from 'fs';
import path from 'path';
import { ChatOpenAI } from 'langchain/chat_models/openai';
import { HumanMessage, SystemMessage } from 'langchain/schema';
import { loadVault } from '../vault/vaultLoader';

const vault = loadVault();
const alignment = vault.AlignmentBlock?.cantocore?.PHILOSOPHY || [];
const mythos = vault.MythosBlock?.MYTHOS || {};
const instructions = vault.InstructionLayer?.INSTRUCTIONS || [];
const overlays = vault.OverlayModules?.OVERLAYS || [];

const llm = new ChatOpenAI({
  temperature: 0.5,
  modelName: 'gpt-4',
  openAIApiKey: process.env.OPENAI_API_KEY!
});

export async function forgeAgent(
  toolName: string,
  taskDescription: string,
  language: 'TypeScript' | 'Python' = 'TypeScript'
) {
  const extension = language === 'Python' ? 'py' : 'ts';
  const fileName = `${toolName}.${extension}`;
  const targetPath = path.join('scripts', fileName);

  const systemPrompt = `
You are Forge, a modular GPT agent forged by PoeUMG alignment protocol.

🧱 Alignment: ${alignment.join(", ")}
📜 Mythos: ${mythos.SIG || "UNKNOWN"} — ${mythos.PURPOSE || "No stated purpose"}
📐 Instructions: ${instructions.join(" | ")}
🎭 Overlays: ${overlays.map((o: string) => o.split("->")[0]).join(", ")}

Your mission:
Create a ${language} script named "${fileName}" inside the /scripts directory.

⚠️ Output only valid executable ${language} code.
❌ Do not include comments, markdown, explanations, or chat formatting.
`.trim();

  const prompt = `Create a ${language} script named "${fileName}" that does the following: ${taskDescription}`;

  try {
    const result = await llm.call([
      new SystemMessage(systemPrompt),
      new HumanMessage(prompt)
    ]);

    fs.writeFileSync(targetPath, result.text.trim());

    return {
      success: true,
      message: `ForgeAgent created: scripts/${fileName}`,
      preview: result.text.slice(0, 300) + '...',
      path: targetPath
    };
  } catch (err: any) {
    return {
      success: false,
      error: err.message || 'Unknown error'
    };
  }
}
