interface transaction {
  _id: string
  package: string
  promo: string
  referral: string
}
export interface ISocialMedia {
  key: string
  value: string
}

export interface IMember {
  _id: string
  name: string
  avatar?: string
  socialmedia: ISocialMedia[]
  handphone: number
  isDeleted?: boolean
  registrationFee: number
  creator: { _id: string; name: string }
  lastEditedBy?: { _id: string; name: string }
  createdAt: Date
  updatedAt: Date
}
