import { UserAccount } from 'src/pages/api/me/login'

export interface IAppContext {
  // csrf: {
  //   _csrf: string
  //   getNewcsrf: () => Promise<any>
  // }
  auth: {
    isAuthenticated: boolean
    user?: UserAccount
    token?: string
    logout?: () => void
    setToken: (v: string) => void
    setUser: (user: UserAccount) => void
    isLoading: boolean
    refetch?: () => Promise<void>
  }
  sidebar: {
    open: boolean
    toggleSidebar: () => void
    hover: boolean
    functionHover: (isHovered: boolean) => void
  }
}

export interface ILoginFunction {
  emailOrNim: string
  password: string
  callback: (v: { status: string; login: boolean; message: string }) => void
}

export type InitialPropsType = {
  user?: UserAccount
  token?: string
  status?: string
  isLoading: boolean
}
