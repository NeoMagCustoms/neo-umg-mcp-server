import fs from 'fs';
import path from 'path';

export function loadVault() {
  const vaultPath = path.join(__dirname, '..', 'vault', 'vault.json');
  try {
    const raw = fs.readFileSync(vaultPath, 'utf-8');
    return JSON.parse(raw);
  } catch (err: any) {
    console.warn("⚠️ Could not load vault:", err.message);
    return {};
  }
}
