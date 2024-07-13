import type { NextApiResponse } from 'next'
import { validateAdmin, validateSignin } from 'server/controllers/validate'
import connectMongoDB from 'server/libs/mongodb'
import Member from 'server/models/Member'
import { IMember } from 'server/type/Member'
import { MemberInput } from 'src/type/member'
import { Ireq } from '../me/login'
import { FilterQuery } from 'mongoose'

type Data = {
  status: string
  message: string
  data?: IMember | IMember[] | null
  error?: any
}

async function GET(req: Ireq, res: NextApiResponse<Data>) {
  let { name } = req.query
  const filter: FilterQuery<IMember> = {}
  if (name) {
    const isNumeric = /^\d+$/.test(name as string)
    if (isNumeric) {
      filter.handphone = Number(name)
    } else {
      const match = new RegExp(`${name}`, 'i')
      filter.$or = [{ name: { $regex: match } }, { email: { $regex: match } }]
    }
  }

  const data = await Member.find(filter)

  return res.json({ status: 'ok', message: 'Get Success', data })
}

async function POST(req: Ireq, res: NextApiResponse<Data>) {
  const { user } = req
  const { _id, name, avatar, handphone, socialmedia, registrationFee, updatedAt } = req.body as MemberInput

  if (_id) {
    const data = await Member.findOneAndUpdate(
      { _id, updatedAt },
      {
        name,
        avatar,
        handphone,
        socialmedia,
        registrationFee,
        lastEditedBy: user
      }
    )

    if (!data) {
      res.status(501).json({ status: '501 Not Implemented', message: 'Update Failed' })
      throw new Error('')
    }

    return res.json({ status: 'ok', message: 'Update Success', data })
  }

  const data = await Member.create({
    name,
    avatar,
    handphone,
    socialmedia,
    registrationFee,
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
