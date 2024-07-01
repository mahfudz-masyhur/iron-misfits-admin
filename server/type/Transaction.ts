import { ISocialMedia } from './Member'

interface IPendingRecord {
  type: 'PENDING' | 'CANCLE-PENDING'
  howMuchDays: Date
  expiredBefore: Date
  expiredThen: Date
  creator?: { _id: string; name: string }
  lastEditedBy?: { _id: string; name: string }
  createdAt?: Date
  updatedAt?: Date
}

export interface ITransaction {
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
    name: string
    code: string
    type: 'percentage' | 'nominal'
    discounts: number | string
  }
  expired: Date
  pending: IPendingRecord[]
  active: boolean
  creator?: { _id: string; name: string }
  lastEditedBy?: { _id: string; name: string }
  createdAt?: Date
  updatedAt?: Date
}
