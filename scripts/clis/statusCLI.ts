// scripts/statusCLI.ts
import fs from 'fs';
import path from 'path';
import chalk from 'chalk';

const statusFile = path.join(__dirname, '..', 'STATUS.md');
const vaultDir = path.join(__dirname, '..', 'vault');
const scriptsDir = path.join(__dirname, '..', 'scripts');
const plansDir = path.join(__dirname, '..', 'plans');

function listFiles(dirPath: string): string[] {
  if (!fs.existsSync(dirPath)) return [];
  return fs.readdirSync(dirPath).filter(f => f.endsWith('.json') || f.endsWith('.ts'));
}

function section(title: string, files: string[]) {
  return `### ${title}\n\n${files.map(f => `- \`${f}\``).join('\n') || '_None_'}\n`;
}

function writeStatus() {
  const vaultFiles = listFiles(vaultDir).filter(f => f.endsWith('.json'));
  const scriptFiles = listFiles(scriptsDir);
  const planFiles = listFiles(plansDir);

  const content = `# 🧾 UMG MCP Status Snapshot

> Auto-generated system summary — ${new Date().toISOString()}

${section('🧠 Vault Blocks', vaultFiles)}
${section('⚙️ Scripts & CLIs', scriptFiles)}
${section('📋 Plans', planFiles)}

---

Generated by \`statusCLI.ts\`
`;

  fs.writeFileSync(statusFile, content, 'utf-8');
  console.log(chalk.greenBright('\n✅ STATUS.md has been updated!\n'));
}

writeStatus();
