// pages/api/product.ts
import type { NextApiRequest, NextApiResponse } from 'next'
import connectMongoDB, { getDatabaseStats } from 'server/libs/mongodb'
import Product from 'server/models/Product'

type Data = {
  status: string
  message: string
  data?: any | any[] | null
  error?: any
}

async function GET() {
  const db = await getDatabaseStats()

  return { message: 'Get Success', data: db }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  try {
    let data
    await connectMongoDB()
    if (req.method === 'GET') data = await GET()

    if (!data) throw new Error('No data found')

    return res.json({ status: 'ok', ...data })
  } catch (error: any) {
    return res.status(500).json({ status: 'error', message: error.message, error })
  }
}
