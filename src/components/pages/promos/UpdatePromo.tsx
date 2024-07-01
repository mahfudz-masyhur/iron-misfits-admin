import { useState } from 'react'
import { IPromo } from 'server/type/Promo'
import Dialog from 'src/components/ui/Dialog'
import IconEditAnimated from 'src/components/ui/Icon/IconEditAnimated'
import IconButton from 'src/components/ui/IconButton'
import FormPromo from './FormPromo'

function UpdatePromo({ data }: { data: IPromo }) {
  const [open, setOpen] = useState(false)
  const [stopClose, setStopClose] = useState(false)

  const handleOpen = () => setOpen(true)
  const handleClose = () => (stopClose ? null : setOpen(false))

  return (
    <>
      <IconButton sizes='small' variant='text' onClick={handleOpen}>
        <IconEditAnimated fontSize={20} />
      </IconButton>
      <Dialog title='Edit Promo' open={open} onClose={handleClose} closeButtom fullWidth maxWidth='md'>
        <div className='px-4 pb-4'>
          <FormPromo value={data} setStopClose={setStopClose} handleClose={handleClose} />
        </div>
      </Dialog>
    </>
  )
}

export default UpdatePromo
