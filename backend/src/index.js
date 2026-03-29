const express = require('express');
const cors = require('cors');
require('dotenv').config();

const productRoutes = require('./routes/products');
const categoryRoutes = require('./routes/categories');
const cartRoutes = require('./routes/cart');
const orderRoutes = require('./routes/orders');
const authRoutes = require('./routes/auth');
const wishlistRoutes = require('./routes/wishlist');
const addressRoutes = require('./routes/addresses');
const errorHandler = require('./middleware/errorHandler');
const prisma = require('./lib/prisma');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/addresses', addressRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handler
app.use(errorHandler);

const connectToDatabase = async () => {
  const maxRetries = Number(process.env.PRISMA_CONNECT_RETRIES || 5);
  const retryDelayMs = Number(process.env.PRISMA_CONNECT_RETRY_DELAY_MS || 1000);

  for (let attempt = 0; attempt <= maxRetries; attempt += 1) {
    try {
      await prisma.$connect();
      console.log('✅ Database connected');
      return;
    } catch (error) {
      const isLastAttempt = attempt === maxRetries;
      const retryable = typeof prisma.isRetryableConnectionError === 'function'
        ? prisma.isRetryableConnectionError(error)
        : false;

      if (!retryable || isLastAttempt) {
        throw error;
      }

      const waitMs = retryDelayMs * (attempt + 1);
      console.warn(`⚠️ Database connection failed (attempt ${attempt + 1}/${maxRetries + 1}). Retrying in ${waitMs}ms...`);
      await new Promise((resolve) => setTimeout(resolve, waitMs));
    }
  }
};

const startServer = async () => {
  try {
    await connectToDatabase();
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('❌ Failed to connect to database. Server not started.');
    console.error(error.message);
    process.exit(1);
  }
};

const gracefulShutdown = async (signal) => {
  console.log(`\nReceived ${signal}. Closing database connection...`);
  try {
    await prisma.$disconnect();
  } finally {
    process.exit(0);
  }
};

process.on('SIGINT', () => gracefulShutdown('SIGINT'));
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));

startServer();
