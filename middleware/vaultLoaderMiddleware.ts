import { Request, Response, NextFunction } from 'express';
import { loadVault } from '../utils/loadVault'; // ✅ Unified loader

export function vaultLoaderMiddleware(req: Request, res: Response, next: NextFunction) {
  try {
    (req as any).vault = loadVault();
    next();
  } catch (error) {
    console.error('❌ Failed to load vault:', error);
    return res.status(500).json({ error: 'Vault loading failed' });
  }
}

