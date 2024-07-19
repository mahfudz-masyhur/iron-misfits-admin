import { HTMLAttributes, forwardRef } from 'react'
import { twMerge } from 'tailwind-merge'
import { color } from 'src/components/ui/Type'
import { cva } from 'class-variance-authority'

interface MoreProps {
  size?: number
  color?: color
}

const variants = cva(['animate-spin'], {
  variants: {
    color: {
      primary: ['text-primary-main'],
      secondary: ['text-secondary-main'],
      success: ['text-success-main'],
      error: ['text-error-main'],
      warning: ['text-warning-main'],
      info: ['text-info-main'],
      white: ['text-white']
    }
  }
})

export type ChipProps = HTMLAttributes<SVGSVGElement> & MoreProps

const CircularProgress = forwardRef<SVGSVGElement, ChipProps>((props: ChipProps, ref) => {
  const { className, color = 'primary', size = 20, ...rest } = props

  return (
    <svg
      {...rest}
      ref={ref}
      className={twMerge(variants({ color, className }))}
      viewBox='0 0 24 24'
      style={{
        width: size,
        height: size
      }}
    >
      <circle className='opacity-0' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4' />
      <path
        fill='currentColor'
        d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
      />
    </svg>
  )
})

CircularProgress.displayName = 'CircularProgress'

export default CircularProgress
