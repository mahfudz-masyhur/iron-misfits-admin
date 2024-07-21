'use client'
import { VariantProps } from 'class-variance-authority'
import {
  Children,
  HTMLAttributes,
  LegacyRef,
  cloneElement,
  forwardRef,
  isValidElement,
  useRef,
  useState,
  useLayoutEffect
} from 'react'
import { twMerge } from 'tailwind-merge'
import IconClose from '../Icon/IconClose'
import IconDownLineFill from '../Icon/IconDownLineFill'
import { variantIsChoose, variantsInputOutline, variantslabel, variantslabelActive } from '../TextField/FieldVariant'

interface MoreProps {
  name?: string
  value?: string | string[]
  isClearable?: boolean
  disabled?: boolean
  readOnly?: boolean
  noFocusAnimation?: boolean
  placeholder?: string
  multiple?: boolean
  label?: string
  helperText?: string | JSX.Element | boolean
  variant?: 'bordered' | 'underlined' | 'default'
  error?: boolean
  startAdornment?: JSX.Element
  endAdornment?: JSX.Element
  fullWidth?: boolean
  margin?: 'none' | 'dense' | 'normal'
  color?: 'primary' | 'success' | 'error' | 'warning' | 'info' | 'default'
  onChange?: any
}

export type TextFieldProps = HTMLAttributes<any> & VariantProps<typeof variantsInputOutline> & MoreProps

const HookSelect = (intialValue: boolean) => {
  const [menuOpen, setMenuOpen] = useState(false)
  const [value, setValue] = useState(intialValue)
  const [isFocused, setIsFocused] = useState(false)
  const selectRef = useRef<HTMLDivElement | null>(null)

  const handleDocumentClick = (event: MouseEvent) => {
    const isInsideComponent = selectRef.current?.contains(event.target as Node)

    if (!isInsideComponent) {
      setMenuOpen(false)
      setIsFocused(false)
    }
  }
  const handleFocus = () => setIsFocused(true)
  const handleBlur = () => setIsFocused(false)

  useLayoutEffect(() => {
    if (menuOpen) {
      const selectElement = selectRef.current
      const selectRect = selectElement?.getBoundingClientRect()
      const optionElement = selectElement?.children[1] as HTMLElement | null

      if (selectRect && optionElement) {
        const bottomSpace = window.innerHeight - selectRect.bottom
        const optionHeight = optionElement.offsetHeight
        if (bottomSpace < optionHeight) {
          optionElement.style.height = optionHeight < selectRect.top - 10 ? 'auto' : `${selectRect.top - 10}px`
          optionElement.style.top =
            optionHeight < selectRect.top + 10 ? `-${optionHeight + 10}px` : `-${selectRect.top}px`
          optionElement.style.bottom = 'auto'
        } else {
          optionElement.style.height = optionHeight < bottomSpace - 10 ? 'auto' : `${bottomSpace - 10}px`
          optionElement.style.top = `${selectRect.height + 4}px`
          optionElement.style.bottom = 'auto'
        }
      }
    }
    if (!intialValue) setValue(false)
    else setValue(true)

    document.addEventListener('click', handleDocumentClick)

    return () => {
      document.removeEventListener('click', handleDocumentClick)
    }
  }, [intialValue, menuOpen])

  return {
    selectRef,
    setMenuOpen,
    menuOpen,
    handleFocus,
    handleBlur,
    focus: isFocused || value
  }
}

