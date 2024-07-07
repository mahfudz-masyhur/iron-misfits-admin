import { ReactNode, isValidElement, useEffect, useRef, useState } from 'react'
import { twMerge } from 'tailwind-merge'

export interface AccordionItemProps {
  title: string | ReactNode
  children: ReactNode
  isOpen?: boolean
  onToggle?: () => void
  className?: string
  classNames?: {
    root?: string
    trigger?: string
    transition?: string
    content?: string
  }
}

const AccordionItem: React.FC<AccordionItemProps> = ({ title, children, isOpen, onToggle, classNames, className }) => {
  const [maxHeight, setMaxHeight] = useState('0px')
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isOpen && contentRef.current) {
      setMaxHeight(`${contentRef.current.scrollHeight}px`)
    } else {
      setMaxHeight('0px')
    }
  }, [isOpen])

  return (
    <div className={twMerge('border-b border-divider', classNames?.root)}>
      {/* trigger */}
      <button
        className={twMerge(
          'w-full text-left flex justify-between items-center focus:outline-none',
          classNames?.trigger
        )}
        onClick={onToggle}
      >
        {isValidElement(title) ? title : <span className='font-medium'>{title}</span>}
        <svg
          className={`w-5 h-5 transform transition-transform duration-200 ${isOpen ? 'rotate-180' : 'rotate-0'}`}
          fill='none'
          stroke='currentColor'
          viewBox='0 0 24 24'
          xmlns='http://www.w3.org/2000/svg'
        >
          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M19 9l-7 7-7-7'></path>
        </svg>
      </button>
      {/* transition */}
      <div
        ref={contentRef}
        style={{ maxHeight }}
        className={twMerge('overflow-hidden transition-max-height duration-200 ease-in-out', classNames?.transition)}
      >
        {/* content */}
        <div className={twMerge('p-1', className, classNames?.content)}>{children}</div>
      </div>
    </div>
  )
}

export default AccordionItem
