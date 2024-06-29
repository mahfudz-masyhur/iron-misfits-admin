'use client'
import { ReactNode, useState } from 'react'
import { formatCaseString } from 'src/components/utility/formats'
import Table from '..'
import Collapse from '../../Collapse'
import IconChevronDown from '../../Icon/IconChevronDown'
import Typography from '../../Typograph'
import TableCell from '../TableCell'
import TableRow from '../TableRow'

export interface TableMobileContentProps<T extends {}> {
  avatar?: JSX.Element
  number?: string | number | JSX.Element
  title: string | number | JSX.Element
  subTitle?: string | number | JSX.Element
  more?: T
  moreImage?: JSX.Element
  action?: JSX.Element
}

function TableMobileContent<T extends Record<string, ReactNode>>(props: TableMobileContentProps<T>) {
  const { avatar, title, subTitle, more, action, moreImage, number } = props
  const [open, setOpen] = useState(false)
  return (
    <div className='p-1 text-sm border-b border-divider dark:border-gray-700'>
      <div className='flex items-center gap-2 my-1 min-h-[2.75rem]' onClick={() => setOpen(p => !p)}>
        <div className='flex items-center gap-2 w-[calc(100%-25px)] overflow-x-hidden'>
          {number && <span className='self-start mt-2 mr-1'>{number}</span>}
          {avatar && <div>{avatar}</div>}
          <div>
            <Typography component='h3' variant='subtitle2' fontWeight='semibold'>
              {title}
            </Typography>
            {subTitle && (
              <Typography component='span' variant='body2'>
                {subTitle}
              </Typography>
            )}
          </div>
        </div>
        {more && Object.keys(more).length > 0 && (
          <IconChevronDown className={`transition-transform duration-300 ${!open && 'rotate-90'}`} />
        )}
      </div>
      {more && Object.keys(more).length > 0 && (
        <Collapse isOpen={open}>
          <div className='overflow-x-auto'>
            <Table overflowX={false} className='mb-1'>
              {Object.entries(more).map(([key, value]) => (
                <TableRow evenOdd='reverse' key={key}>
                  <TableCell className='py-1 px-2 font-semibold capitalize'>{formatCaseString(key)}</TableCell>
                  <TableCell className='py-1 px-2 text-right'>{value}</TableCell>
                </TableRow>
              ))}
            </Table>
          </div>
          {moreImage && <div className='flex justify-center my-1'>{moreImage}</div>}
          {action && <div className='flex justify-end gap-1 my-1'>{action}</div>}
        </Collapse>
      )}
    </div>
  )
}

export default TableMobileContent
