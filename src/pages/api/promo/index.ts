import type { NextApiResponse } from 'next'
import { validateAdmin, validateSignin } from 'server/controllers/validate'
import connectMongoDB from 'server/libs/mongodb'
import { Ireq } from '../me/login'
import { IPromo } from 'server/type/Promo'
import { PromoInput } from 'src/type/promo'
import Promo from 'server/models/Promo'

type Data = {
  status: string
  message: string
  data?: IPromo | IPromo[] | null
  error?: any
}

async function GET(req: Ireq, res: NextApiResponse<Data>) {
  const data = await Promo.find({}, { password: 0 })

  return res.json({ status: 'ok', message: 'Get Success', data })
}

async function POST(req: Ireq, res: NextApiResponse<Data>) {
  const { user } = req
  const { _id, name, startDate, endDate, discounts, type, status, statusEdit, updatedAt } = req.body as PromoInput

  if (_id) {
    const data = await Promo.findOneAndUpdate(
      { _id, updatedAt },
      {
        name: statusEdit ? name : undefined,
        startDate: statusEdit ? startDate : undefined,
        endDate: statusEdit ? endDate : undefined,
        type: statusEdit ? type : undefined,
        discounts: statusEdit ? discounts : undefined,
        status,
        lastEditedBy: user
      }
    )

    if (!data) {
      res.status(501).json({ status: '501 Not Implemented', message: 'Update Failed' })
      throw new Error('')
    }

    return res.json({ status: 'ok', message: 'Update Success', data })
  }

  const data = await Promo.create({
    name,
    startDate,
    endDate,
    discounts,
    type,
    status,
    creator: user
  })

  return res.json({ status: 'ok', message: 'Create Success', data })
}

export default async function handler(req: Ireq, res: NextApiResponse<Data>) {
  try {
    await connectMongoDB()
    await validateSignin<Data>(req, res)
    if (req.method === 'GET') {
      return await GET(req, res)
    }
    if (req.method === 'POST') {
      await validateAdmin(req, res)
      return await POST(req, res)
    }

    throw new Error('No data found')
  } catch (error: any) {
    return res.status(500).json({ status: 'error', message: error.message, error })
  }
}
