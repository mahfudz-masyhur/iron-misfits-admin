/**
 ** Format and return date in Humanize format
 ** Intl docs: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/format
 ** Intl Constructor: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat
 * @param {String} value date to format
 * @param {Object} formatting Intl object to format with
 */

import { CSSProperties } from 'react'
import toast from 'react-hot-toast'

// ** Checks if the passed date is today
const isToday = (date: Date | string) => {
  const today = new Date()

  return (
    new Date(date).getDate() === today.getDate() &&
    new Date(date).getMonth() === today.getMonth() &&
    new Date(date).getFullYear() === today.getFullYear()
  )
}

export const formatDateToHour = (
  value: string | Date | null | undefined,
  formatting: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric'
  },
  locale = 'id'
) => {
  if (!value) return value

  return new Intl.DateTimeFormat(locale, formatting).format(new Date(value))
}

export const formatDate = (
  value: Date | null | undefined | string,
  formatting: Intl.DateTimeFormatOptions = {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  },
  locale = 'id'
) => {
  if (!value) return value

  return new Intl.DateTimeFormat(locale, formatting).format(new Date(value))
}

export const formatNumberDate = (
  value: Date | null | undefined | string,
  formatting: Intl.DateTimeFormatOptions = {
    month: 'numeric',
    day: 'numeric',
    year: 'numeric'
  },
  locale = 'id'
) => {
  if (!value) return value

  return new Intl.DateTimeFormat(locale, formatting).format(new Date(value))
}

// ** Returns short month of passed date
export const formatDateToMonthShort = (value: Date | string, toTimeForCurrentDay = true, locale = 'id-ID') => {
  const date = new Date(value)
  let formatting: Intl.DateTimeFormatOptions = {
    month: 'short',
    day: 'numeric'
  }

  if (toTimeForCurrentDay && isToday(date)) {
    formatting = { hour: 'numeric', minute: 'numeric' }
  }

  return new Intl.DateTimeFormat(locale, formatting).format(new Date(value))
}

// ? The following functions are taken from https://codesandbox.io/s/ovvwzkzry9?file=/utils.js for formatting credit card details
// Get only numbers from the input value
const clearNumber = (value = '') => {
  return value.replace(/\D+/g, '')
}

// Format credit cards according to their types
// export const formatCreditCardNumber = (
//   value: string,
//   Payment: PaymentTypes
// ) => {
//   if (!value) {
//     return value;
//   }

//   const issuer = Payment.fns.cardType(value);
//   const clearValue = clearNumber(value);
//   let nextValue;

//   switch (issuer) {
//     case 'amex':
//       nextValue = `${clearValue.slice(0, 4)} ${clearValue.slice(
//         4,
//         10
//       )} ${clearValue.slice(10, 15)}`;
//       break;
//     case 'dinersclub':
//       nextValue = `${clearValue.slice(0, 4)} ${clearValue.slice(
//         4,
//         10
//       )} ${clearValue.slice(10, 14)}`;
//       break;
//     default:
//       nextValue = `${clearValue.slice(0, 4)} ${clearValue.slice(
//         4,
//         8
//       )} ${clearValue.slice(8, 12)} ${clearValue.slice(12, 19)}`;
//       break;
//   }

//   return nextValue.trim();
// };

