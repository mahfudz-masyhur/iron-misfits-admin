'use client'
import { VariantProps, cva } from 'class-variance-authority'
import { ButtonHTMLAttributes, HTMLAttributeAnchorTarget, forwardRef, useRef } from 'react'
import CircularProgress from 'src/components/ui/CircularProgress'
import { color } from 'src/components/ui/Type'
import useRipple from 'src/components/utility/UI/useRipple'
import { twMerge } from 'tailwind-merge'

interface MoreProps {
  loading?: boolean
  variant?: 'contained' | 'outlined' | 'text'
  onClickDownloadURL?: string
  href?: string
  target?: HTMLAttributeAnchorTarget
  LinkComponent?: any
}

const variantsContained = cva(
  [
    'rounded-full',
    'text-center',
    'tracking-wide',
    'cursor-pointer',
    'inline-flex ',
    'items-center',
    'justify-center',
    'uppercase',
    'transition',
    'font-semibold',
    'shadow',
    // active
    'active:scale-95',
    // hover
    'hover:shadow-md',
    'hover:scale-[1.01]',
    // focus
    'outline-none',
    'ring-offset-2',
    'focus-visible:ring-2',
    // disable
    'disabled:shadow-none',
    'disabled:text-white',
    'disabled:cursor-not-allowed',
    'disabled:scale-100',
    'disabled:from-neutral-400',
    'disabled:to-neutral-400',
    'disabled:bg-neutral-400'
  ],
  {
    variants: {
      color: {
        primary: [
          'bg-gradient-to-br',
          'from-primary-light',
          'to-primary-main',
          'text-white',
          'focus:ring-primary-main'
        ],
        secondary: [
          'bg-gradient-to-br',
          'from-slate-400',
          'to-secondary-dark',
          'text-white',
          'focus:ring-secondary-main'
        ],
        success: ['bg-gradient-to-br', 'from-lime-400', 'to-success-dark', 'text-white', 'focus:ring-success-main'],
        error: ['bg-gradient-to-br', 'from-rose-400', 'to-error-dark', 'text-white', 'focus:ring-error-main'],
        warning: ['bg-gradient-to-br', 'from-amber-400', 'to-warning-dark', 'text-white', 'focus:ring-warning-main'],
        info: ['bg-gradient-to-br', 'from-cyan-400', 'to-info-dark', 'text-white', 'focus:ring-info-main'],
        white: ['bg-white', 'dark:bg-gray-700', 'text-primary-main', 'dark:text-white', 'focus:ring-neutral-200']
      },
      sizes: {
        small: ['text-xs', 'p-1'],
        medium: ['p-2', 'text-xs', 'leading-6'],
        large: ['text-sm', 'p-2.5']
      }
    },
    defaultVariants: {
      color: 'primary',
      sizes: 'medium'
    }
  }
)

const variantsOutlined = cva(
  [
    'rounded-full',
    'text-center',
    'tracking-wide',
    'cursor-pointer',
    'inline-flex ',
    'items-center',
    'justify-center',
    'uppercase',
    'transition',
    'font-semibold',
    'shadow',
    'outline',
    'outline-2',
    '-outline-offset-2',
    // active
    'active:scale-95',
    // hover
    'hover:shadow-md',
    'hover:scale-[1.01]',
    // focus
    'ring-offset-2',
    'focus-visible:ring-2',
    // disable
    'disabled:text-neutral-400',
    'disabled:outline-neutral-400',
    'disabled:cursor-not-allowed',
    'disabled:scale-100'
  ],
  {
    variants: {
      color: {
        primary: ['outline-primary-main', 'text-primary-main', 'focus:ring-primary-main'],
        secondary: ['outline-secondary-main', 'text-secondary-main', 'focus:ring-secondary-main'],
        success: ['outline-success-main', 'text-success-main', 'focus:ring-success-main'],
        error: ['outline-error-main', 'text-error-main', 'focus:ring-error-main'],
        warning: ['outline-warning-main', 'text-warning-main', 'focus:ring-warning-main'],
        info: ['outline-info-main', 'text-info-main', 'focus:ring-info-main'],
        white: ['outline-gray-600 dark:outline-white', 'text-gray-600 dark:text-white', 'focus:ring-white']
      },
      sizes: {
        small: ['text-xs', 'p-1'],
        medium: ['p-2', 'text-xs', 'leading-6'],
        large: ['text-sm', 'p-2.5']
      }
    },
    defaultVariants: {
      color: 'primary',
      sizes: 'medium'
    }
  }
)

