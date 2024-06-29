import { HTMLAttributes, ReactNode, forwardRef, useEffect, useLayoutEffect, useState } from 'react'
import { twMerge } from 'tailwind-merge'
import IconSortAsc from '../../Icon/IconSortAsc'
import IconSortDesc from '../../Icon/IconSortDesc'

interface MoreProps {
  roundedHead?: 'top-none' | 'bottom-none'
  component?: 'th' | 'td'
  colSpan?: number
  rowSpan?: number
  head?: boolean
  rounded?: boolean
  sort?: {
    sort: 'ASC' | 'DESC'
    sortBy: string
    sortByActive: string
    onHover: (sortBy: string, sort: 'ASC' | 'DESC') => void
  }
}

interface HoverTableCellProps {
  children: ReactNode
  sortByActive?: string
  sortBy: string
  onClick: (sortBy: string, sort: 'ASC' | 'DESC') => void
  sort: 'ASC' | 'DESC'
}

const HoverTableCell = ({ children, sortBy, sortByActive, onClick, sort }: HoverTableCellProps) => {
  const [enter, setEnter] = useState<{ show: boolean; sort: 'ASC' | 'DESC' }>({
    show: false,
    sort: sort
  })

  useLayoutEffect(() => {
    setEnter(p => ({ ...p, show: sortByActive === sortBy ? true : false }))
  }, [sortByActive, sortBy])

  return (
    <div
      className={`flex gap-2 justify-between w-full items-center ${enter.show ? '' : 'mr-[21px]'}`}
      onMouseEnter={() => setEnter(p => ({ ...p, show: true }))}
      onMouseLeave={() => (sortByActive === sortBy ? null : setEnter(p => ({ ...p, show: false })))}
    >
      <span>{children}</span>
      {enter.show && (
        <>
          {enter.sort === 'ASC' && (
            <IconSortAsc
              fontSize={13}
              className='cursor-pointer'
              onClick={() => {
                setEnter(p => ({ ...p, sort: 'DESC' }))
                onClick(sortBy, enter.sort)
              }}
            />
          )}
          {enter.sort === 'DESC' && (
            <IconSortDesc
              fontSize={13}
              className='cursor-pointer'
              onClick={() => {
                setEnter(p => ({ ...p, sort: 'ASC' }))
                onClick(sortBy, enter.sort)
              }}
            />
          )}
        </>
      )}
    </div>
  )
}

export type TableProps = HTMLAttributes<HTMLTableDataCellElement> & MoreProps

const TableCell = forwardRef<HTMLTableDataCellElement, TableProps>((props, ref) => {
  const { component: Component = 'td', className, head, children, rounded = true, sort, roundedHead, ...rest } = props

  const classNameTwMerge = twMerge(
    'table-cell align-[inherit] border-inherit px-6 py-3',
    rounded && 'first:rounded-l-xl last:rounded-r-xl',
    head &&
      'bg-gray-400/10 relative after:block last:after:hidden after:content-[""] after:w-[0.0625rem] after:h-[calc(100%-1rem)] after:bg-gray-300 after:dark:bg-gray-600 after:absolute after:right-0 after:top-0 after:bottom-0 after:m-auto',
    roundedHead === 'top-none' && 'first:rounded-tl-none last:rounded-tr-none',
    roundedHead === 'bottom-none' && 'first:rounded-bl-none last:rounded-br-none',
    className
  )

  if (head && sort) {
    return (
      <Component
        ref={ref}
        className={classNameTwMerge}
        {...rest}
      >
        <HoverTableCell sortBy={sort.sortBy} onClick={sort.onHover} sortByActive={sort.sortByActive} sort={sort.sort}>
          {children}
        </HoverTableCell>
      </Component>
    )
  }

  return (
    <Component
      ref={ref}
      className={classNameTwMerge}
      {...rest}
    >
      {children}
    </Component>
  )
})

TableCell.displayName = 'TableCell'

export default TableCell
