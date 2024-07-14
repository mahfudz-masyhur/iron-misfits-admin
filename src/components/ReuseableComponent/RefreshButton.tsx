import { useRouter } from 'next/router'
import IconRefresh from 'src/components/ui/Icon/IconRefresh'
import IconButton from 'src/components/ui/IconButton'

export default function RefreshButton() {
  const router = useRouter()

  return (
    <IconButton variant='text' onClick={() => router.push(router.asPath)} onDoubleClick={() => router.reload()}>
      <IconRefresh fontSize={20} />
    </IconButton>
  )
}
