// scripts/runOrchestrator.ts
import fs from 'fs';
import path from 'path';
import { forgeAgent } from './forgeAgent';
import { loadVault } from './vaultLoader'; // ✅ updated path

type AgentStep = {
  label: string;
  prompt: (goal: string) => string;
};

// 🔐 Load vault data (mythos, alignment)
const vault = loadVault();
const mythos = vault?.MythosBlock?.MYTHOS?.PURPOSE || 'Build aligned modular agents';
const alignment = vault?.AlignmentBlock?.cantocore?.PHILOSOPHY || [];

// 🧱 Modular plan with prompts
const agentPlan: AgentStep[] = [
  {
    label: 'plannerAgent',
    prompt: (goal) => `You are a UMG-aligned planner. Break down "${goal}" into modular steps.`
  },
  {
    label: 'scaffoldAgent',
    prompt: (goal) => `Create folder structure and scaffolding for: "${goal}".`
  },
  {
    label: 'builderAgent',
    prompt: (goal) => `Write core logic to accomplish the goal: "${goal}".`
  },
  {
    label: 'docAgent',
    prompt: (goal) => `Generate README.md and internal docs for: "${goal}".`
  },
  {
    label: 'commitAgent',
    prompt: (goal) => `Write Git commit messages and changelog for: "${goal}".`
  }
];

// 🛠️ Core orchestrator function
export async function runOrchestrator(goal: string, silent = false) {
  const sanitized = goal.replace(/\s+/g, '_');
  const planDir = path.join(__dirname, '..', 'plans');
  if (!fs.existsSync(planDir)) fs.mkdirSync(planDir);
  const planFile = path.join(planDir, `${sanitized}.json`);
  const fullLog: any[] = [];

  if (!silent) {
    console.log(`\n🧠 Running orchestrator for goal: "${goal}"`);
    console.log(`📜 Alignment: ${alignment.join(', ')}`);
    console.log(`📖 Mythos: ${mythos}\n`);
  }

  for (const step of agentPlan) {
    if (!silent) console.log(`⚙️ ${step.label}...`);
    const prompt = step.prompt(goal);
    const result = await forgeAgent(step.label, prompt);
    fullLog.push({ step: step.label, prompt, result });
    if (!silent) console.log(`✅ ${step.label} complete: ${result.message || 'OK'}\n`);
  }

  fs.writeFileSync(planFile, JSON.stringify(fullLog, null, 2));
  if (!silent) console.log(`🗃️ Plan saved to: ${planFile}`);
}

