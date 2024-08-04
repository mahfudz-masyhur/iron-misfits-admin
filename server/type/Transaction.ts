import { ISocialMedia } from './Member'

export interface IPendingRecord {
  _id: string
  type: 'PENDING' | 'CANCLE-PENDING'
  howMuchDays: number | string
  expiredBefore: Date
  expiredThen: Date
  statusEdit: boolean
  description?: string
  creator?: { _id: string; name: string }
  lastEditedBy?: { _id: string; name: string }
  createdAt?: Date
  updatedAt?: Date
}

export interface ITransaction {
  _id: string
  price: number
  priceAfterdiscount: number
  member: {
    _id: string
    name: string
    avatar: string
    handphone: string
    socialmedia: ISocialMedia[]
  }
  package: {
    _id: string
    name: string
    price: number
    packageType: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'annual'
  }
  promo?: {
    _id: string
    name: string
    type: 'percentage' | 'nominal'
    discounts: number | string
    startDate: Date
    endDate: Date
  }
  referral?: {
    _id: string
    name: string
    code: string
    type: 'percentage' | 'nominal'
    discounts: number | string
  }
  expired: Date
  paymentType: 'registration-payment' | 'package-payment'
  status: 'PENDING' | 'ACTIVE' | 'INACTIVE' | 'NOT-YEY-PAID' | 'PAID'
  pending: IPendingRecord[]
  creator?: { _id: string; name: string }
  lastEditedBy?: { _id: string; name: string }
  createdAt?: Date
  updatedAt?: Date
  discountBA?: string
  description?: string
}
