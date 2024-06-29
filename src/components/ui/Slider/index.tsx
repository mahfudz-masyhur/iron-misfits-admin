import { VariantProps, cva } from 'class-variance-authority'
import React, { InputHTMLAttributes, forwardRef, useEffect, useRef, useState } from 'react'
import { twMerge } from 'tailwind-merge'

interface MoreProps {}

const variants = cva(['w-full mb-6 rounded-lg appearance-none cursor-pointer range-sm'], {
  variants: {
    color: {
      primary: 'bg-primary-main',
      success: 'bg-success-main',
      warning: 'bg-warning-main',
      info: 'bg-info-main',
      error: 'bg-error-main',
      white: 'bg-white'
    },
    sizes: {
      small: 'h-1',
      medium: 'h-2',
      large: 'h-3'
    }
  },
  defaultVariants: {
    color: 'primary',
    sizes: 'medium'
  }
})

export type SliderProps = MoreProps & VariantProps<typeof variants> & InputHTMLAttributes<HTMLInputElement>

const Slider = forwardRef<HTMLInputElement, SliderProps>((props, ref) => {
  const { sizes, color, className, ...rest } = props
  return <input ref={ref} type='range' className={twMerge(variants({ sizes, color, className }))} {...rest} />
})

Slider.displayName = 'Slider'

export default Slider
