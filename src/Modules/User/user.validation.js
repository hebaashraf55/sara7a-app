import joi from 'joi';
import { generalFields } from '../../Middlewares/validation.middleware.js';
import { logOutEnums } from '../../Utiles/token/token.utils.js';
import { fileValidation } from '../../Utiles/multer/local.multer.js';



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

export const porfileImageValidation = {
    file : joi.object({
        fieldname : generalFields.file.fieldname.valid('image').required(),
        originalname : generalFields.file.originalname.required(),
        encoding : generalFields.file.encoding.required(),
        mimetype : generalFields.file.mimetype.valid(...fileValidation.images).required(),
        size : generalFields.file.size.max(5 * 1024 * 1024).required(), // 5MB
        path : generalFields.file.path.required(),
        filename : generalFields.file.filename.required(),
        finalpath : generalFields.file.finalpath.required(),
        destination : generalFields.file.destination.required()
    }).required(),
};

export const coverImagesValidation = {
    files : joi.array()
            .items(
           joi.object({
        fieldname : generalFields.file.fieldname.valid('images').required(),
        originalname : generalFields.file.originalname.required(),
        encoding : generalFields.file.encoding.required(),
        mimetype : generalFields.file.mimetype.valid(...fileValidation.images).required(),
        size : generalFields.file.size.max(5 * 1024 * 1024).required(),
        path : generalFields.file.path.required(),
        filename : generalFields.file.filename.required(),
        finalpath : generalFields.file.finalpath.required(),
        destination : generalFields.file.destination.required()
         }).required(),
        )
    .required(),
};