import { useState } from 'react'
import Button from 'src/components/ui/Button'
import Dialog from 'src/components/ui/Dialog'
import IconPlus from 'src/components/ui/Icon/IconPlus'
import FormMember from './FormMember'
import { KeyedMutator } from 'swr'
import { IResponseMembers } from 'src/type/member'

function AddMember({ mutate }: { mutate: KeyedMutator<IResponseMembers> }) {
  const [open, setOpen] = useState(false)
  const [stopClose, setStopClose] = useState(false)

  const handleOpen = () => setOpen(true)
  const handleClose = () => (stopClose ? null : setOpen(false))

  return (
    <>
      <Button startIcon={<IconPlus fontSize={18} />} onClick={handleOpen}>
        Member
      </Button>
      <Dialog title='Add Member' open={open} onClose={handleClose} closeButtom fullWidth maxWidth='md'>
        <div className='px-4 pb-4'>
          <FormMember setStopClose={setStopClose} handleClose={handleClose} mutate={mutate} />
        </div>
      </Dialog>
    </>
  )
}

export default AddMember