const Select = forwardRef<HTMLSelectElement, TextFieldProps>((props: TextFieldProps, ref) => {
  let {
    label,
    error,
    value: intialValue,
    helperText,
    startAdornment,
    endAdornment,
    fullWidth,
    isClearable,
    placeholder,
    margin = 'none',
    color,
    variant = 'bordered',
    sizes,
    disabled,
    readOnly,
    className,
    children,
    multiple,
    noFocusAnimation,
    ...rest
  } = props
  intialValue = Array.isArray(intialValue) ? intialValue.map(value => value.toString()) : intialValue
  const setvalue = (children as JSX.Element[])
    .map(element => {
      let value
      if (multiple) {
        if ((intialValue as string[])?.includes(element.props?.value)) value = element.props?.children
      } else {
        if (element?.props?.value === intialValue) value = element?.props?.children
      }
      return value
    })
    .filter(value => value !== undefined)
  const [nameValue, setNameValue] = useState<string | string[] | undefined>(setvalue)
  const isThereValue = Boolean(Array.isArray(intialValue) ? intialValue.length > 0 : intialValue)
  const { selectRef, setMenuOpen, menuOpen, handleBlur, handleFocus, focus } = HookSelect(isThereValue)

  if (!!error) color = 'error'

  const { variantChoose, fieldClassName } = variantIsChoose({
    variant,
    sizes,
    color,
    error,
    disabled,
    focus,
    margin,
    label,
    helperText,
    fullWidth,
    noFocusAnimation
  })

  function handleSelect(e:any, value:string, text:string) {
    const { name, onChange } = rest
    if (!multiple) {
      setMenuOpen(false)
      setNameValue(value ? text : '')
      if (!onChange) return
      onChange({ ...e, target: { value: value, name } })
    } else {
      if ((intialValue as string[])?.includes(value)) {
        if (value && text) {
          if (Array.isArray(nameValue)) setNameValue(nameValue.filter(val => val !== text))
          if (!onChange) return
          onChange({ ...e, target: { value: (intialValue as string[]).filter(val => val !== value), name } })
        }
      } else {
        if (value) {
          if (Array.isArray(nameValue)) setNameValue([...nameValue, text])
          else setNameValue([text])
          if (!onChange) return
          onChange({ ...e, target: { value: [...(intialValue as string[]), value], name } })
        }
      }
    }
  }

  function handleIsClearable(e: any) {
    e.stopPropagation()
    const { name, onChange } = rest
    if (!onChange) return
    setNameValue(e.target.value ? e.target.text : '')
    onChange({ target: { value: multiple ? [] : '', name } })
  }

  return (
    <div className={twMerge(fieldClassName)} ref={selectRef}>
      <div
        onFocus={handleFocus}
        onBlur={handleBlur}
        onClick={() => {
          if (!disabled) setMenuOpen(p => !p)
          if (readOnly) setMenuOpen(p => !p)
        }}
        className={twMerge(
          'relative',
          'inline-flex gap-2 items-center bg-inherit transition-transform duration-400 w-full',
          (sizes === 'small' || sizes === 'large') && 'px-2',
          variantChoose
        )}
      >
        {/* startAdornment */}
        {startAdornment && <span className='text-sm'>{startAdornment}</span>}

        {/* input container */}
        <span className={fullWidth ? 'w-full' : undefined}>
          {/* label */}
          {label && (
            <label
              className={twMerge(
                variantslabel({ sizes }),
                focus && variantslabelActive({ sizes, color }),
                startAdornment && focus && '-translate-x-8',
                error && 'text-error-main'
              )}
              style={{ pointerEvents: 'none' }}
            >
              {label}
            </label>
          )}

          {/* input */}
          <input
            readOnly
            ref={ref as LegacyRef<HTMLInputElement>}
            placeholder={label && focus ? placeholder : label ? '' : placeholder}
            disabled={disabled}
            className={twMerge(
              fullWidth && 'w-full cursor-auto',
              'bg-inherit focus:outline-none focus:ring-0',
              disabled && 'text-gray-300',
              className
            )}
            value={nameValue}
            {...rest}
          />
        </span>

        {/* endAdornment */}
        {endAdornment && <span className='text-sm'>{endAdornment}</span>}
        {isThereValue && isClearable && (
          <button
            type='button'
            onClick={handleIsClearable}
            disabled={disabled || readOnly}
            className={`${menuOpen ? 'text-gray-500' : 'text-gray-300'} ${
              !(disabled || readOnly) && 'hover:text-gray-600'
            }`}
          >
            <IconClose fontSize={15} />
          </button>
        )}
        <span
          className={`pl-1 ${menuOpen ? 'text-gray-500' : 'text-gray-300'} border-l ${
            !(disabled || readOnly) && 'hover:text-gray-600'
          } border-divider dark:border-gray-600`}
        >
          <IconDownLineFill fontSize={20} />
        </span>
      </div>
      <div
        tabIndex={-1}
        className={twMerge(
          'absolute left-0 right-0 -bottom-14 z-20',
          'rounded-xl shadow bg-background-paper dark:bg-background-paper-dark border text-inherit',
          'overflow-hidden',
          menuOpen ? 'block' : 'hidden'
        )}
      >
        <div className='max-h-[20rem] overflow-auto p-2'>
          {Children.map(children, (child, index) => {
            if (isValidElement(child)) {
              // Menambahkan event listener onClick ke setiap elemen <option>
              return cloneElement(child as any, {
                onClick: (e: any)=>handleSelect(e, child.props.value, child.props.children),
                className: !multiple
                  ? child.props.value === intialValue
                    ? "before:content-['✓'] before:block before:mr-3 -pl-3"
                    : undefined
                  : (intialValue as string[])?.includes(child.props.value)
                  ? "before:content-['✓'] before:block before:mr-3 -pl-3"
                  : undefined
              })
            }
            return child
          })}
        </div>
      </div>
      {/* helperText */}
      {helperText && (
        <p className={twMerge('text-xs text-gray-500 absolute -bottom-4 left-3', error && 'text-error-main')}>
          {helperText}
        </p>
      )}
    </div>
  )
})

Select.displayName = 'Select'

export default Select
