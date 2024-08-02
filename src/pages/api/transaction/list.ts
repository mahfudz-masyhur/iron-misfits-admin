import { FilterQuery } from 'mongoose'
import type { NextApiResponse } from 'next'
import { validateAdmin, validateSignin } from 'server/controllers/validate'
import connectMongoDB from 'server/libs/mongodb'
import Package from 'server/models/Package'
import Promo from 'server/models/Promo'
import Referral from 'server/models/Referal'
import Transaction from 'server/models/Transaction'
import { ITransaction } from 'server/type/Transaction'
import { Ireq } from '../me/login'

type Data = {
  status: string
  message: string
  data?: ITransaction | ITransaction[] | null
  error?: any
}

async function GET(req: Ireq, res: NextApiResponse<Data>) {
  let { packageType, status, member, expired } = req.query
  const filter: FilterQuery<ITransaction> = {}

  if (packageType) filter.packageType = packageType
  if (status) filter.status = status
  if (expired) filter.expired = { $lt: expired }

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
