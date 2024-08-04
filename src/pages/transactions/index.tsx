import dynamic from 'next/dynamic'
import Head from 'next/head'
import { LoadingPage } from 'src/components/Layouts/main'
import { GetListTransactionsSWR } from 'src/context/swrHook'

const TransactionsPage = dynamic(() => import('src/components/pages/transactions'), {
  ssr: false,
  loading: () => <LoadingPage />
})

function Transactions() {
  const { data } = GetListTransactionsSWR()
  if (!data) return <LoadingPage />

  return (
    <>
      <Head>
        <title>Iron Misfits | Transactions</title>
      </Head>
      <TransactionsPage data={data} />
    </>
  )
}

export default Transactions
