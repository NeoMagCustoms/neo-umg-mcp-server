import readline from 'readline';
import fetch from 'node-fetch';

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

  const body = {
    molt_type: "Instruction",
    label: "forge_agent",
    prompt: input
  };

  try {
    const response = await fetch('http://localhost:3000/query', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });

    const result = await response.json();
    console.log("🧱", result.message || result.result || result.error || result);
  } catch (err) {
    console.error("❌ Error talking to Forge:", err);
  }

  rl.prompt();
});
