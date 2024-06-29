'use client'
import { useEffect, useRef, ReactNode, FC } from 'react'

interface ClickAwayListenerProps {
  onClickAway?: () => void
  children: ReactNode
}

const ClickAwayListener: FC<ClickAwayListenerProps> = ({ onClickAway, children }) => {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (onClickAway && ref.current && !ref.current.contains(event.target as Node)) onClickAway()
    }

    document.addEventListener('click', handleClickOutside)

    return () => {
      document.removeEventListener('click', handleClickOutside)
    }
  }, [onClickAway])

  return <div ref={ref}>{children}</div>
}

export default ClickAwayListener
