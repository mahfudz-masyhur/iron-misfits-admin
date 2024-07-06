import type { NextApiResponse } from 'next'
import { validateAdmin, validateSignin } from 'server/controllers/validate'
import connectMongoDB from 'server/libs/mongodb'
import Transaction from 'server/models/Transaction'
import { ITransaction } from 'server/type/Transaction'
import { Ireq } from '../me/login'

type Data = {
  status: string
  message: string
  data?: ITransaction | ITransaction[] | null
  error?: any
}

async function GETID(req: Ireq, res: NextApiResponse<Data>) {
  const param = `${req.query.id}`
  const data = await Transaction.findById(param)

  return res.json({ status: 'ok', message: 'Get Success', data })
}

async function DELETE(req: Ireq, res: NextApiResponse<Data>) {
  let param = `${req.query.id}`
  const { updatedAt, createdAt } = req.body as ITransaction

  if (!createdAt) {
    res.status(400).json({ status: '405 Method Not Allowed', message: 'createdAt is required' })
    throw new Error('')
  }

  const createdDate = new Date(createdAt)
  const now = new Date()

  // Menghitung perbedaan waktu dalam milidetik
  const differenceInTime = now.getTime() - createdDate.getTime()
  // Mengkonversi perbedaan waktu ke dalam hari
  const differenceInDays = differenceInTime / (1000 * 3600 * 24)

  if (differenceInDays >= 1) {
    res
      .status(400)
      .json({ status: '405 Method Not Allowed', message: 'The transaction date cannot be more than one day old' })
    throw new Error('')
  }
  const data = await Transaction.findOneAndDelete({ _id: param, updatedAt })

  if (!data) {
    res.status(501).json({ status: '501 Not Implemented', message: 'Delete Failed' })
    throw new Error('')
  }

  return res.json({ status: 'ok', message: 'Delete Success', data })
}

export default async function handler(req: Ireq, res: NextApiResponse<Data>) {
  try {
    await connectMongoDB()
    await validateSignin<Data>(req, res)
    if (req.method === 'GET') {
      return await GETID(req, res)
    }
    if (req.method === 'DELETE') {
      await validateAdmin(req, res)
      return await DELETE(req, res)
    }

    throw new Error('No data found')
  } catch (error: any) {
    return res.status(500).json({ status: 'error', message: error.message, error })
  }
}
