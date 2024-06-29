import { useState, useEffect } from 'react'

const HiddenTransisiton = (open: boolean) => {
  const [isVisible, setIsVisible] = useState(open)
  const [opacity, setOpacity] = useState<0 | 1>(open ? 1 : 0)

  useEffect(() => {
    let timeoutId: NodeJS.Timeout

    if (open) {
      setIsVisible(true)
      timeoutId = setTimeout(() => {
        setOpacity(1)
      }, 70) // Waktu kecil untuk memastikan komponen sudah dirender sebelum memulai transisi
    } else {
      setOpacity(0)
      timeoutId = setTimeout(() => {
        setIsVisible(false)
      }, 300)
    }

    return () => clearTimeout(timeoutId)
  }, [open])

  return { isVisible, opacity }
}

export default HiddenTransisiton
