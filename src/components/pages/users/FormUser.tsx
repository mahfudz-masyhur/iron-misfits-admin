import { Field, FieldProps, Form, Formik, FormikErrors, FormikHelpers } from 'formik'
import { useRouter } from 'next/router'
import { ChangeEvent, Dispatch, SetStateAction } from 'react'
import { addOrUpdateUser } from 'server/api'
import { IUser } from 'server/type/User'
import Button from 'src/components/ui/Button'
import Select from 'src/components/ui/Select'
import Option from 'src/components/ui/Select/Option'
import TextField from 'src/components/ui/TextField'
import { formatPhoneNumber, toastError } from 'src/components/utility/formats'
import { UserInput } from 'src/type/users'

interface Props {
  setStopClose: Dispatch<SetStateAction<boolean>>
  value?: IUser
  handleClose: () => void | null
}

function FormUser(props: Props) {
  const { setStopClose, value, handleClose } = props
  const router = useRouter()
  const initialValues: UserInput = {
    _id: value?._id || '',
    name: value?.name || '',
    email: value?.email || '',
    avatar: value?.avatar || '',
    password: value?.password || '',
    role: value?.role[0] ? `${value?.role[0]}` : `${1}`,
    handphone: value?.handphone || undefined
  }

  const validate = (values: UserInput) => {
    const errors: FormikErrors<UserInput> = {}

    if (!values.name) errors.name = 'Required'
    if (!values.email) errors.email = 'Required'
    if (!values.role) errors.role = 'Required'

    return errors
  }

  const onSubmit = async (values: UserInput, formikHelpers: FormikHelpers<UserInput>) => {
    try {
      setStopClose(true)
      const data = await addOrUpdateUser(values)
      if (value) formikHelpers.resetForm()
      await router.push(router.asPath)
      setStopClose(false)
      console.log(data)
      handleClose()
    } catch (error: any) {
      toastError(error)
      setStopClose(false)
    }
  }

  return (
    <Formik initialValues={initialValues} validate={validate} onSubmit={onSubmit}>
      {({ dirty, isSubmitting }) => (
        <Form className='grid grid-cols-6 gap-2'>
          <div className='col-span-6 sm:col-span-6'>
            <Field name='name'>
              {({ field, meta }: FieldProps) => (
                <TextField
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
          <div className='col-span-6 sm:col-span-6'>
            <Field name='email'>
              {({ field, meta }: FieldProps) => (
                <TextField
                  type='email'
                  label='Email'
                  placeholder='johnDoe@email.com'
                  error={Boolean(meta.error && meta.touched)}
                  helperText={meta.error && meta.touched && String(meta.error)}
                  {...field}
                  fullWidth
                />
              )}
            </Field>
          </div>
          <div className='col-span-6 sm:col-span-6'>
            <Field name='role'>
              {({ field, meta }: FieldProps) => (
                <Select
                  fullWidth
                  label='Peran'
                  placeholder='Pilih Role'
                  {...field}
                  error={Boolean(meta.error && meta.touched)}
                  helperText={meta.error && meta.touched && String(meta.error)}
                >
                  <Option value='1'>Admin</Option>
                  <Option value='2'>Viewer</Option>
                </Select>
              )}
            </Field>
          </div>
          <div className='col-span-6 sm:col-span-6'>
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
                    label='Handphone'
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
          <div className='col-span-6 text-right'>
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

export default FormUser
