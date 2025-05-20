const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Enhanced error logging with request context
  console.error(`Error in ${req.method} ${req.originalUrl}:`, {
    error: err.message,
    stack: err.stack,
    name: err.name,
    code: err.code,
  });

  // Mongoose bad ObjectId
  if (err.name === "CastError") {
    const message = `Resource not found with id of ${err.value}`;
    error = { message, statusCode: 404 };
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    // Get the duplicate key field
    const field = Object.keys(err.keyValue)[0];
    const value = err.keyValue[field];
    const message = `Duplicate field value entered: ${field} with value '${value}' already exists`;
    error = { message, statusCode: 400 };
  }

  // Mongoose validation error
  if (err.name === "ValidationError") {
    const messages = Object.values(err.errors).map((val) => val.message);
    error = { message: messages.join(", "), statusCode: 400 };
  }

  // JWT errors
  if (err.name === "JsonWebTokenError") {
    error = { message: "Invalid token", statusCode: 401 };
  }

  if (err.name === "TokenExpiredError") {
    error = { message: "Token expired", statusCode: 401 };
  }

  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || "Server Error",
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
};

module.exports = errorHandler;
