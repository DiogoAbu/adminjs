import React from 'react'
import { PhoneNumberUtil, PhoneNumberFormat } from 'google-libphonenumber'

import allowOverride from '../../../hoc/allow-override'
import { ShowPropertyProps } from '../base-property-props'

const phoneUtil = PhoneNumberUtil.getInstance()

const PhonePropertyValue: React.FC<ShowPropertyProps> = (props) => {
  const { property, record } = props

  const rawValue = record?.params[property.path]

  if (typeof rawValue === 'undefined') {
    return null
  }

  try {
    const phoneNumber = phoneUtil.parse(rawValue)
    return phoneUtil.format(phoneNumber, PhoneNumberFormat.INTERNATIONAL)
  } catch {
    return rawValue
  }
}

export default allowOverride(PhonePropertyValue, 'PhonePropertyValue')
