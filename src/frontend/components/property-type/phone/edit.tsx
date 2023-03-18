import { PhoneInput, PhoneInputProps, FormGroup, FormMessage } from '@adminjs/design-system'
import React, { FC, memo, useEffect, useState } from 'react'

import { EditPropertyProps } from '../base-property-props'
import { recordPropertyIsEqual } from '../record-property-is-equal'
import { PropertyLabel, isPhoneValid } from '../utils'
import allowOverride from '../../../hoc/allow-override'
import { useTranslation } from '../../../hooks'
import { ErrorMessage } from '../../../interfaces'

const Edit: FC<EditPropertyProps> = (props) => {
  const { onChange, property, record, resource } = props

  const { tl, tm } = useTranslation()

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
        searchPlaceholder={tl('search', resource.id)}
        searchNotFound={tm('noCountryFound', resource.id)}
        onChange={setValue}
        onBlur={handleBlur}
        value={value}
        isValid={(phone) => (property.isRequired || phone ? isPhoneValid(phone) : true)}
        {...property.props as PhoneInputProps}
      />
      <FormMessage>{error && tm(error.message, error.resourceId || '', error.options)}</FormMessage>
    </FormGroup>
  )
}

export default allowOverride(memo(Edit, recordPropertyIsEqual), 'DefaultPhoneEditProperty')
