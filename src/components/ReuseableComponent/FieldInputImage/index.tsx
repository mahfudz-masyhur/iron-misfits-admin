import Image from 'next/image'
import { CSSProperties, ChangeEvent, Dispatch, MouseEvent, SetStateAction, useCallback, useState, useRef } from 'react'
import AvatarEditor from 'react-avatar-editor'
import { useDropzone } from 'react-dropzone'
import toast from 'react-hot-toast'
import Button from 'src/components/ui/Button'
import CircularProgress from 'src/components/ui/CircularProgress'
import Dialog from 'src/components/ui/Dialog'
import IconDelete from 'src/components/ui/Icon/IconDelete'
import IconButton from 'src/components/ui/IconButton'
import Typography from 'src/components/ui/Typograph'
import { convertToPixelSize } from 'src/components/utility/formats'
import { useAppContext } from 'src/context/AppContext/useAppContext'
// import { deleteImageFile, uploadAvatarLecture, uploadAvatarStudent, uploadImage, uploadImageBerita } from 'src/lib/api'
import { twMerge } from 'tailwind-merge'

interface AvatarEditorFieldProps {
  folder?: 'avatar-student' | 'avatar-lecture' | 'berita'
  width: CSSProperties['width']
  height: CSSProperties['height']
  image: string
  onClose: () => void
  setImgFile: Dispatch<SetStateAction<string>>
}

const AvatarEditorField = ({ width, height, image, onClose, setImgFile, folder }: AvatarEditorFieldProps) => {
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
    event.preventDefault()
    if (editor.current !== null) {
      setLoad(true)
      const canvas = editor.current.getImageScaledToCanvas().toDataURL('image/jpeg')

      const fetchImg = await fetch(canvas)
      const convBlob = await fetchImg.blob()

      const data = new FormData()
      data.append(`image`, convBlob, `${user?._id}-avatar.jpeg`)
      if (folder === 'avatar-lecture') {
        // const res = await uploadAvatarLecture(data)
        // setImgFile(res.url)
      } else if (folder === 'avatar-student') {
        // const res = await uploadAvatarStudent(data)
        // setImgFile(res.url)
      } else if (folder === 'berita') {
        // const res = await uploadImageBerita(data)
        // setImgFile(res.url)
      } else {
        // const res = await uploadImage(data)
        // setImgFile(res.url)
      }
      onClose()
      setLoad(false)
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
        <Button sizes='small' variant='outlined' onClick={onClose}>
          {'CANCEL'}
        </Button>
        <Button sizes='small' variant='contained' color='primary' loading={load} disabled={load} onClick={onSave}>
          {'SAVE'}
        </Button>
      </div>
    </div>
  )
}

interface InputImageProps {
  folder?: 'avatar-student' | 'avatar-lecture' | 'berita'
  imgFile?: string
  setImgFile: Dispatch<SetStateAction<string>>
  width: CSSProperties['width']
  height: CSSProperties['height']
  maxWidth?: boolean
}

const FieldInputImage = (props: InputImageProps) => {
  const { imgFile, setImgFile, height, width, maxWidth, folder } = props
  const [load, setLoad] = useState(false)
  const [localImage, setLocalImage] = useState('')
  const [openDialog, setOpenDialog] = useState(false)
  const [openDialogDelete, setOpenDialogDelete] = useState(false)

  const onDrop = useCallback(async (acceptedFiles: any[]) => {
    setLoad(true)
    const selectedFile = acceptedFiles[0]
    setOpenDialog(true)
    setLocalImage(selectedFile)
    setLoad(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const { getRootProps, getInputProps } = useDropzone({ onDrop, noDragEventsBubbling: true })

  return (
    <>
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
        {(load || imgFile) && (
          <div className='absolute inline-flex justify-end top-2 right-2'>
            {load && <CircularProgress color='primary' />}
            {imgFile && (
              <IconButton
                type='button'
                sizes='small'
                color='error'
                variant='text'
                className='bg-white'
                onClick={e => {
                  e.stopPropagation()
                  setOpenDialogDelete(true)
                  // setLoad(true)
                  // deleteImageFile(imgFile)
                  //   .then(() => setImgFile(''))
                  //   .finally(() => setLoad(false))
                }}
              >
                <IconDelete fontSize={18} />
              </IconButton>
            )}
          </div>
        )}
        {imgFile ? (
          <Image
            src={`${process.env.IMAGE_PREVIEW}/${imgFile}`}
            alt={`${process.env.IMAGE_PREVIEW}/${imgFile}`}
            width={convertToPixelSize(width as string)}
            height={convertToPixelSize(height as string)}
            className='object-cover w-full h-full'
          />
        ) : (
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
        )}
        <input {...getInputProps()} className='hidden' />
      </label>
      <Dialog
        open={openDialogDelete}
        onClose={() => setOpenDialogDelete(false)}
        closeButtom
        maxWidth='xs'
        fullWidth
        title='Hapus Gambar'
        onClick={e => {
          e.stopPropagation()
        }}
      >
        <div className='mx-4'>
          <Typography component='div' variant='h6' textAlign='center' color='warning'>
            Peringatan!!
          </Typography>
          <Typography component='div' variant='subtitle1' textAlign='center'>
            Menghapus tanpa melakukan <b>submit</b> akan meghilangkan gambar dalam rentang kurang lebih <b>24 jam</b>!!
          </Typography>
          <div className='my-4 text-right'>
            <Button
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
              loading={load}
              disabled={load}
              onClick={e => {
                e.stopPropagation()
                setOpenDialogDelete(true)
                setLoad(true)
                // deleteImageFile(imgFile || '')
                //   .then(() => setImgFile(''))
                //   .catch(() => toast.error('Gagal menghapus gambar'))
                //   .finally(() => setLoad(false))
                //   .finally(() => setOpenDialogDelete(false))
              }}
            >
              Hapus
            </Button>
          </div>
        </div>
      </Dialog>

      <Dialog
        open={openDialog}
        onClose={() => {
          setOpenDialog(false)
          setLocalImage('')
        }}
        closeButtom
        title='Editor'
      >
        <AvatarEditorField
          folder={folder}
          width={width}
          height={height}
          image={localImage}
          setImgFile={setImgFile}
          onClose={() => {
            setOpenDialog(false)
            setLocalImage('')
          }}
        />
      </Dialog>
    </>
  )
}

export default FieldInputImage
