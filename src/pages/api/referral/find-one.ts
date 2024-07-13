import { FilterQuery } from 'mongoose'
import type { NextApiResponse } from 'next'
import { validateSignin } from 'server/controllers/validate'
import connectMongoDB from 'server/libs/mongodb'
import Referral from 'server/models/Referal'
import { IReferral } from 'server/type/Referral'
import { Ireq } from '../me/login'

type Data = {
  status: string
  message: string
  data?: IReferral | IReferral[] | null
  error?: any
}

async function GETID(req: Ireq, res: NextApiResponse<Data>) {
  let { _id, status, type, member, code } = req.query

  const filter: FilterQuery<IReferral> = {}
  if (_id) filter._id = _id
  if (type) filter.type = type
  if (code) filter.code = code
  if (status) filter.status = status
  if (member) filter.member = member
  const data = await Referral.findOne(filter)

  return res.json({ status: 'ok', message: 'Get Success', data })
}

export default async function handler(req: Ireq, res: NextApiResponse<Data>) {
  try {
    await connectMongoDB()
    await validateSignin<Data>(req, res)
    if (req.method === 'GET') {
      return await GETID(req, res)
    }

    throw new Error('No data found')
  } catch (error: any) {
    return res.status(500).json({ status: 'error', message: error.message, error })
  }
}
