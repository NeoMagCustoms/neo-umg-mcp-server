import fs from 'fs';
import path from 'path';
import { loadVault } from './loadVault';

// Type definition for a stack swap request.  A swap can include a new
// overlay to enable, a list of instructions to append, and an
// optional reason.  The reason is logged for later auditing.
type SwapRequest = {
  overlay?: string;
  instructions?: string[];
  reason?: string;
};

/**
 * Update the active vault configuration based on a swap request.  This
 * implementation no longer writes back to a monolithic `vault.json`.  It
 * uses the unified loader to read the current vault and persists changes
 * back to the individual `.v1.json` files where appropriate.  Logs are
 * written to `vault/swapLog.json` to provide an audit trail.
 *
 * The alignment block cannot be modified via a stack swap; attempts to
 * override it will result in an error.  Overlays and instructions are
 * appended if they are not already present.
 */
export function swapStack(swap: SwapRequest) {
  const vault = loadVault();
  const logs: string[] = [];

  // 🔐 Protect Alignment Block – disallow modifications to the core
  // philosophical spine via overlays or instructions.  This ensures the
  // agent remains aligned with its core ethical framework.
  if (
    swap.overlay?.toUpperCase().includes('ALIGNMENT') ||
    swap.instructions?.some(i => i.toUpperCase().includes('PRIMARY'))
  ) {
    return { error: '❌ Attempted to override protected alignment block.' };
  }

  // ✅ Apply a new overlay.  Only append if the overlay is not already
  // present.  Persist the updated overlay list back to the
  // `OverlayModules.v1.json` file so future runs see the new state.
  if (swap.overlay) {
    const overlayEntry = `OVERLAY:${swap.overlay}`;
    const existing = vault.OverlayModules?.OVERLAYS || [];
    if (!existing.includes(overlayEntry)) {
      vault.OverlayModules = {
        ...vault.OverlayModules,
        OVERLAYS: [...existing, overlayEntry]
      };
      logs.push(`✅ Overlay applied: ${overlayEntry}`);
      const overlayFile = path.join(__dirname, '..', 'vault', 'OverlayModules.v1.json');
      fs.writeFileSync(overlayFile, JSON.stringify(vault.OverlayModules, null, 2));
    } else {
      logs.push(`ℹ️ Overlay already active: ${overlayEntry}`);
    }
  }

  // ✅ Apply new instructions.  Append instructions that are not already
  // present.  Persist the updated instruction list back to
  // `InstructionLayer.v1.json` for future use.
  if (swap.instructions?.length) {
    const current = vault.InstructionLayer?.INSTRUCTIONS || [];
    const combined = Array.from(new Set([...current, ...swap.instructions]));
    vault.InstructionLayer = {
      ...vault.InstructionLayer,
      INSTRUCTIONS: combined
    };
    logs.push(`✅ Instructions added: ${swap.instructions.join(', ')}`);
    const instrFile = path.join(__dirname, '..', 'vault', 'InstructionLayer.v1.json');
    fs.writeFileSync(instrFile, JSON.stringify(vault.InstructionLayer, null, 2));
  }

  // 🧠 Log the reason and changes.  Each swap is recorded with a
  // timestamp and the overlays/instructions that were applied.  This
  // provides transparency and traceability for future analysis.
  const note = {
    timestamp: new Date().toISOString(),
    reason: swap.reason || 'Manual StackSwap',
    overlays: swap.overlay ? [swap.overlay] : [],
    instructions: swap.instructions || []
  };
  const logPath = path.join(__dirname, '..', 'vault', 'swapLog.json');
  const existingLog = fs.existsSync(logPath)
    ? JSON.parse(fs.readFileSync(logPath, 'utf-8'))
    : [];
  fs.writeFileSync(logPath, JSON.stringify([note, ...existingLog], null, 2));

  return {
    success: true,
    logs,
    note
  };
}