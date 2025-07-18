import { loadVault } from '../../utils/loadVault';

/**
 * Print a labelled block to stdout.  Each block is separated by blank
 * lines for readability.
 */
function printBlock(label: string, data: any) {
  console.log(`\n🔹 ${label}:`);
  console.log(JSON.stringify(data, null, 2));
  console.log('');
}

/**
 * Display the current vault state on the console.  This CLI now
 * consumes the unified `loadVault()` utility rather than reading a
 * monolithic `vault.json` file.  It prints the alignment block, the
 * Meta MOLT stack, the instruction layer, overlay modules and
 * Mythos block if they exist.
 */
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