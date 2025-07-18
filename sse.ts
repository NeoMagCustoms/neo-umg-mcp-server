import 'dotenv/config';
// api/routes/sse.ts
import express from 'express';

const sseRouter = express.Router();

sseRouter.get('/sse', (_req, res) => {
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

export default sseRouter;

