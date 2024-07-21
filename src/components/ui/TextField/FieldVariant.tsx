import { cva } from 'class-variance-authority'
import { twMerge } from 'tailwind-merge'

const variantsInputFocus = cva([''], {
  variants: {
    color: {
      default: ['outline-gray-400'],
      primary: ['outline-primary-main'],
      secondary: ['outline-secondary-main'],
      success: ['outline-success-main'],
      error: ['outline-error-main'],
      warning: ['outline-warning-main'],
      info: ['outline-info-main']
    }
  },
  defaultVariants: {
    color: 'default'
  }
})

export const variantslabel = cva(
  ['absolute', 'text-neutral-300 dark:text-neutral-500', 'transition-all duration-300', 'select-none'],
  {
    variants: {
      sizes: {
        small: ['text-xs', 'top-[0.4rem]'],
        medium: ['text-base', 'top-[0.45rem]'],
        large: ['text-lg', 'top-[0.6rem]']
      }
    },
    defaultVariants: {
      sizes: 'medium'
    }
  }
)

export const variantslabelActive = cva(['text-xs', '-translate-x-1', 'px-1 '], {
  variants: {
    color: {
      default: ['text-gray-400 dark:text-neutral-400'],
      primary: ['text-primary-main'],
      secondary: ['text-secondary-main'],
      success: ['text-success-main'],
      error: ['text-error-main'],
      warning: ['text-warning-main'],
      info: ['text-info-main']
    },
    sizes: {
      small: ['-translate-y-6'],
      medium: ['-translate-y-6'],
      large: ['-translate-y-7']
    }
  },
  defaultVariants: {
    color: 'default',
    sizes: 'medium'
  }
})

// ------------------------- outline ------------------------- //
export const variantsInputOutline = cva(
  ['outline', 'outline-2', 'rounded-xl', 'outline-gray-300 dark:outline-gray-500'],
  {
    variants: {
      color: {
        default: ['hover:outline-gray-400', 'dark:hover:outline-gray-400'],
        primary: ['hover:outline-primary-main'],
        secondary: ['hover:outline-secondary-main'],
        success: ['hover:outline-success-main'],
        error: ['hover:outline-error-main'],
        warning: ['hover:outline-warning-main'],
        info: ['hover:outline-info-main']
      },
      sizes: {
        small: ['text-sm', 'min-h-[1.875rem]', 'px-2'],
        medium: ['min-h-[2.5rem]', 'px-2.5', 'leading-6'],
        large: ['text-lg', 'min-h-[3.125rem]', 'px-3']
      }
    },
    defaultVariants: {
      color: 'default',
      sizes: 'medium'
    }
  }
)
// ----------------------- end outline ----------------------- //

// ------------------------ default ------------------------- //
export const variantsInputDefault = cva(['rounded-xl'], {
  variants: {
    color: {
      default: ['bg-gray-300/20'],
      primary: ['text-primary-main', 'bg-primary-main/20'],
      secondary: ['text-secondary-main', 'bg-secondary-main/20'],
      success: ['text-success-main', 'bg-success-main/20'],
      error: ['text-error-main', 'bg-error-main/20'],
      warning: ['text-warning-main', 'bg-warning-main/20'],
      info: ['text-info-main', 'bg-info-main/20']
    },
    sizes: {
      small: ['text-sm', 'min-h-[1.875rem]', 'px-2'],
      medium: ['min-h-[2.5rem]', 'px-2.5', 'leading-6'],
      large: ['text-lg', 'min-h-[3.125rem]', 'px-3']
    }
  },
  defaultVariants: {
    color: 'default',
    sizes: 'medium'
  }
})
// ---------------------- end default ----------------------- //

// ------------------------ default ------------------------- //
export const variantsInputUnderlined = cva(['border-b-2'], {
  variants: {
    color: {
      default: ['hover:border-gray-400', 'border-gray-300'],
      primary: ['hover:border-primary-main', 'border-primary-light'],
      secondary: ['hover:border-secondary-main', 'border-secondary-light'],
      success: ['hover:border-success-main', 'border-success-light'],
      error: ['hover:border-error-main', 'border-error-light'],
      warning: ['hover:border-warning-main', 'border-warning-light'],
      info: ['hover:border-info-main', 'border-info-light']
    },
    sizes: {
      small: ['text-sm', 'min-h-[1.875rem]', 'px-2'],
      medium: ['min-h-[2.5rem]', 'px-2.5', 'leading-6'],
      large: ['text-lg', 'min-h-[3.125rem]', 'px-3']
    }
  },
  defaultVariants: {
    color: 'default',
    sizes: 'medium'
  }
})
// ---------------------- end default ----------------------- //

interface Props {
  variant: 'default' | 'bordered' | 'underlined'
  sizes: 'small' | 'medium' | 'large' | null | undefined
  color: 'default' | 'primary' | 'success' | 'error' | 'warning' | 'info' | undefined
  error: boolean | undefined
  disabled: boolean | undefined
  focus?: boolean
  margin: 'none' | 'dense' | 'normal'
  label: string | undefined
  helperText: string | boolean | JSX.Element | undefined
  fullWidth: boolean | undefined
  noFocusAnimation: boolean | undefined
}

export const variantIsChoose = (props: Props) => {
  const { variant, sizes, color, error, disabled, focus, helperText, label, margin, fullWidth, noFocusAnimation } =
    props
  let variantChoose
  switch (variant) {
    case 'bordered':
      variantChoose = twMerge(
        variantsInputOutline({ sizes, color }),
        error && ' outline-error-main dark:outline-error-main ',
        disabled && ' outline-gray-100 hover:outline-gray-100 dark:outline-gray-700 hover:dark:outline-gray-700 ',
        !disabled && focus && !noFocusAnimation && ' -translate-y-[0.125rem] ',
        !disabled && focus && ' z-[1] ' + variantsInputFocus({ color })
      )
      break
    case 'underlined':
      variantChoose =
        variantsInputUnderlined({ sizes, color }) +
        (disabled && ' border-gray-100 hover:border-gray-100 dark:border-gray-700 hover:dark:border-gray-700 ')
      break

    default:
      variantChoose =
        variantsInputDefault({ sizes, color }) +
        (disabled && ' bg-gray-50/90 dark:bg-gray-700 ') +
        (focus && ' z-[1] ') +
        (focus && !noFocusAnimation && ' -translate-y-[0.125rem] ')
      break
  }
  return {
    variantChoose,
    fieldClassName: twMerge(
      'inline-flex items-center relative',
      fullWidth ? 'w-full' : '',
      margin === 'normal' && 'my-4',
      margin === 'dense' && 'my-2',
      margin === 'none' && 'my-0',
      label && 'mt-4',
      error && 'text-error-main',
      disabled && 'text-gray-300 dark:text-gray-500',
      helperText && 'mb-4'
    )
  }
}
