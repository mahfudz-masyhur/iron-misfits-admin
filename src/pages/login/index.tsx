import FormLogin from 'src/components/pages/login/FormLogin'
import Typography from 'src/components/ui/Typograph'

function LoginPage() {
  return (
    <>
      <div
        className='fixed top-0 bottom-0 left-0 right-0 text-center text-white bg-center bg-cover sm:static sm:pt-16 -z-10 bg-primary-dark sm:rounded-2xl sm:h-96'
        style={{
          backgroundImage:
            'linear-gradient(310deg, rgba(16, 75, 135, 0.6), rgba(36, 112, 189, 0.6)), url(/images/background/curved.jpg)'
        }}
      >
        <div className='max-w-lg px-1 mx-auto mt-10 sm:mt-0'>
          <Typography component='h1' variant='h2' fontWeight='semibold' gutterBottom>
            Selamat Datang!
          </Typography>
        </div>
      </div>
      <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 sm:static sm:transform-none min-w-[19rem] max-w-sm p-4 m-auto shadow-xl sm:-mt-40 bg-background-paper dark:bg-background-paper-dark rounded-2xl'>
        <FormLogin />
      </div>
    </>
  )
}

LoginPage.isGuest = true

export default LoginPage
