import { Field, FieldProps, Form, Formik, FormikErrors, FormikHelpers } from 'formik'
import { useRouter } from 'next/router'
import { ChangeEvent, Dispatch, SetStateAction } from 'react'
import { addOrUpdatePackage } from 'server/api'
import { IPackage } from 'server/type/Package'
import Button from 'src/components/ui/Button'
import Select from 'src/components/ui/Select'
import Option from 'src/components/ui/Select/Option'
import TextField from 'src/components/ui/TextField'
import { formatNumber, toastError } from 'src/components/utility/formats'
import { IResponsePackages, PackageInput } from 'src/type/package'
import { KeyedMutator } from 'swr'

interface Props {
  setStopClose: Dispatch<SetStateAction<boolean>>
  value?: IPackage
  handleClose: () => void | null
  mutate: KeyedMutator<IResponsePackages>
}
const packageTypes = ['daily', 'weekly', 'monthly', 'quarterly', 'annual']
const statuses = ['active', 'inactive']

function FormPackage(props: Props) {
  const { setStopClose, value, handleClose, mutate } = props
  const initialValues: PackageInput = {
    _id: value?._id || '',
    name: value?.name || '',
    price: value?.price ? formatNumber(value?.price) : '',
    packageType: value?.packageType || 'monthly',
    status: value?.status || 'active',
    statusEdit: value?.statusEdit ? true : false,
    updatedAt: value?.updatedAt
  }

  const validate = (values: PackageInput) => {
    const errors: FormikErrors<PackageInput> = {}

    if (!values.name) errors.name = 'Required'
    if (!values.price) errors.price = 'Required'
    if (!values.packageType) errors.packageType = 'Required'
    if (!values.status) errors.status = 'Required'

    return errors
  }

  const onSubmit = async (values: PackageInput, formikHelpers: FormikHelpers<PackageInput>) => {
    try {
      setStopClose(true)
      await addOrUpdatePackage(values)
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
      {({ dirty, isSubmitting }) => (
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
              <Field name='price'>
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
                      placeholder='180.000'
                      fullWidth
                      startAdornment={<>Rp.</>}
                      {...{
                        ...field,
                        value: field.value || '',
                        onChange: (e: ChangeEvent<HTMLInputElement>) => handleNumber(e, field.onChange)
                      }}
                      error={Boolean(meta.error && meta.touched)}
                      helperText={meta.error && meta.touched && String(meta.error)}
                    />
                  )
                }}
              </Field>
            </div>
            <div className='col-span-6'>
              <Field name='packageType'>
                {({ field, meta }: FieldProps) => (
                  <Select
                    margin='normal'
                    label='Package Type'
                    placeholder='Monthly'
                    error={Boolean(meta.error && meta.touched)}
                    helperText={meta.error && meta.touched && String(meta.error)}
                    {...field}
                    fullWidth
                  >
                    {packageTypes.map(v => (
                      <Option value={v} key={v} className='capitalize'>
                        {v}
                      </Option>
                    ))}
                  </Select>
                )}
              </Field>
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
      )}
    </Formik>
  )
}

export default FormPackage
