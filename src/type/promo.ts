import { IPromo } from 'server/type/Promo'

export interface IResponsePromos {
  status: 'ok' | 'error'
  message: 'Get Success'
  data: IPromo[]
}

export interface IResponsePromo {
  status: 'ok' | 'error'
  message: 'Get Success' | 'Update Success' | 'Create Success' | 'Delete Success'
  data: IPromo
}

export interface PromoInput {
  _id: string
  name: string
  code: string
  type: 'percentage' | 'nominal'
  discounts: number | string
  startDate: Date
  endDate: Date
  status: 'active' | 'inactive'
  statusEdit: boolean
  updatedAt?: Date
}

export interface IupdatePromoIfStatusEditFalse {
  _id: string
  status: 'active' | 'inactive'
  updatedAt?: Date
}
