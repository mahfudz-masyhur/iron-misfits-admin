import dynamic from 'next/dynamic'
import Head from 'next/head'
import { LoadingPage } from 'src/components/Layouts/main'
import { GetPromosSWR } from 'src/context/swrHook'

const PromosPage = dynamic(() => import('src/components/pages/promos'), { ssr: false, loading: LoadingPage })

function Promos() {
  const { data, mutate } = GetPromosSWR()
  if (!data) return <LoadingPage />

  return (
    <>
      <Head>
        <title>Iron Misfits | Promos</title>
      </Head>
      <PromosPage data={data} mutate={mutate} />
    </>
  )
}

export default Promos
