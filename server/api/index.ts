import Axios from 'axios'
import { IncomingMessage } from 'http'
import { IUser } from 'server/type/User'
import { RegisterMemberValues } from 'src/components/pages/members/RegistrationPage'
import { updateStatusTransactionValue } from 'src/components/pages/members/id/EditStatusTransactionMember'
import { ChangePasswordInputValue } from 'src/components/pages/settings/security'
import {
  convertToNumber,
  convertToNumericPhoneNumber,
  getURLParams,
  removeEmptyStringProperties
} from 'src/components/utility/formats'
import { IResponseMember, IResponseMembers, MemberInput } from 'src/type/member'
import { IResponsePackage, IResponsePackages, IUpdatePackageIfStatusEditFalse, PackageInput } from 'src/type/package'
import { IResponsePromo, IResponsePromos, IupdatePromoIfStatusEditFalse, PromoInput } from 'src/type/promo'
import {
  IResponseReferral,
  IResponseReferrals,
  IUpdateReferralIfStatusEditFalse,
  ReferralInput
} from 'src/type/referral'
import { IResponseTransaction, IResponseTransactions, PendingRecordInput, TransactionInput } from 'src/type/transaction'
import { IResponseUser, IResponseUsers, UserInput } from 'src/type/users'

const axios = Axios.create({
  headers: {
    'Content-Type': 'application/json'
  }
})

export const fetcherClient = async (url: string) => await axios.get(url).then(res => res.data)

const fetchServer = async (url: string, req: IncomingMessage) => {
  const { data } = await axios.get(`${process.env.BASE_URL}${url}`, {
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

export const restoreUser = async (body: IUser): Promise<IResponseUser> => {
  const { data } = await axios.delete(`/api/users/${body._id}/restore`, { data: body })

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

export const memberRegisration = async (values: RegisterMemberValues): Promise<IResponseMember> => {
  values.handphone = values.handphone ? convertToNumericPhoneNumber(values.handphone).toString() : ''
  const { data } = await axios.post('/api/members/registration', removeEmptyStringProperties(values))

  return data
}

export const deleteMember = async (id: string, body: IResponseMember['data']): Promise<IResponseMember> => {
  const { data } = await axios.delete(`/api/members/${id}`, { data: body })

  return data
}

export const restoreMember = async (id: string, body: IResponseMember['data']): Promise<IResponseMember> => {
  const { data } = await axios.put(`/api/members/${id}/restore`, body)

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

export const updatePackageIfStatusEditFalse = async (
  id: string,
  body: IUpdatePackageIfStatusEditFalse
): Promise<IResponsePackage> => {
  const { data } = await axios.post(`/api/package/${id}`, body)

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

export const getReferralByCode = async (req?: IncomingMessage, query?: any): Promise<IResponseReferrals> => {
  if (req) return await fetchServer(`/api/referral/code?${query}`, req)
  const { data } = await axios.get(`/api/referral/code?${query}`)

  return data
}

export const getOneReferral = async (req?: IncomingMessage, query?: any): Promise<IResponseReferral> => {
  if (req) return await fetchServer(`/api/referral/find-one?${query}`, req)
  const { data } = await axios.get(`/api/referral?/find-one${query}`)

  return data
}

export const addOrUpdateReferral = async (values: ReferralInput): Promise<IResponseReferral> => {
  const { data } = await axios.post('/api/referral', removeEmptyStringProperties(values))

  return data
}

export const updateReferralIfStatusEditFalse = async (
  id: string,
  body: IUpdateReferralIfStatusEditFalse
): Promise<IResponseReferral> => {
  const { data } = await axios.post(`/api/referral/${id}`, removeEmptyStringProperties(body))
  return data
}

export const deleteReferral = async (id: string, body: IResponseReferral['data']): Promise<IResponseReferral> => {
  const { data } = await axios.delete(`/api/referral/${id}`, { data: body })

  return data
}

export const getPromos = async (req?: IncomingMessage, query?: any): Promise<IResponsePromos> => {
  if (req) return await fetchServer(`/api/promo?${query}`, req)
  const { data } = await axios.get(`/api/promo?${query}`)

  return data
}

export const getPromosBycode = async (req?: IncomingMessage, query?: any): Promise<IResponsePromos> => {
  if (req) return await fetchServer(`/api/promo/code?${query}`, req)
  const { data } = await axios.get(`/api/promo/code?${query}`)

  return data
}

export const addOrUpdatePromo = async (values: PromoInput): Promise<IResponsePromo> => {
  const { data } = await axios.post('/api/promo', removeEmptyStringProperties(values))

  return data
}

export const updatePromoIfStatusEditFalse = async (
  id: string,
  body: IupdatePromoIfStatusEditFalse
): Promise<IResponsePromo> => {
  const { data } = await axios.post(`/api/promo/${id}`, body)

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
  const { data } = await axios.post('/api/transaction', values)

  return data
}

export const updateStatusTransaction = async (values: updateStatusTransactionValue): Promise<IResponseTransaction> => {
  const { data } = await axios.post(`/api/transaction/status`, values)

  return data
}

export const deleteTransaction = async (
  id: string,
  body: IResponseTransaction['data'],
  query?: { pendingId: string; nextPendingId?: string }
): Promise<IResponseTransaction> => {
  const { data } = await axios.delete(`/api/transaction/${id}?${getURLParams(query)}`, { data: body })

  return data
}

export const addOrUpdateExtraTimeTransaction = async (
  id: string,
  values: PendingRecordInput,
  query?: { pendingId: string }
): Promise<IResponseTransaction> => {
  const url = `/api/transaction/${id}?${getURLParams(query)}`
  const { data } = await axios.post(url, values)

  return data
}

export const resetMyPassword = async (body: ChangePasswordInputValue) => {
  const { data } = await axios.post(`/api/me/reset-password`, body)

  return data
}

export const changeProfile = async (body: UserInput) => {
  body.handphone = body.handphone ? convertToNumericPhoneNumber(body.handphone).toString() : ''
  const { data } = await axios.post(`/api/me/profile`, removeEmptyStringProperties(body))

  return data
}
