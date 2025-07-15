// api/server.ts
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

import sseRoute from './routes/sse'; // ✅ Make sure this path matches your folder

const app = express();
dotenv.config();

app.use(cors());
app.use(express.json());

// ✅ Mount public /sse route BEFORE auth guard
app.use('/', sseRoute);

// 🔐 Optional x-api-key middleware
app.use((req, res, next) => {
  const key = req.headers['x-api-key'];
  if (process.env.API_KEY && key !== process.env.API_KEY) {
    return res.status(403).json({ error: 'Unauthorized' });
  }
  next();
});

// ✅ Optional: fallback route
app.get('/', (req, res) => {
  res.send('🧠 Neo UMG MCP is live');
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`🧠 Neo UMG MCP Server running at http://localhost:${PORT}`);
});

