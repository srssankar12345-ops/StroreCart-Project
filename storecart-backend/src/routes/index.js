import { Router } from 'express';
import userRoutes from '../modules/user/user.routes.js';

const router = Router();

router.use('/users', userRoutes);

export default router;