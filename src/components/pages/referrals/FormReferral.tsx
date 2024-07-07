import { Field, FieldProps, Form, Formik, FormikErrors, FormikHelpers } from 'formik'
import { useRouter } from 'next/router'
import { ChangeEvent, Dispatch, SetStateAction } from 'react'
import { addOrUpdateReferral, getMembers } from 'server/api'
import { IMember } from 'server/type/Member'
import { IReferral } from 'server/type/Referral'
import Autocomplete from 'src/components/ui/Autocomplete'
import Button from 'src/components/ui/Button'
import Select from 'src/components/ui/Select'
import Option from 'src/components/ui/Select/Option'
import TextField from 'src/components/ui/TextField'
import { convertToNumber, formatNumber, getURLParams, toastError } from 'src/components/utility/formats'
import { ReferralInput } from 'src/type/referral'

const StudentField = ({ field, form, meta }: FieldProps) => {
  const fetchSuggestions = async (value: string) => {
    try {
      type typeQuery = {
        name: string
        limit: number
      }
      const query: typeQuery = { name: value, limit: 50 }
      const res = await getMembers(undefined, getURLParams(query))

      return res.data
    } catch (error) {
      return [{ name: 'tidak di temukan' }]
    }
  }
  return (
    <Autocomplete
      fullWidth
      margin='normal'
      label='Member'
      field={field.value || []}
      getOption={(option: IMember) => ({
        _id: option?._id,
        name: option?.name,
        handphone: option?.handphone,
        avatar: option?.avatar
      })}
      setFieldValue={(v: IMember) => form.setFieldValue(field.name, v)}
      fetch={fetchSuggestions}
      error={Boolean(meta.error && meta.touched)}
      helperText={meta.error && meta.touched && String(meta.error)}
      renderOption={(option: IMember, props) => (
        <li {...props}>
          <span>{option?.name}</span>
        </li>
      )}
    />
  )
}

interface Props {
  setStopClose: Dispatch<SetStateAction<boolean>>
  value?: IReferral
  handleClose: () => void | null
}
const statuses = ['active', 'inactive']

