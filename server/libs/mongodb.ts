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


export const getDatabaseStats = async () => {
  if (mongoose.connection.readyState === 1) {
    const stats = await mongoose.connection.db.stats()
    return stats // This returns the total size of the data in bytes
  } else {
    throw new Error('MongoDB connection is not ready')
  }
}

export default connectMongoDB;
