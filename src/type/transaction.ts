import { ITransaction } from 'server/type/Transaction'

export interface IResponseTransactions {
  status: 'ok' | 'error'
  message: 'Get Success'
  data: ITransaction[]
}

export interface IResponseTransaction {
  status: 'ok' | 'error'
  message: 'Get Success' | 'Update Success' | 'Create Success' | 'Delete Success'
  data: ITransaction
}

export interface PendingRecordInput {
  type: 'PENDING' | 'CANCLE-PENDING'
  howMuchDays: number
  expiredBefore: Date
  expiredThen: Date
  statusEdit: boolean
  updatedAt?: Date
}

export interface TransactionInput {
  _id: string
  referral: string | null
  promo: string | null
  package: string
  priceAfterdiscount: number | ''
  price: number | ''
  description: string
  member: string
  expired: Date
  status: 'PENDING' | 'ACTIVE' | 'INACTIVE'
  pending: PendingRecordInput[]
  createdAt?: Date
  updatedAt?: Date
  discountBA?: string
}
