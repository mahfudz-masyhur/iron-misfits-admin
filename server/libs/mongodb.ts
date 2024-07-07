// server\libs\mongodb.js
import mongoose from "mongoose";

const connectMongoDB = async () => {
  try {
    await mongoose.connect(`${process.env.MONGODB_URI}`, {
      serverSelectionTimeoutMS: 30000,
    });
    console.log("Connected to MongoDB.");
  } catch (error) {
    console.error(error)
  }
};

export default connectMongoDB;
