import { Field, FieldProps, Form, Formik, FormikHelpers } from 'formik'
import { useRouter } from 'next/router'
import { Dispatch, SetStateAction, useState } from 'react'
import { ISocialMedia } from 'server/type/Member'
import { ITransaction } from 'server/type/Transaction'
import Button from 'src/components/ui/Button'
import Dialog from 'src/components/ui/Dialog'
import IconDots from 'src/components/ui/Icon/IconDots'
import IconButton from 'src/components/ui/IconButton'
import Select from 'src/components/ui/Select'
import Option from 'src/components/ui/Select/Option'
import TextField from 'src/components/ui/TextField'
import { removeEmptyStringProperties, removeUndefinedProperties } from 'src/components/utility/formats'
import { STATUS } from 'src/constant'

interface FormikFormProps {
  handleClose: () => void | null
  setStopClose: Dispatch<SetStateAction<boolean>>
}

function FormikForm({ handleClose, setStopClose }: FormikFormProps) {
  const router = useRouter()

  interface MemberInput extends ISocialMedia {
    registrationFee: string
    transactionStatus: ITransaction['status'] | undefined
  }

  const initialValues: MemberInput = {
    registrationFee: (router.query.registrationFee as string) || '',
    transactionStatus: undefined,
    key: '',
    value: ''
  }

  const validate = (values: MemberInput) => {
    const errors: any = {}
    return errors
  }

  const onSubmit = (values: MemberInput, formikHelpers: FormikHelpers<MemberInput>) => {
    setStopClose(true)
    router.push({ query: removeUndefinedProperties(removeEmptyStringProperties(values)) })
    setStopClose(false)
    handleClose()
  }

  function handleReset() {
    router.push({ query: {} })
    handleClose()
  }

  return (
    <Formik initialValues={initialValues} validate={validate} onSubmit={onSubmit}>
      {({ dirty, isSubmitting }) => (
        <Form className='relative flex flex-col gap-4 sm:flex-row'>
          <div className='grid flex-grow grid-cols-6 px-4 pb-4 gap-x-4'>
            <div className='col-span-6'>
              <Field name='registrationFee'>
                {({ field, meta }: FieldProps) => (
                  <TextField
                    margin='normal'
                    type='number'
                    label='Registration Fee'
                    error={Boolean(meta.error && meta.touched)}
                    helperText={meta.error && meta.touched && String(meta.error)}
                    {...field}
                    fullWidth
                  />
                )}
              </Field>
              <Field name='transactionStatus'>
                {({ field, meta }: FieldProps) => (
                  <Select
                    margin='normal'
                    label='Transaction Status'
                    error={Boolean(meta.error && meta.touched)}
                    helperText={meta.error && meta.touched && String(meta.error)}
                    {...field}
                    fullWidth
                  >
                    {STATUS.map(v => (
                      <Option key={v} value={v}>
                        {v}
                      </Option>
                    ))}
                  </Select>
                )}
              </Field>
            </div>
            <div className='col-span-6 text-right mt-2'>
              <Button type='button' variant='outlined' color='warning' onClick={handleReset} disabled={isSubmitting}>
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

function FilterTransactions() {
  const [open, setOpen] = useState(false)
  const [stopClose, setStopClose] = useState(false)

  const handleOpen = () => setOpen(true)
  const handleClose = () => (stopClose ? null : setOpen(false))

  return (
    <>
      <div>
        <IconButton variant='text' onClick={handleOpen}>
          <IconDots fontSize={20} />
        </IconButton>
      </div>
      <Dialog open={open} onClose={handleClose} title='Filter Transaction' closeButtom>
        {/* <FormikForm setStopClose={setStopClose} handleClose={handleClose} /> */}
      </Dialog>
    </>
  )
}

export default FilterTransactions
