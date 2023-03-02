/* eslint-disable @typescript-eslint/explicit-function-return-type */
import React, { FC, useState, memo, useEffect } from 'react'
import { Input, FormMessage, FormGroup, Select } from '@adminjs/design-system'

import { EditPropertyProps } from '../base-property-props'
import { recordPropertyIsEqual } from '../record-property-is-equal'
import { PropertyLabel } from '../utils/property-label'
import allowOverride from '../../../hoc/allow-override'
import { useTranslation } from '../../../hooks'
import { ErrorMessage } from '../../../interfaces'

type CombinedProps = EditPropertyProps

const Edit: FC<CombinedProps> = (props) => {
  const { property, record } = props

  const [error, setError] = useState<ErrorMessage>()
  useEffect(() => {
    setError(record.errors?.[property.path])
  }, [record.errors?.[property.path]])

  return (
    <FormGroup error={!!error}>
      <PropertyLabel property={property} />
      {property.availableValues ? (
        <SelectEdit {...props} setError={setError} />
      ) : (
        <TextEdit {...props} setError={setError} />
      )}
      <FormMessage>{error && error.message}</FormMessage>
    </FormGroup>
  )
}

const SelectEdit: FC<CombinedProps & {
  setError: React.Dispatch<React.SetStateAction<ErrorMessage | undefined>>
}> = (props) => {
  const { record, property, onChange, resource, setError } = props

  const { translateLabel, translateProperty } = useTranslation()

  const handleChange = (s) => {
    setError(undefined)
    onChange(property.path, s?.value ?? '')
  }

  if (!property.availableValues) {
    return null
  }
  const propValue = record.params?.[property.path] ?? ''
  const selected = property.availableValues.find((av) => av.value === propValue)
  const options = property.availableValues.map((option) => ({
    ...option,
    label: option.label
      ? translateLabel(option.label, resource.id, { defaultValue: option.label })
      : translateProperty(`${property.path}.${option.value}`, resource.id, { defaultValue: option.value }),
  }))

  return (
    <Select
      value={selected}
      options={options}
      onChange={handleChange}
      isDisabled={property.isDisabled}
      placeholder={translateLabel('select...', resource.id)}
      // @ts-ignore
      required={property.isRequired}
      {...property.props}
    />
  )
}

const TextEdit: FC<CombinedProps & {
  setError: React.Dispatch<React.SetStateAction<ErrorMessage | undefined>>
}> = (props) => {
  const { property, record, onChange, setError } = props
  const propValue = record.params?.[property.path] ?? ''
  const [value, setValue] = useState(propValue)

  const handleChange = () => {
    setError(undefined)
    onChange(property.path, value)
  }

  useEffect(() => {
    if (value !== propValue) {
      setValue(propValue)
    }
  }, [propValue])

  return (
    <Input
      id={property.path}
      name={property.path}
      required={property.isRequired}
      onChange={(e) => setValue(e.target.value)}
      onBlur={handleChange}
      // handle clicking ENTER
      onKeyDown={(e) => e.keyCode === 13 && handleChange()}
      value={value}
      disabled={property.isDisabled}
      {...property.props}
    />
  )
}

export default allowOverride(memo(Edit, recordPropertyIsEqual), 'DefaultEditProperty')
