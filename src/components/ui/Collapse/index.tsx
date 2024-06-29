'use client'
import { HTMLAttributes, forwardRef, useEffect, useRef, useState } from 'react'
import { twMerge } from 'tailwind-merge'

interface MoreProps {
  isOpen: boolean
  duration?: number
}

export type CollapseProps = HTMLAttributes<HTMLDivElement> & MoreProps

const Collapse = forwardRef<HTMLDivElement, CollapseProps>((props: CollapseProps, ref) => {
  const { isOpen, duration, className, children, ...rest } = props
  const [height, setHeight] = useState<number | undefined>(undefined)
  const childCollapseRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    setHeight(childCollapseRef.current?.scrollHeight)
  }, [childCollapseRef.current?.scrollHeight])

  return (
    <div
      {...rest}
      ref={ref}
      className={twMerge(`transition-all duration-300`, 'overflow-auto', 'ease-in-out', 'overflow-hidden', className)}
      style={{
        maxHeight: isOpen && height ? height + 10 : 0
      }}
    >
      <div ref={childCollapseRef}>{children}</div>
    </div>
  )
})

Collapse.displayName = 'Collapse'

export default Collapse
