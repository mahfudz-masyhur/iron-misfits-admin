import { FilterQuery } from 'mongoose'
import type { NextApiResponse } from 'next'
import { validateAdmin, validateSignin } from 'server/controllers/validate'
import connectMongoDB from 'server/libs/mongodb'
import Package from 'server/models/Package'
import Promo from 'server/models/Promo'
import Referral from 'server/models/Referal'
import Transaction from 'server/models/Transaction'
import { ITransaction } from 'server/type/Transaction'
import { Ireq } from '../me/login'

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
    package: pckge,
    priceAfterdiscount,
    promo,
    referral,
    price,
    status,
    discountBA,
    description,
    createdAt,
    updatedAt
  } = req.body

  // Cek dan update Package
  const packageToUpdate = await Package.findOne({ _id: pckge, statusEdit: true })
  if (packageToUpdate) {
    const packageUpdated = await Package.findOneAndUpdate(
      { _id: pckge },
      { $set: { statusEdit: false } },
      { new: true, timestamps: false }
    )
    if (!packageUpdated) {
      res.status(501).json({ status: '501 Not Implemented', message: 'Package statusEdit update Failed' })
      throw new Error('')
    }
  }

  // Cek dan update Promo
  const promoToUpdate = await Promo.findOne({ _id: promo, statusEdit: true })
  if (promoToUpdate) {
    const promoUpdated = await Promo.findOneAndUpdate(
      { _id: promo },
      { $set: { statusEdit: false } },
      { new: true, timestamps: false }
    )
    if (!promoUpdated) {
      res.status(501).json({ status: '501 Not Implemented', message: 'Promo statusEdit update Failed' })
      throw new Error('')
    }
  }

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

    if (differenceInDays >= 1) {
      res
        .status(400)
        .json({ status: '405 Method Not Allowed', message: 'The transaction date cannot be more than one day old' })
      throw new Error('')
    }

    // Jika referral tidak ada, kurangi referralInvitation pada Member
    if (referral) {
      const findTransaction = await Transaction.findOne({ _id, updatedAt })

      if (!findTransaction) {
        res.status(404).json({ status: '404 Not Found', message: 'Transaction not founded' })
        throw new Error('')
      }

      if (`${referral}` !== `${findTransaction.referral?._id}`) {
        if (findTransaction.referral?._id) {
          const referralInvitationBefore = await Referral.findOneAndUpdate(
            { _id: findTransaction?.referral?._id, status: 'active' },
            { $inc: { useCount: -1 }, $set: { statusEdit: false } },
            { new: true, timestamps: false }
          )
          if (!referralInvitationBefore) {
            res.status(501).json({ status: '501 Not Implemented', message: 'Referral before useCount update Failed' })
            throw new Error('')
          }
        }

        const referralInvitationAfter = await Referral.findOneAndUpdate(
          { _id: referral, status: 'active' },
          { $inc: { useCount: 1 }, $set: { statusEdit: false } },
          { new: true, timestamps: false }
        )

        if (!referralInvitationAfter) {
          res.status(501).json({ status: '501 Not Implemented', message: 'Referral after useCount update Failed' })
          throw new Error('')
        }
      }
    } else {
      const findTransaction = await Transaction.findOne({ _id, updatedAt })

      if (!findTransaction) {
        res.status(404).json({ status: '404 Not Found', message: 'Transaction not founded' })
        throw new Error('')
      }
      const referralInvitation = await Referral.findOneAndUpdate(
        { _id: findTransaction?.referral?._id, status: 'active' },
        { $inc: { useCount: -1 }, $set: { statusEdit: false } },
        { new: true, timestamps: false }
      )

      if (!referralInvitation) {
        res.status(501).json({ status: '501 Not Implemented', message: 'Referral remove useCount update Failed' })
        throw new Error('')
      }
    }

    const data = await Transaction.findOneAndUpdate(
      { _id, updatedAt },
      {
        price,
        expired,
        member,
        package: pckge,
        priceAfterdiscount,
        promo,
        referral,
        description,
        status,
        lastEditedBy: user
      }
    )

    if (!data) {
      res.status(501).json({ status: '501 Not Implemented', message: 'Update Failed' })
      throw new Error('')
    }

    return res.json({ status: 'ok', message: 'Update Success', data })
  }

  const findActiveTransaction = await Transaction.find({ member, status: 'ACTIVE' })
  if (findActiveTransaction.length > 0) {
    res.status(405).json({
      status: '405 Method Not Allowed',
      message: 'Cant not create new transaction if there is an active transaction'
    })
    throw new Error('')
  }

  if (referral) {
    const referralInvitation = await Referral.findOneAndUpdate(
      { _id: referral, status: 'active' },
      { $inc: { useCount: 1 }, $set: { statusEdit: false } },
      { new: true, timestamps: false }
    )
    if (!referralInvitation) {
      res.status(405).json({ status: '405 Method Not Allowed', message: 'Referral is not active' })
      throw new Error('')
    }
  }

  const data = await Transaction.create({
    price,
    expired,
    member,
    package: pckge,
    priceAfterdiscount,
    promo,
    referral,
    discountBA,
    description,
    status: 'ACTIVE',
    creator: user
  })

  return res.json({ status: 'ok', message: 'Create Success', data })
}

export default async function handler(req: Ireq, res: NextApiResponse<Data>) {
  try {
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
