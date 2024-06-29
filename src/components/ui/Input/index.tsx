'use client'
import { VariantProps } from 'class-variance-authority'
import { ChangeEvent, InputHTMLAttributes, LegacyRef, forwardRef, useEffect, useState } from 'react'
import { twMerge } from 'tailwind-merge'
import { variantIsChoose, variantsInputOutline, variantslabel, variantslabelActive } from '../TextField/FieldVariant'

interface MoreProps {
  label?: string
  helperText?: string | JSX.Element | boolean
  variant?: 'bordered' | 'underlined' | 'default'
  error?: boolean
  startAdornment?: JSX.Element
  endAdornment?: JSX.Element
  fullWidth?: boolean
  margin?: 'none' | 'dense' | 'normal'
  color?: 'primary' | 'success' | 'error' | 'warning' | 'info' | 'default'
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

export type TextFieldProps = InputHTMLAttributes<HTMLInputElement> &
  VariantProps<typeof variantsInputOutline> &
  MoreProps

const Input = forwardRef<HTMLInputElement, TextFieldProps>((props: TextFieldProps, ref) => {
  let {
    label,
    error,
    value: intialValue,
    onChange,
    helperText,
    startAdornment,
    endAdornment,
    fullWidth,
    placeholder,
    margin = 'none',
    color,
    variant = 'bordered',
    sizes,
    disabled,
    className,
    children,
    autoCompleteMenu,
    maxWidth,
    classNames,
    noFocusAnimation,
    ...rest
  } = props
  const [value, setValue] = useState(intialValue ? true : false)

  const [isFocused, setIsFocused] = useState(false)
  const handleFocus = () => setIsFocused(true)
  const handleBlur = () => setIsFocused(false)

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (!intialValue) {
      if (!event.target.value) setValue(false)
      else setValue(true)
    }

    if (onChange) onChange(event)
  }

  useEffect(() => {
    if (!intialValue) setValue(false)
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
      <div className={twMerge(fieldClassName, classNames?.root)}>
        <div
          className={twMerge(
            'relative',
            'inline-flex gap-2 items-center bg-inherit transition-transform duration-400 w-full',
            (sizes === 'small' || sizes === 'large') && 'px-2',
            variantChoose,
            className,
            classNames?.root2
          )}
        >
          {/* startAdornment */}
          {startAdornment && <div className={twMerge('text-sm', classNames?.startAdornment)}>{startAdornment}</div>}

          {/* input container */}
          <div
            className={twMerge(classNames?.container, fullWidth && 'w-full')}
            onFocus={handleFocus}
            onBlur={handleBlur}
          >
            {/* label */}
            {label && (
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
            <input
              ref={ref as LegacyRef<HTMLInputElement>}
              placeholder={label && focus ? placeholder : label ? '' : placeholder}
              disabled={disabled}
              className={twMerge(
                classNames?.input,
                fullWidth && 'w-full',
                'bg-inherit focus:outline-none focus:ring-0',
                rest.readOnly && 'cursor-default'
              )}
              value={intialValue}
              onChange={handleChange}
              style={{ maxWidth }}
              {...(rest as InputHTMLAttributes<HTMLInputElement>)}
            />
          </div>

          {/* endAdornment */}
          {endAdornment && <div className={twMerge('text-sm', classNames?.endAdornment)}>{endAdornment}</div>}
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
})

Input.displayName = 'Input'

export default Input
