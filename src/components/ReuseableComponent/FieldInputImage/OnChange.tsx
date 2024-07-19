import Image from 'next/image'
import Pica from 'pica'
import { CSSProperties, ChangeEvent, Dispatch, MouseEvent, SetStateAction, useCallback, useRef, useState } from 'react'
import AvatarEditor from 'react-avatar-editor'
import { useDropzone } from 'react-dropzone'
import toast from 'react-hot-toast'
import Button from 'src/components/ui/Button'
import CircularProgress from 'src/components/ui/CircularProgress'
import Dialog from 'src/components/ui/Dialog'
import IconAlertCircleTwotone from 'src/components/ui/Icon/IconAlertCircleTwotone'
import IconDelete from 'src/components/ui/Icon/IconDelete'
import IconButton from 'src/components/ui/IconButton'
import Typography from 'src/components/ui/Typograph'
import { convertToPixelSize } from 'src/components/utility/formats'
import { useAppContext } from 'src/context/AppContext/useAppContext'
import { twMerge } from 'tailwind-merge'

interface AvatarEditorFieldProps {
  width: CSSProperties['width']
  height: CSSProperties['height']
  image: string
  onClose: () => void
  onChange: (base64: string, formData: FormData | null, base64Compres?: string) => void
  compressedQuality?: 0.1 | 0.2 | 0.3 | 0.4 | 0.5 | 0.6 | 0.7 | 0.8 | 0.9 | 1
}

const AvatarEditorField = ({ width, height, image, onClose, onChange, compressedQuality }: AvatarEditorFieldProps) => {
  const [zoom, setZoom] = useState(1.2)
  const [load, setLoad] = useState(false)

  const { auth } = useAppContext()
  const { user } = auth

  const editor = useRef<AvatarEditor | null>(null)

  const handleScale = (event: ChangeEvent<HTMLInputElement>) => {
    const newZoom = parseFloat(event.target.value)
    setZoom(newZoom)
  }

  async function onSave(event: MouseEvent<HTMLButtonElement>) {
    try {
      event.preventDefault()
      if (editor.current !== null) {
        setLoad(true)
        const canvas = editor.current.getImageScaledToCanvas()
        const originalBase64 = canvas.toDataURL('image/jpeg')

        // Kompresi gambar dengan Pica
        const pica = new Pica()
        const compressedCanvas = document.createElement('canvas')
        compressedCanvas.width = canvas.width
        compressedCanvas.height = canvas.height

        await pica.resize(canvas, compressedCanvas)
        if (!compressedQuality) compressedQuality = 0.8
        const compressedBase64 = compressedCanvas.toDataURL('image/jpeg', compressedQuality) // Adjust quality as needed (0.8 is 80%)

        // Mengonversi compressedBase64 ke Blob
        const fetchImg = await fetch(compressedBase64)
        const convBlob = await fetchImg.blob()

        const data = new FormData()
        data.append(`image`, convBlob, `${user?._id}-avatar.jpeg`)

        // Panggil onChange dengan compressedBase64
        onChange(originalBase64, data, compressedBase64)

        onClose()
        setLoad(false)
      }
    } catch (error: any) {
      setLoad(false)
      const text =
        error?.response?.data?.message || error?.message || error?.request?.statusText || 'Something went wrong'
      toast.error(text)
    }
  }

  return (
    <div className='m-4'>
      <AvatarEditor
        ref={editor}
        width={convertToPixelSize(width as string)}
        height={convertToPixelSize(height as string)}
        scale={zoom}
        image={image}
        className='m-auto'
      />
      <input type='range' className='w-full' min={0.5} max={1.5} step={0.1} value={zoom} onChange={handleScale} />
      <div className='flex justify-end gap-1'>
        <Button type='button' sizes='small' variant='outlined' onClick={onClose}>
          {'CANCEL'}
        </Button>
        <Button
          type='button'
          sizes='small'
          variant='contained'
          color='primary'
          loading={load}
          disabled={load}
          onClick={onSave}
        >
          {'SAVE'}
        </Button>
      </div>
    </div>
  )
}

