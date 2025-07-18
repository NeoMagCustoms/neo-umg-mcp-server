import fs from 'fs';
import path from 'path';
import { loadVault } from '../../vault/vaultLoader';

type SwapRequest = {
  overlay?: string;
  instructions?: string[];
  reason?: string;
};

export function swapStack(swap: SwapRequest) {
  const vaultPath = path.join(__dirname, '..', '..', 'vault', 'vault.json');
  const vault = loadVault();

  const logs: string[] = [];

  // 🔐 Protect Alignment Block
  if (swap.overlay?.includes("ALIGNMENT") || swap.instructions?.some(i => i.includes("PRIMARY"))) {
    return { error: "❌ Attempted to override protected alignment block." };
  }

  // ✅ Apply overlay
  if (swap.overlay) {
    const overlayEntry = `OVERLAY:${swap.overlay}`;
    const existing = vault.OverlayModules?.OVERLAYS || [];

    if (!existing.includes(overlayEntry)) {
      vault.OverlayModules = {
        ...vault.OverlayModules,
        OVERLAYS: [...existing, overlayEntry]
      };
      logs.push(`✅ Overlay applied: ${overlayEntry}`);
    } else {
      logs.push(`ℹ️ Overlay already active: ${overlayEntry}`);
    }
  }

  // ✅ Apply instructions
  if (swap.instructions?.length) {
    const current = vault.InstructionLayer?.INSTRUCTIONS || [];
    vault.InstructionLayer = {
      ...vault.InstructionLayer,
      INSTRUCTIONS: Array.from(new Set([...current, ...swap.instructions]))
    };
    logs.push(`✅ Instructions added: ${swap.instructions.join(', ')}`);
  }

  // 🧠 Log reason
  const note = {
    timestamp: new Date().toISOString(),
    reason: swap.reason || "Manual StackSwap",
    overlays: swap.overlay ? [swap.overlay] : [],
    instructions: swap.instructions || []
  };

  const logPath = path.join(__dirname, '..', '..', 'vault', 'swapLog.json');
  const existingLog = fs.existsSync(logPath) ? JSON.parse(fs.readFileSync(logPath, 'utf-8')) : [];
  fs.writeFileSync(logPath, JSON.stringify([note, ...existingLog], null, 2));

  // 💾 Write back
  fs.writeFileSync(vaultPath, JSON.stringify(vault, null, 2));

  return {
    success: true,
    logs,
    note
  };
}

