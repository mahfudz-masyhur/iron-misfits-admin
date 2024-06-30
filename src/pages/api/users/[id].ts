import type { NextApiResponse } from 'next'
import connectMongoDB from 'server/libs/mongodb'
import User from 'server/models/User'
import { IUser } from 'server/type/User'
import { Ireq } from '../me/login'
import { validateAdmin, validateMasterAdmin, validateSignin } from 'server/controllers/validate'

type Data = {
  status: string
  message: string
  data?: IUser | IUser[] | null
  error?: any
}

async function GETID(param: string) {
  const product = await User.findById(param)

  return { message: 'Get Success', data: product }
}

async function DELETE(req: Ireq, res: NextApiResponse<Data>) {
  const { user } = req
  const { email } = req.body as IUser
  let param: string | null = `${req.query.id}`
  if (process.env.MASTER_ADMIN === email && user.email !== process.env.MASTER_ADMIN) {
    res.status(405).json({ status: '405 Method Not Allowed', message: 'Anda tidak bisa menghapus akun ini' })
    param = null
  }
  if (user.email === email) {
    res.status(405).json({ status: '405 Method Not Allowed', message: 'Anda tidak bisa menghapus akun anda sendiri' })
    param = null
  }
  const data = await User.findByIdAndDelete(param)

  return { message: 'Delete Success', data }
}

export default async function handler(req: Ireq, res: NextApiResponse<Data>) {
  try {
    const param = `${req.query.id}`
    let data
    await connectMongoDB()
    await validateSignin<Data>(req, res)
    if (req.method === 'GET') {
      data = await GETID(param)
    }
    if (req.method === 'DELETE') {
      await validateMasterAdmin(req, res)
      data = await DELETE(req, res)
    }

    if (!data) throw new Error('No data found')

    return res.json({ status: 'ok', ...data })
  } catch (error: any) {
    return res.status(500).json({ status: 'error', message: error.message, error })
  }
}
