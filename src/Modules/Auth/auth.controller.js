import { Router } from 'express';
import * as authRouter from './auth.servece.js';
import { authentication, tokenTypeEnum } from '../../Middlewares/authentication.middleware.js';
import { validation } from '../../Middlewares/validation.middleware.js';
import { signUpValidation , 
    logInValidation, 
    socialLoginValidation ,  
    confirmEmailValidation , 
    forgetPasswordValidation ,
    resetPasswordValidation,
    logOutValidation} from './auth.validation.js';

const router = Router();

router.post('/signup', validation(signUpValidation),authRouter.signUp)

router.post('/login', validation(logInValidation),  authRouter.logIn)

router.post('/logout', 
    validation(logOutValidation),
    authentication({ tokenType : tokenTypeEnum.access }) ,  
    authRouter.logout)

router.post('/social-login', validation(socialLoginValidation) ,authRouter.logInWithGmail)

router.get('/refresh-token', authentication({
    tokenType : tokenTypeEnum.refresh
}) ,authRouter.refreshToken)

router.patch('/confirm-email',
     validation(confirmEmailValidation) , 
     authRouter.confirmEmail)


router.patch('/forget-password', 
    validation(forgetPasswordValidation),
    authRouter.forgetPassword)

router.patch('/reset-password', 
    validation(resetPasswordValidation),
    authRouter.resetPassword)



export default router;