interface InputImageProps {
  imgFile?: string
  width: CSSProperties['width']
  height: CSSProperties['height']
  maxWidth?: boolean
  disabled?: boolean
  onChange: (base64: string, formData: FormData | null, base64Compres?: string) => void
  compressedQuality?: 0.1 | 0.2 | 0.3 | 0.4 | 0.5 | 0.6 | 0.7 | 0.8 | 0.9 | 1.0
  variant?: 'circle' | 'square'
  confirmDeleteImage?: boolean
  message?: string
}

interface DisableComponentProps {
  maxWidth?: boolean
  message?: string
  width: CSSProperties['width']
  height: CSSProperties['height']
  localImage: string
  imgFile?: string
  variant?: 'circle' | 'square'
}

const DisableComponent = ({
  message,
  height,
  maxWidth,
  width,
  imgFile,
  localImage,
  variant
}: DisableComponentProps) => {
  return (
    <div
      className={twMerge('relative', maxWidth && 'mx-auto')}
      style={{ height, maxWidth: maxWidth ? width : undefined }}
    >
      <label
        htmlFor='image'
        className={twMerge(
          'overflow-hidden border-2 border-gray-300/50 border-dashed rounded-lg bg-gray-50/50 dark:bg-gray-700/50 w-full',
          'block',
          variant === 'circle' && 'rounded-full'
        )}
        style={{ height, maxWidth: maxWidth ? width : undefined }}
      >
        {Boolean(localImage || imgFile) ? (
          <Image
            src={localImage ? localImage : `${imgFile}`}
            alt={localImage ? 'upload' : `${imgFile}`}
            width={convertToPixelSize(width as string)}
            height={convertToPixelSize(height as string)}
            className='object-cover w-full h-full'
          />
        ) : (
          <div
            className={`flex flex-col items-center justify-center h-full ${
              variant === 'circle' ? 'p-4' : 'p-2'
            } text-center`}
          >
            <svg
              aria-hidden='true'
              className='w-10 h-10 mb-3 text-gray-400/50'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth='2'
                d='M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12'
              ></path>
            </svg>
            <p className='mb-2 text-sm text-gray-500/50 dark:text-gray-400/50'>
              <span className='font-semibold'>Klik untuk mengunggah</span> atau drag dan drop
            </p>
            <p className='text-xs text-gray-500/50 dark:text-gray-400/50'>
              {message || `SVG, PNG, JPG or GIF (MAX. ${width}x${height}px)`}
            </p>
          </div>
        )}
      </label>
    </div>
  )
}

