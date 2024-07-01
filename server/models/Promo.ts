import mongoose, { Model } from 'mongoose'
import { ObjectId } from 'mongodb'
import { IPromo } from 'server/type/Promo'

const promoSchema = new mongoose.Schema(
  {
    name: { type: String, required: 'Name required' },
    type: { type: String, enum: ['percentage', 'nominal'], required: 'Type required' },
    discounts: { type: Number, required: 'Discounts required' },
    startDate: { type: Date, required: 'Start Date required' },
    endDate: { type: Date, required: 'End Date required' },
    status: { type: String, enum: ['active', 'inactive'], required: 'Status required' },
    statusEdit: { type: Boolean, default: true },
    creator: { type: ObjectId, ref: 'User' },
    lastEditedBy: { type: ObjectId, ref: 'User' }
  },
  { timestamps: true }
)

promoSchema
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

const Promo = (mongoose.models.Promo as Model<IPromo>) || mongoose.model<IPromo>('Promo', promoSchema)

export default Promo
