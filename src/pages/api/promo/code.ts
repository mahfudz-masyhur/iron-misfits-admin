import type { NextApiResponse } from 'next'

import { FilterQuery } from 'mongoose'
import connectMongoDB from 'server/libs/mongodb'
import Promo from 'server/models/Promo'
import { IPromo } from 'server/type/Promo'
import { Ireq } from '../me/login'

type Data = {
  status: string
  message: string
  data?: IPromo | IPromo[] | null
  error?: any
}

async function GET(req: Ireq, res: NextApiResponse<Data>) {
  let { status, code } = req.query
  const filter: FilterQuery<IPromo> = { code, status }
  const data = await Promo.find(filter).sort({ updatedAt: -1 })

  return res.json({ status: 'ok', message: 'Get Success', data })
}

export default async function handler(req: Ireq, res: NextApiResponse<Data>) {
  try {
    await connectMongoDB()
    if (req.method !== 'GET') throw new Error('No data found')
    return await GET(req, res)
  } catch (error: any) {
    return res.status(500).json({ status: 'error', message: error.message, error })
  }
}
