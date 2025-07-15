// api/server.ts
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import fs from 'fs';

import { logMiddleware } from '../middleware/logMiddleware';
import { rateLimitMiddleware } from '../middleware/rateLimitMiddleware';

import memoryRoute from './routes/memory';
import stackRoute from './routes/stack';
import talkRoute from './routes/talk';
import scaffoldRoute from './routes/scaffold';
import queryRoute from './routes/query';
// import analyzeRoute from './routes/analyze'; // 🆕 (disabled for now)
import sseRouter from './routes/sse'; // ✅ FIXED: default import

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// 🌐 CORS Config — Safe for plugins & frontends
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'x-api-key']
}));

// 🧠 Core Middleware
app.use(express.json());
app.use(logMiddleware);
app.use(rateLimitMiddleware);

// ✅ Tool + Memory Routes
app.use('/memory', memoryRoute);
app.use('/stack', stackRoute);
app.use('/talk', talkRoute);
app.use('/scaffold', scaffoldRoute);
app.use('/query', queryRoute);
// app.use('/analyze', analyzeRoute); // optional future route

// ✅ MCP manifest route (must come BEFORE API key middleware)
app.use('/', sseRouter);

// 🔐 Optional API key lock
app.use((req, res, next) => {
  const key = req.headers['x-api-key'];
  if (process.env.API_KEY && key !== process.env.API_KEY) {
    return res.status(403).json({ error: 'Unauthorized' });
  }
  next();
});

// 🔌 Plugin File Serving — ai-plugin.json, logo.png, openapi.yaml
const staticPath = path.join(__dirname, '..', '..');

app.get('/.well-known/ai-plugin.json', (_req, res) => {
  res.sendFile(path.join(staticPath, '.well-known', 'ai-plugin.json'));
});

app.get('/openapi.yaml', (_req, res) => {
  res.sendFile(path.join(staticPath, 'openapi.yaml'));
});

app.get('/logo.png', (_req, res) => {
  res.sendFile(path.join(staticPath, 'logo.png'));
});

// 🚀 Launch Server
app.listen(PORT, () => {
  console.log(`🧠 Neo UMG MCP Server running at http://localhost:${PORT}`);
});

app.get('/', (req, res) => {
  res.send('🧠 Neo UMG MCP Server is live.');
});

