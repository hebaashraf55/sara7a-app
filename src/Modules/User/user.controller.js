import { Router } from 'express';
import * as userRouter from './user.servece.js';
import { authentication, tokenTypeEnum } from '../../Middlewares/authentication.middleware.js';

const router = Router();


router.get('/profile', 
    authentication({ tokenType : tokenTypeEnum.access }) , 
    userRouter.profile)


export default router;