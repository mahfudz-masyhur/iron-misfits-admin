import AddPromo from 'src/components/pages/promos/AddPromo'
import DeletePromo from 'src/components/pages/promos/DeletePromo'
import PromoEditOnly from 'src/components/pages/promos/PromoEditOnly'
import UpdatePromo from 'src/components/pages/promos/UpdatePromo'
import Paper from 'src/components/ui/Paper'
import Table from 'src/components/ui/Table'
import TableBody from 'src/components/ui/Table/TableBody'
import TableCell from 'src/components/ui/Table/TableCell'
import TableHead from 'src/components/ui/Table/TableHead'
import TableRow from 'src/components/ui/Table/TableRow'
import Typography from 'src/components/ui/Typograph'
import { IResponsePromos } from 'src/type/promo'

function PromosPage({ data }: { data: IResponsePromos }) {
  return (
    <Paper className='p-4 m-4'>
      <div className='flex justify-between mb-2'>
        <Typography variant='h5' fontWeight='semibold'>
          Table Promo
        </Typography>
        <AddPromo />
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
            <TableCell head component='th' className='py-2'>
              Discounts
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
            <TableRow hover key={v._id}>
              <TableCell>{i + 1}.</TableCell>
              <TableCell>{v.name}</TableCell>
              <TableCell>{v.type === 'percentage' ? `${v.discounts}%` : v.discounts}</TableCell>
              <TableCell>{v.status}</TableCell>
              <TableCell className='text-right whitespace-nowrap'>
                {v.statusEdit ? (
                  <>
                    <UpdatePromo data={v} key={v._id} />
                    <DeletePromo data={v} key={v._id} />
                  </>
                ) : (
                  <PromoEditOnly data={v} key={v._id} />
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  )
}

export default PromosPage
