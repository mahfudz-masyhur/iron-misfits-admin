import dynamic from 'next/dynamic'
import { LoadingPage } from 'src/components/Layouts/main'

const MemberIdPage = dynamic(() => import('src/components/pages/members/id'), { ssr: false, loading: LoadingPage })

function MemberId() {
  return <MemberIdPage />
}

export default MemberId
