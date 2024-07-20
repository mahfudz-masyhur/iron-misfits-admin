import { useState } from 'react'
import { IMember } from 'server/type/Member'
import Button from 'src/components/ui/Button'
import Dialog from 'src/components/ui/Dialog'
import IconPlus from 'src/components/ui/Icon/IconPlus'
import FormTransactionMember from './FormTransactionMember'
import IconButton from 'src/components/ui/IconButton'
import IconRefresh from 'src/components/ui/Icon/IconRefresh'
import { useRouter } from 'next/router'
import { IReferral } from 'server/type/Referral'
import RefreshButton from 'src/components/ReuseableComponent/RefreshButton'
import { KeyedMutator } from 'swr'
import { IResponseTransactions } from 'src/type/transaction'

interface Props {
  mutate: KeyedMutator<IResponseTransactions>
  data?: IMember
}

function AddTransactionMember({ data, mutate }: Props) {
  const [open, setOpen] = useState(false)
  const [stopClose, setStopClose] = useState(false)

  const handleOpen = () => setOpen(true)
  const handleClose = () => (stopClose ? null : setOpen(false))
  if (!data) return <>loading</>

  return (
    <>
      <Button onClick={handleOpen} startIcon={<IconPlus fontSize={20} />}>
        Transaction
      </Button>{' '}
      <Dialog title='Transaction Member' open={open} onClose={handleClose} closeButtom fullWidth maxWidth='md'>
        <div className='px-4 pb-4'>
          <FormTransactionMember
            member={data}
            setStopClose={setStopClose}
            handleClose={handleClose}
            mutate={mutate}
          />
        </div>
      </Dialog>
      <RefreshButton />
    </>
  )
}

export default AddTransactionMember
