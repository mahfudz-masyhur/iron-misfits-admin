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

export const getToken = (token: string) => {
  const publickey = process.env.WPA_Key
  const verify = jwt.verify(token, publickey)

  return verify
}
