import type { NextApiResponse } from 'next'
import { validateAdmin, validateSignin } from 'server/controllers/validate'
 
import { Ireq } from '../me/login'
import { IPromo } from 'server/type/Promo'
import Promo from 'server/models/Promo'
import { PromoInput } from 'src/type/promo'
import connectMongoDB from 'server/libs/mongodb'

type Data = {
  status: string
  message: string
  data?: IPromo | IPromo[] | null
  error?: any
}

async function GETID(req: Ireq, res: NextApiResponse<Data>) {
  const param = `${req.query.id}`
  const data = await Promo.findById(param)

  return res.json({ status: 'ok', message: 'Get Success', data })
}

async function POST(req: Ireq, res: NextApiResponse<Data>) {
  const { user } = req
  const { _id, status, updatedAt } = req.body as PromoInput

  const data = await Promo.findOneAndUpdate(
    { _id, updatedAt },
    {
      status,
      lastEditedBy: user
    }
  )

  if (!data) {
    return res.status(501).json({ status: '501 Not Implemented', message: 'Update Failed' })
  }

  return res.json({ status: 'ok', message: 'Update Success', data })
}

async function DELETE(req: Ireq, res: NextApiResponse<Data>) {
  let param = `${req.query.id}`
  const { statusEdit, updatedAt } = req.body as IPromo

  if (!statusEdit) {
    return res.status(405).json({ status: '405 Method Not Allowed', message: 'Promo sudah digunakan' })
  }
  const data = await Promo.findOneAndDelete({ _id: param, updatedAt })

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
    if (req.method === 'POST') {
      await validateAdmin(req, res)
      return await POST(req, res)
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
