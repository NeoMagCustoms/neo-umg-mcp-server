


import fs from 'fs';
import path from 'path';
import { OpenAI } from 'openai';
import { safeOutput } from '../../utils/safeOutput';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

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

    const chat = await openai.chat.completions.create({
      model: 'gpt-4',
      temperature: 0.5,
      messages: [
        {
          role: 'system',
          content: 'You are a code generator. Only return raw code with no explanation.'
        },
        {
          role: 'user',
          content: prompt
        }
      ]
    });

    const content = chat.choices?.[0]?.message?.content || '// No content returned.';
    const fileName = `${label}.ts`;
    const filePath = path.join(__dirname, fileName);
    fs.writeFileSync(filePath, content);

    const registryPath = path.join(__dirname, '..', '..', 'vault', 'Agents.v1.json');
    let registry: { agents: AgentMetadata[]; active: string[] } = { agents: [], active: [] };

    if (fs.existsSync(registryPath)) {
      try {
        const existing = fs.readFileSync(registryPath, 'utf-8');
        registry = JSON.parse(existing);
      } catch {
        console.warn('⚠️ Could not read agent registry. Reinitializing.');
      }
    }

    const alignmentPath = path.join(__dirname, '..', '..', 'vault', 'blocks', 'AlignmentBlock.v1.json');
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
      summary: content.slice(0, 180),
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

