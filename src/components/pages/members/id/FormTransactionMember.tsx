import { Field, FieldProps, Form, Formik, FormikErrors, FormikHelpers } from 'formik'
import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { addOrUpdateTransaction, fetcherClient, getReferral } from 'server/api'
import { IMember, ISocialMedia } from 'server/type/Member'
import { IPackage } from 'server/type/Package'
import { IPromo } from 'server/type/Promo'
import { IReferral } from 'server/type/Referral'
import { IPendingRecord, ITransaction } from 'server/type/Transaction'
import Autocomplete from 'src/components/ui/Autocomplete'
import Button from 'src/components/ui/Button'
import IconInfo from 'src/components/ui/Icon/IconInfo'
import Select from 'src/components/ui/Select'
import Option from 'src/components/ui/Select/Option'
import Skeleton from 'src/components/ui/Skeleton'
import Switch from 'src/components/ui/Switch'
import TextField from 'src/components/ui/TextField'
import Tooltip from 'src/components/ui/Tolltip'
import { getURLParams, sortPackages, toastError } from 'src/components/utility/formats'
import { PAYMENT_TYPE, STATUS, STATUS_REGISRATION, STATUS_TRANSACTION } from 'src/constant'
import { GetOneReferralSWR } from 'src/context/swrHook'
import { IResponsePackages } from 'src/type/package'
import { IResponsePromos } from 'src/type/promo'
import { IResponseTransactions, TransactionInput } from 'src/type/transaction'
import useSWR, { KeyedMutator } from 'swr'

export interface CountPack {
  member?: {
    _id: string
    name: string
    avatar: string
    handphone: string
    socialmedia: ISocialMedia[]
  }
  package?: {
    _id: string
    name: string
    price: number
    packageType: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'annual'
  }
  pending?: IPendingRecord[]
  promo?: {
    _id: string
    name: string
    type: 'percentage' | 'nominal'
    discounts: string | number
    startDate: Date
    endDate: Date
  }
  referral?: {
    _id: string
    name: string
    code: string
    type: 'percentage' | 'nominal'
    discounts: string | number
  }
  registrationPayment?: {
    price: number
  }
}
export interface countPack extends FieldProps {
  setCountPack: Dispatch<SetStateAction<CountPack>>
}
const FieldPackage = ({ field, meta, form, setCountPack }: countPack) => {
  const { data } = useSWR<IResponsePackages>('/api/package?status=active', fetcherClient)
  const setFieldValue = (v: IPackage) => {
    setCountPack(p => ({ ...p, package: v }))
    form.setFieldValue(field.name, v)
  }

  return data && data.data ? (
    <Autocomplete
      notFetching
      field={field.value}
      label='Package'
      margin='normal'
      disabled={form.values.paymentType === 'registration-payment'}
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
      renderOption={(option: IPackage, props) => <li {...props}>{option?.name}</li>}
      error={Boolean(meta.error && meta.touched)}
      helperText={meta.error && meta.touched && String(meta.error)}
    />
  ) : (
    <Skeleton height={40} width='100%' variant='rounded' className='my-4' />
  )
}

const FieldPromo = ({ field, meta, form, setCountPack }: countPack) => {
  const { data } = useSWR<IResponsePromos>('/api/promo?status=active', fetcherClient)
  const setFieldValue = (v: IPromo) => {
    setCountPack(p => ({ ...p, promo: v }))
    form.setFieldValue(field.name, v)
  }

  return data && data.data ? (
    <Autocomplete
      notFetching
      field={field.value}
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
      renderOption={(option: IPromo, props) => <li {...props}>{option?.name}</li>}
      error={Boolean(meta.error && meta.touched)}
      helperText={meta.error && meta.touched && String(meta.error)}
    />
  ) : (
    <Skeleton height={40} width='100%' variant='rounded' className='my-4' />
  )
}

