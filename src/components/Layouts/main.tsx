import { ReactNode } from 'react'
import Tooltip from '../ui/Tolltip'
import Avatar from '../ui/Avatar'
import { useAppContext } from 'src/context/AppContext/useAppContext'
import Paper from '../ui/Paper'

function MainLayout({ children }: { children: ReactNode }) {
  const { auth } = useAppContext()
  const { user } = auth
  return (
    <div>
      <Paper className='flex justify-between m-4 p-2 bg-primary-main/10'>
        <div>MisFits</div>
        <Tooltip title={user?.email} anchor='left' arrow>
          <Avatar alt={user?.name || ''} />
        </Tooltip>
      </Paper>
      {children}
    </div>
  )
}

export default MainLayout
