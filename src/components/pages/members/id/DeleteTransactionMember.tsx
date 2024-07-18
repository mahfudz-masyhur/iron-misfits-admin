import { useState } from 'react'
import { deleteTransaction } from 'server/api'
import { ITransaction } from 'server/type/Transaction'
import DialogDelete from 'src/components/ReuseableComponent/DialogDelete'
import IconDelete from 'src/components/ui/Icon/IconDelete'
import IconButton from 'src/components/ui/IconButton'
import { IResponseTransactions } from 'src/type/transaction'
import { KeyedMutator } from 'swr'

interface Props {
  data: ITransaction
  mutate: KeyedMutator<IResponseTransactions>
}
function DeleteTransaction({ data, mutate }: Props) {
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
        body={'Apakah anda yakin ingin menghapus Transaksi ini...???'}
        open={open}
        close={() => setOpen(false)}
        runFunction={async () => {
          await deleteTransaction(data._id, data)
        }}
        refetch={mutate}
      />
    </>
  )
}

export default DeleteTransaction
