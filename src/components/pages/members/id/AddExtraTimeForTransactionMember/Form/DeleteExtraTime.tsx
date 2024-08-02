import { useState } from 'react'
import { deleteTransaction } from 'server/api'
import { ITransaction } from 'server/type/Transaction'
import DialogDelete from 'src/components/ReuseableComponent/DialogDelete'
import Button from 'src/components/ui/Button'
import { IResponseTransactions } from 'src/type/transaction'
import { KeyedMutator } from 'swr'

function DeleteExtraTime({
  transaction,
  pendingId,
  nextPendingId,
  mutate
}: {
  transaction: ITransaction
  pendingId: string
  nextPendingId?: string
  mutate: KeyedMutator<IResponseTransactions>
}) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button
        type='button'
        variant='outlined'
        color='error'
        onClick={e => {
          e.stopPropagation()
          setOpen(true)
        }}
      >
        Delete
      </Button>
      <DialogDelete
        body={'Apakah anda yakin ingin menghapus Extra time di Transaksi ini...???'}
        open={open}
        close={() => setOpen(false)}
        runFunction={async () => {
          await deleteTransaction(transaction._id, transaction, { pendingId, nextPendingId })
        }}
        refetch={mutate}
      />
    </>
  )
}

export default DeleteExtraTime
