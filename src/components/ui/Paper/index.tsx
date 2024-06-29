import { VariantProps, cva } from 'class-variance-authority'
import { HtmlHTMLAttributes, forwardRef } from 'react'
import { twMerge } from 'tailwind-merge'

interface MoreProps {
  variant?: 'outlined' | 'contained'
  href?: string
  LinkComponent?: any
}

export type PaperProps = HtmlHTMLAttributes<HTMLElement> & VariantProps<typeof variants> & MoreProps

const variants = cva(['bg-background-paper', 'dark:bg-background-paper-dark', 'rounded-2xl'], {
  variants: {
    shadow: {
      transparent: ['shadow-transparent'],
      current: ['shadow-current'],
      inherit: ['shadow-inherit'],
      none: ['shadow-none'],
      inner: ['shadow-inner'],
      '2xl': ['shadow-2xl'],
      xl: ['shadow-xl'],
      lg: ['shadow-lg'],
      md: ['shadow-md'],
      sm: ['shadow-sm'],
      shadow: ['shadow']
    }
  },
  defaultVariants: {
    shadow: 'shadow'
  }
})

const Paper = forwardRef<HTMLDivElement, PaperProps>((props: PaperProps, ref) => {
  const { shadow, className, href, ...rest } = props

  return <div ref={ref} className={twMerge(variants({ shadow, className }))} {...rest} />
})

Paper.displayName = 'Paper'

export default Paper
