// middlewares/error.middleware.js


// Custom error class for API errors
export class APIError extends Error {
  constructor(statusCode, message, details = null) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
    this.name = 'APIError';
  }
}

// Error handling middleware
export const errorHandler = (err, req, res, next) => {
  // Log the error


  // Handle specific error types
  if (err instanceof APIError) {
    return res.status(err.statusCode).json({
      error: err.message,
      details: err.details
    });
  }

  // Handle validation errors
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      error: 'Validation Error',
      details: Object.values(err.errors).map(e => e.message)
    });
  }

  // Handle JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      error: 'Invalid token'
    });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      error: 'Token expired'
    });
  }

  // Default error response
  const statusCode = err.statusCode || 500;
  const message = process.env.NODE_ENV === 'production' 
    ? 'Internal Server Error' 
    : err.message || 'Something went wrong';

  res.status(statusCode).json({
    error: message,
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack })
  });
};

// Not found middleware
export const notFoundHandler = (req, res) => {
  res.status(404).json({
    error: 'Resource not found'
  });
};

// Setup middleware function
export const setupMiddleware = (app) => {
  // Add the error handling middleware last
  app.use(notFoundHandler);
  app.use(errorHandler);
};