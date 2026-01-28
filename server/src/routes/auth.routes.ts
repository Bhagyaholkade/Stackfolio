import { Router } from 'express';
import { body } from 'express-validator';
import {
  register,
  login,
  getMe,
  updatePassword,
} from '../controllers/auth.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = Router();

// Validation rules
const registerValidation = [
  body('username')
    .trim()
    .isLength({ min: 3, max: 39 })
    .withMessage('Username must be between 3 and 39 characters')
    .matches(/^[a-z0-9](?:[a-z0-9]|-(?=[a-z0-9])){0,38}$/i)
    .withMessage('Username can only contain alphanumeric characters and hyphens'),
  body('email').isEmail().withMessage('Please enter a valid email'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters'),
];

const loginValidation = [
  body('email').isEmail().withMessage('Please enter a valid email'),
  body('password').notEmpty().withMessage('Password is required'),
];

// Routes
router.post('/register', registerValidation, register);
router.post('/login', loginValidation, login);
router.get('/me', protect, getMe);
router.put('/password', protect, updatePassword);

export default router;
