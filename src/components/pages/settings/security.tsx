import { Field, FieldProps, Form, Formik, FormikErrors, FormikHelpers } from 'formik'
import { ChangeEvent, useState } from 'react'
import toast from 'react-hot-toast'
import { resetMyPassword } from 'server/api'
import FieldInputImage from 'src/components/ReuseableComponent/FieldInputImage/OnChange'
import Button from 'src/components/ui/Button'
import IconEye from 'src/components/ui/Icon/IconEye'
import IconEyeClose from 'src/components/ui/Icon/IconEyeClose'
import TextField from 'src/components/ui/TextField'
import Typography from 'src/components/ui/Typograph'
import { formatPhoneNumber, toastError } from 'src/components/utility/formats'
import { useAppContext } from 'src/context/AppContext/useAppContext'

export type ChangePasswordInputValue = {
  newPassword: string
  currentPassword: string
  confirmNewPassword: string
}

function SecurityPage() {
  const { auth } = useAppContext()
  const { refetch } = auth

  const initialValues: ChangePasswordInputValue = {
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: ''
  }

  const validate = (value: ChangePasswordInputValue) => {
    const errors: FormikErrors<ChangePasswordInputValue> = {}

    if (!value.newPassword) errors.newPassword = 'Kolom ini wajib diisi'
    if (!value.currentPassword) errors.currentPassword = 'Kolom ini wajib diisi'
    if (!value.confirmNewPassword) errors.confirmNewPassword = 'Kolom ini wajib diisi'
    if (value.confirmNewPassword !== value.newPassword) errors.confirmNewPassword = 'Kata sandi harus cocok'

    return errors
  }

  // ** States
  interface State {
    showNewPassword: boolean
    showCurrentPassword: boolean
    showConfirmNewPassword: boolean
  }
  const [values, setValues] = useState<State>({
    showNewPassword: false,
    showCurrentPassword: false,
    showConfirmNewPassword: false
  })

  // ** Hooks
  const onSubmit = async (value: ChangePasswordInputValue, action: FormikHelpers<ChangePasswordInputValue>) => {
    try {
      await resetMyPassword(value)
      toast.success('Password changed successfully')
      action.resetForm()
    } catch (error: any) {
      toastError(error)
    }
  }

  return (
    <Formik initialValues={initialValues} validate={validate} onSubmit={onSubmit}>
      {({ dirty, isSubmitting }) => (
        <Form>
          <div className='grid grid-cols-2 gap-x-4'>
            <div className='col-span-2 md:col-span-1'>
              <Field
                type={values.showCurrentPassword ? 'text' : 'password'}
                id='currentPassword'
                name='currentPassword'
                validateOnBlur
                validateOnChange
              >
                {({ field, meta }: FieldProps) => (
                  <TextField
                    {...field}
                    id='currentPassword'
                    label='Password saat ini'
                    type={values.showCurrentPassword ? 'text' : 'password'}
                    fullWidth
                    margin='normal'
                    error={Boolean(meta.error && meta.touched)}
                    helperText={meta.error && meta.touched && String(meta.error)}
                    endAdornment={
                      <button
                        className='block text-text-secondary'
                        type='button'
                        onClick={() => setValues(p => ({ ...p, showCurrentPassword: !p.showCurrentPassword }))}
                      >
                        {values.showCurrentPassword ? <IconEye /> : <IconEyeClose />}
                      </button>
                    }
                  />
                )}
              </Field>
            </div>
          </div>
          <div className='grid grid-cols-2 gap-x-4'>
            <div className='col-span-2 md:col-span-1'>
              <Field
                type={values.showNewPassword ? 'text' : 'password'}
                id='newPassword'
                name='newPassword'
                validateOnBlur
                validateOnChange
              >
                {({ field, meta }: FieldProps) => (
                  <TextField
                    {...field}
                    id='newPassword'
                    label='Password Baru'
                    type={values.showNewPassword ? 'text' : 'password'}
                    fullWidth
                    margin='normal'
                    error={Boolean(meta.error && meta.touched)}
                    helperText={meta.error && meta.touched && String(meta.error)}
                    endAdornment={
                      <button
                        className='block text-text-secondary'
                        type='button'
                        onClick={() => setValues(p => ({ ...p, showNewPassword: !p.showNewPassword }))}
                      >
                        {values.showNewPassword ? <IconEye /> : <IconEyeClose />}
                      </button>
                    }
                  />
                )}
              </Field>
            </div>
            <div className='col-span-2 md:col-span-1'>
              <Field
                type={values.showConfirmNewPassword ? 'text' : 'password'}
                id='confirmNewPassword'
                name='confirmNewPassword'
                validateOnBlur
                validateOnChange
              >
                {({ field, meta }: FieldProps) => (
                  <TextField
                    {...field}
                    id='confirmNewPassword'
                    label='Ulangi Password Baru'
                    type={values.showConfirmNewPassword ? 'text' : 'password'}
                    fullWidth
                    margin='normal'
                    error={Boolean(meta.error && meta.touched)}
                    helperText={meta.error && meta.touched && String(meta.error)}
                    endAdornment={
                      <button
                        className='block text-text-secondary'
                        type='button'
                        onClick={() => setValues(p => ({ ...p, showConfirmNewPassword: !p.showConfirmNewPassword }))}
                      >
                        {values.showConfirmNewPassword ? <IconEye /> : <IconEyeClose />}
                      </button>
                    }
                  />
                )}
              </Field>
            </div>
          </div>
          <div className='grid grid-cols-2 gap-x-4'>
            <div className='col-span-2 md:col-span-1'>
              <Typography component='h6' variant='subtitle1' fontWeight='semibold' gutterBottom>
                Persyaratan kata sandi
              </Typography>
              <ol className='ml-5 list-decimal'>
                <li>Kata sandi harus minimal 6 Karakter</li>
              </ol>
            </div>
          </div>
          <div className='text-right mt-4'>
            <Button type='reset' variant='outlined' disabled={isSubmitting || !dirty}>
              Reset
            </Button>{' '}
            <Button type='submit' loading={isSubmitting} disabled={isSubmitting || !dirty}>
              Simpan Perubahan
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  )
}

export default SecurityPage
