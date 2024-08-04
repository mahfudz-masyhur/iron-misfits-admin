import { Field, FieldProps, Form, Formik, FormikHelpers } from 'formik'
import { useRouter } from 'next/router'
import { Dispatch, SetStateAction, SyntheticEvent, useState } from 'react'
import ReactDatePicker from 'react-datepicker'
import { fetcherClient } from 'server/api'
import { IPackage } from 'server/type/Package'
import { IPromo } from 'server/type/Promo'
import { IReferral } from 'server/type/Referral'
import Autocomplete from 'src/components/ui/Autocomplete'
import Button from 'src/components/ui/Button'
import Dialog from 'src/components/ui/Dialog'
import IconDots from 'src/components/ui/Icon/IconDots'
import IconButton from 'src/components/ui/IconButton'
import Select from 'src/components/ui/Select'
import Option from 'src/components/ui/Select/Option'
import Skeleton from 'src/components/ui/Skeleton'
import TextField from 'src/components/ui/TextField'
import { removeEmptyStringProperties, removeUndefinedProperties, sortPackages } from 'src/components/utility/formats'
import { STATUS } from 'src/constant'
import { IResponsePackages } from 'src/type/package'
import { IResponsePromos } from 'src/type/promo'
import { IResponseReferrals } from 'src/type/referral'
import { QueryListTransactionProps } from 'src/type/transaction'
import useSWR from 'swr'

interface FormikFormProps {
  handleClose: () => void | null
  setStopClose: Dispatch<SetStateAction<boolean>>
}

const FieldPackage = ({ field, meta, form }: FieldProps) => {
  const { data } = useSWR<IResponsePackages>('/api/package', fetcherClient)
  const setFieldValue = (v: IPackage) => {
    form.setFieldValue(field.name, v._id)
  }
  if (!(data && data?.data)) return <Skeleton height={40} width='100%' variant='rounded' className='my-4' />
  const value = data.data.find(f => f._id === field.value)

  return (
    <Autocomplete
      notFetching
      field={value}
      label='Package'
      margin='normal'
      setFieldValue={setFieldValue}
      options={sortPackages(data.data)}
      getOption={(option: IPackage) => ({
        _id: option?._id,
        name: option?.name,
        packageType: option?.packageType,
        price: option?.price,
        status: option?.status
      })}
      fullWidth
      isClearable
      renderOption={(option: IPackage, props) => (
        <li {...props} key={props.key}>
          {option?.name}
        </li>
      )}
      error={Boolean(meta.error && meta.touched)}
      helperText={meta.error && meta.touched && String(meta.error)}
    />
  )
}

const FieldPromo = ({ field, meta, form }: FieldProps) => {
  const { data } = useSWR<IResponsePromos>('/api/promo', fetcherClient)
  const setFieldValue = (v: IPromo) => {
    form.setFieldValue(field.name, v._id)
  }
  if (!(data && data?.data)) return <Skeleton height={40} width='100%' variant='rounded' className='my-4' />
  const value = data.data.find(f => f._id === field.value)

  return (
    <Autocomplete
      notFetching
      field={value}
      label='Promo'
      margin='normal'
      setFieldValue={setFieldValue}
      options={data?.data || []}
      getOption={(option: IPromo) => ({
        _id: option?._id,
        name: option?.name,
        status: option?.status,
        discounts: option?.discounts,
        type: option?.type,
        startDate: option?.startDate,
        endDate: option?.endDate
      })}
      fullWidth
      isClearable
      renderOption={(option: IPromo, props) => (
        <li {...props} key={props.key}>
          {option?.name}
        </li>
      )}
      error={Boolean(meta.error && meta.touched)}
      helperText={meta.error && meta.touched && String(meta.error)}
    />
  )
}

const FieldReferral = ({ field, meta, form }: FieldProps) => {
  const { data } = useSWR<IResponseReferrals>('/api/referral', fetcherClient)
  const setFieldValue = (v: IReferral) => {
    form.setFieldValue(field.name, v._id)
  }
  if (!(data && data?.data)) return <Skeleton height={40} width='100%' variant='rounded' className='my-4' />
  const value = data.data.find(f => f._id === field.value)

  return (
    <Autocomplete
      notFetching
      field={value}
      label='Referral'
      margin='normal'
      setFieldValue={setFieldValue}
      options={data?.data || []}
      getOption={(option: IReferral) => ({
        _id: option?._id,
        name: option?.name,
        status: option?.status,
        discounts: option?.discounts,
        type: option?.type
      })}
      fullWidth
      isClearable
      renderOption={(option: IReferral, props) => (
        <li {...props} key={props.key}>
          {option?.name}
        </li>
      )}
      error={Boolean(meta.error && meta.touched)}
      helperText={meta.error && meta.touched && String(meta.error)}
    />
  )
}

