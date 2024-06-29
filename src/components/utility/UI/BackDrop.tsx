'use client'
import { useLayoutEffect } from 'react'

interface moreOptions {
  disableisThereScrollbar?: true
}

const getScrollBarWidth = () => {
  var inner = document.createElement('p')
  inner.style.width = '100%'
  inner.style.height = '200px'

  var outer = document.createElement('div')
  outer.style.position = 'absolute'
  outer.style.top = '0px'
  outer.style.left = '0px'
  outer.style.visibility = 'hidden'
  outer.style.width = '200px'
  outer.style.height = '150px'
  outer.style.overflow = 'hidden'
  outer.appendChild(inner)

  document.body.appendChild(outer)
  var w1 = inner.offsetWidth
  outer.style.overflow = 'scroll'
  var w2 = inner.offsetWidth
  if (w1 == w2) w2 = outer.clientWidth

  document.body.removeChild(outer)

  return w1 - w2
}

const isThereScrollbar = () => {
  const hasVerticalScrollbar = document.body.scrollHeight > window.innerHeight
  const hasHorizontalScrollbar = document.body.scrollWidth > window.innerWidth

  return { hasVerticalScrollbar, hasHorizontalScrollbar }
}

const BackDrop = (open: boolean, moreOptions?: moreOptions) => {
  useLayoutEffect(() => {
    const presentationDiv = document.getElementById('presentation')
    const scrollbarWidth = getScrollBarWidth()
    const { hasVerticalScrollbar } = isThereScrollbar()

    // Fungsi untuk mengatur atribut aria-hidden pada elemen anak body
    const setAriaHiddenOnBodyChildren = (value: 'true' | 'false') => {
      const bodyChildren = document.body.children
      if (value === 'true') {
        for (let i = 0; i < bodyChildren.length; i++) {
          const child = bodyChildren[i]
          if (child.id !== 'presentation') child.setAttribute('aria-hidden', value)
        }
      } else {
        for (let i = 0; i < bodyChildren.length; i++) {
          const child = bodyChildren[i]
          child.removeAttribute('aria-hidden')
        }
      }
    }

    if (open || presentationDiv) {
      document.body.style.overflow = 'hidden'
      if (hasVerticalScrollbar && !moreOptions?.disableisThereScrollbar)
        document.body.style.paddingRight = `${scrollbarWidth}px`

      // Mengatur aria-hidden="true" pada semua elemen anak body
      setAriaHiddenOnBodyChildren('true')
    } else {
      document.body.style.overflow = ''
      if (hasVerticalScrollbar && !moreOptions?.disableisThereScrollbar) document.body.style.paddingRight = ''

      // Menghapus atribut aria-hidden dari semua elemen anak body
      setAriaHiddenOnBodyChildren('false')
    }

    return () => {
      document.body.style.overflow = ''
      document.body.style.paddingRight = ''

      // Menghapus atribut aria-hidden dari semua elemen anak body saat komponen dibongkar
      setAriaHiddenOnBodyChildren('false')
    }
  }, [moreOptions?.disableisThereScrollbar, open])
}

export default BackDrop
