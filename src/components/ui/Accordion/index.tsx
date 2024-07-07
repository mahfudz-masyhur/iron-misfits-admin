import { Children, ReactElement, ReactNode, cloneElement, isValidElement, useState } from 'react'
import { AccordionItemProps } from './AccordionItem'

export interface AccordionProps {
  children: ReactNode
  type?: 'normal' | 'only-open-one'
}

const Accordion: React.FC<AccordionProps> = ({ children, type = 'normal' }) => {
  const [openIndexes, setOpenIndexes] = useState<number[]>([])

  const handleToggle = (index: number) => {
    if (type === 'normal') {
      setOpenIndexes(prevIndexes => {
        if (prevIndexes.includes(index)) {
          return prevIndexes.filter(idx => idx !== index)
        } else {
          return [...prevIndexes, index]
        }
      })
    } else if (type === 'only-open-one') {
      setOpenIndexes(prevIndexes => (prevIndexes.includes(index) ? [] : [index]))
    }
  }

  return (
    <>
      {Children.map(children, (child, index) => {
        if (isValidElement<AccordionItemProps>(child)) {
          return cloneElement<AccordionItemProps>(child as ReactElement<AccordionItemProps>, {
            isOpen: openIndexes.includes(index),
            onToggle: () => handleToggle(index)
          })
        }
        return null
      })}
    </>
  )
}

export default Accordion
