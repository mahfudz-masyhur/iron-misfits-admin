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
  const { newPassword, confirmNewPassword, currentPassword } = body

  if (newPassword !== confirmNewPassword) throw new Error('newPassword & confirmNewPassword not match')
  if (!user) return res.status(401).json({ status: 'error', message: 'You are not permitted to access' })
  const account = await User.findById(user._id)
  if (!account) return res.status(404).json({ status: '404 Not Found', message: 'Unregistered Account' })

  const compare = await bcrypt.compare(currentPassword, account.password)
  if (!compare) throw new Error('Current Password Not Matching')

  const result = await bcrypt.compare(newPassword, account.password)
  if (result) throw new Error('The current password cannot be used as a new password')

  const salt = await bcrypt.genSalt(10)
  const password = await bcrypt.hash(newPassword, salt)

  const userData = await User.findByIdAndUpdate(account._id, { password })

  return res.json({ status: 'ok', message: 'Change password success', data: userData })
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
