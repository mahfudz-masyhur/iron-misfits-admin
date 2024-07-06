import { Field, FieldProps, Form, Formik, FormikErrors, FormikHelpers } from 'formik'
import { useRouter } from 'next/router'
import { Dispatch, SetStateAction, useEffect } from 'react'
import { addOrUpdateTransaction, fetcherClient, getReferral } from 'server/api'
import { IMember } from 'server/type/Member'
import { IReferral } from 'server/type/Referral'
import { ITransaction } from 'server/type/Transaction'
import Autocomplete from 'src/components/ui/Autocomplete'
import Button from 'src/components/ui/Button'
import Select from 'src/components/ui/Select'
import Option from 'src/components/ui/Select/Option'
import Skeleton from 'src/components/ui/Skeleton'
import TextField from 'src/components/ui/TextField'
import { getURLParams, toastError } from 'src/components/utility/formats'
import { IResponsePackages } from 'src/type/package'
import { IResponsePromos } from 'src/type/promo'
import { TransactionInput } from 'src/type/transaction'
import useSWR from 'swr'

const FieldPackage = ({ field, meta, form }: FieldProps) => {
  const { data, isLoading } = useSWR<IResponsePackages>('/api/package?status=active', fetcherClient)

  return (
    <>
      {(data && data.data) || isLoading ? (
        <Select
          margin='normal'
          label='Package'
          placeholder='Paket mingguan'
          error={Boolean(meta.error && meta.touched)}
          helperText={meta.error && meta.touched && String(meta.error)}
          {...field}
          value={JSON.stringify(field.value)}
          onChange={(e: any) => {
            e.target.value = e.target.value ? JSON.parse(e.target.value) : ''
            field.onChange(e)
          }}
          isClearable
          fullWidth
        >
          <></>
          {data?.data?.map(v => (
            <Option value={JSON.stringify(v)} key={v._id}>
              {v.name}
            </Option>
          ))}
          <></>
        </Select>
      ) : (
        <Skeleton height={40} width='100%' variant='rounded' />
      )}
    </>
  )
}

const FieldPromo = ({ field, meta, form }: FieldProps) => {
  const { data, isLoading } = useSWR<IResponsePromos>('/api/promo?status=active', fetcherClient)

  return (
    <>
      {(data && data.data) || isLoading ? (
        <Select
          margin='normal'
          label='Promo'
          placeholder='Promo...'
          error={Boolean(meta.error && meta.touched)}
          helperText={meta.error && meta.touched && String(meta.error)}
          {...field}
          value={JSON.stringify(field.value)}
          onChange={(e: any) => {
            e.target.value = e.target.value ? JSON.parse(e.target.value) : ''
            field.onChange(e)
          }}
          isClearable
          fullWidth
        >
          <></>
          {data?.data?.map(v => (
            <Option value={JSON.stringify(v)} key={v._id}>
              {v.name}
            </Option>
          ))}
          <></>
        </Select>
      ) : (
        <Skeleton height={40} width='100%' variant='rounded' />
      )}
    </>
  )
}

const FieldReferral = ({ field, meta, form }: FieldProps) => {
  const fetchSuggestions = async (value: string) => {
    try {
      type typeQuery = {
        name: string
        limit: number
      }
      const query: typeQuery = { name: value, limit: 50 }
      const res = await getReferral(undefined, getURLParams(query))

      return res.data
    } catch (error) {
      return [{ name: 'tidak di temukan' }]
    }
  }
  return (
    <Autocomplete
      fullWidth
      id='Referral'
      margin='normal'
      label='Referral'
      field={field.value || []}
      getOption={(option: IReferral) => ({ ...option })}
      setFieldValue={(v: IReferral) => form.setFieldValue(field.name, v ? v : '')}
      fetch={fetchSuggestions}
      isClearable
      renderOption={(option: IReferral, props) => (
        <li {...props}>
          <span>{option?.name}</span>
        </li>
      )}
      customInput={e => (
        <TextField
          {...e}
          fullWidth
          error={Boolean(meta.error && meta.touched)}
          helperText={meta.error && meta.touched && String(meta.error)}
        />
      )}
    />
  )
}

