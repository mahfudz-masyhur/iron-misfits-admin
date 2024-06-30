export interface IAppContext {
  // csrf: {
  //   _csrf: string
  //   getNewcsrf: () => Promise<any>
  // }
  auth: {
    isAuthenticated: boolean
    user?: IUserAuth
    token?: string
    logout?: () => void
    setToken: (v: string) => void
    setUser: (user: IUserAuth) => void
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

export interface IUserAuth {
  _id: string
  email: string
  name: string
  nim?: string
  konsentrasiPilihan?: string
  avatar: string
  pasFoto?: string
  createdAt: string
  updatedAt: string
  isFinanceStaff?: boolean
  isAdmin?: boolean
  isProdi?: boolean
  isLecture?: boolean
  isStudent?: boolean
  isAcademic?: boolean
  isPublisher?: boolean
  prodi: string
  status: string
  generation: string
  currentSemester: number
  registration: 'KIP' | 'MANDIRI'
}

export type InitialPropsType = {
  user?: IUserAuth
  token?: string
  status?: string
  isLoading: boolean
}
