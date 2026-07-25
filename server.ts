import express from 'express';
import path from 'path';
import cors from 'cors';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { apiRouter } from './server/routes/api';
import authRoutes from './server/routes/authRoutes';
import { errorHandler } from './server/middleware/errorHandler';
import { initDatabase } from './server/db';

dotenv.config();

async function startServer() {
  const app = express();
  const requestedPort = Number(process.env.PORT || 3000);
  const candidatePorts = [requestedPort, requestedPort + 1, requestedPort + 2, requestedPort + 3, requestedPort + 4, requestedPort + 5];

  // Initialize Database (MongoDB connection with Memory Fallback)
  await initDatabase();

  app.use(cors());
  app.use(express.json({ limit: '10mb' }));

  // Mount API REST routes FIRST
  app.use('/api', apiRouter);

  // Mongoose/bcrypt-backed auth routes (register/login/profile) — previously defined
  // but never mounted, so /api/auth/register never worked
  app.use('/api/secure-auth', authRoutes);

  // Central error handler must be registered after all routes
  app.use(errorHandler);

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

  let lastError: Error | undefined;
  for (const port of candidatePorts) {
    try {
      await new Promise<void>((resolve, reject) => {
        const server = app.listen(port, '0.0.0.0', () => {
          console.log(`[Server] Express full-stack backend running on http://0.0.0.0:${port}`);
          resolve();
        });

        server.on('error', (err: NodeJS.ErrnoException) => {
          reject(err);
        });
      });
      return;
    } catch (err) {
      lastError = err as Error;
      if ((err as NodeJS.ErrnoException).code !== 'EADDRINUSE') {
        throw err;
      }
      console.warn(`[Server] Port ${port} is busy, trying ${port + 1}...`);
    }
  }

  throw lastError || new Error('Unable to start server');
}

startServer().catch((err) => {
  console.error('[Server] Fatal startup error:', err);
});
