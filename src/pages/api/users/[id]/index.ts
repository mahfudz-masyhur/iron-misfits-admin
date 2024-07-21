import type { NextApiResponse } from 'next'
import { validateMasterAdmin, validateSignin } from 'server/controllers/validate'
import connectMongoDB from 'server/libs/mongodb'
import User from 'server/models/User'
import { IUser } from 'server/type/User'
import { Ireq } from '../../me/login'

type Data = {
  status: string
  message: string
  data?: IUser | IUser[] | null
  error?: any
}

async function GETID(req: Ireq, res: NextApiResponse<Data>) {
  const param = `${req.query.id}`
  const data = await User.findById(param).populate('creator', '_id name').populate('lastEditedBy', '_id name')

  return res.json({ status: 'ok', message: 'Get Success', data })
}

async function DELETE(req: Ireq, res: NextApiResponse<Data>) {
  const { user, body, query } = req
  const { email, updatedAt } = body as IUser

  if (user.email === email) {
    return res
      .status(405)
      .json({ status: '405 Method Not Allowed', message: 'Anda tidak bisa menghapus akun anda sendiri' })
  }

  const data = await User.findOneAndUpdate(
    { _id: query.id, updatedAt },
    {
      $set: { isDeleted: true },
      $unset: { avatar: '' }
    },
    { new: true }
  )

  return res.json({ status: 'ok', message: 'Delete Success', data })
}

export default async function handler(req: Ireq, res: NextApiResponse<Data>) {
  try {
    await connectMongoDB()
    await validateSignin<Data>(req, res)
    if (req.method === 'GET') {
      return await GETID(req, res)
    }
    if (req.method === 'DELETE') {
      await validateMasterAdmin(req, res)
      return await DELETE(req, res)
    }

    throw new Error('No data found')
  } catch (error: any) {
    return res.status(500).json({ status: 'error', message: error.message, error })
  }
}
