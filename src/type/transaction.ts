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
  paymentType: ITransaction['paymentType']
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
  package: string | null
  priceAfterdiscount: number | ''
  price: number | ''
  description: string
  member: string
  expired: Date
  paymentType: ITransaction['paymentType']
  status: ITransaction['status']
  createdAt?: Date
  updatedAt?: Date
  discountBA?: string
}

export interface QueryListTransactionProps {
  paymentType?: string
  packageType?: string
  referral?: string
  promo?: string
  status?: string
  createdAtStartDate?: string
  createdAtEndDate?: string
  expiredStartDate?: string
  expiredEndDate?: string
}