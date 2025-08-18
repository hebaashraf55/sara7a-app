import { UserModel , providers , roles } from '../../DB/Models/user.model.js';
// import { asyncHandler } from '../../Utiles/asyncHandler.js';
import { successResponse } from '../../Utiles/successRespons.utils.js';
import  * as dbService from '../../DB/dbService.js';
import { compare, hash } from '../../Utiles/hashing/hash.utils.js';
import { encrypt } from '../../Utiles/encription/encryption.utils.js';
import { signToken } from '../../Utiles/token/token.utils.js';
import { OAuth2Client } from 'google-auth-library';
import { getSignature , signatureEnum  } from '../../Utiles/token/token.utils.js';
import { emailEvent } from '../../Utiles/events/event.utiles.js';
import { customAlphabet } from 'nanoid';



// sign up
export const signUp = async (req, res, next) => {
        const { firstName, lastName , email, password, confirmPassword ,phone,gender ,  role } = req.body

        // check if user already exists 
        const user = await dbService.findOne({ model : UserModel , filter : {email}})
        if (user) return next(new Error("User already exists"), { cause: 409 })
            // hash password 
        const hashedPassword = await hash({ plainText : password })
        // encrypt phone number
        const encryptedPhone = encrypt(phone)
        // create otp 
        const code = customAlphabet('0123456789', 6)()
        // otp save in database hashed 
        const hashOTP = await hash({ plainText : code })

        // send email
         emailEvent.emit('confirmemail', { to : email , otp : code , firstName})

        // create new user
        const newUser = await dbService.create({
            model : UserModel,
            data : [{
                firstName,
                lastName,
                email,
                password : hashedPassword,
                gender,
                phone : encryptedPhone,
                role,
                confirmEmailOTP : hashOTP
            }]
        })
        return successResponse({ 
            res, statusCode: 201, 
            message: "User created successfully", 
            data: newUser })
}

// logIn 
export const logIn = async (req, res, next) => {

        const { email, password } = req.body

        const user = await dbService.findOne({ 
            model : UserModel , 
            filter : { email } 
        })
        if(!user) {
            return next ( new Error("User not found"), { cause: 404 })
        }
        // compare hashed password 
        const isMatch = await compare({ plainText : password, hash : user.password })
        if ( !isMatch) {
            return next ( new Error("invalid credentials"), { cause: 401 })
        }
        if(!user.confirmEmail) {
            return next ( new Error("Email not confirmed or user not found"), { cause: 401 })
        }
        let signature = await getSignature({
            signatureLevel : user.role != roles.user ? signatureEnum.admin : signatureEnum.user
        })
        const accessToken = signToken({
            payload : { _id : user._id },
            signature : signature.accessSignature,
            options : {
                issuer : "sara7aApp",
                expiresIn : "1d",
                subject : "Authentication"
            }
        })
        const refreshToken = signToken({
            payload : { _id : user._id },
            signature : signature.refreshSignature,
            options : {
                issuer : "sara7aApp",
                expiresIn : "7d",
                subject : "Authentication"
            }
        })
        // if ( !user) 
        //     return next ( new Error("User not found"), { cause: 404 })

        return  successResponse({ 
            res, 
            statusCode: 200, 
            message: "User logged in successfully", 
            data: { accessToken , refreshToken } })
}

// confirm email
export const confirmEmail = async (req, res, next) => {
    const { email , otp } = req.body
    // find user
    const user = await dbService.findOne({ 
        model : UserModel , 
        filter : { 
            email , 
            confirmEmail : { $exists : false }, 
            confirmEmailOTP : { $exists : true } } 
    })
    if(!user) {
        return next ( new Error("User not found or email already confirmed"), { cause: 404 })
    }
    if(!await compare({ plainText : otp, hash : user.confirmEmailOTP })) {
        return next ( new Error("Invalid OTP"), { cause: 401 })
    }

    // update user
    await dbService.updateOne({ 
        model : UserModel , 
        filter : { email },
        data : { 
            confirmEmail : Date.now(),
            $unset : { confirmEmailOTP : true },
            $inc : {__v : 1}
         }
    })
    return successResponse({ 
        res, 
        statusCode: 200, 
        message: "Email confirmed successfully",
        data: user

}) 
}

async function verifyGoogleAcount ({idToken}) {
    const client = new OAuth2Client();
    const ticket = await client.verifyIdToken({
        idToken,
        audience: process.env.CLIENT_ID,  
    });
    const payload = ticket.getPayload();
    return payload;

}

// socil login with Gemail
export const logInWithGmail = async (req, res, next) => {

    const { idToken } = req.body;
    const { email , email_verified , picture , given_name , family_name } = await verifyGoogleAcount({idToken})

    if(!email_verified) {
        return next(new Error("Email not verified"), { cause: 401 })
    }
    const user = await dbService.findOne({ 
        model : UserModel , 
        filter : { email } 
    })
    // if user find  login
    if(user) {
        if(user.provider === providers.google){
            const accessToken = signToken({
            payload : { _id : user._id },
            options : {
                issuer : "sara7aApp",
                signature : "secret",
                expiresIn : "1d"
            }
        })
        const refreshToken = signToken({
            payload : { _id : user._id },
            options : {
                issuer : "sara7aApp",
                signature : "secret",
                expiresIn : "7d"
            }
        })
        return  successResponse({ 
            res, 
            statusCode: 200, 
            message: "User logged in successfully", 
            data: { accessToken , refreshToken } })
        }   
   }
   // if user not find  create new user
   const newUser = await dbService.create({
    model : UserModel,
    data : [{
        email ,
        firstName : given_name,
        lastName : family_name,
        photo : picture,
        provider : providers.google,
        confirmEmail : Date.now()
    }]
   })
        const accessToken = signToken({
            payload : { _id : newUser._id },
            options : {
                issuer : "sara7aApp",
                signature : "secret",
                expiresIn : "1d"
            }
        })
        const refreshToken = signToken({
            payload : { _id : newUser._id },
            options : {
                issuer : "sara7aApp",
                signature : "secret",
                expiresIn : "7d"
            }
        })
        return  successResponse({ 
            res, 
            statusCode: 201, 
            message: "User logged in successfully", 
            data: { accessToken , refreshToken } })
}


export const refreshToken = async ( req, res, next ) => {

    const user = req.user;
    let signature = await getSignature({ 
        signatureLevel : user.role != roles.user ? signatureEnum.admin : signatureEnum.user 
     })
    const accessToken = signToken({
        payload : { _id : user._id },
        signature : signature.accessSignature,
         options : {
                issuer : "sara7aApp",
                expiresIn : "1d",
                subject : "Authentication"
            }
    })
    const refresToken = signToken({
        payload : { _id : user._id },
        signature : signature.refreshSignature,
        options : {
                issuer : "sara7aApp",
                expiresIn : "7d",
                subject : "Authentication"
            }
    })
    return  successResponse({ 
        res, 
        statusCode: 200, 
        message: "New Credentials Generated successfully", 
        data: { accessToken , refresToken } })

}