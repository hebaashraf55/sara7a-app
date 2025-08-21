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
    freezeAccountValidation,
    restoreAccountValidation ,
    hardDeleteAccountValidation ,
    updatePasswordValidation } from './user.validation.js';
import { localFileUpload } from '../../Utiles/multer/local.multer.js';



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

router.delete('{/:userId}/freeze-account', 
    validation(freezeAccountValidation) ,
    authentication({ tokenType : tokenTypeEnum.access }) , 
    authorization({ accessRoles : endPoints.freezeAccount }) ,
     userRouter.freezeAccount)
// restore by admin
router.patch('/:userId/restore-account', 
    validation(restoreAccountValidation) ,
    authentication({ tokenType : tokenTypeEnum.access }) , 
    authorization({ accessRoles : endPoints.restoreAccount }) ,
     userRouter.restoreAccount)

// restore by user 
router.patch('/:userId/restored-by-user',
    validation(restoreAccountValidation),
    authentication({ tokenType: tokenTypeEnum.access }),
    authorization({ accessRoles: endPoints.restoredByUser }),
    userRouter.restoredByUser,
)

// hard delete by admin
router.delete('/:userId/hard-delete',
    validation(hardDeleteAccountValidation),
    authentication({ tokenType: tokenTypeEnum.access }),
    authorization({ accessRoles: endPoints.hardDeleteAccount }),
    userRouter.hardDelete
)

// update password
router.patch('/update-password', 
    validation(updatePasswordValidation) ,
    authentication({ tokenType : tokenTypeEnum.access }) , 
    authorization({ accessRoles : endPoints.updatePassword }) ,
     userRouter.updatePassword)

router.patch ('/update-profile-image',
    authentication({ tokenType : tokenTypeEnum.access }) , 
    localFileUpload().single('profileImage'),
    userRouter.updateProfileImage
)


export default router;