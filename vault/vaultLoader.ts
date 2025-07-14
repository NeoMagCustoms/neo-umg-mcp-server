// vault/vaultLoader.ts
import fs from 'fs';
import path from 'path';

const vaultPath = path.join(__dirname);

export function loadVault() {
  const files = fs.readdirSync(vaultPath).filter(f => f.endsWith('.json'));
  const vault: Record<string, any> = {};

  for (const file of files) {
    const key = file.replace('.v1.json', '').replace('.json', '');
    const fullPath = path.join(vaultPath, file);

    try {
      const content = fs.readFileSync(fullPath, 'utf-8');
      vault[key] = JSON.parse(content);
    } catch (err: any) {
      console.warn(`⚠️ Failed to parse ${file}:`, err.message);
    }
  }

  return vault;
}
