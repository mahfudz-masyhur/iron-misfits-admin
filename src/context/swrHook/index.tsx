import { useRouter } from 'next/router'
import { fetcherClient } from 'server/api'
import { getURLParams, toastError } from 'src/components/utility/formats'
import { IResponseMembers } from 'src/type/member'
import { IResponsePackages } from 'src/type/package'
import { IResponsePromos } from 'src/type/promo'
import { IResponseReferrals } from 'src/type/referral'
import { IResponseUsers } from 'src/type/users'
import useSWR from 'swr'

export const GetUserSWR = () => {
  const { query, asPath, push } = useRouter()
  const data = useSWR<IResponseUsers>(`/api/users?${getURLParams(query)}`, fetcherClient)

  if (data.error) {
    let destination = '/500'
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
    let destination = '/500'
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
    let destination = '/500'
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
    let destination = '/500'
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
    let destination = '/500'
    if (data.error.response?.status === 401) {
      destination = `/login?${getURLParams({ url: asPath })}`
    } else {
      toastError(data.error)
    }
    push(destination)
  }

  return data
}
