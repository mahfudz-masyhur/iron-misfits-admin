import { useState } from 'react'
import { deletePackage } from 'server/api'
import { IPackage } from 'server/type/Package'
import DialogDelete from 'src/components/ReuseableComponent/DialogDelete'
import IconDelete from 'src/components/ui/Icon/IconDelete'
import IconButton from 'src/components/ui/IconButton'
import { IResponsePackages } from 'src/type/package'
import { KeyedMutator } from 'swr'

function DeletePackage({ data, mutate }: { data: IPackage; mutate: KeyedMutator<IResponsePackages> }) {
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
        body={'Apakah anda yakin ingin menghapus Package ini...???'}
        open={open}
        close={() => setOpen(false)}
        runFunction={async () => {
          await deletePackage(data._id, data)
        }}
        refetch={mutate}
      />
    </>
  )
}

export default DeletePackage
