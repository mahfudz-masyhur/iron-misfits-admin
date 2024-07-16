import { useState } from 'react'
import { deletePromo } from 'server/api'
import { IPromo } from 'server/type/Promo'
import DialogDelete from 'src/components/ReuseableComponent/DialogDelete'
import IconDelete from 'src/components/ui/Icon/IconDelete'
import IconButton from 'src/components/ui/IconButton'
import { IResponsePromos } from 'src/type/promo'
import { KeyedMutator } from 'swr'

interface Props {
  mutate: KeyedMutator<IResponsePromos>
  data: IPromo
}

function DeletePromo({ data, mutate }: Props) {
  const [open, setOpen] = useState(false)

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
        key={`delete-promo-${data._id}`}
      />
    </>
  )
}

export default DeletePromo
