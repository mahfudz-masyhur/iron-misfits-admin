import { Field, FieldProps, Form, Formik, FormikErrors, FormikHelpers } from 'formik'
import { useRouter } from 'next/router'
import { Dispatch, SetStateAction, useState } from 'react'
import { getMembers, updateReferralIfStatusEditFalse } from 'server/api'
import { IMember } from 'server/type/Member'
import { IReferral } from 'server/type/Referral'
import Autocomplete from 'src/components/ui/Autocomplete'
import Button from 'src/components/ui/Button'
import Dialog from 'src/components/ui/Dialog'
import IconEditAnimated from 'src/components/ui/Icon/IconEditAnimated'
import IconButton from 'src/components/ui/IconButton'
import Select from 'src/components/ui/Select'
import Option from 'src/components/ui/Select/Option'
import { getURLParams, toastError } from 'src/components/utility/formats'
import { IUpdateReferralIfStatusEditFalse } from 'src/type/referral'

const StudentField = ({ field, form, meta }: FieldProps) => {
  const fetchSuggestions = async (value: string) => {
    try {
      type typeQuery = {
        name: string
        limit: number
      }
      const query: typeQuery = { name: value, limit: 50 }
      const res = await getMembers(undefined, getURLParams(query))

      return res.data
    } catch (error) {
      return [{ name: 'tidak di temukan' }]
    }
  }
  return (
    <Autocomplete
      fullWidth
      margin='normal'
      label='Member'
      field={field.value || []}
      getOption={(option: IMember) => ({
        _id: option?._id,
        name: option?.name,
        handphone: option?.handphone,
        avatar: option?.avatar
      })}
      setFieldValue={(v: IMember) => form.setFieldValue(field.name, v)}
      fetch={fetchSuggestions}
      error={Boolean(meta.error && meta.touched)}
      helperText={meta.error && meta.touched && String(meta.error)}
      renderOption={(option: IMember, props) => (
        <li {...props}>
          <span>{option?.name}</span>
        </li>
      )}
    />
  )
}

interface Props {
  setStopClose: Dispatch<SetStateAction<boolean>>
  value?: IReferral
  handleClose: () => void | null
}
const statuses = ['active', 'inactive']

function FormReferral(props: Props) {
  const { setStopClose, value, handleClose } = props
  const router = useRouter()
  const initialValues: IUpdateReferralIfStatusEditFalse = {
    _id: value?._id || '',
    member: value?.member || { _id: '', name: '', handphone: 0 },
    status: value?.status || 'active',
    updatedAt: value?.updatedAt
  }

  const validate = (values: IUpdateReferralIfStatusEditFalse) => {
    const errors: FormikErrors<IUpdateReferralIfStatusEditFalse> = {}
    if (!values.status) errors.status = 'Required'

    return errors
  }

  const onSubmit = async (
    values: IUpdateReferralIfStatusEditFalse,
    formikHelpers: FormikHelpers<IUpdateReferralIfStatusEditFalse>
  ) => {
    try {
      setStopClose(true)
      await updateReferralIfStatusEditFalse(values._id, values)
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
            <div className='col-span-6'>
              <Field name='member'>{StudentField}</Field>
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

function ReferralEditOnly({ data }: { data: IReferral }) {
  const [open, setOpen] = useState(false)
  const [stopClose, setStopClose] = useState(false)

  const handleOpen = () => setOpen(true)
  const handleClose = () => (stopClose ? null : setOpen(false))

  return (
    <>
      <IconButton sizes='small' variant='text' onClick={handleOpen}>
        <IconEditAnimated fontSize={20} />
      </IconButton>
      <Dialog title='Edit Member' open={open} onClose={handleClose} closeButtom fullWidth maxWidth='md'>
        <div className='px-4 pb-4'>
          <FormReferral value={data} setStopClose={setStopClose} handleClose={handleClose} />
        </div>
      </Dialog>
    </>
  )
}

export default ReferralEditOnly