// Format expiration date in any credit card
export const formatExpirationDate = (value: string) => {
  const finalValue = value
    .replace(/^([1-9]\/|[2-9])$/g, '0$1/') // 3 > 03/
    .replace(/^(0[1-9]|1[0-2])$/g, '$1/') // 11 > 11/
    .replace(/^([0-1])([3-9])$/g, '0$1/$2') // 13 > 01/3
    .replace(/^(0?[1-9]|1[0-2])([0-9]{2})$/g, '$1/$2') // 141 > 01/41
    .replace(/^([0]+)\/|[0]+$/g, '0') // 0/ > 0 and 00 > 0
    // To allow only digits and `/`
    .replace(/[^\d\/]|^[\/]*$/g, '')
    .replace(/\/\//g, '/') // Prevent entering more than 1 `/`

  return finalValue
}

// Format CVC in any credit card
// export const formatCVC = (
//   value: string,
//   cardNumber: string,
//   Payment: PaymentTypes
// ) => {
//   const clearValue = clearNumber(value);
//   const issuer = Payment.fns.cardType(cardNumber);
//   const maxLength = issuer === 'amex' ? 4 : 3;

//   return clearValue.slice(0, maxLength);
// };

export const priceFormatter = (price: number) => {
  const numToSting = `${price}`.replace(/[^,\d]/g, '')
  const split = numToSting.split(',')
  const left = split[0].length % 3
  let prc = split[0].substr(0, left)
  const thousand = split[0].substr(left).match(/\d{3}/gi)

  if (price < 1e6 && thousand) return 'Rp ' + (prc += left ? '.' : '' + thousand.join('.'))

  return `Rp ${(price / 1e6 / 1).toPrecision(2).toLocaleString()} jt`
}

export const getURLParams = (obj = {}): string => {
  const params = new URLSearchParams(obj)
  for (const [key, value] of Object.entries(obj)) {
    if (Array.isArray(value)) {
      params.delete(key)
      value.forEach(v => params.append(key, v))
    }
  }

  return params.toString()
}

export const FormatListArray = (value: string[] | number[], locale?: string) => {
  let language: Intl.LocalesArgument = 'id-ID'

  if (locale === 'en') language = 'en-US'
  if (locale === 'id') language = 'id-ID'
  const stringValue = value.map((v: string | number) => `${v}`)

  return new Intl.ListFormat(language).format(stringValue)
}

export const normalPriceFormat = (value: number) => {
  const array = String(value).split('')

  return `Rp. ${array.map((char, index) => (index > 0 && index % 3 === array.length % 3 ? `.${char}` : char)).join('')}`
}

export function TrimLength(text: string, maxLength: number) {
  if (text.length > maxLength) {
    text = text.substring(0, maxLength)

    return text.substring(0, text.lastIndexOf(' ')) + '...'
  } else return text
}

export function countDate(start: Date | string, end: Date | string) {
  const diffInMs = new Date(end).valueOf() - new Date(start).valueOf()
  const days = Math.floor(diffInMs / (1000 * 60 * 60 * 24))

  if (days > 7) {
    const date = Math.floor(diffInMs / (1000 * 60 * 60 * 24 * 7))

    return date + ' ' + 'WEEKS_AGO'
  }
  if (days > 30) {
    const date = Math.floor(diffInMs / (1000 * 60 * 60 * 24 * 30))

    return date + ' ' + 'MONTH_AGO'
  }
  if (days > 365) {
    const date = Math.floor(diffInMs / (1000 * 60 * 60 * 24 * 365))

    return date + ' ' + 'YEARS_AGO'
  }

  return days + ' ' + 'DAYS_AGO'
}

export const difDate = (date1: Date | number, date2: Date | string, without = 'month') => {
  const date_1 = new Date(date1).getTime()
  const date_2 = new Date(date2).getTime()
  const diff = (date_2 - date_1) / 1000 // dirubah ke second
  let day = 0
  let hour = 0
  let minute = 0
  let second = 0
  let month = 0
  let year = 0
  second = Math.floor(diff)
  if (without === 'minute') {
    return {
      second
    }
  }
  second %= 60
  minute = Math.floor((diff - second) / 60)
  if (without === 'hour') {
    return {
      second,
      minute
    }
  }
  minute %= 60
  hour = Math.floor((diff - (second + minute * 60)) / (60 * 60))
  if (without === 'day') {
    return {
      second,
      minute,
      hour
    }
  }
  hour %= 60
  day = Math.floor((diff - (second + minute * 60 + hour * 60 * 60)) / (60 * 60 * 24))
  if (without === 'month') {
    return {
      second,
      minute,
      hour,
      day
    }
  }

  // anggap saja semua bulan itu 30 hari
  day %= 30

  month = Math.floor((diff - (second + minute * 60 + hour * 60 * 60 + day * 60 * 60 * 24)) / (60 * 60 * 24 * 30))
  if (without === 'year') {
    return {
      second,
      minute,
      hour,
      day,
      month
    }
  }
  month %= 12
  year = Math.floor(
    (diff - (second + minute * 60 + hour * 60 * 60 + day * 60 * 60 * 24 * 30)) / (60 * 60 * 24 * 30 * 12)
  )

  return {
    second,
    minute,
    hour,
    day,
    month,
    year
  }
}

export function stringToColor(string: string) {
  let hash = 0
  let i

  for (i = 0; i < string?.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash)
  }

  let color = '#'

  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff
    color += `00${value.toString(16)}`.slice(-2)
  }

  return `${color}80`
}

