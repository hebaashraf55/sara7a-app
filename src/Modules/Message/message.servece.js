import * as dbService from "../../DB/dbService.js";
import { UserModel } from "../../DB/Models/user.model.js";
import { cloudinaryConfig } from "../../Utiles/multer/cloudinary.js";
import { MessageModel } from "../../DB/Models/message.model.js";
import { successResponse } from "../../Utiles/successRespons.utils.js";


export const sendMessage = async (req , res, next) => {

    const { recieverId } = req.params;
    const { content } = req.body;
    console.log("Body:", req.body);

    if(!await dbService.findOne({
        model : UserModel,
        filter : {
            _id : recieverId,
            deletedAt : { $exists : false },
            confirmEmail : { $exists : true }
        }
    })
    )
    return next(new Error("Invalid recipient account", { cause : 404 }))

    const attachments = []
    if(req.files){
        for (const file of req.files) {
            const { secure_url, public_id } = 
              await cloudinaryConfig().uploader.upload(file.path, {
                folder : `Sara7a-App/Messages/${recieverId}`
            })
            attachments.push({ secure_url, public_id })
        }
    }

    const newMessage = await dbService.create({
        model : MessageModel,
        data : {
            content,
            attachments ,
            recieverId  ,
        }
    })
    
    return successResponse({
        res,
        statusCode : 201,
        message : "Message sent successfully",
        data : { newMessage },
    })
    
}
