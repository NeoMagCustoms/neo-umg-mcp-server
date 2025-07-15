// scripts/codeCleanerAgent.ts
import fs from 'fs';
import path from 'path';
import chalk from 'chalk';

const generatedFiles = [
  'builderAgent.ts',
  'plannerAgent.ts',
  'scaffoldAgent.ts',
  'docAgent.ts',
  'commitAgent.ts'
];

function cleanPythonSyntax(text: string): string {
  return text
    .replace(/```(python|ts|js)?/g, '') // remove triple backticks
    .replace(/def\s+(\w+)\((.*?)\):/g, 'function $1($2) {') // def to function
    .replace(/self\./g, 'this.')
    .replace(/class\s+(\w+):/g, 'class $1 {') // class syntax
    .replace(/^\s*return\s+/gm, '  return ')
    .replace(/^\s*pass\s*$/gm, '') // remove `pass` lines
    .replace(/^\s*#.*$/gm, '') // remove inline Python comments
    .replace(/\n{2,}/g, '\n\n') // collapse multiple newlines
    .trim();
}

console.log(chalk.cyan('\n🧹 Running Code Cleaner Agent...\n'));

for (const file of generatedFiles) {
  const filePath = path.join(__dirname, file);
  if (!fs.existsSync(filePath)) {
    console.log(chalk.gray(`(skipped) ${file}`));
    continue;
  }

  const raw = fs.readFileSync(filePath, 'utf8');
  const cleaned = cleanPythonSyntax(raw);
  fs.writeFileSync(filePath, cleaned);

  console.log(chalk.green(`✅ Cleaned: ${file}`));
}

console.log(chalk.greenBright('\n🧠 All generated agents cleaned up.\n'));
