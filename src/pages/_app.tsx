import "src/styles/globals.css";
import type { AppProps } from "next/app";
import { Toaster } from 'react-hot-toast'
import NextNProgress from 'nextjs-progressbar'
import { ThemeProvider } from 'next-themes'
import { NextComponentType } from 'next'
import AppContext from 'src/context/AppContext'

interface CustomAppProps extends AppProps {
  Component: NextComponentType & {
    isGuest?: boolean
  }
}

export default function App({ Component, pageProps }: CustomAppProps) {
  const isGuest = Component.isGuest === true

  return (
    <ThemeProvider attribute='class' enableSystem={false}>
      <NextNProgress color='#185a9d' options={{ showSpinner: false }} />
      <Toaster position='top-right' />
      <AppContext>
        {isGuest ? (
          <div className='p-4 min-h-[100dvh]'>
            <Component {...pageProps} />
          </div>
        ) : (
          <Component {...pageProps} />
        )}
      </AppContext>
    </ThemeProvider>
  )
}
