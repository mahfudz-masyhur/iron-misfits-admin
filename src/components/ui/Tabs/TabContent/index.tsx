import { HTMLAttributes, forwardRef } from 'react'

interface MoreProps {
  value: string
  state: string
  lazyLoad?: boolean
}

export type TabContentProps = HTMLAttributes<HTMLDivElement> & MoreProps

const TabContent = forwardRef<HTMLDivElement, TabContentProps>((props, ref) => {
  const { value, state, lazyLoad, ...rest } = props
  if (lazyLoad) {
    return state === value ? (
      <div ref={ref} id='profile' role='tabpanel' aria-labelledby='profile-tab' {...rest} />
    ) : (
      <></>
    )
  }

  return (
    <div
      ref={ref}
      className={state === value ? 'block' : 'hidden'}
      id='profile'
      role='tabpanel'
      aria-labelledby='profile-tab'
      {...rest}
    />
  )
})

TabContent.displayName = 'TabContent'

export default TabContent
