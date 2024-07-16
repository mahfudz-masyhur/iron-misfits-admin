import dynamic from 'next/dynamic'
import { LoadingPage } from 'src/components/Layouts/main'
import { GetPromosSWR } from 'src/context/swrHook'

const PromosPage = dynamic(() => import('src/components/pages/promos'), { ssr: false, loading: LoadingPage })

function Promos() {
  const { data, mutate } = GetPromosSWR()
  if (!data) return <LoadingPage />

  return <PromosPage data={data} mutate={mutate} />
}

export default Promos
