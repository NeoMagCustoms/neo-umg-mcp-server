// scripts/uploadCLI.ts
import fs from 'fs';
import path from 'path';
import inquirer from 'inquirer';
import chalk from 'chalk';
import { z } from 'zod';

const approvedPath = path.join(__dirname, '..', 'vault', 'ApprovedBlocks');

const blockSchema = z.object({
  label: z.string(),
  molt_type: z.string(),
  description: z.string().optional(),
  tags: z.array(z.string()).optional(),
  snap_config: z.any().optional(),
  ledger: z.any().optional()
});

function validateBlock(filePath: string): { valid: boolean; data?: any; error?: string } {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    const json = JSON.parse(content);
    const result = blockSchema.safeParse(json);

    if (!result.success) {
      return { valid: false, error: JSON.stringify(result.error.format(), null, 2) };
    }

    return { valid: true, data: json };
  } catch (err: any) {
    return { valid: false, error: err.message };
  }
}

async function main() {
  console.log(chalk.cyan('\n📤 UMG Block Uploader\n'));

  const { filePath } = await inquirer.prompt([
    {
      type: 'input',
      name: 'filePath',
      message: 'Path to block file to upload:',
      default: './vault/ApprovedBlocks/MyNewBlock.json'
    }
  ]);

  const absPath = path.resolve(filePath);
  if (!fs.existsSync(absPath)) {
    console.error(chalk.red('❌ File not found.'));
    return;
  }

  const result = validateBlock(absPath);

  if (!result.valid) {
    console.error(chalk.red('\n❌ Block failed validation:\n'));
    console.error(result.error);
    return;
  }

  const { label } = result.data;
  const destPath = path.join(approvedPath, `${label}.json`);
  fs.copyFileSync(absPath, destPath);

  console.log(chalk.green(`\n✅ Block "${label}" uploaded successfully to ApprovedBlocks.\n`));
}

main();
