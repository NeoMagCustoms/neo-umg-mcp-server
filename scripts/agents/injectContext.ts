import { loadVault } from '../../utils/loadVault'; // ✅ Unified vault loader

type RepoIndexFile = {
  path: string;
  type: string;
  size: number;
};

export function injectContextPrompt(prompt: string): string {
  const vault = loadVault();

  const overlayKey = vault?.OverlayModules?.active;
  const overlay = vault?.OverlayModules?.[overlayKey];

  const instructionKey = vault?.InstructionLayer?.active;
  const instruction = vault?.InstructionLayer?.[instructionKey];

  const philosophyKey = vault?.PhilosophyStack?.active;
  const philosophy = vault?.PhilosophyStack?.[philosophyKey];

  const alignment = vault?.AlignmentBlock?.cantocore?.PHILOSOPHY ?? ['Unaligned'];
  const mythos = vault?.MythosBlock?.MYTHOS?.PURPOSE ?? 'No declared purpose';

  const repoIndex = vault?.RepoIndex;
  const fileCount = repoIndex?.total || 0;

  let folderSummary = '';
  if (repoIndex?.files) {
    const folderMap: Record<string, number> = {};
    (repoIndex.files as RepoIndexFile[]).forEach((f) => {
      const folder = f.path.split('/')[0] || 'root';
      folderMap[folder] = (folderMap[folder] || 0) + 1;
    });

    const sorted = Object.entries(folderMap).sort((a, b) => b[1] - a[1]);
    folderSummary = sorted
      .map(([folder, count]) => `📁 ${folder}: ${count} files`)
      .join('\n');
  }

  return `
🧠 UMG Agent Prompt — Injected Context

📜 Alignment: ${alignment.join(', ')}
🎭 Overlay: ${overlayKey || 'None'} — ${overlay?.description || 'No overlay loaded'}
🧱 Instruction: ${instructionKey || 'None'} — ${instruction?.description || 'No instruction'}
📖 Philosophy: ${philosophyKey || 'None'} — ${philosophy?.description || 'No lens applied'}
🌌 Mythos: ${mythos}

📂 Repo Index: ${fileCount} files scanned
${folderSummary}

— Begin Task —
${prompt}
`.trim();
}