const FieldPrice = ({
  values,
  setFieldValue
}: {
  values: TransactionInput
  setFieldValue: (
    field: string,
    value: any,
    shouldValidate?: boolean | undefined
  ) => Promise<void | FormikErrors<TransactionInput>>
}) => {
  const addDays = (date: Date, days: number) => {
    const result = new Date(date)
    result.setDate(result.getDate() + days)
    return result
  }

  const addMonths = (date: Date, months: number) => {
    const result = new Date(date)
    result.setMonth(result.getMonth() + months)
    return result
  }

  const addYears = (date: Date, years: number) => {
    const result = new Date(date)
    result.setFullYear(result.getFullYear() + years)
    return result
  }

  useEffect(() => {
    let price = values.package?.price || 0

    if (values.referral) {
      const referralDiscount =
        values.referral.type === 'percentage'
          ? (Number(values.referral.discounts) / 100) * price
          : Number(values.referral.discounts)
      price -= referralDiscount
    }

    if (values.promo) {
      const promoDiscount =
        values.promo.type === 'percentage'
          ? (Number(values.promo.discounts) / 100) * price
          : Number(values.promo.discounts)
      price -= promoDiscount
    }

    setFieldValue('priceAfterdiscount', price || '')
    setFieldValue('price', values.package?.price || '')

    const now = new Date()
    let expiredDate

    switch (values.package?.packageType) {
      case 'annual':
        expiredDate = addYears(now, 1)
        break
      case 'daily':
        expiredDate = addDays(now, 1)
        break
      case 'quarterly':
        expiredDate = addMonths(now, 4)
        break
      case 'monthly':
        expiredDate = addMonths(now, 1)
        break
      case 'weekly':
        expiredDate = addDays(now, 7)
        break
      default:
        expiredDate = ''
    }

    setFieldValue('expired', expiredDate)
  }, [values.package, values.promo, values.referral, setFieldValue])

  return (
    <>
      <div className='col-span-6'>
        <Field name='price'>
          {({ field, form, meta }: FieldProps) => (
            <TextField
              margin='normal'
              readOnly
              label='Price'
              type='number'
              fullWidth
              {...field}
              error={Boolean(meta.error && meta.touched)}
              helperText={meta.error && meta.touched && String(meta.error)}
            />
          )}
        </Field>
      </div>
      <div className='col-span-6'>
        <Field name='priceAfterdiscount'>
          {({ field, form, meta }: FieldProps) => (
            <TextField
              margin='normal'
              readOnly
              label='Discount'
              type='number'
              fullWidth
              {...field}
              error={Boolean(meta.error && meta.touched)}
              helperText={meta.error && meta.touched && String(meta.error)}
            />
          )}
        </Field>
      </div>
      <div className='col-span-6'>
        <Field name='expired'>
          {({ field, form, meta }: FieldProps) => (
            <TextField
              margin='normal'
              readOnly
              label='Expired date'
              fullWidth
              {...field}
              error={Boolean(meta.error && meta.touched)}
              helperText={meta.error && meta.touched && String(meta.error)}
            />
          )}
        </Field>
      </div>
      <div className='col-span-6'>
        <Field name='status'>
          {({ field, form, meta }: FieldProps) => (
            <TextField
              margin='normal'
              readOnly
              label='Status'
              fullWidth
              {...field}
              error={Boolean(meta.error && meta.touched)}
              helperText={meta.error && meta.touched && String(meta.error)}
            />
          )}
        </Field>
      </div>
    </>
  )
}

interface Props {
  setStopClose: Dispatch<SetStateAction<boolean>>
  member: IMember
  value?: ITransaction
  handleClose: () => void | null
}

const FormTransactionMember = (props: Props) => {
  const { setStopClose, member, value, handleClose } = props
  const router = useRouter()
  const initialValues: TransactionInput = {
    _id: value?._id || '',
    price: value?.price || undefined,
    priceAfterdiscount: value?.priceAfterdiscount || undefined,
    expired: value?.expired || new Date(),
    member: value?.member._id || member._id,
    package: value?.package || undefined,
    pending: value?.pending || [],
    promo: value?.promo || undefined,
    referral: value?.referral || undefined,
    status: value?.status || 'ACTIVE',
    createdAt: value?.createdAt,
    updatedAt: value?.updatedAt
  }

  const validate = (values: TransactionInput) => {
    const errors: FormikErrors<TransactionInput> = {}
    if (!values.status) errors.status = 'Diperlukan!'
    if (!values.price) errors.price = 'Diperlukan!'
    if (!values.priceAfterdiscount) errors.priceAfterdiscount = 'Diperlukan!'
    if (!values.package) errors.package = 'Diperlukan!'
    if (!values.expired) errors.expired = 'Diperlukan!'

    return errors
  }

  const onSubmit = async (values: TransactionInput, formikHelpers: FormikHelpers<any>) => {
    try {
      setStopClose(true)
      await addOrUpdateTransaction(values)
      await router.push(router.asPath)
      setStopClose(false)
      handleClose()
    } catch (error: any) {
      toastError(error)
      setStopClose(false)
    }
  }

  return (
    <Formik initialValues={initialValues} validate={validate} onSubmit={onSubmit}>
      {({ dirty, isSubmitting, values, setFieldValue }) => (
        <Form>
          <div className='grid flex-grow grid-cols-6 px-4 pb-4 gap-x-4'>
            <FieldPrice values={values} setFieldValue={setFieldValue} />
            <div className='col-span-6'>
              <Field name='package'>{(props: FieldProps) => <FieldPackage {...props} />}</Field>
            </div>
            <div className='col-span-6'>
              <Field name='promo'>{(props: FieldProps) => <FieldPromo {...props} />}</Field>
            </div>
            <div className='col-span-6'>
              <Field name='referral'>{(props: FieldProps) => <FieldReferral {...props} />}</Field>
            </div>
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
          </div>
        </Form>
      )}
    </Formik>
  )
}

export default FormTransactionMember
