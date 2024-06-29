import { ButtonHTMLAttributes, ReactNode, forwardRef } from 'react'

interface MoreProps {
  href?: string
  value: string
  label: string
  selectedClass?: string
  iconStart?: ReactNode
  iconEnd?: ReactNode
  LinkComponent?: any
}

export type TabProps = ButtonHTMLAttributes<HTMLButtonElement> & MoreProps

const Tab = forwardRef<HTMLButtonElement, TabProps>((props: TabProps, ref) => {
  const { value, ...rest } = props
  return <button id={`${value}-tab`} data-tabs-target={`#${value}`} type='button' role='tab' {...rest} />
})

Tab.displayName = 'Tab'

export default Tab
