import { useState } from 'react'
import { IMember } from 'server/type/Member'
import Button from 'src/components/ui/Button'
import Dialog from 'src/components/ui/Dialog'
import IconPlus from 'src/components/ui/Icon/IconPlus'
import FormTransactionMember from './FormTransactionMember'

function TransactionMember({ data }: { data: IMember }) {
  const [open, setOpen] = useState(false)
  const [stopClose, setStopClose] = useState(false)

  const handleOpen = () => setOpen(true)
  const handleClose = () => (stopClose ? null : setOpen(false))

  return (
    <>
      <Button onClick={handleOpen} startIcon={<IconPlus fontSize={20} />}>
        Transaction
      </Button>
      <Dialog title='Transaction Member' open={open} onClose={handleClose} closeButtom fullWidth maxWidth='md'>
        <div className='px-4 pb-4'>
          <FormTransactionMember member={data} setStopClose={setStopClose} handleClose={handleClose} />
        </div>
      </Dialog>
    </>
  )
}

export default TransactionMember
