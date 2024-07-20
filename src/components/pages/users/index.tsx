import { useRouter } from 'next/router'
import RefreshButton from 'src/components/ReuseableComponent/RefreshButton'
import AddUser from 'src/components/pages/users/AddUser'
import DeleteUser from 'src/components/pages/users/DeleteUser'
import UpdateUser from 'src/components/pages/users/UpdateUser'
import Paper from 'src/components/ui/Paper'
import Table from 'src/components/ui/Table'
import TableBody from 'src/components/ui/Table/TableBody'
import TableCell from 'src/components/ui/Table/TableCell'
import TableHead from 'src/components/ui/Table/TableHead'
import TableRow from 'src/components/ui/Table/TableRow'
import Typography from 'src/components/ui/Typograph'
import { formatPhoneNumber } from 'src/components/utility/formats'
import { IResponseUsers } from 'src/type/users'
import { KeyedMutator } from 'swr'
import RestoreUser from './RestoreUser'
import RecycleBinButton from 'src/components/ReuseableComponent/RecycleBinButton'

interface Props {
  mutate: KeyedMutator<IResponseUsers>
  data: IResponseUsers
}

function UsersPage({ data, mutate }: Props) {
  const router = useRouter()
  const isDeleted = Boolean(router.query.isDeleted)

  return (
    <Paper className='p-4 m-4'>
      <div className='flex justify-between mb-2'>
        <Typography variant='h5' fontWeight='semibold'>
          Table Users
        </Typography>
        <div>
          <AddUser mutate={mutate} /> <RefreshButton mutate={mutate} /> <RecycleBinButton />
        </div>
      </div>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell head component='th' className='py-2 text-left w-10'>
              No.
            </TableCell>
            <TableCell head component='th' className='py-2 text-left'>
              Name
            </TableCell>
            <TableCell head component='th' className='py-2 text-left'>
              Email
            </TableCell>
            <TableCell head component='th' className='py-2'>
              Handphone
            </TableCell>
            <TableCell head component='th' className='py-2 text-right'>
              Action
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.data.map((v, i) => (
            <TableRow hover key={`${v._id}`}>
              <TableCell>{i + 1}.</TableCell>
              <TableCell>{v.name}</TableCell>
              <TableCell>{v.email}</TableCell>
              <TableCell className='text-center whitespace-nowrap'>{formatPhoneNumber(v.handphone)}</TableCell>
              <TableCell className='text-right whitespace-nowrap'>
                <UpdateUser data={v} mutate={mutate} key={`${v._id}`} />
                {isDeleted ? (
                  <RestoreUser user={v} mutate={mutate} key={`${v._id}`} />
                ) : (
                  <DeleteUser user={v} mutate={mutate} key={`${v._id}`} />
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  )
}

export default UsersPage
