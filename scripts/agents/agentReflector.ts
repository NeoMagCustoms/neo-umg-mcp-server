// scripts/agentReflector.ts
import dotenv from 'dotenv';
dotenv.config();

import fs from 'fs';
import path from 'path';
import inquirer from 'inquirer';
import { ChatOpenAI } from 'langchain/chat_models/openai';
import { HumanMessage, SystemMessage } from 'langchain/schema';
import chalk from 'chalk';

const agentDir = path.join(__dirname);
const agentFiles = fs.readdirSync(agentDir).filter(file =>
  file.endsWith('Agent.ts') && !file.includes('Reflector')
);

async function reflectAgent(fileName: string) {
  const filePath = path.join(agentDir, fileName);
  const raw = fs.readFileSync(filePath, 'utf8');

  const llm = new ChatOpenAI({
    temperature: 0.4,
    modelName: 'gpt-4',
    openAIApiKey: process.env.OPENAI_API_KEY!
  });

  const messages = [
    new SystemMessage(
      `You are an AI agent code reviewer. 
      Your job is to analyze the following TypeScript agent file, explain what it does,
      and then suggest a cleaner, more functional rewrite if necessary.
      Do not return Markdown. Just return raw updated TypeScript code.`
    ),
    new HumanMessage(`Here is the agent file "${fileName}":\n\n${raw}`)
  ];

  const response = await llm.call(messages);

  const cleanedFileName = fileName.replace('.ts', '_reflected.ts');
  const cleanedPath = path.join(agentDir, cleanedFileName);
  fs.writeFileSync(cleanedPath, response.text.trim());

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
