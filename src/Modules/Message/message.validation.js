import joi from "joi";
import { generalFields } from "../../Middlewares/validation.middleware.js";
import { fileValidation } from "../../Utiles/multer/local.multer.js";


export const sendMessageValidation = {
    params : joi.object({
        recieverId : generalFields.id.required()
    }).required(),
    body : joi.object({
        content : joi.string().min(2).max(20000)
    }),
    files : joi.array().items( 
        joi.object({
        fieldname : generalFields.file.fieldname.valid('attachments').required(),
        originalname : generalFields.file.originalname.required(),
        encoding : generalFields.file.encoding.required(),
        mimetype : generalFields.file.mimetype.valid(...fileValidation.images).required(),
        size : generalFields.file.size.max( 5 * 1024 * 1024 ).required(),
        path : generalFields.file.path.required(),
        filename : generalFields.file.filename.required(),
        finalPath : generalFields.file.finalPath.required(),
        destination : generalFields.file.destination.required()
         })
        ).min(0).max(3)
}