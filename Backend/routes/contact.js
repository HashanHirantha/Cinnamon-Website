import express from 'express';
import { body } from 'express-validator';
import { submitContact } from '../controllers/contactController.js';
import { validate } from '../middleware/validate.js';

const router = express.Router();

router.post(
  '/',
  [
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('message').notEmpty().withMessage('Message is required'),
    validate,
  ],
  submitContact
);

export default router;
