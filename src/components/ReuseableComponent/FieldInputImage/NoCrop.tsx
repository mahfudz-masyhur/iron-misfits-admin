import Image from 'next/image'
import { CSSProperties, Dispatch, MouseEvent, SetStateAction, useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import CircularProgress from 'src/components/ui/CircularProgress'
import IconDelete from 'src/components/ui/Icon/IconDelete'
import IconRefresh from 'src/components/ui/Icon/IconRefresh'
import IconButton from 'src/components/ui/IconButton'
import { convertToPixelSize } from 'src/components/utility/formats'
import { twMerge } from 'tailwind-merge'

export type LocalImage = {
  image?: string
  local?: string
  load?: boolean
}

interface InputImageProps {
  value: string
  onChange: (data: FormData | string | null) => void
  width: CSSProperties['width']
  height: CSSProperties['height']
  maxWidth?: boolean
  prevImage?: string
}

interface HandlePrevImageProps {
  onChange: (data: FormData | string | null) => void
  prevImage?: string
  useViewImage: [string, Dispatch<SetStateAction<string>>]
}
const HandlePrevImage = ({ useViewImage, prevImage, onChange }: HandlePrevImageProps) => {
  const [viewImage, setViewImage] = useViewImage

  async function handlePrevImage(e: MouseEvent<HTMLButtonElement>) {
    e.stopPropagation()
    if (viewImage) setViewImage('')
    if (prevImage) onChange(prevImage)
  }

  return (
    <IconButton type='button' sizes='small' variant='text' className='bg-white' onClick={handlePrevImage}>
      <IconRefresh fontSize={18} />
    </IconButton>
  )
}

interface HandleDeleteProps {
  onChange: (data: FormData | string | null) => void
  useViewImage: [string, Dispatch<SetStateAction<string>>]
}
const HandleDelete = ({ onChange, useViewImage }: HandleDeleteProps) => {
  const [viewImage, setViewImage] = useViewImage

  async function handleDelete(e: MouseEvent<HTMLButtonElement>) {
    e.stopPropagation()
    if (viewImage) setViewImage('')
    onChange(null)
  }

  return (
    <IconButton type='button' sizes='small' color='error' variant='text' className='bg-white' onClick={handleDelete}>
      <IconDelete fontSize={18} />
    </IconButton>
  )
}

const FieldInputImage = (props: InputImageProps) => {
  const { height, width, maxWidth, onChange, value, prevImage } = props
  const [load, setLoad] = useState(false)
  const [viewImage, setViewImage] = useState<string>('')

  const onDrop = useCallback((acceptedFiles: any[]) => {
    setLoad(true)
    const selectedFile = acceptedFiles[0]

    const imageUrl = URL.createObjectURL(selectedFile)
    // Membuat pratinjau gambar
    const reader = new FileReader()
    reader.onloadend = () => {
      if (reader.result) setViewImage(`${reader.result}`)
    }
    reader.readAsDataURL(selectedFile)

    const data = new FormData()
    data.append(`image`, selectedFile, selectedFile.name)

    onChange(data)
    setLoad(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const { getRootProps, getInputProps } = useDropzone({ onDrop, noDragEventsBubbling: true })

  const DefaultView = () => {
    return (
      <div className='flex flex-col items-center justify-center h-full p-2 text-center'>
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
          <span className='font-semibold'>Click to upload</span> or drag and drop
        </p>
        <p className='text-xs text-gray-500 dark:text-gray-400'>
          SVG, PNG, JPG or GIF (MAX. {width}x{height}px)
        </p>
      </div>
    )
  }

  const ImageView = () => {
    return (
      <>
        {viewImage ? (
          <Image src={viewImage} alt='Uploaded Image'
          width={convertToPixelSize(width as string)}
          height={convertToPixelSize(height as string)} className='object-cover w-full h-full' key={viewImage} />
        ) : (
          <Image
            src={`${process.env.IMAGE_PREVIEW}/${value}`}
            alt={`${process.env.IMAGE_PREVIEW}/${value}`}
            width={convertToPixelSize(width as string)}
            height={convertToPixelSize(height as string)}
            className='object-cover w-full h-full'
            key={`${process.env.IMAGE_PREVIEW}/${value}`}
          />
        )}
      </>
    )
  }

  return (
    <label
      htmlFor='image'
      {...getRootProps({
        className: twMerge(
          'dropzone',
          'relative overflow-hidden border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:bg-gray-700 w-full',
          'block',
          maxWidth && 'mx-auto'
        )
      })}
      style={{ height, maxWidth: maxWidth ? width : undefined }}
    >
      {(load || value || prevImage) && (
        <div className='absolute inline-flex justify-end gap-1 top-2 right-2'>
          {load && <CircularProgress />}
          {prevImage !== value && (
            <HandlePrevImage prevImage={prevImage} useViewImage={[viewImage, setViewImage]} onChange={onChange} />
          )}
          {value && <HandleDelete useViewImage={[viewImage, setViewImage]} onChange={onChange} />}
        </div>
      )}

      {value || viewImage ? <ImageView /> : <DefaultView />}
      <input {...getInputProps()} className='hidden' />
    </label>
  )
}

export default FieldInputImage
