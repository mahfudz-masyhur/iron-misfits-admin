import Link from 'next/link'
import { useRouter } from 'next/router'
import RecycleBinButton from 'src/components/ReuseableComponent/RecycleBinButton'
import RefreshButton from 'src/components/ReuseableComponent/RefreshButton'
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
import { FormatListArray, formatDate, formatPhoneNumber, isWithinOneDay } from 'src/components/utility/formats'
import { IResponseMembers } from 'src/type/member'
import { KeyedMutator } from 'swr'
import RestoreMember from './RestoreMember'
import TableSearch from 'src/components/ReuseableComponent/TableSearch'
import Tooltip from 'src/components/ui/Tolltip'

interface Props {
  mutate: KeyedMutator<IResponseMembers>
  data: IResponseMembers
}

function MembersPage({ data, mutate }: Props) {
  const router = useRouter()
  const isDeleted = Boolean(router.query.isDeleted)
  const query = {
    sort: router.query.sort || 'updatedAt',
    order: router.query.order || 'DESC'
  } as any

  function handleSort(sort: string, order?: 'ASC' | 'DESC') {
    router.push({ query: { ...router.query, sort, order } })
  }

  return (
    <Paper className='p-4 m-4'>
      <div className='flex flex-col sm:flex-row justify-between mb-2'>
        <Typography variant='h5' fontWeight='semibold'>
          Table Members
        </Typography>
        <div className='text-right'>
          <AddMember mutate={mutate} />
          <RefreshButton mutate={mutate} />
          <RecycleBinButton />
        </div>
      </div>
      <TableSearch maxPage={data.paginate.maxPage} page={data.paginate.page}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell head component='th' className='py-2 text-left w-10'>
                No.
              </TableCell>
              <TableCell
                head
                component='th'
                className='py-2 text-left'
                sort={{
                  sort: query.order,
                  sortBy: 'name',
                  sortByActive: query.sort,
                  onHover: handleSort
                }}
              >
                Name
              </TableCell>
              <TableCell head component='th' className='py-2 text-left'>
                Social media
              </TableCell>
              <TableCell head component='th' className='py-2'>
                Handphone
              </TableCell>
              <TableCell
                head
                component='th'
                className='py-2 text-right'
                sort={{
                  sort: query.order,
                  sortBy: 'createdAt',
                  sortByActive: query.sort,
                  onHover: handleSort
                }}
              >
                Dibuat
              </TableCell>
              <TableCell
                head
                component='th'
                className='py-2 text-right'
                sort={{
                  sort: query.order,
                  sortBy: 'updatedAt',
                  sortByActive: query.sort,
                  onHover: handleSort
                }}
              >
                Diedit
              </TableCell>
              <TableCell head component='th' className='py-2 text-right'>
                Action
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.data.map((v, i) => {
              const createdAt = new Date(v.createdAt)
              const updatedAt = new Date(v.updatedAt)
              const today = new Date()

              const createdAtWithoutTime = new Date(createdAt.getFullYear(), createdAt.getMonth(), createdAt.getDate())
              const updatedAtWithoutTime = new Date(updatedAt.getFullYear(), updatedAt.getMonth(), updatedAt.getDate())
              const todayWithoutTime = new Date(today.getFullYear(), today.getMonth(), today.getDate())

              const justUpdate = updatedAtWithoutTime.getTime() === todayWithoutTime.getTime()
              const justCreated =
                v.createdAt === v.updatedAt ? createdAtWithoutTime.getTime() === todayWithoutTime.getTime() : false
              return (
                <TableRow hover key={`${i}`}>
                  <TableCell>{i + 1}.</TableCell>
                  <TableCell>
                    {justCreated ? (
                      <Tooltip title='Baru dibuat hari ini' anchor='bottom-start' arrow>
                        <div className='inline-block w-3 h-3 mr-1 rounded-full bg-success-main' />
                      </Tooltip>
                    ) : (
                      justUpdate && (
                        <Tooltip title='Baru diedit hari ini' anchor='bottom-start' arrow>
                          <div className='inline-block w-3 h-3 mr-1 rounded-full bg-info-main' />
                        </Tooltip>
                      )
                    )}
                    {v.name}
                  </TableCell>
                  <TableCell>{FormatListArray(v.socialmedia.map(v => `${v.key}:${v.value}`))}</TableCell>
                  <TableCell className='text-center whitespace-nowrap'>{formatPhoneNumber(v.handphone)}</TableCell>
                  <TableCell className='text-right whitespace-nowrap'>{formatDate(v.createdAt)}</TableCell>
                  <TableCell className='text-right whitespace-nowrap'>{formatDate(v.updatedAt)}</TableCell>
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
                    <UpdateMember data={v} mutate={mutate} />
                    {isDeleted && <RestoreMember data={v} mutate={mutate} />}
                    <DeleteMember data={v} mutate={mutate} />
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </TableSearch>
    </Paper>
  )
}

export default MembersPage
