import type { InferGetServerSidePropsType, GetServerSideProps } from 'next'
import dynamic from 'next/dynamic'
import Head from 'next/head'
import { ParsedUrlQuery } from 'querystring'
import { LoadingPage } from 'src/components/Layouts/main'
import { GetMembersIdSWR } from 'src/context/swrHook'

const MemberIdPage = dynamic(() => import('src/components/pages/members/id'), { ssr: false, loading: LoadingPage })

const Content = ({ id }: { id: string }) => {
  const { data, mutate } = GetMembersIdSWR(id)
  if (!data) return <LoadingPage />

  return (
    <>
      <Head>
        <title>Iron Misfits | Member {data.data.name}</title>
      </Head>
      <MemberIdPage id={id} member={data} mutateMember={mutate} />
    </>
  )
}

function MemberId({ params }: Repo) {
  if (!params?.id) return <LoadingPage />

  return <Content id={params.id.toString()} />
}

export default MemberId

type Repo = {
  params: ParsedUrlQuery | undefined
}

export const getServerSideProps = (async ({ params }) => {
  return { props: { params } }
}) satisfies GetServerSideProps<Repo>
