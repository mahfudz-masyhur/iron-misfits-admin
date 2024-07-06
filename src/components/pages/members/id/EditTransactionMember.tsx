import { useState } from 'react'
import { IMember } from 'server/type/Member'
import Dialog from 'src/components/ui/Dialog'
import IconEdit from 'src/components/ui/Icon/IconEdit'
import IconButton from 'src/components/ui/IconButton'
import FormTransactionMember from './FormTransactionMember'
import { ITransaction } from 'server/type/Transaction'

function EditTransactionMember({ data, value }: { data: IMember; value: ITransaction }) {
  const [open, setOpen] = useState(false)
  const [stopClose, setStopClose] = useState(false)

  const handleOpen = () => setOpen(true)
  const handleClose = () => (stopClose ? null : setOpen(false))

  return (
    <>
      <IconButton sizes='small' variant='text' onClick={handleOpen}>
        <IconEdit fontSize={20} />
      </IconButton>
      <Dialog title='Transaction Member' open={open} onClose={handleClose} closeButtom fullWidth maxWidth='md'>
        <div className='px-4 pb-4'>
          <FormTransactionMember member={data} value={value} setStopClose={setStopClose} handleClose={handleClose} />
        </div>
      </Dialog>
    </>
  )
}

export default EditTransactionMember
