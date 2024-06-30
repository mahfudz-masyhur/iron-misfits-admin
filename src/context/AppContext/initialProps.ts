import { InitialPropsType } from 'src/context/types'

export const initialProps: InitialPropsType = { isLoading: true }

export enum AuthType {
  SET_USER = 'SET_USER',
  SET_STATUS = 'SET_STATUS',
  SET_TOKEN = 'SET_TOKEN',
  SET_LOADING = 'SET_LOADING'
}
