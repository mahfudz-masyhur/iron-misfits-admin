interface transaction {
  _id: string
  package: string
  promo: string
  referral: string
}
interface ISocialMedia {
  key: string
  value: string
}

export interface IMember {
  _id: string
  name: string
  avatar?: string
  socialmedia: ISocialMedia[]
  handphone: number
  transaction?: transaction[]
  creator: { _id: string; name: string }
  lastEditedBy?: { _id: string; name: string }
  createdAt: Date
  updatedAt: Date
}
