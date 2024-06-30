import React, { useState } from 'react'
import { IUser } from 'server/type/User'
import Dialog from 'src/components/ui/Dialog'
import FormUser from './FormUser'
import IconEditAnimated from 'src/components/ui/Icon/IconEditAnimated'
import IconButton from 'src/components/ui/IconButton'

function UpdateUser({ data }: { data: IUser }) {
  const [open, setOpen] = useState(false)
  const [stopClose, setStopClose] = useState(false)

  const handleOpen = () => setOpen(true)
  const handleClose = () => (stopClose ? null : setOpen(false))

  return (
    <>
      <IconButton sizes='small' variant='text' onClick={handleOpen}>
        <IconEditAnimated fontSize={20} />
      </IconButton>
      <Dialog title='Add User' open={open} onClose={handleClose} closeButtom fullWidth maxWidth='md'>
        <div className='px-4 pb-4'>
          <FormUser value={data} setStopClose={setStopClose} handleClose={handleClose} />
        </div>
      </Dialog>
    </>
  )
}

export default UpdateUser
