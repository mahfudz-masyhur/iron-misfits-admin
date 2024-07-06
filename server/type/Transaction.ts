import { ISocialMedia } from './Member'

interface IPendingRecord {
  type: 'PENDING' | 'CANCLE-PENDING'
  howMuchDays: Date
  expiredBefore: Date
  expiredThen: Date
  statusEdit: boolean
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
  status: 'PENDING' | 'ACTIVE' | 'INACTIVE'
  pending: IPendingRecord[]
  creator?: { _id: string; name: string }
  lastEditedBy?: { _id: string; name: string }
  createdAt?: Date
  updatedAt?: Date
}