const FieldDate = (props: FieldProps & { label: string }) => {
  const { field, form, meta, label } = props

  const onChange = (date: Date | null, event: SyntheticEvent<any, Event> | undefined) => {
    form.setFieldValue(field.name, date?.toISOString() || null)
  }

  return (
    <ReactDatePicker
      selected={field.value}
      onChange={onChange}
      onBlur={field.onBlur}
      customInput={
        <TextField
          label={label || 'Date'}
          margin='normal'
          autoComplete='off'
          fullWidth
          error={Boolean(meta.error && meta.touched)}
          helperText={meta.error && meta.touched && String(meta.error)}
        />
      }
    />
  )
}

function FormikForm({ handleClose, setStopClose }: FormikFormProps) {
  const router = useRouter()

  const query = router.query as QueryListTransactionProps

  const initialValues: QueryListTransactionProps = {
    packageType: query?.packageType ? query?.packageType : undefined,
    referral: query?.referral ? query?.referral : undefined,
    promo: query?.promo ? query?.promo : undefined,
    status: query?.status ? query?.status : undefined,
    createdAtStartDate: query?.createdAtStartDate ? query?.createdAtStartDate : undefined,
    createdAtEndDate: query?.createdAtEndDate ? query?.createdAtEndDate : undefined,
    expiredStartDate: query?.expiredStartDate ? query?.expiredStartDate : undefined,
    expiredEndDate: query?.expiredEndDate ? query?.expiredEndDate : undefined
  }

  const validate = (values: QueryListTransactionProps) => {
    const errors: any = {}
    return errors
  }

  const onSubmit = (values: QueryListTransactionProps, formikHelpers: FormikHelpers<QueryListTransactionProps>) => {
    setStopClose(true)
    router.push({ query: removeUndefinedProperties(removeEmptyStringProperties(values)) })
    setStopClose(false)
    handleClose()
  }

  function handleReset() {
    router.push({ query: {} })
    handleClose()
  }

  return (
    <Formik initialValues={initialValues} validate={validate} onSubmit={onSubmit}>
      {({ dirty, isSubmitting }) => (
        <Form className='relative flex flex-col gap-4 sm:flex-row'>
          <div className='grid flex-grow grid-cols-6 px-4 pb-4 gap-x-4'>
            <div className='col-span-3'>
              <Field name='status'>
                {({ field, meta }: FieldProps) => (
                  <Select
                    margin='normal'
                    label='Transaction Status'
                    error={Boolean(meta.error && meta.touched)}
                    helperText={meta.error && meta.touched && String(meta.error)}
                    {...field}
                    fullWidth
                  >
                    {STATUS.map(v => (
                      <Option key={v} value={v}>
                        {v}
                      </Option>
                    ))}
                  </Select>
                )}
              </Field>
            </div>
            <div className='col-span-3'>
              <Field name='packageType'>{(props: FieldProps) => <FieldPackage {...props} />}</Field>
            </div>

            <div className='col-span-3'>
              <Field name='promo'>{(props: FieldProps) => <FieldPromo {...props} />}</Field>
            </div>
            <div className='col-span-3'>
              <Field name='referral'>{(props: FieldProps) => <FieldReferral {...props} />}</Field>
            </div>

            <div className='col-span-3'>
              <Field name='createdAtStartDate'>
                {(props: FieldProps) => <FieldDate {...props} label='Created At Start Date' />}
              </Field>
            </div>
            <div className='col-span-3'>
              <Field name='createdAtEndDate'>
                {(props: FieldProps) => <FieldDate {...props} label='Created At End Date' />}
              </Field>
            </div>

            <div className='col-span-3'>
              <Field name='expiredStartDate'>
                {(props: FieldProps) => <FieldDate {...props} label='Expired Start Date' />}
              </Field>
            </div>
            <div className='col-span-3'>
              <Field name='expiredEndDate'>
                {(props: FieldProps) => <FieldDate {...props} label='Expired End Date' />}
              </Field>
            </div>

            <div className='col-span-6 text-right mt-2'>
              <Button type='button' variant='outlined' color='warning' onClick={handleReset} disabled={isSubmitting}>
                Reset
              </Button>{' '}
              <Button type='submit' loading={isSubmitting} disabled={isSubmitting || !dirty}>
                Submit
              </Button>
            </div>
          </div>
        </Form>
      )}
    </Formik>
  )
}

function FilterTransactions() {
  const [open, setOpen] = useState(false)
  const [stopClose, setStopClose] = useState(false)

  const handleOpen = () => setOpen(true)
  const handleClose = () => (stopClose ? null : setOpen(false))

  return (
    <>
      <div>
        <IconButton variant='text' onClick={handleOpen}>
          <IconDots fontSize={20} />
        </IconButton>
      </div>
      <Dialog open={open} onClose={handleClose} title='Filter Transaction' closeButtom>
        <FormikForm setStopClose={setStopClose} handleClose={handleClose} />
      </Dialog>
    </>
  )
}

export default FilterTransactions
