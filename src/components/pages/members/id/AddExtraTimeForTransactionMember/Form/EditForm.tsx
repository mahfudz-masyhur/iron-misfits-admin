import { Field, FieldProps, Form, Formik, FormikErrors, FormikHelpers } from 'formik'
import { useRouter } from 'next/router'
import { Dispatch, SetStateAction } from 'react'
import { addOrUpdateExtraTimeTransaction } from 'server/api'
import { IMember } from 'server/type/Member'
import { IPendingRecord, ITransaction } from 'server/type/Transaction'
import Button from 'src/components/ui/Button'
import Select from 'src/components/ui/Select'
import Option from 'src/components/ui/Select/Option'
import TextField from 'src/components/ui/TextField'
import { toastError } from 'src/components/utility/formats'
import { TYPE } from 'src/constant'
import { IResponseTransactions, PendingRecordInput } from 'src/type/transaction'
import { KeyedMutator } from 'swr'
import DeleteExtraTime from './DeleteExtraTime'

interface EditFormProps {
  setStopClose: Dispatch<SetStateAction<boolean>>
  member: IMember
  transaction: ITransaction
  value: IPendingRecord
  nextPending: IPendingRecord
  handleClose: () => void | null
  mutate: KeyedMutator<IResponseTransactions>
}

function EditForm(props: EditFormProps) {
  const { handleClose, member, value, nextPending, setStopClose, transaction, mutate } = props
  const canEdit = value.statusEdit && value.type === 'PENDING'
  const router = useRouter()

  const initialValues: IPendingRecord = {
    _id: value?._id || '',
    type: value?.type || 'PENDING',
    howMuchDays: value?.howMuchDays || 0,
    expiredBefore: new Date(value?.expiredBefore || transaction.expired),
    expiredThen: new Date(value?.expiredThen || value?.expiredBefore || transaction.expired),
    statusEdit: value?.statusEdit || true,
    description: value?.description || '',
    createdAt: value?.createdAt,
    updatedAt: value?.updatedAt
  }

  const validate = (values: IPendingRecord) => {
    const errors: FormikErrors<IPendingRecord> = {}
    // if (!values.status) errors.status = 'Diperlukan!'

    return errors
  }

  const onSubmit = async (values: IPendingRecord, formikHelpers: FormikHelpers<IPendingRecord>) => {
    try {
      setStopClose(true)
      const body: PendingRecordInput = {
        status: transaction.status,
        updatedAt: transaction.updatedAt,
        expired: transaction.expired,
        pending: values
      }
      await addOrUpdateExtraTimeTransaction(transaction._id, body, { pendingId: values._id })
      setStopClose(false)
      await mutate()
      handleClose()
    } catch (error: any) {
      toastError(error)
      setStopClose(false)
    }
  }

  return (
    <Formik initialValues={initialValues} validate={validate} onSubmit={onSubmit}>
      {({ dirty, isSubmitting, values }) => (
        <>
          <Form id='form-edit-extra-time-transaction'>
            <div className='col-span-6'>
              <Field name={`type`}>
                {({ field, form, meta }: FieldProps) => (
                  <Select
                    label='type'
                    fullWidth
                    margin='dense'
                    disabled
                    {...field}
                    error={Boolean(meta.error && meta.touched)}
                    helperText={meta.error && meta.touched && String(meta.error)}
                  >
                    {TYPE.map(v => (
                      <Option value={v} key={v}>
                        {v}
                      </Option>
                    ))}
                  </Select>
                )}
              </Field>
              <Field name={`howMuchDays`}>
                {({ field, form, meta }: FieldProps) => {
                  const onChange = (e: any) => {
                    const numberDays = Number(e.target.value)
                    const expiredBefore = new Date(form.values.expiredBefore)
                    const date = new Date(expiredBefore.getTime())

                    if (values.type === 'PENDING') date.setDate(date.getDate() + numberDays)
                    else date.setDate(date.getDate() - numberDays)

                    if (!isNaN(date.getTime())) {
                      const expiredThen = date.toISOString()
                      form.setFieldValue('expiredThen', new Date(expiredThen))
                    }
                    field.onChange(e)
                  }

                  return (
                    <TextField
                      label='howMuchDays'
                      type='number'
                      fullWidth
                      margin='dense'
                      {...field}
                      onChange={onChange}
                      error={Boolean(meta.error && meta.touched)}
                      helperText={meta.error && meta.touched && String(meta.error)}
                    />
                  )
                }}
              </Field>
              <Field name={`expiredBefore`}>
                {({ field, meta }: FieldProps) => (
                  <TextField
                    label='expiredBefore'
                    fullWidth
                    margin='dense'
                    readOnly
                    {...field}
                    error={Boolean(meta.error && meta.touched)}
                    helperText={meta.error && meta.touched && String(meta.error)}
                  />
                )}
              </Field>
              <Field name={`expiredThen`}>
                {({ field, meta }: FieldProps) => (
                  <TextField
                    label='expiredThen'
                    fullWidth
                    margin='dense'
                    readOnly
                    {...field}
                    error={Boolean(meta.error && meta.touched)}
                    helperText={meta.error && meta.touched && String(meta.error)}
                  />
                )}
              </Field>
              <Field name={`description`}>
                {({ field, meta }: FieldProps) => (
                  <TextField
                    label='description'
                    fullWidth
                    margin='dense'
                    multiline
                    {...field}
                    error={Boolean(meta.error && meta.touched)}
                    helperText={meta.error && meta.touched && String(meta.error)}
                  />
                )}
              </Field>
            </div>
            <div className='col-span-6 text-right'>
              <DeleteExtraTime
                mutate={mutate}
                transaction={transaction}
                pendingId={values._id}
                nextPendingId={nextPending?._id}
              />{' '}
              <Button
                type='reset'
                form='form-edit-extra-time-transaction'
                variant='outlined'
                color='warning'
                disabled={isSubmitting || !dirty}
              >
                Reset
              </Button>{' '}
              <Button
                type='submit'
                form='form-edit-extra-time-transaction'
                loading={isSubmitting}
                disabled={isSubmitting || !dirty}
              >
                Submit
              </Button>
            </div>
          </Form>
        </>
      )}
    </Formik>
  )
}

export default EditForm
