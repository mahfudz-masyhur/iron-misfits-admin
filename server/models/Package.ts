import mongoose, { Model } from 'mongoose'
import { ObjectId } from 'mongodb'

const packageSchema = new mongoose.Schema(
  {
    name: { type: String, required: 'Name required' },
    harga: { type: Number },
    packageType: { type: String, enum: ['daily', 'weekly', 'monthly', 'quarterly', 'annual'] },
    status: { type: String, enum: ['active', 'inactive'] },
    statusEdit: { type: Boolean, default: true },
    creator: { type: ObjectId, ref: 'User' },
    lastEditedBy: { type: ObjectId, ref: 'User' }
  },
  { timestamps: true }
)

const Package = (mongoose.models.Package as Model<any>) || mongoose.model<any>('Package', packageSchema)

export default Package
