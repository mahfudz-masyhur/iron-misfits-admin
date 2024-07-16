import { useState } from 'react'
import { IPackage } from 'server/type/Package'
import Dialog from 'src/components/ui/Dialog'
import IconEditAnimated from 'src/components/ui/Icon/IconEditAnimated'
import IconButton from 'src/components/ui/IconButton'
import { Field, FieldProps, Form, Formik, FormikErrors, FormikHelpers } from 'formik'
import { useRouter } from 'next/router'
import { ChangeEvent, Dispatch, SetStateAction } from 'react'
import { addOrUpdatePackage, updatePackageIfStatusEditFalse } from 'server/api'
import Button from 'src/components/ui/Button'
import Select from 'src/components/ui/Select'
import Option from 'src/components/ui/Select/Option'
import TextField from 'src/components/ui/TextField'
import { formatNumber, toastError } from 'src/components/utility/formats'
import { IResponsePackages, IUpdatePackageIfStatusEditFalse } from 'src/type/package'
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
  const initialValues: IUpdatePackageIfStatusEditFalse = {
    _id: value?._id || '',
    status: value?.status || 'active',
    updatedAt: value?.updatedAt
  }

  const validate = (values: IUpdatePackageIfStatusEditFalse) => {
    const errors: FormikErrors<IUpdatePackageIfStatusEditFalse> = {}

    if (!values.status) errors.status = 'Required'

    return errors
  }

  const onSubmit = async (
    values: IUpdatePackageIfStatusEditFalse,
    formikHelpers: FormikHelpers<IUpdatePackageIfStatusEditFalse>
  ) => {
    try {
      setStopClose(true)
      await updatePackageIfStatusEditFalse(values._id, values)
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

function PackageEditOnly({ data, mutate }: { data: IPackage; mutate: KeyedMutator<IResponsePackages> }) {
  const [open, setOpen] = useState(false)
  const [stopClose, setStopClose] = useState(false)

  const handleOpen = () => setOpen(true)
  const handleClose = () => (stopClose ? null : setOpen(false))

  return (
    <>
      <IconButton sizes='small' variant='text' onClick={handleOpen}>
        <IconEditAnimated fontSize={20} />
      </IconButton>
      <Dialog title='Edit Package' open={open} onClose={handleClose} closeButtom fullWidth maxWidth='md'>
        <div className='px-4 pb-4'>
          <FormPackage value={data} setStopClose={setStopClose} handleClose={handleClose} mutate={mutate} />
        </div>
      </Dialog>
    </>
  )
}

export default PackageEditOnly
