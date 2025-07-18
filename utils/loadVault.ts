// scripts/vaultLoader.ts
import fs from 'fs';
import path from 'path';

const vaultDir = path.resolve(__dirname, '../vault');

export function loadVault(): Record<string, any> {
  const vault: Record<string, any> = {};

  const files = fs.readdirSync(vaultDir).filter(f => f.endsWith('.json'));

  for (const file of files) {
    const filePath = path.join(vaultDir, file);
    const name = path.basename(file, '.json');
    try {
      const data = fs.readFileSync(filePath, 'utf-8');
      vault[name] = JSON.parse(data);
    } catch (err: any) {
      console.warn(`⚠️  Failed to load ${file}:`, err.message);
    }
  }

  return vault;
}

