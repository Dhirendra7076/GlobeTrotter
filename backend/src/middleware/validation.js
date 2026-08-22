const { body, param, validationResult } = require('express-validator');
const { AppError } = require('./errorHandler');

// Validation rules
const validateRegister = [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
];

const validateLogin = [
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password').notEmpty().withMessage('Password is required')
];

const validateTrip = [
  body('name').notEmpty().withMessage('Trip name is required'),
  body('startDate').isISO8601().withMessage('Valid start date is required'),
  body('endDate').isISO8601().withMessage('Valid end date is required')
];

const validateStop = [
  body('cityId').notEmpty().withMessage('City ID is required'),
  body('cityName').notEmpty().withMessage('City name is required'),
  body('startDate').isISO8601().withMessage('Valid start date is required'),
  body('endDate').isISO8601().withMessage('Valid end date is required')
];

const validateActivity = [
  body('name').notEmpty().withMessage('Activity name is required'),
  body('type').isIn(['sightseeing', 'food', 'adventure', 'cultural', 'shopping', 'nature', 'nightlife', 'other'])
    .withMessage('Invalid activity type'),
  body('date').isISO8601().withMessage('Valid date is required'),
  body('startTime').matches(/^([01]\d|2[0-3]):([0-5]\d)$/).withMessage('Start time must be in HH:MM format'),
  body('endTime').matches(/^([01]\d|2[0-3]):([0-5]\d)$/).withMessage('End time must be in HH:MM format')
];

// Validation error handler
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const messages = errors.array().map(error => error.msg);
    return next(new AppError(messages.join(', '), 400));
  }
  next();
};

module.exports = {
  validateRegister,
  validateLogin,
  validateTrip,
  validateStop,
  validateActivity,
  validate
};