export function convertToNumber(formattedValue: string) {
  const numericValue = Number(formattedValue.replace(/[.,]/g, ''))

  return numericValue
}

export function formatNumber(number: string | number) {
  if (typeof number === 'number') number = String(number)

  const numericValue = Number(number.replace(/\D/g, ''))

  return !number ? '' : numericValue.toLocaleString('id-ID')
}

export function removeUndefinedProperties<T extends {} | Record<string, unknown>>(obj: T): T {
  return Object.entries(obj || {})
    .filter(([k, value]) => value !== undefined)
    .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {} as T)
}

export function undefinedEmptyStringProperties(obj: { [key: string]: any }): { [key: string]: any } {
  Object.entries(obj).forEach(([key, value]) => {
    if (typeof value === 'string' && value.trim() === '') {
      obj[key] = undefined
    }
  })

  return obj
}

export function removeEmptyStringProperties(obj: { [key: string]: any }): { [key: string]: any } {
  Object.entries(obj).forEach(([key, value]) => {
    if (typeof value === 'string' && value.trim() === '') {
      delete obj[key]
    }
  })

  return obj
}

export function getMiddleDateOfPreviousMonth(date?: Date) {
  const today = date || new Date() // get today's date
  const firstDayOfCurrentMonth = new Date(today.getFullYear(), today.getMonth(), 1)
  const firstDayOfPreviousMonth = new Date(
    firstDayOfCurrentMonth.getFullYear(),
    firstDayOfCurrentMonth.getMonth() - 1,
    1
  )
  const lastDayOfPreviousMonth = new Date(firstDayOfCurrentMonth.getTime() - 1) // set to the day before the first day of current month
  const middleDate = new Date(
    firstDayOfPreviousMonth.getTime() + (lastDayOfPreviousMonth.getTime() - firstDayOfPreviousMonth.getTime()) / 2
  )

  return middleDate.toDateString()
}

export function getMiddleDateOfNextMonth(date?: Date) {
  const today = date || new Date()
  const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1)
  const middleDate = new Date(nextMonth.getFullYear(), nextMonth.getMonth(), 15)

  return middleDate.toDateString()
}

export function displayTime(date: string | Date | null | undefined): string {
  if (!date) return 'Invalid Date'

  let parsedDate: Date
  if (typeof date === 'string') parsedDate = new Date(date)
  else parsedDate = date

  if (isNaN(parsedDate.getTime())) return 'Invalid Date'

  const hours = parsedDate.getHours().toString().padStart(2, '0')
  const minutes = parsedDate.getMinutes().toString().padStart(2, '0')
  const seconds = parsedDate.getSeconds().toString().padStart(2, '0')

  return `${hours}:${minutes}`
}

