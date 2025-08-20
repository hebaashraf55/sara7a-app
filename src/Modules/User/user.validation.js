import joi from 'joi';
import { generalFields } from '../../Middlewares/validation.middleware.js';

export const shareProfileValidation = {
    params : joi.object({
        userId : generalFields.id.required() 
    })
}

export const updateProfileValidation = {
    body : joi.object({
        firstName : generalFields.firstName,
        lastName : generalFields.lastName,
        phone : generalFields.phone,
        gender : generalFields.gender
    })
}

export const freezeAccountValidation = {
    params : joi.object({
        userId : generalFields.id
    })
}