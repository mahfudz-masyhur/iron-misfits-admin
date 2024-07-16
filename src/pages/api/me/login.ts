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

  console.log('\n\n\n', 'Login', { email })
  const userData = await User.findOne({ email })
  console.log({ userData })

  if (!userData) {
    return res.status(404).json({ status: '404 Not Found', message: 'Email Tidak Terdaftar' })
  }

  const user = userData as unknown as UserAccount
  console.log({ password, 'user.password':user.password })
  const result = await bcrypt.compare(password, user.password)
  console.log({ result })

  if (!result) {
    return res.status(404).json({ status: '404 Not Found', message: 'Password anda salah' })
  }

  req.user = user

  console.log({ user })
  const token = createToken(user)
  console.log({ token })

  if (user?.email === process.env.MASTER_ADMIN) user.isMasterAdmin = true
  if (user?.role.includes(1)) user.isAdmin = true
  if (user?.role.includes(2)) user.isViewer = true

  return res.json({ status: 'ok', message: 'Login Success', data: { user, token } })
}

export default async function handler(req: Ireq, res: NextApiResponse<Data>) {
  try {
    await connectMongoDB()
    if (req.method === 'POST') return await userLogin(req, res)

    throw new Error('No data found')
  } catch (error: any) {
    return res.status(500).json({ status: 'error', message: error.message, error })
  }
}
