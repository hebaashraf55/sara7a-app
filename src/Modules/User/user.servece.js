import { decrypt } from "../../Utiles/encription/encryption.utils.js";
import { successResponse } from "../../Utiles/successRespons.utils.js";


export const profile = async (req, res, next) => {
    // user {} 
    req.user.phone = decrypt(req.user.phone)
    return successResponse({ 
        res, 
        statusCode: 200, 
        message: "User profile fetched successfully", 
        data: { user : req.user } })
}