const FieldReferral = ({ field, meta, form, setCountPack, disabled }: countPack & { disabled: boolean }) => {
  const fetchSuggestions = async (value: string) => {
    try {
      type typeQuery = {
        search: string
        limit: number
        status: 'active'
      }
      const query: typeQuery = { search: value, limit: 50, status: 'active' }
      const res = await getReferral(undefined, getURLParams(query))

      return res.data
    } catch (error) {
      return [{ name: 'tidak di temukan' }]
    }
  }
  const setFieldValue = (v: IReferral) => {
    setCountPack(p => ({ ...p, referral: v }))
    form.setFieldValue(field.name, v)
  }

  return (
    <Autocomplete
      fullWidth
      id='Referral'
      margin='normal'
      label='Referral'
      field={field.value || []}
      disabled={disabled}
      getOption={(option: IReferral) => ({
        _id: option?._id,
        name: option?.name,
        code: option?.code,
        type: option?.type,
        discounts: option?.discounts,
        member: option?.member,
        status: option?.status
      })}
      setFieldValue={setFieldValue}
      fetch={fetchSuggestions}
      isClearable
      renderOption={(option: IReferral, props) => <li {...props}>{option?.name}</li>}
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

interface IFieldPrice {
  isEditAble: boolean
  referralBA: IReferral | null
  setFieldValue: (
    field: string,
    value: any,
    shouldValidate?: boolean | undefined
  ) => Promise<void | FormikErrors<initialValuesTransactionInput>>
  countPack: CountPack
  removeStatusField?: boolean
  removeExpiredField?: boolean
  setCountPack: Dispatch<SetStateAction<CountPack>>
}
export const FieldPrice = (props: IFieldPrice) => {
  const { setFieldValue, countPack, isEditAble, referralBA, removeStatusField, removeExpiredField, setCountPack } =
    props
  const [checked, setChecked] = useState(false)
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

  function diskonPersentase(hargaAsli: number, persentaseDiskon: number) {
    const diskon = hargaAsli * (persentaseDiskon / 100)
    const hargaSetelahDiskon = hargaAsli - diskon
    return hargaSetelahDiskon
  }

  function diskonPotongan(hargaAsli: number, potonganHarga: number) {
    const hargaSetelahDiskon = hargaAsli - potonganHarga
    return hargaSetelahDiskon
  }

  useEffect(() => {
    let price = countPack.package?.price || countPack.registrationPayment?.price || 0

    if (countPack.referral) {
      const referralDiscount =
        countPack.referral.type === 'percentage'
          ? diskonPersentase(price, Number(countPack.referral.discounts))
          : diskonPotongan(price, Number(countPack.referral.discounts))
      price = referralDiscount
    }

    if (countPack.promo) {
      const promoDiscount =
        countPack.promo.type === 'percentage'
          ? diskonPersentase(price, Number(countPack.promo.discounts))
          : diskonPotongan(price, Number(countPack.promo.discounts))
      price = promoDiscount
    }

    if (checked) {
      if (referralBA) {
        const promoDiscount =
          referralBA.type === 'percentage'
            ? diskonPersentase(price, Number(referralBA.discounts) * Number(referralBA.memberUse.length))
            : diskonPotongan(price, Number(referralBA.discounts) * Number(referralBA.memberUse.length))
        price = promoDiscount
      }
    }

    price = price === 0 ? 0 : price < 0 ? 0 : price

    setFieldValue('priceAfterdiscount', countPack.package?.price || countPack.registrationPayment?.price ? price : '')
    setFieldValue('price', countPack.package?.price || countPack.registrationPayment?.price || '')

    const now = new Date()
    let expiredDate

    switch (countPack.package?.packageType) {
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
  }, [referralBA, countPack, checked, setFieldValue])

  return (
    <>
      {referralBA && (
        <div className='col-span-6 flex justify-between mb-2'>
          <Switch checked={checked} onChange={e => setChecked(e.target.checked)} label='Use discount for BA only' sizes='small' />
          <div className='inline-block'>
            <Tooltip
              anchor='bottom-end'
              title={
                <div>
                  <table>
                    <tr>
                      <td>Name</td>
                      <td>:</td>
                      <td>{referralBA?.name}</td>
                    </tr>
                    <tr>
                      <td>Code</td>
                      <td>:</td>
                      <td>{referralBA?.code}</td>
                    </tr>
                    <tr>
                      <td>Discount</td>
                      <td>:</td>
                      <td>
                        {referralBA?.type === 'percentage'
                          ? `${referralBA?.discounts}%`
                          : `Rp. -${referralBA?.discounts}`}
                      </td>
                    </tr>
                    <tr>
                      <td>Has been used</td>
                      <td>:</td>
                      <td>
                        {referralBA?.memberUse.length} People / {referralBA.useCount} times
                      </td>
                    </tr>
                  </table>
                </div>
              }
            >
              <IconInfo fontSize={20} color='success' />
            </Tooltip>
          </div>
        </div>
      )}
      <div className='col-span-6'>
        <Field name='price'>
          {({ field, form, meta }: FieldProps) => (
            <TextField
              margin='normal'
              readOnly={form.values.paymentType !== 'registration-payment'}
              label='Price'
              type='number'
              fullWidth
              {...field}
              onChange={(e: any) => {
                setCountPack(p => ({ ...p, member: p.member, registrationPayment: { price: e.target.value } }))
                form.setFieldValue('priceAfterdiscount', e.target.value)
                field.onChange(e)
              }}
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
      {!removeExpiredField && (
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
      )}
      {!removeStatusField && (
        <>
          <div className='col-span-6'>
            <Field name='status'>
              {({ field, form, meta }: FieldProps) => (
                <Select
                  margin='normal'
                  label='Status'
                  fullWidth
                  {...field}
                  error={Boolean(meta.error && meta.touched)}
                  helperText={meta.error && meta.touched && String(meta.error)}
                >
                  {form.values.paymentType === 'registration-payment'
                    ? STATUS_REGISRATION.map(v => (
                        <Option value={v} key={v} className='capitalize'>
                          {v}
                        </Option>
                      ))
                    : STATUS_TRANSACTION.map(v => (
                        <Option value={v} key={v} className='capitalize'>
                          {v}
                        </Option>
                      ))}
                </Select>
              )}
            </Field>
          </div>
          <div className='col-span-6'>
            <Field name='paymentType'>
              {({ field, form, meta }: FieldProps) => (
                <Select
                  margin='normal'
                  label='PaymentType'
                  fullWidth
                  {...field}
                  onChange={(e: any) => {
                    setCountPack(p => ({ member: p.member, registrationPayment: { price: 50000 } }))
                    form.setFieldValue('package', undefined)
                    form.setFieldValue('referral', undefined)
                    form.setFieldValue('promo', undefined)
                    form.setFieldValue('status', 'NOT-YEY-PAID')
                    form.setFieldValue('expired', '')
                    form.setFieldValue('price', 50000)
                    form.setFieldValue('priceAfterdiscount', 50000)
                    field.onChange(e)
                  }}
                  error={Boolean(meta.error && meta.touched)}
                  helperText={meta.error && meta.touched && String(meta.error)}
                >
                  {PAYMENT_TYPE.map(v => (
                    <Option value={v} key={v} className='capitalize'>
                      {v}
                    </Option>
                  ))}
                </Select>
              )}
            </Field>
          </div>
        </>
      )}
    </>
  )
}

interface initialValuesTransactionInput {
  _id: string
  price?: number
  priceAfterdiscount?: number
  expired: Date
  member: string
  description: string
  package?: ITransaction['package']
  pending?: ITransaction['pending']
  promo?: ITransaction['promo']
  referral?: ITransaction['referral']
  paymentType: ITransaction['paymentType']
  status: ITransaction['status']
  createdAt?: Date
  updatedAt?: Date
}

interface Props {
  setStopClose: Dispatch<SetStateAction<boolean>>
  member: IMember
  value?: ITransaction
  handleClose: () => void | null
  mutate: KeyedMutator<IResponseTransactions>
}
const Content = (props: Props & { referralBA: IReferral }) => {
  const { setStopClose, member, value, handleClose, referralBA, mutate } = props
  const [countPack, setCountPack] = useState<CountPack>({
    member: value?.member,
    package: value?.package,
    pending: value?.pending,
    promo: value?.promo,
    referral: value?.referral,
    registrationPayment: value?.paymentType === 'registration-payment' ? { price: value?.price } : undefined
  })

  const initialValues: initialValuesTransactionInput = {
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
    paymentType: value?.paymentType || 'package-payment',
    description: value?.description || '',
    createdAt: value?.createdAt,
    updatedAt: value?.updatedAt
  }

  const validate = (values: initialValuesTransactionInput) => {
    const errors: FormikErrors<initialValuesTransactionInput> = {}
    if (!values.status) errors.status = 'Diperlukan!'
    if (values.price === undefined || values.price === null) errors.price = 'Diperlukan!'
    if (values.priceAfterdiscount === undefined || values.priceAfterdiscount === null)
      errors.priceAfterdiscount = 'Diperlukan!'

    if (values.paymentType !== 'registration-payment') {
      if (!values.package?._id) errors.package = 'Diperlukan!'
      if (!values.expired) errors.expired = 'Diperlukan!'
    }

    return errors
  }

  const onSubmit = async (values: initialValuesTransactionInput, formikHelpers: FormikHelpers<any>) => {
    try {
      setStopClose(true)
      let discountBA: string | undefined = undefined
      if (referralBA) {
        discountBA =
          referralBA.type === 'percentage'
            ? `Discount ${referralBA.discounts}% dan sudah digunakan oleh ${referralBA.memberUse.length} orang`
            : `Discount Rp. -${referralBA.discounts} dan sudah digunakan oleh ${referralBA.memberUse.length} orang`
      }
      const body: TransactionInput = {
        _id: values._id,
        member: values.member,
        expired: values.expired,
        status: values.status,
        createdAt: values.createdAt,
        package: values.package?._id || null,
        promo: values.promo?._id || null,
        referral: values.referral?._id || null,
        price: values.price || '',
        priceAfterdiscount: values.priceAfterdiscount || '',
        updatedAt: values.updatedAt,
        discountBA,
        description: values.description || '',
        paymentType: values.paymentType
      }
      await addOrUpdateTransaction(body)
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
      {({ dirty, isSubmitting, errors, setFieldValue }) => {
        console.log({ errors })
        return (
          <Form className='grid flex-grow grid-cols-6 px-4 pb-4 gap-x-4'>
            <FieldPrice
              setFieldValue={setFieldValue}
              countPack={countPack}
              setCountPack={setCountPack}
              referralBA={referralBA}
              isEditAble={Boolean(value)}
            />
            <div className='col-span-6'>
              <Field name='package'>
                {(props: FieldProps) => <FieldPackage {...props} setCountPack={setCountPack} />}
              </Field>
            </div>
            <div className='col-span-6'>
              <Field name='promo'>{(props: FieldProps) => <FieldPromo {...props} setCountPack={setCountPack} />}</Field>
            </div>
            <div className='col-span-6'>
              <Field name='referral'>
                {(props: FieldProps) => (
                  <FieldReferral {...props} setCountPack={setCountPack} disabled={Boolean(referralBA)} />
                )}
              </Field>
            </div>
            <div className='col-span-6'>
              <Field name='description'>
                {({ field, meta }: FieldProps) => (
                  <TextField
                    margin='normal'
                    label='Description'
                    multiline
                    fullWidth
                    {...field}
                    error={Boolean(meta.error && meta.touched)}
                    helperText={meta.error && meta.touched && String(meta.error)}
                  />
                )}
              </Field>
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
          </Form>
        )
      }}
    </Formik>
  )
}

const FormTransactionMember = (props: Props) => {
  const { data: referral, mutate } = GetOneReferralSWR()
  if (!referral) {
    return (
      <div className='grid flex-grow grid-cols-6 px-4 pb-4 gap-x-4'>
        <div className='col-span-6'>
          <Skeleton height={40} width='100%' variant='rounded' className='my-4' />
        </div>
        <div className='col-span-6'>
          <Skeleton height={40} width='100%' variant='rounded' className='my-4' />
        </div>
        <div className='col-span-6'>
          <Skeleton height={40} width='100%' variant='rounded' className='my-4' />
        </div>
        <div className='col-span-6'>
          <Skeleton height={40} width='100%' variant='rounded' className='my-4' />
        </div>
        <div className='col-span-6'>
          <Skeleton height={40} width='100%' variant='rounded' className='my-4' />
        </div>
        <div className='col-span-6'>
          <Skeleton height={40} width='100%' variant='rounded' className='my-4' />
        </div>
        <div className='col-span-6'>
          <Skeleton height={40} width='100%' variant='rounded' className='my-4' />
        </div>
        <div className='col-span-6'>
          <Skeleton height={110} width='100%' variant='rounded' className='my-4' />
        </div>
      </div>
    )
  }

  return <Content {...props} referralBA={referral.data} />
}

export default FormTransactionMember
