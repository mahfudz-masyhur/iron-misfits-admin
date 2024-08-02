import { IPendingRecord, ITransaction } from 'server/type/Transaction'

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
  status: ITransaction['status']
  expired: Date
  pending: IPendingRecord
  createdAt?: Date
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
  status: ITransaction['status']
  createdAt?: Date
  updatedAt?: Date
  discountBA?: string
}

export interface QueryListTransactionProps {
  packageType?: string
  referral?: string
  promo?: string
  status?: string
  createdAtStartDate?: string
  createdAtEndDate?: string
  expiredStartDate?: string
  expiredEndDate?: string
}