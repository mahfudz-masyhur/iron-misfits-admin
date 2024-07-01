import { GetServerSideProps } from 'next'
import { getPackages } from 'server/api'
import AddPackage from 'src/components/pages/packages/AddPackage'
import DeletePackage from 'src/components/pages/packages/DeletePackage'
import UpdatePackage from 'src/components/pages/packages/UpdatePackage'
import Paper from 'src/components/ui/Paper'
import Table from 'src/components/ui/Table'
import TableBody from 'src/components/ui/Table/TableBody'
import TableCell from 'src/components/ui/Table/TableCell'
import TableHead from 'src/components/ui/Table/TableHead'
import TableRow from 'src/components/ui/Table/TableRow'
import Typography from 'src/components/ui/Typograph'
import { getURLParams, priceFormatter } from 'src/components/utility/formats'
import { IResponsePackages } from 'src/type/package'

function PackagePage({ data }: { data: IResponsePackages }) {
  return (
    <Paper className='p-4 m-4'>
      <div className='flex justify-between mb-2'>
        <Typography variant='h5' fontWeight='semibold'>
          Table Package
        </Typography>
        <AddPackage />
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
              Package Type
            </TableCell>
            <TableCell head component='th' className='py-2'>
              Price
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
              <TableCell>{v.packageType}</TableCell>
              <TableCell className='text-center whitespace-nowrap'>{priceFormatter(v.price)}</TableCell>
              <TableCell className='text-right whitespace-nowrap'>
                <UpdatePackage data={v} />
                <DeletePackage data={v} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  )
}

export default PackagePage

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  try {
    const data = await getPackages(req)
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
