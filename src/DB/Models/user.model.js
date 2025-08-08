import mongoose, { Schema , model } from "mongoose";


export const genderEnum = {
    male : 'Male',
    female : 'Female'}
export const providers = {
    system : 'SYSTEM',
    google : "GOOGLE"
}
const userSchema = new Schema({
    firstName : {
        type: String,
        required : true,
        trim : true,
        minLength : [ 3, 'first name must be at least 3 characters long'],
        mixLength : [ 20, 'first name must be at most 15 characters long']
    },
    lastName: {
        type: String,
        required : true,
        trim : true,
        minLength : [ 3, 'last name must be at least 3 characters long'],
        mixLength : [ 20, 'last name must be at most 15 characters long']
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
    comfirmEmail: Date,
    photo : String,
    provider : {
        type : String,
        enum : {
            values : Object.values(providers),
            message : " Provider must be either system or google "
        },
        default : providers.system
    }

},
 {timestamps: true}
);




export const UserModel = mongoose.models.User || model('User', userSchema);

