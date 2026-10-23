import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import { config } from './config';
import routes from './routes';
import { errorHandler } from './middleware/errorHandler';

const app = express();

/* ── Security Headers ── */
app.use(helmet());

/* ── CORS Policy ── */
app.use(
  cors({
    origin: config.corsOrigin,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }),
);

/* ── Body Parsers ── */
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

/* ── HTTP Request Logging ── */
if (config.nodeEnv !== 'test') {
  app.use(morgan('dev'));
}

/* ── Brute-force & DoS Rate Limiting on Authentication Endpoints ── */
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 30, // Limit each IP to 30 authentication requests per window
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many authentication attempts. Please try again after 15 minutes.' },
});

app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);

/* ── Health Check ── */
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    service: 'CampusLend API',
    environment: config.nodeEnv,
    timestamp: new Date().toISOString(),
  });
});

/* ── API Routes ── */
app.use('/api', routes);

/* ── 404 Route Handler ── */
app.use((_req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

/* ── Global Centralized Error Handler ── */
app.use(errorHandler);

export default app;
