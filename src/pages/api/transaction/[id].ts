import { ObjectId } from 'mongodb'
import type { NextApiResponse } from 'next'
import { validateAdmin, validateSignin } from 'server/controllers/validate'
import connectMongoDB from 'server/libs/mongodb'
import Referral from 'server/models/Referal'
import Transaction from 'server/models/Transaction'
import { ITransaction } from 'server/type/Transaction'
import { PendingRecordInput } from 'src/type/transaction'
import { Ireq } from '../me/login'

type Data = {
  status: string
  message: string
  data?: ITransaction | ITransaction[] | null
  error?: any
}

async function GETID(req: Ireq, res: NextApiResponse<Data>) {
  const param = `${req.query.id}`
  const data = await Transaction.findById(param).populate('creator', '_id name ').populate('lastEditedBy', '_id name')

  return res.json({ status: 'ok', message: 'Get Success', data })
}

async function DELETE(req: Ireq, res: NextApiResponse<Data>) {
  const { user, query } = req
  const { pendingId, nextPendingId, id } = query
  let param = `${req.query.id}`
  const { updatedAt, createdAt, referral } = req.body as ITransaction

  if (pendingId) {
    const transaction = await Transaction.findOne({ _id: id, updatedAt })
    if (!transaction) {
      return res.status(501).json({ status: '501 Not Implemented', message: 'Update failed' })
    }

    const pandingIndex = transaction.pending.findIndex(f => `${f._id}` === `${pendingId}`)
    const nextPendingIndex = transaction.pending.findIndex(f => `${f._id}` === `${nextPendingId}`)
    if (pandingIndex < 0) {
      return res.status(501).json({ status: '501 Not Implemented', message: 'transaction.pending not found' })
    }

    // Memperbarui subdocument
    transaction.status =
      nextPendingIndex < 0 ? 'ACTIVE' : transaction.pending[nextPendingIndex].type === 'PENDING' ? 'PENDING' : 'ACTIVE'
    transaction.expired = transaction.pending[pandingIndex].expiredBefore

    transaction.pending.splice(pandingIndex, 1)

    const data = await transaction.save()

    return res.json({ status: 'ok', message: 'Update Success', data })
  }

  if (!createdAt) {
    return res.status(400).json({ status: '405 Method Not Allowed', message: 'createdAt is required' })
  }

  const createdDate = new Date(createdAt)
  const now = new Date()

  // Menghitung perbedaan waktu dalam milidetik
  const differenceInTime = now.getTime() - createdDate.getTime()
  // Mengkonversi perbedaan waktu ke dalam hari
  const differenceInDays = differenceInTime / (1000 * 3600 * 24)

  if (differenceInDays >= 1) {
    return res.status(400).json({
      status: '405 Method Not Allowed',
      message: 'Transactions cannot be edited if they are more than one day old'
    })
  }

  if (referral?._id) {
    const findTransaction = await Transaction.findOne({ _id: param, updatedAt })

    if (!findTransaction) {
      return res.status(404).json({ status: '404 Not Found', message: 'Transaction not founded' })
    }
    if (findTransaction.referral) {
      const referralInvitation = await Referral.findOneAndUpdate(
        { _id: findTransaction.referral._id, status: 'active' },
        { $inc: { useCount: -1 } },
        { new: true, timestamps: false }
      )

      if (!referralInvitation) {
        return res
          .status(501)
          .json({ status: '501 Not Implemented', message: 'Referral remove useCount update Failed' })
      }
    }
  }
  const data = await Transaction.findOneAndDelete({ _id: param, updatedAt })

  if (!data) {
    return res.status(501).json({ status: '501 Not Implemented', message: 'Delete Failed' })
  }

  return res.json({ status: 'ok', message: 'Delete Success', data })
}

function isWithinOneDay(dateString: string): boolean {
  const givenDate = new Date(dateString)
  const currentDate = new Date()
  if (isNaN(givenDate.getTime())) return false
  const timeDifference = currentDate.getTime() - givenDate.getTime()
  const dayDifference = timeDifference / (1000 * 3600 * 24)

  return dayDifference <= 1
}

async function POST(req: Ireq, res: NextApiResponse<Data>) {
  const { user, body, query } = req
  const { pendingId, id } = query
  let { pending, status, updatedAt, expired } = body as PendingRecordInput

  if (pendingId) {
    const transaction = await Transaction.findOne({ _id: id, updatedAt })
    if (!transaction) {
      return res.status(404).json({ status: '404 Not Found', message: 'Transaction not found' })
    }

    const pandingIndex = transaction.pending.findIndex(f => `${f._id}` === `${pendingId}`)
    const pandingFind = transaction.pending.find(f => `${f._id}` === `${pendingId}`)
    if (pandingIndex < 0) {
      return res.status(404).json({ status: '404 Not Found', message: 'transaction.pending not found' })
    }
    const canEdit = isWithinOneDay(`${pandingFind?.createdAt}`) && pandingIndex === 0
    if (!canEdit) {
      return res.status(501).json({
        status: '501 Not Implemented',
        message: 'Transactions cannot be edited if they are more than one day old'
      })
    }

    // Memperbarui subdocument
    transaction.status = status
    transaction.expired = pending.expiredThen
    transaction.pending[pandingIndex].howMuchDays = pending.howMuchDays
    transaction.pending[pandingIndex].expiredThen = pending.expiredThen
    transaction.pending[pandingIndex].description = pending.description
    transaction.pending[pandingIndex].lastEditedBy = user

    const data = await transaction.save()

    return res.json({ status: 'ok', message: 'Update Success', data })
  }

  const extratime = {
    _id: new ObjectId(),
    type: pending.type,
    howMuchDays: pending.howMuchDays,
    expiredBefore: pending.expiredBefore,
    expiredThen: pending.expiredThen,
    description: pending.description,
    creator: user
  }

  const data = await Transaction.findByIdAndUpdate(
    id,
    {
      $set: { status, expired },
      $push: {
        pending: {
          $each: [extratime],
          $position: 0
        }
      }
    },
    { new: true }
  )

  if (!data) {
    return res.status(501).json({ status: '501 Not Implemented', message: 'Create Failed' })
  }

  return res.json({ status: 'ok', message: 'Create Success', data })
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
    if (req.method === 'POST') {
      await validateAdmin(req, res)
      return await POST(req, res)
    }

    throw new Error('No data found')
  } catch (error: any) {
    return res.status(500).json({ status: 'error', message: error.message, error })
  }
}
