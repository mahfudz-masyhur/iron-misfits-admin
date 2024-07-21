import dynamic from 'next/dynamic'
import Head from 'next/head'
import { LoadingPage } from 'src/components/Layouts/main'
import { GetMembersIdSWR } from 'src/context/swrHook'

const MemberIdPage = dynamic(() => import('src/components/pages/members/id'), { ssr: false, loading: LoadingPage })

function MemberId() {
  const { data, mutate } = GetMembersIdSWR()
  if (!data) return <LoadingPage />

  return (
    <>
      <Head>
        <title>Iron Misfits | Member</title>
      </Head>
      <MemberIdPage member={data} mutateMember={mutate} />
    </>
  )
}

export default MemberId
