import { useState } from 'react'
import { deleteMember } from 'server/api'
import { IMember } from 'server/type/Member'
import DialogDelete from 'src/components/ReuseableComponent/DialogDelete'
import IconDelete from 'src/components/ui/Icon/IconDelete'
import IconButton from 'src/components/ui/IconButton'
import { IResponseMembers } from 'src/type/member'
import { KeyedMutator } from 'swr'

function DeleteMember({ data, mutate }: { data: IMember; mutate: KeyedMutator<IResponseMembers> }) {
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
          await deleteMember(data._id, data)
        }}
        refetch={mutate}
        refetchWhenError={mutate}
      />
    </>
  )
}

export default DeleteMember
