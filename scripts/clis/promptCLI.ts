// File: scripts/clis/promptCLI.ts

import readline from 'readline';
import axios from 'axios';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: '> '
});

console.log("🧠 Poe PromptCLI loaded. Type a command and hit enter:");
rl.prompt();

rl.on('line', async (line) => {
  const input = line.trim();
  if (!input) {
    rl.prompt();
    return;
  }

  const block = {
    molt_type: 'Instruction',
    label: 'forge_agent',
    label_to_create: 'prompt_tool',
    prompt: input
  };

  try {
    const response = await axios.post('http://localhost:3000/query', block, {
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.API_KEY || ''
      }
    });

    const result = response.data;
    console.log("🧱", result.message || result.result || result.error || result);
  } catch (err: any) {
    console.error("❌ PromptCLI Error:", err.message);
  }

  rl.prompt();
});

