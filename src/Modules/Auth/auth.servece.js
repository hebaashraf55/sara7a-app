import { UserModel } from '../../DB/Models/user.model.js';
// import { asyncHandler } from '../../Utiles/asyncHandler.js'
import { successResponse } from '../../Utiles/successRespons.utils.js';
import  * as dbService from '../../DB/dbService.js';
import { compare, hash } from '../../Utiles/hash.utils.js';
import { encrypt } from '../../Utiles/encryption.utils.js';
import { signToken } from '../../Utiles/token.utils.js';
import {OAuth2Client} from 'google-auth-library';

// sign up
export const signUp = async (req, res, next) => {
        const { firstName, lastName , email, password, gender , phone } = req.body
        // check if user already exists 
        
        const user = await dbService.findOne({ model : UserModel , filter : {email}})
        if (user) return next(new Error("User already exists"), { cause: 409 })
            // hash password 
        const hashedPassword = await hash({ plainText : password })
        // encrypt phone number
        const encryptedPhone = encrypt(phone)
        // create new user
        const newUser = await dbService.create({
            model : UserModel,
            data : [{
                firstName,
                lastName,
                email,
                password : hashedPassword,
                gender,
                phone : encryptedPhone
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
        // compare hashed password 
        const isMatch = await compare({ plainText : password, hash : user.password })
        if ( !isMatch) {
            return next ( new Error("invalid credentials"), { cause: 401 })
        }
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
        // if ( !user) 
        //     return next ( new Error("User not found"), { cause: 404 })

        return  successResponse({ 
            res, 
            statusCode: 200, 
            message: "User logged in successfully", 
            data: { accessToken , refreshToken } })
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
    const {idToken} = req.body;
    const { email , email_verified, picture, given_name, family_name} = await verifyGoogleAcount({idToken})

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
        confirmEmail : new Date.now()
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
