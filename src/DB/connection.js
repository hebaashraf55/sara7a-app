import mongoose from 'mongoose';

const connectDB = async () => {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/sara7aApp', {
            serverSelectionTimeoutMS: 5000
        });
        console.log('DB connected successfully');
    } catch (error) {
        console.log("DB connection failed", error.message);
    }
}

export default connectDB;