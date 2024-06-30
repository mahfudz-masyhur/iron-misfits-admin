import mongoose, { Model } from 'mongoose'
import { ObjectId } from 'mongodb'
import { IMember } from 'server/type/Member'

const memberSchema = new mongoose.Schema(
  {
    name: { type: String, required: 'Name required' },
    avatar: { type: String },
    socialmedia: { type: [String] },
    handphone: { type: Number },
    transaction: { type: [ObjectId], ref: 'Transaction' },
    creator: { type: ObjectId, ref: 'User' },
    lastEditedBy: { type: ObjectId, ref: 'User' }
  },
  { timestamps: true }
)

const Member = (mongoose.models.Member as Model<IMember>) || mongoose.model<IMember>('Member', memberSchema)

export default Member