function FormReferral(props: Props) {
  const { setStopClose, value, handleClose } = props
  const router = useRouter()
  const initialValues: IReferral = {
    _id: value?._id || '',
    name: value?.name || '',
    code: value?.code || '',
    type: value?.type || 'percentage',
    discounts: value?.discounts ? formatNumber(value?.discounts) : '',
    member: value?.member || { _id: '', name: '', handphone: 0 },
    status: value?.status || 'active',
    statusEdit: value?.statusEdit ? true : false,
    updatedAt: value?.updatedAt,
    useCount: value?.useCount || 0
  }

  const validate = (values: IReferral) => {
    const errors: FormikErrors<IReferral> = {}

    if (!values.name) errors.name = 'Required'
    if (!values.code) errors.code = 'Required'
    if (!values.type) errors.type = 'Required'
    if (!values.discounts) errors.discounts = 'Required'
    if (!values.status) errors.status = 'Required'

    return errors
  }

  const onSubmit = async (values: IReferral, formikHelpers: FormikHelpers<IReferral>) => {
    try {
      setStopClose(true)
      const body: ReferralInput = {
        _id: values._id,
        name: values.name,
        code: values.code,
        type: values.type,
        discounts:
          typeof values.discounts === 'number' ? `${values.discounts}` : convertToNumber(values.discounts).toString(),
        status: values.status,
        statusEdit: values.statusEdit,
        updatedAt: values.updatedAt,
        member: values.member._id
      }
      await addOrUpdateReferral(body)
      if (value) formikHelpers.resetForm()
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
      {({ dirty, isSubmitting, values }) => (
        <Form>
          <div className='grid flex-grow grid-cols-6 px-4 pb-4 gap-x-4'>
            <div className='col-span-6'>
              <Field name='name'>
                {({ field, meta }: FieldProps) => (
                  <TextField
                    margin='normal'
                    label='Name'
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
              <Field name='code'>
                {({ field, meta }: FieldProps) => (
                  <TextField
                    label='Code'
                    placeholder='Code...'
                    margin='normal'
                    error={Boolean(meta.error && meta.touched)}
                    helperText={meta.error && meta.touched && String(meta.error)}
                    {...field}
                    fullWidth
                  />
                )}
              </Field>
            </div>
            <div className='col-span-2'>
              <Field name='type'>
                {({ field, meta, form }: FieldProps) => (
                  <Select
                    margin='normal'
                    label='Type'
                    placeholder='Monthly'
                    error={Boolean(meta.error && meta.touched)}
                    helperText={meta.error && meta.touched && String(meta.error)}
                    {...{
                      ...field,
                      onChange: (e: any) => {
                        field.onChange(e)
                        form.setFieldValue('discounts', '')
                      }
                    }}
                    fullWidth
                  >
                    {['percentage', 'nominal'].map(v => (
                      <Option value={v} key={v} className='capitalize'>
                        {v === 'percentage' ? '%' : '$'}
                      </Option>
                    ))}
                  </Select>
                )}
              </Field>
            </div>
            <div className='col-span-4'>
              {values.type === 'percentage' ? (
                <Field name='discounts'>
                  {({ field, meta }: FieldProps) => {
                    const handleChange =
                      (onChange: (e: React.ChangeEvent<any>) => void) =>
                      (event: React.ChangeEvent<HTMLInputElement>) => {
                        const { value } = event.target
                        const numericValue = parseInt(value, 10)

                        if (isNaN(numericValue) || numericValue < 0 || numericValue > 100) {
                          return
                        }

                        onChange(event)
                      }

                    return (
                      <TextField
                        margin='normal'
                        label='Price'
                        placeholder='80'
                        type='number'
                        fullWidth
                        endAdornment={<>%</>}
                        {...field}
                        onChange={handleChange(field.onChange)}
                        error={Boolean(meta.error && meta.touched)}
                        helperText={meta.error && meta.touched && String(meta.error)}
                      />
                    )
                  }}
                </Field>
              ) : (
                <Field name='discounts'>
                  {({ field, meta }: FieldProps) => {
                    function handleNumber(
                      e: ChangeEvent<HTMLInputElement>,
                      onChange: {
                        (e: ChangeEvent<any>): void
                        <T = string | ChangeEvent<any>>(field: T): T extends ChangeEvent<any>
                          ? void
                          : (e: string | ChangeEvent<any>) => void
                      }
                    ) {
                      e.target.value = formatNumber(e.target.value)

                      return onChange(e)
                    }

                    return (
                      <TextField
                        margin='normal'
                        label='Price'
                        placeholder='80'
                        fullWidth
                        startAdornment={<>Rp.</>}
                        {...{
                          ...field,
                          onChange: (e: ChangeEvent<HTMLInputElement>) => handleNumber(e, field.onChange)
                        }}
                        error={Boolean(meta.error && meta.touched)}
                        helperText={meta.error && meta.touched && String(meta.error)}
                      />
                    )
                  }}
                </Field>
              )}
            </div>
            <div className='col-span-6'>
              <Field name='status'>
                {({ field, meta }: FieldProps) => (
                  <Select
                    margin='normal'
                    label='Status'
                    placeholder='Active'
                    error={Boolean(meta.error && meta.touched)}
                    helperText={meta.error && meta.touched && String(meta.error)}
                    {...field}
                    fullWidth
                  >
                    {statuses.map(v => (
                      <Option value={v} key={v} className='capitalize'>
                        {v}
                      </Option>
                    ))}
                  </Select>
                )}
              </Field>
            </div>
            <div className='col-span-6'>
              <Field name='member'>{StudentField}</Field>
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

export default FormReferral
