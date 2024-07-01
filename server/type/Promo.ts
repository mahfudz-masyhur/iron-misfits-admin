export interface IPromo {
  _id: string
  name: string
  type: 'percentage' | 'nominal'
  discounts: number | string
  startDate: Date
  endDate: Date
  status: 'active' | 'inactive'
  statusEdit: boolean
  creator?: { _id: string; name: string }
  lastEditedBy?: { _id: string; name: string }
  createdAt?: Date
  updatedAt?: Date
}
