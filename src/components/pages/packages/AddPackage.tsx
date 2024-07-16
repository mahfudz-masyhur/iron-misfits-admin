import { useState } from 'react'
import Button from 'src/components/ui/Button'
import Dialog from 'src/components/ui/Dialog'
import IconPlus from 'src/components/ui/Icon/IconPlus'
import FormPackage from './FormPackage'
import { KeyedMutator } from 'swr'
import { IResponsePackages } from 'src/type/package'

function AddPackage({ mutate }: { mutate: KeyedMutator<IResponsePackages> }) {
  const [open, setOpen] = useState(false)
  const [stopClose, setStopClose] = useState(false)

  const handleOpen = () => setOpen(true)
  const handleClose = () => (stopClose ? null : setOpen(false))

  return (
    <>
      <Button startIcon={<IconPlus fontSize={18} />} onClick={handleOpen}>
        Package
      </Button>
      <Dialog title='Add Package' open={open} onClose={handleClose} closeButtom fullWidth maxWidth='md'>
        <div className='px-4 pb-4'>
          <FormPackage setStopClose={setStopClose} handleClose={handleClose} mutate={mutate} />
        </div>
      </Dialog>
    </>
  )
}

export default AddPackage
