import { ErrorMessage, Field, FieldArray, FieldProps, Form, Formik, FormikErrors, FormikHelpers } from 'formik'
import { useRouter } from 'next/router'
import React, { Dispatch, SetStateAction } from 'react'
import { IMember } from 'server/type/Member'
import { IReferral } from 'server/type/Referral'
import { IPendingRecord, ITransaction } from 'server/type/Transaction'
import Button from 'src/components/ui/Button'
import IconPlus from 'src/components/ui/Icon/IconPlus'
import IconButton from 'src/components/ui/IconButton'
import Select from 'src/components/ui/Select'
import Option from 'src/components/ui/Select/Option'
import TextField from 'src/components/ui/TextField'
import { toastError } from 'src/components/utility/formats'
import { TYPE } from 'src/constant'

interface IInitialValues {
  status: 'PENDING' | 'ACTIVE' | 'INACTIVE'
  pending: IPendingRecord
}

interface Props {
  setStopClose: Dispatch<SetStateAction<boolean>>
  referralBA: IReferral
  member: IMember
  transaction: ITransaction
  value?: IInitialValues
  handleClose: () => void | null
}
function AddExtraTimeForTransactionMemberForm(props: Props) {
  const { handleClose, member, value, referralBA, setStopClose, transaction } = props
  const router = useRouter()

  const initialValues: IInitialValues = {
    status: value?.status || 'PENDING',
    pending: {
      _id: value?.pending.type || '',
      type: value?.pending.type || 'PENDING',
      howMuchDays: value?.pending.howMuchDays || 0,
      expiredBefore: value?.pending.expiredBefore || new Date(transaction.expired),
      expiredThen: value?.pending.expiredThen || new Date(),
      statusEdit: value?.pending.statusEdit || true,
      description: value?.pending.description || '',
      updatedAt: value?.pending.updatedAt
    }
  }

  const validate = (values: IInitialValues) => {
    const errors: FormikErrors<IInitialValues> = {}
    // if (!values.status) errors.status = 'Diperlukan!'

    return errors
  }

  const onSubmit = async (values: IInitialValues, formikHelpers: FormikHelpers<IInitialValues>) => {
    try {
      setStopClose(true)
      await console.log(values)
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
      {({ values, dirty, isSubmitting }) => (
        <Form className='grid flex-grow grid-cols-6 px-4 pb-4 gap-4'>
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
          </div>
          <div className='col-span-6 border rounded-md px-4 py-1'>
            <Field name={`pending.type`}>
              {({ field, form, meta }: FieldProps) => {
                const onChange = (e: any) => {
                  const status = e.target.value as 'PENDING' | 'CANCLE-PENDING'
                  form.setFieldValue('status', status === 'PENDING' ? 'PENDING' : 'ACTIVE')
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
                  const expiredBefore = new Date(form.values.pending.expiredBefore)
                  const date = new Date(expiredBefore.getTime())
                  date.setDate(date.getDate() + numberDays)

                  if (!isNaN(date.getTime())) {
                    const expiredThen = date.toISOString()
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
          {transaction.pending.map(v => (
            <div className='col-span-6 border rounded-md px-4 py-1' key={v._id}>
              <Field name={`pending.type`}>
                {({ field, form, meta }: FieldProps) => {
                  const onChange = (e: any) => {
                    const status = e.target.value as 'PENDING' | 'CANCLE-PENDING'
                    form.setFieldValue('status', status === 'PENDING' ? 'PENDING' : 'ACTIVE')
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
                    const expiredBefore = new Date(form.values.pending.expiredBefore)
                    const date = new Date(expiredBefore.getTime())
                    date.setDate(date.getDate() + numberDays)

                    if (!isNaN(date.getTime())) {
                      const expiredThen = date.toISOString()
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
          ))}
          <div className='col-span-6 text-right mt-2'>
            <Button type='button' variant='outlined' color='error' disabled={isSubmitting} onClick={handleClose}>
              Cancle
            </Button>{' '}
            <Button type='reset' variant='outlined' color='warning' disabled={isSubmitting || !dirty}>
              Reset
            </Button>{' '}
            <Button type='submit' loading={isSubmitting} disabled={isSubmitting || !dirty}>
              Submit
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  )
}

export default AddExtraTimeForTransactionMemberForm
