import type { NextApiResponse } from 'next'
import { validateAdmin, validateSignin } from 'server/controllers/validate'
 
import { Ireq } from '../me/login'
import { IReferral } from 'server/type/Referral'
import { ReferralInput } from 'src/type/referral'
import Referral from 'server/models/Referal'
import { FilterQuery } from 'mongoose'
import connectMongoDB from 'server/libs/mongodb'
import { ObjectId } from 'mongodb'

type Data = {
  status: string
  message: string
  data?: IReferral | IReferral[] | null
  error?: any
}

async function GET(req: Ireq, res: NextApiResponse<Data>) {
  let { search, status, type, member } = req.query

  const filter: FilterQuery<IReferral> = {}
  if (search) {
    const match = new RegExp(`${search}`, 'i')
    filter.$or = [{ name: { $regex: match } }, { code: { $regex: match } }]
  }
  if (type) filter.type = type
  if (status) filter.status = status
  if (member) filter.member = member

  const data = await Referral.find(filter).sort({ updatedAt: -1 })

  return res.json({ status: 'ok', message: 'Get Success', data })
}

async function POST(req: Ireq, res: NextApiResponse<Data>) {
  const { user } = req
  const { _id, name, code, discounts, member, type, status, statusEdit, updatedAt } = req.body as ReferralInput

  if (_id) {
    const findReferrealCode = await Referral.findOne({ code, _id: { $ne: new ObjectId(_id) } })
    if (findReferrealCode) {
      return res.status(501).json({ status: '501 Not Implemented', message: 'Code already been used' })
    }

    const findReferreal = await Referral.findOne({ member, status: 'active', _id: { $ne: new ObjectId(_id) } })
    if (findReferreal) {
      return res
        .status(501)
        .json({ status: '501 Not Implemented', message: 'Only one member can get code referral active' })
    }

    const data = await Referral.findOneAndUpdate(
      { _id, updatedAt },
      {
        name: statusEdit ? name : undefined,
        code: statusEdit ? code : undefined,
        type: statusEdit ? type : undefined,
        discounts: statusEdit ? discounts : undefined,
        member,
        status,
        lastEditedBy: user
      }
    )

    if (!data) {
      return res.status(501).json({ status: '501 Not Implemented', message: 'Update Failed' })
    }

    return res.json({ status: 'ok', message: 'Update Success', data })
  }

  const findReferrealCode = await Referral.findOne({ code })
  if (findReferrealCode) {
    return res.status(501).json({ status: '501 Not Implemented', message: 'Code already been used' })
  }

  const findReferreal = await Referral.findOne({ member, status: 'active' })
  if (findReferreal) {
    return res
      .status(501)
      .json({ status: '501 Not Implemented', message: 'Only one member can get code referral active' })
  }

  const data = await Referral.create({
    name,
    code,
    type,
    discounts,
    member,
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
