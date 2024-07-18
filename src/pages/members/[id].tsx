import dynamic from 'next/dynamic'
import { LoadingPage } from 'src/components/Layouts/main'
import { GetMembersIdSWR, GetOneReferralSWR, GetTransactionsSWR } from 'src/context/swrHook'

const MemberIdPage = dynamic(() => import('src/components/pages/members/id'), { ssr: false, loading: LoadingPage })

function MemberId() {
  const { data: member, mutate: mutateMember } = GetMembersIdSWR()
  const { data: referral, mutate: mutateReferral } = GetOneReferralSWR()
  const { data: transaction, mutate: mutateTransactions } = GetTransactionsSWR()
  if (!member || !referral || !transaction) return <LoadingPage />

  return (
    <MemberIdPage
      member={member}
      referral={referral}
      transaction={transaction}
      mutateMember={mutateMember}
      mutateReferral={mutateReferral}
      mutateTransactions={mutateTransactions}
    />
  )
}

export default MemberId
