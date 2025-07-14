// scripts/orchestratorCore.ts
import { forgeAgent } from './forgeAgent';
import fs from 'fs';
import path from 'path';

type PlanStep = {
  label: string;
  prompt: string;
};

export async function runPlan(plan: PlanStep[], planName = 'generated') {
  const log: any[] = [];
  console.log(`🧠 Starting execution of plan "${planName}"...`);

  for (const step of plan) {
    console.log(`⚙️  Running ${step.label}...`);
    const result = await forgeAgent(step.label, step.prompt);
    log.push({ ...step, result });
    console.log(`✅ ${step.label}: ${result.message}`);
  }

  const plansDir = path.join(__dirname, '..', 'plans');
  if (!fs.existsSync(plansDir)) fs.mkdirSync(plansDir);
  const fullPath = path.join(plansDir, `${planName}_runlog.json`);
  fs.writeFileSync(fullPath, JSON.stringify(log, null, 2));

  console.log(`🗂️ Plan run log saved to: ${fullPath}`);
  return log;
}

