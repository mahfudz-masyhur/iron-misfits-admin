import { useState } from 'react'
import { IMember } from 'server/type/Member'
import Dialog from 'src/components/ui/Dialog'
import IconEditAnimated from 'src/components/ui/Icon/IconEditAnimated'
import IconButton from 'src/components/ui/IconButton'
import FormMember from './FormMember'
import { KeyedMutator } from 'swr'
import { IResponseMembers } from 'src/type/member'

function UpdateMember({ data, mutate }: { data: IMember; mutate: KeyedMutator<IResponseMembers> }) {
  const [open, setOpen] = useState(false)
  const [stopClose, setStopClose] = useState(false)

  const handleOpen = () => setOpen(true)
  const handleClose = () => (stopClose ? null : setOpen(false))

  return (
    <>
      <IconButton sizes='small' variant='text' onClick={handleOpen}>
        <IconEditAnimated fontSize={20} />
      </IconButton>
      <Dialog title='Edit Member' open={open} onClose={handleClose} closeButtom fullWidth maxWidth='md'>
        <div className='px-4 pb-4'>
          <FormMember value={data} setStopClose={setStopClose} handleClose={handleClose} mutate={mutate} />
        </div>
      </Dialog>
    </>
  )
}

export default UpdateMember
