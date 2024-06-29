/* eslint-disable @next/next/no-img-element */
'use client'
import { VariantProps, cva } from 'class-variance-authority'
import { HTMLAttributes, ReactNode, forwardRef, useState } from 'react'
import { stringToColor } from 'src/components/utility/formats'
import { twMerge } from 'tailwind-merge'

type MoreProps = {
  src?: string
  alt: string
  children?: ReactNode
  width?: number
  height?: number
  variant?: 'square' | 'rounded' | 'circle'
  ImageComponent?: any
}

const variantsAvatar = cva([''], {
  variants: {
    variant: {
      square: ['rounded-none'],
      rounded: ['rounded-xl'],
      circle: ['rounded-full']
    }
  },
  defaultVariants: {
    variant: 'circle'
  }
})

export type AvatarProps = HTMLAttributes<HTMLDivElement> & VariantProps<typeof variantsAvatar> & MoreProps

const Avatar = forwardRef<HTMLDivElement, AvatarProps>((props: AvatarProps, ref) => {
  const { src, alt, children, variant, width, height, className, style, ImageComponent = 'img' } = props
  const [imageError, setImageError] = useState(false)

  const handleImageError = () => {
    setImageError(true)
  }

  const getFallbackContent = (): ReactNode => {
    if (children) return children
    else return alt?.charAt(0)
  }

  return (
    <div
      className={twMerge(
        'flex items-center justify-center',
        Boolean(children) && 'overflow-hidden',
        'text-white',
        variantsAvatar({ variant, className })
      )}
      style={{
        height: height || 40,
        width: width || 40,
        backgroundColor: stringToColor(alt),
        ...style
      }}
    >
      {!imageError && src ? (
        <ImageComponent
          src={src}
          alt={alt}
          width={width || 40}
          height={height || 40}
          className={twMerge('object-cover w-full h-full', variantsAvatar({ variant, className }))}
          onError={handleImageError}
          {...ref}
        />
      ) : (
        <span>{getFallbackContent()}</span>
      )}
    </div>
  )
})

Avatar.displayName = 'Avatar'

export default Avatar
