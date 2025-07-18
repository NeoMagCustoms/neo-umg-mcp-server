// scripts/agentReflector.ts
import dotenv from 'dotenv';
dotenv.config();

import fs from 'fs';
import path from 'path';
import inquirer from 'inquirer';
import OpenAI from 'openai';
import chalk from 'chalk';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

const agentDir = path.join(__dirname);
const agentFiles = fs
  .readdirSync(agentDir)
  .filter(file => file.endsWith('Agent.ts') && !file.includes('Reflector'));

async function reflectAgent(fileName: string) {
  const filePath = path.join(agentDir, fileName);
  const raw = fs.readFileSync(filePath, 'utf8');

  const systemPrompt = `
You are an AI agent code reviewer.
Analyze the following TypeScript agent file, explain what it does,
and rewrite it to be cleaner and more functional if needed.
Return raw updated TypeScript code only (no markdown).
`;

  const completion = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [
      { role: 'system', content: systemPrompt.trim() },
      { role: 'user', content: `Here is the agent file "${fileName}":\n\n${raw}` }
    ],
    temperature: 0.4
  });

  const cleanedFileName = fileName.replace('.ts', '_reflected.ts');
  const cleanedPath = path.join(agentDir, cleanedFileName);
  const finalText = completion.choices?.[0]?.message?.content || '// No output generated.';

  fs.writeFileSync(cleanedPath, finalText.trim());
  console.log(chalk.green(`\n✅ Reflection complete. Saved to ${cleanedFileName}\n`));
}

async function main() {
  console.log(chalk.blueBright('\n🔍 UMG Agent Reflector\n'));

  const { selected } = await inquirer.prompt([
    {
      type: 'list',
      name: 'selected',
      message: 'Which agent do you want to reflect on?',
      choices: agentFiles
    }
  ]);

  await reflectAgent(selected);
}

main();

