import joi from 'joi';
import { generalFields } from '../../Middlewares/validation.middleware.js';

export const shareProfileValidation = {
    params : joi.object({
        userId : generalFields.id.required() 
    })
}