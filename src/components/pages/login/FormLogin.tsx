'use client'
import { useState } from 'react'
import Button from 'src/components/ui/Button'
import IconEye from 'src/components/ui/Icon/IconEye'
import IconEyeClose from 'src/components/ui/Icon/IconEyeClose'
import TextField from 'src/components/ui/TextField'
import Typography from 'src/components/ui/Typograph'
import { useSearchParams } from 'next/navigation'

import Cookies from 'js-cookie'
import { toast } from 'react-hot-toast'
import Divider from 'src/components/ui/Divider'
import { WINDOW_USER_SCRIPT_VARIABLE } from 'src/constant'
import { useAppContext } from 'src/context/AppContext/useAppContext'
import { loginApi } from 'server/api'

export default function FormLogin() {
  const [isLoading, setIsLoading] = useState(false)

  const {
    auth: { setUser, setToken }
  } = useAppContext()
  const searchParams = useSearchParams()
  const url = searchParams.get('url')

  const loginClick = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault()
      const email = (e.currentTarget.elements.namedItem('email') as HTMLInputElement)?.value
      const password = (e.currentTarget.elements.namedItem('password') as HTMLInputElement)?.value
      if (!email || !password) return
      setIsLoading(true)
      const data = await loginApi({ email, password })
      console.log(data)

      setUser(data.data.user)
      setToken(data.data.token)
      Cookies.set(WINDOW_USER_SCRIPT_VARIABLE, `${data.data.token}`, { secure: true })

      toast.success('Berhasil Login')
      if (url) {
        window.location.href = url
      } else {
        window.location.href = '/'
      }
    } catch (err: any) {
      toast.error(`${err?.response?.data?.message || err.message}`)
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={loginClick}>
      <div>
        <Typography component='h1' variant='h5' gutterBottom textAlign='center'>
          Login
        </Typography>
        <TextField label='Nim / Email' name='email' margin='normal' placeholder='Masukkan Nim Atau Email' fullWidth />
        <TextFieldPassword />
        <Divider gradian />
        <Button fullWidth disabled={isLoading} loading={isLoading} className='mt-1'>
          Login
        </Button>
      </div>
    </form>
  )
}

const TextFieldPassword = () => {
  const [toglePasswordType, setToglePasswordType] = useState(false)

  return (
    <TextField
      label='Password'
      placeholder='Masukkan password'
      type={toglePasswordType ? 'text' : 'password'}
      name='password'
      fullWidth
      endAdornment={
        <button className='block text-text-secondary' type='button' onClick={() => setToglePasswordType(p => !p)}>
          {toglePasswordType ? <IconEye /> : <IconEyeClose />}
        </button>
      }
    />
  )
}
