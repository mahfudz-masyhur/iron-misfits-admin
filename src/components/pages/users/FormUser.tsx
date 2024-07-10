import { Field, FieldProps, Form, Formik, FormikErrors, FormikHelpers } from 'formik'
import { useRouter } from 'next/router'
import { ChangeEvent, Dispatch, SetStateAction } from 'react'
import { addOrUpdateUser } from 'server/api'
import { IUser } from 'server/type/User'
import Button from 'src/components/ui/Button'
import Select from 'src/components/ui/Select'
import Option from 'src/components/ui/Select/Option'
import TextField from 'src/components/ui/TextField'
import Tooltip from 'src/components/ui/Tolltip'
import { formatDate, formatPhoneNumber, toastError } from 'src/components/utility/formats'
import { UserInput } from 'src/type/users'
import FieldInputImage from 'src/components/ReuseableComponent/FieldInputImage/OnChange'
import IconInfo from 'src/components/ui/Icon/IconInfo'

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
    handphone: value?.handphone ? formatPhoneNumber(value?.handphone) : undefined
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
      handleClose()
    } catch (error: any) {
      toastError(error)
      setStopClose(false)
    }
  }

  return (
    <Formik initialValues={initialValues} validate={validate} onSubmit={onSubmit}>
      {({ dirty, isSubmitting, values }) => (
        <Form className='relative flex flex-col gap-4 sm:flex-row'>
          {/* <img src={values.avatar} width={151} height={226} style={{ width: 151, height: 226 }} /> */}
          <div style={{ minWidth: 151 }}>
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

            {value && (
              <Tooltip
                classNames={{ button: 'absolute bottom-5 left-3' }}
                title={
                  <>
                    <div>
                      <span className='text-xs capitalize'>Dibuat oleh:</span> {value?.creator?.name}
                    </div>
                    <div>
                      <span className='text-xs capitalize'>Dibuat pada:</span> {formatDate(value?.createdAt)}
                    </div>
                    <br />
                    <div>
                      <span className='text-xs capitalize'>Diedit oleh:</span> {value?.lastEditedBy?.name}
                    </div>
                    <div>
                      <span className='text-xs capitalize'>Diedit pada:</span> {formatDate(value?.updatedAt)}
                    </div>
                  </>
                }
                anchor='top-start'
                arrow
              >
                <IconInfo />
              </Tooltip>
            )}
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
            <div className='col-span-6 text-right mt-3'>
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

export default FormUser
