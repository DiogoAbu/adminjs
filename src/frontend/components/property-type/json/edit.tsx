/* eslint-disable @typescript-eslint/explicit-function-return-type */
import React, { memo, useState, FC, useEffect } from 'react'
import { Input, FormGroup, FormMessage } from '@adminjs/design-system'

import { EditPropertyProps } from '../base-property-props'
import { recordPropertyIsEqual } from '../record-property-is-equal'
import { PropertyLabel } from '../utils/property-label'
import { ErrorMessage } from '../../../interfaces'
import { useTranslation } from '../../../hooks'

const Edit: FC<EditPropertyProps> = (props) => {
  const { onChange, property, record, resource } = props
  const propValue = JSON.stringify(record.params?.[property.path] ?? {}, null, 2)
  const [value, setValue] = useState(propValue)

  const { tm } = useTranslation()

  const [error, setError] = useState<ErrorMessage>()
  useEffect(() => {
    setError(record.errors?.[property.path])
  }, [record.errors?.[property.path]])

  const handleBlur = () => {
    try {
      const json = JSON.parse(value)
      onChange(property.path, json)
      setError(undefined)
    } catch (err) {
      setError({ message: tm('invalidJSON', resource.id), type: 'ValidationError' })
    }
  }

  useEffect(() => {
    if (value !== propValue) {
      setValue(propValue)
    }
  }, [propValue])

  return (
    <FormGroup error={Boolean(error)}>
      <PropertyLabel property={property} />
      <Input
        as="textarea"
        rows={(value.match(/\n/g) || []).length + 1}
        id={property.path}
        name={property.path}
        onChange={(e) => setValue(e.target.value)}
        onBlur={handleBlur}
        value={value}
        disabled={property.isDisabled}
        required={property.isRequired}
        {...property.props}
      />
      <FormMessage>{error && error.message}</FormMessage>
    </FormGroup>
  )
}

export default memo(Edit, recordPropertyIsEqual)
