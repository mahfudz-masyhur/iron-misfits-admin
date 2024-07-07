import type { NextApiResponse } from 'next'
import { validateAdmin, validateSignin } from 'server/controllers/validate'
import connectMongoDB from 'server/libs/mongodb'
import Transaction from 'server/models/Transaction'
import { ITransaction } from 'server/type/Transaction'
import { Ireq } from '../me/login'
import Referral from 'server/models/Referal'
import { PendingRecordInput } from 'src/type/transaction'
import { removeEmptyStringProperties } from 'src/components/utility/formats'
import { ObjectId } from 'mongodb'

type Data = {
  status: string
  message: string
  data?: ITransaction | ITransaction[] | null
  error?: any
}

async function GETID(req: Ireq, res: NextApiResponse<Data>) {
  const param = `${req.query.id}`
  const data = await Transaction.findById(param)

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
      res.status(501).json({ status: '501 Not Implemented', message: 'Update failed' })
      throw new Error('Update failed')
    }

    const pandingIndex = transaction.pending.findIndex(f => `${f._id}` === `${pendingId}`)
    const nextPendingIndex = transaction.pending.findIndex(f => `${f._id}` === `${nextPendingId}`)
    if (pandingIndex < 0) throw new Error('transaction.pending not found')

    // Memperbarui subdocument
    transaction.status =
      nextPendingIndex < 0 ? 'ACTIVE' : transaction.pending[nextPendingIndex].type === 'PENDING' ? 'PENDING' : 'ACTIVE'
    transaction.expired = transaction.pending[pandingIndex].expiredBefore
    if (nextPendingIndex === 0) {
      transaction.pending[nextPendingIndex].statusEdit = true
    }

    transaction.pending.splice(pandingIndex, 1)

    const data = await transaction.save()

    return res.json({ status: 'ok', message: 'Update Success', data })
  }

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

  if (referral?._id) {
    const findTransaction = await Transaction.findOne({ _id: param, updatedAt })

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
  const data = await Transaction.findOneAndDelete({ _id: param, updatedAt })

  if (!data) {
    res.status(501).json({ status: '501 Not Implemented', message: 'Delete Failed' })
    throw new Error('')
  }

  return res.json({ status: 'ok', message: 'Delete Success', data })
}

async function POST(req: Ireq, res: NextApiResponse<Data>) {
  const { user, body, query } = req
  const { pendingId, id } = query
  let { pending, status, updatedAt, expired } = body as PendingRecordInput

  if (pendingId) {
    const transaction = await Transaction.findOne({ _id: id, updatedAt })
    if (!transaction) {
      res.status(501).json({ status: '501 Not Implemented', message: 'Update failed' })
      throw new Error('Update failed')
    }

    const pandingIndex = transaction.pending.findIndex(f => `${f._id}` === `${pendingId}`)
    if (pandingIndex < 0) throw new Error('transaction.pending not found')

    // Memperbarui subdocument
    transaction.expired = pending.expiredThen
    transaction.pending[pandingIndex].howMuchDays = pending.howMuchDays
    transaction.pending[pandingIndex].expiredThen = pending.expiredThen
    transaction.pending[pandingIndex].description = pending.description
    transaction.pending[pandingIndex].lastEditedBy = user

    const data = await transaction.save()

    return res.json({ status: 'ok', message: 'Update Success', data })
  }

  // Langkah 1: Update statusEdit pada pending index 0
  const transaction = await Transaction.findOne({ _id: id, updatedAt, 'pending.0': { $exists: true } })
  if (transaction) {
    transaction.pending[0].statusEdit = false
    const updateResult = await transaction.save()

    if (!updateResult) {
      res.status(501).json({ status: '501 Not Implemented', message: 'Update statusEdit Failed' })
      throw new Error('Update statusEdit Failed')
    }
  }

  // Langkah 2: Tambahkan extratime ke pending index 0
  const extratime = {
    _id: new ObjectId(),
    type: pending.type,
    howMuchDays: pending.howMuchDays,
    expiredBefore: pending.expiredBefore,
    expiredThen: pending.expiredThen,
    statusEdit: pending.statusEdit,
    description: pending.description,
    creator: user
  }

  const data = await Transaction.findByIdAndUpdate(
    id,
    {
      $set: { status, expired, 'pending.[0].statusEdit': false },
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
    res.status(501).json({ status: '501 Not Implemented', message: 'Create Failed' })
    throw new Error('')
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
