// backend/middlewares/validation.js
const { body, validationResult } = require('express-validator');

exports.donorRegistrationRules = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('age').isInt({ min: 18 }).withMessage('Age must be at least 18'),
  body('bloodType').isIn(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']).withMessage('Invalid blood type'),
  body('address').trim().notEmpty().withMessage('Address is required'),
  body('sex').isIn(['male', 'female', 'other']).withMessage('Invalid sex value'),
  body('phone')
    .isLength({ min: 10, max: 10 })
    .withMessage('Phone number must be 10 digits')
    .matches(/^\d{10}$/)
    .withMessage('Phone number must be numeric')
];

exports.validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};
