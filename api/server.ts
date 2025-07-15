import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

import sseRoute from './routes/sse'; // ✅ Existing static plugin manifest
import mcpRoute from './routes/mcp'; // ✅ NEW: MCP tools endpoints

const app = express();
dotenv.config();

// ✅ Basic middleware
app.use(cors());
app.use(express.json());

// ✅ Public MCP & SSE routes BEFORE auth
app.use('/', sseRoute);
app.use('/', mcpRoute);

// 🔐 Optional: x-api-key check
app.use((req, res, next) => {
  const key = req.headers['x-api-key'];
  if (process.env.API_KEY && key !== process.env.API_KEY) {
    return res.status(403).json({ error: 'Unauthorized' });
  }
  next();
});

// ✅ Default fallback route
app.get('/', (req, res) => {
  res.send('🧠 Neo UMG MCP is live');
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`🧠 Neo UMG MCP Server running at http://localhost:${PORT}`);
});

