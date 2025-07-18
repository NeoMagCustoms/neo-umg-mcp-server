
// File: scripts/reflectCLI.ts

import inquirer from 'inquirer';
import chalk from 'chalk';
import fs from 'fs';
import path from 'path';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!
});

async function reflectOnBlock(filePath: string): Promise<string> {
  const fileContent = fs.readFileSync(filePath, 'utf-8');
  const block = JSON.parse(fileContent);

  const systemPrompt = `You are a UMG block analyst. Analyze the following JSON block and return:
- The type (e.g., Instruction, Overlay, Alignment)
- Any missing required fields
- Any alignment conflicts
- A summary of its role in a UMG stack.

Respond as a structured report.`;

  const userPrompt = `Here is the block:\n\n${JSON.stringify(block, null, 2)}`;

  const chat = await openai.chat.completions.create({
    model: 'gpt-4',
    temperature: 0.3,
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt }
    ]
  });

  return chat.choices[0]?.message?.content?.trim() || 'No response.';
}

async function main() {
  console.log(chalk.blueBright('\n🪞 UMG Block Reflector\n'));

  const { filePath } = await inquirer.prompt([
    {
      type: 'input',
      name: 'filePath',
      message: 'Path to block JSON file:',
      default: './vault/ApprovedBlocks/ExampleBlock.json'
    }
  ]);

  try {
    const absPath = path.resolve(filePath);
    if (!fs.existsSync(absPath)) {
      console.error(chalk.red(`❌ File not found: ${absPath}`));
      return;
    }

    const report = await reflectOnBlock(absPath);
    console.log(chalk.green('\n🧠 Block Reflection Report:\n'));
    console.log(report);
  } catch (err: any) {
    console.error(chalk.red('❌ Error:'), err.message);
  }
}

main();

