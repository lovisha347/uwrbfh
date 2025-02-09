// middlewares/errorHandler.js
export const errorHandler = (err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
      error: {
        code: statusCode,
        message: err.message,
        validation: err.errors
      }
    });
  };
  