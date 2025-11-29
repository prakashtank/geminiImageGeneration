import express from 'express';
import cors from 'cors';
import { config } from './config/env.js';
import geminiRoutes from './routes/geminiRoutes.js';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Routes
app.use('/api/gemini', geminiRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Gemini API Service',
    version: '1.0.0',
    endpoints: {
      generate: 'POST /api/gemini/generate',
      stream: 'POST /api/gemini/stream',
      chat: 'POST /api/gemini/chat',
      health: 'GET /api/gemini/health',
    },
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found',
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(err.status || 500).json({
    success: false,
    error: err.message || 'Internal server error',
    ...(config.nodeEnv === 'development' && { stack: err.stack }),
  });
});

// Start server
const PORT = config.port;
app.listen(PORT, () => {
  console.log(`🚀 Gemini Service is running on port ${PORT}`);
  console.log(`📝 Environment: ${config.nodeEnv}`);
  console.log(`🔗 API Base URL: http://localhost:${PORT}/api/gemini`);
  console.log(`\nAvailable endpoints:`);
  console.log(`  POST   /api/gemini/generate - Generate text`);
  console.log(`  POST   /api/gemini/stream  - Stream text generation`);
  console.log(`  POST   /api/gemini/chat    - Chat with history`);
  console.log(`  GET    /api/gemini/health  - Health check`);
});

export default app;

