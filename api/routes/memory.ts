import { Router } from 'express';
import { loadVault } from '../../utils/loadVault';

const router = Router();

router.get('/', (req, res) => {
  try {
    const vault = loadVault();

    const memory = {
      timestamp: new Date().toISOString(),
      alignment: vault.AlignmentBlock,
      instructions: vault.InstructionLayer,
      overlays: vault.OverlayModules,
      mythos: vault.MythosBlock,
      activeStack: vault.MetaMOLT || 'none'
    };

    res.json(memory);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to load vault memory', detail: err.message });
  }
});

export default router;
