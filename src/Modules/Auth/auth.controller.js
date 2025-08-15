import { Router } from 'express'
import * as authRouter from './auth.servece.js'
import { authentication, tokenTypeEnum } from '../../Middlewares/authentication.middleware.js';

const router = Router();

router.post('/signup', authRouter.signUp)
router.post('/login', authRouter.logIn)
router.post('/social-login', authRouter.logInWithGmail)
router.get('/refresh-token', authentication({
    tokenType : tokenTypeEnum.refresh
}) ,authRouter.refreshToken)

router.patch('/confirm-email',authRouter.confirmEmail)


export default router;