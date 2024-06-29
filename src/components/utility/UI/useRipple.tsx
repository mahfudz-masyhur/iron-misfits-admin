//hooks/useRipple.tsx

import React, { useEffect, useState } from 'react'
import { color } from 'src/components/ui/Type'

type variant = 'text' | 'outlined' | 'contained' | undefined

const useRipple = <T extends HTMLElement>(ref: React.RefObject<T>) => {
  //ripples are just styles that we attach to span elements
  const [ripples, setRipples] = useState<React.CSSProperties[]>([])

  useEffect(() => {
    //check if there's a ref
    if (ref.current) {
      const elem = ref.current

      //add a click handler for the ripple
      const clickHandler = (e: MouseEvent) => {
        //calculate the position and dimensions of the ripple.
        //based on click position and button dimensions
        var rect = elem.getBoundingClientRect()
        var left = e.clientX - rect.left
        var top = e.clientY - rect.top
        const height = elem.clientHeight
        const width = elem.clientWidth
        const diameter = Math.max(width, height)
        setRipples([
          ...ripples,
          {
            top: top - diameter / 2,
            left: left - diameter / 2,
            height: Math.max(width, height),
            width: Math.max(width, height)
          }
        ])
      }

      const cleanElmn = () => {
        // Menghapus ripples secara bertahap setelah satu detik
        setTimeout(() => {
          setRipples(prevRipples => prevRipples.slice(1))
        }, 3000)
      }

      //add an event listener to the button
      elem.addEventListener('click', clickHandler)
      elem.addEventListener('mouseup', cleanElmn)
      elem.addEventListener('mouseleave', cleanElmn)

      //clean up when the component is unmounted
      return () => {
        elem.removeEventListener('click', clickHandler)
        elem.removeEventListener('mouseup', cleanElmn)
        elem.removeEventListener('mouseleave', cleanElmn)
      }
    }
  }, [ref, ripples])

  function backgroundColor(variant: variant, color?: color) {
    switch (variant) {
      case 'outlined':
        switch (color) {
          case 'white':
            return 'bg-gray-500 dark:bg-white'
          case 'warning':
            return 'bg-warning-main'
          case 'success':
            return 'bg-success-main'
          case 'secondary':
            return 'bg-secondary-main'
          case 'primary':
            return 'bg-primary-main'
          case 'info':
            return 'bg-info-main'
          case 'error':
            return 'bg-error-main'

          default:
            return 'bg-primary-main'
        }
      case 'text':
        switch (color) {
          case 'white':
            return 'bg-gray-500 dark:bg-white'
          case 'warning':
            return 'bg-warning-main'
          case 'success':
            return 'bg-success-main'
          case 'secondary':
            return 'bg-secondary-main'
          case 'primary':
            return 'bg-primary-main'
          case 'info':
            return 'bg-info-main'
          case 'error':
            return 'bg-error-main'

          default:
            return 'bg-primary-main'
        }

      default:
        switch (color) {
          case 'white':
            return 'bg-primary-main dark:bg-white'

          default:
            return 'bg-white'
        }
    }
  }

  const rippleButton = ref.current?.dataset.rippleButton === 'button'
  const rippleCustomColor = ref.current?.dataset.rippleCustomColor
  const rippleColor: color = ref.current?.dataset.rippleColor as color
  const rippleVariant: variant = ref.current?.dataset.rippleVariant as variant

  return ripples?.map((style, i) => {
    return (
      <span
        key={`${i}`}
        className={rippleButton ? backgroundColor(rippleVariant, rippleColor) : rippleCustomColor}
        style={{
          ...style,
          //should be absolutely positioned
          position: 'absolute',
          opacity: '25%',
          transform: 'scale(0)',
          // add ripple animation from styles.css
          animation: 'ripple 600ms linear',
          borderRadius: '50%'
        }}
      />
    )
  })
}

export default useRipple
