import { HTMLAttributes, forwardRef } from 'react'
import { twMerge } from 'tailwind-merge'

interface MoreProps {
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl'
}

export type ContainerProps = MoreProps & HTMLAttributes<HTMLDivElement>

const Container = forwardRef<HTMLDivElement, ContainerProps>(
  ({ className, maxWidth, ...rest }: ContainerProps, ref) => {
    let screen = ''
    if (maxWidth === 'sm') screen = 'max-w-screen-sm'
    if (maxWidth === 'md') screen = 'max-w-screen-md'
    if (maxWidth === 'lg') screen = 'max-w-screen-lg'
    if (maxWidth === 'xl') screen = 'max-w-screen-xl'
    if (maxWidth === '2xl') screen = 'max-w-screen-2xl'

    return <div ref={ref} className={twMerge('container mx-auto', screen, className)} {...rest} />
  }
)

Container.displayName = 'Container'

export default Container
