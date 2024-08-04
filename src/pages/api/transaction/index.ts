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
import { TransactionInput } from 'src/type/transaction'
import { AnyObject, AnyKeys } from 'mongoose'

type Data = {
  status: string
  message: string
  data?: ITransaction | ITransaction[] | null
  error?: any
}

function detectNullFieldsForUnset(data: AnyKeys<ITransaction> & AnyObject): AnyKeys<ITransaction> & AnyObject {
  const unsetFields: AnyKeys<ITransaction> & AnyObject = {}

  for (const [key, value] of Object.entries(data)) {
    if (value === null) {
      unsetFields[key] = '' // Set value to an empty string or any placeholder
    }
  }

  return unsetFields
}
function removeNullFields(data: Record<string, any>): Record<string, any> {
  const filteredData: Record<string, any> = {}

  for (const [key, value] of Object.entries(data)) {
    if (value !== null) {
      filteredData[key] = value
    }
  }

  return filteredData
}
async function GET(req: Ireq, res: NextApiResponse<Data>) {
  let { search, packageType, status, member, expired } = req.query
  const filter: FilterQuery<ITransaction> = {}
  if (search) {
    const match = new RegExp(`${search}`, 'i')
    filter.name = { $regex: match }
  }
  if (packageType) filter.packageType = packageType
  if (status) filter.status = status
  if (member) filter.member = member
  if (expired) filter.expired = { $lt: expired }

  const data = await Transaction.find(filter)
    .populate('creator', '_id name')
    .populate('lastEditedBy', '_id name')
    .sort({ createdAt: -1 })

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
    updatedAt,
    paymentType
  } = req.body as TransactionInput

  if (_id) {
    if (!createdAt) {
      return res.status(400).json({ status: '405 Method Not Allowed', message: 'createdAt is required' })
    }

    const createdDate = new Date(createdAt)
    const now = new Date()
    const differenceInTime = now.getTime() - createdDate.getTime()
    const differenceInDays = differenceInTime / (1000 * 3600 * 24)
    if (differenceInDays >= 1) {
      return res.status(400).json({
        status: '405 Method Not Allowed',
        message: 'Transactions cannot be edit if they are more than one day old'
      })
    }

    // Cek dan update Package
    const packageToUpdate = await Package.findOne({ _id: pckge, statusEdit: true })
    if (packageToUpdate) {
      const packageUpdated = await Package.findOneAndUpdate(
        { _id: pckge },
        { $set: { statusEdit: false } },
        { new: true, timestamps: false }
      )
      if (!packageUpdated) {
        return res.status(501).json({ status: '501 Not Implemented', message: 'Package statusEdit update Failed' })
      }
    }

    // Cek dan update Promo
    if (promo) {
      const findTransaction = await Transaction.findOne({ _id, updatedAt })

      if (!findTransaction) {
        return res.status(404).json({ status: '404 Not Found', message: 'Transaction not founded' })
      }

      if (`${promo}` !== `${findTransaction.promo?._id}`) {
        if (findTransaction.promo?._id) {
          const promoBefore = await Promo.findOneAndUpdate(
            { _id: findTransaction?.promo?._id },
            { $set: { statusEdit: false } },
            { new: true, timestamps: false }
          )
          if (!promoBefore) {
            return res
              .status(501)
              .json({ status: '501 Not Implemented', message: 'Promo before useCount update Failed' })
          }

          const findPromoInTransaction = await Transaction.find({ member, promo: findTransaction?.promo?._id }).limit(2)
          if (findPromoInTransaction.length === 1) {
            const pullMember = await Promo.findOneAndUpdate(
              { _id: findTransaction?.promo?._id },
              { $pull: { members: member } },
              { new: true, timestamps: false }
            )
            if (!pullMember) {
              return res.status(501).json({ status: '501 Not Implemented', message: 'Delete Member in Promo Failed' })
            }
          }
        }

        const referralInvitationAfter = await Promo.findOneAndUpdate(
          { _id: promo },
          { $set: { statusEdit: false }, $addToSet: { members: member } },
          { new: true, timestamps: false }
        )

        if (!referralInvitationAfter) {
          return res
            .status(501)
            .json({ status: '501 Not Implemented', message: 'Referral after useCount update Failed' })
        }
      } else {
        const promoUpdated = await Promo.findOneAndUpdate(
          { _id: promo },
          { $set: { statusEdit: false }, $addToSet: { members: member } },
          { new: true, timestamps: false }
        )
        if (!promoUpdated) {
          return res.status(501).json({ status: '501 Not Implemented', message: 'Promo statusEdit update Failed' })
        }
      }
    } else {
      const findTransaction = await Transaction.findOne({ _id, updatedAt })

      if (!findTransaction) {
        return res.status(404).json({ status: '404 Not Found', message: 'Transaction not founded' })
      }

      if (findTransaction.promo) {
        const promoUpdated = await Promo.findOneAndUpdate(
          { _id: findTransaction.promo, members: member },
          { $set: { statusEdit: false } },
          { new: true, timestamps: false }
        )
        if (!promoUpdated) {
          return res.status(501).json({ status: '501 Not Implemented', message: 'Promo statusEdit update Failed' })
        }
        const findPromoInTransaction = await Transaction.find({ member, promo: findTransaction.promo._id }).limit(2)
        if (findPromoInTransaction.length === 1) {
          const pullMember = await Promo.findOneAndUpdate(
            { _id: findTransaction?.promo?._id },
            { $pull: { members: member } },
            { new: true, timestamps: false }
          )
          if (!pullMember) {
            return res.status(501).json({ status: '501 Not Implemented', message: 'Delete Member in Promo Failed' })
          }
        }
      }
    }

    // Jika referral tidak ada, kurangi referralInvitation pada Member
    if (referral) {
      const findTransaction = await Transaction.findOne({ _id, updatedAt })

      if (!findTransaction) {
        return res.status(404).json({ status: '404 Not Found', message: 'Transaction not founded' })
      }

      if (`${referral}` !== `${findTransaction.referral?._id}`) {
        if (findTransaction.referral?._id) {
          const referralInvitationBefore = await Referral.findOneAndUpdate(
            { _id: findTransaction?.referral?._id, status: 'active' },
            { $inc: { useCount: -1 }, $set: { statusEdit: false } },
            { new: true, timestamps: false }
          )
          if (!referralInvitationBefore) {
            return res
              .status(501)
              .json({ status: '501 Not Implemented', message: 'Referral before useCount update Failed' })
          }

          const findReferralInTransaction = await Transaction.find({
            member,
            referral: findTransaction?.referral?._id
          }).limit(2)
          if (findReferralInTransaction.length === 1) {
            const pullMember = await Referral.findOneAndUpdate(
              { _id: findTransaction?.referral?._id, status: 'active' },
              { $pull: { memberUse: member } },
              { new: true, timestamps: false }
            )
            if (!pullMember) {
              return res
                .status(501)
                .json({ status: '501 Not Implemented', message: 'Delete Member in Referral Failed' })
            }
          }
        }

        const referralInvitationAfter = await Referral.findOneAndUpdate(
          { _id: referral, status: 'active' },
          { $inc: { useCount: 1 }, $set: { statusEdit: false }, $addToSet: { memberUse: member } },
          { new: true, timestamps: false }
        )

        if (!referralInvitationAfter) {
          return res
            .status(501)
            .json({ status: '501 Not Implemented', message: 'Referral after useCount update Failed' })
        }
      } else {
        const referralInvitationAfter = await Referral.findOne({ _id: referral, status: 'active', memberUse: member })
        if (!referralInvitationAfter) {
          await Referral.findByIdAndUpdate(
            referral,
            {
              $inc: { useCount: 1 },
              $set: { statusEdit: false },
              $addToSet: { memberUse: member }
            },
            { new: true, timestamps: false }
          )
        }
      }
    } else {
      const findTransaction = await Transaction.findOne({ _id, updatedAt })

      if (!findTransaction) {
        return res.status(404).json({ status: '404 Not Found', message: 'Transaction not founded' })
      }

      if (findTransaction.referral) {
        const referralInvitation = await Referral.findOneAndUpdate(
          { _id: findTransaction.referral._id, status: 'active' },
          { $inc: { useCount: -1 }, $set: { statusEdit: false } },
          { new: true, timestamps: false }
        )

        if (!referralInvitation) {
          return res
            .status(501)
            .json({ status: '501 Not Implemented', message: 'Referral remove useCount update Failed' })
        }

        const findReferralInTransaction = await Transaction.find({
          member,
          referral: findTransaction?.referral?._id
        }).limit(2)
        if (findReferralInTransaction.length === 1) {
          const pullMember = await Referral.findOneAndUpdate(
            { _id: findTransaction?.referral?._id, status: 'active' },
            { $pull: { memberUse: member } },
            { new: true, timestamps: false }
          )
          if (!pullMember) {
            return res.status(501).json({ status: '501 Not Implemented', message: 'Delete Member in Referral Failed' })
          }
        }
      }
    }

    const dataToUpdate = {
      price,
      expired,
      member,
      package: pckge,
      priceAfterdiscount,
      promo,
      referral,
      description,
      status,
      discountBA,
      paymentType,
      lastEditedBy: user._id
    }
    const data = await Transaction.findOneAndUpdate(
      { _id, updatedAt },
      {
        $set: removeNullFields(dataToUpdate),
        $unset: detectNullFieldsForUnset(dataToUpdate)
      },
      { new: true, timestamps: false }
    )

    if (!data) {
      return res.status(501).json({ status: '501 Not Implemented', message: 'Update Failed' })
    }

    return res.json({ status: 'ok', message: 'Update Success', data })
  }

  const findActiveTransaction = await Transaction.find({ member, status: { $in: ['ACTIVE', 'PENDING'] } }).limit(2)
  if (findActiveTransaction.length > 0) {
    return res.status(405).json({
      status: '405 Method Not Allowed',
      message: 'Cant not create new transaction if there is an active or pending transaction'
    })
  }

  // Cek dan update Package
  const packageToUpdate = await Package.findOne({ _id: pckge, statusEdit: true })
  if (packageToUpdate) {
    const packageUpdated = await Package.findOneAndUpdate(
      { _id: pckge },
      { $set: { statusEdit: false } },
      { new: true, timestamps: false }
    )
    if (!packageUpdated) {
      return res.status(501).json({ status: '501 Not Implemented', message: 'Package statusEdit update Failed' })
    }
  }

  // Cek dan update Promo
  if (promo) {
    const promoUpdated = await Promo.findOneAndUpdate(
      { _id: promo },
      { $set: { statusEdit: false }, $addToSet: { members: member } },
      { new: true, timestamps: false }
    )
    if (!promoUpdated) {
      return res.status(501).json({ status: '501 Not Implemented', message: 'Promo statusEdit update Failed' })
    }
  }

  if (referral) {
    const referralInvitation = await Referral.findOneAndUpdate(
      { _id: referral, status: 'active' },
      { $inc: { useCount: 1 }, $set: { statusEdit: false }, $addToSet: { memberUse: member } },
      { new: true, timestamps: false }
    )
    if (!referralInvitation) {
      return res.status(405).json({ status: '405 Method Not Allowed', message: 'Referral is not active' })
    }
  }

  const data = await Transaction.create(
    removeNullFields({
      price,
      expired,
      member,
      package: pckge,
      priceAfterdiscount,
      promo,
      referral,
      discountBA: discountBA ? discountBA : undefined,
      description,
      status,
      paymentType,
      creator: user._id
    })
  )

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
