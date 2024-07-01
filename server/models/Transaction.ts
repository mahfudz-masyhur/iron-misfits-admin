import mongoose, { Model } from 'mongoose'
import { ObjectId } from 'mongodb'
import { ITransaction } from 'server/type/Transaction'

let pendingRecortSchema = new mongoose.Schema(
  {
    type: { type: String, enum: ['PENDING', 'CANCLE-PENDING'], required: true },
    howMuchDays: { type: Date, required: true },
    expiredBefore: { type: Date, required: true },
    expiredThen: { type: Date, required: true },
    description: { type: String },
    creator: { type: ObjectId, ref: 'User', required: true },
    lastEditedBy: { type: ObjectId, ref: 'User' }
  },
  { timestamps: true }
)

pendingRecortSchema
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

let transactionSchema = new mongoose.Schema(
  {
    member: { type: ObjectId, ref: 'Member', required: 'Email required' },
    package: { type: ObjectId, ref: 'Package', required: 'Email required' },
    promo: { type: ObjectId, ref: 'Promo' },
    referral: { type: ObjectId, ref: 'Referral' },
    expired: { type: Date, required: true },
    pending: [{ type: pendingRecortSchema }],
    active: { type: Boolean, required: true },
    creator: { type: ObjectId, ref: 'User' },
    lastEditedBy: { type: ObjectId, ref: 'User' }
  },
  { timestamps: true }
)

transactionSchema
  .pre('findOne', function (next) {
    this.populate('member', '_id name avatar handphone socialmedia')
    this.populate('package', '_id name price packageType')
    this.populate('promo', '_id name type discounts startDate endDate')
    this.populate('referral', '_id name code type discounts')
    this.populate('creator', '_id name')
    this.populate('lastEditedBy', '_id name')
    next()
  })
  .pre('find', function (next) {
    this.populate('member', '_id name avatar handphone socialmedia')
    this.populate('package', '_id name price packageType')
    this.populate('promo', '_id name type discounts startDate endDate')
    this.populate('referral', '_id name code type discounts')
    this.populate('creator', '_id name ')
    this.populate('lastEditedBy', '_id name')
    next()
  })

const Transaction =
  (mongoose.models.Transaction as Model<ITransaction>) || mongoose.model<ITransaction>('Transaction', transactionSchema)

export default Transaction
