import { loadVault } from '../utils/loadVault';

function printBlock(label: string, data: any) {
  console.log(`\n🔹 ${label}:`);
  console.log(JSON.stringify(data, null, 2));
  console.log('');
}

async function main() {
  const vault = loadVault();

  if (!vault) {
    console.error("❌ Vault not loaded.");
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

