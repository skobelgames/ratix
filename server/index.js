require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const ordersRouter = require('./routes/orders');
const webhooksRouter = require('./routes/webhooks');

const app = express();
const PORT = process.env.PORT || 3000;

// CORS configuration - adjust origins for production
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true
}));

// Body parser for JSON (but NOT for webhooks - they need raw body)
app.use((req, res, next) => {
  if (req.originalUrl.includes('/webhooks')) {
    next();
  } else {
    bodyParser.json()(req, res, next);
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Routes
app.use('/api/orders', ordersRouter);
app.use('/api/webhooks', webhooksRouter);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: {
      message: err.message || 'Internal server error',
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    }
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: { message: 'Route not found' } });
});

app.listen(PORT, () => {
  console.log(`🚀 RATIX Backend Server running on port ${PORT}`);
  console.log(`📍 Health check: http://localhost:${PORT}/health`);
  console.log(`📦 Orders API: http://localhost:${PORT}/api/orders`);
  console.log(`🔔 Webhooks: http://localhost:${PORT}/api/webhooks`);
});

module.exports = app;
