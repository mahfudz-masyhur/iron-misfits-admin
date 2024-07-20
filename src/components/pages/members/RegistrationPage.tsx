import { Field, FieldProps, Form, Formik, FormikHelpers } from 'formik'
import { ChangeEvent, Dispatch, SetStateAction, useState } from 'react'
import { fetcherClient, getPromosBycode, getReferralByCode, memberRegisration } from 'server/api'
import { IPromo } from 'server/type/Promo'
import { IReferral } from 'server/type/Referral'
import FieldInputImage from 'src/components/ReuseableComponent/FieldInputImage/OnChange'
import Autocomplete from 'src/components/ui/Autocomplete'
import Button from 'src/components/ui/Button'
import Divider from 'src/components/ui/Divider'
import TextField from 'src/components/ui/TextField'
import Typography from 'src/components/ui/Typograph'
import { formatPhoneNumber, getURLParams, toastError } from 'src/components/utility/formats'
import { IResponseMember } from 'src/type/member'
import { SocialmediaField } from './FormMember'
import { CountPack, FieldPrice, countPack } from './id/FormTransactionMember'
import Skeleton from 'src/components/ui/Skeleton'
import useSWR from 'swr'
import { IResponsePackages } from 'src/type/package'
import { IPackage } from 'server/type/Package'
import { useRouter } from 'next/router'

export type RegisterMemberValues = {
  name: string
  avatar: string
  handphone: string
  socialmedia: { key: string; value: string }[]
  referral?: string
  promo?: string
  package?: string
  priceAfterdiscount: string
  price: string
  expired: Date | null
  status: string
}

