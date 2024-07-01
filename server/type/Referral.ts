interface member {
  _id: string
  name: string
  avatar?: string
  socialmedia?: string
  handphone: number
}

export interface IReferral {
  _id: string
  name: string
  code: string
  type: 'percentage' | 'nominal'
  discounts: number | string
  member: member[]
  status: 'active' | 'inactive'
  statusEdit: boolean
  creator?: { _id: string; name: string }
  lastEditedBy?: { _id: string; name: string }
  createdAt?: Date
  updatedAt?: Date
}
