import dynamic from 'next/dynamic'
import Head from 'next/head'
import React from 'react'
import { LoadingPage } from 'src/components/Layouts/main'

const RegistrationPage = dynamic(() => import('src/components/pages/members/RegistrationPage'), {
  ssr: false,
  loading: LoadingPage
})

function Registration() {
  return (
    <>
      <Head>
        <title>Iron Misfits | Registration member</title>
      </Head>
      <RegistrationPage />
    </>
  )
}

Registration.isGuest = true
export default Registration
