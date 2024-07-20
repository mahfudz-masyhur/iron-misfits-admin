import type { NextApiResponse } from 'next'
import { validateAdmin, validateSignin } from 'server/controllers/validate'
 
import { Ireq } from '../me/login'
import Package from 'server/models/Package'
import { IPackage } from 'server/type/Package'
import { PackageInput } from 'src/type/package'
import { ObjectId } from 'mongodb'
import { FilterQuery } from 'mongoose'
import connectMongoDB from 'server/libs/mongodb'

type Data = {
  status: string
  message: string
  data?: IPackage | IPackage[] | null
  error?: any
}

async function GET(req: Ireq, res: NextApiResponse<Data>) {
  let { search, packageType, status } = req.query
  const filter: FilterQuery<IPackage> = {}
  if (search) {
    const match = new RegExp(`${search}`, 'i')
    filter.name = { $regex: match }
  }
  if (packageType) filter.packageType = packageType
  if (status) filter.status = status

  const data = await Package.find(filter).sort({ updatedAt: -1 })

  return res.json({ status: 'ok', message: 'Get Success', data })
}

async function POST(req: Ireq, res: NextApiResponse<Data>) {
  const { user } = req
  const { _id, name, packageType, price, status, statusEdit, updatedAt } = req.body as PackageInput

  if (_id) {
    const data = await Package.findOneAndUpdate(
      { _id, updatedAt },
      {
        name: statusEdit ? name : undefined,
        packageType: statusEdit ? packageType : undefined,
        price: statusEdit ? price : undefined,
        status,
        lastEditedBy: user
      }
    )

    if (!data) {
      return res.status(501).json({ status: '501 Not Implemented', message: 'Update Failed' })
    }

    return res.json({ status: 'ok', message: 'Update Success', data })
  }

  const data = await Package.create({
    name,
    packageType,
    price,
    status,
    creator: user
  })

  return res.json({ status: 'ok', message: 'Create Success', data })
}

export default async function handler(req: Ireq, res: NextApiResponse<Data>) {
  try {
    await connectMongoDB()
    if (req.method === 'GET') {
      return await GET(req, res)
    }
    if (req.method === 'POST') {
      await validateSignin<Data>(req, res)
      await validateAdmin(req, res)
      return await POST(req, res)
    }

    throw new Error('No data found')
  } catch (error: any) {
    return res.status(500).json({ status: 'error', message: error.message, error })
  }
}
