import mongoose, { Schema , model } from "mongoose";


const tokenSchema = new Schema({
    jti: {
        type : String,
        required : true,
        unique : true,
    },
    expiresIn : {
        type : Number,
        required : true
    },
    userId : {
        type : Schema.Types.ObjectId,
        ref : 'User',
        required : true
    }

}, { timestamps : true });

export const TokenModel = mongoose.models.Token || model('Token', tokenSchema);

