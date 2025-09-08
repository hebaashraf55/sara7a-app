import { UserModel , providers , roles } from '../../DB/Models/user.model.js';
import { successResponse } from '../../Utiles/successRespons.utils.js';
import  * as dbService from '../../DB/dbService.js';
import { compare, hash } from '../../Utiles/hashing/hash.utils.js';
import { encrypt } from '../../Utiles/encription/encryption.utils.js';
import { getNewLogInCredentials, signToken } from '../../Utiles/token/token.utils.js';
import { OAuth2Client } from 'google-auth-library';
import { emailEvent } from '../../Utiles/events/event.utiles.js';
import { customAlphabet } from 'nanoid';
import { TokenModel } from '../../DB/Models/token.model.js';
import { logOutEnums } from '../../Utiles/token/token.utils.js';



export const signUp = async (req, res, next) => {
        const { firstName, lastName , email, password, confirmPassword ,phone,gender ,  role } = req.body

       
        const user = await dbService.findOne({ model : UserModel , filter : {email}})
        if (user) return next(new Error("User already exists"), { cause: 409 })
           
        const hashedPassword = await hash({ plainText : password })
       
        const encryptedPhone = encrypt(phone)
       
        const code = customAlphabet('0123456789', 6)()
        
        const hashOTP = await hash({ plainText : code })

      
         emailEvent.emit('confirmemail', { to : email , otp : code , firstName})

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


export const logIn = async (req, res, next) => {

        const { email, password } = req.body

        const user = await dbService.findOne({ 
            model : UserModel , 
            filter : { email } 
        })
        if(!user) {
            return next ( new Error("User not found"), { cause: 404 })
        }
        
        const isMatch = await compare({ plainText : password, hash : user.password })
        if ( !isMatch) {
            return next ( new Error("invalid credentials"), { cause: 401 })
        }
        if(!user.confirmEmail) {
            return next ( new Error("Email not confirmed or user not found"), { cause: 401 })
        }
        const newCredentials = await getNewLogInCredentials(user)

        return  successResponse({ 
            res, 
            statusCode: 200, 
            message: "User logged in successfully", 
            data: { newCredentials } })
}

export const logout = async ( req, res, next ) => {
    const { flag } = req.body;
    let status = 200;
    switch(flag) {
        case logOutEnums.logOutFromAllDevices :
            await dbService.updateOne({
                 model : UserModel , 
                 filter : { _id : req.user._id },
                data: {
                    changCredentialsTime : Date.now()
                } })
            break;
        default:
            await dbService.create({
            model:TokenModel,
            data: [{
                jti : req.decoded.jti,
                userId : req.user._id,
                expiresIn : Date.now() - req.decoded.exp,
            }] 
        })
        status = 201
        break;
    }

    return successResponse({ 
        res, 
        statusCode: status, 
        message: "User logged out successfully", 
         })

}


export const confirmEmail = async (req, res, next) => {
    const { email , otp } = req.body
   
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
    
    if(user) {
        if(user.provider === providers.google){
            const newCredentials = await getNewLogInCredentials(user)

        return  successResponse({ 
            res, 
            statusCode: 200, 
            message: "User logged in successfully", 
            data: {newCredentials } })
        }   
   }
  
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
    
    const newCredentials = await getNewLogInCredentials(user)
    return  successResponse({ 
        res, 
        statusCode: 200, 
        message: "New Credentials Generated successfully", 
        data: { newCredentials} })

}

export const forgetPassword = async (req, res, next) => {
    const {email} = req.body;

    const otp = await customAlphabet('0123456789', 6)()
    const hashOTP = await hash({ plainText : otp })
    const user = await dbService.findOneAndUpdate({
        model : UserModel,
        filter : { 
            email,
            provider : providers.system,
            confirmEmail : { $exists : true },
            deletedAt : { $exists : false }
        },
        data : { forgetPasswordOTP : hashOTP }
    })
    if(!user) {
        return next(new Error("User not found or email not confirmed", { cause: 404 }))
    } 
    emailEvent.emit('forgetPassword', { 
        to : email , 
        otp , 
        firstName : user.firstName })

    return successResponse({ 
        res, 
        statusCode: 200, 
        message: "Check your inbox to reset your password", 
        data: { otp } })

}

export const resetPassword = async (req, res, next) => {

    const { email , otp , password } = req.body;
    const user = await dbService.findOne({ 
        model : UserModel , 
        filter : { 
            email,
            provider : providers.system,
            confirmEmail : { $exists : true },
            deletedAt : { $exists : false },
            forgetPasswordOTP : { $exists : true } } 
    })
    if(!user) {
        return next(new Error("Invalid Account", { cause: 404 }))
    }
    if(!await compare({ plainText : otp, hash : user.forgetPasswordOTP })) {
        return next ( new Error("Invalid OTP"), { cause: 400 })
    }
    const hashedPassword = await hash({ plainText : password })

    const updatedUser = await dbService.updateOne({ 
        model : UserModel , 
        filter : { 
            email,
         },
        data : {
             password : hashedPassword , 
             $unset : { forgetPasswordOTP : true },
             $inc : {__v : 1}
            } 
    })
    return updatedUser 
        ? successResponse({ 
        res, 
        statusCode: 200, 
        message: "Password updated successfully", 
        data: { user : updatedUser } }) 
        : next ( new Error("Invalid Account", { cause: 404 }))
}

