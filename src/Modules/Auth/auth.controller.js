import { Router } from 'express'
import * as authRouter from './auth.servece.js'
import { authentication, tokenTypeEnum } from '../../Middlewares/authentication.middleware.js';
import { validation } from '../../Middlewares/validation.middleware.js';
import { signUpValidation , logInValidation, socialLoginValidation , confirmEmailValidation} from './auth.validation.js';

const router = Router();

router.post('/signup', validation(signUpValidation),authRouter.signUp)

router.post('/login', validation(logInValidation),  authRouter.logIn)

router.post('/social-login', validation(socialLoginValidation) ,authRouter.logInWithGmail)

router.get('/refresh-token', authentication({
    tokenType : tokenTypeEnum.refresh
}) ,authRouter.refreshToken)

router.patch('/confirm-email', validation(confirmEmailValidation) , authRouter.confirmEmail)


export default router;