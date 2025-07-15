// api/server.ts
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';

import sseRoute from './routes/sse';  // ✅ Plugin manifest/static
import mcpRoute from './routes/mcp';  // ✅ Plugin endpoints

dotenv.config();

const app = express();
const PORT = process.env.PORT || 10000;

// ✅ Middleware
app.use(cors());
app.use(express.json());

// ✅ Serve static UI (e.g., public/index.html)
const staticDir = path.join(__dirname, '..', 'public');
app.use(express.static(staticDir));

app.get('/', (_req, res) => {
  res.sendFile(path.join(staticDir, 'index.html'));
});

// ✅ Plugin and MCP endpoints
app.use('/', sseRoute);
app.use('/', mcpRoute);

// 🔐 Optional API Key enforcement
app.use((req, res, next) => {
  const key = req.headers['x-api-key'];
  if (process.env.API_KEY && key !== process.env.API_KEY) {
    return res.status(403).json({ error: 'Unauthorized' });
  }
  next();
});

// ✅ Final fallback route (shouldn't trigger unless misrouted)
app.use((_req, res) => {
  res.status(404).send('🧠 UMG MCP route not found.');
});

app.listen(PORT, () => {
  console.log(`🧠 Neo UMG MCP Server running at http://localhost:${PORT}`);
});

