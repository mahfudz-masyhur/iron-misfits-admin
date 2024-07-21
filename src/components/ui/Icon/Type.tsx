import { HTMLAttributes } from 'react'
import { color } from 'src/components/ui/Type'

interface MoreProps {
  fontSize?: number
  color?: color | 'inherit'
}

export type IconProps = MoreProps & HTMLAttributes<SVGSVGElement>
