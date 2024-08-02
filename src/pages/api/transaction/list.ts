import { FilterQuery } from 'mongoose'
import type { NextApiResponse } from 'next'
import { validateSignin } from 'server/controllers/validate'
import connectMongoDB from 'server/libs/mongodb'
import Transaction from 'server/models/Transaction'
import { ITransaction } from 'server/type/Transaction'
import { QueryListTransactionProps } from 'src/type/transaction'
import { Ireq } from '../me/login'

type Data = {
  status: string
  message: string
  data?: ITransaction | ITransaction[] | null
  error?: any
}

async function GET(req: Ireq, res: NextApiResponse<Data>) {
  let { packageType, referral, promo, status, createdAtStartDate, createdAtEndDate, expiredStartDate, expiredEndDate } =
    req.query as QueryListTransactionProps
  const filter: FilterQuery<ITransaction> = {}

  if (packageType) filter.packageType = packageType
  if (status) filter.status = status
  if (promo) filter.promo = promo
  if (referral) filter.referral = referral
  const now = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0)

  if (expiredStartDate) {
    filter.expired = {
      $gte: new Date(expiredStartDate),
      $lte: endOfMonth
    }
  }
  if (expiredEndDate) {
    filter.expired = {
      $gte: startOfMonth,
      $lte: new Date(expiredEndDate)
    }
  }
  if (expiredStartDate && expiredEndDate) {
    filter.expired = {
      $gte: new Date(expiredStartDate),
      $lte: new Date(expiredEndDate)
    }
  }

  if (createdAtStartDate) {
    filter.createdAt = {
      $gte: new Date(createdAtStartDate),
      $lte: endOfMonth
    }
  }
  if (createdAtEndDate) {
    filter.createdAt = {
      $gte: startOfMonth,
      $lte: new Date(createdAtEndDate)
    }
  }
  if (createdAtStartDate && createdAtEndDate) {
    filter.createdAt = {
      $gte: new Date(createdAtStartDate),
      $lte: new Date(createdAtEndDate)
    }
  } else {
    filter.createdAt = {
      $gte: startOfMonth,
      $lte: endOfMonth
    }
  }

  const data = await Transaction.find(filter)
    .populate('creator', '_id name')
    .populate('lastEditedBy', '_id name')
    .sort({ createdAt: -1 })

  return res.json({ status: 'ok', message: 'Get Success', data })
}

export default async function handler(req: Ireq, res: NextApiResponse<Data>) {
  try {
    await connectMongoDB()
    await validateSignin<Data>(req, res)
    if (req.method !== 'GET') throw new Error('No data found')
    return await GET(req, res)
  } catch (error: any) {
    return res.status(500).json({ status: 'error', message: error.message, error })
  }
}
