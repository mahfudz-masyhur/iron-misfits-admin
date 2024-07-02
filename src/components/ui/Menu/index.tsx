import { HTMLProps, HtmlHTMLAttributes, MutableRefObject, forwardRef, useEffect, useRef } from 'react'
import ReactDOM from 'react-dom'
import BackDrop from 'src/components/utility/UI/BackDrop'
import HiddenTransisiton from 'src/components/utility/UI/HiddenTransisiton'
import { twMerge } from 'tailwind-merge'

type anchor =
  | 'top'
  | 'top-end'
  | 'top-start'
  | 'bottom-end'
  | 'bottom-start'
  | 'bottom'
  | 'right-start'
  | 'right'
  | 'right-end'
  | 'left-start'
  | 'left'
  | 'left-end'

interface MoreMenuProps {
  open: boolean
  onClose: () => void
  anchor?: anchor
  anchorEl?: HTMLElement | null
  classNames?: {
    root?: HTMLProps<HTMLDivElement>['className']
    ul?: HTMLProps<HTMLDivElement>['className']
  }
  zIndex?: number
  disableBackDrop?: boolean
}

export type MenuProps = HtmlHTMLAttributes<HTMLDivElement> & MoreMenuProps

interface AnchorStylesProps {
  anchorPosition: anchor
  anchorEl: HTMLElement | null
  isVisible: boolean
  menuRef: MutableRefObject<HTMLDivElement | null>
}

export const AnchorStyles = ({ anchorPosition, anchorEl, isVisible, menuRef }: AnchorStylesProps) => {
  if (anchorEl && isVisible && menuRef.current) {
    const anchor = anchorEl.getBoundingClientRect()
    const menu = menuRef.current.children[0].getBoundingClientRect()
    const MenuElement = menuRef.current as HTMLElement
    const gap = 8

    if (anchorPosition === 'top') {
      MenuElement.style.top = `auto`
      MenuElement.style.left = `${anchor.left + anchor.width / 2 - menu.width / 2}px`
      MenuElement.style.bottom = `${window.innerHeight - (anchor.top + scrollY)}px`
      MenuElement.style.animation = 'scaleAnimation .7s ease-in-out forwards'
      MenuElement.style.transformOrigin = 'bottom'
    }
    if (anchorPosition === 'top-start') {
      MenuElement.style.top = `auto`
      MenuElement.style.left = `${anchor.left}px`
      MenuElement.style.bottom = `${window.innerHeight - (anchor.top + scrollY)}px`
      MenuElement.style.animation = 'scaleAnimation .7s ease-in-out forwards'
      MenuElement.style.transformOrigin = 'bottom left'
    }
    if (anchorPosition === 'top-end') {
      MenuElement.style.top = `auto`
      MenuElement.style.left = `${anchor.left + anchor.width - menu.right}px`
      MenuElement.style.bottom = `${window.innerHeight - (anchor.top + scrollY)}px`
      MenuElement.style.animation = 'scaleAnimation .7s ease-in-out forwards'
      MenuElement.style.transformOrigin = 'bottom right'
    }

    if (anchorPosition === 'bottom') {
      MenuElement.style.top = `${anchor.bottom + scrollY + gap}px`
      MenuElement.style.left = `${anchor.left + anchor.width / 2 - menu.width / 2}px`
      MenuElement.style.bottom = `auto`
      MenuElement.style.animation = 'scaleAnimation .7s ease-in-out forwards'
      MenuElement.style.transformOrigin = 'top'
    }
    if (anchorPosition === 'bottom-start') {
      MenuElement.style.top = `${anchor.bottom + scrollY + gap}px`
      MenuElement.style.left = `${anchor.left}px`
      MenuElement.style.bottom = `auto`
      MenuElement.style.animation = 'scaleAnimation .7s ease-in-out forwards'
      MenuElement.style.transformOrigin = 'top left'
    }
    if (anchorPosition === 'bottom-end') {
      MenuElement.style.top = `${anchor.bottom + scrollY + gap}px`
      MenuElement.style.left = `${anchor.left + anchor.width - menu.right}px`
      MenuElement.style.bottom = `auto`
      MenuElement.style.animation = 'scaleAnimation .7s ease-in-out forwards'
      MenuElement.style.transformOrigin = 'top right'
    }

    if (anchorPosition === 'right-start') {
      MenuElement.style.top = `${anchor.top + scrollY}px`
      MenuElement.style.left = `${anchor.left + anchor.width + gap}px`
      MenuElement.style.bottom = `auto`
      MenuElement.style.animation = 'scaleAnimation .7s ease-in-out forwards'
      MenuElement.style.transformOrigin = 'left top'
    }
    if (anchorPosition === 'right') {
      MenuElement.style.top = `${anchor.top + scrollY + anchor.height / 2 - menu.height / 2}px`
      MenuElement.style.left = `${anchor.left + anchor.width + gap}px`
      MenuElement.style.bottom = `auto`
      MenuElement.style.animation = 'scaleAnimation .7s ease-in-out forwards'
      MenuElement.style.transformOrigin = 'left'
    }
    if (anchorPosition === 'right-end') {
      MenuElement.style.top = `${anchor.bottom + scrollY - menu.height}px`
      MenuElement.style.left = `${anchor.left + anchor.width + gap}px`
      MenuElement.style.bottom = `auto`
      MenuElement.style.animation = 'scaleAnimation .7s ease-in-out forwards'
      MenuElement.style.transformOrigin = 'left bottom'
    }

    if (anchorPosition === 'left-start') {
      MenuElement.style.top = `${anchor.top + scrollY}px`
      MenuElement.style.left = `${anchor.left - menu.width - gap}px`
      MenuElement.style.bottom = `auto`
      MenuElement.style.animation = 'scaleAnimation .7s ease-in-out forwards'
      MenuElement.style.transformOrigin = 'right top'
    }
    if (anchorPosition === 'left') {
      MenuElement.style.top = `${anchor.top + scrollY + anchor.height / 2 - menu.height / 2}px`
      MenuElement.style.left = `${anchor.left - menu.width - gap}px`
      MenuElement.style.bottom = `auto`
      MenuElement.style.animation = 'scaleAnimation .7s ease-in-out forwards'
      MenuElement.style.transformOrigin = 'right'
    }
    if (anchorPosition === 'left-end') {
      MenuElement.style.top = `${anchor.bottom + scrollY - menu.height}px`
      MenuElement.style.left = `${anchor.left - menu.width - gap}px`
      MenuElement.style.bottom = `auto`
      MenuElement.style.animation = 'scaleAnimation .7s ease-in-out forwards'
      MenuElement.style.transformOrigin = 'right bottom'
    }
  }
}

