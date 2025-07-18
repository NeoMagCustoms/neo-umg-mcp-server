// File: scripts/assistants/talkNeoPoe.ts

import dotenv from 'dotenv';
dotenv.config();

import fs from 'fs';
import path from 'path';
import inquirer from 'inquirer';
import chalk from 'chalk';
import { runNeoPoeUMGThread } from './NeoPoeUMG';

function getAlignmentPhilosophy(): string[] {
  try {
    const vaultPath = path.join(__dirname, '../../vault/AlignmentBlock.v1.json');
    const raw = fs.readFileSync(vaultPath, 'utf-8');
    const parsed = JSON.parse(raw);
    const alignment = parsed?.cantocore?.PHILOSOPHY;
    if (!Array.isArray(alignment) || alignment.length === 0) throw new Error('Missing');
    return alignment;
  } catch (err: any) {
    console.warn('⚠️ Alignment philosophy not found or invalid:', err.message);
    return [];
  }
}

async function main() {
  const alignment = getAlignmentPhilosophy();
  if (alignment.length === 0) {
    console.error('❌ No valid alignment found. Assistant will not launch.');
    process.exit(1);
  }

  console.log(chalk.cyan('\n🧠 NeoPoeUMG Assistant (Natural Language Mode)\n'));
  console.log(chalk.gray(`📜 Alignment: ${alignment.join(', ')}`));
  console.log(chalk.gray('💬 Type your questions. Type "exit" to quit.\n'));

  while (true) {
    const { input } = await inquirer.prompt([
      {
        type: 'input',
        name: 'input',
        message: chalk.yellow('🗣 You:')
      }
    ]);

    if (input.trim().toLowerCase() === 'exit') {
      console.log(chalk.green('\n👋 Exiting NeoPoeUMG. Goodbye.\n'));
      break;
    }

    const reply = await runNeoPoeUMGThread(input);
    console.log(chalk.cyan('\n💬 Poe:'));
    console.log(chalk.gray(reply || '[No response]'));
  }

  process.exit(0);
}

main();

