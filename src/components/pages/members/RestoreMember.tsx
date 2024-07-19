import { useState } from 'react'
import { restoreMember } from 'server/api'
import { IMember } from 'server/type/Member'
import DialogDelete from 'src/components/ReuseableComponent/DialogDelete'
import IconRestore from 'src/components/ui/Icon/IconRestore'
import IconButton from 'src/components/ui/IconButton'
import { IResponseMembers } from 'src/type/member'
import { KeyedMutator } from 'swr'

function RestoreMember({ data, mutate }: { data: IMember; mutate: KeyedMutator<IResponseMembers> }) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <IconButton
        sizes='small'
        color='warning'
        variant='text'
        onClick={e => {
          e.stopPropagation()
          setOpen(true)
        }}
      >
        <IconRestore fontSize={20} />
      </IconButton>
      <DialogDelete
        body={'Apakah anda ingin mengembalikan Member ini...???'}
        open={open}
        close={() => setOpen(false)}
        runFunction={async () => {
          await restoreMember(data._id, data)
        }}
        refetch={mutate}
        refetchWhenError={mutate}
        responBody={{
          titleSuccess: 'RESTORE',
          bodySuccess: 'Pengembalian member berhasil',
          bodyFailed: 'Pengembalian member gagal'
        }}
      />
    </>
  )
}

export default RestoreMember
