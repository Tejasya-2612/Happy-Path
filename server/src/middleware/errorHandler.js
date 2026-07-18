import mongoose from 'mongoose';
import { AppError } from '../utils/AppError.js';

function formatMongooseValidation(error) {
  return Object.values(error.errors).map((item) => ({
    field: item.path,
    message: item.message
  }));
}

export function errorHandler(error, _req, res, _next) {
  let statusCode = error.statusCode || 500;
  let message = error.message || 'Internal server error';
  let details = error.details || null;

  if (error instanceof mongoose.Error.ValidationError) {
    statusCode = 400;
    message = 'Validation failed';
    details = formatMongooseValidation(error);
  }

  if (error.code === 11000) {
    statusCode = 409;
    message = 'A record with this value already exists';
  }

  if (error instanceof mongoose.Error.CastError) {
    statusCode = 400;
    message = 'Invalid resource id';
  }

  if (statusCode === 500 && !(error instanceof AppError)) {
    console.error(error);
  }

  res.status(statusCode).json({ message, details });
}
