import CircularProgress from 'src/components/ui/CircularProgress'

function LoadingSetting() {
  return (
    <div className='h-full flex justify-center items-center'>
      <CircularProgress size={60} />
    </div>
  )
}

export default LoadingSetting
