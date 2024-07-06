import type { NextApiResponse } from 'next'
import { validateAdmin, validateSignin } from 'server/controllers/validate'
import connectMongoDB from 'server/libs/mongodb'
import { Ireq } from '../me/login'
import Package from 'server/models/Package'
import { PackageInput } from 'src/type/package'
import { ObjectId } from 'mongodb'
import { FilterQuery } from 'mongoose'
import { ITransaction } from 'server/type/Transaction'
import Transaction from 'server/models/Transaction'
import { TransactionInput } from 'src/type/transaction'
import Referral from 'server/models/Referal'
import Member from 'server/models/Member'

type Data = {
  status: string
  message: string
  data?: ITransaction | ITransaction[] | null
  error?: any
}

async function GET(req: Ireq, res: NextApiResponse<Data>) {
  let { name, packageType, status, member } = req.query
  const filter: FilterQuery<ITransaction> = {}
  if (name) {
    const match = new RegExp(`${name}`, 'i')
    filter.name = { $regex: match }
  }
  if (packageType) filter.packageType = packageType
  if (status) filter.status = status
  if (member) filter.member = member

  const data = await Transaction.find(filter)

  return res.json({ status: 'ok', message: 'Get Success', data })
}

async function POST(req: Ireq, res: NextApiResponse<Data>) {
  const { user } = req
  const {
    _id,
    expired,
    member,
    pending,
    package: pckge,
    priceAfterdiscount,
    promo,
    referral,
    price,
    status,
    createdAt,
    updatedAt
  } = req.body
  console.log(req.body)

  if (_id) {
    if (!createdAt) {
      res.status(400).json({ status: '405 Method Not Allowed', message: 'createdAt is required' })
      throw new Error('')
    }

    const createdDate = new Date(createdAt)
    const now = new Date()

    // Menghitung perbedaan waktu dalam milidetik
    const differenceInTime = now.getTime() - createdDate.getTime()
    // Mengkonversi perbedaan waktu ke dalam hari
    const differenceInDays = differenceInTime / (1000 * 3600 * 24)

    if (differenceInDays > 1) {
      res
        .status(400)
        .json({ status: '405 Method Not Allowed', message: 'The transaction date cannot be more than one day old' })
      throw new Error('')
    }
    const data = await Transaction.findOneAndUpdate(
      { _id, updatedAt },
      {
        price,
        expired,
        member,
        pending,
        package: pckge,
        priceAfterdiscount,
        promo,
        referral,
        status,
        lastEditedBy: user
      }
    )

    if (!data) {
      res.status(501).json({ status: '501 Not Implemented', message: 'Update Failed' })
      throw new Error('')
    }

    // Jika referral tidak ada, kurangi referralInvitation pada Member
    if (!referral) {
      const referralInvitation = await Referral.findOneAndUpdate(
        { _id: referral, status: 'active' },
        { $inc: { useCount: -1 }, $set: { lastEditedBy: user } },
        { new: true }
      )
    }

    return res.json({ status: 'ok', message: 'Update Success', data })
  }

  if (referral) {
    const referralInvitation = await Referral.findOneAndUpdate(
      { _id: referral, status: 'active' },
      { $inc: { useCount: 1 }, $set: { lastEditedBy: user } },
      { new: true }
    )
    console.log({ referralInvitation })
    if (!referralInvitation) {
      res.status(400).json({ status: '405 Method Not Allowed', message: 'Referral is not active' })
      throw new Error('')
    }
  }

  const data = await Transaction.create({
    price,
    expired,
    member,
    pending,
    package: pckge,
    priceAfterdiscount,
    promo,
    referral,
    status,
    creator: user
  })

  return res.json({ status: 'ok', message: 'Create Success', data })
}

export default async function handler(req: Ireq, res: NextApiResponse<Data>) {
  try {
    console.log('\n\n\n', 'Referral')
    await connectMongoDB()
    await validateSignin<Data>(req, res)
    if (req.method === 'GET') {
      return await GET(req, res)
    }
    if (req.method === 'POST') {
      await validateAdmin(req, res)
      return await POST(req, res)
    }

    throw new Error('No data found')
  } catch (error: any) {
    return res.status(500).json({ status: 'error', message: error.message, error })
  }
}
