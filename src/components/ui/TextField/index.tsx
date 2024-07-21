'use client'
import { VariantProps, cva } from 'class-variance-authority'
import {
  ChangeEvent,
  InputHTMLAttributes,
  LegacyRef,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
  forwardRef,
  useEffect,
  useState
} from 'react'
import { twMerge } from 'tailwind-merge'
import { variantIsChoose, variantslabel, variantslabelActive } from './FieldVariant'

interface MoreProps {
  label?: string
  value?: string | number | readonly string[] | undefined
  placeholder?: string
  helperText?: string | JSX.Element | boolean
  multiline?: boolean
  variant?: 'bordered' | 'underlined' | 'default'
  error?: boolean
  readOnly?: boolean
  select?: boolean
  options?: any[]
  startAdornment?: JSX.Element
  endAdornment?: JSX.Element
  fullWidth?: boolean
  margin?: 'none' | 'dense' | 'normal'
  color?: 'primary' | 'success' | 'error' | 'warning' | 'info' | 'default'
  type?: string
  autoCompleteMenu?: JSX.Element
  maxWidth?: number
  classNames?: {
    root?: string
    root2?: string
    container?: string
    startAdornment?: string
    input?: string
    endAdornment?: string
    label?: string
    helperText?: string
  }
  noFocusAnimation?: boolean
}

const variantsTextField = cva(['border', 'rounded-lg', 'hover:border-gray-400'], {
  variants: {
    sizes: {
      small: ['text-sm', 'min-h-[1.875rem]', 'px-2'],
      medium: ['min-h-[2.5rem]', 'px-2.5', 'leading-6'],
      large: ['text-lg', 'min-h-[3.125rem]', 'px-3']
    }
  },
  defaultVariants: {
    sizes: 'medium'
  }
})

export type TextFieldProps = (
  | InputHTMLAttributes<HTMLInputElement>
  | TextareaHTMLAttributes<HTMLTextAreaElement>
  | SelectHTMLAttributes<HTMLSelectElement>
) &
  VariantProps<typeof variantsTextField> &
  MoreProps

const TextField = forwardRef<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement, TextFieldProps>(
  (props: TextFieldProps, ref) => {
    let {
      label,
      type,
      error,
      value: intialValue,
      onChange,
      helperText,
      multiline,
      select,
      options,
      startAdornment,
      endAdornment,
      fullWidth,
      placeholder,
      margin = 'none',
      color,
      variant = 'bordered',
      sizes,
      className,
      classNames,
      children,
      disabled,
      autoCompleteMenu,
      maxWidth,
      noFocusAnimation,
      ...rest
    } = props
    const [value, setValue] = useState(intialValue === 0 ? true : intialValue ? true : false)
    const [isFocused, setIsFocused] = useState(false)

    const inputClasses = twMerge(fullWidth && 'w-full', 'bg-inherit', 'focus:outline-none', 'focus:ring-0')

    const handleFocus = () => setIsFocused(true)
    const handleBlur = () => setIsFocused(false)

    const handleChange = (event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
      if (!intialValue) {
        if (!event.target.value) setValue(false)
        else setValue(true)
      }

      if (onChange) onChange(event as any)
    }

    useEffect(() => {
      const check = intialValue === 0 ? true : intialValue ? true : false
      if (!check) setValue(false)
      else setValue(true)
    }, [intialValue])

    const focus = isFocused || value
    if (!!error) color = 'error'
    const { variantChoose, fieldClassName } = variantIsChoose({
      variant,
      sizes,
      color,
      error,
      disabled,
      focus,
      margin,
      label,
      helperText,
      fullWidth,
      noFocusAnimation
    })

    return (
      <>
        <div className={twMerge('text-inherit', fieldClassName, classNames?.root)}>
          <div
            className={twMerge(
              'relative',
              'inline-flex gap-2 items-center bg-inherit transition-transform duration-400 w-full',
              'text-inherit',
              (sizes === 'small' || sizes === 'large') && 'px-2',
              variantChoose,
              className,
              classNames?.root2
            )}
          >
            {/* startAdornment */}
            {startAdornment && (
              <div className={twMerge('text-sm', 'text-inherit', classNames?.startAdornment)}>{startAdornment}</div>
            )}

            {/* input container */}
            <div
              className={twMerge(classNames?.container, fullWidth && 'w-full')}
              onFocus={handleFocus}
              onBlur={handleBlur}
            >
              {/* label */}
              {!select && label && (
                <label
                  className={twMerge(
                    variantslabel({ sizes }),
                    classNames?.label,
                    focus && variantslabelActive({ sizes, color }),
                    startAdornment && focus && '-translate-x-8',
                    error && 'text-error-main'
                  )}
                  style={{
                    pointerEvents: 'none'
                  }}
                >
                  {label}
                </label>
              )}

              {/* input */}
              {select ? (
                <select
                  ref={ref as LegacyRef<HTMLSelectElement>}
                  // placeholder={label && focus ? placeholder : label ? '' : placeholder}
                  className={twMerge(
                    classNames?.input,
                    (sizes === 'medium' || sizes == undefined) && 'py-2',
                    sizes === 'large' && 'py-3',
                    rest.readOnly && 'cursor-default',
                    inputClasses
                  )}
                  style={{ maxWidth }}
                  value={intialValue}
                  disabled={disabled}
                  onChange={onChange as (e: ChangeEvent<HTMLSelectElement>) => void}
                  {...(rest as SelectHTMLAttributes<HTMLSelectElement>)}
                >
                  {children ||
                    options?.map(option => (
                      <option className='rounded-md' key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                </select>
              ) : multiline ? (
                <textarea
                  ref={ref as LegacyRef<HTMLTextAreaElement>}
                  placeholder={label && focus ? placeholder : label ? '' : placeholder}
                  className={twMerge(classNames?.input, inputClasses, 'py-1', rest.readOnly && 'cursor-default')}
                  value={intialValue}
                  disabled={disabled}
                  onChange={handleChange}
                  rows={4}
                  style={{ maxWidth }}
                  {...(rest as TextareaHTMLAttributes<HTMLTextAreaElement>)}
                />
              ) : (
                <input
                  ref={ref as LegacyRef<HTMLInputElement>}
                  placeholder={label && focus ? placeholder : label ? '' : placeholder}
                  type={multiline ? 'textarea' : type}
                  className={twMerge(classNames?.input, inputClasses, rest.readOnly && 'cursor-default')}
                  value={intialValue}
                  onChange={handleChange}
                  disabled={disabled}
                  style={{ maxWidth }}
                  {...(rest as InputHTMLAttributes<HTMLInputElement>)}
                />
              )}
            </div>

            {/* endAdornment */}
            {endAdornment && (
              <div className={twMerge('text-sm', 'text-inherit', classNames?.endAdornment)}>{endAdornment}</div>
            )}
          </div>
          {/* helperText */}
          {helperText && (
            <p
              className={twMerge(
                'text-xs text-gray-500 absolute -bottom-4 left-3',
                classNames?.helperText,
                error && 'text-error-main'
              )}
            >
              {helperText}
            </p>
          )}
        </div>
        {autoCompleteMenu}
      </>
    )
  }
)

TextField.displayName = 'TextField'

export default TextField
