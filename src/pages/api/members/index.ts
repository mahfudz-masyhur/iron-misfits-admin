import type { NextApiResponse } from 'next'
import { validateAdmin, validateSignin } from 'server/controllers/validate'
import connectMongoDB from 'server/libs/mongodb'
import Member from 'server/models/Member'
import { IMember } from 'server/type/Member'
import { MemberInput } from 'src/type/member'
import { Ireq } from '../me/login'

type Data = {
  status: string
  message: string
  data?: IMember | IMember[] | null
  error?: any
}

async function GET() {
  const product = await Member.find({}, { password: 0 })

  return { message: 'Get Success', data: product }
}

async function POST(req: Ireq, res: NextApiResponse<Data>) {
  const { user } = req
  const { _id, name, avatar, handphone, socialmedia } = req.body as MemberInput

  if (_id) {
    const data = await Member.findByIdAndUpdate(_id, {
      name,
      avatar,
      handphone,
      socialmedia,
      lastEditedBy: user
    })

    return { message: 'Update Success', data }
  }

  const data = await Member.create({
    name,
    avatar,
    handphone,
    socialmedia,
    creator: user
  })

  return { message: 'Create Success', data }
}

export default async function handler(req: Ireq, res: NextApiResponse<Data>) {
  try {
    let data
    await connectMongoDB()
    await validateSignin<Data>(req, res)
    await validateAdmin(req, res)
    if (req.method === 'GET') {
      data = await GET()
    }
    if (req.method === 'POST') {
      data = await POST(req, res)
    }

    if (!data) throw new Error('No data found')

    return res.json({ status: 'ok', ...data })
  } catch (error: any) {
    return res.status(500).json({ status: 'error', message: error.message, error })
  }
}
