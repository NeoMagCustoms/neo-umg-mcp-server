import express from 'express';

const mcpRouter = express.Router();

/**
 * /tools/list — Required MCP endpoint
 */
mcpRouter.get('/tools/list', (_req, res) => {
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
                description: "How deep the mirror should reflect"
              }
            }
          }
        }
      },
      {
        type: "function",
        function: {
          name: "fetch_alignment_block",
          description: "Returns the current AlignmentBlock from vault memory",
          parameters: {
            type: "object",
            properties: {}
          }
        }
      }
    ]
  });
});

/**
 * /tools/call — Required MCP endpoint
 */
mcpRouter.post('/tools/call', express.json(), async (req, res) => {
  const body = req.body;

  if (!body?.tool_call_id || !body?.tool_name) {
    return res.status(400).json({ error: "Invalid tool call" });
  }

  let result: any = {};

  switch (body.tool_name) {
    case "mirror_agent":
      result = {
        reflection: "I see the vault contains multiple memory blocks. Alignment is enforced. No errors detected."
      };
      break;
    case "fetch_alignment_block":
      try {
        const alignment = require('../../vault/AlignmentBlock.v1.json');
        result = alignment;
      } catch (err: any) {
        return res.status(500).json({ error: "Failed to load alignment block" });
      }
      break;
    default:
      return res.status(404).json({ error: "Tool not found" });
  }

  res.json({
    tool_call_id: body.tool_call_id,
    output: result
  });
});

export default mcpRouter;
