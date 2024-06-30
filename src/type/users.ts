import { IUser } from 'server/type/User'

export interface IResponseUsers {
  status: 'ok' | 'error'
  message: 'Get Success'
  data: IUser[]
}

export interface IResponseUser {
  status: 'ok' | 'error'
  message: 'Get Success' | 'Update Success' | 'Create Success' | 'Delete Success'
  data: IUser
}

export interface UserInput {
  _id: string
  email: string
  name: string
  avatar: string
  password: string
  role: string
  handphone?: string
}
