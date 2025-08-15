import { UserModel } from "../DB/Models/user.model.js";
import * as dbService from "../DB/dbService.js";
import { verifyToken , getSignature , signatureEnum } from "../Utiles/token/token.utils.js";


export const tokenTypeEnum = {
    access : 'access',
    refresh : 'refresh'
}

const decodedToken = async ({ authorization , tokenType = tokenTypeEnum.access ,next }) => {
        
        const [ bearer , token ] = authorization.split(" ") || [];

        if(!bearer || !token)
            return next(new Error ("Invalid Token") , { cause : 400 })
        let signature = await getSignature({ 
            signatureLevel : bearer 
         })
        const decoded = verifyToken({ 
            token , 
            signature : 
            tokenType === tokenTypeEnum.access 
            ? signature.accessSignature 
            : signature.refreshSignature 
        })
        const user = await dbService.findById( { 
            model : UserModel ,
            id : { _id : decoded._id }
        })
        if(!user) 
            return next(new Error ("User Not Found") , { cause : 404 })
        return user
}


export const authentication = ({ tokenType = tokenTypeEnum.access}) => {

    return async (req, res, next) => {
        req.user = await decodedToken({
            authorization : req.headers.authorization,
            tokenType,
            next
        })
        return next()
    }
}