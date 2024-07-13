import { IReferral, IReferralMember } from 'server/type/Referral'

export interface IResponseReferrals {
  status: 'ok' | 'error'
  message: 'Get Success'
  data: IReferral[]
}

export interface IResponseReferral {
  status: 'ok' | 'error'
  message: 'Get Success' | 'Update Success' | 'Create Success' | 'Delete Success'
  data: IReferral
}

export interface ReferralInput {
  _id: string
  name: string
  code: string
  type: 'percentage' | 'nominal'
  discounts: string
  member: string
  status: 'active' | 'inactive'
  statusEdit: boolean
  updatedAt?: Date
}

export interface IUpdateReferralIfStatusEditFalse {
  _id: string
  member: IReferralMember
  status: 'active' | 'inactive'
  updatedAt: Date | undefined
}
