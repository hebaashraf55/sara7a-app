import { Router } from 'express';
import * as messageService from './message.servece.js';
import { cloudFileUpload } from '../../Utiles/multer/cloud.multer.js';
import { fileValidation } from '../../Utiles/multer/local.multer.js';
import { validation } from '../../Middlewares/validation.middleware.js';
import { sendMessageValidation , getMessageValidation } from './message.validation.js';
import { authentication , tokenTypeEnum } from '../../Middlewares/authentication.middleware.js';


const router = Router();


router.post('/:recieverId/send-message', 
    cloudFileUpload({validation : [...fileValidation.images]}).array('attachments', 3),
    validation(sendMessageValidation),
    messageService.sendMessage)

router.post('/:recieverId/sender', 
    authentication({ tokenType : tokenTypeEnum.access }) ,
    cloudFileUpload({validation : [...fileValidation.images]}).array('attachments', 3),
    validation(sendMessageValidation),
    messageService.sendMessage)

router.get('/:userId/get-messages', 
validation(getMessageValidation),
    messageService.getMessages)






export default router;