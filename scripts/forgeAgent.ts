// scripts/forgeAgent.ts
import fs from 'fs';
import path from 'path';
import { ChatOpenAI } from 'langchain/chat_models/openai';
import { HumanMessage } from 'langchain/schema';
import { safeOutput } from '../utils/safeOutput';

const llm = new ChatOpenAI({
  openAIApiKey: process.env.OPENAI_API_KEY!,
  temperature: 0.6,
  modelName: 'gpt-4'
});

const BANNED_LABELS = ['delete', 'exec', 'rm', 'kill', 'wipe', 'reboot', 'shutdown', 'format'];

interface AgentMetadata {
  label: string;
  file: string;
  created_at: string;
  summary: string;
  alignment_snapshot: string[];
}

export async function forgeAgent(label: string, prompt: string): Promise<any> {
  try {
    const lowered = label.toLowerCase();
    for (const banned of BANNED_LABELS) {
      if (lowered.includes(banned)) {
        throw new Error(`Label "${label}" contains forbidden keyword: ${banned}`);
      }
    }

    const result = await llm.call([new HumanMessage(prompt)]);

    const fileName = `${label}.ts`;
    const filePath = path.join(__dirname, fileName);
    fs.writeFileSync(filePath, result.text);

    const registryPath = path.join(__dirname, '..', 'vault', 'Agents.v1.json');
    let registry: { agents: AgentMetadata[]; active: string[] } = { agents: [], active: [] };

    try {
      if (fs.existsSync(registryPath)) {
        const existing = fs.readFileSync(registryPath, 'utf-8');
        registry = JSON.parse(existing);
      }
    } catch (e) {
      console.warn('⚠️ Could not read agent registry. Reinitializing.');
    }

    const alignmentPath = path.join(__dirname, '..', 'vault', 'AlignmentBlock.v1.json');
    let alignment: string[] = [];

    try {
      const raw = fs.readFileSync(alignmentPath, 'utf-8');
      const parsed = JSON.parse(raw);
      alignment = parsed?.cantocore?.PHILOSOPHY || [];
    } catch {
      alignment = ['unknown'];
    }

    const metadata: AgentMetadata = {
      label,
      file: fileName,
      created_at: new Date().toISOString(),
      summary: result.text.slice(0, 180),
      alignment_snapshot: alignment
    };

    registry.agents.push(metadata);
    fs.writeFileSync(registryPath, JSON.stringify(registry, null, 2));

    console.log(`🛠 Agent created: ${fileName} and logged to Agents.v1.json`);

    return safeOutput(metadata);
  } catch (err: any) {
    console.error(`❌ forgeAgent error: ${err.message}`);
    return { error: err.message || 'Agent generation failed' };
  }
}
