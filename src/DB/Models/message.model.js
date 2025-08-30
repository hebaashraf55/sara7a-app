import mongoose, { Schema } from "mongoose";



const messageSchema = new Schema({

    // content
    content :{
        type : String,
        minLength : 2,
        maxLength : 2000,
        required : function () {
            return this.attachments.length? false : true
        }
    },
    // attachments
    attachments : [{
        secure_url : String,
        public_id : String
    }],
    // recieverId
    recieverId : {
        type : Schema.Types.ObjectId,
        ref : 'User',
        required : true
    },
    // senderId
    senderId : {
        type : Schema.Types.ObjectId,
        ref : 'User'
    }
},
 {timestamps: true}
);

export const MessageModel = mongoose.models.Message || model('Message', messageSchema);

