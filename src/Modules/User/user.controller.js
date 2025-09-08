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
    updatePasswordValidation , 
    porfileImageValidation,
    coverImagesValidation } from './user.validation.js';
import { fileValidation, localFileUpload } from '../../Utiles/multer/local.multer.js';
import { cloudFileUpload } from '../../Utiles/multer/cloud.multer.js';


const router = Router({
    caseSensitive : true,
    strict : true,
});

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

router.patch('/:userId/restore-account', 
    validation(restoreAccountValidation) ,
    authentication({ tokenType : tokenTypeEnum.access }) , 
    authorization({ accessRoles : endPoints.restoreAccount }) ,
     userRouter.restoreAccount)


router.patch('/:userId/restored-by-user',
    validation(restoreAccountValidation),
    authentication({ tokenType: tokenTypeEnum.access }),
    authorization({ accessRoles: endPoints.restoredByUser }),
    userRouter.restoredByUser,
)

router.delete('/:userId/hard-delete',
    validation(hardDeleteAccountValidation),
    authentication({ tokenType: tokenTypeEnum.access }),
    authorization({ accessRoles: endPoints.hardDeleteAccount }),
    userRouter.hardDelete
)

router.patch('/update-password', 
    validation(updatePasswordValidation) ,
    authentication({ tokenType : tokenTypeEnum.access }) , 
    authorization({ accessRoles : endPoints.updatePassword }) ,
     userRouter.updatePassword)

router.patch ('/profile-image',
    authentication({ tokenType : tokenTypeEnum.access }) , 
    // localFileUpload({customPath : "User" , 
    //     validation : [...fileValidation.images]})
    //     .single('image'),
    //     validation(porfileImageValidation),
    cloudFileUpload({validation : [...fileValidation.images]}).single('image'),
    userRouter.ProfileImage
)

router.patch ('/cover-images',
    authentication({ tokenType : tokenTypeEnum.access }) , 
    // localFileUpload({ customPath : "User" , 
    //     validation : [...fileValidation.images],
    // }).array('images', 5),
    // validation(coverImagesValidation),
    cloudFileUpload({validation : [...fileValidation.images]}).array('images', 5),
    userRouter.coverImages
)


export default router;