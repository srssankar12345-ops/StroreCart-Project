import { Router } from 'express';
import userRoutes from '../modules/user/user.routes.js';
import {getAllData} from '../../getData.js'
const router = Router();

router.use('/users', userRoutes);
router.use('/getData' , getAllData)

export default router;