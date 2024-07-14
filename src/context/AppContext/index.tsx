'use client'
import Cookies from 'js-cookie'
import { useRouter } from 'next/router'
import React from 'react'
import { toast } from 'react-hot-toast'
import { getMyAccount } from 'server/api'
import { getURLParams, removeUndefinedProperties } from 'src/components/utility/formats'
import { WINDOW_USER_SCRIPT_VARIABLE } from 'src/constant'
import ContextAction from 'src/context/AppContext/action'
import type { IAppContext } from 'src/context/types'

interface IAppContextComponent {
  children: React.ReactNode
}
const defaultProvider: IAppContext = {
  // csrf: { _csrf: '', getNewcsrf: async () => {} },
  auth: {
    isAuthenticated: false,
    user: undefined,
    setToken: () => {},
    setUser: () => {},
    isLoading: true
  },
  sidebar: {
    open: false,
    toggleSidebar: () => {},
    hover: false,
    functionHover: () => {}
  }
}

const noAuthPath = ['/login', '/login/']

const AppContext = React.createContext(defaultProvider)

export default function AppContextComponent(props: IAppContextComponent) {
  // auth
  const { children } = props
  const { setUser, state, setToken, setIsLoading } = ContextAction()
  const { user, isLoading } = state
  const router = useRouter()

  const checkUserData = async () => {
    try {
      setIsLoading(true)
      const result = await getMyAccount()
      setUser(result.data)
      if (noAuthPath.includes(window.location.pathname)) {
        if (router.query.url) {
          router.push(`${router.query.url}`)
        } else {
          router.push('/')
        }
      }
      setIsLoading(false)
    } catch (err) {
      if (!noAuthPath.includes(window.location.pathname)) {
        router.push(`/login${router.asPath !== '/' ? '?' + getURLParams({ url: router.asPath }) : ''}`)
      }
      setTimeout(() => {
        setIsLoading(false)
      }, 1000)
    }
  }

  React.useEffect(() => {
    if (!user) checkUserData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  const logout = () => {
    Cookies.remove(WINDOW_USER_SCRIPT_VARIABLE)
    router.push('/login')
  }

  // csrf
  // const [csrf, setCsrf] = React.useState('')
  // const getNewcsrf = async () => {
  //   const result = await getForm().catch(err => toast.error(err))
  //   setCsrf(result)

  //   return result
  // }

  // sidebar
  const [hover, setHover] = React.useState(false)
  const [openSidebar, setOpenSidebar] = React.useState(() => {
    if (typeof window !== 'undefined') {
      const storedValue = localStorage.getItem('openSidebar')
      return storedValue ? JSON.parse(storedValue) : false
    } else {
      return false
    }
  })

  const toggleSidebar = () => {
    setOpenSidebar((prevState: any) => {
      const newState = !prevState
      if (typeof window !== 'undefined') {
        localStorage.setItem('openSidebar', JSON.stringify(newState))
      }
      return newState
    })
  }

  const functionHover = (isHovered: boolean) => {
    if (!openSidebar) {
      setHover(isHovered)
    }
  }

  const contextValue = {
    // // csrf
    // csrf: {
    //   _csrf: csrf,
    //   getNewcsrf
    // },
    // auth
    auth: {
      isAuthenticated: !!user,
      user,
      setToken,
      setUser,
      logout,
      isLoading,
      refetch: checkUserData
    },
    // sidebar
    sidebar: {
      open: openSidebar,
      toggleSidebar,
      hover,
      functionHover
    }
  }

  return <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>
}

export { AppContext }
