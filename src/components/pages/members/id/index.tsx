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
import { GetMembersIdSWR, GetTransactionsSWR } from 'src/context/swrHook'
import { IResponseTransactions } from 'src/type/transaction'
import { KeyedMutator } from 'swr'


const MemberInfo = ({ member }: { member: IMember | undefined }) => {
  if (!member) return <>loading...</>
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
  )
}

const TableTransaction = ({member,transaction, mutateTransactions}:{member?: IMember; transaction?: ITransaction[]; mutateTransactions: KeyedMutator<IResponseTransactions>}) => {
  if (!transaction) return <>loading ...</>
  return (
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
        {transaction.map((v, i) => {
          const cantEdit = isWithinOneDay(`${v.createdAt}`)
          return (
            <TableRow hover evenOdd key={v._id}>
              <TableCell>{i + 1}.</TableCell>
              <TableCell>{v.price}</TableCell>
              <TableCell>{v.priceAfterdiscount}</TableCell>
              <TableCell>{formatDate(v.expired)}</TableCell>
              <TableCell>{v.status}</TableCell>
              <TableCell>{v.package.name}</TableCell>
              <TableCell>{v.promo?.name}</TableCell>
              <TableCell>{v.referral?.name}</TableCell>
              <TableCell className='whitespace-nowrap'>
                <AddExtraTimeForTransactionMember data={member} transaction={v} key={v._id} />
                {cantEdit ? (
                  <>
                    <EditTransactionMember
                      mutate={mutateTransactions}
                      data={member}
                      value={v}
                      key={v._id}
                    />
                    <DeleteTransaction mutate={mutateTransactions} data={v} key={v._id} />
                  </>
                ) : (
                  <EditStatusTransactionMember value={v} key={v._id} />
                )}
              </TableCell>
            </TableRow>
          )
        })}
      </TableBody>
    </Table>
  )
}

function MemberIdPage() {
  const { data: m, mutate: mutateMember } = GetMembersIdSWR()
  const { data: t, mutate: mutateTransactions } = GetTransactionsSWR()
  const member = m?.data
  const transaction = t?.data

  return (
    <>
      <MemberInfo member={member} />
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