interface Props {
  setRest: Dispatch<SetStateAction<IResponseMember | null>>
}
const FieldPackage = ({ field, meta, form, setCountPack }: countPack) => {
  const { data } = useSWR<IResponsePackages>('/api/package?status=active', fetcherClient)
  const setFieldValue = (v: IPackage) => {
    setCountPack(p => ({ ...p, package: v }))
    form.setFieldValue(field.name, v._id)
  }

  return data && data.data ? (
    <Autocomplete
      notFetching
      field={field.value}
      label='Package*'
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
    <Skeleton height={40} width='100%' variant='rounded' className='my-4' />
  )
}
const FieldPromo = ({ field, meta, form, setCountPack, disabled }: countPack & { disabled: boolean }) => {
  const fetchSuggestions = async (value: string) => {
    try {
      type typeQuery = {
        code: string
        status: 'active'
      }
      const query: typeQuery = { code: value, status: 'active' }
      const res = await getPromosBycode(undefined, getURLParams(query))

      return res.data
    } catch (error) {
      return [{ name: 'tidak di temukan' }]
    }
  }
  const setFieldValue = (v: IPromo) => {
    setCountPack(p => ({ ...p, promo: v }))
    form.setFieldValue(field.name, v._id)
  }

  return (
    <Autocomplete
      fullWidth
      id={field.name}
      margin='normal'
      label='Promo'
      field={field.value || []}
      disabled={disabled}
      getOption={(option: IPromo) => ({
        _id: option?._id,
        name: option?.name,
        code: option?.code,
        type: option?.type,
        discounts: option?.discounts,
        status: option?.status
      })}
      setFieldValue={setFieldValue}
      fetch={fetchSuggestions}
      isClearable
      renderOption={(option: IPromo, props) => <li {...props}>{option?.name}</li>}
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

const FieldReferral = ({ field, meta, form, setCountPack, disabled }: countPack & { disabled: boolean }) => {
  const fetchSuggestions = async (value: string) => {
    try {
      type typeQuery = {
        code: string
        status: 'active'
      }
      const query: typeQuery = { code: value, status: 'active' }
      const res = await getReferralByCode(undefined, getURLParams(query))

      return res.data
    } catch (error) {
      return [{ name: 'tidak di temukan' }]
    }
  }
  const setFieldValue = (v: IReferral) => {
    setCountPack(p => ({ ...p, referral: v }))
    form.setFieldValue(field.name, v._id)
  }

  return (
    <Autocomplete
      fullWidth
      id={field.name}
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

function FormMember(props: Props) {
  const { setRest } = props
  const { reload } = useRouter()
  const [countPack, setCountPack] = useState<CountPack>({
    member: undefined,
    package: undefined,
    pending: undefined,
    promo: undefined,
    referral: undefined
  })
  const initialValues: RegisterMemberValues = {
    name: '',
    avatar: '',
    handphone: '',
    socialmedia: [{ key: 'ig', value: '' }],

    referral: undefined,
    promo: undefined,
    package: undefined,
    priceAfterdiscount: '',
    price: '',
    expired: null,
    status: 'ACTIVE'
  }

  const validate = (values: RegisterMemberValues) => {
    const errors: any = {}

    if (!values.name) errors.name = 'Diperlukan'
    if (!values.handphone) errors.handphone = 'Diperlukan'

    if (values.socialmedia) {
      values.socialmedia.forEach((social, index) => {
        if (!social.key) {
          errors.socialmedia = errors.socialmedia || []
          errors.socialmedia[index] = errors.socialmedia[index] || {}
          errors.socialmedia[index].key = 'Diperlukan'
        }
        if (!social.value) {
          errors.socialmedia = errors.socialmedia || []
          errors.socialmedia[index] = errors.socialmedia[index] || {}
          errors.socialmedia[index].value = 'Diperlukan'
        }
      })
    }

    if (!values.status) errors.status = 'Diperlukan!'
    if (!values.package) errors.package = 'Diperlukan!'
    if (!values.expired) errors.expired = 'Diperlukan!'

    return errors
  }

  const onSubmit = async (values: RegisterMemberValues, formikHelpers: FormikHelpers<RegisterMemberValues>) => {
    try {
      const rest = await memberRegisration(values)
      setRest(rest)
    } catch (error: any) {
      toastError(error)
    }
  }

  return (
    <Formik initialValues={initialValues} validate={validate} onSubmit={onSubmit}>
      {({ dirty, isSubmitting, setFieldValue, ...rest }) => {
        return (
          <Form className='relative flex flex-col gap-4 sm:flex-row'>
            <div style={{ minWidth: 151 }}>
              <Field name='avatar'>
                {({ field, form }: FieldProps) => (
                  <FieldInputImage
                    imgFile={field.value}
                    onChange={base64 => form.setFieldValue(field.name, base64 || null)}
                    width={151}
                    height={226}
                    maxWidth
                  />
                )}
              </Field>
            </div>

            <div className='grid flex-grow grid-cols-6 px-4 pb-4 gap-x-4'>
              <div className='col-span-6'>
                <Field name='name'>
                  {({ field, meta }: FieldProps) => (
                    <TextField
                      margin='normal'
                      label='Name*'
                      placeholder='John Doe'
                      error={Boolean(meta.error && meta.touched)}
                      helperText={meta.error && meta.touched && String(meta.error)}
                      {...field}
                      fullWidth
                    />
                  )}
                </Field>
              </div>
              <div className='col-span-6'>
                <Field name='handphone'>
                  {({ field, meta }: FieldProps) => {
                    function handlePhoneNumber(
                      e: ChangeEvent<HTMLInputElement>,
                      onChange: {
                        (e: ChangeEvent<any>): void
                        <T = string | ChangeEvent<any>>(field: T): T extends ChangeEvent<any>
                          ? void
                          : (e: string | ChangeEvent<any>) => void
                      }
                    ) {
                      e.target.value = formatPhoneNumber(e.target.value)

                      return onChange(e)
                    }

                    return (
                      <TextField
                        margin='normal'
                        label='Handphone*'
                        placeholder='81-111-111-1111'
                        fullWidth
                        startAdornment={<>+62</>}
                        {...{
                          ...field,
                          onChange: (e: ChangeEvent<HTMLInputElement>) => handlePhoneNumber(e, field.onChange)
                        }}
                        error={Boolean(meta.error && meta.touched)}
                        helperText={meta.error && meta.touched && String(meta.error)}
                      />
                    )
                  }}
                </Field>
              </div>
              <div className='col-span-6'>
                <Typography variant='subtitle2' className='-mb-1'>
                  Social Media
                </Typography>
                <Field name='socialmedia'>{SocialmediaField}</Field>
              </div>
              <div className='col-span-6'>
                <Divider />
              </div>
              <FieldPrice
                setFieldValue={setFieldValue}
                countPack={countPack}
                referralBA={null}
                isEditAble={false}
                removeStatusField
              />
              <div className='col-span-6'>
                <Field name='package'>
                  {(props: FieldProps) => <FieldPackage {...props} setCountPack={setCountPack} />}
                </Field>
              </div>
              <div className='col-span-6'>
                <Field name='promo'>
                  {(props: FieldProps) => <FieldPromo {...props} setCountPack={setCountPack} disabled={false} />}
                </Field>
              </div>
              <div className='col-span-6'>
                <Field name='referral'>
                  {(props: FieldProps) => <FieldReferral {...props} setCountPack={setCountPack} disabled={false} />}
                </Field>
              </div>
              <div className='col-span-6 text-right mt-2'>
                <Button
                  type='reset'
                  variant='outlined'
                  color='warning'
                  disabled={isSubmitting || !dirty}
                  onClick={reload}
                >
                  Reset
                </Button>{' '}
                <Button type='submit' loading={isSubmitting} disabled={isSubmitting || !dirty}>
                  Submit
                </Button>
              </div>
            </div>
          </Form>
        )
      }}
    </Formik>
  )
}

function RegistrationPage() {
  const [rest, setRest] = useState<IResponseMember | null>(null)
  return <div>{!rest ? <FormMember setRest={setRest} /> : <>Success</>}</div>
}

export default RegistrationPage
