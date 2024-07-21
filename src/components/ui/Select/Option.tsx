import React, { OptionHTMLAttributes, ReactNode, forwardRef } from 'react'
import { twMerge } from 'tailwind-merge'

export type OptionProps = { value?: string } & OptionHTMLAttributes<HTMLDivElement>

const Option = forwardRef<HTMLDivElement, OptionProps>((props: OptionProps, ref) => {
  const { className, value, ...rest } = props
  return (
    <div
      ref={ref}
      className={twMerge(
        `rounded-lg p-2 pl-8 hover:bg-gray-400/10 cursor-pointer whitespace-normal flex ${
          rest.disabled && 'text-gray-300'
        }`,
        className
      )}
      data-value={value === undefined ? '' : value}
      {...rest}
      style={{ WebkitTapHighlightColor: 'transparent' }}
    />
  )
})

Option.displayName = 'Option'

export default Option
