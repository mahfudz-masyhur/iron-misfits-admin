import AddReferral from 'src/components/pages/referrals/AddReferral'
import DeleteReferral from 'src/components/pages/referrals/DeleteReferral'
import ReferralEditOnly from 'src/components/pages/referrals/ReferralEditOnly'
import UpdateReferral from 'src/components/pages/referrals/UpdateReferral'
import Paper from 'src/components/ui/Paper'
import Table from 'src/components/ui/Table'
import TableBody from 'src/components/ui/Table/TableBody'
import TableCell from 'src/components/ui/Table/TableCell'
import TableHead from 'src/components/ui/Table/TableHead'
import TableRow from 'src/components/ui/Table/TableRow'
import Typography from 'src/components/ui/Typograph'
import { IResponseReferrals } from 'src/type/referral'

function ReferralPage({ data }: { data: IResponseReferrals }) {
  return (
    <Paper className='p-4 m-4'>
      <div className='flex justify-between mb-2'>
        <Typography variant='h5' fontWeight='semibold'>
          Table Referral
        </Typography>
        <AddReferral />
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
              Code
            </TableCell>
            <TableCell head component='th' className='py-2'>
              Discounts
            </TableCell>
            <TableCell head component='th' className='py-2'>
              Member
            </TableCell>
            <TableCell head component='th' className='py-2'>
              Status
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
              <TableCell>{v.code}</TableCell>
              <TableCell>{v.type === 'percentage' ? `${v.discounts}%` : v.discounts}</TableCell>
              <TableCell>{v.member.name}</TableCell>
              <TableCell>{v.status}</TableCell>
              <TableCell className='text-right whitespace-nowrap'>
                {v.statusEdit ? (
                  <>
                    <UpdateReferral data={v} />
                    <DeleteReferral data={v} />
                  </>
                ) : (
                  <ReferralEditOnly data={v} />
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  )
}

export default ReferralPage
