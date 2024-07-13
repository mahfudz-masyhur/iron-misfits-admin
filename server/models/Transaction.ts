import mongoose, { Model } from 'mongoose'
import { ObjectId } from 'mongodb'
import { ITransaction } from 'server/type/Transaction'

let pendingRecortSchema = new mongoose.Schema(
  {
    type: { type: String, enum: ['PENDING', 'CANCLE-PENDING'], required: true },
    howMuchDays: { type: Number, required: true },
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
    price: { type: Number, required: true },
    priceAfterdiscount: { type: Number },
    member: { type: ObjectId, ref: 'Member', required: true },
    package: { type: ObjectId, ref: 'Package', required: true },
    promo: { type: ObjectId, ref: 'Promo' },
    referral: { type: ObjectId, ref: 'Referral' },
    expired: { type: Date, required: true },
    discountBA: { type: String },
    status: { type: String, enum: ['PENDING', 'ACTIVE', 'INACTIVE'], required: true },
    description: { type: String },
    pending: [{ type: pendingRecortSchema }],
    creator: { type: ObjectId, ref: 'User', required: true },
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

transactionSchema.index({ member: 1, status: 1 })
transactionSchema.index({ status: 1, expired: 1 })

const Transaction =
  (mongoose.models.Transaction as Model<ITransaction>) || mongoose.model<ITransaction>('Transaction', transactionSchema)

export default Transaction
