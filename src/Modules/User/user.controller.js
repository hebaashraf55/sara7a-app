import { Router } from 'express';
import * as userRouter from './user.servece.js';
import { authentication } from '../../Middlewares/authentication.middleware.js';

const router = Router();


router.get('/profile', authentication , userRouter.profile)


export default router;