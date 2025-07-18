import { Router } from 'express';

const router = Router();

router.get('/', (req, res) => {
  try {
    const vault = (req as any).vault;

    if (!vault) {
      return res.status(500).json({ error: 'Vault not loaded into request.' });
    }

    const memory = {
      instructionCount: vault?.InstructionLayer?.INSTRUCTIONS?.length || 0,
      overlays: vault?.OverlayModules?.OVERLAYS?.map((o: { label: string }) => o.label) || [],
      mythosPurpose: vault?.MythosBlock?.MYTHOS?.PURPOSE || 'Unknown'
    };

    res.json(memory);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to load memory.', detail: err.message });
  }
});

export default router;