export function convertToPixelSize(value: CSSProperties['width' | 'height'] | string): number {
  // Pisahkan nilai dan satuan ukuran
  const sizeRegex = /^(\d+\.?\d*)(px|%)?$/
  const stringValue = typeof value === 'string' ? value.trim() : value ? value.toString() : ''
  const match = stringValue.match(sizeRegex)

  if (!match) {
    throw new Error('Invalid input format.')
  }

  const numberValue = parseFloat(match[1])
  const unit = match[2]

  switch (unit?.toLowerCase()) {
    case 'px':
      return numberValue
    case 'em':
      return numberValue * 16
    case '%':
      throw new Error('percent(%) cannot be converted to pixels')
    case 'pt':
      return numberValue * 1.333
    case 'pc':
      return numberValue * 16
    default:
      return numberValue
  }
}

export const bobotMutuFunction = (grade?: number) => {
  if (grade === undefined || grade === null) return 'NaN'
  if (grade >= 90 && grade <= 100) return '4.0'
  if (grade >= 80 && grade <= 89) return '3.7'
  if (grade >= 75 && grade <= 79) return '3.3'
  if (grade >= 70 && grade <= 74) return '3.0'
  if (grade >= 66 && grade <= 69) return '2.7'
  if (grade >= 61 && grade <= 65) return '2.3'
  if (grade >= 56 && grade <= 60) return '2.0'
  if (grade >= 46 && grade <= 55) return '1.0'
  return '0.0'
}

export const hurufMutuFunction = (grade?: number) => {
  if (grade === undefined || grade === null) return 'NaN'
  if (grade >= 90 && grade <= 100) return 'A'
  if (grade >= 80 && grade <= 89) return 'A-'
  if (grade >= 75 && grade <= 79) return 'B+'
  if (grade >= 70 && grade <= 74) return 'B'
  if (grade >= 66 && grade <= 69) return 'B-'
  if (grade >= 61 && grade <= 65) return 'C+'
  if (grade >= 56 && grade <= 60) return 'C'
  if (grade >= 46 && grade <= 55) return 'D'
  return 'E'
}

export function convertToRomawi(num: number): string {
  if (num <= 0 || num > 3999) {
    throw new Error('Angka harus berada di antara 1 dan 3999.')
  }

  const romanNumerals: [number, string][] = [
    [1000, 'M'],
    [900, 'CM'],
    [500, 'D'],
    [400, 'CD'],
    [100, 'C'],
    [90, 'XC'],
    [50, 'L'],
    [40, 'XL'],
    [10, 'X'],
    [9, 'IX'],
    [5, 'V'],
    [4, 'IV'],
    [1, 'I']
  ]

  let result = ''

  for (const [arabic, roman] of romanNumerals) {
    while (num >= arabic) {
      result += roman
      num -= arabic
    }
  }

  return result
}

export const getIndexGrade = (bobotMutu: string | number, sks: string | number) => {
  const formatBobot = parseFloat(`${bobotMutu}`)
  const formatSks = parseInt(`${sks}`)

  return Number((formatBobot * formatSks).toFixed(2))
}

export const coutNumArray = (array: number[]) => {
  return array.reduce(function (a, b) {
    return a + b
  }, 0)
}

export function formatPhoneNumber(v?: number|string) {
  if (!v) return ''
  // Jika v bukan string, konversi menjadi string
  const phoneNumber = typeof v === 'string' ? v : `${v}`

  if (!phoneNumber) return phoneNumber

  const num = phoneNumber.replace(/\D/g, '')

  // ... sisa kode fungsi sama seperti yang Anda berikan sebelumnya ...
  if (num.substring(0, 1) === '0') return num.length === 3 ? num.substring(1) : num
  const numLenght = num.length
  if (numLenght < 4) return num
  if (numLenght < 6) return `${num.slice(0, 2)}-${num.slice(2)}`
  if (numLenght < 9) return `${num.slice(0, 2)}-${num.slice(2, 5)}-${num.slice(5)}`
  return `${num.slice(0, 2)}-${num.slice(2, 5)}-${num.slice(5, 8)}-${num.slice(8, 19)}`
}

