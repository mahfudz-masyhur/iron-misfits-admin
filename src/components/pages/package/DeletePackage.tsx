import { useRouter } from 'next/router'
import { useState } from 'react'
import { deletePackage } from 'server/api'
import { IMember } from 'server/type/Member'
import DialogDelete from 'src/components/ReuseableComponent/DialogDelete'
import IconDelete from 'src/components/ui/Icon/IconDelete'
import IconButton from 'src/components/ui/IconButton'

function DeletePackage({ data }: { data: IMember }) {
  const [open, setOpen] = useState(false)
  const router = useRouter()
  const mutate = () => router.push(router.asPath)

  return (
    <>
      <IconButton
        sizes='small'
        color='error'
        variant='text'
        onClick={e => {
          e.stopPropagation()
          setOpen(true)
        }}
      >
        <IconDelete fontSize={20} />
      </IconButton>
      <DialogDelete
        body={'Apakah anda yakin ingin menghapus Package ini...???'}
        open={open}
        close={() => setOpen(false)}
        runFunction={async () => {
          await deletePackage(data._id)
        }}
        refetch={mutate}
      />
    </>
  )
}

export default DeletePackage
