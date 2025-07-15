import express from 'express';

const sseRouter = express.Router();

/**
 * ✅ Static MCP Manifest
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
 * 🪞 Optional test stream
 */
sseRouter.get('/sse/stream', (_req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  res.write(`data: MirrorAgent stream online.\n\n`);
  res.write(`data: Active blocks: AlignmentBlock.v1, InstructionLayer.v1\n\n`);
  res.write(`data: [DONE]\n\n`);
  res.end();
});

export default sseRouter;

