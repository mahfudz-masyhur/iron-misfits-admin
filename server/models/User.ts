import bcrypt from 'bcrypt'
import mongoose, { Model } from 'mongoose'
import { ObjectId } from 'mongodb'
import { IUser } from 'server/type/User'

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: 'Email required' },
    name: { type: String, required: 'Name required' },
    avatar: { type: String },
    handphone: { type: Number },
    password: { type: String, required: 'Password required' },
    role: [
      {
        type: Number,
        default: 1,
        enum: [1, 2]
        // 1 = admin
        // 2 = viewer
      }
    ],
    isDeleted: { type: Boolean },
    lastEditedBy: { type: ObjectId, ref: 'User' },
    creator: { type: ObjectId, ref: 'User' }
  },
  { timestamps: true }
)

userSchema
  .pre('findOne', function (next) {
    this.populate('creator', '_id name')
    this.populate('lastEditedBy', '_id name')
    next()
  })
  .pre('find', function (next) {
    this.populate('creator', '_id name ')
    this.populate('lastEditedBy', '_id name')
    next()
  })

const User = (mongoose.models.User as Model<IUser>) || mongoose.model<IUser>('User', userSchema)

export default User
