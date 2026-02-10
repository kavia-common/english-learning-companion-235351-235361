function errorMiddleware(err, req, res, next) {
  console.error(err);

  const statusCode = err.statusCode && Number.isInteger(err.statusCode) ? err.statusCode : 500;
  const message =
    statusCode >= 500
      ? 'Internal Server Error'
      : (err.message || 'Bad Request');

  res.status(statusCode).json({
    status: 'error',
    message,
  });
}

module.exports = errorMiddleware;

