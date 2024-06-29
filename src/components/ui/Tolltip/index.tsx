'use client'
import { MutableRefObject, ReactNode, useRef } from 'react'
import ReactDOM from 'react-dom'
import HiddenTransisiton from 'src/components/utility/UI/HiddenTransisiton'
import { twMerge } from 'tailwind-merge'
import Menu, { AnchorStyles, MenuProps } from '../Menu'
import MenuHoverHook from '../Menu/MenuHoverHook'
import Arrow from './Arrow'

export interface TooltipProps {
  title: string | ReactNode
  anchor?: MenuProps['anchor']
  arrow?: boolean | string
  classNames?: { button?: string; menu?: string }
}

const AnchorToolTipMenu = (
  props: TooltipProps & { show: boolean; anchorEl: MutableRefObject<HTMLDivElement | null> }
) => {
  const { title, anchorEl, anchor = 'right-start', classNames, show, arrow } = props
  const menuRef = useRef<HTMLDivElement | null>(null)
  const { isVisible, opacity } = HiddenTransisiton(show)
  if (anchorEl) AnchorStyles({ anchorPosition: anchor, anchorEl: anchorEl.current, isVisible, menuRef })

  if (!isVisible) return <></>

  const arrowColor = typeof arrow === 'string' ? arrow : ''

  return ReactDOM.createPortal(
    <div ref={menuRef} id='tooltip' className={twMerge(isVisible ? 'absolute' : 'hidden')} style={{ zIndex: 50 }}>
      <ul
        className={twMerge(
          'rounded-lg p-1',
          `transition-opacity inline-block duration-300 opacity-${opacity}`,
          'bg-secondary-dark/80 border-0 text-white min-w-fit',
          classNames?.menu
        )}
      >
        {title}
        {arrow && <Arrow position={anchor} color={arrowColor} />}
      </ul>
    </div>,
    document.body
  )
}

const AnchorToolTip = (props: TooltipProps & { show: boolean; children: ReactNode }) => {
  const { title, children, anchor = 'right-start', classNames, show, arrow } = props
  const anchorEl = useRef<HTMLDivElement | null>(null)

  return (
    <>
      <div ref={anchorEl} className={classNames?.button}>
        {children}
      </div>
      <AnchorToolTipMenu
        anchorEl={anchorEl}
        title={title}
        anchor={anchor}
        classNames={classNames}
        show={show}
        arrow={arrow}
      />
    </>
  )
}

const Tooltip = (props: TooltipProps & { show?: boolean; children: ReactNode }) => {
  let { title, children, anchor, classNames, show, arrow } = props
  if (show === true || show === false) return <AnchorToolTip show={show} {...props} />

  const { button, menu } = MenuHoverHook()
  const arrowColor = typeof arrow === 'string' ? arrow : ''

  return (
    <>
      <div {...button} className={twMerge('inline', classNames?.button)}>
        {children}
      </div>

      <Menu
        anchor={anchor || 'right'}
        {...menu}
        disableBackDrop
        zIndex={50}
        classNames={{
          ul: twMerge('rounded-lg p-1', 'bg-secondary-dark/80 border-0 text-white min-w-fit', classNames?.menu)
        }}
      >
        {title}
        {arrow !== undefined ? <Arrow position={anchor} color={arrowColor} /> : <></>}
      </Menu>
    </>
  )
}

export default Tooltip
