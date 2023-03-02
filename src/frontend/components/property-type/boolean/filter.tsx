import React from 'react'
import { FormGroup, Select } from '@adminjs/design-system'

import mapValue from './map-value'
import { FilterPropertyProps } from '../base-property-props'
import allowOverride from '../../../hoc/allow-override'
import { useTranslation } from '../../../hooks'
import { PropertyLabel } from '../utils/property-label'

const boolValue = (s: string): boolean => {
  if (/true/i.test(s)) {
    return true
  }
  return false
}

const Filter: React.FC<FilterPropertyProps> = (props) => {
  const { resource, property, filter = {}, onChange } = props
  const { translateProperty, translateLabel } = useTranslation()

  const value = typeof filter[property.path] === 'undefined' ? '' : boolValue(filter[property.path])
  const options = [
    { value: true, label: translateProperty(`${property.path}.true`, resource.id, { defaultValue: mapValue(true) }) },
    { value: false, label: translateProperty(`${property.path}.false`, resource.id, { defaultValue: mapValue(false) }) },
  ]
  const selected = options.find((o) => o.value === value)
  const handleChange = (s) => {
    const newValue = s ? s.value : undefined
    onChange(property.path, newValue)
  }

  return (
    <FormGroup variant="filter">
      <PropertyLabel property={property} props={{ required: false }} />
      <Select
        value={typeof selected === 'undefined' ? '' : selected}
        isClearable
        options={options}
        onChange={handleChange}
        placeholder={translateLabel('select...', resource.id)}
      />
    </FormGroup>
  )
}

export default allowOverride(Filter, 'DefaultBooleanFilterProperty')
