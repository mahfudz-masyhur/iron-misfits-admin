import dynamic from 'next/dynamic'
import Head from 'next/head'
import { LoadingPage } from 'src/components/Layouts/main'

const MemberIdPage = dynamic(() => import('src/components/pages/members/id'), { ssr: false, loading: LoadingPage })

function MemberId() {
  return (
    <>
      <Head>
        <title>Iron Misfits | Member</title>
      </Head>
      <MemberIdPage />
    </>
  )
}

export default MemberId
