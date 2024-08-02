import { useRouter } from 'next/router'
import { fetcherClient } from 'server/api'
import {
  getURLParams,
  removeEmptyStringProperties,
  removeUndefinedProperties,
  toastError
} from 'src/components/utility/formats'
import { IResponseMember, IResponseMembers } from 'src/type/member'
import { IResponsePackages } from 'src/type/package'
import { IResponsePromos } from 'src/type/promo'
import { IResponseReferral, IResponseReferrals } from 'src/type/referral'
import { IResponseTransactions } from 'src/type/transaction'
import { IResponseUsers } from 'src/type/users'
import useSWR from 'swr'

export const GetUserSWR = () => {
  const { query, asPath, push } = useRouter()
  const data = useSWR<IResponseUsers>(`/api/users?${getURLParams(query)}`, fetcherClient)

  if (data.error) {
    let destination = '/_error'
    if (data.error.response?.status === 401) {
      destination = `/login?${getURLParams({ url: asPath })}`
    } else {
      toastError(data.error)
    }
    push(destination)
  }

  return data
}

export const GetReferralSWR = () => {
  const { query, asPath, push } = useRouter()
  const data = useSWR<IResponseReferrals>(`/api/referral?${getURLParams(query)}`, fetcherClient)

  if (data.error) {
    let destination = '/_error'
    if (data.error.response?.status === 401) {
      destination = `/login?${getURLParams({ url: asPath })}`
    } else {
      toastError(data.error)
    }
    push(destination)
  }

  return data
}

export const GetPromosSWR = () => {
  const { query, asPath, push } = useRouter()
  const data = useSWR<IResponsePromos>(`/api/promo?${getURLParams(query)}`, fetcherClient)

  if (data.error) {
    let destination = '/_error'
    if (data.error.response?.status === 401) {
      destination = `/login?${getURLParams({ url: asPath })}`
    } else {
      toastError(data.error)
    }
    push(destination)
  }

  return data
}

export const GetPackageSWR = () => {
  const { query, asPath, push } = useRouter()
  const data = useSWR<IResponsePackages>(`/api/package${getURLParams(query)}`, fetcherClient)

  if (data.error) {
    let destination = '/_error'
    if (data.error.response?.status === 401) {
      destination = `/login?${getURLParams({ url: asPath })}`
    } else {
      toastError(data.error)
    }
    push(destination)
  }

  return data
}

export const GetMembersSWR = () => {
  const { query, asPath, push } = useRouter()
  const data = useSWR<IResponseMembers>(`/api/members?${getURLParams(query)}`, fetcherClient)

  if (data.error) {
    let destination = '/_error'
    if (data.error.response?.status === 401) {
      destination = `/login?${getURLParams({ url: asPath })}`
    } else {
      toastError(data.error)
    }
    push(destination)
  }

  return data
}

export const GetMembersIdSWR = (id: string) => {
  const { query, asPath, push } = useRouter()
  const url = `/api/members/${id}?${getURLParams(removeUndefinedProperties({ ...query, id: undefined }))}`
  const data = useSWR<IResponseMember>(url, fetcherClient)

  if (data.error) {
    let destination = '/_error'
    if (data.error.response?.status === 401) {
      destination = `/login?${getURLParams({ url: asPath })}`
    } else {
      toastError(data.error)
    }
    push(destination)
  }

  return data
}

export const GetOneReferralSWR = () => {
  const { query, asPath, push } = useRouter()
  const url = `/api/referral/find-one?${getURLParams(
    removeUndefinedProperties({ ...query, id: undefined, member: query.id, status: 'active' })
  )}`
  const data = useSWR<IResponseReferral>(url, fetcherClient)

  if (data.error) {
    let destination = '/_error'
    if (data.error.response?.status === 401) {
      destination = `/login?${getURLParams({ url: asPath })}`
    } else {
      toastError(data.error)
    }
    push(destination)
  }

  return data
}

export const GetTransactionsSWR = (member?: string) => {
  const { query, asPath, push } = useRouter()
  const url = `/api/transaction?${getURLParams(removeUndefinedProperties({ ...query, id: undefined, member }))}`
  const data = useSWR<IResponseTransactions>(url, fetcherClient)

  if (data.error) {
    let destination = '/_error'
    if (data.error.response?.status === 401) {
      destination = `/login?${getURLParams({ url: asPath })}`
    } else {
      toastError(data.error)
    }
    push(destination)
  }

  return data
}

export const GetListTransactionsSWR = () => {
  const { query, asPath, push } = useRouter()
  const url = `/api/transaction?${getURLParams(removeUndefinedProperties(removeEmptyStringProperties(query)))}`
  const data = useSWR<IResponseTransactions>(url, fetcherClient)

  if (data.error) {
    let destination = '/_error'
    if (data.error.response?.status === 401) {
      destination = `/login?${getURLParams({ url: asPath })}`
    } else {
      toastError(data.error)
    }
    push(destination)
  }

  return data
}
