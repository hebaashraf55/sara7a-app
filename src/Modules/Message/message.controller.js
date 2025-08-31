import { Router } from 'express';
import * as messageRouter from './message.servece.js';
import { cloudFileUpload } from '../../Utiles/multer/cloud.multer.js';
import { fileValidation } from '../../Utiles/multer/local.multer.js';
import { validation } from '../../Middlewares/validation.middleware.js';
import { sendMessageValidation } from './message.validation.js';


const router = Router();


router.post('/:recieverId/send-message', 
    cloudFileUpload({validation : [...fileValidation.images]}).array('attachments', 3),
    validation(sendMessageValidation),
    messageRouter.sendMessage)

export default router;