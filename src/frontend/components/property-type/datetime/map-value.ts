import { merge } from 'lodash'
import { PropertyType } from '../../../../backend/adapters/property/base-property'

const defaultOptions: Intl.DateTimeFormatOptions = {
  dateStyle: 'short',
  timeStyle: 'medium',
}

export default (
  value: Date,
  type: PropertyType,
  intlOptions?: (
    (propertyType: PropertyType) => Intl.DateTimeFormatOptions
  ) | Intl.DateTimeFormatOptions,
): string => {
  if (!value) {
    return ''
  }
  const date = new Date(typeof value === 'string' && isNumbersOnly(value) ? Number(value) : value)
  if (date) {
    const options = merge({}, defaultOptions, typeof intlOptions === 'function' ? intlOptions(type) : intlOptions)
    const formatter = new Intl.DateTimeFormat(undefined, options)
    return formatter.format(date)
  }
  return ''
}

function isNumbersOnly(str: string): boolean {
  return /^\d+$/.test(str)
}
