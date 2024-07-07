import { useRouter } from 'next/router'
import { useState } from 'react'
import { deleteTransaction } from 'server/api'
import { IPendingRecord, ITransaction } from 'server/type/Transaction'
import DialogDelete from 'src/components/ReuseableComponent/DialogDelete'
import Button from 'src/components/ui/Button'

function DeleteExtraTime({
  transaction,
  pendingId,
  nextPendingId
}: {
  transaction: ITransaction
  pendingId: string
  nextPendingId?: string
}) {
  const [open, setOpen] = useState(false)
  const router = useRouter()
  const mutate = () => router.push(router.asPath)

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
