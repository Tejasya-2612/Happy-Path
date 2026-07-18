import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import morgan from 'morgan';
import authRoutes from './routes/auth.routes.js';
import toolRoutes from './routes/tool.routes.js';
import { errorHandler } from './middleware/errorHandler.js';
import { notFound } from './middleware/notFound.js';

export function createApp() {
  const app = express();
  const allowedOrigins = new Set([
    process.env.CLIENT_ORIGIN,
    'https://happy-path.vercel.app',
    'https://happy-path-2nytsoa40-atejasya8-1627s-projects.vercel.app',
    'http://localhost:5173',
    'http://127.0.0.1:5173'
  ].filter(Boolean));
  const localDevOriginPattern = /^http:\/\/(localhost|127\.0\.0\.1):\d+$/;
  const vercelPreviewOriginPattern = /^https:\/\/happy-path-[a-z0-9-]+-atejasya8-1627s-projects\.vercel\.app$/;

  function isAllowedOrigin(origin) {
    return (
      !origin ||
      allowedOrigins.has(origin) ||
      localDevOriginPattern.test(origin) ||
      vercelPreviewOriginPattern.test(origin)
    );
  }

  app.use(helmet());
  app.use(cors({
    origin(origin, callback) {
      if (isAllowedOrigin(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error(`CORS blocked request from ${origin}`));
    },
    credentials: true
  }));
  app.use(express.json({ limit: '20kb' }));
  app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000,
      limit: 300,
      standardHeaders: true,
      legacyHeaders: false
    })
  );

  app.get(['/', '/api/health'], (_req, res) => {
    res.status(200).json({ status: 'ok' });
  });

  app.use('/api/auth', authRoutes);
  app.use('/api/tools', toolRoutes);
  app.use(notFound);
  app.use(errorHandler);

  return app;
}
