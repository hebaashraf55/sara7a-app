import { decrypt } from "../../Utiles/encription/encryption.utils.js";
import { successResponse } from "../../Utiles/successRespons.utils.js";
import * as dbService from "../../DB/dbService.js";
import { UserModel } from "../../DB/Models/user.model.js";


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