import React, { memo, useEffect, useState } from 'react'
import { CheckBox, FormGroup, FormMessage } from '@adminjs/design-system'

import { EditPropertyProps } from '../base-property-props'
import { recordPropertyIsEqual } from '../record-property-is-equal'
import { PropertyLabel } from '../utils/property-label'
import allowOverride from '../../../hoc/allow-override'
import { ErrorMessage } from '../../../interfaces'

const parseValue = (value): boolean => !(!value || value === 'false')

const Edit: React.FC<EditPropertyProps> = (props) => {
  const { property, onChange, record } = props
  const value = parseValue(record.params && record.params[property.path])

  const [error, setError] = useState<ErrorMessage>()
  useEffect(() => {
    setError(record.errors?.[property.path])
  }, [record.errors?.[property.path]])

  const handleChange = (): void => {
    if (!property.isDisabled) {
      setError(undefined)
      onChange(property.path, !value)
    }
  }

  return (
    <FormGroup error={!!error}>
      <CheckBox
        id={property.path}
        name={property.path}
        onChange={handleChange}
        checked={value}
        disabled={property.isDisabled}
        {...property.props}
      />
      <PropertyLabel property={property} props={{ inline: true }} />
      <FormMessage>{error && error.message}</FormMessage>
    </FormGroup>
  )
}

export default allowOverride(memo(Edit, recordPropertyIsEqual), 'DefaultBooleanEditProperty')
