// scripts/poeRuntimeAgent.ts

import dotenv from 'dotenv';
dotenv.config();

import inquirer from 'inquirer';
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import OpenAI from 'openai';
import chalk from 'chalk';
import { injectContextPrompt } from './injectContext';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!
});

const agentsPath = path.join(__dirname);

const actions = {
  scaffold: () => execSync('npm run scaffold', { stdio: 'inherit' }),
  reflect: () => execSync('npm run reflect-agent', { stdio: 'inherit' }),
  clean: () => execSync('npm run clean-code', { stdio: 'inherit' }),
  push: () => execSync('npm run push-poe', { stdio: 'inherit' }),
  organize: () => execSync('ts-node scripts/repoOrganizerAgent.ts', { stdio: 'inherit' })
};

async function decideAction(goal: string): Promise<{ action: string; file?: string }> {
  const prompt = injectContextPrompt(goal);

  const chat = await openai.chat.completions.create({
    model: 'gpt-4',
    temperature: 0.4,
    messages: [
      {
        role: 'system',
        content: `You are Poe, an intelligent recursive agent controller.
You manage tools that can reflect on agents, scaffold new ones, clean code, push changes, or reorganize the system.
Given a goal, reply in JSON ONLY:
{ "action": "scaffold" | "reflect" | "clean" | "push" | "organize", "file": "optional.ts" }

Only choose one action. If you're unsure, prefer "reflect".
Don't explain yourself.`
      },
      { role: 'user', content: prompt }
    ]
  });

  try {
    return JSON.parse(chat.choices[0].message.content || '');
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

  const fn = actions[decision.action as keyof typeof actions];
  if (fn) {
    fn();
  } else {
    console.log(chalk.red('❌ Unknown action. No tool executed.'));
  }
}

main();

