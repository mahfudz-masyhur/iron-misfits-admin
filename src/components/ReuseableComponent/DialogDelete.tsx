// ** React Imports
import { useState } from 'react'
import { toast } from 'react-hot-toast'

// ** MUI Imports
import Button from 'src/components/ui/Button'
import Dialog from 'src/components/ui/Dialog'
import IconAlertCircleTwotone from 'src/components/ui/Icon/IconAlertCircleTwotone'
import IconCloseCircleTwotone from 'src/components/ui/Icon/IconCloseCircleTwotone'
import IconConfirmCircleTwotone from 'src/components/ui/Icon/IconConfirmCircleTwotone'
import Typography from 'src/components/ui/Typograph'

interface Props {
  body: string
  open: boolean
  close: () => void
  runFunction?: () => Promise<void>
  secondRunFunction?: () => void
  refetch?: any
  refetchWhenError?: any
  responBody?: {
    titleSuccess?: string | JSX.Element
    titleFailed?: string | JSX.Element
    bodySuccess?: string | JSX.Element
    bodyFailed?: string | JSX.Element
  }
}

const DialogDelete = ({
  body,
  open,
  close,
  runFunction,
  secondRunFunction,
  refetchWhenError,
  refetch,
  responBody
}: Props) => {
  const [secondDialogOpen, setSecondDialogOpen] = useState<boolean>(false)
  const [userInput, setUserInput] = useState<'yes' | 'cancel'>('yes')
  const [laod, setLaod] = useState(false)

  const handleConfirmation = async (value: string) => {
    try {
      setLaod(true)
      if (value === 'yes') {
        if (runFunction) {
          await runFunction()
          setUserInput(value)
          setSecondDialogOpen(true)
        } else {
          setUserInput(value)
          setSecondDialogOpen(true)
        }
      }
      setLaod(false)
      close()
    } catch (error: any) {
      if (refetchWhenError) refetchWhenError()
      const text =
        error?.response?.data?.message || error?.message || error?.request?.statusText || 'Something went wrong'
      toast.error(text)
      setUserInput('cancel')
      setSecondDialogOpen(true)
      setLaod(false)
      close()
    }
  }

  const handleSecondDialogOpen = () => {
    setSecondDialogOpen(false)
    if (userInput === 'yes') {
      if (refetch) refetch()
      if (secondRunFunction) secondRunFunction()
    }
  }

  return (
    <>
      <Dialog maxWidth='xs' open={open} onClose={close} closeButtom disabledClickAway>
        <div className='my-8 text-center'>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ maxWidth: '85%', textAlign: 'center' }}>
              <IconAlertCircleTwotone fontSize={88} color='warning' className='inline my-8' />
              <Typography>{body}</Typography>
            </div>
          </div>
        </div>
        <div className='flex gap-4 my-8' style={{ justifyContent: 'center' }}>
          <Button variant='outlined' color='warning' disabled={laod} onClick={async () => handleConfirmation('cancel')}>
            CANCEL
          </Button>
          <Button variant='contained' loading={laod} disabled={laod} onClick={async () => handleConfirmation('yes')}>
            YES
          </Button>
        </div>
      </Dialog>
      <Dialog maxWidth='xs' open={secondDialogOpen} closeButtom onClose={handleSecondDialogOpen} disabledClickAway>
        <div className='mt-8'>
          <div className='flex flex-col items-center'>
            {userInput === 'yes' && <IconConfirmCircleTwotone color='success' fontSize={88} />}
            {userInput === 'cancel' && <IconCloseCircleTwotone color='error' fontSize={88} />}
            <Typography variant='h4' style={{ marginBottom: 8 }}>
              {userInput === 'yes' ? responBody?.titleSuccess || 'DELETED' : responBody?.titleFailed || 'CANCELLED'}
            </Typography>
            <Typography textAlign='center'>
              {userInput === 'yes'
                ? responBody?.bodySuccess || 'Proses penghapusan berhasil'
                : responBody?.bodyFailed || 'Proses penghapusan dibatalkan'}
            </Typography>
          </div>
        </div>
        <div className='flex gap-4 my-8' style={{ justifyContent: 'center' }}>
          <Button variant='contained' color='success' onClick={handleSecondDialogOpen}>
            OK
          </Button>
        </div>
      </Dialog>
    </>
  )
}

export default DialogDelete
