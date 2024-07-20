import type { NextApiResponse } from 'next'
import { validateAdmin, validateSignin } from 'server/controllers/validate'

import Member from 'server/models/Member'
import Transaction from 'server/models/Transaction'
import { IMember } from 'server/type/Member'
import { Ireq } from '../../me/login'
import connectMongoDB from 'server/libs/mongodb'

type Data = {
  status: string
  message: string
  data?: IMember | IMember[] | null
  error?: any
}

async function GETID(req: Ireq, res: NextApiResponse<Data>) {
  const param = `${req.query.id}`

  const data = await Member.findById(param)

  return res.json({ status: 'ok', message: 'Get Success', data })
}

async function DELETE(req: Ireq, res: NextApiResponse<Data>) {
  const {} = req.body
  let param = `${req.query.id}`
  const transactions = await Transaction.findOne({ member: param })
  if (transactions) {
    const { updatedAt } = req.body as IMember
    const data = await Member.findOneAndUpdate(
      { _id: param, updatedAt, isDeleted: { $exists: false } },
      {
        $set: { isDeleted: true },
        $unset: { avatar: '' }
      },
      { new: true }
    )

    if (!data) {
      return res.status(501).json({ status: '501 Not Implemented', message: 'Delete Failed' })
    }

    return res.json({
      status: 'ok',
      message: "The member has made a transaction, this member's avatar will be deleted",
      data
    })
  }

  const data = await Member.findByIdAndDelete(param)

  if (!data) {
    return res.status(501).json({ status: '501 Not Implemented', message: 'Delete Failed' })
  }

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
      await validateAdmin(req, res)
      return await DELETE(req, res)
    }

    throw new Error('No data found')
  } catch (error: any) {
    return res.status(500).json({ status: 'error', message: error.message, error })
  }
}
