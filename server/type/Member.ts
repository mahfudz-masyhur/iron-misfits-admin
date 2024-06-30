export interface IMember {
  _id: string
  email: string
  name: string
  avatar: string
  password: string
  role: [1 | 2]
  handphone: number
  creator: { _id: string; name: string }
  lastEditedBy?: { _id: string; name: string }
}
