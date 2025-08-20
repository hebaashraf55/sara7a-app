import { Router } from 'express';
import * as userRouter from './user.servece.js';
import { 
    authentication, 
    tokenTypeEnum , 
    authorization } from '../../Middlewares/authentication.middleware.js';
import { endPoints } from './user.authorization.js';
import { validation } from '../../Middlewares/validation.middleware.js';
import { shareProfileValidation , 
    updateProfileValidation , 
    freezeAccountValidation } from './user.validation.js';



const router = Router();

router.get('/profile', 
    authentication({ tokenType : tokenTypeEnum.access }) , 
    authorization({ accessRoles : endPoints.getProfile }) ,
    userRouter.profile)

router.get('/share-profile/:userId', 
    validation(shareProfileValidation),
    userRouter.shareProfile
)
router.patch('/update-profile', 
    validation(updateProfileValidation) ,
    authentication({ tokenType : tokenTypeEnum.access }) , 
    authorization({ accessRoles : endPoints.updateProfile }) ,
     userRouter.updateProfile)

router.delete('{:userId}/freeze-account', 
    validation(freezeAccountValidation) ,
    authentication({ tokenType : tokenTypeEnum.access }) , 
    authorization({ accessRoles : endPoints.freezeAccount }) ,
     userRouter.freezeAccount)

export default router;