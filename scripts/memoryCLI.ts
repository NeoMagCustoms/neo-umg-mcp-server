import { loadVault } from './vaultLoader';

const vault = loadVault();

console.log('\n🧠 PoeUMG Vault Memory Overview\n');

if (vault.AlignmentBlock) {
  console.log('🔷 Alignment Block:');
  console.log(JSON.stringify(vault.AlignmentBlock, null, 2));
  console.log('');
}

if (vault.MythosBlock) {
  console.log('📜 Mythos Block:');
  console.log(JSON.stringify(vault.MythosBlock, null, 2));
  console.log('');
}

if (vault.InstructionLayer) {
  console.log('📐 Instruction Layer:');
  console.log(JSON.stringify(vault.InstructionLayer, null, 2));
  console.log('');
}

if (vault.OverlayModules) {
  console.log('🎭 Overlay Modules:');
  console.log(JSON.stringify(vault.OverlayModules, null, 2));
  console.log('');
}

if (vault.MetaMOLTStack) {
  console.log('🧩 MetaMOLT Stack:');
  console.log(JSON.stringify(vault.MetaMOLTStack, null, 2));
  console.log('');
}

if (vault.TriggerBlocks) {
  console.log('🚨 Trigger Blocks:');
  console.log(JSON.stringify(vault.TriggerBlocks, null, 2));
  console.log('');
}
