import type { NextApiResponse } from 'next'
import { validateAdmin, validateSignin } from 'server/controllers/validate'
 
import { Ireq } from '../me/login'
import { IPromo } from 'server/type/Promo'
import { PromoInput } from 'src/type/promo'
import Promo from 'server/models/Promo'
import { FilterQuery } from 'mongoose'
import connectMongoDB from 'server/libs/mongodb'
import { ObjectId } from 'mongodb'

type Data = {
  status: string
  message: string
  data?: IPromo | IPromo[] | null
  error?: any
}

async function GET(req: Ireq, res: NextApiResponse<Data>) {
  let { name, status, type, code } = req.query
  const filter: FilterQuery<IPromo> = {}
  if (name) {
    const match = new RegExp(`${name}`, 'i')
    filter.name = { $regex: match }
  }
  if (type) filter.type = type
  if (status) filter.status = status
  if (code) filter.code = code

  const data = await Promo.find(filter).sort({ updatedAt: -1 })

  return res.json({ status: 'ok', message: 'Get Success', data })
}

async function POST(req: Ireq, res: NextApiResponse<Data>) {
  const { user } = req
  const { _id, name, startDate, endDate, discounts, type, status, statusEdit, updatedAt, code } = req.body as PromoInput

  if (_id) {
    const findPromoCode = await Promo.findOne({ code, _id: { $ne: new ObjectId(_id) } })
    if (findPromoCode) {
      return res.status(501).json({ status: '501 Not Implemented', message: 'Code already been used' })
    }

    const data = await Promo.findOneAndUpdate(
      { _id, updatedAt },
      {
        name: statusEdit ? name : undefined,
        code: statusEdit ? code : undefined,
        startDate: statusEdit ? startDate : undefined,
        endDate: statusEdit ? endDate : undefined,
        type: statusEdit ? type : undefined,
        discounts: statusEdit ? discounts : undefined,
        status,
        lastEditedBy: user
      }
    )

    if (!data) {
      return res.status(501).json({ status: '501 Not Implemented', message: 'Update Failed' })
    }

    return res.json({ status: 'ok', message: 'Update Success', data })
  }

  const findPromoCode = await Promo.findOne({ code })
  if (findPromoCode) {
    return res.status(501).json({ status: '501 Not Implemented', message: 'Code already been used' })
  }

  const data = await Promo.create({
    name,
    code,
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
