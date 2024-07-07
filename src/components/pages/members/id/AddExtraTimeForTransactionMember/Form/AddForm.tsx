import { Field, FieldProps, Form, Formik, FormikErrors, FormikHelpers } from 'formik'
import { useRouter } from 'next/router'
import { addOrUpdateExtraTimeTransaction } from 'server/api'
import Button from 'src/components/ui/Button'
import Divider from 'src/components/ui/Divider'
import Select from 'src/components/ui/Select'
import Option from 'src/components/ui/Select/Option'
import TextField from 'src/components/ui/TextField'
import { toastError } from 'src/components/utility/formats'
import { TYPE } from 'src/constant'
import { PendingRecordInput } from 'src/type/transaction'
import { AddExtraTimeForTransactionMemberFormProps } from '.'

function AddForm(props: AddExtraTimeForTransactionMemberFormProps) {
  const { handleClose, member, referralBA, setStopClose, transaction } = props
  const router = useRouter()

  const initialValues: PendingRecordInput = {
    status: 'PENDING',
    expired: new Date(transaction.expired),
    pending: {
      _id: '',
      type: 'PENDING',
      howMuchDays: 0,
      expiredBefore: new Date(transaction.expired),
      expiredThen: new Date(),
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
      await router.push(router.asPath)
      handleClose()
    } catch (error: any) {
      toastError(error)
      setStopClose(false)
    }
  }

  return (
    <Formik initialValues={initialValues} validate={validate} onSubmit={onSubmit}>
      {({ dirty, isSubmitting }) => {
        const lastPending = transaction.pending[0]
        return (
          <>
            <Form id='form-extra-time-transaction'>
              <div className='col-span-6'>
                <Field name={`status`}>
                  {({ field, meta, form }: FieldProps) => {
                    return (
                      <TextField
                        label='Status'
                        fullWidth
                        readOnly
                        margin='normal'
                        {...field}
                        error={Boolean(meta.error && meta.touched)}
                        helperText={meta.error && meta.touched && String(meta.error)}
                      />
                    )
                  }}
                </Field>
                <Field name={`expired`}>
                  {({ field, meta, form }: FieldProps) => (
                    <TextField
                      label='Expired'
                      fullWidth
                      readOnly
                      margin='normal'
                      {...field}
                      error={Boolean(meta.error && meta.touched)}
                      helperText={meta.error && meta.touched && String(meta.error)}
                    />
                  )}
                </Field>
              </div>
              <Divider />
              <div className='col-span-6 px-4 py-1'>
                <Field name={`pending.type`}>
                  {({ field, form, meta }: FieldProps) => {
                    const onChange = (e: any) => {
                      const status = e.target.value as 'PENDING' | 'CANCLE-PENDING'
                      form.setFieldValue('status', status === 'PENDING' ? 'PENDING' : 'ACTIVE')
                      form.setFieldValue('pending.howMuchDays', lastPending.howMuchDays)
                      const numberDays = Number(lastPending.howMuchDays)
                      const expiredBefore = new Date(form.values.pending.expiredBefore)
                      const date = new Date(expiredBefore.getTime())

                      date.setDate(date.getDate() - numberDays)

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
                    return (
                      <TextField
                        label='howMuchDays'
                        type='number'
                        fullWidth
                        margin='dense'
                        readOnly
                        {...field}
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
          </>
        )
      }}
    </Formik>
  )
}

export default AddForm
