import { useState } from 'react'
import { deleteReferral } from 'server/api'
import { IReferral } from 'server/type/Referral'
import DialogDelete from 'src/components/ReuseableComponent/DialogDelete'
import IconDelete from 'src/components/ui/Icon/IconDelete'
import IconButton from 'src/components/ui/IconButton'
import { IResponseReferrals } from 'src/type/referral'
import { KeyedMutator } from 'swr'

interface Props {
  data: IReferral
  mutate: KeyedMutator<IResponseReferrals>
}

function DeleteReferral({ data, mutate }: Props) {
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
        body={'Apakah anda yakin ingin menghapus Member ini...???'}
        open={open}
        close={() => setOpen(false)}
        runFunction={async () => {
          await deleteReferral(data._id, data)
        }}
        refetch={mutate}
      />
    </>
  )
}

export default DeleteReferral
