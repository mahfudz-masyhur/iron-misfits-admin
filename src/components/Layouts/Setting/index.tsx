import React, { ReactNode } from 'react'
import Link from 'src/components/ui/Link'

function SettingLayout({ children }: { children: ReactNode }) {
  return (
    <div className='flex gap-2 h-[calc(100dvh-104px)] m-4'>
      <div className='w-72 border rounded-md p-4'>
        <div>
          <Link href='/settings'>Profil</Link>
        </div>
        <div>
          <Link href='/settings/security'>Security</Link>
        </div>
      </div>
      <div className='border rounded-md flex-1 p-4'>{children}</div>
    </div>
  )
}

export default SettingLayout
