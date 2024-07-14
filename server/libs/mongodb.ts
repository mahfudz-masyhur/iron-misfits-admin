// server\libs\mongodb.js
import mongoose from "mongoose";
import 'server/models/Member'
import 'server/models/Package'
import 'server/models/Promo'
import 'server/models/Referal'
import 'server/models/Transaction'
import 'server/models/User'

export const getDatabaseStats = async () => {
  if (mongoose.connection.readyState === 1) {
    const stats = await mongoose.connection.db.stats()
    return stats // This returns the total size of the data in bytes
  } else {
    throw new Error('MongoDB connection is not ready')
  }
}

const MONGODB_URI = process.env.MONGODB_URI || ''

const connectMongoDB = async () => {
  const connect = mongoose.connection.readyState
  if (connect === 1) {
    console.log('MongoDB is already connected.')
    return
  }
  if (connect === 2) {
    console.log('Connecting...')
    return
  }

  try {
    await mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
      serverSelectionTimeoutMS: 30000
    })
    console.log('Connected to MongoDB.')
  } catch (error) {
    console.error('MongoDB connection error:', error)
    throw new Error('MongoDB connection error')
  }
}

export default connectMongoDB;
