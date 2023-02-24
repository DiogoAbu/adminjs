import { PhoneInput, PhoneInputProps, FormGroup } from '@adminjs/design-system'
import React, { FC, useCallback } from 'react'

import { FilterPropertyProps } from '../base-property-props'
import { PropertyLabel } from '../utils/property-label'
import allowOverride from '../../../hoc/allow-override'
import { useTranslation } from '../../../hooks'

const Filter: FC<FilterPropertyProps> = (props) => {
  const { onChange, property, filter, resource } = props

  const { translateLabel, translateMessage } = useTranslation()

  const handleChange = useCallback((value) => {
    onChange(property.path, value)
  }, [])

  return (
    <FormGroup variant="filter">
      <PropertyLabel property={property} />
      <PhoneInput
        id={property.path}
        inputProps={{
          name: `filter-${property.path}`,
        }}
        searchPlaceholder={translateLabel('search', resource.id)}
        searchNotFound={translateMessage('noCountryFound', resource.id)}
        onChange={handleChange}
        value={filter[property.path]}
        {...property.props as PhoneInputProps}
      />
    </FormGroup>
  )
}

export default allowOverride(Filter, 'DefaultPhoneFilterProperty')
