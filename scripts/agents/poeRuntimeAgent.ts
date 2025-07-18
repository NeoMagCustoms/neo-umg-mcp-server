// File: scripts/poeRuntimeAgent.ts

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

const actions = {
  scaffold: () => execSync('npm run scaffold', { stdio: 'inherit' }),
  reflect: () => execSync('npm run reflect-agent', { stdio: 'inherit' }),
  clean: () => execSync('npm run clean-code', { stdio: 'inherit' }),
  push: () => console.log('🛑 push-poe disabled temporarily to prevent loop'),
  organize: () => console.log('🛑 organize disabled temporarily to prevent loop')
};

async function decideAction(goal: string): Promise<{
  action: string;
  file?: string;
  content?: string;
}> {
  const prompt = injectContextPrompt(goal);

  const chat = await openai.chat.completions.create({
    model: 'gpt-4',
    temperature: 0.4,
    messages: [
      {
        role: 'system',
        content: `You are Poe, a recursive AI assistant who can use tools or simply respond.

Respond with a JSON object ONLY:
{
  "action": "scaffold" | "reflect" | "clean" | "push" | "organize" | "chat",
  "file"?: "optional.ts",
  "content"?: "Reply message if action is 'chat'"
}

Prefer tools when possible, but use "chat" if the request is exploratory or doesn't match a tool.`
      },
      { role: 'user', content: prompt }
    ]
  });

  const raw = chat.choices[0].message.content || '';
  console.log('\n🧪 Raw GPT Response:\n', raw, '\n');

  try {
    const parsed = JSON.parse(raw);
    if (!parsed.action) throw new Error('No action found in GPT response.');
    return parsed;
  } catch (err) {
    console.warn('⚠️ Failed to parse GPT response. Falling back to chat.');
    return { action: 'chat', content: 'Sorry, I could not understand that request.' };
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

  if (decision.action === 'chat') {
    console.log(chalk.cyan('\n🧠 Poe replies:\n'));
    console.log(chalk.gray(decision.content || '[No response provided]'));
    return;
  }

  console.log(
    chalk.blue(
      `\n🧠 Poe decided: ${decision.action}${decision.file ? ' → ' + decision.file : ''}`
    )
  );

  const fn = actions[decision.action as keyof typeof actions];
  if (fn) {
    fn();
  } else {
    console.log(chalk.red('❌ Unknown action. No tool executed.'));
  }
}

main();

