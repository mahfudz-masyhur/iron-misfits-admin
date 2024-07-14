import dynamic from 'next/dynamic'
import { LoadingPage } from 'src/components/Layouts/main'
import { GetMembersSWR } from 'src/context/swrHook'

const MembersPage = dynamic(() => import('src/components/pages/members'), { ssr: false, loading: LoadingPage })

function Members() {
  const { data } = GetMembersSWR()
  if (!data) return <LoadingPage />

  return <MembersPage data={data} />
}

export default Members
