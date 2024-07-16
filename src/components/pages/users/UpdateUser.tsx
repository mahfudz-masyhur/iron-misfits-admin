import React, { useState } from 'react'
import { IUser } from 'server/type/User'
import Dialog from 'src/components/ui/Dialog'
import FormUser from './FormUser'
import IconEditAnimated from 'src/components/ui/Icon/IconEditAnimated'
import IconButton from 'src/components/ui/IconButton'
import { KeyedMutator } from 'swr'
import { IResponseUsers } from 'src/type/users'

interface Props {
  mutate: KeyedMutator<IResponseUsers>
  data: IUser
}

function UpdateUser({ data, mutate }: Props) {
  const [open, setOpen] = useState(false)
  const [stopClose, setStopClose] = useState(false)

  const handleOpen = () => setOpen(true)
  const handleClose = () => (stopClose ? null : setOpen(false))

  return (
    <>
      <IconButton sizes='small' variant='text' onClick={handleOpen}>
        <IconEditAnimated fontSize={20} />
      </IconButton>
      <Dialog title='Edit User' open={open} onClose={handleClose} closeButtom fullWidth maxWidth='md'>
        <div className='px-4 pb-4'>
          <FormUser value={data} setStopClose={setStopClose} handleClose={handleClose} mutate={mutate} />
        </div>
      </Dialog>
    </>
  )
}

export default UpdateUser
