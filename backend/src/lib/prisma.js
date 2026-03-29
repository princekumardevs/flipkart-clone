const { PrismaClient } = require('@prisma/client');
require('dotenv').config();

const prisma = new PrismaClient({
  datasourceUrl: process.env.DATABASE_URL,
});

const RETRYABLE_PRISMA_CODES = new Set(['P1001', 'P1002']);
const RETRY_PATTERN = /Can't reach database server|Timed out/i;
const retryCount = Number(process.env.PRISMA_QUERY_RETRIES || 2);
const retryDelayMs = Number(process.env.PRISMA_RETRY_DELAY_MS || 500);

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const isRetryableConnectionError = (error) => {
  if (!error) return false;
  return RETRYABLE_PRISMA_CODES.has(error.code) || RETRY_PATTERN.test(error.message || '');
};

// Retry transient network/connectivity failures (for example Neon cold starts).
prisma.$use(async (params, next) => {
  let attempt = 0;

  while (true) {
    try {
      return await next(params);
    } catch (error) {
      if (!isRetryableConnectionError(error) || attempt >= retryCount) {
        throw error;
      }

      attempt += 1;
      await sleep(retryDelayMs * attempt);
    }
  }
});

prisma.isRetryableConnectionError = isRetryableConnectionError;

module.exports = prisma;
