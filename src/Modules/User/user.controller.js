import { Router } from 'express';
import * as userRouter from './user.servece.js';
import { 
    authentication, 
    tokenTypeEnum , 
    authorization } from '../../Middlewares/authentication.middleware.js';
import { endPoints } from './user.authorization.js';


const router = Router();

router.get('/profile', 
    authentication({ tokenType : tokenTypeEnum.access }) , 
    authorization({ accessRoles : endPoints.getProfile }) ,
    userRouter.profile)


export default router;