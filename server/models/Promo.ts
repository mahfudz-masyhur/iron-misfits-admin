import mongoose, { Model } from 'mongoose'
import { ObjectId } from 'mongodb'

const promoSchema = new mongoose.Schema(
  {
    name: { type: String, required: 'Name required' },
    type: { type: String, enum: ['percentage', 'nominal'], required: 'Type required' },
    discounts: { type: Number, required: 'Discounts required' },
    startAndExpirationDate: { type: [Date], required: 'Start and Expiration Date required' },
    status: { type: String, enum: ['active', 'inactive'], required: 'Status required' },
    statusEdit: { type: Boolean, default: true },
    creator: { type: ObjectId, ref: 'User' },
    lastEditedBy: { type: ObjectId, ref: 'User' }
  },
  { timestamps: true }
)

const Promo = (mongoose.models.Promo as Model<any>) || mongoose.model<any>('Promo', promoSchema)

export default Promo
