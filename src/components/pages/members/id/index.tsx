import Image from 'next/image'
import { IMember } from 'server/type/Member'
import { ITransaction } from 'server/type/Transaction'
import AddExtraTimeForTransactionMember from 'src/components/pages/members/id/AddExtraTimeForTransactionMember'
import AddTransactionMember from 'src/components/pages/members/id/AddTransactionMember'
import DeleteTransaction from 'src/components/pages/members/id/DeleteTransactionMember'
import EditStatusTransactionMember from 'src/components/pages/members/id/EditStatusTransactionMember'
import EditTransactionMember from 'src/components/pages/members/id/EditTransactionMember'
import Avatar from 'src/components/ui/Avatar'
import Paper from 'src/components/ui/Paper'
import Table from 'src/components/ui/Table'
import TableBody from 'src/components/ui/Table/TableBody'
import TableCell from 'src/components/ui/Table/TableCell'
import TableHead from 'src/components/ui/Table/TableHead'
import TableRow from 'src/components/ui/Table/TableRow'
import { formatDate, isWithinOneDay } from 'src/components/utility/formats'
import { GetTransactionsSWR } from 'src/context/swrHook'
import { IResponseMember } from 'src/type/member'
import { IResponseTransactions } from 'src/type/transaction'
import { KeyedMutator } from 'swr'
import DeleteMember from '../DeleteMember'
import UpdateMember from '../UpdateMember'

const MemberInfo = ({ member, mutateMember }: { member: IMember; mutateMember: KeyedMutator<IResponseMember> }) => {
  return (
    <Paper className='p-4 m-4'>
      <div className='flex flex-col sm:flex-row sm:items-center gap-4'>
        <Avatar
          alt={member.name}
          src={member.avatar}
          ImageComponent={Image}
          width={160}
          height={220}
          variant='rounded'
          className='self-center'
          style={{
            minWidth: 160,
            maxWidth: 160,
            minHeight: 220,
            maxHeight: 220
          }}
        />
        <div className='text-right flex-1'>
          <UpdateMember data={member} mutate={mutateMember as any} />{' '}
          <DeleteMember data={member} mutate={mutateMember as any} back />
          <div className='text-left'>
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
      </div>
    </Paper>
  )
}

const TableTransaction = ({
  member,
  transaction,
  mutateTransactions
}: {
  member: IMember
  transaction?: ITransaction[]
  mutateTransactions: KeyedMutator<IResponseTransactions>
}) => {
  const Body = () => {
    if (!transaction) {
      return (
        <TableRow>
          <TableCell colSpan={9}>loading ...</TableCell>
        </TableRow>
      )
    }

    return transaction.map((v, i) => {
      const cantEdit = isWithinOneDay(`${v.createdAt}`) || v.status === 'NOT-YEY-PAID'
      return (
        <TableRow hover evenOdd key={v._id}>
          <TableCell>{i + 1}.</TableCell>
          <TableCell>{v.paymentType}</TableCell>
          <TableCell>{v.price}</TableCell>
          <TableCell>{v.priceAfterdiscount}</TableCell>
          <TableCell>{formatDate(v.expired)}</TableCell>
          <TableCell>{v.status}</TableCell>
          <TableCell>{v.package?.name}</TableCell>
          <TableCell>{v.promo?.name}</TableCell>
          <TableCell>{v.referral?.name}</TableCell>
          <TableCell className='whitespace-nowrap'>
            <AddExtraTimeForTransactionMember data={member} transaction={v} key={v._id} mutate={mutateTransactions} />
            {cantEdit ? (
              <>
                <EditTransactionMember data={member} value={v} key={v._id} mutate={mutateTransactions} />
                <DeleteTransaction data={v} key={v._id} mutate={mutateTransactions} />
              </>
            ) : (
              <EditStatusTransactionMember value={v} key={v._id} mutate={mutateTransactions} />
            )}
          </TableCell>
        </TableRow>
      )
    })
  }

  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell head>No.</TableCell>
          <TableCell head>paymentType</TableCell>
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
        <Body />
      </TableBody>
    </Table>
  )
}

interface Props {
  id: string
  member: IResponseMember
  mutateMember: KeyedMutator<IResponseMember>
}

function MemberIdPage({ id, member: m, mutateMember }: Props) {
  const member = m.data
  const { data: t, mutate: mutateTransactions } = GetTransactionsSWR(id)
  const transaction = t?.data

  return (
    <>
      <MemberInfo member={member} mutateMember={mutateMember} />
      <div className='mt-2 text-right mx-4'>
        <AddTransactionMember data={member} mutate={mutateTransactions} />
      </div>
      <Paper className='p-4 m-4'>
        <TableTransaction member={member} transaction={transaction} mutateTransactions={mutateTransactions} />
      </Paper>
    </>
  )
}

export default MemberIdPage
