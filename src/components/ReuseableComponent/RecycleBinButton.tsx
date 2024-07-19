import { useRouter } from 'next/router'
import IconRefresh from 'src/components/ui/Icon/IconRefresh'
import IconButton from 'src/components/ui/IconButton'
import IconChevronLeft from '../ui/Icon/IconChevronLeft'
import IconDelete from '../ui/Icon/IconDelete'

export default function RecycleBinButton() {
  const router = useRouter()
  const isDeleted = Boolean(router.query.isDeleted)
  console.log(isDeleted)

  const onClick = () => {
    router.push({ query: { isDeleted: true } })
  }

  const back = () => {
    router.back()
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
