import { Router, Request, Response } from 'express';
import { alignmentCheckMiddleware } from '../../middleware/alignmentCheckMiddleware';
import { vaultLoaderMiddleware } from '../../middleware/vaultLoaderMiddleware';
import { z } from 'zod';
import OpenAI from 'openai';
import { safeOutput } from '../../utils/safeOutput';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });
const router = Router();

const umgBlockSchema = z.object({
  molt_type: z.string(),
  label: z.string().optional(),
  label_to_create: z.string().optional(),
  description: z.string().optional(),
  prompt: z.string().optional(),
  repo: z.string().optional()
});

router.post(
  '/',
  alignmentCheckMiddleware,
  vaultLoaderMiddleware,
  async (req: Request & { vault?: any }, res: Response) => {
    try {
      const body = req.body;
      const parseResult = umgBlockSchema.safeParse(body);
      if (!parseResult.success) throw new Error("Invalid UMG block input.");

      const block = parseResult.data;
      const vault = req.vault;

      console.log("🧱 Received UMG Block:", block);

      if (block.label === "analyze_repo" && block.repo) {
        const { analyzeRepo } = await import('../../scripts/analyzeRepo');
        const result = await analyzeRepo(block.repo);
        return res.json(safeOutput({
          type: "repo-analysis",
          analysis: result,
          overlays: vault?.OverlayModules?.active,
          alignment: vault?.AlignmentBlock?.cantocore?.PHILOSOPHY
        }));
      }

      if (block.label === "forge_agent" && block.prompt) {
        const { forgeAgent } = await import('../../scripts/agents/forgeAgent');
        const toolName = block.label_to_create || "newTool";
        const result = await forgeAgent(toolName, block.prompt);
        return res.json(safeOutput({
          type: "forge-result",
          ...result,
          overlays: vault?.OverlayModules?.active
        }));
      }

      if (block.prompt) {
        const completion = await openai.chat.completions.create({
          model: 'gpt-4',
          temperature: 0.7,
          messages: [{ role: 'user', content: block.prompt }]
        });

        return res.json(safeOutput({
          type: "gpt-response",
          result: completion.choices[0]?.message?.content,
          philosophy: vault?.AlignmentBlock?.cantocore?.PHILOSOPHY
        }));
      }

      throw new Error("No valid instruction found in UMG block.");
    } catch (error: any) {
      console.error("❌ /query error:", error.message);
      res.status(400).json({ error: error.message || "Unknown error." });
    }
  }
);

export default router;


