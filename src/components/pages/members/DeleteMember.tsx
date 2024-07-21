import { useRouter } from 'next/router'
import { useState } from 'react'
import { deleteMember } from 'server/api'
import { IMember } from 'server/type/Member'
import DialogDelete from 'src/components/ReuseableComponent/DialogDelete'
import IconDelete from 'src/components/ui/Icon/IconDelete'
import IconButton from 'src/components/ui/IconButton'
import { IResponseMembers } from 'src/type/member'
import { KeyedMutator } from 'swr'

interface Props {
  data: IMember
  mutate: KeyedMutator<IResponseMembers>
  back?: boolean
}

function DeleteMember({ data, mutate, back }: Props) {
  const [open, setOpen] = useState(false)
  const router = useRouter()

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
        refetch={() => {
          if (back) router.push('/members')
          else mutate()
        }}
        refetchWhenError={() => {
          if (back) router.push('/members')
          else mutate()
        }}
        responBody={{
          bodyFailed: (
            <>
              Member gagal di hapus, hal ini bisa terjadi jika ada masalah pada server atau{' '}
              <strong>member memiliki history transaksi</strong>
            </>
          )
        }}
      />
    </>
  )
}

export default DeleteMember
