import { Field, FieldProps, Form, Formik, FormikErrors, FormikHelpers } from 'formik'
import { addOrUpdateExtraTimeTransaction } from 'server/api'
import Button from 'src/components/ui/Button'
import Select from 'src/components/ui/Select'
import Option from 'src/components/ui/Select/Option'
import TextField from 'src/components/ui/TextField'
import { toastError } from 'src/components/utility/formats'
import { TYPE } from 'src/constant'
import { PendingRecordInput } from 'src/type/transaction'
import { AddExtraTimeForTransactionMemberFormProps } from '.'

function AddForm(props: AddExtraTimeForTransactionMemberFormProps) {
  const { handleClose, setStopClose, transaction, mutate } = props

  const initialValues: PendingRecordInput = {
    status: 'PENDING',
    expired: new Date(transaction.expired),
    pending: {
      _id: '',
      type: 'PENDING',
      howMuchDays: '',
      expiredBefore: new Date(transaction.expired),
      expiredThen: new Date(transaction.expired),
      statusEdit: true,
      description: ''
    },
    updatedAt: transaction?.updatedAt
  }

  const validate = (values: PendingRecordInput) => {
    const errors: FormikErrors<PendingRecordInput> = {}
    // if (!values.status) errors.status = 'Diperlukan!'

    return errors
  }

  const onSubmit = async (values: PendingRecordInput, formikHelpers: FormikHelpers<PendingRecordInput>) => {
    try {
      setStopClose(true)
      await addOrUpdateExtraTimeTransaction(transaction._id, values)
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
      {({ dirty, isSubmitting, values }) => {
        const lastPending = transaction.pending[0] || values.pending
        return (
          <Form id='form-extra-time-transaction'>
            <div className='col-span-6 py-1'>
              <Field name={`pending.type`}>
                {({ field, form, meta }: FieldProps) => {
                  const onChange = (e: any) => {
                    const status = e.target.value as 'PENDING' | 'CANCLE-PENDING'
                    form.setFieldValue('status', status === 'PENDING' ? 'PENDING' : 'ACTIVE')
                    const numberDays = Number(lastPending.howMuchDays)
                    const lastPendingUpdatedAt = lastPending.updatedAt
                    const expiredBefore = new Date(form.values.pending.expiredBefore)

                    const today = new Date()
                    const expiredDate = new Date(`${lastPendingUpdatedAt}`)
                    const timeDifference = today.getTime() - expiredDate.getTime()
                    const daysDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24))
                    const days = numberDays - daysDifference

                    const date = new Date(expiredBefore.getTime())

                    form.setFieldValue('pending.howMuchDays', days)
                    if (status === 'CANCLE-PENDING') date.setDate(date.getDate() - days)
                    else date.setDate(date.getDate() + days)

                    if (!isNaN(date.getTime())) {
                      const expiredThen = date.toISOString()
                      form.setFieldValue('expired', new Date(expiredThen))
                      form.setFieldValue('pending.expiredThen', new Date(expiredThen))
                    }
                    field.onChange(e)
                  }

                  return (
                    <Select
                      label='type'
                      fullWidth
                      margin='dense'
                      {...field}
                      onChange={onChange}
                      error={Boolean(meta.error && meta.touched)}
                      helperText={meta.error && meta.touched && String(meta.error)}
                    >
                      {TYPE.map(v => (
                        <Option value={v} key={v}>
                          {v}
                        </Option>
                      ))}
                    </Select>
                  )
                }}
              </Field>
              <Field name={`pending.howMuchDays`}>
                {({ field, form, meta }: FieldProps) => {
                  const onChange = (e: any) => {
                    const numberDays = Number(e.target.value)
                    const expiredBefore = new Date(values.pending.expiredBefore)
                    const date = new Date(expiredBefore.getTime())

                    if (values.pending.type === 'PENDING') date.setDate(date.getDate() + numberDays)
                    else date.setDate(date.getDate() - numberDays)

                    if (!isNaN(date.getTime())) {
                      const expiredThen = date.toISOString()
                      form.setFieldValue('expired', new Date(expiredThen))
                      form.setFieldValue('pending.expiredThen', new Date(expiredThen))
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
              <Field name={`pending.expiredBefore`}>
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
              <Field name={`pending.expiredThen`}>
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
              <Field name={`pending.description`}>
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
              <Button type='button' variant='outlined' color='error' disabled={isSubmitting} onClick={handleClose}>
                Cancle
              </Button>{' '}
              <Button
                type='reset'
                form='form-extra-time-transaction'
                variant='outlined'
                color='warning'
                disabled={isSubmitting || !dirty}
              >
                Reset
              </Button>{' '}
              <Button
                type='submit'
                form='form-extra-time-transaction'
                loading={isSubmitting}
                disabled={isSubmitting || !dirty}
              >
                Submit
              </Button>
            </div>
          </Form>
        )
      }}
    </Formik>
  )
}

export default AddForm
