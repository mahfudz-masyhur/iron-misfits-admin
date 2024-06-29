'use client'
import { cva } from 'class-variance-authority'
import { HTMLAttributes, forwardRef, useRef } from 'react'
import ReactDOM from 'react-dom'
import IconClose from 'src/components/ui/Icon/IconClose'
import Typography from 'src/components/ui/Typograph'
import BackDrop from 'src/components/utility/UI/BackDrop'
import HiddenTransisiton from 'src/components/utility/UI/HiddenTransisiton'
import { twMerge } from 'tailwind-merge'
import ClickAwayListener from '../ClickAwayListener'
import IconButton from '../IconButton'
import useMediaQuery from 'src/components/utility/UI/useMediaQuery'

interface MoreProps {
  open: boolean
  onClose?: () => void
  title?: string
  closeButtom?: boolean
  disabledClickAway?: boolean
  mobileClickAway?: boolean
  fullWidth?: boolean
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
}

export type DialogProps = MoreProps & HTMLAttributes<HTMLDivElement>

const variants = cva(
  [
    'min-w-[19.375rem] my-8 align-middle transform rounded-xl shadow-xl bg-background-paper dark:bg-background-paper-dark'
  ],
  {
    variants: {
      maxWidth: {
        xs: 'max-w-md',
        sm: 'max-w-lg',
        md: 'max-w-2xl',
        lg: 'max-w-4xl',
        xl: 'max-w-6xl'
      }
    }
  }
)

const Dialog = forwardRef<HTMLDivElement, DialogProps>((props: DialogProps, ref) => {
  const backdropRef = useRef<HTMLDivElement | null>(null)
  const { open, onClose, title, children, className, closeButtom, maxWidth, disabledClickAway, mobileClickAway, fullWidth } = props
  const { isVisible, opacity } = HiddenTransisiton(open)
  BackDrop(isVisible)
  const sm = useMediaQuery('sm')
  const clickAway = disabledClickAway ? false : mobileClickAway ? true : sm

  if (!isVisible) return <></>

  return ReactDOM.createPortal(
    <div
      id='presentation'
      className={twMerge(
        'z-50 inset-0 overflow-y-auto overflow-x-hidden h-[100lvh] backdrop-blur-[0.125rem] bg-gray-500/25 scrollbar-none',
        'transition-opacity duration-300',
        `opacity-${opacity}`,
        isVisible ? 'fixed top-0 bottom-0 right-0 left-0' : 'hidden'
      )}
      style={{ maxHeight: 'calc(100vh)', overflowY: 'auto' }}
    >
      <div tabIndex={0} data-testid='sentinelStart' />
      <div
        className='absolute top-0 left-0 right-0'
        {...(clickAway && { onClick: onClose })}
        style={{ height: backdropRef.current?.clientHeight }}
      />
      <div ref={backdropRef} className='flex items-center justify-center min-h-screen'>
        <div
          className={twMerge(
            'relative m-4',
            fullWidth && 'w-full',
            'text-left',
            variants({ maxWidth, className }),
            opacity ? 'dialog-in-animation' : 'dialog-out-animation'
          )}
          {...ref}
        >
          <div>
            {title && (
              <Typography variant='h6' id='modal-headline' className='p-4 mr-8' color='text-primary'>
                {title}
              </Typography>
            )}
            {closeButtom && (
              <IconButton
                color='error'
                className='absolute top-0 right-0 p-2 text-white rounded-none shadow-none active:scale-100 rounded-tr-xl rounded-bl-xl'
                onClick={onClose}
              >
                <IconClose fontSize={18} />
              </IconButton>
            )}
            <div>{children}</div>
          </div>
        </div>
      </div>
      <div tabIndex={0} data-testid='sentinelStart' />
    </div>,
    document.body
  )
})

Dialog.displayName = 'Dialog'

export default Dialog