import React from 'react'
import { FormGroup, Input, Select } from '@adminjs/design-system'

import allowOverride from '../../../hoc/allow-override'
import { useTranslation } from '../../../hooks'
import { FilterPropertyProps } from '../base-property-props'
import { PropertyLabel } from '../utils/property-label'

const Filter: React.FC<FilterPropertyProps> = (props) => {
  const { property, onChange, filter, resource } = props

  const { translateLabel, translateProperty } = useTranslation()

  const handleInputChange = (event) => {
    onChange(property.path, event.target.value)
  }

  const handleSelectChange = (selected) => {
    const value = selected ? selected.value : ''
    onChange(property.path, value)
  }

  const renderInput = () => {
    const filterKey = `filter-${property.path}`
    const value = filter[property.path] || ''

    if (property.availableValues) {
      const selected = property.availableValues.find((av) => av.value === value)
      if (selected) {
        selected.label = selected.label
          ? translateLabel(selected.label, resource.id, { defaultValue: selected.label })
          : translateProperty(`${property.path}.${selected.value}`, resource.id, { defaultValue: selected.value })
      }

      const options = property.availableValues.map((option) => ({
        ...option,
        label: option.label
          ? translateLabel(option.label, resource.id, { defaultValue: option.label })
          : translateProperty(`${property.path}.${option.value}`, resource.id, { defaultValue: option.value }),
      }))

      return (
        <Select
          variant="filter"
          value={typeof selected === 'undefined' ? '' : selected}
          isClearable
          options={options}
          onChange={handleSelectChange}
          placeholder={translateLabel('select...', resource.id)}
        />
      )
    }
    return (
      <Input
        name={filterKey}
        onChange={handleInputChange}
        value={value}
      />
    )
  }

  return (
    <FormGroup variant="filter">
      <PropertyLabel property={property} props={{ required: false }} />
      {renderInput()}
    </FormGroup>
  )
}

export default allowOverride(Filter, 'DefaultFilterProperty')
