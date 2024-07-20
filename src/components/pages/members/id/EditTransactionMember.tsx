import { useState } from 'react'
import { IMember } from 'server/type/Member'
import Dialog from 'src/components/ui/Dialog'
import IconEdit from 'src/components/ui/Icon/IconEdit'
import IconButton from 'src/components/ui/IconButton'
import FormTransactionMember from './FormTransactionMember'
import { ITransaction } from 'server/type/Transaction'
import { IReferral } from 'server/type/Referral'
import { KeyedMutator } from 'swr'
import { IResponseTransactions } from 'src/type/transaction'

interface Props {
  data?: IMember
  value: ITransaction
  mutate: KeyedMutator<IResponseTransactions>
}

function EditTransactionMember({ data, value, mutate }: Props) {
  const [open, setOpen] = useState(false)
  const [stopClose, setStopClose] = useState(false)

  const handleOpen = () => setOpen(true)
  const handleClose = () => (stopClose ? null : setOpen(false))

  if (!data) return <>loading...</>

  return (
    <>
      <IconButton sizes='small' variant='text' onClick={handleOpen}>
        <IconEdit fontSize={20} />
      </IconButton>
      <Dialog title='Transaction Member' open={open} onClose={handleClose} closeButtom fullWidth maxWidth='md'>
        <div className='px-4 pb-4'>
          <FormTransactionMember
            member={data}
            value={value}
            setStopClose={setStopClose}
            handleClose={handleClose}
            mutate={mutate}
          />
        </div>
      </Dialog>
    </>
  )
}

export default EditTransactionMember
