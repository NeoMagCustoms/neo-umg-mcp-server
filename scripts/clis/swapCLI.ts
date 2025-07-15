// scripts/swapCLI.ts
import fs from 'fs';
import path from 'path';
import inquirer from 'inquirer';
import chalk from 'chalk';

const vaultPath = path.join(__dirname, '..', 'vault');
const overlayPath = path.join(vaultPath, 'OverlayModules.v1.json');
const instructionPath = path.join(vaultPath, 'InstructionLayer.v1.json');

function loadJSON(filePath: string): any {
  if (!fs.existsSync(filePath)) return {};
  return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
}

function saveJSON(filePath: string, data: any) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
}

async function main() {
  console.log(chalk.blueBright('\n🧠 UMG Stack Swapper CLI\n'));

  const overlays = loadJSON(overlayPath);
  const instructions = loadJSON(instructionPath);

  const overlayKeys = Object.keys(overlays || {});
  const instructionKeys = Object.keys(instructions || {});

  const { type } = await inquirer.prompt([
    {
      type: 'list',
      name: 'type',
      message: 'What do you want to swap?',
      choices: ['Overlay', 'Instruction']
    }
  ]);

  const source = type === 'Overlay' ? overlays : instructions;
  const filePath = type === 'Overlay' ? overlayPath : instructionPath;

  const { selected } = await inquirer.prompt([
    {
      type: 'list',
      name: 'selected',
      message: `Choose a ${type} module to activate:`,
      choices: Object.keys(source)
    }
  ]);

  const updated = { active: selected, ...source };
  saveJSON(filePath, updated);

  console.log(chalk.green(`\n✅ Swapped ${type} stack to: ${selected}`));
}

main();
