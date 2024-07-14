import { ReactNode } from 'react'
import { useAppContext } from 'src/context/AppContext/useAppContext'
import Avatar from '../ui/Avatar'
import Menu from '../ui/Menu'
import MenuClickHook from '../ui/Menu/MenuClickHook'
import MenuItem from '../ui/Menu/MenuItem'
import Paper from '../ui/Paper'
import Typography from '../ui/Typograph'
import Notification from './Notification'
import CircularProgress from '../ui/CircularProgress'

const ProfilMenu = () => {
  const { auth } = useAppContext()
  const { user, logout } = auth
  const { button, menu } = MenuClickHook()

  return (
    <>
      <button {...button}>
        <Avatar alt={user?.name || ''} />
      </button>
      <Menu {...menu} anchor='bottom-end'>
        <div className='py-1 mb-1 border-b flex gap-2'>
          <div>
            <Avatar alt={user?.name || ''} />
          </div>
          <div>
            <Typography component='div' fontWeight='semibold' variant='subtitle2'>
              {`${user?.name}`.length > 20 ? user?.name.slice(0, 20) + '...' : user?.name}
            </Typography>
            <Typography component='div' color='text-secondary' variant='body2'>
              {`${user?.email}`.length > 20 ? user?.email.slice(0, 20) + '...' : user?.email}
            </Typography>
          </div>
        </div>
        <MenuItem
          onClick={() => {
            menu.onClose()
            logout?.()
          }}
        >
          Logout
        </MenuItem>
      </Menu>
    </>
  )
}

export const LoadingPage = () => {
  return (
    <div className='h-[100dvh] flex justify-center items-center'>
      <CircularProgress size={60} />
    </div>
  )
}

function MainLayout({ children }: { children: ReactNode }) {
  const { auth } = useAppContext()
  const { isLoading } = auth
  if (isLoading) return <LoadingPage />

  return (
    <div>
      <Paper className='flex justify-between m-4 p-2 bg-primary-main/10'>
        <div>MisFits</div>
        <div className='inline-flex gap-1'>
          <Notification />
          <ProfilMenu />
        </div>
      </Paper>
      {children}
    </div>
  )
}

export default MainLayout
