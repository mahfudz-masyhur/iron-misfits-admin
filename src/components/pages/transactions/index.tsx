import React from 'react'
import RefreshButton from 'src/components/ReuseableComponent/RefreshButton'
import Paper from 'src/components/ui/Paper'
import Table from 'src/components/ui/Table'
import TableBody from 'src/components/ui/Table/TableBody'
import TableCell from 'src/components/ui/Table/TableCell'
import TableHead from 'src/components/ui/Table/TableHead'
import TableRow from 'src/components/ui/Table/TableRow'
import Typography from 'src/components/ui/Typograph'
import { formatDateToHour } from 'src/components/utility/formats'
import { IResponseTransactions } from 'src/type/transaction'
import FilterTransactions from './FilterTransactions'

interface TransactionsPageProps {
  data: IResponseTransactions
}

function TransactionsPage({ data }: TransactionsPageProps) {
  const transactions = data.data

  return (
    <Paper className='p-4 m-4'>
      <div className='flex flex-col sm:flex-row justify-between mb-2'>
        <Typography variant='h5' fontWeight='semibold'>
          Table Transaction
        </Typography>
        <div className='text-right whitespace-nowrap'>
          <RefreshButton />
          <FilterTransactions />
        </div>
      </div>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell head component='th' className='py-2 text-left w-10'>
              No.
            </TableCell>
            <TableCell head component='th' className='py-2 text-left'>
              Payment Type
            </TableCell>
            <TableCell head component='th' className='py-2 text-left'>
              Member
            </TableCell>
            <TableCell head component='th' className='py-2'>
              Price
            </TableCell>
            <TableCell head component='th' className='py-2'>
              Price after discount
            </TableCell>
            <TableCell head component='th' className='py-2'>
              Created At
            </TableCell>
            <TableCell head component='th' className='py-2'>
              Expired At
            </TableCell>
            <TableCell head component='th' className='py-2'>
              Status
            </TableCell>
            <TableCell head component='th' className='py-2'>
              Promo
            </TableCell>
            <TableCell head component='th' className='py-2'>
              Referral
            </TableCell>
            <TableCell head component='th' className='py-2 text-right'>
              Action
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {transactions.map((v, i) => (
            <TableRow key={v._id}>
              <TableCell className='py-2 text-left w-10'>{i + 1}</TableCell>
              <TableCell className='py-2 text-left'>{v.paymentType}</TableCell>
              <TableCell className='py-2 text-left'>{v.member.name}</TableCell>
              <TableCell className='py-2'>{v.price}</TableCell>
              <TableCell className='py-2'>{v.priceAfterdiscount}</TableCell>
              <TableCell className='py-2 whitespace-nowrap'>{formatDateToHour(v.createdAt)}</TableCell>
              <TableCell className='py-2 whitespace-nowrap'>{formatDateToHour(v.expired)}</TableCell>
              <TableCell className='py-2'>{v.status}</TableCell>
              <TableCell className='py-2'>
                {v.promo?.name} {v.promo?.type === 'percentage' ? `${v.promo?.discounts}%` : v.promo?.discounts}
              </TableCell>
              <TableCell className='py-2'>
                {v.referral?.name}{' '}
                {v.referral?.type === 'percentage' ? `${v.referral?.discounts}%` : v.referral?.discounts}
              </TableCell>
              <TableCell className='py-2 text-right'></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  )
}

export default TransactionsPage
