import { decrypt , encrypt } from "../../Utiles/encription/encryption.utils.js";
import { successResponse } from "../../Utiles/successRespons.utils.js";
import * as dbService from "../../DB/dbService.js";
import { roles, UserModel } from "../../DB/Models/user.model.js";
import { compare, hash } from "../../Utiles/hashing/hash.utils.js";
import { TokenModel } from "../../DB/Models/token.model.js"
import { logOutEnums} from "../../Utiles/token/token.utils.js";
import { cloudinaryConfig } from '../../Utiles/multer/cloudinary.js';

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

    // if(( userId && req.user.role !== roles.admin) || (userId !== req.user._id.toString() )) {
    //     return next (new Error("You are not authorized to freeze this account", { cause: 403 }))
    // }
        if(!userId){
    return next(new Error("userId is required", { cause: 400 }));
    }

    if( (req.user.role !== roles.admin) &&   (req.user.role === roles.user && userId !== req.user._id.toString())){
    return next(new Error("You are not authorized to freeze this account", { cause: 403 }));
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

// restored by admin
export const restoreAccount = async ( req , res, next ) => {

    const { userId } = req.params
    const updatedUser = await dbService.findOneAndUpdate({
        model : UserModel ,
        filter : {
            _id : userId ,
            deletedAt : { $exists : true },
            deletedBy : { $ne : userId}
        },
        data : {
            $unset : { deletedAt : true , deletedBy : true },
            restoredAt : Date.now(),
            restoredBy : req.user._id
        }
    })
    return updatedUser ? successResponse({ 
        res, 
        statusCode: 200, 
        message: "User account restored successfully", 
        data: { updatedUser } }) 
        : next ( new Error("Invalid Account", { cause: 404 }))
}

// restored by user ---------------
export const restoredByUser = async ( req , res, next ) => {
    const { userId } = req.params;
    const targetId = userId || req.user._id;
    console.log(userId, req.user._id);
    console.log(req.user.role, roles.user)
    //   if (userId && req.user.role === roles.user && userId != req.user._id) 
    if ((userId !== req.user._id.toString() ) || (req.user.role !== roles.user)) {
    return next(
      new Error("You are not authorized to restore this account", { cause: 403 })
    );
  }
    const myUser = await dbService.findById({
        model : UserModel ,
        id : userId
    })
  console.log(myUser)
    const updatedUser = await dbService.findOneAndUpdate({
        model : UserModel ,
        filter : {
            _id : targetId ,
            deletedAt : { $exists : true }
        },
        data : {
            $unset : { deletedAt : true , deletedBy : true },
            restoredAt : Date.now(),
            restoredBy : req.user._id
        }
    })
    console.log(updatedUser)
    return updatedUser ? successResponse({ 
        res, 
        statusCode: 200, 
        message: "User account restored successfully", 
        data: { updatedUser } }) 
        : next ( new Error("Invalid Account", { cause: 404 }))
}

export const hardDelete = async ( req , res, next ) => {

    const { userId } = req.params
    const user = await dbService.deleteOne({
        model : UserModel ,
        filter : {
            _id : userId,
            deletedAt : { $exists : true },
            deletedBy : { $ne : userId}
        }
    })
    return user.deletedCount ? successResponse({ 
        res, 
        statusCode: 200, 
        message: "User account deleted successfully"
     }) 
        : next ( new Error("Invalid Account", { cause: 404 }))
}

// update password
export const updatePassword = async (req, res, next) => {
    const { oldPassword , password , flag } = req.body
     // check if old password is == new password 
     if (!await compare({plainText : oldPassword , hash : req.user.password})) {
        return next (new Error("Old password is incorrect", { cause: 400 }))
     }
     let updatedData = {}
     switch (flag) {
        case logOutEnums.logOutFromAllDevices:
             updatedData.changCredentialsAt = Date.now()
             break;
        case logOutEnums.logOut:
             await dbService.create({
                 model: TokenModel,
                 data: [{
                     jti : req.decoded.jti,
                     userId : req.user._id,
                     expiresIn : Date.now() - req.decoded.iat,
                 }]
             })
             break;
        default:
             break;
     }

    const updatedUser = await dbService.findOneAndUpdate({ 
        model : UserModel , 
        filter : { _id : req.user._id },
        data : {
             password : await hash({ plainText : password }) 
            } ,
            ...updatedData
    })
    return updatedUser 
        ? successResponse({ 
        res, 
        statusCode: 200, 
        message: "Password updated successfully", 
        data: { updatedUser } }) 
        : next ( new Error("Invalid Account", { cause: 404 }))
}

// update profile image
export const ProfileImage = async (req, res , next) => {
   
    const { secure_url, public_id } = await cloudinaryConfig().uploader.upload(req.file.path, {
        folder : `Sara7a-App/Users/${req.user._id}`
    })
    const user = await dbService.findOneAndUpdate({      
        model : UserModel ,
        filters : { _id : req.user._id },
        data : { 
            // profileImage : req.file.finalPath
            profileCloudImage : { secure_url, public_id },   
         },     
    })

    // req.user.porfileCloudImage?.public_id -- destory profileCloudImage
    if(req.user.profileCloudImage?.public_id) {
        await cloudinaryConfig().uploader.destroy(req.user.profileCloudImage.public_id)
    }

    successResponse({
        res,
        statusCode: 200,
        message: "Profile image updated successfully",
        data: { user }
    })
}

// update cover images 
export const coverImages = async ( req, res, next) => {

    const attachments = [];
    for (const file of req.files){
        const { secure_url, public_id } = await cloudinaryConfig().uploader.upload(file.path, 
            { folder : `Sara7a-App/Users/${req.user._id}`})
            attachments.push({ secure_url, public_id });
        }

        const user = await dbService.findOneAndUpdate({
        model : UserModel ,
        filter : { _id : req.user._id },
        data : { 
            coverCloudImages : attachments,
         }
    })       
      // ✅ If user already has cover images, destroy them from Cloudinary
        if (user.coverCloudImages && user.coverCloudImages.length > 0) {
            for (const img of user.coverCloudImages) {
                if (img.public_id) {
                    await cloudinaryConfig().uploader.destroy(img.public_id);
                }
            }
        }
    successResponse({
        res,
        statusCode: 200,
        message: "Cover image Added successfully",
        data: { user }
    })
}

