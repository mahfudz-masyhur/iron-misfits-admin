import React, { ReactNode, useState } from 'react'
import Select from '../ui/Select'
import Option from '../ui/Select/Option'
import { useRouter } from 'next/router'
import { removeEmptyStringProperties, removeUndefinedProperties } from '../utility/formats'
import TextField from '../ui/TextField'
import { DebounceCallback } from '../utility/UI/DebounceUI'
import IconClose from '../ui/Icon/IconClose'
import Pagination from '../ui/Pagination'
import useMediaQuery from '../utility/UI/useMediaQuery'
import { twMerge } from 'tailwind-merge'
import IconSearch from '../ui/Icon/IconSearch'

const Limit = () => {
  const sm = useMediaQuery('sm')
  const router = useRouter()
  const limitValue = [5, 10, 15, 20, 35, 50]
  function onChange({ target }: any) {
    const { value } = target
    let query = {}
    console.log({ if: `${value}` === '10', value: `${value}` })

    if (`${value}` !== '10') query = { ...router.query, limit: value, page: undefined }
    else query = { ...router.query, limit: undefined, page: undefined }

    query = removeUndefinedProperties(query)
    query = removeEmptyStringProperties(query)

    return router.push({ query })
  }

  return (
    <Select
      variant='default'
      value={`${router.query.limit || 10}`}
      onChange={onChange}
      placeholder={sm ? undefined : 'entries per page'}
      fullWidth={sm ? undefined : true}
      sizes='small'
      className={sm ? 'w-14' : undefined}
      noFocusAnimation
    >
      {limitValue.map(v => (
        <Option value={`${v}`} key={v}>
          {v}
        </Option>
      ))}
    </Select>
  )
}

const Search = () => {
  const router = useRouter()
  const [search, setSearch] = useState(router.query.search?.toString() || '')
  const onSearch = DebounceCallback((e: any) => handleSearch(e))

  const handleSearch = (e: { target: { value: string; name: string } }) => {
    let query = {}
    const { value } = e.target

    if (value) query = { ...router.query, search: value, page: undefined }
    else query = { ...router.query, search: undefined, page: undefined }

    query = removeUndefinedProperties(query)
    query = removeEmptyStringProperties(query)

    return router.push({ query })
  }

  return (
    <TextField
      variant='default'
      value={search}
      fullWidth
      placeholder='Search...'
      noFocusAnimation
      startAdornment={<IconSearch fontSize={18} color='inherit' />}
      endAdornment={
        search ? (
          <button
            onClick={() => {
              setSearch('')
              onSearch({ target: { value: '' } })
            }}
          >
            <IconClose fontSize={12} />
          </button>
        ) : undefined
      }
      onChange={(e: { target: { value: React.SetStateAction<string> } }) => {
        setSearch(e.target.value)
        onSearch(e)
      }}
    />
  )
}

interface PaginationProps {
  maxPage: number
  page: number
}

const PaginateTable = ({ maxPage, page }: PaginationProps) => {
  const router = useRouter()
  const sm = useMediaQuery('sm')
  function onPageChange(page: number) {
    let query = {}

    if (`${page}` !== '1') query = { ...router.query, page: page }
    else query = { ...router.query, page: undefined }

    query = removeUndefinedProperties(query)
    query = removeEmptyStringProperties(query)

    return router.push({ query })
  }

  return (
    <Pagination
      totalCount={maxPage}
      variant='contained'
      sizes={!sm ? 'small' : 'medium'}
      round='circle'
      currentPage={page || 1}
      onPageChange={onPageChange}
    />
  )
}

interface Props extends PaginationProps {
  children: ReactNode
  moreFilter?: JSX.Element
  classNames?: {
    root?: string
    limit?: string
    search?: string
    paginate?: string
  }
}

function TableSearch({ children, moreFilter, maxPage, page, classNames }: Props) {
  return (
    <>
      {/* root */}
      <div
        className={twMerge(
          'flex flex-col-reverse sm:flex-row gap-2 justify-between sm:items-center mb-2',
          classNames?.root
        )}
      >
        {/* limit */}
        <div className={twMerge(classNames?.limit)}>
          <Limit />
        </div>
        {/* search */}
        <div className={twMerge('flex gap-1', classNames?.search)}>
          <Search />
          {moreFilter}
        </div>
      </div>

      {children}

      {/* paginate */}
      <div className={twMerge('text-right mt-2', classNames?.paginate)}>
        <PaginateTable maxPage={maxPage} page={page} />
      </div>
    </>
  )
}

export default TableSearch
