import { loadVault } from './vaultLoader';

const vault = loadVault();

console.log('\n🧠 PoeUMG Cognitive Stack Overview\n');

function printBlock(label: string, data: any) {
  console.log(`🔹 ${label}:`);
  console.log(JSON.stringify(data, null, 2));
  console.log('');
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

if (vault.TriggerBlocks?.TRIGGERS) {
  printBlock('TRIGGER BLOCKS', vault.TriggerBlocks.TRIGGERS);
}

console.log('✅ Stack display complete.\n');
