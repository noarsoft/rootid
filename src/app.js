const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const routes = require('./routes');
const { errorHandler } = require('./middlewares/error.middleware');

// BigInt → Number for JSON serialization (modify_datetime fits in MAX_SAFE_INTEGER)
BigInt.prototype.toJSON = function () { return Number(this); };

const app = express();

const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',')
  : ['http://localhost:3000', 'http://localhost:5173', 'http://localhost:5174'];

app.use(cors({ origin: allowedOrigins }));
app.use(express.json({ limit: '1mb' }));
app.use(rateLimit({ windowMs: 60_000, max: 200 }));

const prisma = require('./config/db.prisma');

app.get('/api/health', async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ success: true, data: { status: 'ok', timestamp: new Date().toISOString() } });
  } catch (err) {
    res.status(503).json({ success: false, error: 'Database unavailable' });
  }
});

app.use('/api', routes);

app.use((req, res) => res.status(404).json({ success: false, error: 'Route not found' }));
app.use(errorHandler);

module.exports = app;
