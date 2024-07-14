import type { NextApiResponse } from 'next'
import { validateSignin } from 'server/controllers/validate'
 import { Ireq, UserAccount } from './login'
 import connectMongoDB from 'server/libs/mongodb'

type Data = {
  status: string
  message: string
  data?: UserAccount | null
  error?: any
}

const getMyUserAccount = async (req: Ireq, res: NextApiResponse<Data>) => {
  try {
    const { user } = req

    if (!user) {
      return res.status(404).json({ status: '404 Not Found', message: 'Akun tidak ditemukan' })
    }

    return { message: 'Login Success', data: user }
  } catch (err: any) {
    res.status(500).json({
      status: 'error',
      message: err.message
    })
  }
}

export default async function handler(req: Ireq, res: NextApiResponse<Data>) {
  try {
    await connectMongoDB()
    if (req.method !== 'GET') throw new Error('Only GET method')
    await validateSignin<Data>(req, res)
    const data = await getMyUserAccount(req, res)

    if (!data) throw new Error('No data found')

    return res.json({ status: 'ok', ...data })
  } catch (error: any) {
    return res.status(500).json({ status: 'error', message: error.message, error })
  }
}