export function convertToNumericPhoneNumber(phoneNumber: string): number {
  // Menghilangkan semua karakter selain angka
  const num = phoneNumber.replace(/\D/g, '')

  // Mengonversi hasilnya menjadi angka
  const numericPhoneNumber = Number(num)

  return numericPhoneNumber
}

export function convertToISODate(inputDate: Date | string | null): string {
  if (!inputDate) return ''
  const dateObj = new Date(inputDate)
  const isoDate = dateObj.toISOString()
  return isoDate
}

export function formatCaseString(input: string): string {
  // if (input === input.toUpperCase()) {
  //   return input
  //     .toLowerCase()
  //     .split('_')
  //     .map(word => word.charAt(0).toUpperCase() + word.slice(1))
  //     .join(' ')
  // }

  if (/^[a-z][A-Za-z]*$/.test(input)) {
    return input.charAt(0).toUpperCase() + input.slice(1).replace(/([a-z])([A-Z])/g, '$1 $2')
  }

  if (input.includes('_') || input.includes('-')) {
    const separator = input.includes('_') ? '_' : '-'
    return input
      .split(separator)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  }

  return input
}

export function convertToTimeFormat(dateString: Date | string | null) {
  const date = new Date(dateString || '')
  const hours = date.getHours().toString().padStart(2, '0')
  const minutes = date.getMinutes().toString().padStart(2, '0')
  return `${hours}:${minutes}`
}

export function getFirstAndLastDateOfYear() {
  const today = new Date()
  const firstDayOfYear = new Date(today.getFullYear(), 0, 1)
  const lastDayOfYear = new Date(today.getFullYear(), 11, 31)

  return {
    dateStart: firstDayOfYear.toDateString(),
    dateEnd: lastDayOfYear.toDateString()
  }
}

export function convertTimeStringToDate(timeString: string) {
  if (!timeString) {
    return null // Mengembalikan null jika tidak ada nilai waktu
  }
  const [hours, minutes] = timeString.split(':')
  const currentDate = new Date() // Menggunakan tanggal hari ini

  // Mengatur jam dan menit sesuai dengan nilai dari string
  currentDate.setHours(parseInt(hours, 10))
  currentDate.setMinutes(parseInt(minutes, 10))
  currentDate.setSeconds(0)
  currentDate.setMilliseconds(0)

  return currentDate
}

export function nomorUrutTable(index: number, page: number, limit: number) {
  return index + 1 + (page - 1) * limit
}

export const toastError = (error: any) => {
  const text = error?.response?.data?.message || error?.message || error?.request?.statusText || 'Something went wrong'
  toast.error(text)
}

export const formatConvertCase = (
  str: string,
  caseType: 'kebab' | 'snake' | 'camel' | 'pascal' | 'title' | 'upper' | 'lower'
): string => {
  const words = str
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/[\s_]+/g, ' ')
    .toLowerCase()
    .split(' ')

  switch (caseType) {
    case 'kebab':
      return words.join('-')
    case 'snake':
      return words.join('_')
    case 'camel':
      return words.map((word, index) => (index === 0 ? word : word.charAt(0).toUpperCase() + word.slice(1))).join('')
    case 'pascal':
      return words.map(word => word.charAt(0).toUpperCase() + word.slice(1)).join('')
    case 'title':
      return words.map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
    case 'upper':
      return str.toUpperCase()
    case 'lower':
      return str.toLowerCase()
    default:
      return str
  }
}

export function isWithinOneDay(dateString: string): boolean {
  const givenDate = new Date(dateString)
  const currentDate = new Date()
  if (isNaN(givenDate.getTime())) return false
  const timeDifference = currentDate.getTime() - givenDate.getTime()
  const dayDifference = timeDifference / (1000 * 3600 * 24)

  return dayDifference <= 1
}
