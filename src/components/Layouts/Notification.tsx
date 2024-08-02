import React from 'react'
import Avatar from '../ui/Avatar'
import Menu from '../ui/Menu'
import { useAppContext } from 'src/context/AppContext/useAppContext'
import MenuClickHook from '../ui/Menu/MenuClickHook'
import MenuItem from '../ui/Menu/MenuItem'
import useSWR from 'swr'
import { fetcherClient } from 'server/api'
import { IResponseTransactions } from 'src/type/transaction'
import { formatDate } from '../utility/formats'
import Link from 'next/link'
import IconNotifcations from '../ui/Icon/IconNotifcations'
import IconButton from '../ui/IconButton'

function Notification({ closeMenu }: { closeMenu: () => void }) {
  const { button, menu } = MenuClickHook()
  const { data } = useSWR<IResponseTransactions>(`/api/transaction/notification`, fetcherClient)
  const now = new Date()

  return (
    <>
      <div className='relative'>
        <IconButton
          {...button}
          onClick={e => {
            closeMenu()
            button.onClick(e)
          }}
        >
          <IconNotifcations fontSize={20} />
        </IconButton>
        {data && data.data.length > 0 && (
          <span className='absolute -bottom-[2px] -left-[2px] flex h-4 w-4'>
            <span className='animate-ping absolute inline-flex h-full w-full rounded-full bg-success-main opacity-75'></span>
            <span className='relative inline-flex rounded-full h-4 w-4 bg-success-main'></span>
          </span>
        )}
      </div>
      <Menu {...menu} anchor='bottom-end'>
        {data && data.data.length > 0 ? (
          data?.data.map(v => {
            const isExpired = new Date(v.expired) <= now

            return (
              <MenuItem key={v._id} Link={Link} href={`/members/${v.member._id}`}>
                {isExpired && (
                  <span className='mr-2 inline-flex h-2 w-2'>
                    <span className='relative inline-flex rounded-full h-2 w-2 bg-red-600'></span>
                  </span>
                )}
                {v.member.name}, expire at {formatDate(v.expired)}
              </MenuItem>
            )
          })
        ) : (
          <MenuItem>No Data</MenuItem>
        )}
      </Menu>
    </>
  )
}

export default Notification
