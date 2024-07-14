export interface IUser {
  _id: string
  email: string
  name: string
  avatar: string
  password: string
  role: [1 | 2]
  handphone: number
  isDeleted?: boolean
  creator: { _id: string; name: string }
  lastEditedBy?: { _id: string; name: string }
  createdAt?: Date
  updatedAt?: Date
}
