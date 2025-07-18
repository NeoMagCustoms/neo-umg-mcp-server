// File: scripts/clis/stackDisplayCLI.ts

import fs from 'fs';
import path from 'path';

function loadVault(): any | null {
  const vaultPath = path.resolve(__dirname, '..', '..', 'vault', 'vault.json');

  try {
    const raw = fs.readFileSync(vaultPath, 'utf-8');
    const parsed = JSON.parse(raw);
    return parsed;
  } catch (err: any) {
    console.error('❌ Failed to load vault:', err.message);
    return null;
  }
}

function printBlock(label: string, data: any) {
  console.log(`\n🔹 ${label}:`);
  console.log(JSON.stringify(data, null, 2));
  console.log('');
}

function main() {
  const vault = loadVault();

  if (!vault) {
    console.error('🚫 Vault is missing or invalid. Aborting.');
    return;
  }

  if (vault.AlignmentBlock?.cantocore) {
    printBlock('ALIGNMENT BLOCK', vault.AlignmentBlock.cantocore);
  }

  if (vault.MetaMOLTStack?.cantocore) {
    printBlock('META.MOLT.STACK', vault.MetaMOLTStack.cantocore);
  }

  if (vault.InstructionLayer?.INSTRUCTIONS) {
    printBlock('INSTRUCTION LAYER', vault.InstructionLayer.INSTRUCTIONS);
  }

  if (vault.OverlayModules?.OVERLAYS) {
    printBlock('OVERLAY MODULES', vault.OverlayModules.OVERLAYS);
  }

  if (vault.MythosBlock?.MYTHOS) {
    printBlock('MYTHOS BLOCK', vault.MythosBlock.MYTHOS);
  }
}

main();

