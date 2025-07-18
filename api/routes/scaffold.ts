import { Router, Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import OpenAI from 'openai';
import { analyzeRepo } from '../../scripts/analyzeRepo';
import { runPlan } from '../../scripts/agents/orchestratorCore';
import { alignmentCheckMiddleware } from '../../middleware/alignmentCheckMiddleware';
import { vaultLoaderMiddleware } from '../../middleware/vaultLoaderMiddleware';

const router = Router();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

const savePlan = (planName: string, data: any) => {
  const plansDir = path.join(__dirname, '..', '..', 'plans');
  if (!fs.existsSync(plansDir)) fs.mkdirSync(plansDir);
  const filePath = path.join(plansDir, `${planName}.json`);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  return filePath;
};

const buildPlanFromGoal = async (goal: string) => {
  const prompt = `Break down the following goal into modular agents with labels and prompts:\n\n${goal}`;
  const result = await openai.chat.completions.create({
    model: 'gpt-4',
    temperature: 0.4,
    messages: [{ role: 'user', content: prompt }]
  });

  try {
    const parsed = JSON.parse(result.choices[0].message.content || '');
    if (!Array.isArray(parsed)) throw new Error("Parsed plan is not an array.");
    return parsed;
  } catch {
    return [
      { label: 'plannerAgent', prompt: `Plan how to accomplish: ${goal}` },
      { label: 'scaffoldAgent', prompt: `Set up folder structure for: ${goal}` },
      { label: 'builderAgent', prompt: `Build the core logic for: ${goal}` },
      { label: 'docAgent', prompt: `Write docs for: ${goal}` },
      { label: 'commitAgent', prompt: `Create git commits for: ${goal}` }
    ];
  }
};

router.post(
  '/',
  alignmentCheckMiddleware,
  vaultLoaderMiddleware,
  async (req: Request & { vault?: any }, res: Response) => {
    const { goal, plan, analyzeRepo: doAnalyze, path: repoPath = './', mode = 'review' } = req.body;
    const vault = req.vault || {};
    let finalPlan = plan;

    try {
      if (goal) {
        finalPlan = await buildPlanFromGoal(goal);
      } else if (doAnalyze) {
        const analysis = await analyzeRepo(repoPath);
        finalPlan = [{
          label: 'repoFixAgent',
          prompt: `Create a tool that fixes these issues:\n\n${JSON.stringify(analysis, null, 2)}`
        }];
      }

      if (!finalPlan || !Array.isArray(finalPlan)) {
        return res.status(400).json({ error: 'No valid plan provided.' });
      }

      const timestamp = Date.now();
      const planName = goal ? goal.replace(/\s+/g, '_') : `plan_${timestamp}`;
      savePlan(planName, finalPlan);

      if (mode === 'auto') {
        const results = await runPlan(finalPlan, planName);
        return res.json({ mode, plan: finalPlan, results });
      }

      res.json({
        mode: 'review',
        plan: finalPlan,
        alignmentOverlay: vault?.OverlayModules?.active || 'none',
        philosophy: vault?.AlignmentBlock?.cantocore?.PHILOSOPHY || [],
        status: '✅ Plan saved. Use `npm run orchestrate` to execute.'
      });
    } catch (err: any) {
      console.error("❌ Scaffold Error:", err.message);
      res.status(500).json({ error: err.message || 'Internal Server Error' });
    }
  }
);

export default router;



