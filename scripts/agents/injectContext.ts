import { loadVault } from '../../vault/vaultLoader';

export function injectContextPrompt(prompt: string): string {
  const vault = loadVault();

  const overlayKey = vault.OverlayModules?.active;
  const overlay = vault.OverlayModules?.[overlayKey];

  const instructionKey = vault.InstructionLayer?.active;
  const instruction = vault.InstructionLayer?.[instructionKey];

  const philosophyKey = vault.PhilosophyStack?.active;
  const philosophy = vault.PhilosophyStack?.[philosophyKey];

  const alignment = vault.AlignmentBlock?.cantocore?.PHILOSOPHY || ['Unaligned'];
  const mythos = vault.MythosBlock?.MYTHOS?.PURPOSE || 'No declared purpose';

  return `
🧠 UMG Agent Prompt — Injected Context

📜 Alignment: ${alignment.join(', ')}
🎭 Overlay: ${overlayKey || 'None'} — ${overlay?.description || 'No overlay loaded'}
🧱 Instruction: ${instructionKey || 'None'} — ${instruction?.description || 'No instruction'}
📖 Philosophy: ${philosophyKey || 'None'} — ${philosophy?.description || 'No lens applied'}
🌌 Mythos: ${mythos}

— Begin Task —
${prompt}
`.trim();
}

