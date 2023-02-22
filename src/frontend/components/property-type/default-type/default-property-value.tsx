import React from 'react'
import { Badge } from '@adminjs/design-system'

import allowOverride from '../../../hoc/allow-override'
import { useTranslation } from '../../../hooks'
import { ShowPropertyProps } from '../base-property-props'

const DefaultPropertyValue: React.FC<ShowPropertyProps> = (props) => {
  const { property, record, resource } = props

  const { translateLabel } = useTranslation()

  const rawValue = record?.params[property.path]

  if (typeof rawValue === 'undefined') {
    return null
  }

  if (property.availableValues) {
    const option = property.availableValues.find((opt) => opt.value === rawValue)

    if (!option) {
      return rawValue
    }

    return (
      <Badge>{option?.label ? translateLabel(option.label, resource.id) : rawValue}</Badge>
    )
  }

  return rawValue
}

export default allowOverride(DefaultPropertyValue, 'DefaultPropertyValue')
