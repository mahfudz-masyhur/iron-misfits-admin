import dynamic from 'next/dynamic'
import Head from 'next/head'
import { LoadingPage } from 'src/components/Layouts/main'
import { GetReferralSWR } from 'src/context/swrHook'

const ReferralPage = dynamic(() => import('src/components/pages/referrals'), { ssr: false, loading: LoadingPage })

function Referral() {
  const { data, mutate } = GetReferralSWR()
  if (!data) return <LoadingPage />

  return (
    <>
      <Head>
        <title>Iron Misfits | Referrals</title>
      </Head>
      <ReferralPage data={data} mutate={mutate} />
    </>
  )
}

export default Referral
