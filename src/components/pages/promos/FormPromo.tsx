import { Field, FieldProps, Form, Formik, FormikErrors, FormikHelpers } from 'formik'
import { ChangeEvent, Dispatch, SetStateAction } from 'react'
import DatePicker from 'react-datepicker'
import { addOrUpdatePromo } from 'server/api'
import { IPromo } from 'server/type/Promo'
import Button from 'src/components/ui/Button'
import Select from 'src/components/ui/Select'
import Option from 'src/components/ui/Select/Option'
import TextField from 'src/components/ui/TextField'
import useMediaQuery from 'src/components/utility/UI/useMediaQuery'
import { convertToNumber, formatNumber, toastError } from 'src/components/utility/formats'
import { IResponsePromos, PromoInput } from 'src/type/promo'
import { KeyedMutator } from 'swr'

interface InitialValues {
  _id: string
  name: string
  code: string
  type: 'percentage' | 'nominal'
  discounts: number | string
  date: (Date | undefined)[]
  status: 'active' | 'inactive'
  statusEdit: boolean
  updatedAt?: Date
}

const FieldScheduledUntil = (props: FieldProps) => {
  const { field, form, meta } = props
  let [startDate, endDate] = field.value

  const onChange = (dates: [Date | null, Date | null]) => {
    form.setFieldValue('date', dates, true)
  }
  const sm = !useMediaQuery('sm')

  return (
    <DatePicker
      selected={startDate}
      onChange={onChange}
      startDate={startDate}
      endDate={endDate}
      onBlur={field.onBlur}
      selectsRange
      locale='id-ID'
      monthsShown={sm ? 1 : 2}
      customInput={
        <TextField
          label='Date'
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

interface Props {
  setStopClose: Dispatch<SetStateAction<boolean>>
  value?: IPromo
  handleClose: () => void | null
  mutate: KeyedMutator<IResponsePromos>
}
const statuses = ['active', 'inactive']

function FormPromo(props: Props) {
  const { setStopClose, value, handleClose, mutate } = props
  const initialValues: InitialValues = {
    _id: value?._id || '',
    name: value?.name || '',
    code: value?.code || '',
    date: [value?.startDate || undefined, value?.endDate || undefined],
    type: value?.type || 'percentage',
    discounts: value?.discounts ? formatNumber(value?.discounts) : '',
    status: value?.status || 'active',
    statusEdit: value?.statusEdit ? true : false,
    updatedAt: value?.updatedAt
  }

  const validate = (values: InitialValues) => {
    const errors: FormikErrors<InitialValues> = {}

    if (!values.name) errors.name = 'Required'
    if (!values.code) errors.code = 'Required'
    if (!values.date[0] || !values.date[1]) errors.date = 'Required'
    if (!values.type) errors.type = 'Required'
    if (!values.discounts) errors.discounts = 'Required'
    if (!values.status) errors.status = 'Required'

    return errors
  }

  const onSubmit = async (values: InitialValues, formikHelpers: FormikHelpers<InitialValues>) => {
    try {
      setStopClose(true)
      const body: PromoInput = {
        _id: values._id,
        name: values.name,
        code: values.code,
        type: values.type,
        startDate: values.date[0] as Date,
        endDate: values.date[1] as Date,
        discounts:
          typeof values.discounts === 'number' ? `${values.discounts}` : convertToNumber(values.discounts).toString(),
        status: values.status,
        statusEdit: values.statusEdit,
        updatedAt: values.updatedAt
      }
      await addOrUpdatePromo(body)
      await mutate()
      setStopClose(false)
      handleClose()
    } catch (error: any) {
      toastError(error)
      setStopClose(false)
    }
  }

  return (
    <Formik initialValues={initialValues} validate={validate} onSubmit={onSubmit}>
      {({ dirty, isSubmitting, values }) => {
        return (
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
                <Field name='date'>{FieldScheduledUntil}</Field>
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
        )
      }}
    </Formik>
  )
}

export default FormPromo
