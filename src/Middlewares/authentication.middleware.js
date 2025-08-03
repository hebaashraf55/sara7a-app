import { UserModel } from "../DB/Models/user.model.js";
import * as dbService from "../DB/dbService.js";
import { verifyToken } from "../Utiles/token.utils.js";



export const authentication = async ( req, res , next) => {
    
        const { authorization } = req.headers;
    
        const decoded = verifyToken({ token : authorization})
        
        const user = await dbService.findById( { 
            model : UserModel ,
            id : { _id : decoded._id }
        })
        if(!user) 
            return next(new Error ("User Not Found") , { cause : 404 })

        req.user = user
        return next()
}