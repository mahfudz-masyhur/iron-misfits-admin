import { useState } from 'react'
import { restoreUser } from 'server/api'
import { IUser } from 'server/type/User'
import DialogDelete from 'src/components/ReuseableComponent/DialogDelete'
import IconDelete from 'src/components/ui/Icon/IconDelete'
import IconRestore from 'src/components/ui/Icon/IconRestore'
import IconButton from 'src/components/ui/IconButton'
import { IResponseUsers } from 'src/type/users'
import { KeyedMutator } from 'swr'

interface Props {
  mutate: KeyedMutator<IResponseUsers>
  user: IUser
}

function RestoreUser({ user, mutate }: Props) {
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
        body={'Apakah anda yakin ingin mengembalikan akun ini...???'}
        open={open}
        close={() => setOpen(false)}
        runFunction={async () => {
          await restoreUser(user)
        }}
        refetch={mutate}
        responBody={{
          titleSuccess: 'RESTORE',
          bodySuccess: 'Pengembalian akun berhasil',
          bodyFailed: 'Pengembalian akun gagal'
        }}
      />
    </>
  )
}

export default RestoreUser
