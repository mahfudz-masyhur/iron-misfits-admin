import bcrypt from 'bcrypt'
import type { NextApiResponse } from 'next'
import { validateMasterAdmin, validateSignin } from 'server/controllers/validate'
import User from 'server/models/User'
import { IUser } from 'server/type/User'
import { UserInput } from 'src/type/users'
import { Ireq } from '../me/login'
import { FilterQuery } from 'mongoose'
import connectMongoDB from 'server/libs/mongodb'

type Data = {
  status: string
  message: string
  data?: IUser | IUser[] | null
  error?: any
}

async function GET(req: Ireq, res: NextApiResponse<Data>) {
  let { name, isDeleted } = req.query

  const filter: FilterQuery<IUser> = {}
  if (name) {
    const isNumeric = /^\d+$/.test(name as string)
    if (isNumeric) {
      filter.handphone = Number(name)
    } else {
      const match = new RegExp(`${name}`, 'i')
      filter.$or = [{ name: { $regex: match } }, { email: { $regex: match } }]
    }
  }
  if (isDeleted === 'true') filter.isDeleted = true
  else filter.isDeleted = { $in: [null, undefined, false] }

  const data = await User.find(filter, { password: 0 }).sort({ updatedAt: -1 })

  return res.json({ status: 'ok', message: 'Get Success', data })
}

async function POST(req: Ireq, res: NextApiResponse<Data>) {
  const { user } = req
  const { _id, avatar, email, name, role, handphone } = req.body as UserInput

  if (_id) {
    if (user.email === email) {
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

    if (!data) {
      return res.status(501).json({ status: '501 Not Implemented', message: 'Update Failed' })
    }

    return res.json({ status: 'ok', message: 'Update Success', data })
  }

  const findEmail = await User.findOne({ $or: [{ email }, { handphone }] })
  if (findEmail) {
    return res.status(405).json({ status: '405 Method Not Allowed', message: 'Email or Handphone alrady register' })
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

  if (!data) {
    return res.status(501).json({ status: '501 Not Implemented', message: 'Create Failed' })
  }

  return res.json({ status: 'ok', message: 'Create Success', data })
}

export default async function handler(req: Ireq, res: NextApiResponse<Data>) {
  try {
    let data
    await connectMongoDB()
    await validateSignin<Data>(req, res)
    if (req.method === 'GET') {
      return await GET(req, res)
    }
    if (req.method === 'POST') {
      await validateMasterAdmin(req, res)
      return await POST(req, res)
    }

    throw new Error('No data found')
  } catch (error: any) {
    return res.status(500).json({ status: 'error', message: error.message, error })
  }
}
