const errorHandler = (err, req, res, next) => {
  console.error('❌ Error:', err.message);
  console.error(err.stack);

  const isDbConnectivityError = err?.code === 'P1001' || err?.code === 'P1002';

  const statusCode = isDbConnectivityError ? 503 : (err.statusCode || 500);
  const message = isDbConnectivityError
    ? 'Database is temporarily unavailable. Please try again in a moment.'
    : (err.message || 'Internal Server Error');

  res.status(statusCode).json({
    success: false,
    error: message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

module.exports = errorHandler;
