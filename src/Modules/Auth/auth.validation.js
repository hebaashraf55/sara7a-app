import joi from 'joi';

export const signUpValidation = {
    body : joi.object({
    firstName : joi.string().min(3).max(20).required().messages({
        "string.min" : "First name must be at least 3 characters long",
        "string.max" : "First name must be at most 20 characters long",
        "any.required" : "First name is Mandatory"
    }),
    lastName : joi.string().min(3).max(20).required(),
    email : joi.string().email({ 
        minDomainSegments: 2 , 
        maxDomainSegments: 5 , 
        tlds: { allow : ["com", "org", "net", "gov", "edu", "io" ]} })
        .required(),
    password : joi.string().required(),
    confirmPassword : joi.ref('password'),
    gender : joi.string().valid('Male', 'Female').default('Male'),
    role : joi.string().valid('USER', 'ADMIN').default('USER'),
    phone : joi.string()
}).required()

}


export const logInValidation = {
    body: joi.object({
    email : joi.string().email({ 
        minDomainSegments: 2 , 
        maxDomainSegments: 5 , 
        tlds: { allow : ["com", "org", "net", "gov", "edu", "io" ]} })
        .required(),
    password : joi.string().required(),

}).required(),
}