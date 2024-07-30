import type { NextApiResponse } from 'next'
import { validateSignin } from 'server/controllers/validate'
 
import Transaction from 'server/models/Transaction'
import { ITransaction } from 'server/type/Transaction'
import { Ireq } from '../me/login'
import connectMongoDB from 'server/libs/mongodb'

type Data = {
  status: string
  message: string
  data?: ITransaction | ITransaction[] | null
  error?: any
}

async function GET(req: Ireq, res: NextApiResponse<Data>) {
  const now = new Date()
  const threeDaysBefore = new Date(now)
  threeDaysBefore.setDate(now.getDate() - 3)

  const data = await Transaction.find({
    status: { $in: ['ACTIVE', 'PENDING'] },
    expired: { $lt: threeDaysBefore }
  })

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
