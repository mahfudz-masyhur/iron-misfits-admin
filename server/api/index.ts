import Axios from 'axios'
import { IncomingMessage } from 'http'
import { IUser } from 'server/type/User'
import { removeEmptyStringProperties } from 'src/components/utility/formats'
import { IResponseUser, IResponseUsers, UserInput } from 'src/type/users'

const axios = Axios.create({
  baseURL: 'http://localhost:4001',
  headers: {
    'Content-Type': 'application/json'
  }
})

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

export const getMembers = async (req?: IncomingMessage): Promise<IResponseUsers> => {
  if (req) return await fetchServer('/api/members', req)
  const { data } = await axios.get('/api/members')

  return data
}
