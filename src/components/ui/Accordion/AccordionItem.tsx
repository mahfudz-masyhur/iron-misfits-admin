'use client'

import { Item } from '@radix-ui/react-accordion'
import { ComponentPropsWithoutRef, ElementRef, forwardRef } from 'react'
import { twMerge } from 'tailwind-merge'

const AccordionItem = forwardRef<ElementRef<typeof Item>, ComponentPropsWithoutRef<typeof Item>>(
  ({ className, ...props }, ref) => <Item ref={ref} className={twMerge(className)} {...props} />
)
AccordionItem.displayName = 'AccordionItem'

export default AccordionItem
