import { UserModel } from '../../DB/Models/user.model.js';
// import { asyncHandler } from '../../Utiles/asyncHandler.js'
import { successResponse } from '../../Utiles/successRespons.utils.js';
import  * as dbService from '../../DB/dbService.js';
import { compare, hash } from '../../Utiles/hash.utils.js';
import { encrypt } from '../../Utiles/encryption.utils.js';
import { signToken , verifyToken } from '../../Utiles/token.utils.js';


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