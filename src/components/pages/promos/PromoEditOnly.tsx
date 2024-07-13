import { Field, FieldProps, Form, Formik, FormikErrors, FormikHelpers } from 'formik'
import { useRouter } from 'next/router'
import { Dispatch, SetStateAction, useState } from 'react'
import { updatePromoIfStatusEditFalse } from 'server/api'
import { IPromo } from 'server/type/Promo'
import Button from 'src/components/ui/Button'
import Dialog from 'src/components/ui/Dialog'
import IconEditAnimated from 'src/components/ui/Icon/IconEditAnimated'
import IconButton from 'src/components/ui/IconButton'
import Select from 'src/components/ui/Select'
import Option from 'src/components/ui/Select/Option'
import { toastError } from 'src/components/utility/formats'
import { IupdatePromoIfStatusEditFalse } from 'src/type/promo'

interface Props {
  setStopClose: Dispatch<SetStateAction<boolean>>
  value?: IPromo
  handleClose: () => void | null
}
const statuses = ['active', 'inactive']

function FormPromo(props: Props) {
  const { setStopClose, value, handleClose } = props
  const router = useRouter()
  const initialValues: IupdatePromoIfStatusEditFalse = {
    _id: value?._id || '',
    status: value?.status || 'active',
    updatedAt: value?.updatedAt
  }

  const validate = (values: IupdatePromoIfStatusEditFalse) => {
    const errors: FormikErrors<IupdatePromoIfStatusEditFalse> = {}

    if (!values.status) errors.status = 'Required'

    return errors
  }

  const onSubmit = async (
    values: IupdatePromoIfStatusEditFalse,
    formikHelpers: FormikHelpers<IupdatePromoIfStatusEditFalse>
  ) => {
    try {
      setStopClose(true)
      await updatePromoIfStatusEditFalse(values._id, values)
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
      {({ dirty, isSubmitting, values }) => {
        return (
          <Form>
            <div className='grid flex-grow grid-cols-6 px-4 pb-4 gap-x-4'>
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

function PromoEditOnly({ data }: { data: IPromo }) {
  const [open, setOpen] = useState(false)
  const [stopClose, setStopClose] = useState(false)

  const handleOpen = () => setOpen(true)
  const handleClose = () => (stopClose ? null : setOpen(false))

  return (
    <>
      <IconButton sizes='small' variant='text' onClick={handleOpen}>
        <IconEditAnimated fontSize={20} />
      </IconButton>
      <Dialog title='Edit Promo' open={open} onClose={handleClose} closeButtom fullWidth maxWidth='md'>
        <div className='px-4 pb-4'>
          <FormPromo value={data} setStopClose={setStopClose} handleClose={handleClose} />
        </div>
      </Dialog>
    </>
  )
}

export default PromoEditOnly
