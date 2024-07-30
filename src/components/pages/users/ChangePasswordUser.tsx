import { Field, FieldProps, Form, Formik, FormikErrors, FormikHelpers } from 'formik'
import { Dispatch, SetStateAction, useState } from 'react'
import toast from 'react-hot-toast'
import { changePasswordUser } from 'server/api'
import { IUser } from 'server/type/User'
import Button from 'src/components/ui/Button'
import Dialog from 'src/components/ui/Dialog'
import IconEye from 'src/components/ui/Icon/IconEye'
import IconEyeClose from 'src/components/ui/Icon/IconEyeClose'
import IconPasswordDuotone from 'src/components/ui/Icon/IconPasswordDuotone'
import IconButton from 'src/components/ui/IconButton'
import TextField from 'src/components/ui/TextField'
import Typography from 'src/components/ui/Typograph'
import { toastError } from 'src/components/utility/formats'
import { ChangePasswordBody, IResponseUsers } from 'src/type/users'
import { KeyedMutator } from 'swr'

interface Props {
  mutate: KeyedMutator<IResponseUsers>
  data: IUser
}

interface FormFormikProps {
  setStopClose: Dispatch<SetStateAction<boolean>>
  value: IUser
  handleClose: () => void | null
  mutate: KeyedMutator<IResponseUsers>
}

const FormFormik = ({ handleClose, mutate, setStopClose, value }: FormFormikProps) => {
  const initialValues: ChangePasswordBody = {
    newPassword: '',
    confirmNewPassword: '',
    email: value.email,
    updatedAt: value.updatedAt || new Date()
  }

  const validate = (value: ChangePasswordBody) => {
    const errors: FormikErrors<ChangePasswordBody> = {}

    if (!value.newPassword) errors.newPassword = 'Kolom ini wajib diisi'
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
  const onSubmit = async (values: ChangePasswordBody, action: FormikHelpers<ChangePasswordBody>) => {
    try {
      setStopClose(true)
      await changePasswordUser(value._id, values)
      await mutate()
      setStopClose(false)
      handleClose()
      toast.success('Password changed successfully')
    } catch (error: any) {
      toastError(error)
      setStopClose(false)
    }
  }

  return (
    <Formik initialValues={initialValues} validate={validate} onSubmit={onSubmit}>
      {({ dirty, isSubmitting }) => (
        <Form>
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

function ChangePasswordUser({ data, mutate }: Props) {
  const [open, setOpen] = useState(false)
  const [stopClose, setStopClose] = useState(false)

  const handleOpen = () => setOpen(true)
  const handleClose = () => (stopClose ? null : setOpen(false))

  return (
    <>
      <IconButton sizes='small' color='warning' variant='text' onClick={handleOpen}>
        <IconPasswordDuotone fontSize={20} />
      </IconButton>
      <Dialog title='Change password user' open={open} onClose={handleClose} closeButtom fullWidth maxWidth='md'>
        <div className='px-4 pb-4'>
          <FormFormik value={data} setStopClose={setStopClose} handleClose={handleClose} mutate={mutate} />
        </div>
      </Dialog>
    </>
  )
}

export default ChangePasswordUser
