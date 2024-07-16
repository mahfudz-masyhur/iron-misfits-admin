import { useState } from 'react'
import { deleteUser } from 'server/api'
import { IUser } from 'server/type/User'
import DialogDelete from 'src/components/ReuseableComponent/DialogDelete'
import IconDelete from 'src/components/ui/Icon/IconDelete'
import IconButton from 'src/components/ui/IconButton'
import { IResponseUsers } from 'src/type/users'
import { KeyedMutator } from 'swr'

interface Props {
  mutate: KeyedMutator<IResponseUsers>
  user: IUser
}

function DeleteUser({ user, mutate }: Props) {
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
        body={'Apakah anda yakin ingin menghapus akun ini...???'}
        open={open}
        close={() => setOpen(false)}
        runFunction={async () => {
          await deleteUser(user)
        }}
        refetch={mutate}
      />
    </>
  )
}

export default DeleteUser
