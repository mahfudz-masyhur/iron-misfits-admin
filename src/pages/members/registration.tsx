import dynamic from 'next/dynamic'
import React from 'react'
import { LoadingPage } from 'src/components/Layouts/main'

const RegistrationPage = dynamic(() => import('src/components/pages/members/RegistrationPage'), {
  ssr: false,
  loading: LoadingPage
})

function Registration() {
  return <RegistrationPage />
}

Registration.isGuest = true
export default Registration
