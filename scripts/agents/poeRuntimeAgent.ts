// File: scripts/agents/poeRuntimeAgent.ts

import dotenv from 'dotenv';
dotenv.config();

import inquirer from 'inquirer';
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import OpenAI from 'openai';
import chalk from 'chalk';
import { injectContextPrompt } from './injectContext';
import { commandRouter } from './commandRouter';

// Initialise OpenAI with the API key from the environment.  The
// Runtime Agent uses this to interpret open‑ended requests when a
// command cannot be handled by the command router.
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!
});

// Define the available agent actions.  These map action names to
// functions invoked by the orchestrator when the model decides to
// scaffold, reflect, clean, etc.  Some actions are currently
// disabled to prevent recursion loops.
const actions = {
  scaffold: () => execSync('npm run scaffold', { stdio: 'inherit' }),
  reflect: () => execSync('npm run reflect-agent', { stdio: 'inherit' }),
  clean: () => execSync('npm run clean-code', { stdio: 'inherit' }),
  push: () => console.log('🛑 push-poe disabled temporarily to prevent loop'),
  organize: () => console.log('🛑 organize disabled temporarily to prevent loop')
};

// Decide which action the agent should take based on a natural language
// goal.  This uses OpenAI to classify the request into one of the
// supported tool names or a chat response.  If the model returns
// invalid JSON, the fallback is to simply chat a polite error.
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

/**
 * Main loop for the Poe Runtime Agent.  Prompts the user for a goal
 * and either routes commands starting with the ✦ prefix to the
 * commandRouter or classifies the goal using OpenAI.  If the result
 * is a chat response, it prints it; otherwise it dispatches a tool.
 */
async function main() {
  console.log(chalk.cyan('\n🤖 Talk to Poe (natural language interface)\n'));
  const { input } = await inquirer.prompt([
    {
      type: 'input',
      name: 'input',
      message: '🗣 What do you want Poe to do?'
    }
  ]);
  const trimmed = input.trim();
  // 🔀 If the user prefixed their request with '✦', route it
  // through the command router instead of invoking the model.  This
  // allows direct access to internal operations such as showing the
  // current stack, scanning the repository or describing a file.
  if (trimmed.startsWith('✦')) {
    const response = await commandRouter(trimmed.substring(1).trim());
    console.log(chalk.cyan('\n📥 Command Router Response:\n'));
    console.log(chalk.gray(response));
    return;
  }
  const decision = await decideAction(trimmed);
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