const variantsText = cva(
  [
    'rounded-full',
    'text-center',
    'tracking-wide',
    'cursor-pointer',
    'inline-flex ',
    'items-center',
    'justify-center',
    'uppercase',
    'transition',
    'font-semibold',
    // hover
    'hover:scale-[1.01]',
    // focus
    'outline-none',
    'ring-offset-2',
    'focus-visible:ring-2',
    // disable
    'disabled:text-neutral-400',
    'disabled:cursor-not-allowed',
    'disabled:scale-100'
  ],
  {
    variants: {
      color: {
        primary: ['text-primary-main', 'hover:text-primary-light', 'focus:ring-primary-main'],
        secondary: ['text-secondary-main', 'hover:text-secondary-light', 'focus:ring-secondary-main'],
        success: ['text-success-main', 'hover:text-success-light', 'focus:ring-success-main'],
        error: ['text-error-main', 'hover:text-error-light', 'focus:ring-error-main'],
        warning: ['text-warning-main', 'hover:text-warning-light', 'focus:ring-warning-main'],
        info: ['text-info-main', 'hover:text-info-light', 'focus:ring-info-main'],
        white: ['text-gray-600 dark:text-white', 'focus:ring-white']
      },
      sizes: {
        small: ['text-xs', 'p-1'],
        medium: ['p-2', 'text-xs', 'leading-6'],
        large: ['text-sm', 'p-2.5']
      }
    },
    defaultVariants: {
      color: 'primary',
      sizes: 'medium'
    }
  }
)

export type IconButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof variantsContained | typeof variantsOutlined | typeof variantsText> &
  MoreProps

const switchVariant = (
  variant: MoreProps['variant'],
  color?: color,
  sizes?: VariantProps<typeof variantsText>['sizes'],
  className?: string
) => {
  let choseVariant
  switch (variant) {
    case 'outlined':
      choseVariant = variantsOutlined({ color, sizes, className })
      break
    case 'text':
      choseVariant = variantsText({ color, sizes, className })
      break

    default:
      choseVariant = variantsContained({ color, sizes, className })
      break
  }
  return choseVariant
}

const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>((props: IconButtonProps, _ref) => {
  const ref = useRef<HTMLButtonElement>(null)
  const {
    className,
    variant,
    color,
    sizes,
    loading,
    children,
    href,
    onClickDownloadURL,
    disabled,
    LinkComponent = 'button',
    ...rest
  } = props

  let choseVariant = switchVariant(variant, color, sizes, className)

  const ripples = useRipple(ref)
  function onClickDownloadLink(url: string) {
    const a = document.createElement('a')
    a.href = url
    a.click()
  }
  if (onClickDownloadURL) {
    rest.onClick = () => onClickDownloadLink(onClickDownloadURL)
  }

  if (disabled) {
    return (
      <button
        {...(href && { href: href })}
        ref={ref}
        data-ripple-button='button'
        data-ripple-color='color'
        data-ripple-variant='variant'
        className={twMerge(
          'overflow-hidden relative',
          'focus:ring-offset-inherit dark:focus:ring-offset-background-default-dark',
          choseVariant
        )}
        style={{ WebkitTapHighlightColor: 'transparent' }}
        {...rest}
        disabled
      >
        {ripples}
        {loading && <CircularProgress className='absolute inline-flex items-center' />}
        <span className={twMerge('transition', loading ? 'opacity-0' : 'opacity-100')}>{children}</span>
      </button>
    )
  }

  return (
    <LinkComponent
      {...(href && { href: href })}
      ref={ref}
      data-ripple-button='button'
      data-ripple-color='color'
      data-ripple-variant='variant'
      className={twMerge(
        'overflow-hidden relative',
        'focus:ring-offset-inherit dark:focus:ring-offset-background-default-dark',
        choseVariant
      )}
      style={{ WebkitTapHighlightColor: 'transparent' }}
      {...rest}
    >
      {ripples}
      {loading && <CircularProgress className='absolute inline-flex items-center' />}
      <span className={twMerge('transition', loading ? 'opacity-0' : 'opacity-100')}>{children}</span>
    </LinkComponent>
  )
})

IconButton.displayName = 'IconButton'

export default IconButton
