import mongoose, { Schema , model } from "mongoose";


export const genderEnum = {
    male : 'Male',
    female : 'Female'}
    
export const providers = {
    system : 'SYSTEM',
    google : "GOOGLE"
}
export const roles = {
    user : 'USER',
    admin : 'ADMIN'
}

const userSchema = new Schema({
    firstName : {
        type: String,
        required : true,
        trim : true,
        minLength : [ 3, 'first name must be at least 3 characters long'],
        maxLength : [ 20, 'first name must be at most 15 characters long']
    },
    lastName: {
        type: String,
        required : true,
        trim : true,
        minLength : [ 3, 'last name must be at least 3 characters long'],
        maxLength : [ 20, 'last name must be at most 15 characters long']
    },
    email: {
        type: String,
        required : true,
        trim: true,
        lowercase: true,
        unique: true,
    },
    password : {
        type : String,
        required : function () {
            return this.provider === providers.system ? true : false;
        },
    },
    gender : {
        type : String,
        enum : {
            values : Object.values(genderEnum),
            message : " Gender must be either male or femal "
        },
       default : genderEnum.male
    },
    phone: String,
    confirmEmail: Date ,
    profileImage : String,
    coverImages : [String], 

    profileCloudImage : {
    secure_url:  String ,
    public_id: String }
  ,
    coverCloudImages : [{ public_id : String, secure_url : String}],

    confirmEmailOTP : String,
    deletedAt : Date,
    deletedBy : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User'
    },
    restoredAt : Date,
    restoredBy : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User'
    },
    forgetPasswordOTP : String,
    changCredentialsTime : Date,
    provider : {
        type : String,
        enum : {
            values : Object.values(providers),
            message : " Provider must be either system or google "
        },
        default : providers.system
    },
    role : {
        type : String,
        enum : {
            values : Object.values(roles),
            message : " Rols must be either user or admin "
        },
        default : roles.user
    }
},
 { timestamps: true , toJSON: { virtuals: true } , toObject: { virtuals: true } }
);

userSchema.virtual('messages', {
        localField : '_id',
        foreignField : 'recieverId',
        ref : 'Message'
    }
)



export const UserModel = mongoose.models.User || model('User', userSchema);

