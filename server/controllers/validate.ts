import { NextApiResponse } from 'next'
import User from 'server/models/User'
import { getCookie } from 'server/utils'
import { getToken } from 'server/utils/token'
import { WINDOW_USER_SCRIPT_VARIABLE } from 'src/constant'
import { Ireq, UserAccount } from 'src/pages/api/me/login'

export async function validateSignin<T>(req: Ireq, res: NextApiResponse<T | any>) {
  const cookieToken = getCookie(WINDOW_USER_SCRIPT_VARIABLE, `${req.headers.cookie}`)
  const token = req?.headers?.authorization?.split(' ')[1] || cookieToken || ''

  const { email, _id } = (await getToken(token, res)) as UserAccount
  const userFind = await User.findOne({ email, _id }, { password: 0 })

  if (!userFind?._id) {
    res.status(401).json({
      status: '401 Unauthorized',
      message: 'Email tidak terdaftar'
    })
    throw new Error('')
  }

  const user = JSON.parse(JSON.stringify(userFind))

  if (user?.email === process.env.MASTER_ADMIN) user.isMasterAdmin = true
  if (user?.role.includes(1)) user.isAdmin = true
  if (user?.role.includes(2)) user.isViewer = true

  req.user = user
}

export async function validateMasterAdmin<T>(req: Ireq, res: NextApiResponse<T | any>) {
  const { user } = req
  if (user?.isMasterAdmin) return req

  res.status(403).json({ status: '403 Forbidden', message: 'Diperlukan Akses Master Admin' })
  throw new Error()
}

export async function validateAdmin<T>(req: Ireq, res: NextApiResponse<T | any>) {
  const { user } = req
  if (user?.isMasterAdmin || user?.isAdmin) return req

  res.status(403).json({ status: '403 Forbidden', message: 'Diperlukan Akses Admin' })
  throw new Error()
}

export async function validateViewer<T>(req: Ireq, res: NextApiResponse<T | any>) {
  const { user } = req

  if (user?.isMasterAdmin || user?.isViewer) return req

  res.status(403).json({ status: '403 Forbidden', message: 'Diperlukan Akses Viewer' })
  throw new Error()
}

export async function validateAdminOrViewer<T>(req: Ireq, res: NextApiResponse<T | any>) {
  const { user } = req

  if (user?.isMasterAdmin || user?.isAdmin || user?.isViewer) return req

  res.status(403).json({ status: '403 Forbidden', message: 'Diperlukan Akses Admin atau Viewer' })
  throw new Error()
}
