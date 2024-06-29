'use client'
import {
  Children,
  HTMLProps,
  ReactNode,
  RefObject,
  SyntheticEvent,
  forwardRef,
  isValidElement,
  useEffect,
  useRef,
  useState
} from 'react'
import IconChevronLeft from 'src/components/ui/Icon/IconChevronLeft'
import IconChevronRight from 'src/components/ui/Icon/IconChevronRight'
import useRipple from 'src/components/utility/UI/useRipple'
import { twMerge } from 'tailwind-merge'

interface MoreProps {
  value: string
  onChange?: (event: React.SyntheticEvent, newValue: string) => void
  className?: HTMLProps<HTMLDivElement>['className']
  children: ReactNode[]
  scrollable?: boolean
  selector?: 'animation' | 'ordinary'
  ripple?: boolean
  classNames?: {
    root?: HTMLProps<HTMLDivElement>['className']
    selector?: HTMLProps<HTMLDivElement>['className']
    ul?: HTMLProps<HTMLDivElement>['className']
  }
}

export type TabsProps = MoreProps

const Tabs = forwardRef<HTMLDivElement | null, TabsProps>((props: TabsProps, ref) => {
  const { value, className, children, onChange, scrollable, selector = 'ordinary', ripple, classNames, ...rest } = props
  const tabsRef = useRef<HTMLUListElement | null>(null)
  const [scrollableSet, setScrollableSet] = useState(false)
  const [selectorElmnt, setSelector] = useState({})
  const [activeTabIndex, setActiveTabIndex] = useState(0)

  function handleChange(event: SyntheticEvent, newValue: string, tabRef: RefObject<HTMLButtonElement>) {
    const childElement = tabRef.current
    handleSelector(childElement)
    if (!onChange) return null
    return onChange(event, newValue)
  }

  function handleSelector(childElement: HTMLButtonElement | HTMLAnchorElement | null) {
    const parentElement = tabsRef.current
    if (!parentElement || !childElement) return

    const parentRect = parentElement.getBoundingClientRect()
    const childRect = childElement.getBoundingClientRect()

    // Calculate the correct position considering scroll
    const top = childRect.top - parentRect.top
    const bottom = childRect.bottom - parentRect.bottom
    const left = childRect.left - parentRect.left + parentElement.scrollLeft
    const width = childRect.width

    setSelector({ top, bottom, left, width })
  }

  const scrollLeft = () => {
    if (tabsRef.current)
      tabsRef.current.scrollTo({
        left: tabsRef.current.scrollLeft - tabsRef.current.clientWidth,
        behavior: 'smooth'
      })
  }

  const scrollRight = () => {
    if (tabsRef.current)
      tabsRef.current.scrollTo({
        left: tabsRef.current.scrollLeft + tabsRef.current.clientWidth,
        behavior: 'smooth'
      })
  }

  useEffect(() => {
    if (tabsRef.current) {
      const childElements = tabsRef.current.querySelectorAll('li')
      childElements.forEach((childElement, index) => {
        if (childElement.children[0] instanceof HTMLElement && childElement.children[0].dataset.selected === 'true') {
          handleSelector(childElement.children[0] as HTMLButtonElement | HTMLAnchorElement | null)
          setActiveTabIndex(index)
        }
      })
      const tabsWidth = tabsRef.current.scrollWidth
      const viewportWidth = tabsRef.current.clientWidth
      setScrollableSet(tabsWidth > viewportWidth)
    }
    if (scrollableSet && scrollable && tabsRef.current && activeTabIndex !== -1) {
      const tabElements = tabsRef.current.querySelectorAll('button')
      const activeTabElement = tabElements[activeTabIndex] as HTMLButtonElement

      if (activeTabElement) {
        const parentRect = tabsRef.current.getBoundingClientRect()
        const childRect = activeTabElement.getBoundingClientRect()

        const left = childRect.left - parentRect.left + tabsRef.current.scrollLeft
        const right = left + childRect.width
        const viewportLeft = tabsRef.current.scrollLeft
        const viewportRight = viewportLeft + tabsRef.current.clientWidth

        if (left < viewportLeft) {
          tabsRef.current.scrollTo({
            left,
            behavior: 'smooth'
          })
        } else if (right > viewportRight) {
          tabsRef.current.scrollTo({
            left: right - tabsRef.current.clientWidth,
            behavior: 'smooth'
          })
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scrollableSet, activeTabIndex, value])

  return (
    <div ref={ref} className={twMerge(classNames?.root, scrollableSet && scrollable && 'px-6')} style={{position: 'relative'}}>
      <ul
        ref={tabsRef}
        id='tabs'
        className={twMerge(
          'scrollbar-none',
          'flex flex-nowrap items-stretch',
          'overflow-x-auto whitespace-nowrap',
          'text-sm font-medium text-center',
          // 'border rounded-xl p-1',
          'relative h-full',
          classNames?.ul,
          className
        )}
        {...rest}
      >
        {Object.keys(selectorElmnt).length > 0 && (
          <div className='py-0.5 transition-all duration-300' style={{ position: 'absolute', ...selectorElmnt }}>
            <div
              className={twMerge(
                'rounded-lg w-full h-full bg-background-paper dark:bg-background-paper-dark border-0 hover:bg-transparent shadow-md',
                // 'border-b-2 w-16 m-auto h-full border-primary-main',
                classNames?.selector
              )}
            />
          </div>
        )}

        {Children.map(children, (child, index) => {
          if (!isValidElement(child)) return null
          const {
            value: tabValue,
            label,
            className,
            selectedClass,
            iconStart,
            iconEnd,
            href,
            LinkComponent
          } = child.props
          const isActive = tabValue === value
          // eslint-disable-next-line react-hooks/rules-of-hooks
          const tabRef = useRef<HTMLButtonElement | null>(null)
          // eslint-disable-next-line react-hooks/rules-of-hooks
          const ripples = useRipple(tabRef)

          return LinkComponent && href ? (
            <li key={tabValue + '-' + index}>
              <LinkComponent
                href={href}
                ref={tabRef}
                data-ripple-custom-color='bg-gray-300'
                data-selected={isActive}
                title={label}
                className={twMerge(
                  'relative overflow-hidden',
                  'transition-all duration-300',
                  'min-w-[5rem] h-full cursor-pointer',
                  'p-2',
                  'inline-flex items-center justify-center gap-1',
                  isActive && selectedClass,
                  className
                )}
                onClick={(e: any) => handleChange(e, tabValue, tabRef)}
                style={{ WebkitTapHighlightColor: 'transparent' }}
              >
                {ripple && ripples}
                {iconStart}
                {label}
                {iconEnd}
              </LinkComponent>
            </li>
          ) : (
            <li key={tabValue + '-' + index}>
              <button
                ref={tabRef}
                data-ripple-custom-color='bg-gray-300'
                data-selected={isActive}
                title={label}
                className={twMerge(
                  'relative overflow-hidden',
                  'transition-all duration-300',
                  'min-w-[5rem] h-full cursor-pointer',
                  'p-2',
                  'inline-flex items-center justify-center gap-1',
                  isActive && selectedClass,
                  className
                )}
                onClick={e => handleChange(e, tabValue, tabRef)}
                style={{ WebkitTapHighlightColor: 'transparent' }}
              >
                {ripple && ripples}
                {iconStart}
                {label}
                {iconEnd}
              </button>
            </li>
          )
        })}
      </ul>
      {scrollableSet && scrollable && (
        <>
          <button
            className='absolute left-0 w-6 h-full transform -translate-y-1/2 top-1/2'
            onClick={scrollLeft}
            style={{ WebkitTapHighlightColor: 'transparent' }}
          >
            <IconChevronLeft fontSize={15} className='m-auto' />
          </button>
          <button
            className='absolute right-0 w-6 h-full transform -translate-y-1/2 top-1/2'
            onClick={scrollRight}
            style={{ WebkitTapHighlightColor: 'transparent' }}
          >
            <IconChevronRight fontSize={15} className='m-auto' />
          </button>
        </>
      )}
    </div>
  )
})

Tabs.displayName = 'Tabs'

export default Tabs
