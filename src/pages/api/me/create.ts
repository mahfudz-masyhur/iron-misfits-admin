import bcrypt from 'bcrypt'
import type { NextApiRequest, NextApiResponse } from 'next'
import connectMongoDB from 'server/libs/mongodb'
import User from 'server/models/User'
import { IUser } from 'server/type/User'
import { createToken } from 'server/utils/token'

export interface UserAccount extends IUser {
  isAdmin: true
  isMasterAdmin: true
  isViewer: true
}

export interface Ireq extends NextApiRequest {
  user: UserAccount
}

type Data = {
  status: string
  message: string
  data?: IUser
  error?: any
}

const createAdmin = async (req: Ireq, res: NextApiResponse<Data>) => {
  const userData = await User.findOne({ email: 'mfz.masyhur97@gmail.com' })

  if (userData) {
    return res.status(404).json({ status: '404 Not Found', message: 'Email sudag terdaftar' })
  }
  const salt = await bcrypt.genSalt(10)
  const password = await bcrypt.hash('admin-misfits', salt)

  const admin = new User({
    email: 'mfz.masyhur97@gmail.com',
    name: 'Mahfudz Masyhur',
    password,
    role: [1]
  })
  await admin.save()

  return res.json({ status: 'ok', message: 'Admin Success', data: admin })
}

export default async function handler(req: Ireq, res: NextApiResponse<Data>) {
  try {
    await connectMongoDB()
    if (req.method === 'GET') return await createAdmin(req, res)

    throw new Error('No data found')
  } catch (error: any) {
    return res.status(500).json({ status: 'error', message: error.message, error })
  }
}
