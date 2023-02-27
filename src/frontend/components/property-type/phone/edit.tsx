import { PhoneInput, PhoneInputProps, FormGroup, FormMessage } from '@adminjs/design-system'
import React, { FC, memo, useEffect, useState } from 'react'

import { EditPropertyProps } from '../base-property-props'
import { recordPropertyIsEqual } from '../record-property-is-equal'
import { PropertyLabel } from '../utils/property-label'
import allowOverride from '../../../hoc/allow-override'
import { useTranslation } from '../../../hooks'
import { ErrorMessage } from '../../../interfaces'

const Edit: FC<EditPropertyProps> = (props) => {
  const { onChange, property, record, resource } = props

  const { translateLabel, translateMessage } = useTranslation()

  const propValue = record.params?.[property.path] ?? ''
  const [value, setValue] = useState(propValue)

  const [error, setError] = useState<ErrorMessage>()
  useEffect(() => {
    setError(record.errors?.[property.path])
  }, [record.errors?.[property.path]])

  const handleBlur = () => {
    setError(undefined)
    onChange(property.path, value)
  }

  useEffect(() => {
    if (value !== propValue) {
      setValue(propValue)
    }
  }, [propValue])

  return (
    <FormGroup error={!!error}>
      <PropertyLabel property={property} />
      <PhoneInput
        id={property.path}
        inputProps={{
          name: property.path,
          required: property.isRequired,
        }}
        searchPlaceholder={translateLabel('search', resource.id)}
        searchNotFound={translateMessage('noCountryFound', resource.id)}
        onChange={setValue}
        onBlur={handleBlur}
        value={value}
        {...property.props as PhoneInputProps}
      />
      <FormMessage>{error && error.message}</FormMessage>
    </FormGroup>
  )
}

export default allowOverride(memo(Edit, recordPropertyIsEqual), 'DefaultPhoneEditProperty')
