import { useState } from 'react'
import Button from 'src/components/ui/Button'
import Dialog from 'src/components/ui/Dialog'
import IconPlus from 'src/components/ui/Icon/IconPlus'
import FormReferral from './FormReferral'

function AddReferral() {
  const [open, setOpen] = useState(false)
  const [stopClose, setStopClose] = useState(false)

  const handleOpen = () => setOpen(true)
  const handleClose = () => (stopClose ? null : setOpen(false))

  return (
    <>
      <Button startIcon={<IconPlus fontSize={18} />} onClick={handleOpen}>
        Referral
      </Button>
      <Dialog title='Add Referral' open={open} onClose={handleClose} closeButtom fullWidth maxWidth='md'>
        <div className='px-4 pb-4'>
          <FormReferral setStopClose={setStopClose} handleClose={handleClose} />
        </div>
      </Dialog>
    </>
  )
}

export default AddReferral
