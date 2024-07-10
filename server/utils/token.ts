import { NextApiResponse } from 'next'
import { IUser } from 'server/type/User'

const fs = require('fs')
const jwt = require('jsonwebtoken')

interface IUserData {
  email?: string
  name?: string
  _id?: string
  nim?: string
}

export const createToken = (user: IUser) => {
  const payload = { email: user.email, name: user.name, _id: user._id }
  const privatekey = process.env.WPA_Key
  const options = {
    expiresIn: '1D'
  }

  const token = jwt.sign(payload, privatekey, options)

  return token as string
}

export const getToken = async (token: string, res?: NextApiResponse) => {
  try {
    const publickey = process.env.WPA_Key
    const verify = await jwt.verify(token, publickey)

    return verify
  } catch (error) {
    res?.status(401).json({ status: '401 Unauthorized', message: 'Not login' })
    throw new Error('')
  }
}
