import bcrypt from 'bcrypt'
import type { NextApiRequest, NextApiResponse } from 'next'
import { validateSignin } from 'server/controllers/validate'
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
  data?: IUser | null
  error?: any
}

const POST = async (req: Ireq, res: NextApiResponse<Data>) => {
  const { body, user } = req
  const { avatar, name, handphone } = body

  const userData = await User.findByIdAndUpdate(user._id, { avatar, name, handphone })

  return res.json({ status: 'ok', message: 'Change profile success', data: userData })
}

export default async function handler(req: Ireq, res: NextApiResponse<Data>) {
  try {
    await connectMongoDB()
    await validateSignin(req, res)
    if (req.method !== 'POST') throw new Error('No data found')
    return await POST(req, res)
  } catch (error: any) {
    return res.status(500).json({ status: 'error', message: error.message, error })
  }
}
