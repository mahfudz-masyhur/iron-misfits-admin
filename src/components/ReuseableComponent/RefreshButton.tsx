import { useRouter } from 'next/router'
import IconRefresh from 'src/components/ui/Icon/IconRefresh'
import IconButton from 'src/components/ui/IconButton'

export default function RefreshButton({ mutate }: { mutate?: any }) {
  const router = useRouter()

  const onDoubleClick = () => {
    router.reload()
  }

  const onClick = () => {
    if (mutate) mutate()
    router.push(router.asPath)
  }

  return (
    <IconButton variant='text' onClick={onClick} onDoubleClick={onDoubleClick}>
      <IconRefresh fontSize={20} />
    </IconButton>
  )
}
