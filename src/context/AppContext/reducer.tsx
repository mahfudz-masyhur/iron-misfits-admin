import { InitialPropsType } from 'src/context/types'
import { AuthType } from 'src/context/AppContext/initialProps'

interface AuthReducerAction {
  type: AuthType
  payload?: any
}

export const reducer = (state: InitialPropsType, action: AuthReducerAction) => {
  const { type, payload } = action
  switch (type) {
    case AuthType.SET_USER:
      return {
        ...state,
        user: payload
      }
    case AuthType.SET_STATUS:
      return {
        ...state,
        status: payload
      }
    case AuthType.SET_TOKEN:
      return {
        ...state,
        token: payload
      }
    case AuthType.SET_LOADING:
      return {
        ...state,
        isLoading: payload
      }
    default:
      return state
  }
}
