import { useRouter } from 'next/router'
import { useState } from 'react'
import { deletePromo } from 'server/api'
import { IPromo } from 'server/type/Promo'
import { IReferral } from 'server/type/Referral'
import DialogDelete from 'src/components/ReuseableComponent/DialogDelete'
import IconDelete from 'src/components/ui/Icon/IconDelete'
import IconButton from 'src/components/ui/IconButton'

function DeletePromo({ data }: { data: IPromo }) {
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
        body={'Apakah anda yakin ingin menghapus Promo ini...???'}
        open={open}
        close={() => setOpen(false)}
        runFunction={async () => {
          await deletePromo(data._id, data)
        }}
        refetch={mutate}
      />
    </>
  )
}

export default DeletePromo
