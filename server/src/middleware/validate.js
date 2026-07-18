import { AppError } from '../utils/AppError.js';

export function validateBody(rules) {
  return (req, _res, next) => {
    const errors = [];

    for (const rule of rules) {
      const value = req.body[rule.field];
      const isEmpty = value === undefined || value === null || value === '';

      if (rule.required && isEmpty) {
        errors.push({ field: rule.field, message: `${rule.label} is required` });
        continue;
      }

      if (isEmpty) continue;

      if (rule.type === 'string' && typeof value !== 'string') {
        errors.push({ field: rule.field, message: `${rule.label} must be text` });
      }

      if (rule.type === 'number' && (Number.isNaN(Number(value)) || Number(value) < rule.min)) {
        errors.push({ field: rule.field, message: `${rule.label} must be at least ${rule.min}` });
      }

      if (rule.enum && !rule.enum.includes(value)) {
        errors.push({ field: rule.field, message: `${rule.label} is invalid` });
      }

      if (rule.minLength && String(value).trim().length < rule.minLength) {
        errors.push({ field: rule.field, message: `${rule.label} must be at least ${rule.minLength} characters` });
      }

      if (rule.maxLength && String(value).trim().length > rule.maxLength) {
        errors.push({ field: rule.field, message: `${rule.label} cannot exceed ${rule.maxLength} characters` });
      }
    }

    if (errors.length > 0) {
      next(new AppError('Validation failed', 400, errors));
      return;
    }

    next();
  };
}
