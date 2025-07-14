// scripts/vaultFixer.ts
import fs from 'fs';
import path from 'path';
import chalk from 'chalk';

const vaultPath = path.join(__dirname, '..', 'vault');

const legacyKeys = ['OVERLAYS', 'INSTRUCTIONS', 'PHILOSOPHIES'];

function transformArrayBlock(key: string, data: any): any {
  const legacyArray = data[key];
  const out: Record<string, any> = {};

  if (!Array.isArray(legacyArray)) return data;

  legacyArray.forEach((entry: string) => {
    const [label, description] = entry.split('->').map(s => s.trim());
    out[label] = { description };
  });

  const active = legacyArray[0]?.split('->')[0]?.trim();

  return {
    active,
    ...out
  };
}

function fixVaultFiles() {
  const files = fs.readdirSync(vaultPath).filter(f => f.endsWith('.json'));

  files.forEach((file) => {
    const fullPath = path.join(vaultPath, file);
    const content = fs.readFileSync(fullPath, 'utf-8');
    const json = JSON.parse(content);

    let changed = false;

    legacyKeys.forEach((legacyKey) => {
      if (json[legacyKey]) {
        console.log(chalk.yellow(`🔧 Fixing ${legacyKey} in ${file}`));
        const fixed = transformArrayBlock(legacyKey, json);
        Object.assign(json, fixed);
        delete json[legacyKey];
        changed = true;
      }
    });

    if (changed) {
      fs.writeFileSync(fullPath, JSON.stringify(json, null, 2), 'utf-8');
      console.log(chalk.green(`✅ Updated: ${file}`));
    }
  });
}

fixVaultFiles();
