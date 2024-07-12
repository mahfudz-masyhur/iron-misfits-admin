import { Dispatch, SetStateAction } from 'react'
import { IMember } from 'server/type/Member'
import { IReferral } from 'server/type/Referral'
import { ITransaction } from 'server/type/Transaction'
import Accordion from 'src/components/ui/Accordion'
import AccordionItem from 'src/components/ui/Accordion/AccordionItem'
import Select from 'src/components/ui/Select'
import Option from 'src/components/ui/Select/Option'
import TextField from 'src/components/ui/TextField'
import { TYPE } from 'src/constant'
import { PendingRecordInput } from 'src/type/transaction'
import AddForm from './AddForm'
import EditForm from './EditForm'
import { isWithinOneDay } from 'src/components/utility/formats'

export interface AddExtraTimeForTransactionMemberFormProps {
  setStopClose: Dispatch<SetStateAction<boolean>>
  referralBA: IReferral
  member: IMember
  transaction: ITransaction
  handleClose: () => void | null
}

function AddExtraTimeForTransactionMemberForm(props: AddExtraTimeForTransactionMemberFormProps) {
  const { transaction } = props
  return (
    <>
      <div className='grid flex-grow grid-cols-6 px-4 gap-2'>
        <div className='col-span-6'>
          <TextField label='Status' value={transaction.status} fullWidth readOnly margin='normal' />
          <TextField label='Expired' value={`${new Date(transaction.expired)}`} fullWidth readOnly margin='normal' />
        </div>
        <Accordion>
          <AccordionItem title='Add' classNames={{ root: 'col-span-6 border rounded-md px-4 py-1' }}>
            <AddForm {...props} />
          </AccordionItem>
          {transaction.pending.map((v, i) => {
            if (isWithinOneDay(`${v.createdAt}`) && i === 0)
              return (
                <AccordionItem
                  title={
                    <span className='font-semibold'>
                      {v.type} <span className='text-success-main font-normal'>can edit</span>
                    </span>
                  }
                  classNames={{ root: 'col-span-6 border rounded-md px-4 py-1' }}
                  key={v._id}
                >
                  <EditForm value={v} nextPending={transaction.pending[i + 1]} {...props} key={v._id} />
                </AccordionItem>
              )
            return (
              <AccordionItem
                title={
                  <span className='font-semibold'>
                    {v.type} <span className='text-error-main font-normal'>cant edit</span>
                  </span>
                }
                key={v._id}
                classNames={{ root: 'col-span-6 border rounded-md px-4 py-1' }}
              >
                <Select label='type' fullWidth margin='dense' readOnly value={v.type}>
                  {TYPE.map(v => (
                    <Option value={v} key={v}>
                      {v}
                    </Option>
                  ))}
                </Select>
                <TextField label='howMuchDays' type='number' fullWidth margin='dense' readOnly value={v.howMuchDays} />
                <TextField
                  label='expiredBefore'
                  fullWidth
                  margin='dense'
                  readOnly
                  value={`${new Date(v.expiredBefore)}`}
                />
                <TextField label='expiredThen' fullWidth margin='dense' readOnly value={`${new Date(v.expiredThen)}`} />
                <TextField label='description' fullWidth margin='dense' multiline readOnly />
              </AccordionItem>
            )
          })}
        </Accordion>
      </div>
    </>
  )
}

export default AddExtraTimeForTransactionMemberForm
