import dynamic from 'next/dynamic'
import { LoadingPage } from 'src/components/Layouts/main'
import { GetUserSWR } from 'src/context/swrHook'

const UsersPage = dynamic(() => import('src/components/pages/users'), { ssr: false, loading: LoadingPage })

function Users() {
  const { data, mutate } = GetUserSWR()
  if (!data) return <LoadingPage />

  return <UsersPage data={data} mutate={mutate} />
}

export default Users
