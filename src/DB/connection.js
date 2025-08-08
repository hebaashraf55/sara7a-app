import mongoose from 'mongoose';

const connectDB = async () => {
    try {
        await mongoose.connect( process.env.MONGO_URL, {
            serverSelectionTimeoutMS: 5000
        });
        console.log('DB connected successfully');
    } catch (error) {
        console.log("DB connection failed", error.message);
    }
}

export default connectDB;