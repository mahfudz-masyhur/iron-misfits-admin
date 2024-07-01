import mongoose, { Model } from 'mongoose'
import { ObjectId } from 'mongodb'
import { IMember } from 'server/type/Member'

const memberSchema = new mongoose.Schema(
  {
    name: { type: String, required: 'Name required' },
    avatar: { type: String },
    socialmedia: [
      {
        _id: false,
        key: { type: String, required: true },
        value: { type: String, required: true }
      }
    ],
    handphone: { type: Number },
    registrationFee: { type: Number, required: true },
    creator: { type: ObjectId, ref: 'User' },
    lastEditedBy: { type: ObjectId, ref: 'User' }
  },
  { timestamps: true }
)

memberSchema
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

const Member = (mongoose.models.Member as Model<IMember>) || mongoose.model<IMember>('Member', memberSchema)

export default Member
