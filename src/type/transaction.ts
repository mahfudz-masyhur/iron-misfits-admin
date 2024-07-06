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
  howMuchDays: Date
  expiredBefore: Date
  expiredThen: Date
  statusEdit: boolean
  updatedAt?: Date
}

export interface TransactionInput {
  _id: string
  referral?: ITransaction['referral']
  promo?: ITransaction['promo']
  package?: ITransaction['package']
  priceAfterdiscount?: number
  price?: number
  member: string
  expired: Date
  status: 'PENDING' | 'ACTIVE' | 'INACTIVE'
  pending: PendingRecordInput[]
  createdAt?: Date
  updatedAt?: Date
}
