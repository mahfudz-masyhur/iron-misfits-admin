import { ReactNode, useState } from 'react'
import { useAppContext } from 'src/context/AppContext/useAppContext'
import Avatar from '../ui/Avatar'
import Menu from '../ui/Menu'
import MenuClickHook from '../ui/Menu/MenuClickHook'
import MenuItem from '../ui/Menu/MenuItem'
import Paper from '../ui/Paper'
import Typography from '../ui/Typograph'
import Notification from './Notification'
import CircularProgress from '../ui/CircularProgress'
import Link from '../ui/Link'
import IconButton from '../ui/IconButton'
import IconMenu from '../ui/Icon/IconMenu'
import Collapse from '../ui/Collapse'

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
        <MenuItem Link={Link} href='/settings' onClick={menu.onClose}>
          Setting
        </MenuItem>
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

const menu = [
  { link: '/users', label: 'users' },
  { link: '/members', label: 'members' },
  { link: '/packages', label: 'packages' },
  { link: '/promos', label: 'promos' },
  { link: '/referrals', label: 'referrals' }
]

function MainLayout({ children }: { children: ReactNode }) {
  const { auth } = useAppContext()
  const { isLoading } = auth
  const [open, setOpen] = useState(false)
  if (isLoading) return <LoadingPage />

  return (
    <div>
      <Paper className='flex justify-between m-4 p-2 bg-primary-main/10'>
        <div className='inline-flex items-center gap-3'>
          <Link href='/'>
            <Typography fontWeight='semibold'>MisFits</Typography>
          </Link>
          <ul className='hidden sm:flex gap-2'>
            {menu.map(v => (
              <li key={v.link}>
                <Link href={v.link}>{v.label}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div className='inline-flex gap-1'>
          <Notification />
          <ProfilMenu />
          <IconButton className='flex sm:hidden' onClick={() => setOpen(p => !p)}>
            <IconMenu />
          </IconButton>
        </div>
      </Paper>

      <Collapse isOpen={open} className='sm:hidden fixed top-20 w-full z-50'>
        <div className='bg-background-paper dark:bg-background-paper-dark mx-4 border p-4 rounded-xl'>
          <ul>
            {menu.map(v => (
              <MenuItem href={v.link} Link={Link} key={v.link} onClick={()=>setOpen(false)}>
                {v.label}
              </MenuItem>
            ))}
          </ul>
        </div>
      </Collapse>
      {children}
    </div>
  )
}

export default MainLayout
