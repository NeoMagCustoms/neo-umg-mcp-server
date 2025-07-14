// middleware/vaultLoaderMiddleware.ts
import { Request, Response, NextFunction } from 'express';
import fs from 'fs';
import path from 'path';

function loadVaultMiddleware(req: Request, res: Response, next: NextFunction) {
  try {
    const vaultPath = path.join(__dirname, '../vault');
    const files = fs.readdirSync(vaultPath);
    const vault: Record<string, any> = {};

    for (const file of files) {
      if (file.endsWith('.json')) {
        const raw = fs.readFileSync(path.join(vaultPath, file), 'utf-8');
        vault[file.replace('.v1.json', '').replace('.json', '')] = JSON.parse(raw);
      }
    }

    // ✅ Patched: Safe cast to resolve TS2339
    (req as any).vault = vault;

    next();
  } catch (error) {
    console.error('❌ Failed to load vault:', error);
    return res.status(500).json({ error: 'Vault loading failed' });
  }
}

// ✅ Export with the correct name for consistency
export const vaultLoaderMiddleware = loadVaultMiddleware;
