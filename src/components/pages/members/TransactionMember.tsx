import { Field, FieldProps, Form, Formik, FormikHelpers } from 'formik'
import { useRouter } from 'next/router'
import { Dispatch, SetStateAction, useState } from 'react'
import { IMember } from 'server/type/Member'
import Button from 'src/components/ui/Button'
import Dialog from 'src/components/ui/Dialog'
import IconTransaction from 'src/components/ui/Icon/IconTransaction'
import IconButton from 'src/components/ui/IconButton'
import TextField from 'src/components/ui/TextField'
import { toastError } from 'src/components/utility/formats'

interface Props {
  setStopClose: Dispatch<SetStateAction<boolean>>
  member: IMember
  handleClose: () => void | null
}

const FormMember = (props: Props) => {
  const { setStopClose, member, handleClose } = props
  const router = useRouter()
  const initialValues: any = {}

  const validate = (values: any) => {
    const errors: any = {}

    return errors
  }

  const onSubmit = async (values: any, formikHelpers: FormikHelpers<any>) => {
    try {
      setStopClose(true)
      await console.log(values)
      formikHelpers.resetForm()
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

function TransactionMember({ data }: { data: IMember }) {
  const [open, setOpen] = useState(false)
  const [stopClose, setStopClose] = useState(false)

  const handleOpen = () => setOpen(true)
  const handleClose = () => (stopClose ? null : setOpen(false))

  return (
    <>
      <IconButton sizes='small' variant='text' color='success' onClick={handleOpen}>
        <IconTransaction fontSize={20} />
      </IconButton>
      <Dialog title='Transaction Member' open={open} onClose={handleClose} closeButtom fullWidth maxWidth='md'>
        <div className='px-4 pb-4'>
          <FormMember member={data} setStopClose={setStopClose} handleClose={handleClose} />
        </div>
      </Dialog>
    </>
  )
}

export default TransactionMember
