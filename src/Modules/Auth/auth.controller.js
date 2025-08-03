import { Router } from 'express'
import * as authRouter from './auth.servece.js'

const router = Router();

router.post('/signup', authRouter.signUp)
router.post('/login', authRouter.logIn)


export default router;