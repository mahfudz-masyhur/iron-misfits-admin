import React from 'react'
import { AppContext } from 'src/context/AppContext'

export const useAppContext = () => React.useContext(AppContext)
