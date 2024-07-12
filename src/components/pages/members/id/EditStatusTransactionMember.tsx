import { Field, FieldProps, Form, Formik, FormikErrors, FormikHelpers } from 'formik'
import { useRouter } from 'next/router'
import { Dispatch, SetStateAction, useState } from 'react'
import { addOrUpdateTransaction, updateStatusTransaction } from 'server/api'
import { ITransaction } from 'server/type/Transaction'
import Button from 'src/components/ui/Button'
import Dialog from 'src/components/ui/Dialog'
import IconEdit from 'src/components/ui/Icon/IconEdit'
import IconButton from 'src/components/ui/IconButton'
import Select from 'src/components/ui/Select'
import Option from 'src/components/ui/Select/Option'
import { toastError } from 'src/components/utility/formats'
import { STATUS } from 'src/constant'

export interface updateStatusTransactionValue {
  _id: string
  status: 'PENDING' | 'ACTIVE' | 'INACTIVE'
  updatedAt: Date | undefined
}

interface Props {
  setStopClose: Dispatch<SetStateAction<boolean>>
  value?: ITransaction
  handleClose: () => void | null
}
const FormTransactionMember = (props: Props) => {
  const { setStopClose, value, handleClose } = props
  const router = useRouter()
  const initialValues: updateStatusTransactionValue = {
    _id: value?._id || '',
    status: value?.status || 'ACTIVE',
    updatedAt: value?.updatedAt
  }

  const validate = (values: updateStatusTransactionValue) => {
    const errors: FormikErrors<updateStatusTransactionValue> = {}
    if (!values.status) errors.status = 'Diperlukan!'

    return errors
  }

  const onSubmit = async (values: updateStatusTransactionValue, formikHelpers: FormikHelpers<any>) => {
    try {
      setStopClose(true)
      await updateStatusTransaction(values as any)
      setStopClose(false)
      await router.push(router.asPath)
      handleClose()
    } catch (error: any) {
      toastError(error)
      setStopClose(false)
    }
  }

  return (
    <Formik initialValues={initialValues} validate={validate} onSubmit={onSubmit}>
      {({ dirty, isSubmitting }) => {
        return (
          <Form className='grid flex-grow grid-cols-6 px-4 pb-4 gap-x-4'>
            <div className='col-span-6'>
              <Field name='status'>
                {({ field, meta }: FieldProps) => (
                  <Select
                    margin='normal'
                    label='Status'
                    fullWidth
                    {...field}
                    error={Boolean(meta.error && meta.touched)}
                    helperText={meta.error && meta.touched && String(meta.error)}
                  >
                    {STATUS.map(v => (
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
          </Form>
        )
      }}
    </Formik>
  )
}

function EditStatusTransactionMember({ value }: { value: ITransaction }) {
  const [open, setOpen] = useState(false)
  const [stopClose, setStopClose] = useState(false)

  const handleOpen = () => setOpen(true)
  const handleClose = () => (stopClose ? null : setOpen(false))

  return (
    <>
      <IconButton sizes='small' variant='text' onClick={handleOpen}>
        <IconEdit fontSize={20} />
      </IconButton>
      <Dialog title='Transaction Member' open={open} onClose={handleClose} closeButtom fullWidth maxWidth='md'>
        <div className='px-4 pb-4'>
          <FormTransactionMember value={value} setStopClose={setStopClose} handleClose={handleClose} />
        </div>
      </Dialog>
    </>
  )
}

export default EditStatusTransactionMember
