export interface IPackage {
  _id: string
  name: string
  price: number
  packageType: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'annual'
  status: 'active' | 'inactive'
  statusEdit: boolean
  creator: { _id: string; name: string }
  lastEditedBy?: { _id: string; name: string }
  createdAt: Date
  updatedAt: Date
}
