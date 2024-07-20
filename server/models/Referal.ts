import mongoose, { Model } from 'mongoose'
import { ObjectId } from 'mongodb'
import { IReferral } from 'server/type/Referral'
import 'server/models/Member'
import 'server/models/User'

const referralSchema = new mongoose.Schema(
  {
    name: { type: String, required: 'Name required' },
    code: { type: String },
    type: { type: String, enum: ['percentage', 'nominal'] },
    discounts: { type: Number },
    useCount: { type: Number, default: 0 },
    member: { type: ObjectId, ref: 'Member' },
    status: { type: String, enum: ['active', 'inactive'] },
    statusEdit: { type: Boolean, default: true },
    creator: { type: ObjectId, ref: 'User' },
    lastEditedBy: { type: ObjectId, ref: 'User' }
  },
  { timestamps: true }
)

referralSchema
  .pre('findOne', function (next) {
    this.populate('member', '_id name avatar socialmedia handphone')
    this.populate('creator', '_id name')
    this.populate('lastEditedBy', '_id name')
    next()
  })
  .pre('find', function (next) {
    this.populate('member', '_id name avatar socialmedia handphone')
    this.populate('creator', '_id name ')
    this.populate('lastEditedBy', '_id name')
    next()
  })
  
referralSchema.index({ code: 1 })
referralSchema.index({ member: 1, status: 1 })
referralSchema.index({ _id: 1, status: 1 })

const Referral = (mongoose.models.Referral as Model<IReferral>) || mongoose.model<IReferral>('Referral', referralSchema)

export default Referral
