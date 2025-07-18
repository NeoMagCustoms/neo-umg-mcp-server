// File: scripts/talk.ts

import dotenv from "dotenv";
dotenv.config();

import inquirer from "inquirer";
import { fork } from "child_process";
import { v4 as uuid } from "uuid";

// Wrap everything in an async IIFE since top-level await isn't allowed
(async () => {
  const { mode } = await inquirer.prompt([
    {
      name: "mode",
      type: "list",
      message: "🧠 Choose a mode:",
      choices: ["Assistant (Playground-style)", "CLI Agent (Tool-based)"]
    }
  ]);

  const target =
    mode === "Assistant (Playground-style)"
      ? "scripts/assistants/NeoPoeUMG.ts"
      : "scripts/agents/poeRuntimeAgent.ts";

  console.log(`\n🧬 Launching ${mode}...\n`);

  fork(target, [], {
    env: {
      ...process.env,
      SESSION_ID: uuid(),
      OPENAI_API_KEY: process.env.OPENAI_API_KEY || ""
    },
    stdio: "inherit"
  });
})();

