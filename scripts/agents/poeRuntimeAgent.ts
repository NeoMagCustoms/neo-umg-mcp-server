// scripts/poeRuntimeAgent.ts
import dotenv from 'dotenv';
dotenv.config();

import inquirer from 'inquirer';
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { ChatOpenAI } from 'langchain/chat_models/openai';
import { HumanMessage, SystemMessage } from 'langchain/schema';
import { injectContextPrompt } from './injectContext';
import chalk from 'chalk';

const agentsPath = path.join(__dirname);

const actions = {
  scaffold: () => execSync('npm run scaffold', { stdio: 'inherit' }),
  reflect: () => execSync('npm run reflect-agent', { stdio: 'inherit' }),
  clean: () => execSync('npm run clean-code', { stdio: 'inherit' }),
  push: () => execSync('npm run push-poe', { stdio: 'inherit' }),
  organize: () => execSync('ts-node scripts/repoOrganizerAgent.ts', { stdio: 'inherit' })
};

async function decideAction(goal: string): Promise<{ action: string; file?: string }> {
  const llm = new ChatOpenAI({
    modelName: 'gpt-4',
    temperature: 0.4,
    openAIApiKey: process.env.OPENAI_API_KEY!
  });

  const injectedPrompt = injectContextPrompt(goal);

  const messages = [
    new SystemMessage(`You are Poe, an intelligent recursive agent controller.
You manage tools that can reflect on agents, scaffold new ones, clean code, push changes, or reorganize the system.
Given a goal, reply in JSON ONLY:
{ "action": "scaffold" | "reflect" | "clean" | "push" | "organize", "file": "optional.ts" }

Only choose one action. If you're unsure, prefer "reflect".
Don't explain yourself.`),
    new HumanMessage(injectedPrompt)
  ];

  const result = await llm.call(messages);

  try {
    return JSON.parse(result.text);
  } catch {
    return { action: 'reflect' };
  }
}

async function main() {
  console.log(chalk.cyan('\n🤖 Talk to Poe (natural language interface)\n'));

  const { input } = await inquirer.prompt([
    {
      type: 'input',
      name: 'input',
      message: '🗣 What do you want Poe to do?'
    }
  ]);

  const decision = await decideAction(input);
  console.log(chalk.blue(`\n🧠 Poe decided: ${decision.action}${decision.file ? ' → ' + decision.file : ''}`));

  if (actions[decision.action as keyof typeof actions]) {
    actions[decision.action as keyof typeof actions]();
  } else {
    console.log(chalk.red('❌ Unknown action. No tool executed.'));
  }
}

main();
