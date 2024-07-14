import { GetServerSideProps } from 'next'
import dynamic from 'next/dynamic'
import { getMemberId, getOneReferral, getTransactions } from 'server/api'
import { LoadingPage } from 'src/components/Layouts/main'
import { getURLParams } from 'src/components/utility/formats'
import { IResponseMember } from 'src/type/member'
import { IResponseReferral } from 'src/type/referral'
import { IResponseTransactions } from 'src/type/transaction'

const MemberIdPage = dynamic(() => import('src/components/pages/members/id'), { ssr: false, loading: LoadingPage })

interface Props {
  member: IResponseMember
  referral: IResponseReferral
  transaction: IResponseTransactions
}

function MemberId(props: Props) {
  return <MemberIdPage {...props} />
}

export default MemberId

export const getServerSideProps: GetServerSideProps = async ({ req, params }) => {
  try {
    const member = await getMemberId(`${params?.id}`, req)
    const referral = await getOneReferral(req, getURLParams({ member: `${params?.id}`, status: 'active' }))
    const transaction = await getTransactions(req, getURLParams({ member: params?.id }))
    return {
      props: { member, referral, transaction }
    }
  } catch (error: any) {
    let destination = '/500'
    if (error?.response?.status === 401) destination = `/login?${getURLParams({ url: req.url })}`
    return {
      props: {},
      redirect: {
        permanent: false,
        destination
      }
    }
  }
}
