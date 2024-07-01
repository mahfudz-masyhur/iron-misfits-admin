import mongoose, { Model } from 'mongoose'
import { ObjectId } from 'mongodb'

const transactionSchema = new mongoose.Schema(
  {
    member: { type: ObjectId, ref: 'Member', required: 'Email required' },
    package: { type: ObjectId, ref: 'Package', required: 'Email required' },
    promo: { type: ObjectId, ref: 'Promo' },
    referral: { type: ObjectId, ref: 'Referral' },
    creator: { type: ObjectId, ref: 'User' },
    lastEditedBy: { type: ObjectId, ref: 'User' }
  },
  { timestamps: true }
)

const Transaction = (mongoose.models.Transaction as Model<any>) || mongoose.model<any>('Transaction', transactionSchema)

export default Transaction
