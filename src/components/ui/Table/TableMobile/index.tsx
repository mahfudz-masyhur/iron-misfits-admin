import { ReactNode } from 'react'
import { twMerge } from 'tailwind-merge'

export interface TableMobileProps {
  children: ReactNode
  showOnAllDevices?: boolean
  title?: string
  moreContent?: JSX.Element
}

function TableMobile({ children, showOnAllDevices, title, moreContent }: TableMobileProps) {
  const Title = () => {
    return moreContent ? (
      <div className='p-2 rounded-xl bg-gray-400/10 border-inherit flex items-center justify-between'>
        <div className='text-xs font-semibold uppercase text-text-secondary dark:text-gray-400 align-middle'>
          {!title ? 'Table' : title}
        </div>
        {moreContent}
      </div>
    ) : (
      <div className='p-2 text-xs font-semibold uppercase align-middle rounded-xl bg-gray-400/10 border-inherit text-text-secondary dark:text-gray-400'>
        {!title ? 'Table' : title}
      </div>
    )
  }

  return (
    <div className={twMerge('px-4 py-2', !showOnAllDevices && 'sm:hidden')}>
      {<Title />}
      <div>{children}</div>
    </div>
  )
}

export default TableMobile