const Menu = forwardRef<HTMLDivElement, MenuProps>((props, _ref) => {
  const {
    id,
    open,
    children,
    anchorEl,
    onClose,
    anchor = 'right-start',
    className,
    classNames,
    style,
    zIndex,
    disableBackDrop,
    ...rest
  } = props
  const menuRef = useRef<HTMLDivElement | null>(null)

  const { isVisible, opacity } = HiddenTransisiton(open)
  if (disableBackDrop === undefined || disableBackDrop === null) BackDrop(isVisible)

  useEffect(() => {
    if (anchorEl && isVisible && menuRef.current) {
      AnchorStyles({ anchorPosition: anchor, anchorEl, isVisible, menuRef })
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        anchorEl &&
        !anchorEl.contains(event.target as Node)
      ) {
        onClose()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [anchor, anchorEl, isVisible, onClose])

  if (!isVisible) return <></>

  return ReactDOM.createPortal(
    <div
      ref={menuRef}
      id='presentation'
      className={twMerge(isVisible ? 'absolute' : 'hidden', classNames?.root)}
      style={{ zIndex: zIndex || style?.zIndex || 20, ...style }}
      {...rest}
    >
      <ul
        id={id}
        className={twMerge(
          'p-2 text-sm text-gray-700',
          `transition-opacity duration-300 opacity-${opacity}`,
          'bg-background-paper dark:bg-background-paper-dark rounded-lg min-w-[10rem] h-full overflow-auto border shadow-lg',
          className,
          classNames?.ul
        )}
      >
        {children}
      </ul>
    </div>,
    document.body
  )
})

Menu.displayName = 'Menu'

export default Menu
