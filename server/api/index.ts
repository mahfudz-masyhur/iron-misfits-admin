import Axios from 'axios'
import { IncomingMessage } from 'http'
import { IUser } from 'server/type/User'
import {
  convertToNumber,
  convertToNumericPhoneNumber,
  removeEmptyStringProperties
} from 'src/components/utility/formats'
import { IResponseMember, IResponseMembers, MemberInput } from 'src/type/member'
import { IResponsePackage, IResponsePackages, PackageInput } from 'src/type/package'
import { IResponsePromo, IResponsePromos, PromoInput } from 'src/type/promo'
import { IResponseReferral, IResponseReferrals, ReferralInput } from 'src/type/referral'
import { IResponseTransaction, IResponseTransactions, TransactionInput } from 'src/type/transaction'
import { IResponseUser, IResponseUsers, UserInput } from 'src/type/users'

const axios = Axios.create({
  baseURL: 'http://localhost:4001',
  headers: {
    'Content-Type': 'application/json'
  }
})

export const fetcherClient = async (url: string) => await axios.get(url).then(res => res.data)

const fetchServer = async (url: string, req: IncomingMessage) => {
  const { data } = await axios.get(`http://localhost:${process.env.PORT}${url}`, {
    headers: { Cookie: req.headers.cookie || '' }
  })

  return data
}

export const getMyAccount = async () => {
  const { data } = await axios.get(`/api/me`)

  return data
}

export const getUsers = async (req?: IncomingMessage): Promise<IResponseUsers> => {
  if (req) return await fetchServer('/api/users', req)
  const { data } = await axios.get('/api/users')

  return data
}

export const addOrUpdateUser = async (values: UserInput): Promise<IResponseUser> => {
  values.handphone = values.handphone ? convertToNumericPhoneNumber(values.handphone).toString() : ''
  const body = {
    ...values,
    role: [values.role]
  }
  const { data } = await axios.post('/api/users', removeEmptyStringProperties(body))

  return data
}

export const deleteUser = async (body: IUser): Promise<IResponseUser> => {
  const { data } = await axios.delete(`/api/users/${body._id}`, { data: body })

  return data
}

export const loginApi = async ({ email, password }: { email: string; password: string }) => {
  const source = Axios.CancelToken.source()
  const { data } = await axios.post(`/api/me/login`, { email, password }, { cancelToken: source.token })

  return data
}

export const getMembers = async (req?: IncomingMessage, query?: any): Promise<IResponseMembers> => {
  if (req) return await fetchServer(`/api/members?${query}`, req)
  const { data } = await axios.get(`/api/members?${query}`)

  return data
}

export const getMemberId = async (id: string, req?: IncomingMessage, query?: any): Promise<IResponseMember> => {
  console.log(`/api/members/${id}?${query}`)
  if (req) return await fetchServer(`/api/members/${id}?${query}`, req)
  const { data } = await axios.get(`/api/members/${id}?${query}`)

  return data
}

export const addOrUpdateMember = async (values: MemberInput): Promise<IResponseMember> => {
  values.handphone = values.handphone ? convertToNumericPhoneNumber(values.handphone).toString() : ''
  values.registrationFee = values.registrationFee ? convertToNumber(values.registrationFee).toString() : ''
  const { data } = await axios.post('/api/members', removeEmptyStringProperties(values))

  return data
}

export const deleteMember = async (id: string): Promise<IResponseMember> => {
  const { data } = await axios.delete(`/api/members/${id}`)

  return data
}

export const getPackages = async (req?: IncomingMessage): Promise<IResponsePackages> => {
  if (req) return await fetchServer('/api/package', req)
  const { data } = await axios.get('/api/package')

  return data
}

export const addOrUpdatePackage = async (values: PackageInput): Promise<IResponsePackage> => {
  values.price = values.price ? convertToNumber(values.price).toString() : ''
  const { data } = await axios.post('/api/package', removeEmptyStringProperties(values))

  return data
}

export const deletePackage = async (id: string, body: IResponsePackage['data']): Promise<IResponsePackage> => {
  const { data } = await axios.delete(`/api/package/${id}`, { data: body })

  return data
}

export const getReferral = async (req?: IncomingMessage, query?: any): Promise<IResponseReferrals> => {
  if (req) return await fetchServer(`/api/referral?${query}`, req)
  const { data } = await axios.get(`/api/referral?${query}`)

  return data
}

export const addOrUpdateReferral = async (values: ReferralInput): Promise<IResponseReferral> => {
  const { data } = await axios.post('/api/referral', removeEmptyStringProperties(values))

  return data
}

export const deleteReferral = async (id: string, body: IResponseReferral['data']): Promise<IResponseReferral> => {
  const { data } = await axios.delete(`/api/referral/${id}`, { data: body })

  return data
}

export const getPromos = async (req?: IncomingMessage): Promise<IResponsePromos> => {
  if (req) return await fetchServer('/api/promo', req)
  const { data } = await axios.get('/api/promo')

  return data
}

export const addOrUpdatePromo = async (values: PromoInput): Promise<IResponsePromo> => {
  const { data } = await axios.post('/api/promo', removeEmptyStringProperties(values))

  return data
}

export const deletePromo = async (id: string, body: IResponsePromo['data']): Promise<IResponsePromo> => {
  const { data } = await axios.delete(`/api/promo/${id}`, { data: body })

  return data
}

export const getTransactions = async (req?: IncomingMessage, query?: any): Promise<IResponseTransactions> => {
  if (req) return await fetchServer(`/api/transaction?${query}`, req)
  const { data } = await axios.get(`/api/transaction?${query}`)

  return data
}

export const addOrUpdateTransaction = async (values: TransactionInput): Promise<IResponseTransaction> => {
  const body = {
    ...values,
    package: values.package?._id,
    promo: values.promo?._id,
    referral: values.referral?._id
  }
  // const { data } = await axios.post('/api/transaction', body)
  console.log('/api/transaction', body)

  // return data
}

export const deleteTransaction = async (
  id: string,
  body: IResponseTransaction['data']
): Promise<IResponseTransaction> => {
  const { data } = await axios.delete(`/api/transaction/${id}`, { data: body })

  return data
}
