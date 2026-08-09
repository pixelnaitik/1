import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';
import servicesRoutes from './routes/servicesRoutes.js';
import assistantRoutes from './routes/assistantRoutes.js';

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// Request ID logging middleware
app.use((req, res, next) => {
  req.requestId = `req_${Math.random().toString(36).substring(2, 11)}`;
  res.setHeader('X-Request-Id', req.requestId);
  next();
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    name: 'SecureVoyage REST API',
    status: 'online',
    version: '1.0.0',
    documentation: '/docs/API_SCHEMA.md',
    endpoints: {
      health: '/health',
      auth: '/api/v1/auth',
      services: '/api/v1/nearby-services',
      assistant: '/api/v1/assistant'
    },
    webFrontendUrl: 'http://localhost:3000'
  });
});

// Healthcheck
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'securevoyage-api', timestamp: new Date().toISOString() });
});

// Mount V1 Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/nearby-services', servicesRoutes);
app.use('/api/v1/assistant', assistantRoutes);
app.use('/api/v1', authRoutes); // fallback mapping for /me

// Standard 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: {
      code: 'NOT_FOUND',
      message: `Endpoint ${req.method} ${req.url} does not exist.`,
      requestId: req.requestId
    }
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('[API ERROR]', err);
  res.status(500).json({
    error: {
      code: 'INTERNAL_ERROR',
      message: 'An unexpected internal error occurred.',
      requestId: req.requestId
    }
  });
});

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`🚀 SecureVoyage API running on http://localhost:${PORT}`);
  });
}

export default app;
