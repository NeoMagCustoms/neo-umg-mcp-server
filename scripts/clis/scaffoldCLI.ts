// scripts/scaffoldCLI.ts
import axios from 'axios';
import inquirer from 'inquirer';
import chalk from 'chalk';
import dotenv from 'dotenv';
dotenv.config();

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
    const response = await axios.post(
      API_URL,
      {
        goal,
        mode: 'auto'
      },
      {
        headers: {
          'x-api-key': process.env.API_KEY || ''
        }
      }
    );

    const { plan, summary, results, status } = response.data;

    if (plan) {
      console.log(chalk.cyan('\n📦 Plan:'));
      plan.forEach((step: any, i: number) => {
        console.log(`${i + 1}. ${chalk.yellow(step.label)} — ${step.prompt}`);
      });
    }

    if (summary) {
      console.log(chalk.greenBright('\n🧠 Summary:'));
      console.log(summary);
    }

    if (results) {
      console.log(chalk.magenta('\n🔁 Agent Execution Results:'));
      console.log(JSON.stringify(results, null, 2));
    }

    if (status) {
      console.log(chalk.cyan('\n✅ Status:'), status);
    }

  } catch (err: any) {
    console.error(chalk.red('\n❌ Scaffold failed:'), err.message || err);
    if (err.response?.data) {
      console.error(chalk.red('↪ Response:'), JSON.stringify(err.response.data, null, 2));
    }
  }
}

run();
