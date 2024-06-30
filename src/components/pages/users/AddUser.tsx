import { useState } from 'react'
import Button from 'src/components/ui/Button'
import Dialog from 'src/components/ui/Dialog'
import IconPlus from 'src/components/ui/Icon/IconPlus'
import FormUser from './FormUser'

function AddUser() {
  const [open, setOpen] = useState(false)
  const [stopClose, setStopClose] = useState(false)

  const handleOpen = () => setOpen(true)
  const handleClose = () => (stopClose ? null : setOpen(false))

  return (
    <>
      <Button startIcon={<IconPlus fontSize={18} />} onClick={handleOpen}>
        User
      </Button>
      <Dialog title='Add User' open={open} onClose={handleClose} closeButtom fullWidth maxWidth='md'>
        <div className='px-4 pb-4'>
          <FormUser setStopClose={setStopClose} handleClose={handleClose} />
        </div>
      </Dialog>
    </>
  )
}

export default AddUser
