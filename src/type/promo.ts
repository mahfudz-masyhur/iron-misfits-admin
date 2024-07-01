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
  type: 'percentage' | 'nominal'
  discounts: number | string
  date: (Date | undefined)[]
  status: 'active' | 'inactive'
  statusEdit: boolean
  updatedAt?: Date
}
