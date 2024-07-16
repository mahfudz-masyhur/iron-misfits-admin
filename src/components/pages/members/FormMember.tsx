import { Field, FieldArray, FieldProps, Form, Formik, FormikHelpers } from 'formik'
import { useRouter } from 'next/router'
import { ChangeEvent, Dispatch, SetStateAction } from 'react'
import { addOrUpdateMember } from 'server/api'
import { IMember } from 'server/type/Member'
import FieldInputImage from 'src/components/ReuseableComponent/FieldInputImage/OnChange'
import Button from 'src/components/ui/Button'
import IconInfo from 'src/components/ui/Icon/IconInfo'
import IconMinus from 'src/components/ui/Icon/IconMinus'
import IconPlus from 'src/components/ui/Icon/IconPlus'
import IconButton from 'src/components/ui/IconButton'
import TextField from 'src/components/ui/TextField'
import Tooltip from 'src/components/ui/Tolltip'
import Typography from 'src/components/ui/Typograph'
import { formatDate, formatNumber, formatPhoneNumber, toastError } from 'src/components/utility/formats'
import { IResponseMembers, MemberInput } from 'src/type/member'
import { KeyedMutator } from 'swr'

interface Props {
  setStopClose: Dispatch<SetStateAction<boolean>>
  value?: IMember
  handleClose: () => void | null
  mutate: KeyedMutator<IResponseMembers>
}

const SocialmediaField = (props: FieldProps) => {
  return (
    <FieldArray name={props.field.name}>
      {({ remove, push }) => (
        <div>
          {props.field.value?.map((v: any, i: number) => (
            <div className='grid grid-cols-6 gap-1 items-center' key={`${i}`}>
              <div className='col-span-2 flex gap-1 items-center'>
                <Field name={`${props.field.name}.${i}.key`}>
                  {({ field, form, meta }: FieldProps) => (
                    <TextField
                      margin='dense'
                      sizes='small'
                      placeholder='ig'
                      fullWidth
                      {...field}
                      error={Boolean(meta.error && meta.touched)}
                      helperText={meta.error && meta.touched && String(meta.error)}
                    />
                  )}
                </Field>
                :
              </div>
              <div className='col-span-4 flex gap-1 items-center'>
                <Field name={`${props.field.name}.${i}.value`}>
                  {({ field, form, meta }: FieldProps) => (
                    <TextField
                      margin='dense'
                      sizes='small'
                      placeholder='ig'
                      fullWidth
                      {...field}
                      error={Boolean(meta.error && meta.touched)}
                      helperText={meta.error && meta.touched && String(meta.error)}
                    />
                  )}
                </Field>
                <IconButton type='button' onClick={() => remove(i)} sizes='small' variant='text' color='error'>
                  <IconMinus fontSize={15} />
                </IconButton>
              </div>
            </div>
          ))}
          <div>
            <Button
              type='button'
              onClick={() => push({ key: '', value: '' })}
              sizes='small'
              variant='text'
              fullWidth
              startIcon={<IconPlus fontSize={15} />}
            >
              Add Social Media
            </Button>
          </div>
        </div>
      )}
    </FieldArray>
  )
}

function FormMember(props: Props) {
  const { setStopClose, value, handleClose, mutate } = props
  const initialValues: MemberInput = {
    _id: value?._id || '',
    name: value?.name || '',
    avatar: value?.avatar || '',
    handphone: value?.handphone ? `${formatPhoneNumber(value?.handphone)}` : '',
    registrationFee: value?.registrationFee ? formatNumber(value?.registrationFee) : '',
    socialmedia: value?.socialmedia || [{ key: 'ig', value: '' }],
    updatedAt: value?.updatedAt
  }

  const validate = (values: MemberInput) => {
    const errors: any = {}

    if (!values.name) errors.name = 'Required'
    if (!values.registrationFee) errors.registrationFee = 'Required'
    if (!values.handphone) errors.handphone = 'Required'

    if (values.socialmedia) {
      values.socialmedia.forEach((social, index) => {
        if (!social.key) {
          errors.socialmedia = errors.socialmedia || []
          errors.socialmedia[index] = errors.socialmedia[index] || {}
          errors.socialmedia[index].key = 'Required'
        }
        if (!social.value) {
          errors.socialmedia = errors.socialmedia || []
          errors.socialmedia[index] = errors.socialmedia[index] || {}
          errors.socialmedia[index].value = 'Required'
        }
      })
    }

    return errors
  }

  const onSubmit = async (values: MemberInput, formikHelpers: FormikHelpers<MemberInput>) => {
    try {
      setStopClose(true)
      await addOrUpdateMember(values)
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
        <Form className='relative flex flex-col gap-4 sm:flex-row'>
          <div style={{ minWidth: 151 }}>
            <Field name='avatar'>
              {({ field, form }: FieldProps) => (
                <FieldInputImage
                  imgFile={field.value}
                  onChange={base64 => {
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
            <div className='col-span-6'>
              <Field name='registrationFee'>
                {({ field, meta }: FieldProps) => {
                  function handleNumber(
                    e: ChangeEvent<HTMLInputElement>,
                    onChange: {
                      (e: ChangeEvent<any>): void
                      <T = string | ChangeEvent<any>>(field: T): T extends ChangeEvent<any>
                        ? void
                        : (e: string | ChangeEvent<any>) => void
                    }
                  ) {
                    e.target.value = formatNumber(e.target.value)

                    return onChange(e)
                  }

                  return (
                    <TextField
                      margin='normal'
                      label='Regisration Fee'
                      placeholder='50.000'
                      fullWidth
                      startAdornment={<>Rp.</>}
                      {...{
                        ...field,
                        onChange: (e: ChangeEvent<HTMLInputElement>) => handleNumber(e, field.onChange)
                      }}
                      error={Boolean(meta.error && meta.touched)}
                      helperText={meta.error && meta.touched && String(meta.error)}
                    />
                  )
                }}
              </Field>
            </div>
            <div className='col-span-6'>
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
                      margin='normal'
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
            <div className='col-span-6'>
              <Typography variant='subtitle2' className='-mb-1'>
                Social Media
              </Typography>
              <Field name='socialmedia'>{SocialmediaField}</Field>
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

export default FormMember
