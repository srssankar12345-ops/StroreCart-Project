import { Router } from 'express';
import { register, login } from './user.controller.js';
import { rateLimiter } from '../../middleware/rateLimiter.js';

const router = Router();

router.post('/signup', register);
router.post('/signin', rateLimiter(2,60), login);

export default router;