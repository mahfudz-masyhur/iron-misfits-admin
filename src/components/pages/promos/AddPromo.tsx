import { useState } from 'react'
import Button from 'src/components/ui/Button'
import Dialog from 'src/components/ui/Dialog'
import IconPlus from 'src/components/ui/Icon/IconPlus'
import FormPromo from './FormPromo'

function AddPromo() {
  const [open, setOpen] = useState(false)
  const [stopClose, setStopClose] = useState(false)

  const handleOpen = () => setOpen(true)
  const handleClose = () => (stopClose ? null : setOpen(false))

  return (
    <>
      <Button startIcon={<IconPlus fontSize={18} />} onClick={handleOpen}>
        Promo
      </Button>
      <Dialog title='Add Promo' open={open} onClose={handleClose} closeButtom fullWidth maxWidth='md'>
        <div className='px-4 pb-4'>
          <FormPromo setStopClose={setStopClose} handleClose={handleClose} key='create-promo' />
        </div>
      </Dialog>
    </>
  )
}

export default AddPromo
