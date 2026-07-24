import express from 'express';
import path from 'path';
import cors from 'cors';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { apiRouter } from './server/routes/api';
import { initDatabase } from './server/db';

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Initialize Database (MongoDB connection with Memory Fallback)
  await initDatabase();

  app.use(cors());
  app.use(express.json({ limit: '10mb' }));

  // Mount API REST routes FIRST
  app.use('/api', apiRouter);

  // Vite middleware for development vs static production serving
  if (process.env.NODE_ENV !== 'production') {
    console.log('[Server] Mounting Vite development middleware...');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    console.log('[Server] Serving production static files from dist...');
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Server] Express full-stack backend running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('[Server] Fatal startup error:', err);
});
