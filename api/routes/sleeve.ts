import { Router } from 'express';

const router = Router();

router.get('/', (req, res) => {
  try {
    const vault = (req as any).vault;

    if (!vault || !vault.PoeSleeve) {
      return res.status(404).json({ error: 'Sleeve not found in vault.' });
    }

    res.json(vault.PoeSleeve);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to load sleeve.', detail: err.message });
  }
});

export default router;
