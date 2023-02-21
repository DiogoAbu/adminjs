import React from 'react'
import { FormGroup, Label, DatePicker } from '@adminjs/design-system'

import * as BackendFilter from '../../../../backend/utils/filter/filter'
import { useTranslation } from '../../../hooks/use-translation'
import { FilterPropertyProps } from '../base-property-props'
import allowOverride from '../../../hoc/allow-override'
import { locales } from '../../../../locale'

const { PARAM_SEPARATOR } = BackendFilter

const Filter: React.FC<FilterPropertyProps> = (props) => {
  const { property, filter, onChange } = props
  const { i18n, translateProperty, translateLabel } = useTranslation()

  const {
    dateFormat,
    placeholderText,
    inputMask,
  } = locales[i18n.language].format[property.type === 'datetime' ? 'datetime' : 'date']

  const fromKey = `${property.path}${PARAM_SEPARATOR}from`
  const toKey = `${property.path}${PARAM_SEPARATOR}to`
  const fromValue = filter[fromKey]
  const toValue = filter[toKey]

  return (
    <FormGroup variant="filter">
      <Label>{property.label}</Label>
      <Label>{`- ${translateProperty('from')}: `}</Label>
      <DatePicker
        value={fromValue}
        onChange={(date) => onChange(fromKey, date)}
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
        {...property.props}
      />
      <Label mt="default">{`- ${translateProperty('to')}: `}</Label>
      <DatePicker
        value={toValue}
        onChange={(date) => onChange(toKey, date)}
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
        {...property.props}
      />
    </FormGroup>
  )
}

export default allowOverride(Filter, 'DefaultDatetimeFilterProperty')
