// scripts/repoReflectorAgent.ts




import fs from 'fs';
import path from 'path';
import OpenAI from 'openai';
import chalk from 'chalk';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

const foldersToScan = ['scripts', 'api', 'vault'];

function getFileContent(filePath: string): string {
  try {
    return fs.readFileSync(filePath, 'utf-8');
  } catch {
    return '';
  }
}

function gatherRepoFiles(): string {
  let combined = '';

  for (const folder of foldersToScan) {
    const fullPath = path.join(__dirname, '..', folder);
    if (!fs.existsSync(fullPath)) continue;

    const files = fs
      .readdirSync(fullPath)
      .filter(f => f.endsWith('.ts') || f.endsWith('.json'));

    for (const file of files) {
      const filePath = path.join(fullPath, file);
      const content = getFileContent(filePath);
      combined += `\n--- FILE: ${folder}/${file} ---\n${content}\n`;
    }
  }

  return combined;
}

async function reflectRepo() {
  console.log(chalk.blueBright('\n🧠 Reflecting on your UMG Repo...\n'));

  const fullCode = gatherRepoFiles();
  const context = fullCode.slice(0, 15000); // truncate for token safety

  const chat = await openai.chat.completions.create({
    model: 'gpt-4',
    temperature: 0.4,
    messages: [
      {
        role: 'system',
        content: `You are an expert software refactoring agent.
Your task is to review the codebase of a modular GPT-based system.
You will receive full source files across scripts, vault, and routes.
Return a summary including:

- What this project does
- How the agents and CLI tools work
- Which files are broken, wrong language, or unsafe
- What structure or cleanup is needed
- Specific next steps (e.g., "Reflect builderAgent.ts", "Delete broken plan X", "Fix vault keys")`
      },
      {
        role: 'user',
        content: context
      }
    ]
  });

  console.log(chalk.greenBright('\n🧠 Repo Reflection:\n'));
  console.log(chat.choices[0].message.content || 'No output.');
}

reflectRepo();

