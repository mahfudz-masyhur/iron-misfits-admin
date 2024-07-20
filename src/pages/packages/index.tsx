import dynamic from 'next/dynamic'
import Head from 'next/head'
import { LoadingPage } from 'src/components/Layouts/main'
import { GetPackageSWR } from 'src/context/swrHook'

const PackagePage = dynamic(() => import('src/components/pages/packages'), { ssr: false, loading: LoadingPage })

function Package() {
  const { data, mutate } = GetPackageSWR()
  if (!data) return <LoadingPage />

  return (
    <>
      <Head>
        <title>Iron Misfits | Packages</title>
      </Head>
      <PackagePage data={data} mutate={mutate} />
    </>
  )
}

export default Package
