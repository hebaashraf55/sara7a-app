import jwt from 'jsonwebtoken';
import { roles } from "../../DB/Models/user.model.js";
import { nanoid } from "nanoid";

export const signatureEnum = {
    admin : "Admin",
    user : "User"
}
export const logOutEnums = {
    logOutFromAllDevices : "logOutFromAllDevices",
    logOut : "logOut",
    stayLogedIn : "stayLogedIn",
}

export const signToken = ({
    payload = {},
    signature ,
    options = {expiresIn : "1d"}
}) => {
    return jwt.sign(payload, signature, options)
}

export const verifyToken = ({token = '', signature}) => {
    if (!token) throw new Error("Token is missing");
    return jwt.verify( token, signature )
}

export const getSignature = async ({signatureLevel = signatureEnum.user}) => {

      let signature = { accessSignature : undefined , refreshSignature : undefined };

        switch (signatureLevel) {
            case signatureEnum.admin:
                signature.accessSignature = process.env.ACCESS_ADMIN_SIGNATUR_TOKEN
                signature.refreshSignature = process.env.REFRESH_ADMIN_SIGNATUR_TOKEN
                break;
            case signatureEnum.user:
                signature.accessSignature = process.env.ACCESS_USER_SIGNATUR_TOKEN
                signature.refreshSignature = process.env.REFRESH_USER_SIGNATUR_TOKEN
                break;
            default:
                break;           
        }

        return signature;
}

export const getNewLogInCredentials = async (user) => {
    let signatur = await getSignature({
        signatureLevel : user.role != roles.user ? signatureEnum.admin : signatureEnum.user
    })

    const jwtid = nanoid();
    const accessToken = signToken({
        payload : { _id : user._id },
        signature : signatur.accessSignature,
        options : {
                issuer : "sara7aApp",
                expiresIn : "1d",
                subject : "Authentication",
                jwtid ,
            }
    })
    const refresToken = signToken({
        payload : { _id : user._id },
        signature : signatur.refreshSignature,
        options : {
                issuer : "sara7aApp",
                expiresIn : "7d",
                subject : "Authentication",
                jwtid ,
            }
    })
    return { accessToken , refresToken }
}