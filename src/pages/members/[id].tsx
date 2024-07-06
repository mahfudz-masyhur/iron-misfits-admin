import { GetServerSideProps } from 'next'
import Image from 'next/image'
import React from 'react'
import { getMemberId, getTransactions } from 'server/api'
import Avatar from 'src/components/ui/Avatar'
import Paper from 'src/components/ui/Paper'
import Table from 'src/components/ui/Table'
import TableBody from 'src/components/ui/Table/TableBody'
import TableCell from 'src/components/ui/Table/TableCell'
import TableHead from 'src/components/ui/Table/TableHead'
import TableRow from 'src/components/ui/Table/TableRow'
import { formatDate, getURLParams } from 'src/components/utility/formats'
import { IResponseMember } from 'src/type/member'
import TransactionMember from 'src/components/pages/members/id/AddTransactionMember'
import { IResponseTransactions } from 'src/type/transaction'
import EditTransactionMember from 'src/components/pages/members/id/EditTransactionMember'

function MemberIdPage({ member: m, transaction: t }: { member: IResponseMember; transaction: IResponseTransactions }) {
  const member = m.data
  const transaction = t.data

  return (
    <>
      <Paper className='p-4 m-4'>
        <div className='flex gap-4'>
          <Avatar
            alt={member.name}
            src={member.avatar}
            ImageComponent={Image}
            width={160}
            height={220}
            variant='rounded'
            style={{
              minWidth: 160,
              maxWidth: 160,
              minHeight: 220,
              maxHeight: 220
            }}
          />
          <div className='flex-1'>
            <Table>
              <TableBody>
                <TableRow evenOdd='reverse'>
                  <TableCell>Name</TableCell>
                  <TableCell>:</TableCell>
                  <TableCell>{member.name}</TableCell>
                </TableRow>
                <TableRow evenOdd='reverse'>
                  <TableCell>handphone</TableCell>
                  <TableCell>:</TableCell>
                  <TableCell>{member.handphone}</TableCell>
                </TableRow>
                <TableRow evenOdd='reverse'>
                  <TableCell>registrationFee</TableCell>
                  <TableCell>:</TableCell>
                  <TableCell>{member.registrationFee}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </div>
      </Paper>
      <div className='mt-2 text-right mx-4'>
        <TransactionMember data={member} />
      </div>
      <Paper className='p-4 m-4'>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell head>No.</TableCell>
              <TableCell head>price</TableCell>
              <TableCell head>priceAfterdiscount</TableCell>
              <TableCell head>expired</TableCell>
              <TableCell head>status</TableCell>
              <TableCell head>status</TableCell>
              <TableCell head>promo</TableCell>
              <TableCell head>referral</TableCell>
              <TableCell head>action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {transaction.map((v, i) => (
              <TableRow hover evenOdd key={v._id}>
                <TableCell>{i + 1}.</TableCell>
                <TableCell>{v.price}</TableCell>
                <TableCell>{v.priceAfterdiscount}</TableCell>
                <TableCell>{formatDate(v.expired)}</TableCell>
                <TableCell>{v.status}</TableCell>
                <TableCell>{v.package.name}</TableCell>
                <TableCell>{v.promo?.name}</TableCell>
                <TableCell>{v.referral?.name}</TableCell>
                <TableCell>
                  <EditTransactionMember data={member} value={v} key={v._id} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </>
  )
}

export default MemberIdPage

export const getServerSideProps: GetServerSideProps = async ({ req, params }) => {
  try {
    const member = await getMemberId(`${params?.id}`, req)
    const transaction = await getTransactions(req, getURLParams({ member: params?.id }))
    return {
      props: { member, transaction }
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
