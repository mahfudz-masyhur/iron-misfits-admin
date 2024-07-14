import dynamic from 'next/dynamic'
import { LoadingPage } from 'src/components/Layouts/main'
import { GetReferralSWR } from 'src/context/swrHook'

const ReferralPage = dynamic(() => import('src/components/pages/referrals'), { ssr: false, loading: LoadingPage })

function Referral() {
  const { data } = GetReferralSWR()
  if (!data) return <LoadingPage />

  return <ReferralPage data={data} />
}

export default Referral
