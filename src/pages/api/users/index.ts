import bcrypt from 'bcrypt'
import type { NextApiResponse } from 'next'
import { validateAdmin, validateMasterAdmin, validateSignin } from 'server/controllers/validate'
import connectMongoDB from 'server/libs/mongodb'
import User from 'server/models/User'
import { IUser } from 'server/type/User'
import { formatConvertCase } from 'src/components/utility/formats'
import { UserInput } from 'src/type/users'
import { Ireq } from '../me/login'

type Data = {
  status: string
  message: string
  data?: IUser | IUser[] | null
  error?: any
}

async function GET() {
  const product = await User.find({}, { password: 0 })

  return { message: 'Get Success', data: product }
}

async function POST(req: Ireq, res: NextApiResponse<Data>) {
  const { user } = req
  const { _id, avatar, email, name, role, handphone } = req.body as UserInput

  if (_id) {
    if (process.env.MASTER_ADMIN === email && user.email !== process.env.MASTER_ADMIN) {
      return res.status(405).json({ status: '405 Method Not Allowed', message: 'Anda tidak bisa mengubah akun ini' })
    }

    const data = await User.findByIdAndUpdate(_id, {
      name,
      email,
      avatar,
      handphone,
      role,
      lastEditedBy: user
    })

    return { message: 'Update Success', data }
  }

  const findEmail = await User.findOne({ email })
  if (findEmail) {
    return res.status(405).json({ status: '405 Method Not Allowed', message: 'Email sudah terdaftar' })
  }

  const salt = await bcrypt.genSalt(10)
  const password = await bcrypt.hash(`admin-misfits`, salt)
  const data = await User.create({
    name,
    email,
    avatar,
    handphone,
    password,
    role,
    creator: user
  })

  return { message: 'Create Success', data }
}

export default async function handler(req: Ireq, res: NextApiResponse<Data>) {
  try {
    let data
    await connectMongoDB()
    await validateSignin<Data>(req, res)
    if (req.method === 'GET') {
      data = await GET()
    }
    if (req.method === 'POST') {
      await validateMasterAdmin(req, res)
      data = await POST(req, res)
    }

    if (!data) throw new Error('No data found')

    return res.json({ status: 'ok', ...data })
  } catch (error: any) {
    return res.status(500).json({ status: 'error', message: error.message, error })
  }
}
