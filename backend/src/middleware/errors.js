class ApiError extends Error {
  constructor(statusCode, message, details) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
  }
}

function notFoundHandler(req, res) {
  return res.status(404).json({
    status: 'error',
    message: 'Not Found',
    path: req.originalUrl,
  });
}

function errorHandler(err, req, res, next) {
  // eslint-disable-next-line no-unused-vars
  void next;

  const statusCode = err.statusCode || 500;
  const payload = {
    status: 'error',
    message: err.message || 'Internal Server Error',
  };

  if (err.details) payload.details = err.details;

  if (statusCode >= 500) {
    console.error(err);
  }

  return res.status(statusCode).json(payload);
}

module.exports = {
  ApiError,
  notFoundHandler,
  errorHandler,
};
