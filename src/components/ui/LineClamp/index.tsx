import { HTMLAttributes } from 'react'
import { twMerge } from 'tailwind-merge'

export type LineClamp = HTMLAttributes<HTMLElement> & { line: number; Component?: any }

export default function LineClamp({ line, Component = 'span', className, ...rest }: LineClamp) {
  return (
    <Component
      className={twMerge('overflow-hidden', className)}
      style={{
        display: '-webkit-box',
        WebkitLineClamp: line,
        lineClamp: line,
        WebkitBoxOrient: 'vertical'
      }}
      {...rest}
    />
  )
}
