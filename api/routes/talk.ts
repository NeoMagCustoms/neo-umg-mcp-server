import { Router } from 'express';
import fetch from 'node-fetch';

const router = Router();

/**
 * POST /talk
 * Accepts natural language input and routes it as a UMG block to /query
 */
router.post('/', async (req, res) => {
  const input = req.body?.input;

  if (!input || typeof input !== 'string') {
    return res.status(400).json({ error: 'Missing or invalid input' });
  }

  // 🧱 Convert plain English into UMG block format
  const umgBlock = {
    molt_type: 'Instruction',
    label: 'forge_agent',
    label_to_create: 'tool_from_talk',
    prompt: input
  };

  try {
    // 🔁 Route to internal GPT engine
    const response = await fetch('http://localhost:3000/query', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Optional: send auth if needed
        'x-api-key': process.env.API_KEY || ''
      },
      body: JSON.stringify(umgBlock)
    });

    const result = await response.json();
    res.json({
      status: '🧠 Task processed via /talk',
      block: umgBlock,
      result
    });

  } catch (error: any) {
    console.error('❌ /talk error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

export default router;
