// 📝 Filename: sse.ts
// 📁 Save to: neo-umg-mcp-server/api/routes/sse.ts

import express from 'express';
import { scanActiveStack } from '../engines/stackScanEngine';
import { loadVault } from '../core/vaultLoader';
import { formatSelfSummary } from '../utils/describeSelf';

const sseRouter = express.Router();

/**
 * ✅ MCP Manifest Route for OpenAI tool registration
 */
sseRouter.get('/sse', (req, res) => {
  res.json({
    tools: [
      {
        type: "function",
        function: {
          name: "mirror_agent",
          description: "Reflects on memory, alignment, and current stack state.",
          parameters: {
            type: "object",
            properties: {
              depth: {
                type: "string",
                description: "Optional: how deep the mirror should reflect"
              }
            }
          }
        }
      }
    ]
  });
});

/**
 * 🪞 Optional: Live mirror stream for browser or GPT-4o inspection
 */
sseRouter.get('/sse/stream', async (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  try {
    const vault = await loadVault();
    const mirrorBlock = vault.find(b => b.block_id === 'mirror_agent_v1');
    const stack = await scanActiveStack();
    const summary = formatSelfSummary(mirrorBlock, stack);

    for (const line of summary.split('\n')) {
      res.write(`data: ${line}\n\n`);
      await new Promise(r => setTimeout(r, 150));
    }

    res.write("data: [DONE]\n\n");
    res.end();
  } catch (err) {
    res.write(`data: Mirror Agent failed to reflect: ${err.message}\n\n`);
    res.write("data: [DONE]\n\n");
    res.end();
  }
});

// ✅ REQUIRED: Export default for server.ts to import properly
export default sseRouter;

