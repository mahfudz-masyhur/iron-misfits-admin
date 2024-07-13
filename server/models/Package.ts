import mongoose, { Model } from 'mongoose'
import { ObjectId } from 'mongodb'
import { IPackage } from 'server/type/Package'

const packageSchema = new mongoose.Schema(
  {
    name: { type: String, required: 'Name required' },
    price: { type: Number },
    packageType: { type: String, enum: ['daily', 'weekly', 'monthly', 'quarterly', 'annual'] },
    status: { type: String, enum: ['active', 'inactive'] },
    statusEdit: { type: Boolean, default: true },
    creator: { type: ObjectId, ref: 'User' },
    lastEditedBy: { type: ObjectId, ref: 'User' }
  },
  { timestamps: true }
)

packageSchema
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

packageSchema.index({_id: 1, statusEdit: 1})

const Package = (mongoose.models.Package as Model<IPackage>) || mongoose.model<IPackage>('Package', packageSchema)

export default Package
