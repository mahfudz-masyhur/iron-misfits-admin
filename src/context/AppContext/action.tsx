import React from 'react'
import { reducer } from 'src/context/AppContext/reducer'
import { initialProps, AuthType } from 'src/context/AppContext/initialProps'
import { UserAccount } from 'src/pages/api/me/login'

const ContextAction = () => {
  const [state, dispatch] = React.useReducer(reducer, initialProps)

  const setUser = (user: UserAccount) => {
    dispatch({
      type: AuthType.SET_USER,
      payload: user
    })
  }

  const setToken = (token: string) => {
    dispatch({
      type: AuthType.SET_TOKEN,
      payload: token
    })
  }

  const setStatus = (status: string) => {
    dispatch({
      type: AuthType.SET_STATUS,
      payload: status
    })
  }

  const setIsLoading = (d: boolean) => {
    dispatch({
      type: AuthType.SET_LOADING,
      payload: d
    })
  }

  return { state, setUser, setToken, setStatus, setIsLoading }
}

export default ContextAction
