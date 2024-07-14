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
  data?: { user: UserAccount | null; token: string }
  error?: any
}

const userLogin = async (req: Ireq, res: NextApiResponse<Data>) => {
  const { email, password } = req.body

  const userData = await User.findOne({ email })

  if (!userData) {
    return res.status(404).json({ status: '404 Not Found', message: 'Email Tidak Terdaftar' })
  }

  const user = JSON.parse(JSON.stringify(userData)) as UserAccount

  const result = await bcrypt.compare(password, user.password)

  if (!result) {
    return res.status(404).json({ status: '404 Not Found', message: 'Password anda salah' })
  }

  req.user = user

  const token = createToken(user)

  if (user?.email === process.env.MASTER_ADMIN) user.isMasterAdmin = true
  if (user?.role.includes(1)) user.isAdmin = true
  if (user?.role.includes(2)) user.isViewer = true

  return { message: 'Login Success', data: { user, token } }
}

export default async function handler(req: Ireq, res: NextApiResponse<Data>) {
  try {
    await connectMongoDB()
    let data
    if (req.method === 'POST') data = await userLogin(req, res)

    if (!data) throw new Error('No data found')

    return res.json({ status: 'ok', ...data })
  } catch (error: any) {
    return res.status(500).json({ status: 'error', message: error.message, error })
  }
}
