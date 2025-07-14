// scripts/scaffoldCLI.ts
import axios from 'axios';
import inquirer from 'inquirer';
import chalk from 'chalk';

const API_URL = 'http://localhost:3000/scaffold';

async function run() {
  console.log(chalk.greenBright('\n🧱 UMG Scaffold CLI\n'));

  const { goal } = await inquirer.prompt([
    {
      type: 'input',
      name: 'goal',
      message: 'What do you want to scaffold?'
    }
  ]);

  try {
    const response = await axios.post(API_URL, { goal });
    const files: string[] = response.data?.files || [];

    console.log(chalk.cyan('\n✅ Scaffold Complete:'));
    files.forEach((file: string) => console.log('📁', file));
  } catch (err: any) {
    console.error(chalk.red('❌ Scaffold failed:'), err.message);
  }
}

run();

