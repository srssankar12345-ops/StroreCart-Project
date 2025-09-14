import { Router } from 'express';
import { register, login } from './user.controller.js';
import { rateLimiter } from '../../middleware/rateLimiter.js';

const router = Router();

router.post('/signup', register);
router.post('/signin', rateLimiter(5 , 60*1000*5), login);

export default router;