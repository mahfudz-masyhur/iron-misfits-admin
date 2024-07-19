import { forwardRef } from 'react'
import { twMerge } from 'tailwind-merge'
import { IconProps } from './Type'
import variantsIcon from './variant'

const IconRestore = forwardRef<SVGSVGElement, IconProps>((props: IconProps, ref) => {
  const { className, color, fontSize = 24, ...rest } = props

  return (
    <svg
      {...rest}
      ref={ref}
      className={twMerge(variantsIcon({ color, className }))}
      width={`${fontSize}`}
      height={`${fontSize}`}
      xmlns='http://www.w3.org/2000/svg'
      viewBox='0 0 24 24'
    >
      <g
        fill='none'
        stroke='currentColor'
        strokeLinecap='round'
        strokeLinejoin='round'
        strokeWidth='1.5'
        color='currentColor'
      >
        <path d='M3.75 5h5.43a2 2 0 0 0 1.664-.89l.812-1.22A2 2 0 0 1 13.32 2h4.488a2 2 0 0 1 1.898 1.368L20.25 5m1.5 0h-13' />
        <path d='m20.25 5l-.5 6.5M5.25 5l.605 10.536c.154 2.57.232 3.856.874 4.78c.317.458.726.843 1.2 1.133c.582.356 1.284.496 2.321.551m1.5-6.502l1.136 1.466a4 4 0 0 1 7.364-.901m1.5 4.435l-1.136-1.464a4 4 0 0 1-7.328.965' />
      </g>
    </svg>
  )
})

IconRestore.displayName = 'IconRestore'

export default IconRestore
