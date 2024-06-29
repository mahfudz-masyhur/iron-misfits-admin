import {
  ChangeEvent,
  DependencyList,
  KeyboardEvent,
  MutableRefObject,
  ReactNode,
  useLayoutEffect,
  useRef,
  useState
} from 'react'
import CircularProgress from 'src/components/ui/CircularProgress'
import ClickAwayListener from 'src/components/ui/ClickAwayListener'
import { DebounceCallback } from 'src/components/utility/UI/DebounceUI'
import { twMerge } from 'tailwind-merge'
import IconDownLineFill from '../Icon/IconDownLineFill'
import Input from '../Input'
import IconClose from '../Icon/IconClose'

interface Props {
  id?: string
  label?: string
  multiple?: boolean
  isClearable?: boolean
  disabled?: boolean
  stickyInput?: boolean
  fullWidth?: boolean
  notFetching?: boolean
  error?: boolean
  addField?: 'at-start' | 'at-last'
  helperText?: string | JSX.Element | boolean
  field: any
  rerender?: DependencyList
  setFieldValue: (q: any) => void
  options?: any
  fetch?: (q: string) => Promise<any>
  renderOption: (option: any, props: { key: number; className: string; onClick: () => void }) => JSX.Element
  renderFieldArray?: (item: any, props: { key: number; tabIndex: number; onDelete: () => void }) => JSX.Element
  lableSort?: (firstIndex: boolean, item: any, prevItem: any, lastIndex: boolean) => JSX.Element
  sortingFieldArray?: (item: any[]) => any[]
  getOption: (option?: any) => { _id: any }
  margin?: 'none' | 'dense' | 'normal'
  color?: 'primary' | 'success' | 'error' | 'warning' | 'info' | 'default'
  customInput?: (input: {
    value: string
    onKeyDown: (event: KeyboardEvent<HTMLInputElement>) => void
    onClick: () => void
    onChange: (e: any) => void
    id?: string
  }) => JSX.Element
  classNames?: {
    root?: string
    stickyInput?: string
    ulRenderFieldArray?: string
    liRenderFieldArray?: string
  }
}