const ContentFieldInputImage = (
  props: InputImageProps & { localImage: string; setLocalImage: Dispatch<SetStateAction<string>> }
) => {
  const {
    imgFile,
    height,
    width,
    maxWidth,
    onChange,
    variant = 'square',
    confirmDeleteImage,
    message,
    localImage,
    setLocalImage,
    compressedQuality
  } = props
  const [load, setLoad] = useState(false)
  const [openDialog, setOpenDialog] = useState(false)
  const [openDialogDelete, setOpenDialogDelete] = useState(false)

  const onDrop = useCallback(async (acceptedFiles: any[]) => {
    try {
      setLoad(true)
      const selectedFile = acceptedFiles[0]

      if (selectedFile.size > 5000000) throw new Error('File tidak boleh lebih dari 5mb')

      // Check file type
      const allowedTypes = ['image/svg+xml', 'image/png', 'image/jpeg', 'image/gif']
      if (!allowedTypes.includes(selectedFile.type)) throw new Error('File harus berformat SVG, PNG, JPG, atau GIF')

      setOpenDialog(true)
      setLocalImage(selectedFile)
      setLoad(false)
    } catch (error: any) {
      setLoad(false)
      const text =
        error?.response?.data?.message || error?.message || error?.request?.statusText || 'Something went wrong'
      toast.error(text)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const { getRootProps, getInputProps } = useDropzone({ onDrop, noDragEventsBubbling: true })

  return (
    <div
      className={twMerge('relative', maxWidth && 'mx-auto')}
      style={{ height, maxWidth: maxWidth ? width : undefined }}
    >
      {Boolean(imgFile) && (
        <div className='absolute inline-flex justify-end top-2 right-2'>
          {load && <CircularProgress color='primary' />}
          {Boolean(localImage || imgFile) && (
            <IconButton
              type='button'
              sizes='small'
              color='error'
              variant={variant === 'circle' ? 'outlined' : 'text'}
              className='bg-white'
              onClick={e => {
                e.stopPropagation()
                if (confirmDeleteImage) {
                  setOpenDialogDelete(true)
                } else {
                  setLocalImage('')
                  onChange('', null)
                }
              }}
            >
              <IconDelete fontSize={18} />
            </IconButton>
          )}
        </div>
      )}
      <label
        htmlFor='image'
        {...getRootProps({
          className: twMerge(
            'dropzone',
            'overflow-hidden border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:bg-gray-700 w-full',
            'block',
            variant === 'circle' && 'rounded-full'
          )
        })}
        style={{ height, maxWidth: maxWidth ? width : undefined }}
      >
        {Boolean(localImage || imgFile) ? (
          <Image
            src={localImage ? localImage : `${imgFile}`}
            alt={localImage ? 'upload' : `${imgFile}`}
            width={convertToPixelSize(width as string)}
            height={convertToPixelSize(height as string)}
            className='object-cover w-full h-full'
          />
        ) : (
          <div
            className={`flex flex-col items-center justify-center h-full ${
              variant === 'circle' ? 'p-4' : 'p-2'
            } text-center`}
          >
            <svg
              aria-hidden='true'
              className='w-10 h-10 mb-3 text-gray-400'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth='2'
                d='M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12'
              ></path>
            </svg>
            <p className='mb-2 text-sm text-gray-500 dark:text-gray-400'>
              <span className='font-semibold'>Klik untuk mengunggah</span> atau drag dan drop
            </p>
            <p className='text-xs text-gray-500 dark:text-gray-400'>
              {message || `SVG, PNG, JPG or GIF (MAX. ${width}x${height}px)`}
            </p>
          </div>
        )}
        <input {...getInputProps()} className='hidden' />
      </label>
      <Dialog
        open={openDialogDelete}
        onClose={() => setOpenDialogDelete(false)}
        closeButtom
        maxWidth='xs'
        fullWidth
        title=''
        onClick={e => e.stopPropagation()}
      >
        <div className='mx-4'>
          <Typography component='div' variant='h6' textAlign='center' color='warning' gutterBottom>
            <IconAlertCircleTwotone fontSize={88} color='warning' className='inline mt-8' />
          </Typography>
          <Typography component='div' variant='subtitle1' fontWeight='semibold' textAlign='center'>
            Apa anda yakin ingin menghapus ini!!
          </Typography>
          <div className='my-4 text-right'>
            <Button
              type='button'
              variant='outlined'
              color='error'
              disabled={load}
              onClick={e => {
                e.stopPropagation()
                setOpenDialogDelete(false)
              }}
            >
              Batal
            </Button>{' '}
            <Button
              type='button'
              loading={load}
              disabled={load}
              onClick={e => {
                e.stopPropagation()
                setLocalImage('')
                onChange('', null)
                setOpenDialogDelete(false)
                setLoad(true)
                setLoad(false)
              }}
            >
              Hapus
            </Button>
          </div>
        </div>
      </Dialog>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} closeButtom title='Editor'>
        <AvatarEditorField
          width={width}
          height={height}
          image={localImage}
          compressedQuality={compressedQuality}
          onChange={(img, data, compress) => {
            setLocalImage(img)
            onChange(img, data, compress)
          }}
          onClose={() => setOpenDialog(false)}
        />
      </Dialog>
    </div>
  )
}

const FieldInputImage = (props: InputImageProps) => {
  const { imgFile, height, width, maxWidth, variant = 'square', message, disabled } = props
  const [localImage, setLocalImage] = useState('')

  if (disabled)
    return (
      <DisableComponent
        height={height}
        width={width}
        imgFile={imgFile}
        localImage={localImage}
        maxWidth={maxWidth}
        message={message}
        variant={variant}
      />
    )

  return <ContentFieldInputImage {...props} localImage={localImage} setLocalImage={setLocalImage} />
}

export default FieldInputImage
