import joi from 'joi';
import { generalFields } from '../../Middlewares/validation.middleware.js';
import { logOutEnums } from '../../Utiles/token/token.utils.js';

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

export const restoreAccountValidation = {
    params : joi.object({
        userId : generalFields.id.required()
    })
}
export const hardDeleteAccountValidation = {
    params : joi.object({
        userId : generalFields.id.required()
    })
}
export const updatePasswordValidation = {
    body : joi.object({
        flag: joi.string().valid(...Object.values(logOutEnums)).default(logOutEnums.stayLogedIn),
        oldPassword : generalFields.password.required(),
        password : generalFields.password.not(joi.ref('oldPassword')).required(),
        confirmPassword : generalFields.confirmPassword
    }).required()
}