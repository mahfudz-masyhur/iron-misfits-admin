import { useRouter } from 'next/router'
import IconButton from 'src/components/ui/IconButton'
import IconChevronLeft from '../ui/Icon/IconChevronLeft'
import IconDelete from '../ui/Icon/IconDelete'

export default function RecycleBinButton() {
  const router = useRouter()
  const isDeleted = Boolean(router.query.isDeleted)

  const onClick = () => {
    router.push({ query: { isDeleted: true } })
  }

  const back = () => {
    router.push({ query: {} })
  }

  return isDeleted ? (
    <IconButton variant='text' color='warning' onClick={back}>
      <IconChevronLeft fontSize={20} />
    </IconButton>
  ) : (
    <IconButton variant='text' color='warning' onClick={onClick}>
      <IconDelete fontSize={20} />
    </IconButton>
  )
}
