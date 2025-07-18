import { Router } from 'express';
import { loadVault } from '../../utils/loadVault';

const router = Router();

router.get('/', (req, res) => {
  try {
    const vault = loadVault();

    const stack = {
      PRIMARY: vault?.MetaMOLT?.cantocore?.PRIMARY || 'undefined',
      STACK_ORDER: ['AlignmentBlock', 'InstructionLayer', 'OverlayModules', 'MythosBlock'],
      BLOCKS: {
        AlignmentBlock: vault.AlignmentBlock?.cantocore || null,
        InstructionLayer: vault.InstructionLayer?.INSTRUCTIONS || null,
        OverlayModules: vault.OverlayModules?.OVERLAYS || null,
        MythosBlock: vault.MythosBlock?.MYTHOS || null
      }
    };

    res.json(stack);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to load stack', detail: err.message });
  }
});

export default router;

