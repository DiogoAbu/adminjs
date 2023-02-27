import React, { memo, useEffect, useState } from 'react'
import { DatePicker, FormGroup, FormMessage } from '@adminjs/design-system'

import { locales } from '../../../../locale'
import { EditPropertyProps } from '../base-property-props'
import { recordPropertyIsEqual } from '../record-property-is-equal'
import { PropertyLabel } from '../utils/property-label'
import allowOverride from '../../../hoc/allow-override'
import { useTranslation } from '../../../hooks'
import { ErrorMessage } from '../../../interfaces'

const Edit: React.FC<EditPropertyProps> = (props) => {
  const { property, onChange, record } = props
  const value = (record.params && record.params[property.path]) || ''

  const [error, setError] = useState<ErrorMessage>()
  useEffect(() => {
    setError(record.errors?.[property.path])
  }, [record.errors?.[property.path]])

  const handleChange = (date: string|null): void => {
    setError(undefined)
    onChange(property.path, date)
  }

  const { i18n, translateLabel } = useTranslation()

  const {
    dateFormat,
    placeholderText,
    inputMask,
  } = locales[i18n.language].format[property.type === 'datetime' ? 'datetime' : 'date']

  return (
    <FormGroup error={!!error}>
      <PropertyLabel property={property} />
      <DatePicker
        value={value}
        disabled={property.isDisabled}
        onChange={handleChange}
        propertyType={property.type}
        dateFormat={dateFormat}
        placeholderText={placeholderText}
        // @ts-ignore
        inputMask={inputMask}
        locale={i18n.language}
        timeInputLabel={translateLabel('time')}
        timeCaption={translateLabel('time')}
        previousMonthAriaLabel={translateLabel('previousMonth')}
        previousMonthButtonLabel={translateLabel('previousMonth')}
        nextMonthAriaLabel={translateLabel('nextMonth')}
        nextMonthButtonLabel={translateLabel('nextMonth')}
        previousYearAriaLabel={translateLabel('previousYear')}
        previousYearButtonLabel={translateLabel('previousYear')}
        nextYearAriaLabel={translateLabel('nextYear')}
        nextYearButtonLabel={translateLabel('nextYear')}
        required={property.isRequired}
        {...property.props}
      />
      <FormMessage>{error && error.message}</FormMessage>
    </FormGroup>
  )
}

export default allowOverride(memo(Edit, recordPropertyIsEqual), 'DefaultDatetimeEditProperty')
