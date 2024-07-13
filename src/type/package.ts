import { IPackage } from 'server/type/Package'

export interface IResponsePackages {
  status: 'ok' | 'error'
  message: 'Get Success'
  data: IPackage[]
}

export interface IResponsePackage {
  status: 'ok' | 'error'
  message: 'Get Success' | 'Update Success' | 'Create Success' | 'Delete Success'
  data: IPackage
}

export interface PackageInput {
  _id: string
  name: string
  price: string
  packageType: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'annual'
  status: 'active' | 'inactive'
  statusEdit: boolean
  updatedAt?: Date
}

export interface IUpdatePackageIfStatusEditFalse {
  _id: string
  status: 'active' | 'inactive'
  updatedAt?: Date
}
