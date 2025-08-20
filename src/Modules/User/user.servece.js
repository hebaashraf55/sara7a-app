import { decrypt , encrypt } from "../../Utiles/encription/encryption.utils.js";
import { successResponse } from "../../Utiles/successRespons.utils.js";
import * as dbService from "../../DB/dbService.js";
import { roles, UserModel } from "../../DB/Models/user.model.js";


export const profile = async (req, res, next) => {
    // user {} 
    req.user.phone = decrypt(req.user.phone)
    return successResponse({ 
        res, 
        statusCode: 200, 
        message: "User profile fetched successfully", 
        data: { user : req.user } })
}

export const shareProfile = async (req, res, next) => {

    const { userId } = req.params
    const user = await dbService.findOne({ 
        model : UserModel , 
        filter : { _id : userId, confirmEmail : { $exists : true } } 
    })
    return user 
        ? successResponse({ 
        res, 
        statusCode: 200, 
        message: "User profile fetched successfully", 
        data: { user } 
    }) 
        : next ( new Error("User not found or email not confirmed"), { cause: 404 })
}

export const updateProfile = async (req, res, next) => {
    
    if(req.body.phone) {
        req.body.phone = await encrypt(req.body.phone)
    }
    const UpdatedUser = await dbService.findOneAndUpdate({ 
        model : UserModel , 
        filter : { _id : req.user._id },
        data : req.body 
    })
    return UpdatedUser 
        ? successResponse({ 
        res, 
        statusCode: 200, 
        message: "User profile updated successfully", 
        data: { user : UpdatedUser } }) 
        : next ( new Error("Invalid Account"), { cause: 404 })
}

export const freezeAccount = async (req, res, next) => {

    const { userId } = req.params

    if( userId && req.user.role !== roles.admin) {
        return next (new Error("You are not authorized to freeze this account", { cause: 403 }))
    }
    const UpdatedUser = await dbService.findOneAndUpdate({ 
        model : UserModel , 
        filter : { _id : userId || req.user._id , deletedAt : { $exists : false } },
        data : { 
            deletedAt : Date.now(), 
            deletedBy : req.user._id ,
            $unset : {
                restoredAt : true,
                restoredBy : true
            }
        } 
    })
    return UpdatedUser 
        ? successResponse({ 
        res, 
        statusCode: 200, 
        message: "User account frozen successfully", 
        data: { UpdatedUser } }) 
        : next ( new Error("Invalid Account", { cause: 404 }))

}
