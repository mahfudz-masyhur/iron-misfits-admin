import { Field, FieldProps, Form, Formik, FormikErrors, FormikHelpers } from 'formik'
import { useRouter } from 'next/router'
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
import TextField from 'src/components/ui/TextField'
import Tooltip from 'src/components/ui/Tolltip'
import { getURLParams, toastError } from 'src/components/utility/formats'
import { STATUS } from 'src/constant'
import { IResponsePackages } from 'src/type/package'
import { IResponsePromos } from 'src/type/promo'
import { TransactionInput } from 'src/type/transaction'
import useSWR from 'swr'

interface CountPack {
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
}
interface countPack extends FieldProps {
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
      setFieldValue={setFieldValue}
      options={data?.data || []}
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
    <Skeleton height={40} width='100%' variant='rounded' />
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
    <Skeleton height={40} width='100%' variant='rounded' />
  )
}

const FieldReferral = ({ field, meta, form, setCountPack, disabled }: countPack & { disabled: boolean }) => {
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
}
const FieldPrice = ({ setFieldValue, countPack, isEditAble, referralBA }: IFieldPrice) => {
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

  function diskonPersentase(hargaAsli: number, persentaseDiskon:number) {
    const diskon = hargaAsli * (persentaseDiskon / 100);
    const hargaSetelahDiskon = hargaAsli - diskon;
    return hargaSetelahDiskon;
  }

  function diskonPotongan(hargaAsli: number, potonganHarga:number) {
    const hargaSetelahDiskon = hargaAsli - potonganHarga;
    return hargaSetelahDiskon;
  }

  useEffect(() => {
    let price = countPack.package?.price || 0

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

    if (referralBA) {
      const promoDiscount =
        referralBA.type === 'percentage'
          ? diskonPersentase(price, (Number(referralBA.discounts) * Number(referralBA.useCount)))
          : diskonPotongan(price, (Number(referralBA.discounts) * Number(referralBA.useCount)))
      price = promoDiscount
    }

    price = price === 0 ? 0 : price < 0 ? 0 : price

    setFieldValue('priceAfterdiscount', countPack.package?.price ? price : '')
    setFieldValue('price', countPack.package?.price || '')

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
  }, [referralBA, countPack, setFieldValue])

  return (
    <>
      {referralBA && (
        <div className='col-span-6 flex justify-end'>
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
                      <td>{referralBA?.useCount} People</td>
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
            <Select
              margin='normal'
              readOnly={!isEditAble}
              label='Status'
              fullWidth
              {...field}
              error={Boolean(meta.error && meta.touched)}
              helperText={meta.error && meta.touched && String(meta.error)}
            >
              {STATUS.map(v => (
                <Option value={v} key={v} className='capitalize'>
                  {v}
                </Option>
              ))}
            </Select>
          )}
        </Field>
      </div>
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
  status: 'PENDING' | 'ACTIVE' | 'INACTIVE'
  createdAt?: Date
  updatedAt?: Date
}

interface Props {
  setStopClose: Dispatch<SetStateAction<boolean>>
  referralBA: IReferral
  member: IMember
  value?: ITransaction
  handleClose: () => void | null
}
const FormTransactionMember = (props: Props) => {
  const { setStopClose, member, value, handleClose, referralBA } = props
  const [countPack, setCountPack] = useState<CountPack>({
    member: value?.member,
    package: value?.package,
    pending: value?.pending,
    promo: value?.promo,
    referral: value?.referral
  })
  const router = useRouter()
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
    description: value?.description || '',
    createdAt: value?.createdAt,
    updatedAt: value?.updatedAt
  }

  const validate = (values: initialValuesTransactionInput) => {
    const errors: FormikErrors<initialValuesTransactionInput> = {}
    if (!values.status) errors.status = 'Diperlukan!'
    if (!values.price) errors.price = 'Diperlukan!'
    if (!values.priceAfterdiscount) errors.priceAfterdiscount = 'Diperlukan!'
    if (!values.package?._id) errors.package = 'Diperlukan!'
    if (!values.expired) errors.expired = 'Diperlukan!'

    return errors
  }

  const onSubmit = async (values: initialValuesTransactionInput, formikHelpers: FormikHelpers<any>) => {
    try {
      setStopClose(true)
      let discountBA: string | undefined = undefined
      if (referralBA) {
        discountBA =
          referralBA.type === 'percentage'
            ? `Discount ${referralBA.discounts}% dan sudah digunakan oleh ${referralBA.useCount} orang`
            : `Discount Rp. -${referralBA.discounts} dan sudah digunakan oleh ${referralBA.useCount} orang`
      }
      const body: TransactionInput = {
        _id: values._id,
        member: values.member,
        expired: values.expired,
        status: values.status,
        pending: values.pending || [],
        createdAt: values.createdAt,
        package: values.package?._id || '',
        promo: values.promo?._id || null,
        referral: values.referral?._id || null,
        price: values.price || '',
        priceAfterdiscount: values.priceAfterdiscount || '',
        updatedAt: values.updatedAt,
        discountBA,
        description: values.description || ''
      }
      await addOrUpdateTransaction(body)
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
      {({ dirty, isSubmitting, values, setFieldValue }) => (
        <Form>
          <div className='grid flex-grow grid-cols-6 px-4 pb-4 gap-x-4'>
            <FieldPrice
              setFieldValue={setFieldValue}
              countPack={countPack}
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
          </div>
        </Form>
      )}
    </Formik>
  )
}

export default FormTransactionMember
