import { useState } from 'react'
import { IMember } from 'server/type/Member'
import { IReferral } from 'server/type/Referral'
import { ITransaction } from 'server/type/Transaction'
import Dialog from 'src/components/ui/Dialog'
import IconMoreTime from 'src/components/ui/Icon/IconMoreTime'
import IconButton from 'src/components/ui/IconButton'
import AddExtraTimeForTransactionMemberForm from './Form'

function AddExtraTimeForTransactionMember({
  data,
  transaction,
}: {
  data?: IMember
  transaction: ITransaction
}) {
  const [open, setOpen] = useState(false)
  const [stopClose, setStopClose] = useState(false)

  const handleOpen = () => setOpen(true)
  const handleClose = () => (stopClose ? null : setOpen(false))
  if(!data) return <>loading..</>

  return (
    <>
      <IconButton sizes='small' color='success' variant='text' onClick={handleOpen}>
        <IconMoreTime fontSize={20} />
      </IconButton>
      <Dialog title='Transaction Member' open={open} onClose={handleClose} closeButtom fullWidth maxWidth='md'>
        <div className='px-4 pb-4'>
          <AddExtraTimeForTransactionMemberForm
            member={data}
            transaction={transaction}
            setStopClose={setStopClose}
            handleClose={handleClose}
          />
        </div>
      </Dialog>
    </>
  )
}

export default AddExtraTimeForTransactionMember
