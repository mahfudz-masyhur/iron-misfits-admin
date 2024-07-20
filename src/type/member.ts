import { IMember } from 'server/type/Member'

export interface IResponseMembers {
  status: 'ok' | 'error'
  message: 'Get Success'
  data: IMember[]
  paginate: {
    maxPage: number
    page: number
    total: number
    query: { [key: string]: any }
  }
}

export interface IResponseMember {
  status: 'ok' | 'error'
  message: 'Get Success' | 'Update Success' | 'Create Success' | 'Delete Success'
  data: IMember
}

export interface MemberInput {
  _id: string
  name: string
  avatar?: string
  handphone?: string
  registrationFee?: string
  socialmedia?: { key: string; value: string }[]
  updatedAt?: Date
}