const AutoCompleteMenu = ({
  children,
  selectRef,
  margin,
  label,
  rerender,
  helperText,
  stickyInput
}: {
  children: ReactNode
  selectRef: MutableRefObject<HTMLDivElement | null>
  rerender?: DependencyList
  margin?: 'none' | 'dense' | 'normal'
  label?: string
  stickyInput?: boolean
  helperText?: string | JSX.Element | boolean
}) => {
  useLayoutEffect(() => {
    const selectElement = selectRef.current
    const selectRect = selectElement?.children[0]?.getBoundingClientRect()

    const optionElement = selectElement?.children[1] as HTMLElement | null

    if (selectRect && optionElement) {
      const bottomSpace = window.innerHeight - selectRect.bottom
      const optionHeight = optionElement.clientHeight
      let top = optionHeight
      let bottom = selectRect.height
      switch (margin) {
        case 'dense':
          if (helperText) bottom = selectRect.height + 13
          else bottom = selectRect.height + 20

          if (label) top = optionHeight - 6
          else top = optionHeight + 1
          break
        case 'normal':
          bottom = selectRect.height + 20
          top = optionHeight - 6
          break
        default:
          if (helperText) bottom = selectRect.height + 5
          else bottom = selectRect.height + 5

          if (label) top = optionHeight - 6
          else top = optionHeight + 10
          break
      }
      if (bottomSpace < optionHeight) {
        optionElement.style.top = `-${top}px`
        optionElement.style.bottom = `auto`
      } else {
        optionElement.style.top = `${bottom}px`
        optionElement.style.bottom = 'auto'
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, rerender || [])
  return (
    <div
      id='option'
      className={`absolute left-0 z-10 w-full ${
        stickyInput && 'my-1'
      } overflow-hidden border shadow-md rounded-xl bg-background-paper dark:bg-background-paper-dark`}
    >
      <ul className='p-2 overflow-auto max-h-60'>{children}</ul>
    </div>
  )
}

function Autocomplete(props: Props) {
  const {
    multiple,
    field,
    options,
    fetch,
    renderOption,
    setFieldValue,
    renderFieldArray,
    getOption,
    fullWidth,
    customInput,
    notFetching,
    isClearable,
    lableSort,
    sortingFieldArray,
    classNames,
    rerender,
    stickyInput,
    addField: addFieldValue,
    ...rest
  } = props
  const optionss = options?.map(getOption)
  const selectRef = useRef<HTMLDivElement | null>(null)
  const isFetching = !notFetching
  const keyNames = Object.keys(isFetching ? getOption() : (optionss && optionss[1]) || {})
  const [state, setState] = useState<any>(!isFetching ? optionss : undefined)
  const [load, setLoad] = useState<boolean>(false)
  const [value, setValue] = useState<string>(field?.[keyNames[1]])
  const [open, setOpen] = useState<boolean>(false)
  const [selectedSuggestion, setSelectedSuggestion] = useState<any | null>(null)

  const fetchAPI = async (e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    try {
      if (e.target.value !== '' && fetch) {
        const res = await fetch(e.target.value)
        setState(res.map(getOption))
      }
      setLoad(false)
    } catch (err) {
      setLoad(false)
    }
  }

  function filterFunction(search: string) {
    const filteredOptions = optionss.filter(
      (option: any) => option[keyNames[1]]?.toLowerCase().indexOf(search.toLowerCase()) !== -1
    )

    return filteredOptions
  }

  const onSearchOption = (e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    if (e.target.value !== '') setState(filterFunction(e.target.value))
    else setState(optionss)
    setLoad(false)
  }

  const onSearch = DebounceCallback(fetchAPI, 1000, setLoad, rerender)

  function addField(v: any) {
    if (multiple) {
      const find = field?.find((x: any) => x._id === v._id)
      if (!!find) {
        const index = field.indexOf(find)
        if (index > -1) field.splice(index, 1)
        setFieldValue(field)
        return
      }
      setFieldValue(addFieldValue === 'at-last' ? [...field, v] : [v, ...field])
      setValue('')
    } else {
      setFieldValue(v)
      setOpen(false)
      setValue(!v ? '' : v?.[keyNames[1]])
    }
  }

  function handleDelete(index: number) {
    const array = field
    if (index > -1 && index < array.length) {
      array.splice(index, 1)
    }
    return array
  }

  const handleSelectSuggestion = (suggestion: any) => {
    addField(suggestion)
    setSelectedSuggestion(suggestion)
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && selectedSuggestion) {
      event.preventDefault()
      handleSelectSuggestion(selectedSuggestion)
    } else if (event.key === 'ArrowUp') {
      event.preventDefault()
      const selectedIndex = selectedSuggestion ? state.indexOf(selectedSuggestion) : -1

      if (selectedIndex > 0) {
        setSelectedSuggestion(state[selectedIndex - 1])
      } else {
        setSelectedSuggestion(state[state?.length - 1])
      }
    } else if (event.key === 'ArrowDown') {
      event.preventDefault()
      const selectedIndex = selectedSuggestion ? state.indexOf(selectedSuggestion) : -1

      if (selectedIndex < state?.length - 1) {
        setSelectedSuggestion(state[selectedIndex + 1])
      } else {
        setSelectedSuggestion(state[0])
      }
    }
  }

  const autoCompleteMenu = () => {
    let menu
    if (state?.length > 0)
      menu = (
        <AutoCompleteMenu selectRef={selectRef} stickyInput={stickyInput} rerender={rerender} {...rest}>
          {state.map((item: any, i: number) => {
            let selected
            if (!multiple) selected = (selectedSuggestion?._id || field?.[keyNames[0]]) === item?._id
            else selected = field.some((v: any) => v._id === item?._id)
            return renderOption(item, {
              key: i,
              className: twMerge(
                'rounded-lg p-2 pl-8 hover:bg-gray-400/10 cursor-pointer flex',
                selected && "before:content-['✓'] before:block before:mr-3 -pl-3"
              ),
              onClick: () => handleSelectSuggestion(item)
            })
          })}
        </AutoCompleteMenu>
      )

    if (state?.length == 0)
      menu = (
        <AutoCompleteMenu selectRef={selectRef} stickyInput={stickyInput} rerender={rerender} {...rest}>
          <li className='px-3 py-2 cursor-not-allowed'>tidak di temukan</li>
        </AutoCompleteMenu>
      )

    return menu
  }

  function handleIsClearable(e: any) {
    if (rest.disabled) return
    e.stopPropagation()
    if (multiple) {
      setFieldValue([])
      setValue('')
    } else {
      setFieldValue('')
      setOpen(false)
      setValue('')
    }
  }

  const input = {
    value: value,
    onKeyDown: handleKeyDown,
    onClick: () => setOpen(p => !p),
    onChange: (e: any) => {
      if (e.target.value !== '') {
        setOpen(true)
        if (isFetching) onSearch(e)
        else onSearchOption(e)
      }
      setValue(e.target.value)
    },
    endAdornment: load ? (
      <CircularProgress color='primary' />
    ) : (
      <div className='flex items-center gap-2'>
        {(multiple ? Boolean(field?.length > 0 && isClearable) : Boolean(value && isClearable)) && (
          <button
            type='button'
            disabled={rest.disabled}
            onClick={handleIsClearable}
            className={!rest.disabled ? `hover:text-gray-900 text-gray-500` : undefined}
          >
            <IconClose fontSize={15} />
          </button>
        )}
        <IconDownLineFill className={open ? 'text-gray-500' : 'text-gray-300'} fontSize={20} />
      </div>
    ),
    autoCompleteMenu: open ? autoCompleteMenu() : undefined,
    autoComplete: 'off',
    ...rest
  }

  let sortingOrNot = field
  if (sortingFieldArray) {
    sortingOrNot = sortingFieldArray(sortingOrNot)
  }

  return (
    <ClickAwayListener onClickAway={() => setOpen(false)}>
      {/* root */}
      <div className={twMerge('relative', classNames?.root)} ref={selectRef}>
        {stickyInput ? (
          <div
            className={twMerge(
              'sticky z-10 top-1 bg-background-paper dark:bg-background-paper-dark',
              classNames?.stickyInput
            )}
          >
            {customInput ? (
              customInput(input)
            ) : (
              <Input type='text' placeholder='Type something...' fullWidth={fullWidth} {...input} />
            )}
          </div>
        ) : customInput ? (
          customInput(input)
        ) : (
          <Input type='text' placeholder='Type something...' fullWidth={fullWidth} {...input} />
        )}
        {multiple && (
          <ul className={twMerge('p-1 overflow-auto text-sm max-h-64', classNames?.ulRenderFieldArray)}>
            {sortingOrNot?.map((item: any, i: number) => {
              return (
                <li key={`${i}`} className={classNames?.liRenderFieldArray}>
                  {lableSort ? (
                    lableSort(i === 0, item, sortingOrNot[i - 1], i === (sortingOrNot?.length || 0) - 1)
                  ) : (
                    <></>
                  )}
                  {renderFieldArray
                    ? renderFieldArray(item, {
                        key: i,
                        tabIndex: -1,
                        onDelete: () => handleDelete(i)
                      })
                    : undefined}
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </ClickAwayListener>
  )
}

export default Autocomplete
