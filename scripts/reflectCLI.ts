// scripts/reflectCLI.ts
import inquirer from 'inquirer';
import chalk from 'chalk';
import fs from 'fs';
import path from 'path';
import { ChatOpenAI } from 'langchain/chat_models/openai';
import { HumanMessage, SystemMessage } from 'langchain/schema';

async function reflectOnBlock(filePath: string): Promise<string> {
  const fileContent = fs.readFileSync(filePath, 'utf-8');
  const block = JSON.parse(fileContent);

  const llm = new ChatOpenAI({
    temperature: 0.3,
    modelName: 'gpt-4',
    openAIApiKey: process.env.OPENAI_API_KEY!
  });

  const messages = [
    new SystemMessage(
      `You are a UMG block analyst. Analyze the following JSON block and return:
- The type (e.g., Instruction, Overlay, Alignment)
- Any missing required fields
- Any alignment conflicts
- A summary of its role in a UMG stack.

Respond as a structured report.`
    ),
    new HumanMessage(`Here is the block:\n\n${JSON.stringify(block, null, 2)}`)
  ];

  const response = await llm.call(messages);
  return response.text.trim();
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

