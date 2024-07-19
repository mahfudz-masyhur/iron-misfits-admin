import type { NextApiResponse } from 'next'
import connectMongoDB from 'server/libs/mongodb'
import Member from 'server/models/Member'
import Transaction from 'server/models/Transaction'
import { IMember } from 'server/type/Member'
import { RegisterMemberValues } from 'src/components/pages/members/RegistrationPage'
import { Ireq } from '../me/login'
import Members from 'src/pages/members'

type Data = {
  status: string
  message: string
  data?: IMember | IMember[] | null
  error?: any
}

async function POST(req: Ireq, res: NextApiResponse<Data>) {
  const {
    name,
    avatar,
    handphone,
    socialmedia,
    expired,
    price,
    priceAfterdiscount,
    package: pckge,
    promo,
    referral
  } = req.body as RegisterMemberValues

  const data = await Member.create({
    name,
    avatar,
    handphone,
    socialmedia
  })

  if (!data) {
    return res.status(501).json({ status: '501 Not Implemented', message: 'Create Failed' })
  }

  const transaction = await Transaction.create({
    price,
    expired,
    member: data._id,
    package: pckge,
    priceAfterdiscount,
    promo,
    referral,
    status: 'ACTIVE',
    creator: data._id
  })

  if (!transaction) {
    await Member.findByIdAndDelete(data._id)
    return res.status(501).json({ status: '501 Not Implemented', message: 'Create Failed' })
  }

  return res.json({ status: 'ok', message: 'Create Success', data })
}

export default async function handler(req: Ireq, res: NextApiResponse<Data>) {
  try {
    await connectMongoDB()
    if (req.method !== 'POST') throw new Error('No data found')
    return await POST(req, res)
  } catch (error: any) {
    return res.status(500).json({ status: 'error', message: error.message, error })
  }
}
