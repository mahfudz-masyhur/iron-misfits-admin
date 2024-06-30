import mongoose, { Model } from 'mongoose'
import { ObjectId } from 'mongodb'

const referalSchema = new mongoose.Schema(
  {
    name: { type: String, required: 'Name required' },
    code: { type: String },
    type: { type: String, enum: ['percentage', 'nominal'] },
    discounts: { type: Number },
    member: { type: [ObjectId], ref: 'Member' },
    status: { type: String, enum: ['active', 'inactive'] },
    statusEdit: { type: Boolean, default: true },
    creator: { type: ObjectId, ref: 'User' },
    lastEditedBy: { type: ObjectId, ref: 'User' }
  },
  { timestamps: true }
)

const Referalreferal =
  (mongoose.models.Referalreferal as Model<any>) || mongoose.model<any>('Referalreferal', referalSchema)

export default Referalreferal
