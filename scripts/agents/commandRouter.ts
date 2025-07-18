import fs from 'fs';
import path from 'path';
import { loadVault } from '../utils/loadVault';
import { scanRepo } from './repoScanner';

/**
 * Interpret a plain‑English command and perform the corresponding
 * operation.  Commands can be used to query the current vault state,
 * describe files from the RepoIndex, or trigger a repository scan.
 *
 * Recognised keywords:
 *  - "stack" → return the active stack (ActiveStack or MetaMOLTStack)
 *  - "instruction" or "instructions" → return the instruction layer
 *  - "memory" → return a summary of instructions, overlays and mythos
 *  - "sleeve" → return the current Poe sleeve
 *  - "overlay" or "overlays" → return the list of overlay modules
 *  - "scan" → regenerate RepoIndex.v1.json and acknowledge
 *  - "describe <keyword>" → return the RepoIndex entry for a file
 *
 * All other input returns a fallback message.
 */
export async function commandRouter(command: string): Promise<string> {
  const normalized = command.toLowerCase().trim();
  const vault = loadVault();
  // Show the current logic stack
  if (normalized.includes('stack')) {
    const stack = vault.ActiveStack || vault.MetaMOLTStack || {};
    return JSON.stringify(stack, null, 2);
  }
  // Show the instruction layer
  if (normalized.includes('instruction')) {
    return JSON.stringify(vault.InstructionLayer?.INSTRUCTIONS || [], null, 2);
  }
  // Show a memory summary
  if (normalized.includes('memory')) {
    const summary = {
      instructionCount: vault?.InstructionLayer?.INSTRUCTIONS?.length || 0,
      overlays: vault?.OverlayModules?.OVERLAYS || [],
      mythos: vault?.MythosBlock?.MYTHOS?.PURPOSE || 'Unknown'
    };
    return JSON.stringify(summary, null, 2);
  }
  // Show the current sleeve
  if (normalized.includes('sleeve')) {
    return JSON.stringify(vault.PoeSleeve || {}, null, 2);
  }
  // Show the overlays
  if (normalized.includes('overlay')) {
    return JSON.stringify(vault.OverlayModules?.OVERLAYS || [], null, 2);
  }
  // Run a repository scan
  if (normalized.includes('scan')) {
    await scanRepo(path.resolve(__dirname, '../..'));
    return '✅ Repository scanned and RepoIndex updated.';
  }
  // Describe a specific file in the repo
  if (normalized.startsWith('describe')) {
    const parts = normalized.split(' ').filter(Boolean);
    const keyword = parts.slice(1).join(' ');
    const repoRoot = path.resolve(__dirname, '../..');
    const indexPath = path.join(repoRoot, 'vault', 'RepoIndex.v1.json');
    if (!fs.existsSync(indexPath)) {
      return '❌ RepoIndex not found. Run scan first.';
    }
    const index = JSON.parse(fs.readFileSync(indexPath, 'utf-8'));
    const match = index.files.find((f: any) => f.path.includes(keyword));
    if (!match) {
      return `❌ No file matching "${keyword}" found in RepoIndex.`;
    }
    return JSON.stringify(match, null, 2);
  }
  return '❓ Command not recognized.';
}