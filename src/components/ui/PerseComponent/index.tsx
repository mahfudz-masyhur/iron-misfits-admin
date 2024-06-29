import parse from 'html-react-parser'
import { twMerge } from 'tailwind-merge'
import style from './unreset.module.css'

function PerseComponent({
  data,
  unresetTailwind,
  className,
  Component = 'div'
}: {
  data: string
  unresetTailwind?: boolean
  className?: string
  Component?: any
}) {
  return <Component className={twMerge(unresetTailwind && style.unreset, className)}>{parse(data)}</Component>
}

export default PerseComponent
