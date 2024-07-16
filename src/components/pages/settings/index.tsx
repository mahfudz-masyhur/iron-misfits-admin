import { Field, FieldProps, Form, Formik, FormikHelpers } from 'formik'
import { ChangeEvent } from 'react'
import { changeProfile } from 'server/api'
import FieldInputImage from 'src/components/ReuseableComponent/FieldInputImage/OnChange'
import Button from 'src/components/ui/Button'
import TextField from 'src/components/ui/TextField'
import { formatPhoneNumber, toastError } from 'src/components/utility/formats'
import { useAppContext } from 'src/context/AppContext/useAppContext'
import { UserInput } from 'src/type/users'

function ProfilePage() {
  const { auth } = useAppContext()
  const { refetch, user } = auth
  const initialValues: UserInput = {
    _id: '',
    name: user?.name || '',
    email: '',
    avatar: user?.avatar || '',
    password: '',
    role: '',
    handphone: formatPhoneNumber(user?.handphone || '')
  }

  const onSubmit = async (values: UserInput, formikHelpers: FormikHelpers<UserInput>) => {
    try {
      await changeProfile(values)
      if (refetch) await refetch()
    } catch (error: any) {
      toastError(error)
    }
  }

  return (
    <Formik initialValues={initialValues} onSubmit={onSubmit}>
      {({ dirty, isSubmitting, values }) => (
        <Form>
          <div>
            <Field name='avatar'>
              {({ field, form }: FieldProps) => (
                <FieldInputImage
                  imgFile={field.value}
                  onChange={(base64, formData, compress) => {
                    form.setFieldValue(field.name, base64 || null)
                  }}
                  width={151}
                  height={226}
                  maxWidth
                />
              )}
            </Field>
          </div>
          <div className='grid flex-grow grid-cols-6 px-4 pb-4 gap-x-4 gap-y-1'>
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
            <div className='col-span-6 text-right mt-3'>
              <Button type='button' variant='outlined' color='error' disabled={isSubmitting}>
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

export default ProfilePage
