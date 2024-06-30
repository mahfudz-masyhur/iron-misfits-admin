import { TableHTMLAttributes, forwardRef } from 'react'
import { twMerge } from 'tailwind-merge'

interface MoreProps {
  overflowX?: boolean
  exceptMobile?: boolean
}

export type TableProps = TableHTMLAttributes<HTMLTableElement> & MoreProps

const Table = forwardRef<HTMLTableElement, TableProps>(
  ({ overflowX = true, exceptMobile, className, ...rest }, ref) => {
    return overflowX ? (
      <div className='overflow-x-auto'>
        <table
          ref={ref}
          className={twMerge(
            'text-sm min-w-full h-auto table-auto w-full border-divider dark:border-gray-700',
            exceptMobile && 'hidden sm:table',
            className
          )}
          {...rest}
        />
      </div>
    ) : (
      <table
        ref={ref}
        className={twMerge(
          'text-sm w-full min-w-screen-sm border-divider dark:border-gray-700',
          exceptMobile && 'hidden sm:table',
          className
        )}
        {...rest}
      />
    )
  }
)

Table.displayName = 'Table'

export default Table
