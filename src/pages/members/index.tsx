import { GetServerSideProps } from 'next'
import Link from 'next/link'
import { getMembers } from 'server/api'
import AddMember from 'src/components/pages/members/AddMember'
import DeleteMember from 'src/components/pages/members/DeleteMember'
import UpdateMember from 'src/components/pages/members/UpdateMember'
import IconTransaction from 'src/components/ui/Icon/IconTransaction'
import IconButton from 'src/components/ui/IconButton'
import Paper from 'src/components/ui/Paper'
import Table from 'src/components/ui/Table'
import TableBody from 'src/components/ui/Table/TableBody'
import TableCell from 'src/components/ui/Table/TableCell'
import TableHead from 'src/components/ui/Table/TableHead'
import TableRow from 'src/components/ui/Table/TableRow'
import Typography from 'src/components/ui/Typograph'
import { formatPhoneNumber, getURLParams } from 'src/components/utility/formats'
import { IResponseMembers } from 'src/type/member'

function UsersPage({ data }: { data: IResponseMembers }) {
  return (
    <Paper className='p-4 m-4'>
      <div className='flex justify-between mb-2'>
        <Typography variant='h5' fontWeight='semibold'>
          Table Members
        </Typography>
        <AddMember />
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
            <TableRow hover key={`${i}`}>
              <TableCell>{i + 1}.</TableCell>
              <TableCell>{v.name}</TableCell>
              <TableCell></TableCell>
              <TableCell className='text-center whitespace-nowrap'>{formatPhoneNumber(v.handphone)}</TableCell>
              <TableCell className='text-right whitespace-nowrap'>
                <IconButton
                  sizes='small'
                  variant='text'
                  color='success'
                  LinkComponent={Link}
                  href={`/members/${v._id}`}
                >
                  <IconTransaction fontSize={20} />
                </IconButton>
                <UpdateMember data={v} />
                <DeleteMember data={v} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  )
}

export default UsersPage

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  try {
    const data = await getMembers(req)
    return {
      props: { data }
    }
  } catch (error: any) {
    let destination = '/500'
    if (error?.response?.status === 401) destination = `/login?${getURLParams({ url: req.url })}`
    return {
      props: {},
      redirect: {
        permanent: false,
        destination
      }
    }
  }
}
