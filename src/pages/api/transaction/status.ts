import type { NextApiResponse } from 'next'
import { validateAdmin, validateSignin } from 'server/controllers/validate'
 
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

async function POST(req: Ireq, res: NextApiResponse<Data>) {
  const { user } = req
  const { _id, status, updatedAt } = req.body

  const data = await Transaction.findOneAndUpdate(
    { _id, updatedAt },
    {
      status,
      lastEditedBy: user
    }
  )

  if (!data) {
    return res.status(501).json({ status: '501 Not Implemented', message: 'Update Failed' })
  }

  return res.json({ status: 'ok', message: 'Update Success', data })
}

export default async function handler(req: Ireq, res: NextApiResponse<Data>) {
  try {
    await connectMongoDB()
    await validateSignin<Data>(req, res)
    if (req.method === 'POST') {
      await validateAdmin(req, res)
      return await POST(req, res)
    }

    throw new Error('No data found')
  } catch (error: any) {
    return res.status(500).json({ status: 'error', message: error.message, error })
  }
}
