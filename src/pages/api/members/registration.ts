import type { NextApiResponse } from 'next'
import connectMongoDB from 'server/libs/mongodb'
import Member from 'server/models/Member'
import Transaction from 'server/models/Transaction'
import { IMember } from 'server/type/Member'
import { RegisterMemberValues } from 'src/components/pages/members/RegistrationPage'
import { Ireq } from '../me/login'
import Members from 'src/pages/members'
import Promo from 'server/models/Promo'
import Referral from 'server/models/Referal'
import Package from 'server/models/Package'

type Data = {
  status: string
  message: string
  data?: IMember | IMember[] | null
  error?: any
}

async function POST(req: Ireq, res: NextApiResponse<Data>) {
  const {
    name,
    avatar,
    handphone,
    socialmedia,
    price,
    priceAfterdiscount,
    package: pckge,
    promo,
    referral
  } = req.body as RegisterMemberValues

  if (pckge) {
    const checkPckge = await Package.findById(pckge)

    if (!checkPckge) throw new Error('Pckge tidak ditemukan')
    if (checkPckge.status !== 'active') throw new Error('Pckge tidak aktif')
  }

  if (promo) {
    const checkPromo = await Promo.findById(promo)

    if (!checkPromo) throw new Error('Promo tidak ditemukan')
    if (checkPromo.status !== 'active') throw new Error('Promo tidak aktif')
    const currentDate = new Date()

    if (checkPromo.startDate && checkPromo.startDate > currentDate) throw new Error('Promo belum dimulai')
    if (checkPromo.endDate && checkPromo.endDate < currentDate) throw new Error('Promo sudah kedaluwarsa')
  }

  if (referral) {
    const checkReferral = await Referral.findById(referral)

    if (!checkReferral) throw new Error('Referral tidak ditemukan')
    if (checkReferral.status !== 'active') throw new Error('Referral tidak aktif')
  }

  const data = await Member.create({
    name,
    avatar,
    handphone,
    socialmedia
  })

  if (!data) {
    return res.status(501).json({ status: '501 Not Implemented', message: 'Create Failed' })
  }

  const transaction = await Transaction.create({
    price,
    member: data._id,
    package: pckge,
    priceAfterdiscount,
    promo,
    referral,
    status: 'NOT-YEY-PAID',
    creator: data._id
  })

  if (!transaction) {
    await Member.findByIdAndDelete(data._id)
    return res.status(501).json({ status: '501 Not Implemented', message: 'Create Failed' })
  }

  return res.json({ status: 'ok', message: 'Create Success', data })
}

export default async function handler(req: Ireq, res: NextApiResponse<Data>) {
  try {
    await connectMongoDB()
    if (req.method !== 'POST') throw new Error('No data found')
    return await POST(req, res)
  } catch (error: any) {
    return res.status(500).json({ status: 'error', message: error.message, error })
  }
}
