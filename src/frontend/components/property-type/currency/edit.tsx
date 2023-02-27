import { CurrencyInputProps, FormGroup, FormMessage } from '@adminjs/design-system'
import React, { FC, memo, useEffect, useState } from 'react'
import { EditPropertyProps } from '../base-property-props'
import { recordPropertyIsEqual } from '../record-property-is-equal'
import { PropertyLabel } from '../utils/property-label'
import allowOverride from '../../../hoc/allow-override'
import { CurrencyInputWrapper } from './currency-input-wrapper'
import { ErrorMessage } from '../../../interfaces'

const Edit: FC<EditPropertyProps> = (props) => {
  const { onChange, property, record } = props
  const propValue = record.params?.[property.path] ?? ''

  const [error, setError] = useState<ErrorMessage>()
  useEffect(() => {
    setError(record.errors?.[property.path])
  }, [record.errors?.[property.path]])

  const handleChange = (value?: string): void => {
    setError(undefined)
    onChange(property.path, value)
  }

  return (
    <FormGroup error={!!error}>
      <PropertyLabel property={property} />
      <CurrencyInputWrapper
        id={property.path}
        initial={propValue}
        options={{ ...property.props, required: property.isRequired } as CurrencyInputProps}
        onChange={handleChange}
      />
      <FormMessage>{error && error.message}</FormMessage>
    </FormGroup>
  )
}

export default allowOverride(memo(Edit, recordPropertyIsEqual), 'DefaultCurrencyEditProperty')
