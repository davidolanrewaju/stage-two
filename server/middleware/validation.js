import { body, validationResult } from 'express-validator';

export const registerValidationRules = () => {
  return [
    body('firstName').notEmpty().withMessage('First name is required'),
    body('lastName').notEmpty().withMessage('Last name is required'),
    body('email').trim().isEmail().withMessage('Enter a valid email address'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  ];
};

export const loginValidationRules = () => {
    return [
        body('email').trim().isEmail().withMessage('Enter a valid email address'),
        body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    ];
}

export const validateMiddleware = (req, res, next) => {
  const errors = validationResult(req);
  
  if (errors.isEmpty()) {
    return next();
  }
  
  const extractedErrors = errors.array().map(err => ({ field: err.path, message: err.msg }));

  return res.status(422).json({
    errors: extractedErrors,
  });
};
