import type { NextApiResponse } from 'next'
import { validateMasterAdmin, validateSignin } from 'server/controllers/validate'
import connectMongoDB from 'server/libs/mongodb'
import User from 'server/models/User'
import { IUser } from 'server/type/User'
import { Ireq } from '../../me/login'
import bcrypt from 'bcrypt'
import { ChangePasswordBody } from 'src/type/users'

type Data = {
  status: string
  message: string
  data?: IUser | IUser[] | null
  error?: any
}

async function POST(req: Ireq, res: NextApiResponse<Data>) {
  const { user, body, query } = req
  const { email, updatedAt, newPassword, confirmNewPassword } = body as ChangePasswordBody

  if (user.email === email) {
    return res
      .status(405)
      .json({ status: '405 Method Not Allowed', message: 'Anda tidak bisa menghapus akun anda sendiri' })
  }

  if (newPassword !== confirmNewPassword) throw new Error('newPassword & confirmNewPassword not match')
  const account = await User.findById(query.id)
  if (!account) return res.status(404).json({ status: '404 Not Found', message: 'Unregistered Account' })

  const result = await bcrypt.compare(newPassword, account.password)
  if (result) throw new Error('The current password cannot be used as a new password')

  const salt = await bcrypt.genSalt(10)
  const password = await bcrypt.hash(newPassword, salt)

  const data = await User.findOneAndUpdate({ _id: query.id, updatedAt }, { $set: { password } }, { new: true })

  return res.json({ status: 'ok', message: 'Delete Success', data })
}

export default async function handler(req: Ireq, res: NextApiResponse<Data>) {
  try {
    await connectMongoDB()
    await validateSignin<Data>(req, res)
    if (req.method === 'POST') {
      await validateMasterAdmin(req, res)
      return await POST(req, res)
    }

    throw new Error('No data found')
  } catch (error: any) {
    return res.status(500).json({ status: 'error', message: error.message, error })
  }
}
