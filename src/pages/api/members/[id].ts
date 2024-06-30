import type { NextApiResponse } from 'next'
import connectMongoDB from 'server/libs/mongodb'
import Member from 'server/models/Member'
import { Ireq } from '../me/login'
import { validateAdmin, validateMasterAdmin, validateSignin } from 'server/controllers/validate'
import { IMember } from 'server/type/Member'

type Data = {
  status: string
  message: string
  data?: IMember | IMember[] | null
  error?: any
}

async function GETID(param: string) {
  const product = await Member.findById(param)

  return { message: 'Get Success', data: product }
}

async function DELETE(req: Ireq, res: NextApiResponse<Data>) {
  let param = `${req.query.id}`
  const data = await Member.findByIdAndDelete(param)

  return { message: 'Delete Success', data }
}

export default async function handler(req: Ireq, res: NextApiResponse<Data>) {
  try {
    const param = `${req.query.id}`
    let data
    await connectMongoDB()
    await validateSignin<Data>(req, res)
    if (req.method === 'GET') {
      await validateAdmin(req, res)
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
