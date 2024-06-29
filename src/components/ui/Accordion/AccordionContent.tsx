'use client'

import { ComponentPropsWithoutRef, ElementRef, forwardRef } from 'react'
import { Content } from '@radix-ui/react-accordion'
import { twMerge } from 'tailwind-merge'

const AccordionContent = forwardRef<ElementRef<typeof Content>, ComponentPropsWithoutRef<typeof Content>>(
  ({ className, children, ...props }, ref) => (
    <Content
      ref={ref}
      className={twMerge(
        'overflow-hidden text-sm data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down',
        className
      )}
      {...props}
    >
      <div className='pt-0 pb-4'>{children}</div>
    </Content>
  )
)
AccordionContent.displayName = Content.displayName

export default AccordionContent
