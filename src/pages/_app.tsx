import { NextComponentType } from 'next'
import { ThemeProvider } from 'next-themes'
import type { AppProps } from 'next/app'
import Head from 'next/head'
import NextNProgress from 'nextjs-progressbar'
import { Toaster } from 'react-hot-toast'
import MainLayout from 'src/components/Layouts/main'
import AppContext from 'src/context/AppContext'
import 'src/styles/globals.css'

interface CustomAppProps extends AppProps {
  Component: NextComponentType & {
    isGuest?: boolean
  }
}

export default function App({ Component, pageProps }: CustomAppProps) {
  const isGuest = Component.isGuest === true

  return (
    <ThemeProvider attribute='class' enableSystem={false}>
    <Head>
      <title>Iron Misfits</title>
    </Head>
      <NextNProgress color='#185a9d' options={{ showSpinner: false }} />
      <Toaster position='top-right' />
      <AppContext>
        {isGuest ? (
          <div className='p-4 min-h-[100dvh]'>
            <Component {...pageProps} />
          </div>
        ) : (
          <MainLayout>
            <Component {...pageProps} />
          </MainLayout>
        )}
      </AppContext>
    </ThemeProvider>
  )
}
