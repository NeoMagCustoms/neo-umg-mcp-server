// middleware/alignmentCheckMiddleware.ts
import { Request, Response, NextFunction } from 'express';
import path from 'path';
import fs from 'fs';

export function alignmentCheckMiddleware(req: Request, res: Response, next: NextFunction) {
  try {
    const vaultPath = path.join(__dirname, '..', 'vault', 'AlignmentBlock.v1.json');
    const raw = fs.readFileSync(vaultPath, 'utf-8');
    const alignmentBlock = JSON.parse(raw);

    const philosophy = alignmentBlock?.cantocore?.PHILOSOPHY;
    if (!philosophy || !Array.isArray(philosophy) || philosophy.length === 0) {
      console.warn('⚠️ Alignment philosophy missing or invalid');
      return res.status(403).json({ error: 'Alignment philosophy not enforced. Request blocked.' });
    }

    // Attach to request for downstream logging if needed
    (req as any).alignment = philosophy;
    next();
  } catch (err: any) {
    console.error('❌ Failed to load AlignmentBlock:', err.message);
    return res.status(500).json({ error: 'Failed to enforce alignment' });
  }
}
