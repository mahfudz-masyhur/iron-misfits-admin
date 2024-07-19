import type { NextApiResponse } from 'next'
import { validateAdmin, validateSignin } from 'server/controllers/validate'

import Member from 'server/models/Member'
import Transaction from 'server/models/Transaction'
import { IMember } from 'server/type/Member'
import connectMongoDB from 'server/libs/mongodb'
import { Ireq } from '../../me/login'

type Data = {
  status: string
  message: string
  data?: IMember | IMember[] | null
  error?: any
}

async function PUT(req: Ireq, res: NextApiResponse<Data>) {
  let param = `${req.query.id}`
  const { updatedAt } = req.body as IMember
  const data = await Member.findOneAndUpdate(
    { _id: param, updatedAt },
    {
      $unset: { isDeleted: '' }
    },
    { new: true }
  )

  if (!data) {
    return res.status(501).json({ status: '501 Not Implemented', message: 'Restore Member Failed' })
  }

  return res.json({ status: 'ok', message: 'Restore Member Success', data })
}

export default async function handler(req: Ireq, res: NextApiResponse<Data>) {
  try {
    if (req.method !== 'PUT') throw new Error('No data found')
    await connectMongoDB()
    await validateSignin<Data>(req, res)
    await validateAdmin(req, res)
    return await PUT(req, res)
  } catch (error: any) {
    return res.status(500).json({ status: 'error', message: error.message, error })
  }
}
