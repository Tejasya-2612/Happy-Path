import { Router } from 'express';
import { login, register } from '../controllers/auth.controller.js';
import { validateBody } from '../middleware/validate.js';

const router = Router();

const registerRules = [
  { field: 'name', label: 'Name', type: 'string', required: true, minLength: 2, maxLength: 80 },
  { field: 'email', label: 'Email', type: 'string', required: true, maxLength: 120 },
  { field: 'password', label: 'Password', type: 'string', required: true, minLength: 8, maxLength: 128 }
];

const loginRules = [
  { field: 'email', label: 'Email', type: 'string', required: true, maxLength: 120 },
  { field: 'password', label: 'Password', type: 'string', required: true, minLength: 8, maxLength: 128 }
];

router.post('/register', validateBody(registerRules), register);
router.post('/login', validateBody(loginRules), login);

export default router;
