'use client'

import { ComponentPropsWithoutRef, ElementRef, forwardRef } from 'react'
import { Header, Trigger } from '@radix-ui/react-accordion'
import { twMerge } from 'tailwind-merge'
import IconChevronDown from '../Icon/IconChevronDown'

const AccordionTrigger = forwardRef<ElementRef<typeof Trigger>, ComponentPropsWithoutRef<typeof Trigger>>(
  ({ className, children, ...props }, ref) => (
    <Header className='flex'>
      <Trigger
        ref={ref}
        className={twMerge(
          'flex flex-1 items-center justify-between py-4 transition-all [&[data-state=open]>svg]:rotate-180',
          className
        )}
        {...props}
      >
        {children}
        <IconChevronDown className='w-4 h-4 transition-transform duration-200 shrink-0 text-muted-foreground' />
      </Trigger>
    </Header>
  )
)
AccordionTrigger.displayName = Trigger.displayName

export default AccordionTrigger
