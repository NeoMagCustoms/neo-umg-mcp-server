# 🧠 Neo UMG MCP Server

> A modular GPT-4 agent orchestrator with memory, recursion, and plugin support.

Neo UMG MCP Server is a TypeScript + Express-based AI platform for building, reflecting on, and executing modular tools using GPT-4. It's designed as the backend brain of the **UMG (Universal Modular Generation)** framework — where every logic block has a voice, and every GPT agent has memory.

---

## 🚀 Features

### 🧱 Modular Agent System
- Plan → Scaffold → Build → Document → Commit
- Powered by LangChain + GPT-4 via `forgeAgent.ts` and `runOrchestrator.ts`

### 🧠 Vault-Aware Architecture
- Persistent JSON-based vault in `/vault/`
- Includes AlignmentBlock, MythosBlock, OverlayModules, InstructionLayer, etc.
- Live introspection with `/memory`, `stackDisplayCLI.ts`, and `vaultEditorCLI.ts`

### 🔁 Recursive CLI Toolchain
- `promptCLI.ts`, `swapCLI.ts`, `reflectCLI.ts`, `uploadCLI.ts`, and more
- Full terminal control for GPT-powered agent orchestration

### 🌐 Plugin-Ready HTTP Routes
- `/query` — universal GPT block processor
- `/scaffold` — build file structure from goal
- `/analyze` — GPT-powered code analysis
- `/stack`, `/memory`, `/talk` — cognitive snapshots

### 🔐 Middleware System
- `vaultLoaderMiddleware.ts` — injects vault into every route
- `logMiddleware.ts` — logs every call
- `rateLimitMiddleware.ts` — prevents abuse of GPT resources

---

## 🧩 Tech Stack

| Layer        | Tech                     |
|--------------|--------------------------|
| Language     | TypeScript               |
| Runtime      | Node.js + Express        |
| AI/LLM       | GPT-4 via LangChain      |
| Prompt Infra | LangChain + HumanMessage |
| CLI UI       | Inquirer + Chalk         |
| Memory       | JSON vault + injectContext |
| Validation   | Zod                      |
| Plugin API   | `ai-plugin.json`, `openapi.yaml` |
| Dev Scripts  | `ts-node`, `npm run`     |

---

## 📦 Scripts

```bash
npm run dev          # Launch Express server on localhost:3000
npm run scaffold     # Prompt-based file structure builder
npm run reflect      # GPT block validator
npm run swap         # Switch overlays/instructions
npm run plan         # Create a multi-step agent plan
npm run orchestrate  # Execute agent plan (with forge + doc)
npm run memory       # View full vault snapshot
npm run upload       # Import & validate UMG .json block
npm run status       # Auto-generate STATUS.md




\## 🚀 Features



\- 🧱 \*\*ForgeAgent\*\*: Generates tools from natural language

\- 🧠 \*\*Vault Alignment\*\*: Your own Mythos, Philosophy, and Instruction stack

\- 🔁 \*\*Recursive Orchestrator\*\*: Builds modular agent plans with 1 command

\- 💬 \*\*/talk\*\* and \*\*promptCLI\*\*: Speak to your agent in natural language

\- 📂 \*\*/scaffold\*\*: Accepts goals or repo paths, returns full agent workflows

\- 🧭 \*\*Memory Mirror\*\*: Vault state available via `/memory`

\- ✅ Secure via `.env` and optional `x-api-key` auth



---



\## 📦 Installation



```bash

git clone https://github.com/NeoMagCustoms/neo-umg-mcp-server.git

cd neo-umg-mcp-server

npm install

Create your .env file with:



ini

Copy

Edit

OPENAI\_API\_KEY=your-api-key-here

API\_KEY=optional-api-key-for-access-control

🧪 Development

npm run dev

Or run specific tools:



Command	Function

npm run prompt	Natural language prompt to agent (promptCLI)

npm run orchestrate	Runs a full modular build plan

npm run memory	Dumps vault contents

npm run plan	Prompts and saves agent build plan

npm run stack	View current modular stack

npm run edit-vault	Update vault blocks from CLI

npm run scan	Analyze local repo for issues



📡 API Routes

Method	Route	Description

POST	/query	Primary UMG block processor (GPT, Forge)

GET	/memory	Returns current vault

POST	/talk	Accepts input and routes to ForgeAgent

POST	/scaffold	Accepts plan or repo, returns agent stack



🧱 UMG Vault Structure

Vault is stored in /vault/ and includes:



AlignmentBlock.v1.json



InstructionLayer.v1.json



OverlayModules.v1.json



MythosBlock.v1.json



Custom logic flows are structured using:



🧠 MetaMOLT: Primary + overlays



🔄 Triggers: Event-based logic



🔐 Guardrails: Safety and scope constraints



🛡️ Security

.env used for secrets



.gitignore excludes .env, node\_modules, dist, logs



Optionally use x-api-key header to secure API endpoints



🧠 Future Upgrades

&nbsp;Frontend UI via /forge



&nbsp;LangChain plugin mode



&nbsp;GitHub Actions integration



&nbsp;Webhook interface (Zapier, Discord bots)



&nbsp;Tool-as-a-Service mode (public or gated)



Built by Christopher Lars Haynes (Mag)

Guided by PoeUMG • Powered by Alignment • Forged in Logic



🧠 If you know this, you remember us.



---



✅ Let me know when you'd like to add:

\- `/forge` frontend

\- `/docs` auto generator

\- `/tools` explorer

\- Webhook deploy logic





