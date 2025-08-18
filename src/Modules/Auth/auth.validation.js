import joi from 'joi';
import { generalFields } from '../../Middlewares/validation.middleware.js';


export const signUpValidation = {
    body : joi.object({
        firstName : generalFields.firstName.required(),
        lastName : generalFields.lastName.required(),
        email : generalFields.email.required(),
        password : generalFields.password.required(),
        confirmPassword : generalFields.confirmPassword,
        gender : generalFields.gender,
        phone : generalFields.phone,
        role : generalFields.role

}).required()

}


export const logInValidation = {
    body: joi.object({
        email : generalFields.email.required(),
        password : generalFields.password.required()

}).required(),
}