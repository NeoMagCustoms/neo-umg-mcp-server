// File: api/routes/talk.ts

import { Router } from 'express';
import axios from 'axios';

const router = Router();

router.post('/', async (req, res) => {
  const input = req.body?.input;

  if (!input || typeof input !== 'string') {
    return res.status(400).json({ error: 'Missing or invalid input' });
  }

  const umgBlock = {
    molt_type: 'Instruction',
    label: 'forge_agent',
    label_to_create: 'tool_from_talk',
    prompt: input
  };

  try {
    const response = await axios.post('http://localhost:3000/query', umgBlock, {
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.API_KEY || ''
      }
    });

    res.json({
      status: '🧠 Task processed via /talk',
      block: umgBlock,
      result: response.data
    });
  } catch (error: any) {
    console.error('❌ /talk error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

export default router;

